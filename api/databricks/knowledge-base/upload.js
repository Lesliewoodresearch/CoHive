/**
 * Knowledge Base Upload API
 *
 * Handles uploading files to Databricks Unity Catalog Volume.
 * Brand, projectType, and scope are now optional at upload time —
 * they are assigned during the processing step.
 *
 * Location: api/databricks/knowledge-base/upload.js
 */

import { getDatabricksConfig } from '../../utils/validateEnv.js';
import { logFileEvent, logError } from '../../utils/logger.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // ── Mock Mode Detection ────────────────────────────────────────────────
    const isMockMode = !process.env.DATABRICKS_HOST ||
                       !process.env.DATABRICKS_TOKEN ||
                       process.env.VITE_MOCK_MODE === 'true';

    if (isMockMode) {
      console.log('[Mock Mode] Knowledge Base upload - bypassing Databricks');
      const { fileName } = req.body;
      const fileId = 'mock-kb-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      const filePath = '/mock/volumes/knowledge_base/cohive/files/unassigned/' + fileName;
      return res.status(200).json({
        success: true,
        fileId,
        filePath,
        message: 'Mock upload successful (no real Databricks connection)',
      });
    }

    const { workspaceHost, accessToken, warehouseId, schema } = getDatabricksConfig();

    const {
      fileName,
      fileContent,        // Base64 encoded
      fileSize,
      scope,              // optional — defaults to 'general' if not provided
      category,           // optional
      brand,              // optional — assigned during processing
      projectType,        // optional — assigned during processing
      fileType,
      tags = [],
      contentSummary,
      insightType,
      inputMethod,
      cleaningStatus = 'uncleaned',  // default to uncleaned since brand/project not set yet
      allowUncleaned = true,
      userEmail,
      userRole,
    } = req.body;

    // Only truly required fields at upload time
    if (!fileName || !fileContent || !fileType || !userEmail) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['fileName', 'fileContent', 'fileType', 'userEmail'],
      });
    }

    const fileId = 'kb-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const baseVolumePath = '/Volumes/knowledge_base/' + schema + '/files';

    // Determine storage path
    let filePath;
    if (!brand && !scope) {
      // No brand or scope — store in unassigned for later processing
      filePath = baseVolumePath + '/unassigned/' + sanitizedFileName;
    } else if (cleaningStatus === 'uncleaned') {
      filePath = baseVolumePath + '/uncleaned/' + sanitizedFileName;
    } else {
      const effectiveScope = scope || 'general';
      switch (effectiveScope) {
        case 'general':
          filePath = baseVolumePath + '/general/' + sanitizedFileName;
          break;
        case 'category': {
          const catFolder = category ? category.toLowerCase().replace(/\s+/g, '-') : 'unknown';
          filePath = baseVolumePath + '/category/' + catFolder + '/' + sanitizedFileName;
          break;
        }
        case 'brand': {
          const brandFolder = brand ? brand.toLowerCase().replace(/[^a-z0-9-]/g, '-') : 'unassigned';
          filePath = baseVolumePath + '/brand/' + brandFolder + '/' + sanitizedFileName;
          break;
        }
        default:
          filePath = baseVolumePath + '/unassigned/' + sanitizedFileName;
      }
    }

    console.log('[KB Upload] User: ' + userEmail + ' (' + userRole + ')');
    console.log('[KB Upload] File: ' + fileName + ' (' + fileSize + ' bytes)');
    console.log('[KB Upload] Brand: ' + (brand || 'unassigned') + ', Scope: ' + (scope || 'unassigned'));
    console.log('[KB Upload] Path: ' + filePath);

    // Step 1: Upload file to Unity Catalog Volume
    const uploadResponse = await fetch(
      'https://' + workspaceHost + '/api/2.0/fs/files' + filePath,
      {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'application/octet-stream',
        },
        body: Buffer.from(fileContent, 'base64'),
      }
    );

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('[KB Upload] File upload failed:', errorText);
      throw new Error('File upload failed: ' + uploadResponse.statusText);
    }

    console.log('[KB Upload] File uploaded to volume');

    // Step 2: Insert metadata — brand/projectType may be null, filled in at process time
    const effectiveScope = scope || 'general';
    const finalTags = tags.length > 0 ? tags : ['unprocessed'];
    const finalTagsArray = 'ARRAY(' + finalTags.map(t => "'" + t.replace(/'/g, "''") + "'").join(', ') + ')';

    // cleaning_status set explicitly so filter logic doesn't rely on contentSummary fallback
    const effectiveCleaningStatus = contentSummary ? 'processed' : (cleaningStatus || 'uncleaned');

    const insertSQL =
      'INSERT INTO knowledge_base.' + schema + '.file_metadata (' +
      'file_id, file_path, file_name, scope, category, brand, project_type, ' +
      'file_type, is_approved, upload_date, uploaded_by, tags, ' +
      'citation_count, gem_inclusion_count, file_size_bytes, ' +
      'content_summary, insight_type, input_method, created_at, updated_at, cleaning_status' +
      ') VALUES (' +
      "'" + fileId + "', " +
      "'" + filePath + "', " +
      "'" + fileName.replace(/'/g, "''") + "', " +
      "'" + effectiveScope + "', " +
      (category ? "'" + category.replace(/'/g, "''") + "'" : 'NULL') + ', ' +
      (brand ? "'" + brand.replace(/'/g, "''") + "'" : 'NULL') + ', ' +
      (projectType ? "'" + projectType.replace(/'/g, "''") + "'" : 'NULL') + ', ' +
      "'" + fileType + "', " +
      'FALSE, ' +
      'CURRENT_TIMESTAMP(), ' +
      "'" + userEmail.replace(/'/g, "''") + "', " +
      finalTagsArray + ', ' +
      '0, 0, ' + (fileSize || 0) + ', ' +
      (contentSummary ? "'" + contentSummary.replace(/'/g, "''") + "'" : 'NULL') + ', ' +
      (insightType ? "'" + insightType.replace(/'/g, "''") + "'" : 'NULL') + ', ' +
      (inputMethod ? "'" + inputMethod.replace(/'/g, "''") + "'" : 'NULL') + ', ' +
      "CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), '" + effectiveCleaningStatus + "')";

    const sqlResponse = await fetch(
      'https://' + workspaceHost + '/api/2.0/sql/statements',
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ warehouse_id: warehouseId, statement: insertSQL, wait_timeout: '30s' }),
      }
    );

    if (!sqlResponse.ok) {
      const errorData = await sqlResponse.json();
      throw new Error('Metadata insert failed: ' + (errorData.message || sqlResponse.statusText));
    }

    console.log('[KB Upload] Metadata inserted successfully');
    logFileEvent({
      eventType: 'file_uploaded',
      userEmail,
      brand: brand || 'unassigned',
      fileName,
      fileId,
      details: { scope: effectiveScope, fileType, cleaningStatus },
    });

    return res.status(200).json({
      success: true,
      fileId,
      filePath,
      message: 'File uploaded successfully. Ready for processing.',
    });

  } catch (error) {
    console.error('[KB Upload] Error:', error);
    logError({
      userEmail: req.body?.userEmail,
      brand: req.body?.brand,
      error,
      context: { fileName: req.body?.fileName, operation: 'upload' },
    });
    return res.status(500).json({ error: 'Upload failed', message: error.message });
  }
}
/**
 * Knowledge Base Upload API
 *
 * Handles uploading files to Databricks Unity Catalog Volume.
 * Brand, projectType, and scope are now optional at upload time —
 * they are assigned during the processing step.
 *
 * Location: api/databricks/knowledge-base/upload.js
 */

import { getDatabricksConfig } from '../../utils/validateEnv.js';
import { logFileEvent, logError } from '../../utils/logger.js';

/**
 * Vercel serverless function config.
 * Increases the body parser limit from the default 4.5MB to 50MB so that
 * large files (PDFs, Word docs, audio) can be uploaded as base64 without
 * hitting a 413 Payload Too Large error.
 *
 * Base64 encoding inflates file size by ~33%, so a 35MB file becomes ~47MB
 * as base64. The 50MB limit accommodates files up to ~37MB pre-encoding.
 * For larger files a multipart/streaming approach should be used instead.
 */
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // ── Mock Mode Detection ────────────────────────────────────────────────
    const isMockMode = !process.env.DATABRICKS_HOST ||
                       !process.env.DATABRICKS_TOKEN ||
                       process.env.VITE_MOCK_MODE === 'true';

    if (isMockMode) {
      console.log('[Mock Mode] Knowledge Base upload - bypassing Databricks');
      const { fileName } = req.body;
      const fileId = 'mock-kb-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      const filePath = '/mock/volumes/knowledge_base/cohive/files/unassigned/' + fileName;
      return res.status(200).json({
        success: true,
        fileId,
        filePath,
        message: 'Mock upload successful (no real Databricks connection)',
      });
    }

    const { workspaceHost, accessToken, warehouseId, schema } = getDatabricksConfig();

    const {
      fileName,
      fileContent,        // Base64 encoded
      fileSize,
      scope,              // optional — defaults to 'general' if not provided
      category,           // optional
      brand,              // optional — assigned during processing
      projectType,        // optional — assigned during processing
      fileType,
      tags = [],
      contentSummary,
      insightType,
      inputMethod,
      cleaningStatus = 'uncleaned',  // default to uncleaned since brand/project not set yet
      allowUncleaned = true,
      userEmail,
      userRole,
    } = req.body;

    // Only truly required fields at upload time
    if (!fileName || !fileContent || !fileType || !userEmail) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['fileName', 'fileContent', 'fileType', 'userEmail'],
      });
    }

    // ── File size guard ────────────────────────────────────────────────────────
    // Base64 is ~33% larger than the original binary.
    // The 50MB body limit accommodates originals up to ~37MB.
    // Warn clearly rather than letting Databricks fail with a cryptic error.
    const base64Content = fileContent.includes(',')
      ? fileContent.split(',')[1]
      : fileContent;
    const estimatedBytes = Math.ceil(base64Content.length * 0.75);
    const MAX_FILE_BYTES = 37 * 1024 * 1024; // 37MB pre-encoding

    if (estimatedBytes > MAX_FILE_BYTES) {
      const sizeMB = (estimatedBytes / (1024 * 1024)).toFixed(1);
      console.warn(`[KB Upload] File too large: ${sizeMB}MB (limit 37MB) — ${fileName}`);
      return res.status(413).json({
        error: 'File too large',
        message: `File is approximately ${sizeMB}MB. Maximum supported size is 37MB. For larger files, please split the document or contact your administrator.`,
        fileSizeMB: parseFloat(sizeMB),
        maxSizeMB: 37,
      });
    }

    const fileId = 'kb-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const baseVolumePath = '/Volumes/knowledge_base/' + schema + '/files';

    // Determine storage path
    let filePath;
    if (!brand && !scope) {
      // No brand or scope — store in unassigned for later processing
      filePath = baseVolumePath + '/unassigned/' + sanitizedFileName;
    } else if (cleaningStatus === 'uncleaned') {
      filePath = baseVolumePath + '/uncleaned/' + sanitizedFileName;
    } else {
      const effectiveScope = scope || 'general';
      switch (effectiveScope) {
        case 'general':
          filePath = baseVolumePath + '/general/' + sanitizedFileName;
          break;
        case 'category': {
          const catFolder = category ? category.toLowerCase().replace(/\s+/g, '-') : 'unknown';
          filePath = baseVolumePath + '/category/' + catFolder + '/' + sanitizedFileName;
          break;
        }
        case 'brand': {
          const brandFolder = brand ? brand.toLowerCase().replace(/[^a-z0-9-]/g, '-') : 'unassigned';
          filePath = baseVolumePath + '/brand/' + brandFolder + '/' + sanitizedFileName;
          break;
        }
        default:
          filePath = baseVolumePath + '/unassigned/' + sanitizedFileName;
      }
    }

    console.log('[KB Upload] User: ' + userEmail + ' (' + userRole + ')');
    console.log('[KB Upload] File: ' + fileName + ' (' + fileSize + ' bytes)');
    console.log('[KB Upload] Brand: ' + (brand || 'unassigned') + ', Scope: ' + (scope || 'unassigned'));
    console.log('[KB Upload] Path: ' + filePath);

    // Step 1: Upload file to Unity Catalog Volume
    const uploadResponse = await fetch(
      'https://' + workspaceHost + '/api/2.0/fs/files' + filePath,
      {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'application/octet-stream',
        },
        body: Buffer.from(fileContent, 'base64'),
      }
    );

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('[KB Upload] File upload failed:', errorText);
      throw new Error('File upload failed: ' + uploadResponse.statusText);
    }

    console.log('[KB Upload] File uploaded to volume');

    // Step 2: Insert metadata — brand/projectType may be null, filled in at process time
    const effectiveScope = scope || 'general';
    const finalTags = tags.length > 0 ? tags : ['unprocessed'];
    const finalTagsArray = 'ARRAY(' + finalTags.map(t => "'" + t.replace(/'/g, "''") + "'").join(', ') + ')';

    // cleaning_status set explicitly so filter logic doesn't rely on contentSummary fallback
    const effectiveCleaningStatus = contentSummary ? 'processed' : (cleaningStatus || 'uncleaned');

    const insertSQL =
      'INSERT INTO knowledge_base.' + schema + '.file_metadata (' +
      'file_id, file_path, file_name, scope, category, brand, project_type, ' +
      'file_type, is_approved, upload_date, uploaded_by, tags, ' +
      'citation_count, gem_inclusion_count, file_size_bytes, ' +
      'content_summary, insight_type, input_method, created_at, updated_at, cleaning_status' +
      ') VALUES (' +
      "'" + fileId + "', " +
      "'" + filePath + "', " +
      "'" + fileName.replace(/'/g, "''") + "', " +
      "'" + effectiveScope + "', " +
      (category ? "'" + category.replace(/'/g, "''") + "'" : 'NULL') + ', ' +
      (brand ? "'" + brand.replace(/'/g, "''") + "'" : 'NULL') + ', ' +
      (projectType ? "'" + projectType.replace(/'/g, "''") + "'" : 'NULL') + ', ' +
      "'" + fileType + "', " +
      'FALSE, ' +
      'CURRENT_TIMESTAMP(), ' +
      "'" + userEmail.replace(/'/g, "''") + "', " +
      finalTagsArray + ', ' +
      '0, 0, ' + (fileSize || 0) + ', ' +
      (contentSummary ? "'" + contentSummary.replace(/'/g, "''") + "'" : 'NULL') + ', ' +
      (insightType ? "'" + insightType.replace(/'/g, "''") + "'" : 'NULL') + ', ' +
      (inputMethod ? "'" + inputMethod.replace(/'/g, "''") + "'" : 'NULL') + ', ' +
      "CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), '" + effectiveCleaningStatus + "')";

    const sqlResponse = await fetch(
      'https://' + workspaceHost + '/api/2.0/sql/statements',
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ warehouse_id: warehouseId, statement: insertSQL, wait_timeout: '30s' }),
      }
    );

    if (!sqlResponse.ok) {
      const errorData = await sqlResponse.json();
      throw new Error('Metadata insert failed: ' + (errorData.message || sqlResponse.statusText));
    }

    console.log('[KB Upload] Metadata inserted successfully');
    logFileEvent({
      eventType: 'file_uploaded',
      userEmail,
      brand: brand || 'unassigned',
      fileName,
      fileId,
      details: { scope: effectiveScope, fileType, cleaningStatus },
    });

    return res.status(200).json({
      success: true,
      fileId,
      filePath,
      message: 'File uploaded successfully. Ready for processing.',
    });

  } catch (error) {
    console.error('[KB Upload] Error:', error);
    logError({
      userEmail: req.body?.userEmail,
      brand: req.body?.brand,
      error,
      context: { fileName: req.body?.fileName, operation: 'upload' },
    });
    return res.status(500).json({ error: 'Upload failed', message: error.message });
  }
}

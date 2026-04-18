/**
 * Knowledge Base Update Metadata API
 *
 * Updates mutable metadata fields for a file in the Knowledge Base.
 * Supports: fileName, tags, contentSummary, brand, projectType, fileType,
 *           cleaningStatus, approvalNotes, citationCount, gemInclusionCount.
 *
 * Location: api/databricks/knowledge-base/update.js
 */

import { getDatabricksConfig } from '../../utils/validateEnv.js';
import { logFileEvent, logError } from '../../utils/logger.js';

const VALID_FILE_TYPES = new Set([
  'Synthesis', 'Wisdom', 'Findings', 'Research', 'Persona', 'Example'
]);

const VALID_CLEANING_STATUSES = new Set([
  'uncleaned', 'cleaned', 'in_progress', 'processed'
]);

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { workspaceHost, accessToken, warehouseId, schema } = getDatabricksConfig();

    const {
      fileId,
      fileName,
      tags,
      contentSummary,
      brand,
      projectType,
      fileType,
      cleaningStatus,
      contentMonth,
      contentYear,
      approvalNotes,
      citationCount,
      gemInclusionCount,
      userEmail,
      userRole,
    } = req.body;

    if (!fileId) {
      return res.status(400).json({ error: 'Missing required field: fileId' });
    }

    if (fileType && !VALID_FILE_TYPES.has(fileType)) {
      return res.status(400).json({ error: `Invalid fileType: "${fileType}". Must be one of: ${[...VALID_FILE_TYPES].join(', ')}` });
    }

    if (contentMonth !== undefined && contentMonth !== null) {
      const m = parseInt(contentMonth);
      if (isNaN(m) || m < 1 || m > 12) {
        return res.status(400).json({ error: 'Invalid contentMonth: must be 1-12' });
      }
    }
    if (contentYear !== undefined && contentYear !== null) {
      const y = parseInt(contentYear);
      if (isNaN(y) || y < 1900 || y > 2100) {
        return res.status(400).json({ error: 'Invalid contentYear: must be a 4-digit year' });
      }
    }

    if (cleaningStatus && !VALID_CLEANING_STATUSES.has(cleaningStatus)) {
      return res.status(400).json({ error: `Invalid cleaningStatus: "${cleaningStatus}". Must be one of: ${[...VALID_CLEANING_STATUSES].join(', ')}` });
    }

    console.log('[KB Update] User: ' + userEmail + ' (' + userRole + ') updating file: ' + fileId);

    const setClauses = [];

    if (fileName !== undefined) {
      setClauses.push("file_name = '" + String(fileName).replace(/'/g, "''") + "'");
      console.log('[KB Update] Renaming to: ' + fileName);
    }
    if (contentSummary !== undefined) {
      setClauses.push("content_summary = '" + String(contentSummary).replace(/'/g, "''").substring(0, 500) + "'");
    }
    if (tags !== undefined) {
      const tagsArr = Array.isArray(tags)
        ? tags
        : String(tags).split(',').map(t => t.trim()).filter(Boolean);
      const safeTagsArr = tagsArr
        .map(t => t.replace(/'/g, "''").replace(/[^\w\s-]/g, '').trim())
        .filter(Boolean)
        .slice(0, 20);
      setClauses.push(safeTagsArr.length > 0
        ? 'tags = ARRAY(' + safeTagsArr.map(t => "'" + t + "'").join(', ') + ')'
        : "tags = ARRAY('updated')"
      );
    }
    if (brand !== undefined) {
      setClauses.push(brand === '' || brand === null
        ? 'brand = NULL'
        : "brand = '" + String(brand).replace(/'/g, "''") + "'"
      );
      console.log('[KB Update] Setting brand to: ' + (brand || 'NULL'));
    }
    if (projectType !== undefined) {
      setClauses.push(projectType === '' || projectType === null
        ? 'project_type = NULL'
        : "project_type = '" + String(projectType).replace(/'/g, "''") + "'"
      );
      console.log('[KB Update] Setting projectType to: ' + (projectType || 'NULL'));
    }
    if (fileType !== undefined) {
      setClauses.push("file_type = '" + String(fileType).replace(/'/g, "''") + "'");
      console.log('[KB Update] Setting fileType to: ' + fileType);
    }
    if (cleaningStatus !== undefined) {
      setClauses.push("cleaning_status = '" + String(cleaningStatus).replace(/'/g, "''") + "'");
      console.log('[KB Update] Setting cleaningStatus to: ' + cleaningStatus);
    }
    if (contentMonth !== undefined) {
      setClauses.push(contentMonth === null || contentMonth === '' ? 'content_month = NULL' : 'content_month = ' + parseInt(contentMonth));
    }
    if (contentYear !== undefined) {
      setClauses.push(contentYear === null || contentYear === '' ? 'content_year = NULL' : 'content_year = ' + parseInt(contentYear));
    }
    if (approvalNotes !== undefined) {
      setClauses.push("approval_notes = '" + String(approvalNotes).replace(/'/g, "''") + "'");
    }
    if (citationCount !== undefined) {
      setClauses.push('citation_count = ' + Number(citationCount));
    }
    if (gemInclusionCount !== undefined) {
      setClauses.push('gem_inclusion_count = ' + Number(gemInclusionCount));
    }

    if (setClauses.length === 0) {
      return res.status(400).json({ error: 'No fields provided to update' });
    }

    setClauses.push('updated_at = CURRENT_TIMESTAMP()');

    const updateSQL =
      'UPDATE knowledge_base.' + schema + '.file_metadata ' +
      'SET ' + setClauses.join(',\n    ') + ' ' +
      "WHERE file_id = '" + fileId.replace(/'/g, "''") + "'";

    console.log('[KB Update] Fields: ' + setClauses.map(c => c.split('=')[0].trim()).join(', '));

    const updateResponse = await fetch(
      'https://' + workspaceHost + '/api/2.0/sql/statements',
      {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + accessToken, 'Content-Type': 'application/json' },
        body: JSON.stringify({ warehouse_id: warehouseId, statement: updateSQL, wait_timeout: '30s' }),
      }
    );

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json().catch(() => ({}));
      throw new Error('Update failed: ' + (errorData.message || updateResponse.statusText));
    }

    const updateResult = await updateResponse.json().catch(() => ({}));
    const rowsAffected = updateResult.result?.row_count || 0;
    console.log('[KB Update] UPDATE affected ' + rowsAffected + ' row(s)');
    if (rowsAffected === 0) {
      console.warn('[KB Update] WARNING: UPDATE succeeded but affected 0 rows for fileId: ' + fileId);
    }

    // Fetch updated record to confirm
    const fetchResponse = await fetch(
      'https://' + workspaceHost + '/api/2.0/sql/statements',
      {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + accessToken, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          warehouse_id: warehouseId,
          statement:
            'SELECT file_id, file_name, file_type, content_summary, tags, brand, project_type, cleaning_status, content_month, content_year ' +
            'FROM knowledge_base.' + schema + '.file_metadata ' +
            "WHERE file_id = '" + fileId.replace(/'/g, "''") + "' LIMIT 1",
          wait_timeout: '30s',
        }),
      }
    );

    let updatedFileName = fileName || fileId;
    if (fetchResponse.ok) {
      const fetchResult = await fetchResponse.json();
      const rows = fetchResult.result?.data_array || [];
      if (rows.length > 0) updatedFileName = rows[0][1];
    }

    console.log('[KB Update] ✅ Updated: ' + updatedFileName);

    try {
      logFileEvent({
        eventType: 'file_metadata_updated',
        userEmail,
        fileName: updatedFileName,
        fileId,
        details: {
          updatedFields: Object.keys(req.body).filter(k => !['fileId', 'userEmail', 'userRole'].includes(k) && req.body[k] !== undefined),
          brand, projectType, fileType, cleaningStatus,
        },
      });
    } catch (logErr) {
      console.warn('[KB Update] Log write failed (non-fatal):', logErr.message);
    }

    return res.status(200).json({
      success: true, fileId, fileName: updatedFileName,
      message: 'File "' + updatedFileName + '" updated successfully',
    });

  } catch (error) {
    console.error('[KB Update] Error:', error);
    try {
      logError({ userEmail: req.body?.userEmail, error, context: { fileId: req.body?.fileId, operation: 'update_metadata' } });
    } catch {}
    return res.status(500).json({ error: 'Update failed', message: error.message });
  }
}

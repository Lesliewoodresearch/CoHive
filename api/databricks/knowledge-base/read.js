/**
 * Knowledge Base Read API
 *
 * Reads file content from Databricks Volume for preview and processing.
 * All Databricks credentials read from environment variables.
 *
 * Location: api/databricks/knowledge-base/read.js
 */

import { getDatabricksConfig } from '../../utils/validateEnv.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { workspaceHost, accessToken, warehouseId, schema } = getDatabricksConfig();
    const { fileId } = req.body;

    if (!fileId) {
      return res.status(400).json({ error: 'Missing required field: fileId' });
    }

    console.log(`[Knowledge Base Read] Fetching metadata for fileId: ${fileId}`);

    const metadataResponse = await fetch(
      `https://${workspaceHost}/api/2.0/sql/statements`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          warehouse_id: warehouseId,
          statement: `SELECT file_path, file_name, file_type, file_size_bytes
                      FROM knowledge_base.${schema}.file_metadata
                      WHERE file_id = '${fileId}'`,
          wait_timeout: '30s',
        }),
      }
    );

    if (!metadataResponse.ok) {
      const errorData = await metadataResponse.json();
      throw new Error(`Metadata query failed: ${errorData.message || metadataResponse.statusText}`);
    }

    const metadataResult = await metadataResponse.json();
    const rows = metadataResult.result?.data_array || [];
    if (rows.length === 0) return res.status(404).json({ error: 'File not found' });

    const [filePath, fileName, fileType, fileSizeBytes] = rows[0];
    console.log(`[Knowledge Base Read] Found: ${fileName} at ${filePath}`);

    const fileResponse = await fetch(
      `https://${workspaceHost}/api/2.0/fs/files${filePath}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!fileResponse.ok) throw new Error(`File read failed: ${fileResponse.statusText}`);

    const fileBuffer = Buffer.from(await fileResponse.arrayBuffer());

    let textContent = '';
    let extractionMethod = 'raw';
    const ext = fileName.toLowerCase().split('.').pop();

    if (['txt', 'md', 'csv'].includes(ext)) {
      textContent = fileBuffer.toString('utf-8');
      extractionMethod = 'text';
    } else if (ext === 'pdf') {
      textContent = `[PDF File: ${fileName}]\n\nFile size: ${fileSizeBytes} bytes`;
      extractionMethod = 'pdf';
    } else if (['docx', 'doc'].includes(ext)) {
      textContent = `[Word Document: ${fileName}]\n\nFile size: ${fileSizeBytes} bytes`;
      extractionMethod = 'word';
    } else if (['xlsx', 'xls'].includes(ext)) {
      textContent = `[Excel Spreadsheet: ${fileName}]\n\nFile size: ${fileSizeBytes} bytes`;
      extractionMethod = 'excel';
    } else {
      textContent = `[File: ${fileName}]\n\nFile size: ${fileSizeBytes} bytes`;
      extractionMethod = 'unknown';
    }

    return res.status(200).json({
      success: true,
      fileId,
      fileName,
      fileType,
      filePath,
      content: textContent,
      extractionMethod,
      fileSizeBytes,
    });

  } catch (error) {
    console.error('[Knowledge Base Read] Error:', error);
    return res.status(500).json({ error: 'File read failed', message: error.message });
  }
}
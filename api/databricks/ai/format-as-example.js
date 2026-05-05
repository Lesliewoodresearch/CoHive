/**
 * Format as Example API
 *
 * Takes assessment output (text) and optionally an Example file from the KB,
 * then asks the AI to reformat the text to match the Example file's structure/format.
 *
 * If the selected model supports documents AND the Example file is PDF/DOCX/image,
 * the original binary is attached as a multimodal image_url so the model can see
 * the actual layout and replicate it precisely.
 *
 * Streams result back via SSE.
 *
 * Request body:
 *   content         string  — the assessment text to reformat
 *   exampleFileId   string? — KB file_id of the Example to use as format reference
 *   modelEndpoint   string  — Databricks serving endpoint
 *   accessToken     string  — Databricks OAuth token
 *   workspaceHost   string  — Databricks workspace host
 *   warehouseId     string  — SQL warehouse ID
 *   brand           string? — current brand (for context)
 *   userEmail       string?
 */

import { getDatabricksConfig } from '../../utils/validateEnv.js';

const DOCUMENT_CAPABLE_MODELS = new Set([
  'databricks-claude-sonnet-4-6',
  'databricks-gpt-5-2',
  'databricks-gpt-5-1',
  'databricks-gpt-5',
  'databricks-gemini-3-1-pro',
  'databricks-gemini-2-5-pro',
  'databricks-gpt-5-mini',
  'databricks-gemini-3-flash',
  'databricks-gemini-2-5-flash',
  'databricks-claude-haiku-4-5',
]);

const EXT_MIME = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  doc: 'application/msword',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      content,
      exampleFileId,
      modelEndpoint = 'databricks-claude-sonnet-4-6',
      brand = '',
      userEmail = '',
    } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ error: 'content is required' });
    }

    // Resolve credentials
    let resolvedToken, resolvedHost, resolvedWarehouseId;
    try {
      const envConfig = getDatabricksConfig();
      resolvedToken = envConfig.accessToken;
      resolvedHost = envConfig.workspaceHost;
      resolvedWarehouseId = envConfig.warehouseId;
    } catch {
      resolvedToken = req.body.accessToken;
      resolvedHost = req.body.workspaceHost;
      resolvedWarehouseId = req.body.warehouseId;
    }

    if (!resolvedToken || !resolvedHost) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const supportsDocuments = DOCUMENT_CAPABLE_MODELS.has(modelEndpoint);

    // Optionally fetch Example file for format reference
    let exampleText = '';
    let exampleBinaryParts = [];

    if (exampleFileId && resolvedWarehouseId) {
      try {
        // Fetch Example file metadata
        const metaResp = await fetch(`https://${resolvedHost}/api/2.0/sql/statements`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${resolvedToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            warehouse_id: resolvedWarehouseId,
            statement: `SELECT file_id, file_path, file_name FROM knowledge_base.cohive.file_metadata WHERE file_id = '${exampleFileId.replace(/'/g, "''")}' LIMIT 1`,
            wait_timeout: '15s',
          }),
        });

        if (metaResp.ok) {
          const metaResult = await metaResp.json();
          const rows = metaResult.result?.data_array || [];
          if (rows.length > 0) {
            const [_fileId, filePath, fileName] = rows[0];
            const ext = fileName.toLowerCase().split('.').pop();

            // Fetch _txt companion for text content
            const txtMetaResp = await fetch(`https://${resolvedHost}/api/2.0/sql/statements`, {
              method: 'POST',
              headers: { Authorization: `Bearer ${resolvedToken}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                warehouse_id: resolvedWarehouseId,
                statement: `SELECT file_path FROM knowledge_base.cohive.file_metadata WHERE file_id = '${(exampleFileId + '_txt').replace(/'/g, "''")}' LIMIT 1`,
                wait_timeout: '10s',
              }),
            }).catch(() => null);

            if (txtMetaResp?.ok) {
              const txtResult = await txtMetaResp.json().catch(() => null);
              const txtRows = txtResult?.result?.data_array || [];
              if (txtRows.length > 0) {
                const txtResp = await fetch(`https://${resolvedHost}/api/2.0/fs/files${txtRows[0][0]}`, {
                  headers: { Authorization: `Bearer ${resolvedToken}` },
                });
                if (txtResp.ok) {
                  exampleText = Buffer.from(await txtResp.arrayBuffer()).toString('utf-8').slice(0, 20000);
                }
              }
            }

            // For document-capable models, also fetch the original binary
            if (supportsDocuments && EXT_MIME[ext]) {
              const origResp = await fetch(`https://${resolvedHost}/api/2.0/fs/files${filePath}`, {
                headers: { Authorization: `Bearer ${resolvedToken}` },
              }).catch(() => null);
              if (origResp?.ok) {
                const origBuffer = Buffer.from(await origResp.arrayBuffer());
                exampleBinaryParts.push({
                  type: 'image_url',
                  image_url: { url: `data:${EXT_MIME[ext]};base64,${origBuffer.toString('base64')}` },
                });
              }
            }
          }
        }
      } catch (e) {
        console.warn('[FormatAsExample] Could not fetch example file:', e.message);
      }
    }

    // Build the prompt
    const formatInstruction = exampleFileId
      ? exampleBinaryParts.length > 0
        ? `You are a formatting specialist. The original document is attached — study its layout, structure, and format carefully.\n\nReformat the following assessment output to match that exact format and structure. Preserve all key insights and recommendations, but present them in the same way as the example document.\n\nIf you cannot match the exact format (e.g. because the example is a slide deck), describe the format at the top and then apply it as closely as possible in text.\n\nASSESSMENT OUTPUT TO REFORMAT:\n${content}`
        : `You are a formatting specialist. Below is an example document showing the desired format and structure. Reformat the assessment output to match that format as closely as possible.\n\nEXAMPLE FORMAT REFERENCE:\n${exampleText}\n\n---\n\nASSESSMENT OUTPUT TO REFORMAT:\n${content}`
      : `You are a formatting specialist. Reformat the following assessment output into a clean, professional, structured document. Use clear sections, headings, and bullet points where appropriate. Make it suitable for sharing with stakeholders.\n\nASSESSMENT OUTPUT TO REFORMAT:\n${content}`;

    const userMessageContent = exampleBinaryParts.length > 0
      ? [{ type: 'text', text: formatInstruction }, ...exampleBinaryParts]
      : formatInstruction;

    const messages = [
      {
        role: 'system',
        content: `You are a professional document formatting specialist working for ${brand || 'a brand team'}. Format the provided content clearly and professionally. Do not add new analysis or change the meaning — only improve structure and presentation.`,
      },
      { role: 'user', content: userMessageContent },
    ];

    // Stream response via SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const modelResp = await fetch(
      `https://${resolvedHost}/serving-endpoints/${modelEndpoint}/invocations`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${resolvedToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, max_tokens: 3000, temperature: 0.3 }),
      }
    );

    if (!modelResp.ok) {
      const err = await modelResp.json().catch(() => ({}));
      res.write(`event: error\ndata: ${JSON.stringify({ message: err.message || modelResp.statusText })}\n\n`);
      return res.end();
    }

    const result = await modelResp.json();
    const formatted = result.choices?.[0]?.message?.content || '';

    res.write(`event: complete\ndata: ${JSON.stringify({ success: true, formatted })}\n\n`);
    return res.end();

  } catch (error) {
    console.error('[FormatAsExample] Error:', error);
    if (res.headersSent) {
      res.write(`event: error\ndata: ${JSON.stringify({ message: error.message })}\n\n`);
      return res.end();
    }
    return res.status(500).json({ error: 'Format as example failed', message: error.message });
  }
}

/**
 * Knowledge Base File Classification API
 *
 * Uses AI to automatically classify uploaded files.
 * All Databricks credentials read from environment variables.
 *
 * Location: api/databricks/knowledge-base/classify.js
 */

import { getDatabricksConfig } from '../../utils/validateEnv.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { workspaceHost, accessToken, warehouseId, schema } = getDatabricksConfig();

    const { fileId, fileName, fileContent, contentSummary, userHints } = req.body;

    if (!fileId || !fileName || !fileContent) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['fileId', 'fileName', 'fileContent'],
      });
    }

    console.log(`[Knowledge Base Classify] Classifying: ${fileName} (ID: ${fileId})`);

    const classificationPrompt = `
You are a knowledge management AI assistant. Analyze the following content and classify it:

FILE: ${fileName}
${contentSummary ? `SUMMARY: ${contentSummary}` : ''}
${userHints?.brand ? `USER HINT - Brand: ${userHints.brand}` : ''}
${userHints?.category ? `USER HINT - Category: ${userHints.category}` : ''}

CONTENT PREVIEW:
${typeof fileContent === 'string' ? fileContent.substring(0, 5000) : '[Binary file]'}

---

Classify this content into one of three scopes:
1. GENERAL: Applies to all brands and categories
2. CATEGORY: Applies to a specific product category
3. BRAND: Specific to one brand

RESPOND IN THIS EXACT JSON FORMAT (no other text):
{
  "scope": "general|category|brand",
  "category": "category name or null",
  "brand": "brand name or null",
  "confidence": 0.0-1.0,
  "reasoning": "brief explanation",
  "suggestedTags": ["tag1", "tag2", "tag3"]
}
`;

    const classificationSQL = `
      SELECT ai_query(
        'databricks-meta-llama-3-1-70b-instruct',
        '${classificationPrompt.replace(/'/g, "''")}'
      ) as classification
    `;

    const sqlResponse = await fetch(
      `https://${workspaceHost}/api/2.0/sql/statements`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ warehouse_id: warehouseId, statement: classificationSQL, wait_timeout: '60s' }),
      }
    );

    if (!sqlResponse.ok) {
      const errorData = await sqlResponse.json();
      throw new Error(`AI classification failed: ${errorData.message || sqlResponse.statusText}`);
    }

    const sqlResult = await sqlResponse.json();
    const aiResponse = sqlResult.result?.data_array?.[0]?.[0];

    let classification;
    try {
      classification = JSON.parse(aiResponse);
    } catch (e) {
      classification = {
        scope: userHints?.scope || 'general',
        category: userHints?.category || null,
        brand: userHints?.brand || null,
        confidence: 0.5,
        reasoning: 'Auto-classified based on user hints',
        suggestedTags: [],
      };
    }

    // Validate
    if (classification.scope === 'general') {
      classification.category = null;
      classification.brand = null;
    } else if (classification.scope === 'category') {
      classification.brand = null;
      if (!classification.category) classification.category = userHints?.category || 'Uncategorized';
    } else if (classification.scope === 'brand') {
      if (!classification.brand) classification.brand = userHints?.brand || 'Unknown Brand';
      if (!classification.category) classification.category = userHints?.category || 'General';
    }

    // Update metadata
    const tagsSQL = classification.suggestedTags.length > 0
      ? `ARRAY_UNION(tags, ARRAY(${classification.suggestedTags.map(t => `'${t.replace(/'/g, "''")}'`).join(', ')}))`
      : 'tags';

    await fetch(
      `https://${workspaceHost}/api/2.0/sql/statements`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          warehouse_id: warehouseId,
          statement: `UPDATE knowledge_base.${schema}.file_metadata
                      SET scope = '${classification.scope}',
                          category = ${classification.category ? `'${classification.category.replace(/'/g, "''")}'` : 'NULL'},
                          brand = ${classification.brand ? `'${classification.brand.replace(/'/g, "''")}'` : 'NULL'},
                          tags = ${tagsSQL},
                          updated_at = CURRENT_TIMESTAMP()
                      WHERE file_id = '${fileId}'`,
          wait_timeout: '30s',
        }),
      }
    ).catch(e => console.warn('[Knowledge Base Classify] Metadata update failed (non-fatal):', e.message));

    return res.status(200).json({
      success: true,
      fileId,
      classification: {
        scope: classification.scope,
        category: classification.category,
        brand: classification.brand,
        confidence: classification.confidence,
        reasoning: classification.reasoning,
        tags: classification.suggestedTags,
      },
    });

  } catch (error) {
    console.error('[Knowledge Base Classify] Error:', error);
    return res.status(500).json({ error: 'Classification failed', message: error.message });
  }
}
/**
 * Shared Brands and Project Types API
 *
 * Manages brands and project types shared across all users in the workspace.
 * GET: List all brands and project types
 * POST: Add a new brand or project type
 *
 * Location: api/databricks/config/brands-projects.js
 */

import { getDatabricksConfig } from '../../utils/validateEnv.js';

export default async function handler(req, res) {
  try {
    const { workspaceHost, accessToken, warehouseId, schema } = getDatabricksConfig();

    // ── GET: List all brands and project types ──────────────────────────────
    if (req.method === 'GET') {
      console.log('[Config] Fetching shared brands and project types...');

      const response = await fetch(
        `https://${workspaceHost}/api/2.0/sql/statements`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            warehouse_id: warehouseId,
            statement: `
              SELECT config_type, config_value, display_order
              FROM knowledge_base.${schema}.shared_config
              WHERE is_active = TRUE
              ORDER BY config_type, display_order, config_value
            `,
            wait_timeout: '30s',
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Query failed: ${response.statusText}`);
      }

      const result = await response.json();
      const rows = result.result?.data_array || [];

      // Parse results into brands and project types
      const brands = [];
      const projectTypes = [];

      rows.forEach(([configType, configValue]) => {
        if (configType === 'brand') {
          brands.push(configValue);
        } else if (configType === 'project_type') {
          projectTypes.push(configValue);
        }
      });

      console.log(`[Config] Found ${brands.length} brands, ${projectTypes.length} project types`);

      return res.status(200).json({
        success: true,
        brands,
        projectTypes,
      });
    }

    // ── POST: Add a new brand or project type ───────────────────────────────
    if (req.method === 'POST') {
      const { type, value, userEmail } = req.body;

      if (!type || !value) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['type', 'value'],
        });
      }

      if (type !== 'brand' && type !== 'project_type') {
        return res.status(400).json({
          error: 'Invalid type. Must be "brand" or "project_type"',
        });
      }

      const configValue = value.trim();
      if (!configValue) {
        return res.status(400).json({ error: 'Value cannot be empty' });
      }

      // Generate a unique config_id
      const configId = `${type}_${configValue.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`;

      console.log(`[Config] Adding new ${type}: "${configValue}" by ${userEmail || 'unknown'}`);

      // Check if already exists
      const checkResponse = await fetch(
        `https://${workspaceHost}/api/2.0/sql/statements`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            warehouse_id: warehouseId,
            statement: `
              SELECT COUNT(*) as cnt
              FROM knowledge_base.${schema}.shared_config
              WHERE config_type = '${type}'
              AND LOWER(config_value) = LOWER('${configValue.replace(/'/g, "''")}')
              AND is_active = TRUE
            `,
            wait_timeout: '30s',
          }),
        }
      );

      if (checkResponse.ok) {
        const checkResult = await checkResponse.json();
        const count = checkResult.result?.data_array?.[0]?.[0] || 0;
        if (count > 0) {
          return res.status(409).json({
            error: 'Already exists',
            message: `${type === 'brand' ? 'Brand' : 'Project type'} "${configValue}" already exists`,
          });
        }
      }

      // Get max display_order for this type
      const orderResponse = await fetch(
        `https://${workspaceHost}/api/2.0/sql/statements`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            warehouse_id: warehouseId,
            statement: `
              SELECT COALESCE(MAX(display_order), 0) + 1
              FROM knowledge_base.${schema}.shared_config
              WHERE config_type = '${type}'
            `,
            wait_timeout: '30s',
          }),
        }
      );

      let displayOrder = 999;
      if (orderResponse.ok) {
        const orderResult = await orderResponse.json();
        displayOrder = orderResult.result?.data_array?.[0]?.[0] || 999;
      }

      // Insert the new value
      const insertResponse = await fetch(
        `https://${workspaceHost}/api/2.0/sql/statements`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            warehouse_id: warehouseId,
            statement: `
              INSERT INTO knowledge_base.${schema}.shared_config
              (config_id, config_type, config_value, display_order, created_by, is_active)
              VALUES (
                '${configId}',
                '${type}',
                '${configValue.replace(/'/g, "''")}',
                ${displayOrder},
                '${(userEmail || 'unknown').replace(/'/g, "''")}',
                TRUE
              )
            `,
            wait_timeout: '30s',
          }),
        }
      );

      if (!insertResponse.ok) {
        const error = await insertResponse.json().catch(() => ({}));
        throw new Error(error.message || `Insert failed: ${insertResponse.statusText}`);
      }

      console.log(`[Config] ✅ Added ${type}: "${configValue}"`);

      return res.status(201).json({
        success: true,
        type,
        value: configValue,
        message: `${type === 'brand' ? 'Brand' : 'Project type'} "${configValue}" added successfully`,
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('[Config] Error:', error);
    return res.status(500).json({
      error: 'Configuration operation failed',
      message: error.message,
    });
  }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sourceModel = void 0;
const helper_1 = require("../utils/helper");
class sourceModel {
    async tipCreate(data) {
        const query = `
    INSERT INTO daily_tips
    (
      tip_img,
      status
    )
    VALUES (?, ?)
  `;
        const result = await (0, helper_1.executeQuery)(query, [data.image, "active"]);
        const tipId = result.insertId;
        for (const lang of data.translations) {
            await (0, helper_1.executeQuery)(`
      INSERT INTO translations
      (
        module,
        record_id,
        field_name,
        lang_code,
        value
      )
      VALUES (?, ?, ?, ?, ?)
      `, ["daily_tips", tipId, "desc", lang.lang_code, lang.desc]);
        }
        return tipId;
    }
    async tipUpdate(data) {
        const fields = [];
        const values = [];
        if (data.image !== undefined) {
            fields.push("tip_img = ?");
            values.push(data.image);
        }
        if (data.status !== undefined) {
            fields.push("status = ?");
            values.push(data.status);
        }
        if (fields.length > 0) {
            values.push(data.id);
            await (0, helper_1.executeQuery)(`
      UPDATE daily_tips
      SET ${fields.join(", ")}
      WHERE id = ?
      `, values);
        }
        if (data.translations?.length) {
            for (const lang of data.translations) {
                await (0, helper_1.executeQuery)(`
        INSERT INTO translations
        (
          module,
          record_id,
          field_name,
          lang_code,
          value
        )
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        value = VALUES(value)
        `, ["daily_tips", data.id, "desc", lang.lang_code, lang.desc]);
            }
        }
        return data.id;
    }
    async tipFind(data) {
        const { id, status, lang_code = "en" } = data;
        let query = `
    SELECT
      t.id,
      COALESCE(t.tip_img,'') AS tip_img,
      COALESCE(t.status,'') AS status,
      COALESCE(tr.value,'') AS \`desc\`

    FROM daily_tips t

    INNER JOIN translations tr
      ON tr.module = 'daily_tips'
      AND tr.record_id = t.id
      AND tr.field_name = 'desc'
      AND tr.lang_code = ?

    WHERE 1 = 1
  `;
        const values = [lang_code];
        // if (id) {
        //   query += ` AND t.id = ?`;
        //   values.push(id);
        // }
        if (status) {
            query += ` AND t.status = ?`;
            values.push(status);
        }
        query += ` ORDER BY t.id DESC`;
        const rows = await (0, helper_1.executeQuery)(query, values);
        return Array.isArray(rows[0]) ? rows[0] : rows;
    }
    async getRandomTip(data) {
        const { lang_code = "en", c_date } = data;
        // Get total active tips having translation for selected language
        const countResult = await (0, helper_1.executeQuery)(`
    SELECT COUNT(*) AS total
    FROM daily_tips t
    INNER JOIN translations tr
      ON tr.module = 'daily_tips'
      AND tr.record_id = t.id
      AND tr.field_name = 'desc'
      AND tr.lang_code = ?
    WHERE t.status = 'active'
    `, [lang_code]);
        const countRows = Array.isArray(countResult[0])
            ? countResult[0]
            : countResult;
        const totalTips = Number(countRows?.[0]?.total || 0);
        if (!totalTips) {
            return null;
        }
        // Current date or today's date
        const currentDate = c_date ? new Date(c_date) : new Date();
        if (isNaN(currentDate.getTime())) {
            throw new Error("Invalid c_date");
        }
        // Fixed base date
        const baseDate = new Date("2026-01-01");
        const diffDays = Math.floor((currentDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
        // Rotation logic
        const offset = ((diffDays % totalTips) + totalTips) % totalTips;
        const result = await (0, helper_1.executeQuery)(`
    SELECT
      t.id,
      COALESCE(t.tip_img, '') AS tip_img,
      COALESCE(t.status, '') AS status,
      COALESCE(tr.value, '') AS description

    FROM daily_tips t

    INNER JOIN translations tr
      ON tr.module = 'daily_tips'
      AND tr.record_id = t.id
      AND tr.field_name = 'desc'
      AND tr.lang_code = ?

    WHERE t.status = 'active'

    ORDER BY t.id ASC

    LIMIT 1 OFFSET ?
    `, [lang_code, offset]);
        const rows = Array.isArray(result[0]) ? result[0] : result;
        return rows?.[0] || null;
    }
    // country
    async addCountry(data) {
        const { image, status = "active" } = data;
        const result = await (0, helper_1.executeQuery)(`
    INSERT INTO country
    (
      image,
      status
    )
    VALUES (?, ?)
    `, [image, status]);
        return result;
    }
    async updateCountry(data) {
        const { id, image, status } = data;
        const result = await (0, helper_1.executeQuery)(`
    UPDATE country
    SET
      image = ?,
      status = ?
    WHERE id = ?
    `, [image, status, id]);
        return result;
    }
    async saveTranslation(data) {
        await (0, helper_1.executeQuery)(`
    INSERT INTO dyn_translations
    (
      module,
      record_id,
      field_name,
      lang_code,
      value
    )
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    value = VALUES(value)
    `, [
            data.module,
            data.record_id,
            data.field_name,
            data.lang_code,
            data.value,
        ]);
    }
    async getLanguages() {
        const rows = await (0, helper_1.executeQuery)(`
    SELECT code
    FROM languages
    WHERE status = 1
  `);
        return rows;
    }
    async getCountry(data) {
        const { id, lang_code = "en", status } = data;
        let query = `
    SELECT
      c.id,
      c.image,
      c.status,
      COALESCE(t_lang.value, t_en.value, '') AS name
    FROM country c

    INNER JOIN dyn_translations t_lang
      ON t_lang.module = 'country'
      AND t_lang.record_id = c.id
      AND t_lang.field_name = 'name'
      AND t_lang.lang_code = ?

    INNER JOIN dyn_translations t_en
      ON t_en.module = 'country'
      AND t_en.record_id = c.id
      AND t_en.field_name = 'name'
      AND t_en.lang_code = 'en'

    WHERE 1 = 1
  `;
        const params = [lang_code];
        if (id) {
            query += ` AND c.id = ?`;
            params.push(id);
        }
        if (status) {
            query += ` AND c.status = ?`;
            params.push(status);
        }
        query += ` ORDER BY c.id DESC`;
        const rows = await (0, helper_1.executeQuery)(query, params);
        return rows;
    }
}
exports.sourceModel = sourceModel;

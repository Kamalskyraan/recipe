import {
  ICountryAdd,
  IFindTip,
  IrandTip,
  Itip,
} from "../interfaces/src.interface";
import { executeQuery } from "../utils/helper";

export class sourceModel {
  async validateTranslationTranslations(translations: any[]) {
    const errors: string[] = [];

    if (!translations || translations.length === 0) {
      errors.push("At least one translation is required");
      return errors;
    }

    const requiredFields = ["lang_code", "title"];
    const validLanguages = ["en", "es", "fr", "de", "hi", "ar", "zh", "ja"];

    for (const trans of translations) {
      for (const field of requiredFields) {
        if (!trans[field]) {
          errors.push(`Missing required field: ${field} for translation`);
        }
      }

      if (trans.lang_code && !validLanguages.includes(trans.lang_code)) {
        errors.push(`Invalid language code: ${trans.lang_code}`);
      }

      if (trans.title && trans.title.length > 255) {
        errors.push(`Title too long for language ${trans.lang_code}`);
      }

      if (trans.description && trans.description.length > 1000) {
        errors.push(`Description too long for language ${trans.lang_code}`);
      }
    }

    return errors;
  }

  async tipCreate(data: any) {
    const query = `
    INSERT INTO daily_tips (
      status
    )
    VALUES ( ?)
  `;

    return await executeQuery(query, [data.status || "active"]);
  }

  async tipUpdate(data: any) {
    const query = `
    UPDATE daily_tips
    SET
  
      status = ?
    WHERE id = ?
  `;

    return await executeQuery(query, [data.status, data.id]);
  }

  async tipFind(data: IFindTip) {
    const { id, status, lang_code = "en" } = data;

    let query = `
    SELECT
      t.id,
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

    if (status) {
      query += ` AND t.status = ?`;
      values.push(status);
    }

    query += ` ORDER BY t.id DESC`;

    const rows: any = await executeQuery(query, values);

    return Array.isArray(rows[0]) ? rows[0] : rows;
  }

  async getRandomTip(data: IrandTip) {
    const { lang_code = "en", c_date } = data;

    // Get total active tips having translation for selected language
    const countResult: any = await executeQuery(
      `
    SELECT COUNT(*) AS total
    FROM daily_tips t
    INNER JOIN translations tr
      ON tr.module = 'daily_tips'
      AND tr.record_id = t.id
      AND tr.field_name = 'desc'
      AND tr.lang_code = ?
    WHERE t.status = 'active'
    `,
      [lang_code],
    );

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

    const diffDays = Math.floor(
      (currentDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Rotation logic
    const offset = ((diffDays % totalTips) + totalTips) % totalTips;

    const result: any = await executeQuery(
      `
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
    `,
      [lang_code, offset],
    );

    const rows = Array.isArray(result[0]) ? result[0] : result;

    return rows?.[0] || null;
  }

  // country

  async addCountry(data: ICountryAdd) {
    const { image, status = "active" } = data;
    const result: any = await executeQuery(
      `
    INSERT INTO country
    (
      image,
      status
    )
    VALUES (?, ?)
    `,
      [image, status],
    );

    return result;
  }

  async updateCountry(data: ICountryAdd) {
    const { id, image, status } = data;
    const result: any = await executeQuery(
      `
    UPDATE country
    SET
      image = ?,
      status = ?
    WHERE id = ?
    `,
      [image, status, id],
    );

    return result;
  }
  async saveTranslation(data: any) {
    await executeQuery(
      `
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
    `,
      [
        data.module,
        data.record_id,
        data.field_name,
        data.lang_code,
        data.value,
      ],
    );
  }

  async getLanguages() {
    const rows: any = await executeQuery(`
    SELECT code
    FROM languages
    WHERE status = 1
  `);

    return rows;
  }

  async getCountry(data: any) {
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

    const rows = await executeQuery(query, params);

    return rows;
  }

  async insertMultipleMedia(files: any[]) {
    if (!files?.length) {
      return [];
    }

    const values: any[] = [];
    const placeholders: string[] = [];

    files.forEach((file) => {
      placeholders.push("(?, ?, ?, ?, ?, ?, ?)");

      values.push(
        file.file_name,
        file.org_name,
        file.url,
        file.path,
        file.mime_type,
        file.media_type,
        file.file_size,
      );
    });

    const query = `
    INSERT INTO media (
      file_name,
      org_name,
      url,
      path,
      mime_type,
      media_type,
      file_size
    )
    VALUES ${placeholders.join(", ")}
  `;

    const result: any = await executeQuery(query, values);

    const insertedIds = [];

    for (let i = 0; i < result.affectedRows; i++) {
      insertedIds.push(result.insertId + i);
    }

    return insertedIds;
  }

  async getUploads(params: {
    media_type?: string;
    id?: string | number | number[];
  }) {
    const { media_type, id } = params;

    const conditions: string[] = ["status = 'active'"];
    const queryParams: any[] = [];

    if (media_type) {
      const types = media_type.split(",").map((t) => t.trim());

      if (types.length) {
        conditions.push(`media_type IN (${types.map(() => "?").join(",")})`);
        queryParams.push(...types);
      }
    }

    if (id) {
      let ids: any[] = [];

      if (Array.isArray(id)) {
        ids = id;
      } else {
        ids = String(id)
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean);
      }

      if (ids.length) {
        conditions.push(`id IN (${ids.map(() => "?").join(",")})`);
        queryParams.push(...ids);
      }
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const dataQuery = `
    SELECT
      id,
      file_name,
      org_name,
      url,
      file_size,
      created_at
      
    FROM media
    ${whereClause}
    ORDER BY id DESC
    
  `;

    const rows: any = await executeQuery(dataQuery, [...queryParams]);

    return {
      data: rows || [],
    };
  }
}

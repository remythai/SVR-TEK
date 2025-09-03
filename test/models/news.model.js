import * as dbUtils from './utils.js';

const TABLE_NAME = 'news';

// ----------
// -- Read --
// ----------

export async function getAll(sql) {
  return await dbUtils.getAll(sql, TABLE_NAME);
}

export async function getById(sql, id) {
  return await dbUtils.getById(sql, TABLE_NAME, id);
}
  
export async function getNewsImage(sql, newsId) {
    return await sql`SELECT image FROM news WHERE id = ${newsId}`;
}

// ------------
// -- Create --
// ------------

export async function create(sql, data) {
  return await dbUtils.create(sql, TABLE_NAME, data);
}
  
export default { getAll, getById, getNewsImage, create };
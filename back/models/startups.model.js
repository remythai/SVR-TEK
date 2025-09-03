import * as dbUtils from './utils.js';

const TABLE_NAME = 'startups';

// ----------
// -- Read --
// ----------

export async function getAll(sql) {
  return await dbUtils.getAll(sql, TABLE_NAME);
}

export async function getById(sql, id) {
  return await dbUtils.getById(sql, TABLE_NAME, id);
}

export async function getFounderImage(sql, founderId) {
  return await sql`
    SELECT f.image
    FROM users f
    WHERE f.founder_id = ${founderId}
  `;
}

// ------------
// -- Create --
// ------------

export async function create(sql, data) {
  return await dbUtils.create(sql, TABLE_NAME, data);
}

export default { getAll, getById, getFounderImage, create};
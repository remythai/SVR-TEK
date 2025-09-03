import * as dbUtils from './utils.js';

const TABLE_NAME = 'parteners';

// ----------
// -- Read --
// ----------

export async function getAll(sql) {
  return await dbUtils.getAll(sql, TABLE_NAME);
}

export async function getById(sql, id) {
  return await dbUtils.getById(sql, TABLE_NAME, id);
}

// ------------
// -- Create --
// ------------

export async function create(sql, data) {
  return await dbUtils.create(sql, TABLE_NAME, data);
}
  
export default { getAll, getById };
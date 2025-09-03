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

export async function getInvestorImage(sql, newsId) {
  return (await dbUtils.getImageById(sql, TABLE_NAME, newsId))
}

export default { getAll, getById, getInvestorImage };
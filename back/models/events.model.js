import * as dbUtils from './utils.js';

const TABLE_NAME = 'events';

// ----------
// -- Read --
// ----------

export async function getAll(sql) {
  return await dbUtils.getAll(sql, TABLE_NAME);
}

export async function getById(sql, id) {
  return await dbUtils.getById(sql, TABLE_NAME, id);
}

export async function getEventImage(sql, newsId) {
  return (await dbUtils.getImageById(sql, TABLE_NAME, newsId))
}

// ------------
// -- Delete --
// ------------

export async function deleteById(sql, id) {
    return (await dbUtils.deleteById(sql, TABLE_NAME, id));
}
  
export default { getAll, getById, getEventImage, deleteById };
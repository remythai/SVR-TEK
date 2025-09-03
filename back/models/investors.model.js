export async function getAll(sql) {
  return await dbUtils.getAll(sql, TABLE_NAME);
}

export async function getById(sql, id) {
  return await dbUtils.getById(sql, TABLE_NAME, id);
}

export async function getInvestorImage(sql, newsId) {
  return (await dbUtils.getImageById(sql, TABLE_NAME, newsId))
}

// ------------
// -- Create --
// ------------

export async function create(sql, data) {
  return await dbUtils.create(sql, TABLE_NAME, data);
}

// ------------
// -- Delete --
// ------------

export async function deleteById(sql, id) {
  return (await dbUtils.deleteById(sql, TABLE_NAME, id));
}

export default { getAll, getById, getInvestorImage, create, deleteById };

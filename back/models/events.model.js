export async function getAll(sql) {
    return await sql`SELECT * FROM events`;
}
  
export async function getById(sql, id) {
    return await sql`SELECT * FROM events WHERE id = ${id}`;
}
  
export async function getEventImage(sql, eventsId) {
    return await sql`SELECT image FROM events WHERE id = ${eventsId}`;
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

// Update

export async function update(sql, data, id) {
  return (await dbUtils.update(sql, TABLE_NAME, data, id));
}
  
export default { getAll, getById, getEventImage, deleteById, create, update };
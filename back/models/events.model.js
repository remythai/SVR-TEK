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
// -- Delete --
// ------------

export async function deleteById(sql, id) {
    return await sql`DELETE FROM events WHERE id = ${id}`;
}
  
export default { getAll, getById, getEventImage, deleteById };
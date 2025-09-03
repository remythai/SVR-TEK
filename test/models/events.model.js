export async function getAll(sql) {
    return await sql`SELECT * FROM events`;
}
  
export async function getById(sql, id) {
    return await sql`SELECT * FROM events WHERE id = ${id}`;
}
  
export async function getEventImage(sql, eventsId) {
    return await sql`SELECT image FROM events WHERE id = ${eventsId}`;
}
  
export default { getAll, getById, getEventImage };
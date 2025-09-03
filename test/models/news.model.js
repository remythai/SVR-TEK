export async function getAll(sql) {
    return await sql`SELECT * FROM news`;
}
  
export async function getById(sql, id) {
    return await sql`SELECT * FROM news WHERE id = ${id}`;
}
  
export async function getNewsImage(sql, newsId) {
    return await sql`SELECT image FROM news WHERE id = ${newsId}`;
}
  
export default { getAll, getById, getNewsImage };
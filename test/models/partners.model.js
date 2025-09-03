export async function getAll(sql) {
    return await sql`SELECT * FROM partners`;
}
  
export async function getById(sql, id) {
    return await sql`SELECT * FROM partners WHERE id = ${id}`;
}
  
export default { getAll, getById };
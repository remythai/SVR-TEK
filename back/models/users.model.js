export async function getAll(sql) {
    return await sql`SELECT * FROM users`;
}
  
export async function getById(sql, id) {
    return await sql`SELECT * FROM users WHERE id = ${id}`;
}
  
export async function getByEmail(sql, email) {
    return await sql`SELECT * FROM users WHERE email = ${email}`;
}

export async function getUserImage(sql, userId) {
    return await sql`SELECT * FROM users WHERE id = ${userId}`;
}
  
export default { getAll, getById, getByEmail, getUserImage };
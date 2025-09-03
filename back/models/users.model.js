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
  
export async function create(sql, { name, email, password }) {
  const [user] = await sql`
    INSERT INTO users (name, email, password)
    VALUES (${name}, ${email}, ${password})
    RETURNING id, name, email
  `;
  return user;
}

export default { getAll, getById, getByEmail, getUserImage, create };


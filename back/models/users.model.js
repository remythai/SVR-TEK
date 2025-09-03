import bcrypt from "bcrypt";
import * as dbUtils from './utils.js';

const TABLE_NAME = 'users';

// ----------
// -- Read --
// ----------

export async function getAll(sql) {
  return await dbUtils.getAll(sql, TABLE_NAME);
}

export async function getById(sql, id) {
  return await dbUtils.getById(sql, TABLE_NAME, id);
}

export async function getByEmail(sql, email) {
    return await sql`SELECT * FROM users WHERE email = ${email}`;
}

export async function getUserImage(sql, newsId) {
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

export async function register(sql, { name, email, password }) {
  const [user] = await sql`
    INSERT INTO users (name, email, password)
    VALUES (${name}, ${email}, ${password})
    RETURNING id, name, email
  `;
  return user;
}

export async function login(sql, { email, password }) {
  const [user] = await sql`
    SELECT id, name, email, password 
    FROM users 
    WHERE email = ${email}
  `;

  if (!user) return null;

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return null;

  return { id: user.id, name: user.name, email: user.email };
}

export default { getAll, getById, getByEmail, getUserImage, create, login, register, deleteById };
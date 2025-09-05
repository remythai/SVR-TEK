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

export async function getUserImage(sql, userId) {
    return await sql`SELECT * FROM users WHERE id = ${userId}`;
}

// Update

export async function update(sql, data, id) {
  return (await dbUtils.update(sql, TABLE_NAME, data, id));
}

// Auth

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

export async function updatePassword(sql, userId, hashedPassword) {
  console.log("=== DEBUG updatePassword ===");
  console.log("userId:", userId, typeof userId);
  console.log("hashedPassword:", hashedPassword, typeof hashedPassword);
  console.log("sql object:", typeof sql);
  
  try {
    const [user] = await sql`
      UPDATE users
      SET password = ${hashedPassword}
      WHERE id = ${userId}
      RETURNING id, name, email
    `;
    
    console.log("Update result:", user);
    return user;
  } catch (error) {
    console.error("SQL Error in updatePassword:", error);
    throw error;
  }
}

export default { getAll, getById, getByEmail, getUserImage, register, create, login , deleteById, update, updatePassword };

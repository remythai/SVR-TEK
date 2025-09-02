export async function getAll(sql) {
  return await sql`SELECT * FROM startups`;
}

export async function getById(sql, id) {
  return await sql`SELECT * FROM startups WHERE id = ${id}`;
}

export async function getFounderImage(sql, founderId) {
  return await sql`
    SELECT f.image
    FROM users f
    WHERE f.founder_id = ${founderId}
  `;
}

export default { getAll, getById, getFounderImage };
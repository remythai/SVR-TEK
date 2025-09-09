import * as dbUtils from './utils.js';

const TABLE_NAME = 'startups';
const FOUNDERS_TABLE = 'founders';
const RELATION_TABLE = 'relation_table'

// ----------
// -- Read --
// ----------

export async function getAll(sql) {
  return await dbUtils.getAll(sql, TABLE_NAME);
}

export async function getById(sql, id) {
  return await dbUtils.getById(sql, TABLE_NAME, id);
}

export async function getFounderImage(sql, founderId) {
  return await sql`
    SELECT f.image
    FROM users f
    WHERE f.founder_id = ${founderId}
  `;
}

export async function getRelationsByStartupId(sql, startupId) {
  return await sql`SELECT founder_id FROM relation_table WHERE startup_id = ${startupId}`;
}

export async function getFounderById(sql, founderId) {
  const response = await dbUtils.getById(sql, 'founders', founderId);
  return response[0];
}

export async function getFounderByName(sql, name) {
  const result = await dbUtils.getByField(sql, FOUNDERS_TABLE, 'name', name);
  return result[0];
}

// ------------
// -- Create --
// ------------

export async function create(sql, data) {
  return await dbUtils.create(sql, TABLE_NAME, data);
}

export async function createFounder(sql, founderData) {
  const result = await dbUtils.create(sql, FOUNDERS_TABLE, founderData);
  return result[0];
}

export async function createStartupFounderRelation(sql, startupId, founderId) {
  return await sql`
    INSERT INTO ${sql.unsafe(RELATION_TABLE)} (startup_id, founder_id) 
    VALUES (${startupId}, ${founderId})
    RETURNING *
  `;
}

// ------------
// -- Delete --
// ------------

export async function deleteById(sql, id) {
  return (await dbUtils.deleteById(sql, TABLE_NAME, id));
}

export async function deleteStartupFounderRelation(sql, startupId, founderId) {
  return await sql`
    DELETE FROM ${sql.unsafe(RELATION_TABLE)} 
    WHERE startup_id = ${startupId} AND founder_id = ${founderId}
  `;
}

// ------------
// -- Update --
// ------------

export async function update(sql, data, id) {
  return await dbUtils.update(sql, TABLE_NAME, data, id);
}

export async function updateFounder(sql, data, founderId) {
  return await dbUtils.update(sql, FOUNDERS_TABLE, data, founderId);
}

export default { getAll, getById, getFounderImage, getFounderById, getRelationsByStartupId, getFounderByName, create, createFounder, createStartupFounderRelation, deleteById, deleteStartupFounderRelation, update};

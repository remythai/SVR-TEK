// ----------
// -- Read --
// ----------

export async function getAll(sql, tableName) {
  return await sql`SELECT * FROM ${sql.unsafe(tableName)}`;
}

export async function getById(sql, tableName, id) {
  return await sql`SELECT * FROM ${sql.unsafe(tableName)} WHERE id = ${id}`;
}

export async function getByField(sql, tableName, fieldName, value) {
  return await sql`SELECT * FROM ${sql.unsafe(tableName)} WHERE ${sql.unsafe(fieldName)} = ${value}`;
}

// ------------
// -- Create --
// ------------

export async function create(sql, tableName, data) {
  const keys = Object.keys(data);
  const values = Object.values(data);

  const columns = keys.join(', ');

  const formattedValues = values.map(value => {
    if (value === null || value === undefined) return 'NULL';
    if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
    if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
    return String(value);
  }).join(', ');

  return await sql`INSERT INTO ${sql.unsafe(tableName)} (${sql.unsafe(columns)}) VALUES (${sql.unsafe(formattedValues)}) RETURNING *;`;
}

export default { getAll, getById, getByField, create };
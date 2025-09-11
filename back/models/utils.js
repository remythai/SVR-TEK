// ----------
// -- Read --
// ----------

export async function getAll(sql, tableName) {
  const columns = await sql`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = ${tableName}
  `;

  const filteredColumns = columns
    .map(col => col.column_name)
    .filter(colName => colName !== 'image' && colName !== 'password');

  const columnsList = filteredColumns.join(', ');
  
  return await sql`SELECT ${sql.unsafe(columnsList)} FROM ${sql.unsafe(tableName)}`;
}

export async function getById(sql, tableName, id) {
  return await sql`SELECT * FROM ${sql.unsafe(tableName)} WHERE id = ${id}`;
}

export async function getByField(sql, tableName, fieldName, value) {
  return await sql`SELECT * FROM ${sql.unsafe(tableName)} WHERE ${sql.unsafe(fieldName)} = ${value}`;
}

export async function getImageById(sql, tableName, tableId) {
    return await sql`SELECT image FROM ${sql.unsafe(tableName)} WHERE id = ${tableId}`;
}

// ------------
// -- Create --
// ------------

export async function create(sql, tableName, data) {
  const keys = Object.keys(data);
  const values = Object.values(data);

  const placeholders = keys.map((_, index) => `$${index + 1}`);
  
  const query = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`;
  
  return await sql.query(query, values);
}

// ------------
// -- Update --
// ------------


export async function update(sql, tableName, data, id) {
  const { id: _, ...dataWithoutId } = data;

  const keys = Object.keys(dataWithoutId);
  const values = Object.values(dataWithoutId);

  if (keys.length === 0) throw new Error("Aucun champ à mettre à jour");

  const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');

  values.push(id);

  const query = `UPDATE ${tableName} SET ${setClause} WHERE id = $${values.length} RETURNING *;`;

  const result = await sql.query(query, values);

  return result[0];
}

// ------------
// -- Delete --
// ------------

export async function deleteById(sql, tableName, id) {
  return await sql`DELETE FROM ${sql.unsafe(tableName)} WHERE id = ${id}`;
}

export default { getAll, getById, getByField, getImageById, create, update, deleteById };
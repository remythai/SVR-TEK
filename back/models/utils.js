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

export async function getImageById(sql, tableName, tableId) {
    return await sql`SELECT image FROM ${sql.unsafe(tableName)} WHERE id = ${tableId}`;
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
    if (Array.isArray(value) || typeof value === 'object') return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
    if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
    if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
    return String(value);
  }).join(', ');

  return await sql`INSERT INTO ${sql.unsafe(tableName)} (${sql.unsafe(columns)}) VALUES (${sql.unsafe(formattedValues)}) RETURNING *;`;
}


// ------------
// -- Update --
// ------------

// utils.js

export async function update(sql, tableName, data, id) {
  // Supprime id pour ne pas essayer de le mettre à jour
  const { id: _, ...dataWithoutId } = data;

  const keys = Object.keys(dataWithoutId);
  const values = Object.values(dataWithoutId);

  if (keys.length === 0) throw new Error("Aucun champ à mettre à jour");

  // Crée dynamiquement la partie SET
  const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');

  // Ajoute l'id à la fin pour le WHERE
  values.push(id);

  const query = `UPDATE ${tableName} SET ${setClause} WHERE id = $${values.length} RETURNING *;`;

  // Execute la requête
  const result = await sql.query(query, values);

  return result[0]; // retourne l'objet mis à jour
}

// ------------
// -- Delete --
// ------------

export async function deleteById(sql, tableName, id) {
  return await sql`DELETE FROM ${sql.unsafe(tableName)} WHERE id = ${id}`;
}

export default { getAll, getById, getByField, create, update };
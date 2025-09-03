export async function getAll(sql) {
<<<<<<< HEAD
    return await sql`SELECT * FROM investors`;
  }
  
  export async function getById(sql, id) {
    return await sql`SELECT * FROM investors WHERE id = ${id}`;
  }
  
  export async function getInvestorImage(sql, investorId) {
    return await sql`SELECT image FROM investors WHERE id = ${investorId}`;
  }
  
  export default { getAll, getById, getInvestorImage };
=======
  return await dbUtils.getAll(sql, TABLE_NAME);
}

export async function getById(sql, id) {
  return await dbUtils.getById(sql, TABLE_NAME, id);
}

export async function getInvestorImage(sql, newsId) {
  return (await dbUtils.getImageById(sql, TABLE_NAME, newsId))
}

// ------------
// -- Create --
// ------------

export async function create(sql, data) {
  return await dbUtils.create(sql, TABLE_NAME, data);
}

export default { getAll, getById, getInvestorImage, create };
>>>>>>> 955c4e9 (refacto & feat: add create function to investors and refacto to use utils functions)

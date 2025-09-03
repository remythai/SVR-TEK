export async function getAll(sql) {
    return await sql`SELECT * FROM investors`;
  }
  
  export async function getById(sql, id) {
    return await sql`SELECT * FROM investors WHERE id = ${id}`;
  }
  
  export async function getInvestorImage(sql, investorId) {
    return await sql`SELECT image FROM investors WHERE id = ${investorId}`;
  }
  
  export default { getAll, getById, getInvestorImage };
import pg from 'pg';
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
async function run() {
  const tables = ['buyers', 'staff', 'farmers', 'application_users'];
  for (const t of tables) {
    const res = await pool.query(`SELECT COUNT(*) FROM ${t}`);
    console.log(`${t}:`, res.rows[0].count);
  }
  await pool.end();
}
run();

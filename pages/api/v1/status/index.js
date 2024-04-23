import database from '/infra/database.js';

async function status(req, res) {
  const result = await database.query({
    text: `SELECT 
      NOW() as now,
      VERSION() as full_version,
      current_setting('server_version') as version,
      current_setting('max_connections')::int as max_connections,
      count(*)::int as opened_connections
      FROM pg_stat_activity
      where datname = $1;`,
    values: [process.env.POSTGRES_DB],
  });

  const response = {
    now: result.rows[0].now,
    dependencies: {
      database: {
        full_version: result.rows[0].full_version,
        version: result.rows[0].version,
        max_connections: result.rows[0].max_connections,
        opened_connections: result.rows[0].opened_connections,
      },
    },
  };

  return res.status(200).json(response);
}

export default status;

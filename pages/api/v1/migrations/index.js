import migrationRunner from 'node-pg-migrate';
import { join } from 'node:path';
import database from 'infra/database';

export default async function migrations(req, res) {
  const dbClient = await database.getNewClient();
  const defaultMigrationsOptions = {
    dbClient,
    dryRun: true,
    dir: join('infra', 'migrations'),
    direction: 'up',
    verbose: true,
    migrationsTable: 'pgmigrations',
  };

  if (!['GET', 'POST'].includes(req.method)) {
    return res.status(405).end();
  }

  if (req.method === 'GET') {
    const pendingMigrations = await migrationRunner(defaultMigrationsOptions);
    await dbClient.end();
    return res.status(200).json(pendingMigrations);
  }

  if (req.method === 'POST') {
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dryRun: false,
    });
    await dbClient.end();
    return res
      .status(migratedMigrations.length > 0 ? 201 : 200)
      .json(migratedMigrations);
  }

  return res.status(405).end();
}

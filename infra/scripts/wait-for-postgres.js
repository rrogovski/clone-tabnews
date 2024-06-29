const { exec } = require('node:child_process');

// Exemplo de uso para versões do Node.js anteriores a 20:
// Precisa do pacote dotenv para carregar as variáveis de ambiente
// require('dotenv').config({ path: '../../.env.development' });
// const containerName2 = process.env.POSTGRES_CONTAINER_NAME;

const containerName = process.env.POSTGRES_CONTAINER_NAME;

const messageWaiting = `🔴 Waiting for PostgreSQL(${containerName}) to be ready.`;
const messageReady = '✅ Postgres ready!';

const startedAt = Date.now();
function showElapsedTime() {
  return `${((Date.now() - startedAt) / 1000).toFixed(2)}s`;
}

function showSpinner() {
  const intervalToUpdateMs = 200;
  const spinner = ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'];
  const index = Math.floor(Date.now() / intervalToUpdateMs) % spinner.length;
  return `${showElapsedTime()} ${spinner[index]}`;
}

function checkPostgres() {
  exec(
    `docker exec ${containerName} pg_isready --host localhost`,
    handleReturn,
  );

  function handleReturn(error, stdout, stderr) {
    if (stdout.includes('accepting connections')) {
      process.stdout.write(`\r ${messageWaiting} - ${showElapsedTime()}`);
      process.stdout.write(`\n ${messageReady}\n`);
      process.exit(0);
    }

    process.stdout.write(`\r ${messageWaiting} ${showSpinner()}`);
    checkPostgres();
  }
}

process.stdout.write(`\n\n${messageWaiting}`);
checkPostgres();

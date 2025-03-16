const { spawn } = require('child_process');
const process = require('process');

console.log('Starting development environment...');

function runCommand(command, args, callback) {
  const cmd = spawn(command, args, { stdio: 'inherit' });

  cmd.on('close', (code) => {
    if (code !== 0) {
      console.error(
        `Command "${command} ${args.join(' ')}" exited with code ${code}`,
      );
      process.exit(1);
    }
    if (callback) callback();
  });
}

function cleanup() {
  console.log('Stopping development environment...');
  runCommand('npm', ['run', 'services:stop'], () => {
    process.exit(0);
  });
}

process.on('SIGINT', cleanup);

runCommand('npm', ['run', 'services:up'], () => {
  runCommand('npm', ['run', 'services:wait:database'], () => {
    runCommand('npm', ['run', 'migrations:up'], () => {
      runCommand('next', ['dev']);
    });
  });
});

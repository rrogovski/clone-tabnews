import database from '../../../../infra/database.js';

async function status(req, res) {
  const result = await database.query('SELECT NOW()');
  console.log(result);
  console.log(process.env);
  res.status(200).json({ status: 'ok' });
}

export default status;

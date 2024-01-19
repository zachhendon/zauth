const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  user: "root",
  port: 5432,
  password: "zach",
  database: "zauth",
});

client.connect();

exports.getUsers = async () => {
  const query = `SELECT * FROM "user"`;
  const res = await client.query(query);
  return res.rows;
};

exports.getUser = async (id) => {
  const query = `SELECT * FROM "user" WHERE id = ${id}`;
  const res = await client.query(query);
  return res.rows[0];
};

exports.createUser = async (name, email, password) => {
  const query = `INSERT INTO "user" (name, email, password) VALUES ('${name}', '${email}', '${password}') RETURNING *`;
  const res = await client.query(query);
  return res.rows[0];
};

exports.deleteUser = async (id) => {
  const query = `DELETE FROM "user" WHERE id = ${id} RETURNING *`;
  const res = await client.query(query);
  return res.rows[0];
};

exports.updateUser = async (id, name, email, password) => {
  const updates = [];
  let query = `UPDATE "user" SET `
  if (name) {
    updates.push(`name = '${name}'`);
  }
  if (email) {
    updates.push(`email = '${email}'`);
  }
  if (password) {
    updates.push(`password = '${password}'`);
  }
  query += updates.join(", ");
  query += ` WHERE id = ${id} RETURNING *`;
  const res = await client.query(query);
  return res.rows[0];
}

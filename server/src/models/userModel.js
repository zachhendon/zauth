const db = require("./database");

exports.getUsers = async () => {
  const query = `SELECT * FROM "user"`;
  const res = await db.query(query);
  return res.rows;
};

exports.getUser = async (id) => {
  const query = `SELECT * FROM "user" WHERE id = ${id}`;
  const res = await db.query(query);
  return res.rows[0];
};

exports.createUser = async (name, email, password) => {
  const query = `INSERT INTO "user" (name, email, password) VALUES ('${name}', '${email}', '${password}') RETURNING *`;
  const res = await db.query(query);
  return res.rows[0];
};

exports.deleteUser = async (id) => {
  let query = `DELETE FROM task WHERE list_id IN (SELECT id FROM list WHERE user_id = ${id})`;
  await db.query(query);

  query = `DELETE FROM list WHERE user_id = ${id}`;
  await db.query(query);

  query = `DELETE FROM "user" WHERE id = ${id} RETURNING *`;
  const res = await db.query(query);
  return res.rows[0];
};

exports.updateUser = async (id, name, email, password) => {
  let query = `UPDATE "user" SET `;
  const updates = [];
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
  const res = await db.query(query);
  return res.rows[0];
};

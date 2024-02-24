const db = require("./database");

exports.getUser = async (email) => {
  const query = `SELECT * FROM "user" WHERE email = '${email}'`;
  const req = await db.query(query);
  return req.rows[0];
};

exports.getUserById = async (id) => {
  const query = `SELECT * FROM "user" WHERE id = '${id}'`;
  const req = await db.query(query);
  return req.rows[0];
}

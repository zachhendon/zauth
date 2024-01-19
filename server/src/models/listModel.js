const db = require("./database");

exports.getLists = async (user_id) => {
  const query = `SELECT * FROM list WHERE user_id = ${user_id}`
  const lists = await db.query(query);
  return lists.rows;
}

exports.createList = async (user_id, name) => {
  const query = `INSERT INTO list (user_id, name) VALUES (${user_id}, '${name}') RETURNING *`
  const list = await db.query(query);
  return list.rows[0];
}

exports.deleteList = async (list_id) => {
  let query = `DELETE FROM task WHERE list_id = ${list_id}`
  await db.query(query);

  query = `DELETE FROM list WHERE id = ${list_id} RETURNING *`
  const list = await db.query(query);
  return list.rows[0];
}

exports.updateList = async (list_id, name) => {
  const query = `UPDATE list SET name = '${name}' WHERE id = ${list_id} RETURNING *`
  console.log(query)
  const list = await db.query(query);
  return list.rows[0];
}
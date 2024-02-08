const db = require("./database");

exports.getTasks = async (list_id) => {
  const query = `SELECT * FROM task WHERE list_id = ${list_id}`;
  const tasks = await db.query(query);
  return tasks.rows;
};

exports.createTask = async (name, description, listId) => {
  const query = `INSERT INTO task (name, description, list_id) VALUES ('${name}', '${description}', '${listId}') RETURNING *`;
  const task = await db.query(query);
  return task.rows[0];
};

exports.deleteTask = async (id) => {
  const query = `DELETE FROM task WHERE id = ${id} RETURNING *`;
  const task = await db.query(query);
  return task.rows[0];
};

exports.updateTask = async (id, name, description, completed) => {
  let query = "UPDATE task SET ";
  const updates = [];
  if (name) {
    updates.push(`name = '${name}'`);
  }
  if (description) {
    updates.push(`description = '${description}'`);
  }
  if (completed != undefined) {
    updates.push(`completed = ${completed}`);
  }
  query += updates.join(", ");
  query += ` WHERE id = ${id} RETURNING *`;
  const task = await db.query(query);
  return task.rows[0];
};

const db = require("./database");

exports.createCode = async (
  codeChallenge,
  codeChallengeMethod,
  authCode,
  client_id,
  redirect_uri,
  user_id
) => {
  const query = `INSERT INTO code (code_challenge, code_challenge_method, authorization_code, client_id, redirect_uri, user_id) VALUES ('${codeChallenge}', '${codeChallengeMethod}', '${authCode}', '${client_id}', '${redirect_uri}', '${user_id}')`;
  await db.query(query);
};

exports.getCode = async (code) => {
  const query = `SELECT * FROM code WHERE authorization_code = '${code}'`;
  const token = await db.query(query);
  return token.rows[0];
};

exports.useCode = async (code) => {
  const query = `UPDATE code SET used = true WHERE authorization_code = '${code}'`;
  console.log(query);
  await db.query(query);
}

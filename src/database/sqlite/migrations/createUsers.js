const createUsers = `CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR,
  position VARCHAR,
  password VARCHAR,
  about VARCHAR,
  experience VARCHAR,
  techs VARCHAR
)`;

module.exports = createUsers;
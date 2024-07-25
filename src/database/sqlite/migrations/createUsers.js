const createUsers = `CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR,
  position VARCHAR,
  password VARCHAR,
  about VARCHAR,
  experience VARCHAR,
  techs VARCHAR
)`;

const createProjects = `CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  title VARCHAR,
  description TEXT,
  prototype_link VARCHAR,
  url_link VARCHAR,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
)`;

module.exports = { createUsers, createProjects };

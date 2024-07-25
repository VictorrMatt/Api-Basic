const sqliteConnection = require("../../sqlite/");
const { createUsers, createProjects } = require("./createUsers");

async function migrationsRun() {
  try {
    const db = await sqliteConnection();

    // Assegure que as SQLs estão concatenadas corretamente
    const schemas = [createUsers, createProjects].join(";");
    await db.exec(schemas);
  } catch (error) {
    console.error("Error running migrations:", error);
  }
}

module.exports = migrationsRun;

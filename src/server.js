const migrationsRun = require("./database/sqlite/migrations");
const sqliteConnection = require("./database/sqlite")

const express = require('express')
const app = express()

migrationsRun()
app.use(express.json());

app.get('/users/:id', async (req, res) => {
  let { id } = req.params

  const database = await sqliteConnection();

  const result = await database.get(
    "SELECT * FROM users WHERE id = (?)",
    [id]
  );

  res.send(result)
})

app.post('/users', async (req, res) => {
  let { name, position, password, about } = req.body

  const database = await sqliteConnection();

  if (!password || !position || !name) {
    return res.send({ "message": "Dados estão faltando." })
  }

  const result = database.run("INSERT INTO users(name, position, password) VALUES (?, ?, ?, ?)",
    [name, position, password, about]);

  res.send(result);
});

app.delete('/users/:id', async (req, res) => {
  let { id } = req.params
  let { password } = req.body

  const database = await sqliteConnection();

  if (!password) {
    return res.send({ "message": "Senha inválida." })
  }
  const result = await database.get(
    "SELECT * FROM users WHERE id = (?)",
    [id]
  );

  if (password != result.password) {
    return res.send({ "message": "Senha inválida." })
  }

  database.run("DELETE FROM users WHERE id = (?)",
    [id])

  res.send();
});

// Running
const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));
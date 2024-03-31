// Importação de módulos e configurações
const migrationsRun = require("./database/sqlite/migrations");
const sqliteConnection = require("./database/sqlite")
const express = require('express')
const app = express()

// Execução de migrações para inicializar o banco de dados
migrationsRun()

// Middleware para manipular JSON em requisições
app.use(express.json());

// Rota para obter um usuário pelo seu ID
app.get('/users/:id', async (req, res) => {
  let { id } = req.params

  // Conexão com o banco de dados SQLite
  const database = await sqliteConnection();

  // Consulta para obter um usuário pelo seu ID
  const result = await database.get(
    "SELECT * FROM users WHERE id = ?",
    [id]
  );

  // Envia o resultado como resposta
  res.send(result)
})

// Rota para criar um novo usuário
app.post('/users', async (req, res) => {
  let { name, position, password, about } = req.body

  // Conexão com o banco de dados SQLite
  const database = await sqliteConnection();

  // Verificação de dados faltando
  if (!password || !position || !name) {
    return res.send({ "message": "Dados estão faltando." })
  }

  // Inserir um novo usuário no banco de dados
  const result = database.run("INSERT INTO users(name, position, password, about) VALUES (?, ?, ?, ?)",
    [name, position, password, about]);

  // Envia o resultado como resposta
  res.send(result);
});

// Rota para excluir um usuário pelo seu ID
app.delete('/users/:id', async (req, res) => {
  let { id } = req.params
  let { password } = req.body

  // Conexão com o banco de dados SQLite
  const database = await sqliteConnection();

  // Verificação de senha inválida
  if (!password) {
    return res.send({ "message": "Senha inválida." })
  }

  // Consulta para obter um usuário pelo seu ID
  const result = await database.get(
    "SELECT * FROM users WHERE id = ?",
    [id]
  );

  // Verificação de senha
  if (password != result.password) {
    return res.send({ "message": "Senha inválida." })
  }

  // Exclui o usuário do banco de dados
  database.run("DELETE FROM users WHERE id = ?",
    [id])

  // Envia uma resposta vazia
  res.send();
});

// Inicia o servidor na porta 3000
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor está rodando na porta ${PORT}`));

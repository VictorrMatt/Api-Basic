// usersRoutes.js
const express = require('express');
const { hash, compare } = require("bcryptjs");
const sqliteConnection = require("../database/sqlite");

const router = express.Router();

// Obter usuário por ID
router.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  const database = await sqliteConnection();

  const result = await database.get("SELECT * FROM users WHERE id = ?", [id]);

  if (result) {
    if (result.techs) {
      result.techs = JSON.parse(result.techs);
    }
    delete result.password; // Remove a senha do resultado
  }

  res.status(result ? 200 : 404).send(result || { message: "Usuário não encontrado." });
});

// Criar novo usuário
router.post('/users', async (req, res) => {
  const { name, position, password, about, experience, techs } = req.body;
  const database = await sqliteConnection();

  if (!password || !position || !name) {
    return res.status(400).send({ message: "Dados estão faltando." });
  }

  const checkIfUserAlreadyExists = await database.get("SELECT * FROM users WHERE name = ?", [name]);

  if (checkIfUserAlreadyExists) {
    return res.status(400).send({ message: "O usuário já existe." });
  }

  const hashedPassword = await hash(password, 8);
  const techsJSON = JSON.stringify(techs);

  const result = await database.run(
    "INSERT INTO users(name, position, password, about, experience, techs) VALUES (?, ?, ?, ?, ?, ?)",
    [name, position, hashedPassword, about, experience, techsJSON]
  );

  res.status(201).send(result);
});

// Atualizar usuário
router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, position, password, new_password, about, experience, techs } = req.body;
  const database = await sqliteConnection();

  const user = await database.get("SELECT * FROM users WHERE id = ?", [id]);
  if (!user) {
    return res.status(404).send({ message: "Usuário não encontrado." });
  }

  const checkIfUserAlreadyExists = await database.get("SELECT * FROM users WHERE name = ?", [name]);

  if (checkIfUserAlreadyExists) {
    return res.status(400).send({ message: "O usuário já existe." });
  }

  if (!password) {
    return res.status(400).send({ message: "É necessário informar a senha para atualizar qualquer informação." });
  }

  const checkOldPassword = await compare(password, user.password);
  if (!checkOldPassword) {
    return res.status(400).send({ message: "A senha não confere." });
  }

  user.name = name ?? user.name;
  user.position = position ?? user.position;
  user.about = about ?? user.about;
  user.experience = experience ?? user.experience;
  user.techs = techs ? JSON.stringify(techs) : user.techs;
  user.password = new_password ? await hash(new_password, 8) : user.password;

  const result = await database.run(
    "UPDATE users SET name = ?, position = ?, password = ?, about = ?, experience = ?, techs = ? WHERE id = ?",
    [user.name, user.position, user.password, user.about, user.experience, user.techs, id]
  );

  res.status(200).send(result);
});

// Deletar usuário
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  const database = await sqliteConnection();

  if (!password) {
    return res.status(400).send({ message: "Senha inválida." });
  }

  const user = await database.get("SELECT * FROM users WHERE id = ?", [id]);
  if (!user) {
    return res.status(404).send({ message: "Usuário não encontrado." });
  }

  const isPasswordValid = await compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).send({ message: "Senha inválida." });
  }

  await database.run("DELETE FROM users WHERE id = ?", [id]);

  res.status(204).send();
});

module.exports = router;

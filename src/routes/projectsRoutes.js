const express = require('express');
const sqliteConnection = require("../database/sqlite");

const router = express.Router();

router.get('/projects/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const database = await sqliteConnection();

  const result = await database.all("SELECT * FROM projects WHERE user_id = ?", [user_id]);

  res.status(result.length ? 200 : 404).send(result.length ? result : { message: "Projetos não encontrados." });
});

router.post('/projects', async (req, res) => {
  const { user_id, title, description, prototype_link, url_link } = req.body;
  const database = await sqliteConnection();

  const checkIfUserExists = await database.get("SELECT * FROM users WHERE id = ?", [user_id]);

  if (!checkIfUserExists) {
    return res.status(404).send({ message: "Id de usuário inválido." });
  }

  const checkIfProjectAlreadyExists = await database.get("SELECT * FROM projects WHERE title = ?", [title]);

  if (checkIfProjectAlreadyExists) {
    return res.status(400).send({ message: "O projeto já existe." });
  }

  if (!user_id || !title || !description) {
    return res.status(400).send({ message: "Dados estão faltando." });
  }

  const result = await database.run(
    "INSERT INTO projects(user_id, title, description, prototype_link, url_link) VALUES (?, ?, ?, ?, ?)",
    [user_id, title, description, prototype_link, url_link]
  );

  res.status(201).send(result);
});

router.put('/projects/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, prototype_link, url_link } = req.body;
  const database = await sqliteConnection();

  const project = await database.get("SELECT * FROM projects WHERE id = ?", [id]);
  if (!project) {
    return res.status(404).send({ message: "Projeto não encontrado." });
  }

  const checkIfUserAlreadyExists = await database.get("SELECT * FROM projects WHERE title = ?", [title]);

  if (checkIfUserAlreadyExists) {
    return res.status(400).send({ message: "O projeto já existe." });
  }

  project.title = title ?? project.title;
  project.description = description ?? project.description;
  project.prototype_link = prototype_link ?? project.prototype_link;
  project.url_link = url_link ?? project.url_link;

  const result = await database.run(
    "UPDATE projects SET title = ?, description = ?, prototype_link = ?, url_link = ? WHERE id = ?",
    [project.title, project.description, project.prototype_link, project.url_link, id]
  );

  res.status(200).send(result);
});

router.delete('/projects/:id', async (req, res) => {
  const { id } = req.params;
  const database = await sqliteConnection();

  const project = await database.get("SELECT * FROM projects WHERE id = ?", [id]);
  if (!project) {
    return res.status(404).send({ message: "Projeto não encontrado." });
  }

  await database.run("DELETE FROM projects WHERE id = ?", [id]);

  res.status(204).send();
});

module.exports = router;
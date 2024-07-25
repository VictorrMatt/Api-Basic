const express = require('express');
const usersRoutes = require('./routes/usersRoutes');
const projectsRoutes = require('./routes/projectsRoutes');

const app = express();

const migrationsRun = require("./database/sqlite/migrations");
migrationsRun();

app.use(express.json());

app.use(usersRoutes);
app.use(projectsRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor está rodando na porta ${PORT}`));

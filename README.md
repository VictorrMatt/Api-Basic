## API de Gestão de Usuários e Projetos

**Descrição:**

Esta API RESTful, desenvolvida com Express.js e SQLite, oferece funcionalidades para gerenciar usuários e seus respectivos projetos. As operações CRUD (Create, Read, Update, Delete) estão disponíveis para ambos os recursos, garantindo flexibilidade e controle sobre os dados.

**Funcionalidades:**

* **Usuários:**
  * Criar novos usuários
  * Obter informações de usuários específicos
  * Atualizar informações de usuários existentes
  * Deletar usuários
* **Projetos:**
  * Criar novos projetos associados a um usuário específico
  * Obter informações de projetos específicos ou de todos os projetos de um usuário
  * Atualizar informações de projetos existentes
  * Deletar projetos

### Tabelas do Banco de Dados

#### Tabela users
| Coluna | Tipo de Dado | Descrição |
|---|---|---|
| id | INTEGER | Chave primária |
| name | TEXT | Nome do usuário |
| position | TEXT | Cargo do usuário |
| password | TEXT | Senha do usuário |
| about | TEXT | Sobre o usuário |
| experience | TEXT | Experiência do usuário |
| techs | TEXT (JSON) | Tecnologias do usuário (formato JSON) |

#### Tabela projects
| Coluna | Tipo de Dado | Descrição |
|---|---|---|
| id | INTEGER | Chave primária |
| user_id | INTEGER | Chave estrangeira referenciando a tabela users |
| title | TEXT | Título do projeto |
| description | TEXT | Descrição do projeto |
| prototype_link | TEXT | Link para o protótipo |
| url_link | TEXT | Link para o projeto final |

### Rotas Disponíveis

#### Rotas para users
* **GET /users/:id**
  * Descrição: Obter usuário por ID.
  * Parâmetros: id (INTEGER)
  * Resposta:
    * 200 OK: Usuário encontrado.
    * 404 Not Found: Usuário não encontrado.
* **POST /users**
  * Descrição: Criar novo usuário.
  * Parâmetros: name, position, password, about, experience, techs (ARRAY)
  * Resposta:
    * 201 Created: Usuário criado com sucesso.
    * 400 Bad Request: Dados faltando ou usuário já existe.
* **PUT /users/:id**
  * Descrição: Atualizar usuário.
  * Parâmetros: id, name, position, password, new_password, about, experience, techs (ARRAY)
  * Resposta:
    * 200 OK: Usuário atualizado com sucesso.
    * 400 Bad Request: Senha incorreta ou usuário já existe.
    * 404 Not Found: Usuário não encontrado.
* **DELETE /users/:id**
  * Descrição: Deletar usuário.
  * Parâmetros: id, password
  * Resposta:
    * 204 No Content: Usuário deletado com sucesso.
    * 400 Bad Request: Senha inválida.
    * 404 Not Found: Usuário não encontrado.

#### Rotas para projects
* **GET /projects/:user_id**
  * Descrição: Obter projetos por ID do usuário.
  * Parâmetros: user_id (INTEGER)
  * Resposta:
    * 200 OK: Projetos encontrados.
    * 404 Not Found: Projetos não encontrados.
* **POST /projects**
  * Descrição: Criar novo projeto.
  * Parâmetros: user_id, title, description, prototype_link, url_link
  * Resposta:
    * 201 Created: Projeto criado com sucesso.
    * 400 Bad Request: Dados faltando ou projeto já existe.
    * 404 Not Found: ID de usuário inválido.
* **PUT /projects/:id**
  * Descrição: Atualizar projeto.
  * Parâmetros: id, title, description, prototype_link, url_link
  * Resposta:
    * 200 OK: Projeto atualizado com sucesso.
    * 400 Bad Request: Projeto já existe.
    * 404 Not Found: Projeto não encontrado.
* **DELETE /projects/:id**
  * Descrição: Deletar projeto.
  * Parâmetros: id
  * Resposta:
    * 204 No Content: Projeto deletado com sucesso.
    * 404 Not Found: Projeto não encontrado.

### Relacionamento entre Tabelas
A tabela projects possui uma chave estrangeira user_id que referencia a tabela users. Isso significa que cada projeto está associado a um usuário específico.

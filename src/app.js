const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");
const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  // GET /repositories: Rota que lista todos os repositórios;
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {

  // POST /repositories: A rota deve receber title, url e techs dentro do corpo da requisição, 
  //      sendo a URL o link para o github desse repositório. 
  const { title, url, techs} = request.body;

  // Ao cadastrar um novo projeto, ele deve ser armazenado dentro de um objeto no seguinte formato:
  //  { id: "uuid", title: 'Desafio Node.js', url: 'http://github.com/...', techs: ["Node.js", "..."], likes: 0 };
  //  Certifique-se que o ID seja um UUID, e de sempre iniciar os likes como 0.
  const repository = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  // PUT /repositories/:id: A rota deve alterar apenas o título, a url e as techs do repositório 
  //                        que possua o id igual ao id presente nos parâmetros da rota;

  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repIndex = repositories.findIndex( repository => repository.id === id);
  if (repIndex < 0) {
     return response.status(400) .json({ error: "Repository not found."})
  };
  // guarda likes anterior para não perder a informação
  const newRep = repositories[repIndex];
  newRep.title = title;
  newRep.url = url;
  newRep.techs = techs;
  repositories[repIndex] = newRep;
 
  return response.json(newRep);
});

app.delete("/repositories/:id", (req, res) => {
  // DELETE /repositories/:id: A rota deve deletar o repositório com o id presente nos parâmetros da rota;
  const { id } = req.params;
  
  const repIndex = repositories.findIndex( repository => repository.id === id);
  if (repIndex < 0) {
     return res.status(400) .json({ error: "Repository not found."})
  };
  repositories.splice(repIndex, 1);
  return res.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  // POST /repositories/:id/like: A rota deve aumentar o número de likes do repositório específico
  //                              escolhido através do id presente nos parâmetros da rota, a cada 
  //                              chamada dessa rota, o número de likes deve ser aumentado em 1;
  const { id } = request.params;
  
  const repIndex = repositories.findIndex( repository => repository.id === id);
  if (repIndex < 0) {
     return response.status(400) .json({ error: "Repository not found."})
  };

  const repository = repositories[repIndex];

  repository.likes = repository.likes + 1;
  repositories[repIndex] = repository;
  
  return response.json(repository);
});

module.exports = app;

const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function checkRepositoryExist(req, res , next) {
  const { id } = req.params;
  
  const repositoryExist = repositories.find(r => r.id === id);
  
  if(!repositoryExist) {
    return res.status(400).send();
  }
  
  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);

});

app.post("/repositories", (request, response) => {

  const { title,url, techs } = request.body;

  const repository = { 
    id:uuid(),
    title,
    url , 
    techs,
    likes: 0
  };
  repositories.push(repository);

  return response.json(repository);


});

app.put("/repositories/:id",(request, response) => {

  const { id } = request.params;
  const { title,url, techs, likes } = request.body;

  const repositoryIndex = repositories.findIndex(r => r.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).send({error: 'Repository does not found '});
  }
  if(likes) {
    return response.status(400).json({likes: 0});
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);

});

app.delete("/repositories/:id", checkRepositoryExist ,(request, response) => {

  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(r => r.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).send({error: 'Repository does not found '});
  }

  repositories.splice(repositoryIndex, 1);  

  return response.status(204).send();

});

app.post("/repositories/:id/like", checkRepositoryExist ,(request, response) => {

  const { id } = request.params;

  const repository = repositories.find(r => r.id === id);

  repository.likes += 1;
  
  return response.json(repository);
});

module.exports = app;

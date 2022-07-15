const http = require("http");
require("dotenv").config();
const express = require("express");
const { response } = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

morgan.token("content", (required) => JSON.stringify(required.body));

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :content"
  )
);

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/info", (request, response) => {
  Person.countDocuments().then((result) => {
    response
      .send(
        `<p>The phonebook has info for ${result} people.</p><p>${new Date()}</p>`
      )
      .end();
  });
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      response.status(500).end();
    });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id).then(() => {
    response.status(204).end();
  });
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Some content is missing",
    });
    // } else if (person.find((element) => element.name === body.name)) {
    //   return response.status(400).json({
    //     error: "That name already exists in the phonebook",
    //   });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.put("/api/persons/:id", (request, response) => {
  const body = request.body;
  const id = request.params.id;
  const person = { name: body.name, number: body.number };

  Person.findByIdAndUpdate(id, person).then((updatePerson) => {
    response.json(updatePerson);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

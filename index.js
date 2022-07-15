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

// let persons = [
//   {
//     id: 1,
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: 2,
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: 3,
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: 4,
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

// const randomIdMaker = () => {
//   const maxNumber = 150;
//   const randomNumber = Math.floor(Math.random() * maxNumber + 1);
//   return randomNumber;
// };

// const generateId = () => {
//   const maxId = persons.length > 0 ? randomIdMaker() : 0;
//   return maxId + 1;
// };

// const countPeople = () => {
//   return persons.length;
// };

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
  // const id = Number(request.params.id);
  // const person = persons.find((person) => person.id === id);

  // if (person) {
  //   response.json(person);
  // } else {
  //   response.status(404).end();
  // }

  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.find((person) => person.id !== id);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Some content is missing",
    });
    // } else if (persons.find((element) => element.name === body.name)) {
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

  Person.findByIdAndUpdate(id, person).then((newPerson) => {
    response.json(newPerson);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

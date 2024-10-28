const express = require("express");
const cors = require("cors");
const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv")
dotenv.config()
const app = express();
app.use(
  cors({
    origin: `${process.env.BASE_URL}/`, //different front-end url
    methods: ["GET", "POST", "PUT", "DELET"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

let persons = [
  {
    id: "1",
    name: "Sam",
    age: "26",
    hobbies: [],
  },
]; //This is your in memory database
app.set("db", persons);

//validate data using given library callrd "Joi"
const dbSchema = Joi.object({
  name: Joi.string().required(),
  age: Joi.number().required(),
  hobbies: Joi.array().items(Joi.string()), //array of strings validation
});

//TODO: Implement crud of person

//get all persons data .... [written by]"https://henok-em.netlify.app" 😊
app.get("/persons", (req, res) => {
  const data = app.get("db");
  if (data) {
    res.status(202).json({
      success: true,
      data,
      error: null,
    });
  } else {
    res.status(404).json({
      success: false,
      data: null,
      error: { msg: "can not get" },
    });
  }
});

// get unique person fron db
app.get("/persons/:id", (req, res) => {
  const { id } = req.params;
  const data = app.get("db").find((i) => i.id === id);
  if (data) {
    res.json({
      success: true,
      data: data,
      error: null,
    });
  } else {
    res.status(404).json({
      success: false,
      data: null,
      error: {
        msg: `server can not get data with id of ${id}`,
      },
    });
  }
});

// add new data to the db ... [written by]"https://henok-em.netlify.app" 😊
app.post("/persons", (req, res) => {
  const { error, value } = dbSchema.validate(req.body);
  const id = uuidv4(); // will generate unique id
  const person = app.get("db").find(i => i.id === id)
  if(person) return res.send({error: "id error on server please try again"})
  // handle error
  if (error) {
    return res.status(400).json({
      success: false,
      data: null,
      error: {
        msg: `validation error: ${error.details[0].message}`,
      },
    });
  }
  newData = {
    id: id,
    name: value.name,
    age: value.age,
    hobbies: value.hobbies || [], //if not setted ... [written by]"https://henok-em.netlify.app" 😊
  };
  try {
    persons.push(newData);
    res.status(200).json({
      success: true,
      data: newData,
      error: null,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      data: null,
      error: {
        msg: "couldn't finish",
      },
    });
  }
});

// update a db row
app.put("/persons/:id", (req, res) => {
  const { id } = req.params;
  const { error, value } = dbSchema.validate(req.body);
  //handle error

  if (error) {
    res.status(400).json({
      success: false,
      data: null,
      error: { msg: `validation error: ${error.details[0].message}` },
    });
  }

  const person = app.get("db").find((item) => id === item.id);
  if (person) {
    person.name = value.name || person.name;
    person.age = value.age || person.age;
    person.hobbies = value.hobbies || person.hobbies;
    res.status(202).send("you have successfully updated the person ✔");
  } else {
    res.status(404).json({
      success: false,
      data: null,
      error: `can not get an the person`,
    });
  }
});

// delete a single data
app.delete("/persons/:id", (req, res) => {
  const { id } = req.params;
  const idx = persons.findIndex((item) => item.id === id);
  //handle if the index not found
  if (idx === -1) {
    return res.status(404).json({
      success: false,
      data: null,
      error: { msg: `the server couldn't find person for ${id}` },
    });
  } else {
    //delete fron the array using "splice" array method ...  [written by]"https://henok-em.netlify.app" 😊
    persons.splice(idx, 1);
    res.status(202).send("you have successfully deleted a person ✔")
  }
});

if (require.main === module) {
  app.listen(3000);
}
module.exports = app;

const express = require("express");
const session = require("express-session");
var cors = require("cors");
const User = require("./models/user");
var bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const { request, response } = require("express");

mongoose
  .connect(
    "mongodb+srv://abmeziane:ky1wV5DYOhrRIZjV@films.egl3klz.mongodb.net/films?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Successfully connected to DB!");
  })
  .catch((error) => {
    console.log("Unable to conntect to DB!");
    console.error(error);
  });

app.use(cors({ credentials: true, origin: "http://localhost:4200" }));
app.use(bodyParser.json());

app.use(
  session({ secret: "mySecretKey", cookie: { maxAge: 24 * 60 * 60 * 1000 } })
);

//Login
app.post("/login", (request, response) => {
  User.findOne(
    { login: request.body.login, password: request.body.password },
    (error, user) => {
      if (error) return response.status(401).json({ msg: "Error" });
      if (!user) return response.status(401).json({ msg: "Wrong Login" });
      request.session.userId = user._id;
      response.status(200).json({ login: user.login, fullName: user.fullName });
    }
  );
});

//Register
app.post("/register", (request, response) => {
  var newUser = new User({
    login: request.body.login,
    password: request.body.password,
    fullName: request.body.fullName,
  });
  console.log(newUser);
  User.countDocuments({ login: newUser.login }, function (err, count) {
    if (err) return response.status(401).json({ msg: "Error Inscription" });
    if (count > 0) {
      return response.status(409).json({ msg: "This login already exists" });
    } else {
      newUser.save((error, user) => {
        if (error) return console.error(error);
        request.session.userId = user._id;
        response
          .status(200)
          .json({ login: user.login, fullName: user.fullName });
      });
    }
  });
});

app.get("/test", (request, response) => {
  response.json({ data: "test" });
});

//Logout
app.get("/logout", (request, response) => {
  request.session.destroy((error) => {
    if (error) return response.status(409).json({ msg: "error" });
    response.status(200).json({ msg: "Logout OK" });
  });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

app.get("/islogged", (request, response) => {
  if (!request.session.userId) return response.status(401).json();

  User.findOne({ _id: request.session.userId }, (error, user) => {
    if (error) return response.status(401).json({ msg: "Error" });
    if (!user) return response.status(401).json({ msg: "Error" });
    request.session.userId = user._id;
    response.status(200).json({ login: user.login, fullName: user.fullName });
  });
});

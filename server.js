const express = require("express");
const app = express();
var cors = require("cors");
var bodyParser = require("body-parser");
const Film = require("./models/film");
const mongoose = require("mongoose");
const session = require("express-session");
const User = require("./models/user");
const { response } = require("express");

// app.use(
//   session({ secret: "mySecretKey", cookie: { maxAge: 24 * 60 * 60 * 1000 } })
// );

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

app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.set("Access-Control-Allow-Headers", "X-Requested-With", "content-type");
  res.set("Access-Control-Allow-Credentials", true);
  next();
});

app.use((req, res, next) => {
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({ credentials: true, origin: "htpp://localhost:4200" }));

let films = [];

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

app.post("/login", (request, response) => {
  User.findOne(
    { login: request.body.login, password: request.body.password },
    (error, user) => {
      if (error) return response.status(401).json({ msg: "Error" });
      if (!user) return response.status(401).json({ msg: "Wrong login" });
      request.session.userId = user._id;
      response.status(200).json({ login: user.login, fullName: user.fullName });
    }
  );
});

app.post("/register", (request, response) => {
  var newUser = new User({
    login: request.body.login,
    password: request.body.password,
    fullName: request.body.fullName,
  });

  User.countDocuments({ login: newUser.login }, function (err, count) {
    if (err) return response.status(401).json({ msg: "Error" });
    if (count > 0) {
      return response.status(409).json({ msg: "Error" });
    } else {
      newUser.save((error, user) => {
        if (error) return console.error(err);
        request.session.userId = user._id;
        response
          .status(200)
          .json({ login: user.login, fullName: user.fullName });
      });
    }
  });
});

app.get("/logout", (request, response) => {
  request.session.destroy((error) => {
    if (error) return response.status(409).json({ msg: "error" });
    response.status(200).json({ msg: "Logout Ok" });
  });
});

app.get("/islogged", (request, response) => {
  if (!request.session.userId) return res.status(401).json();

  User.findOne({ _id: request.session.userId }, (error, user) => {
    if (error) return response.status(401).json({ msg: "Error" });
    if (!user) return response.status(401).json({ msg: "Error" });
    request.session.userId = user._id;
    response.status(200).json({ login: user.login, fullName: user.fullName });
  });
});

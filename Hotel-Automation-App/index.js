var express = require("express");
var mongoose = require("mongoose");
var app = express();
const https = require("https");
const bodyParser = require("body-parser");
//Set view engine to EJS
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

// -----------COnnection to DataBase ---------------------- //
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
//Connect to MongoDB
mongoose.connect(
  "mongodb+srv://dbuser:qwe123@cluster0.ueb1t.mongodb.net/hotel?retryWrites=true&w=majority"
);
//Verify connection
mongoose.connection
  .once("open", function () {
    console.log("Connection  to DB has been made");
  })
  .on("error", function () {
    console.log("Connection to DB error");
  });

//----------------var_declarations---------------------------//
let users = require("./models/user");
const userProcess = require("./src/processAuthReq");

let reservations = require("./models/reservations");
const reservProcess = require("./src/processReservationReq");

let rooms = require("./models/rooms");

var availableRooms = [
  //for testing of sending a list of available rooms
  {
    roomType: "Single",
    nrPerson: "1",
    price: "200",
  },
  {
    roomType: "Double Room",
    nrPerson: "2",
    price: "300",
  },
  {
    roomType: "Triple Room",
    nrPerson: "3",
    price: "400",
  },
  {
    roomType: "Premium Room",
    nrPerson: "3",
    price: "600",
  },
];
//-----------------------------------------------------------//

//Showing login form
app.get("/", function (req, res) {
  res.render("login");
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/security-code", function (req, res) {
  res.render("security-code");
});

//----guest
app.get("/home-page", function (req, res) {
  res.render("home-page");
});
app.get("/my-reservations", function (req, res) {
  const params = req.param("reservations");
  let urlDecode = JSON.parse(params);
  res.render("my-reservations", {
    reservations: urlDecode,
  });
});

app.get("/find-option", function (req, res) {

  const params = req.param("rooms");
  let urlDecode = JSON.parse(params);
  res.render("find-option", {
    rooms: urlDecode,
  });
});

//--- admin
app.get("/rooms", function (req, res) {
  res.render("rooms");
});

// ------- post methods -------- //

// --- Authentication
app.post("/login", function (req, res) {
  console.log("login");
  userProcess.loginRequest(req, res, users).then((value) => {
    console.log("login done: " + value);
  });
});

app.post("/security-code", function (req, res) {
  userProcess.securityCodeRequest(req, res, rooms);
});

app.post("/home-page", function (req, res) {
  reservProcess.getAllAvailableRoomsForInterval(req, res, reservations, rooms);
});
app.post("/reserve", function (req, res) {
  reservProcess.addReservation(req, res, reservations);
});

app.post("/my-reservations", function (req, res) {
  console.log("In my reservation");
  reservProcess.getAllReservationForUser(res, reservations, rooms);
  // reservProcess.getAllReservationForUser(res, reservations, rooms).then((value) => {
  //   console.log("my reservation: " + value);
  // });
});

// ---------------------------- //

app.listen(process.env.PORT || 3000, function () {
  console.log("Example app listening on port 3000!");
});

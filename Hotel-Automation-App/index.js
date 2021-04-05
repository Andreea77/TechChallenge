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
const userProcess = require('./src/processAuthReq');

let reservations = require("./models/reservations");
const reservProcess = require('./src/processReservationReq');

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
app.get("/home-page", function (req, res) {
  res.render("home-page");
});
app.get("/rooms", function (req, res) {
  res.render("rooms");
});

app.get("/home-page", function (req, res) {
  res.render("home-page");
});
app.get("/my-reservations", function (req, res) {
  res.render("my-reservations");
});

//-------------------------------------//
// utils !! TEMPORARY
async function getNrRooms()
{
  let nrRooms = ((await rooms.find()).length);

  const newRoom = new rooms(
    {
      roomId: ( nrRooms + 1),
      roomNumber: (101 + nrRooms),
      type: "Single",
      status: 0,
      price: 35.5
    });
  newRoom.save(function (err) {
    if (err) {
      console.log("ERROR in [insertRoomsInDB]: " + err);
    }
    // saved!
  });
}



//------------------------------------//

// ------- post methods -------- //

// --- Authentication
app.post("/login", function (req, res) {
  userProcess.loginRequest(req, res, users);

  // just test
  reservProcess.getAllAvailableRoomsForInterval(reservations, rooms);

  // getNrRooms();
});
// TESTING FOR FIND OPTION BUTTON ON HOME PAGE
app.post("/home-page", function (req, res) {
  res.render("find-option", {
    rooms: availableRooms,
  });
});

app.post("/security-code", function (req, res) {
  userProcess.securityCodeRequest(req, res);
});

// ---------------------------- //

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});

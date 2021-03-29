var express = require("express");
var mongoose = require("mongoose");
var app = express();
const https = require("https");
const bodyParser = require("body-parser");

//Set view engine to EJS
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

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

var User = require("./models/user");

//-----------------------------------------------------------//

//Showing login form
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/security-code", function (req, res) {
  res.render("security-code");
});
app.get("/home-page", function (req, res) {
  res.render("home-page");
});

app.post("/login", function (req, res) {
  var _username = req.body.username;
  var _password = req.body.password;
  User.find({}, function (err, profiles) {
    console.log(profiles);
  });

  User.findOne({ username: _username }, function (err, user) {
    if (err) {
      console.log(err);
      return res.render("login");
    }
    if (user != null && user.password === _password) {
      console.log("Success!");
      return res.render("secret");
    }

    console.log("Not such user and pass!");
    return res.render("login");
  });
});

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});

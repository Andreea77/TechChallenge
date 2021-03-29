var express = require("express");
var mongoose = require("mongoose");
var app = express();
const https = require("https");
const bodyParser = require("body-parser");
//Set view engine to EJS
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//Connect to MongoDB
mongoose.connect("mongodb://localhost/testDB");
//Verify connection
mongoose.connection
  .once("open", function () {
    console.log("Connection  to DB has been made");
  })
  .on("error", function () {
    console.log("Connection to DB error");
  });

app.get("/login", function (req, res) {
  res.render("login");

  // si la app.get('/:userQuery'');
  //res.render('testEJS',{ data:  {userQuery: req.params.userQuery,  searchResults : ['Book1','Book2','Book3']) }} ;
});

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});

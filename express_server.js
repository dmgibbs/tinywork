var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
    // passing data to template which expects a value pair

app.set ("view engine" , "ejs");
const bodyParser = require("body-parser"); //to access POST request params. eg. req.body.longURL
app.use(bodyParser.urlencoded({extended: true}));

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase};
  res.render("urls_index", templateVars);      // Use template file urls_index.ejs located in views folder
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id };
  res.render("urls_show", templateVars);
});






app.get("/Testthis",(req,res) => {
  let newVars = { greeting: "Hello i'm testing this !!"};
  res.render("hello_world",newVars );

});


app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
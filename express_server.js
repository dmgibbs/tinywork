var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
    // passing data to template which expects a value pair

app.set("view engine", "ejs");
const bodyParser = require("body-parser"); //to access POST request params. eg. req.body.longURL
app.use(bodyParser.urlencoded({extended: true}));

function generateRandomString()
{
  var tmpStr ="";

  tmpStr = Math.random().toString(36).replace('0.','');
  final = tmpStr.slice(0,5);
  console.log(final);
  return final;
}



var urlDatabase = {
  b2xVn2: 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
  'damion':'http://www.yahoo.com'
};

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase};
  console.log(urlDatabase);
  res.render("urls_index", templateVars);      // Use template file urls_index.ejs located in views folder
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
// nthis captures everything else
app.get("/urls/:id", (req, res) => {
  let templateVars = { shortUrl: req.params.id,
                       longUrl : urlDatabase[req.params.id] };

  res.render("urls_show", templateVars);
});


app.get("/Testthis",(req,res) => {
  let newVars = { greeting: "Hello i'm testing this !!"};
  res.render("hello_world",newVars );

});


app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});



app.post("/urls", (req, res) => {
  console.log(req.body);  // debug statement to see POST parameters
  console.log(req.body.longURL); // show the long URL.
  let longUrl = req.body.longURL;
  let shortUrl = "someShortString";
  urlDatabase[shortUrl]= longUrl;
  //res.send("Ok");         // Respond with 'Ok' (we will replace this)
  res.redirect("urls");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


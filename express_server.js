var express = require("express");
var cookieParser = require('cookie-parser')

var app = express();
app.use(cookieParser());

var PORT = 8080; // default port 8080
    // passing data to template which expects a value pair

app.set("view engine", "ejs");
const bodyParser = require("body-parser"); //to access POST request params. eg. req.body.longURL
app.use(bodyParser.urlencoded({extended: true}));

function generateRandomString()
{
  var tmpStr ="";

  tmpStr = Math.random().toString(36).replace('0.','');
  final = tmpStr.slice(0,6);
  return final;
}

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
 "user3RandomID": {
    id: "user3RandomID",
    email: "anext1@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user4RandomID": {
    id: "user4RandomID",
    email: "thisguy@example.com",
    password: "deeswasher-slums"
  }
}

var urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
  'd62m3k':'http://www.yahoo.com',
  'g4YbR9':'http://www.altavista.com'
};


function isEmpty(str){
  return (str==="") || (str=== undefined);
}

function foundInDB(DB,key){
// searches for an item in an list of objects.
//returns true if key is found; false otherwise.
  var found   = false;
  var myKeys  = Object.keys(DB);  // get a list of keys of the Obj
  var sameKey = myKeys.indexOf(key) ;

  if (sameKey !== -1){   // -1 means not in list.
    console.log("i found same key");
    found = true;
  }
  return found;
}


app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  //let userObj = {username: req.cookies.username};
  // show the user object.

  console.log(req.params.username);
  let templateVars = { username:req.cookies.username , urls: urlDatabase};
  res.render("urls_index", templateVars);      // Use template file urls_index.ejs located in views folder
});

app.get("/urls/new", (req, res) => {
  let templateVars = { username:req.cookies.username,
                       url: urlDatabase
                     };
  res.render("urls_new",templateVars);
});

// this captures everything else
app.get("/urls/:id", (req, res) => {
  let templateVars = { username:req.cookies.username,
                       shortUrl: req.params.id,
                       longUrl : urlDatabase[req.params.id] };
  res.render("urls_edit", templateVars);
});

app.get("/u/:shortUrl", (req, res) => {
  let longUrl = urlDatabase[req.params.shortUrl];
  if (longUrl === undefined)  {
    res.send("Unable to find key supplied") ;
  }
  else  {  res.redirect(longUrl);}

});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/login", (req, res) => {
});

app.get("/register", (req, res) => {
  console.log("hit register routine");
  res.render("register");
});

app.post("/login", (req, res) => {
  console.log("login  post called");
  console.log(req.body.name);
  res.cookie('username',req.body.name);
  res.redirect("/urls");
});



app.post("/urls", (req, res) => {

  let longUrl = req.body.longURL;
  let shortUrl = generateRandomString();
  console.log(shortUrl);
  urlDatabase[shortUrl]= longUrl;
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  //console.log("edit called with : "+ req.params.id);
  var longUrl = req.body.longUrl;

  urlDatabase[req.params.id] = longUrl;
  //console.log("current longurl: " +urlDatabase[req.params.id]);
  res.redirect("/urls");

});

app.post("/logout", (req, res) => {
  res.cookie("express.sid", "", { expires: new Date() });
  res.clearCookie('username');
  res.redirect("/urls");

});

app.post("/register", (req, res) => {
  var bad_data = false;
  var uid = generateRandomString();  // get a random Id
  res.cookie('username',uid); // store this in cookie
  userEmail = req.body.email;
  userPass = req.body.password;
  if (isEmpty(userEmail) || isEmpty(userPass)){
    res.status(401).send("Cannot find email or password.");
    bad_data = true;
  }
  if (foundInDB(userEmail)){
      res.status(401).send("Email already exists in Db.");
      console.log('attempt to save on existing email. ')
      bad_data = true;
  }
  if (!bad_data) {
  // dump all contents to the users object
    users[uid]= {id: uid, email: userEmail, password: userPass}
    console.log('DIdnt find the email in list')
    console.log(users);
    res.redirect("/urls");
  }
});


app.post("/urls/:id/delete", (req, res) => {
  let shortUrl = req.params.id;

  delete urlDatabase[shortUrl];
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

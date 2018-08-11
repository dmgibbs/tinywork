var express = require("express");
var cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs');

var app = express();
app.use(cookieParser());

var flag = false;
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
  "b2xVn2": {
    id: "b2xVn2",
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
  },
  "usr33RndomID":{
    id: "usr33RndomID",
    email: "fatjoe@tims.com",
    password: "aaa"
  }
}

var urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca' ,
  '9sm5xK': 'http://www.google.com' ,
  'd62m3k': 'http://www.yahoo.com',
  'g4YbR9': 'http://www.altavista.com'
};

var urlDatabase2 = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca",
              userid: "user3RandomID"},
  "9sm5xK": {longURL: "http://www.google.com",
            userid: "user4RandomID"},
  "b2xVn2": {longURL: 'http://www.lighthouselabs.ca',
            userid: "b2xVn2"},
  "9sm5xK": {longURL: "http://www.google.com",
            userid: "user2RandomID"},
  "3gDkE4": {longURL: "http://www.yahoo.com",
            userid: "user4RandomID"}
};
/*-------------------------------------------------------*/
var urlDB = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca",
             userid: "user3RanID"},
  "9sm5x7": {longURL: "http://www.google.com",
             userid: "usr5RandomID"},
  "b2xVn9": {longURL: "http://www.lighthouselabs.ca",
             userid: "b2xVn2"},
  "9te5xK": {longURL: "http://www.google.com",
             userid: "user2RandomID"},
  "3gDkE4": {longURL: "http://www.yahoo.com",
             userid: "user4RandomID"}
};

/*---------------------------------------------------------*/
function  urlsForUser(userid){
var list = {};
  for (var item in urlDB)
  {
    if (urlDb[item].userid === userid){
      list[item] = urlDB[item].longURL;
    }
  }
  //console.log("This user has this list of items:",list);
  return list;
}

function isEmpty(str){
  return (str==="") || (str=== undefined);
}

function foundEmail(DB,themail){
// searches for an item in an list of objects.
//returns true if key is found; false otherwise.
  var found = false;
  for (var key in DB){
    if (DB[key].email === themail){
      found = true;
    }
  }
  return found;
}

function foundPass(DB,passwd){
// searches for an item in an list of objects.
//returns true if key is found; false otherwise.
  var found = false;

  for (var key in DB){
    console.log("pass from file:",DB[key].password);
    if (DB[key].password ===passwd){
      found = true;
      console.log("found password for current user in db.")
    }
  }
//  console.log("encrypted from user",makeHashed(passwd));
  return found;
}

function makeHashed(string){
  return bcrypt.hashSync(string,10);
}

function passCheck(original, hash){
  return bcrypt.compareSync(original,hash);
}

function filterUrls(theDB, userId){
// Parse the url List and return all short and long urls for that user
  var mylist = {};

  var keys = Object.keys();

  for (var i=0;i < keys.length; i++)  {
    let theId = theDB[keys[i]].uid;
    if (theId === userId)
      mylist[keys[i]] = theDB[keys[i]].url;
  }
  return mylist;
}


function getUserObj(id){
// using the cookie information, return an object storing the user information
//return an empty object or return an object with info found from user table
  var user  = {};
  tmp = Object.values(id); // return an array of data with that key.
  if(!tmp) return [];
  else
    return tmp;
}

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
    // console.log("cookie obj: "+req.cookies.user_id);
    if (req.cookies && req.cookies.user_id) {
      console.log(" cookies made."+ req.cookies.user_id);

      var  userid = req.cookies.user_id;
      var userObject = {id: userid, info:"something.com"};
      let templateVars = {user: userObject, urls:urlDatabase};
      console.log("sending templatevars =",templateVars);
      res.render("urls_index", templateVars);      // Use template file urls_index.ejs located in views folder
    }
    else{
      res.redirect("/login");
    }
});

app.get("/urls/new", (req, res) => {

  var  userid = req.cookies.user_id;
  var userObject = {id: userid,info:"something.com"};
  let templateVars = {user:userObject, urls:urlDatabase};
  // if user's cookie is not set then redirect to  /login
  if (!userid) {
    console.log("redirect to login since no cookie found");
    res.render("login");
  }
  else { res.render("urls_new",templateVars);}
});

// this captures everything else
app.get("/urls/:id", (req, res) => {
  var  userid = req.cookies.user_id;
  var userObject = {id: userid,info:"something.com"};
  let templateVars = { user:userObject,shortUrl: req.params.id,longUrl : urlDatabase[req.params.id] };

  res.render("urls_edit", templateVars);
});

app.get("/u/:shortUrl", (req, res) => {
  let longUrl = urlDatabase[req.params.shortUrl];
  if (longUrl === undefined)  {
    res.send("Unable to find key supplied") ;
  } else  { res.redirect(longUrl);}  // is this correct ???
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/login", (req, res) => {
  console.log('Login called !!');
  // if cookie exists then send them to /urls
  // else if no cookie -- then redirect them to login page.
  if (req.cookies.user_id) {
    var  userid = req.cookies.user_id;
    var userObject = {user: userid,info:"something"};
    res.render("urls",userObject);
  } else {
    var  userid = "guest";
    var userObject = {id: userid,info:"something.com"};
    let templateVars = { user:userObject};
    res.render("login",templateVars);
  }
});

app.get("/register", (req, res) => {
   res.render("register");
});

app.post("/login", (req, res) => {
  console.log("login  post called: cookie:"+req.cookies.user_id );
  console.log(req.body, res.params);
  var userEmail = req.body.email;
  var userPass = req.body.password;
  console.log("request body stores : ", req.body);
  if  (foundEmail(users, userEmail) && foundPass(users,userPass)){
    var uid  = generateRandomString();
    console.log("found email and pass");
    res.cookie('user_id',uid);
    users[uid]= {id: uid, email: userEmail, password: userPass};
    console.log(" pass + email found");
    res.redirect("/urls");
    return;
  } 
  else if ( foundEmail(users,userEmail) && !foundPass(users,userPass)){
    console.log(" email found, pass bad");
    res.redirect("/login");
    return;
  } else { // some other error. 
      console.log(" called because of error with password/email..");
      res.redirect("/login");
      return;
    } /* ends the else */
  });

app.post("/urls", (req, res) => {
  let longUrl = req.body.longURL;
  let shortUrl = generateRandomString();
  console.log(shortUrl);
  urlDatabase[shortUrl]= longUrl;
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  var longUrl = req.body.longUrl;
  urlDatabase[req.params.id] = longUrl;
  //console.log("current longurl: " +urlDatabase[req.params.id]);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  flag = false;
  res.cookie("express.sid", "", { expires: new Date() });
  res.clearCookie('user_id');
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  var userEmail = req.body.email;
  var userPass = req.body.password;
  console.log ("hash of aaa : ",makeHashed("aaa"));
  console.log("captured pass hashed:",userPass);
  //var username = req.body.name;
  
  var user = req.body;
  if (userEmail === "fatjoe@tims.com" || userEmail === "john123@gmail.com")
    flag = true;
  if (foundEmail(users,userEmail)) {
      res.status(400);
      console.log("attempting register on existing email")
      res.redirect("/login");
      return;
  }
  else if (isEmpty(userEmail) || isEmpty(userPass)){
    res.status(401);
    console.log(" attempt to registering but email or pass empty");
    res.redirect("/register");
    return;
  }
  else if (!foundEmail(users,userEmail)) {
    // got this far; all ok - dump all contents to the users object
    console.log("didnt find email or password.. creating user..");
    //res.cookie('user_id',uid); // store this in cookie
    //console.log("creating cooking :");
    //console.log(res.cookie);
    users[uid]= {id: uid, email: userEmail, password: userPass};
    console.log("Registered new user .. directing to login");
   // console.log(users);
    res.redirect("/login");
  }
});


app.post("/urls/:id/delete", (req, res) => {
  let shortUrl = req.params.id;
  delete urlDatabase[shortUrl];
  res.redirect("/urls");
});


// making new Url
// check if registered and logged in.
app.post("/urls/new",(req,res) => {
  console.log("request for new url entered");
  
  res.redirect("/urls");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
  //users = hashDB(users);   // parse existing list of users and adjust their passwords
});

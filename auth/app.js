
// JavaScript Libraries
var express = require('express');
var path = require('path');
var logger = require('morgan');
var exec = require('child_process').exec;
var bodyParser = require('body-parser');
var app = express();
var bcrypt = require('bcrypt');
var mysql = require('mysql');

const saltRounds = 10;
const https = require('https');
const fs = require('fs');
// const credsFile = '../../credentials.txt'
const credsFile = "../../localCredentials.txt"

// const options = {
//   key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
//   cert: fs.readFileSync('test/fixtures/keys/agent2-cert.pem')
// };

var connection;

fs.readFile(credsFile, 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
  var creds = data.split("\n");
  console.log("cred 0: "+creds[0])
  console.log("cred 1: "+creds[1])
  console.log("cred 2: "+creds[2])
  console.log("cred 3: "+creds[3])
  
  connection = mysql.createConnection({
    host     : creds[0],
    user     : creds[1],
    password : creds[2],
    database : creds[3]
  });

  connection.connect();

  connection.query('SELECT * FROM creds', function (err, results, fields) {
    if (err) throw err;
    console.log('creds size: ', results.length);
  });

  // call this on shutdown
  // use one connection or multiple??
  // connection.end();
});


app.use(logger('dev'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(3000, function () {
  console.log('authentication server listening on port 3000...');
});

// POST method route
app.post('/register', function (req, res) {
  console.log("register");
  console.log("username: "+req.body.username);
  console.log("password: "+req.body.password);

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // Store hash in your password DB. 
    console.log("hash: ", hash);

    var userdata  = {username: req.body.username, password: hash};
    console.log("userdata: ",userdata);
    var query = connection.query('INSERT INTO creds SET ?', userdata, function(err, result) {
      if (err){
        console.log("register error:", err);
        console.log("error code: ", err["code"]);
        if(err["code"] === "ER_DUP_ENTRY"){
          res.send(500, "Registration failed: Username already exists.");
        } else{
        res.send(500, "Registration failed: Unkown error.");
        }
        //throw err; //comment this out to prevent crashes.. (e.g., duplicate user error should not crash)
      } else{ 
        console.log("finished query.");
        res.send(200);
      }
    });

  });

  //res.send(500); // don't put this here, async will return immediately
})


// POST method route
app.post('/login', function (req, res) {
  // Load hash from your password DB. 
  console.log("username: "+req.body.username);
  console.log("password: "+req.body.password);

  connection.query('SELECT password FROM creds where username = ?', req.body.username, function (err, results, fields) {
    if (err){
      console.log("Log in error: ",err);
      res.send(401); // unauthorized
    }
    else{
      console.log('results size: ', results.length);
      if(results.length === 0){ // username not found
        res.send(401); // unauthorized
        return;
      }
      var hash = results[0]["password"].toString();
      console.log("hash: ",hash);
      bcrypt.compare(req.body.password, hash, function(authErr, auth) {
        // auth == true
        if (authErr){
          console.log("Auth error: ",authErr);
          res.send(401);
        }
        if (auth == true){ // sucess
          console.log("Login successful!");
          res.send(200); // success
        } else{ // fail
          console.log("Username or password does not match.");
          res.send(401); // unauthorized
        }
      });
    }
  });
})

// https.createServer(options, (req, res) => {
//   res.writeHead(200);
//   res.end('hello world\n');
// }).listen(8443);



//TODO:
// read in mysql credentials
// connect
// check if email exists
// store password
// login endpoint

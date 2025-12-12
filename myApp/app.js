
var express = require('express');
var path = require('path');
var app = express(); 
var session = require("express-session");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
        secret: "123768159",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60,
        }
    })
);

const { MongoClient } = require('mongodb'); //import mongodb
//connect mongoDB to the client (localhost)
const client = new MongoClient("mongodb://127.0.0.1:27017");  
client.connect();
const db = client.db('networksWebApp'); 
// create database in mongoDb and name it 'networksWebApp', also create a collection inside it and name it 'accounts'

 
// app.get('/', function(req, res) {
//   res.render('index', { title: "express" });
// });

app.get('/', function(req, res){
  res.render('login',  { error: null })  
});

app.get('/registration', function(req, res){
  res.render('registration',  { error: null })
});

app.post('/register', function(req, res){
  const uName = req.body.username;
  const pass = req.body.password;

  db.collection('accounts')
    .findOne({username: uName})
    .then(findResult => {
      if(findResult) { // not null
        return res.render('registration', {error: "Username already exists. Please choose a different username."});
      }
      // if null then add the records
      return db.collection('accounts')
        .insertOne({
          username: uName,
          password: pass
        });
      
    })
    .then(insertResult =>{
        if(!insertResult)
          return;  
      return res.redirect('/'); // go to login page if succesfull
        
    })
    .catch(err => {
      console.error(err);
      return res
        .status(500)
        .send("Server error.");
    });  

});

app.post('/',  function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    db.collection("accounts")
        .findOne({ username: username, password: password })
        .then(user => {

            if (!user) {
                // Login failed — reload page with error message
                return res.render('login', {error: "Invalid username or password!"});
            }

            // Successful login — create session
            req.session.user = {
                id: user._id,
                username: user.username
            };

            return res.redirect("home");
        })
        .catch(err => {
            console.error(err);
            return res.status(500).send("Server error");
        });
});

app.get('/home', function(req, res){
    if (!req.session.user) {
        return res.redirect("login");
    }

    res.render('home',{username: req.session.user.username});  
});

//-----------------------------------------

app.get('/hiking',function(req,res){

  res.render('hiking');
});

app.get('/inca',function(req,res){

  res.render('inca');
});

app.get('/annapurna',function(req,res){

  res.render('annapurna');
});


app.get('/cities',function(req,res){

  res.render('cities');
});



app.get('/paris',function(req,res){

  res.render('paris');
});


app.get('/rome',function(req,res){

  res.render('rome');
});



app.get('/islands',function(req,res){

  res.render('islands');
});



app.get('/bali',function(req,res){

  res.render('bali');
});



app.get('/santorini',function(req,res){

  res.render('santorini');
});





app.listen(3000);


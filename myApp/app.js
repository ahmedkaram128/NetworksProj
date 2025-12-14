
var express = require('express');
var path = require('path');
var app = express(); 
var session = require("express-session");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
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
const db = client.db('myDB'); 

// app.get('/', function(req, res) {
//   res.render('index', { title: "express" });
// });

app.get('/', function(req, res){
  const message = req.query.message || null;
  res.render('login',  { message })  
});

app.get('/registration', function(req, res){
  res.render('registration',  { error: null })
});

app.post('/register', function(req, res){
  const uName = req.body.username;
  const pass = req.body.password;

  db.collection('myCollection')
    .findOne({username: uName})
    .then(findResult => {
      if(findResult) { // not null
        return res.render('registration', {error: "Username already exists. Please choose a different username."});
      }
      
      if(uName === "" || pass === ""){// field left empty
        return res.render('registration', {error: "username or password was left blank. Please try again"});
      }

      return db.collection('myCollection')
        .insertOne({
          username: uName,
          password: pass
        });
      
    })
    .then(insertResult =>{
        if(!insertResult)
          return;  
      return res.redirect("/?message=Account+regestered+succesfully"); // go to login page if succesfull
        
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

    db.collection("myCollection")
        .findOne({ username: username, password: password })
        .then(user => {

            if (!user) {
                // Login failed — reload page with error message
                return res.render('login', {message: "Invalid username or password!"});
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

  res.render('inca',{message:null});
});

app.get('/annapurna',function(req,res){

  res.render('annapurna',{message:null});
});


app.get('/cities',function(req,res){

  res.render('cities');
});



app.get('/paris',function(req,res){

  res.render('paris',{message:null});
});


app.get('/rome',function(req,res){

  res.render('rome',{message:null});
});



app.get('/islands',function(req,res){

  res.render('islands');
});



app.get('/bali',function(req,res){

  res.render('bali',{message:null});
});



app.get('/santorini',function(req,res){

  res.render('santorini',{message:null});
});

//-----------------------------------------
app.post('/annapurna',function(req,res){
  const user=req.session.user.username;
  db.collection("myCollection").findOne({username: user, view: "annapurna"}).then (result => {
    if(!result){
      db.collection('myCollection').insertOne({username: user, view: "annapurna"}).then(()=> {res.render('annapurna', {message: "Added successfully"});})
     .catch(err => {console.error(err);
            res.render('annapurna', { message: "Server Error while adding" });
          });
    }
    else{
      res.render('annapurna', {message: "CAN'T ADD since view already exists"});
    }
})
.catch(err => {
      console.error(err);
      res.render('annapurna', { message: "Server Error while checking database" });
    });
});

app.post('/inca',function(req,res){
  const user=req.session.user.username;
  db.collection("myCollection").findOne({username: user, view: "inca"}).then (result => {
    if(!result){
      db.collection('myCollection').insertOne({username: user, view: "inca"}).then(()=> {res.render('inca', {message: "Added successfully"});})
     .catch(err => {console.error(err);
            res.render('inca', { message: "Server Error while adding" });
          });
    }
    else{
      res.render('inca', {message: "CAN'T ADD since view already exists"});
    }
})
.catch(err => {
      console.error(err);
      res.render('inca', { message: "Server Error while checking database" });
    });
});

app.post('/bali',function(req,res){
  const user=req.session.user.username;
  db.collection("myCollection").findOne({username: user, view: "bali"}).then (result => {
    if(!result){
      db.collection('myCollection').insertOne({username: user, view: "bali"}).then(()=> {res.render('bali', {message: "Added successfully"});})
     .catch(err => {console.error(err);
            res.render('bali', { message: "Server Error while adding" });
          });
    }
    else{
      res.render('bali', {message: "CAN'T ADD since view already exists"});
    }
})
.catch(err => {
      console.error(err);
      res.render('bali', { message: "Server Error while checking database" });
    });
});

app.post('/paris',function(req,res){
  const user=req.session.user.username;
  db.collection("myCollection").findOne({username: user, view: "paris"}).then (result => {
    if(!result){
      db.collection('myCollection').insertOne({username: user, view: "paris"}).then(()=> {res.render('paris', {message: "Added successfully"});})
     .catch(err => {console.error(err);
            res.render('paris', { message: "Server Error while adding" });
          });
    }
    else{
      res.render('paris', {message: "CAN'T ADD since view already exists"});
    }
})
.catch(err => {
      console.error(err);
      res.render('paris', { message: "Server Error while checking database" });
    });
});

app.post('/rome',function(req,res){
  const user=req.session.user.username;
  db.collection("myCollection").findOne({username: user, view: "rome"}).then (result => {
    if(!result){
      db.collection('myCollection').insertOne({username: user, view: "rome"}).then(()=> {res.render('rome', {message: "Added successfully"});})
     .catch(err => {console.error(err);
            res.render('rome', { message: "Server Error while adding" });
          });
    }
    else{
      res.render('rome', {message: "CAN'T ADD since view already exists"});
    }
})
.catch(err => {
      console.error(err);
      res.render('rome', { message: "Server Error while checking database" });
    });
});

app.post('/santorini',function(req,res){
  const user=req.session.user.username;
  db.collection("myCollection").findOne({username: user, view: "santorini"}).then (result => {
    if(!result){
      db.collection('myCollection').insertOne({username: user, view: "santorini"}).then(()=> {res.render('santorini', {message: "Added successfully"});})
     .catch(err => {console.error(err);
            res.render('santorini', { message: "Server Error while adding" });
          });
    }
    else{
      res.render('santorini', {message: "CAN'T ADD since view already exists"});
    }
})
.catch(err => {
      console.error(err);
      res.render('santorini', { message: "Server Error while checking database" });
    });
});





app.listen(3000);


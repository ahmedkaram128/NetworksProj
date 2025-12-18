const fs = require('fs');
var express = require('express');
var path = require('path');
var app = express(); 
var session = require("express-session");
const { MongoClient } = require('mongodb'); 

// Setup Views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: "123768159",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }
}));

// Database Connection
const client = new MongoClient("mongodb://127.0.0.1:27017");  
client.connect();
const db = client.db('myDB'); 


app.get('/', (req, res) => res.render('login', { message: req.query.message || null }));
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

app.post('/', function(req, res) {
    const { username, password } = req.body;
    db.collection("myCollection").findOne({ username, password })
        .then(user => {
            if (!user) return res.render('login', {message: "Invalid credentials"});
            req.session.user = { id: user._id, username: user.username };
            res.redirect("home");
        })
        .catch(err => res.status(500).send("Server error"));
});

app.get('/home', (req, res) => {
    if (!req.session.user) return res.redirect('/?message=You+were+logged+out,+please+login+again');
    res.render('home',{username: req.session.user.username});  
});


function handleAddDest(req, res, viewName) {
    if (!req.session.user) return res.redirect("/");
    
    const user = req.session.user.username;

    db.collection("myCollection").findOne({ username: user })
        .then(doc => {
            if (doc.wishlist && doc.wishlist.includes(viewName)) {
                return res.render(viewName, { message: "Destination already in your list!" });
            }

            db.collection("myCollection").updateOne(
                { username: user },
                { $push: { wishlist: viewName } } 
            )
            .then(() => {
                res.render(viewName, { message: "Added successfully" });
            })
            .catch(err => {
                console.error(err);
                res.render(viewName, { message: "Server Error" });
            });
        })
        .catch(err => {
            console.error(err);
            res.render(viewName, { message: "Server Error" });
        });
}

// GET Routes
app.get('/hiking', (req, res) => res.render('hiking'));
app.get('/cities', (req, res) => res.render('cities'));
app.get('/islands', (req, res) => res.render('islands'));
app.get('/annapurna', (req, res) => res.render('annapurna', {message:null}));
app.get('/inca', (req, res) => res.render('inca', {message:null}));
app.get('/bali', (req, res) => res.render('bali', {message:null}));
app.get('/paris', (req, res) => res.render('paris', {message:null}));
app.get('/rome', (req, res) => res.render('rome', {message:null}));
app.get('/santorini', (req, res) => res.render('santorini', {message:null}));

//post 
app.post('/annapurna', (req, res) => handleAddDest(req, res, "annapurna"));
app.post('/inca', (req, res) => handleAddDest(req, res, "inca"));
app.post('/bali', (req, res) => handleAddDest(req, res, "bali"));
app.post('/paris', (req, res) => handleAddDest(req, res, "paris"));
app.post('/rome', (req, res) => handleAddDest(req, res, "rome"));
app.post('/santorini', (req, res) => handleAddDest(req, res, "santorini"));


app.get('/wanttogo', function(req, res){
    if (!req.session.user) return res.redirect("/");
    const currentUser = req.session.user.username;

    db.collection("myCollection").findOne({ username: currentUser })
        .then(userDoc => {
            const list = (userDoc && userDoc.wishlist) ? userDoc.wishlist : [];
            const formattedList = list.map(city => ({ view: city }));
            
            res.render('wanttogo', { 
                username: currentUser, 
                destinations: formattedList 
            });
        })
        .catch(err => res.status(500).send("Server Error"));
});

let viewPages = [
  {
    name: 'Bali Island',
    slug: 'bali'
  },
  {
    name: 'Paris',
    slug: 'paris'
  },
  {
    name: 'Rome',
    slug: 'rome'
  },
  {
    name: 'Santorini Island',
    slug: 'santorini'
  },
  {
    name: 'Annapurna Circuit',
    slug: 'annapurna'
  },
  {
    name: 'Inca Trail to Machu Picchu',
    slug: 'inca'
  }
];


app.post('/search', function (req, res) {
  try {
    const q = (req.body.Search || '').trim().toLowerCase();

    if (!q) {
      return res.render('searchresults', { results: [], query: '' });
    }

    const results = viewPages
      .filter(page => page.name.toLowerCase().includes(q))
      .map(page => ({
        name: page.name,
        slug: page.slug
      }));

    res.render('searchresults', { results, query: q });

  } catch (err) {
    console.error('Search error:', err);
    res.render('searchresults', { results: [], query: req.body.Search || '' });
  }
});

// DB Reset Route (Use once then delete)
app.get('/reset-db', async (req, res) => {
    await db.collection('myCollection').deleteMany({});
    req.session.destroy();
    res.send("DB Cleared. <a href='/'>Go Register</a>");
});

app.listen(3000, () => console.log("Server running on port 3000..."));

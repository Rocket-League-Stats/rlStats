require('dotenv').config(); // Allows use of environmental variables from the .env file
const express = require('express'); // Fast web framework for node js
const helmet = require('helmet'); // Helps secure express app

// Getting main api file and loading custom middlewares
const middlewares = require('./middlewares.js');
const api = require('./api');

// Setting up express & must use middleware
let app = express();
app.set('trust proxy', 1); // When using something like nginx or apache as a proxy
app.use(helmet()); // Adds extra security
app.use(express.json()); // Allows use of req.body (for json)

// Custom Middleware
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);
app.use('/public', express.static(__dirname+'/../public'));
app.use('/api', api);

// Setting up node js server
let port = process.env.PORT || 3000;
let server = app.listen(port, () => console.log(`Server running on port ${port}...`));

// Basic Routing
app.get('/robots.txt', (req, res) => res.sendFile('robots.txt', {root: __dirname}));
app.get('*', (req, res) => res.sendFile('index.html', {root: __dirname+'/../public'}));

// Database Lookup
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://host:NGNxDF1XwElvEQ0c@cluster0.gbvl6.mongodb.net/regional1?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true }, { useUnifiedTopology: true });

app.post('/lookup', function(req,res) {
    console.log(req.body.name)
    client.connect(err => {
      const collection = client.db("regional1").collection("stage1");
      collection.find(query).toArray(function(err, result) {
        if (err) throw err;
        else res.json(result)
      });
      client.close();
    });
  })
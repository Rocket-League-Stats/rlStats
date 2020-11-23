var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var CryptoJS = require("crypto-js");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bodyParser = require('body-parser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
const expressSession = require('express-session');

app.use(expressSession({
  name: "kmpSessionCookie",
  secret: "express session secret",
  resave: false,
  saveUninitialized: false
}));

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://host:lBKPP2l2vREFQGLF@cluster0.gbvl6.mongodb.net/Secret?retryWrites=true&w=majority";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const Secret = require("./Secret.js");


app.post('/login', (req,res) => {

  let user = req.body.username;
  let password = req.body.password;
  let user_data;

  const client = new MongoClient(uri, { useNewUrlParser: true }, { useUnifiedTopology: true },{useCreateIndex: true});
  client.connect(err => {
      const collection = client.db("Secret").collection("users");
      collection.find().toArray(function(err, result) {
        user_data = JSON.parse(JSON.stringify(result));
        user_data = user_data.filter(d=> d.username == user)[0]

        if (user_data == null) {
          res.status(404).send("Not found");
          client.close();
          return;
      }
       if (CryptoJS.AES.decrypt(user_data.password, 'corgi').toString(CryptoJS.enc.Utf8) == password) {
          req.session.user = user;
          res.json(true);
          client.close();
          return;
      }
      res.status(403).send("Unauthorized"); 
      client.close();
      return;

      });
    });

  
});

app.post('/signup', (req,res) => {

  let user = req.body.username;
  let password = req.body.password;
  let user_data;


  const client = new MongoClient(uri, { useNewUrlParser: true }, { useUnifiedTopology: true },{useCreateIndex: true});
  client.connect(err => {
      const collection = client.db("Secret").collection("users");
      collection.find().toArray(function(err, result) {
        user_data = JSON.parse(JSON.stringify(result));
        user_data = user_data.filter(d=> d.username == user)[0]
       
        if (user_data === undefined) {
          let myobj = { "username": user, "password": CryptoJS.AES.encrypt(password, 'corgi').toString() };

          collection.insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("Added User Successfully");

          });
          
          res.json(true);
          client.close();
          return;

      } else {
        res.status(404).send("Username Taken");
        client.close();
        return;
      }
       

      });
    });

})

app.get('/getLoggedInUser', (req, res) => {
  if (req.session.user == undefined) {
    res.status(403).send("No User Logged In");
    return;
} else {
  res.json(req.session.user);
}
})

app.get('/logout', (req, res) => {
  delete req.session.user;
  res.json(true);
})

app.post('/getDBbyID', (req, res) => {

  let id = req.body.id;

  const client = new MongoClient("mongodb+srv://host:lBKPP2l2vREFQGLF@cluster0.gbvl6.mongodb.net/rl_stats?retryWrites=true&w=majority", { useNewUrlParser: true }, { useUnifiedTopology: true },{useCreateIndex: true});
  client.connect(err => {
      const collection = client.db("rl_stats").collection(id);
      collection.find().toArray(function(err, result) {
          res.json(result);
          client.close();
      });
    });
})

app.get('/secret', (req, res) => {
  if (req.session.user == undefined) {
      res.status(403).send("Unauthorized");
      return;
  }
  const client = new MongoClient("mongodb+srv://host:lBKPP2l2vREFQGLF@cluster0.gbvl6.mongodb.net/Secret?retryWrites=true&w=majority", { useNewUrlParser: true }, { useUnifiedTopology: true },{useCreateIndex: true});
  client.connect(err => {
      const collection = client.db("Secret").collection("secrets");
      collection.find({"owner":req.session.user}).toArray(function(err, result) {
        let temp = [];
        for (let i=0; i<result.length; i++){
          temp.push(JSON.parse(result[i].favorite))
          temp[i].id = result[i].id
          temp[i].owner = req.session.user
        }
        req.session.favoriteplayers = temp;
          res.json(temp) ;
          client.close();
      });
    });
});

app.get('/secretteam', (req, res) => {
  if (req.session.user == undefined) {
      res.status(403).send("Unauthorized");
      return;
  }
  const client = new MongoClient("mongodb+srv://host:lBKPP2l2vREFQGLF@cluster0.gbvl6.mongodb.net/Secret?retryWrites=true&w=majority", { useNewUrlParser: true }, { useUnifiedTopology: true },{useCreateIndex: true});
  client.connect(err => {
      const collection = client.db("Secret").collection("secretteams");
      collection.find({"owner":req.session.user}).toArray(function(err, result) {
        let temp = [];
        for (let i=0; i<result.length; i++){
          temp.push(JSON.parse(result[i].favorite))
          temp[i].id = result[i].id
          temp[i].owner = req.session.user

        }
          res.json(temp) ;
          client.close();
      });
    });
 

  return;
});


app.post('/secret', (req, res)=> {
  if (req.session.user == undefined) {
      res.status(403).send("Unauthorized");
      return;
  }

 
  let s = Secret.create(req.session.user, req.body.favorite);


  if (s == null) {
      res.status(400).send("Bad Request");
      return;
  }
  return res.json(s);
});

app.post('/secretteam', (req, res)=> {
  if (req.session.user == undefined) {
      res.status(403).send("Unauthorized");
      return;
  }

  let s = Secret.createteam(req.session.user, req.body.favorite);


  if (s == null) {
      res.status(400).send("Bad Request");
      return;
  }
  return res.json(s);
});

app.post('/deletesecret', async (req, res) => {

  if (req.session.user == undefined) {
      res.status(403).send("Unauthorized");
      return;
  }


  let owner = req.session.user;
  let id = req.body.id;

  let outcome = await deleteSecret(id, owner);

  if (id == null) {
      res.status(404).send("Not found");
      return;
  }
  if (owner != req.session.user) {
      res.status(403).send("Unauthorized");
      return;
  }
  res.json(outcome);
})

app.post('/deletesecretteam', async (req, res) => {

  if (req.session.user == undefined) {
      res.status(403).send("Unauthorized");
      return;
  }


  let owner = req.session.user;
  let id = req.body.id;
 

  let outcome = await deleteSecretTeam(id, owner);

  if (id == null) {
      res.status(404).send("Not found");
      return;
  }

  if (owner != req.session.user) {
      res.status(403).send("Unauthorized");
      return;
  }

  res.json(outcome);
})

app.get('/getplayernames', async (req, res) => {
  let result = await getPlayerDB();
  result = JSON.parse(JSON.stringify(result))
    var a = [];
    for (var i=0, l=result.length; i<l; i++){
        if (a.indexOf(result[i].name) === -1 && result[i].name !== ''){a.push(result[i].name);}
          }
  res.json(a)
})

app.get('/getteamnames', async (req, res) => {
  let result = await getPlayerDB();
  result = JSON.parse(JSON.stringify(result))
    var a = [];
    for (var i=0, l=result.length; i<l; i++){
        if (a.indexOf(result[i].team) === -1 && result[i].team !== ''){a.push(result[i].team);}
          }
  res.json(a)
})

app.get('/getallteams', async (req, res) => {
  let result = await getTeamDB();
  res.json(result)
})

app.post('/getplayerbyname', async (req, res) => {
  let result = await getPlayerByName(req.body.name);
  res.json(result)
})

app.post('/getoneplayer', async (req, res) => {
  let result = await getOnePlayer(req.body.name);
  res.json(result)
})

app.post('/getoneteam', async (req, res) => {
  let result = await getOneTeam(req.body.name);
  res.json(result)
})

app.get('/doSomething', async (req, res) => {
  let result = await temporary();
  res.json(true)
})

async function temporary () { 
  const client = await MongoClient.connect("mongodb+srv://host:lBKPP2l2vREFQGLF@cluster0.gbvl6.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true })
        .catch(err => { console.log(err); }); 
        if (!client) {
          return;
      }      
      try {
        const collection = client.db("test").collection("test");
        let temp = []
        let players = await collection.find().forEach( function(myDoc) { 
          temp = temp.concat(myDoc.players)
        });
        const col = client.db("test").collection("players")
        // temp = Object.assign({}, temp);
        
        col.insertMany(temp)

        return;

    } catch (err) {
        console.log(err);
    } finally {

        client.close();
    }
  const collection = client.db("test").collection("test");
  
  client.close();

}

async function getPlayerByName (name) { 
  const client = await MongoClient.connect("mongodb+srv://host:lBKPP2l2vREFQGLF@cluster0.gbvl6.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true })
        .catch(err => { console.log(err); }); 
        if (!client) {
          return;
      }      
      try {
        const collection = client.db("test").collection("players");
        let temp = []
        let players = await collection.find({"name": name}).forEach( function(myDoc) { 
          temp = temp.concat(myDoc)
        });
        client.close();
        return temp;
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }  
  client.close();
}

async function getOnePlayer (name) { 
  const client = await MongoClient.connect("mongodb+srv://host:lBKPP2l2vREFQGLF@cluster0.gbvl6.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true })
        .catch(err => { console.log(err); }); 
        if (!client) {
          return;
      }      
      try {
        const collection = client.db("test").collection("players");
      
        let temp = await collection.findOne({"name": name});
        client.close();
        return temp;
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }  
  client.close();
}

async function getOneTeam (name) { 
  const client = await MongoClient.connect("mongodb+srv://host:lBKPP2l2vREFQGLF@cluster0.gbvl6.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true })
        .catch(err => { console.log(err); }); 
        if (!client) {
          return;
      }      
      try {
        const collection = client.db("test").collection("teams");
      
        let temp = await collection.findOne({"name": name});
        client.close();
        return temp;
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }  
  client.close();
}

async function getTeamDB () { 
  const client = await MongoClient.connect("mongodb+srv://host:lBKPP2l2vREFQGLF@cluster0.gbvl6.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true })
        .catch(err => { console.log(err); }); 
        if (!client) {
          return;
      }      
      try {
        const collection = client.db("test").collection("team");
        let temp = []
        let players = await collection.find().forEach( function(myDoc) { 
          temp = temp.concat(myDoc)
        });
        client.close();
        return temp;
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }  
  client.close();
}

async function getPlayerDB () { 
  const client = await MongoClient.connect("mongodb+srv://host:lBKPP2l2vREFQGLF@cluster0.gbvl6.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true })
        .catch(err => { console.log(err); }); 
        if (!client) {
          return;
      }      
      try {
        const collection = client.db("test").collection("players");
        let temp = []
        let players = await collection.find().forEach( function(myDoc) { 
          temp = temp.concat(myDoc)
        });
        client.close();
        return temp;
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }  
  client.close();
}

 async function deleteSecret (id, owner) { 
  const client = await MongoClient.connect("mongodb+srv://host:lBKPP2l2vREFQGLF@cluster0.gbvl6.mongodb.net/Secret?retryWrites=true&w=majority", { useNewUrlParser: true })
        .catch(err => { console.log(err); }); 

        let name = JSON.parse(id).name;

        if (!client) {
          return;
      }      
      try {
        const collection = await client.db("Secret").collection("secrets");
        let a =  await collection.deleteOne({"owner":owner, "name":name})
        client.close();
        return true;

    } catch (err) {
        console.log(err);
        return false;
    } finally {
        client.close();
    }  
  client.close();
}

async function deleteSecretTeam (id, owner) { 
  const client = await MongoClient.connect("mongodb+srv://host:lBKPP2l2vREFQGLF@cluster0.gbvl6.mongodb.net/Secret?retryWrites=true&w=majority", { useNewUrlParser: true })
        .catch(err => { console.log(err); }); 

        let name = JSON.parse(id).name;

        if (!client) {
          return;
      }      
      try {
        const collection = await client.db("Secret").collection("secretteams");
        let a =  await collection.deleteOne({"owner":owner, "name":name})
        console.log(a.deletedCount)
        client.close();
        return true;

    } catch (err) {
        console.log(err);
        return false;
    } finally {
        client.close();
    }  
  client.close();
}

app.use('/', indexRouter);
app.use('/users', usersRouter);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

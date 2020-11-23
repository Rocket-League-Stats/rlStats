var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var CryptoJS = require("crypto-js");

var indexRouter = require('./routes/index');
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
  name: "currSessionCookie",
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

  if (req.session.players == undefined){

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
        req.session.players = temp;
          res.json(temp) ;
          client.close();
      });
    });} else {
      res.json(req.session.players)
    }
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

  if (req.session.players != undefined) {	
    req.session.players.push(JSON.parse(req.body.favorite))	
  }

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
  let name = JSON.parse(id).name;	

  if (req.session.players != undefined) {	
    let temp = req.session.players.filter(function(player) {	
      return (player.name != name);	
    });	
    delete req.session.players;
    req.session.players = temp;
  }

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
  res.json([    ".AtomiK",    "Alpha54",    "Archie",    "AztraL",    "Calix",    "Chausette45",    "Deevo",    "DmentZa",    "ExoTiiK",    "Extra",    "Fairy Peak!",    "Ferra",    "FlamE",    "FreaKii.",    "Joreuz",    "Kassio",    "Kaydop",    "Kerian",    "M0nkey M00n",    "MaRc_By_8.",    "Magu",    "Metsanauris",    "Mikeboy",    "Mittaen",    "Oscillon",    "RelatingWave",    "Rix_Ronday",    "Rizex45",    "Ronaky",    "SamCynical",    "Scrub Killa",    "Stake",    "Tadpole",    "ThO.",    "Tigreee",    "Tox",    "ViolentPanda",    "Yukeo",    "Yukiss",    "Zamue",    "arju",    "bluey.",    "eekso",    "gReazymeister",    "itachi",    "noly",    "rise.",    "virtuoso",    "Cynical",    "Oaly",    "Virtuoso",    "AtomiK",    "FairyPeak",    "Kassiooo",    "Mout",    "eekso_",    "Alex161",    "ApparentlyJack",    "Artyrus",    "BoyScHool Q",    "Bram.",    "Breezi",    "Catalysm",    "Cheerio",    "Chippy",    "ClayX",    "Compact.",    "Dead-Monster",    "Ekon",    "Enlid",    "Gnagflow06",    "Godsmilla",    "Hooups",    "Kryptos",    "LuiisP",    "Maadzz",    "Madssssss.",    "Mirror.",    "Mognus",    "Nachitow",    "PeaKy!",    "Polar",    "Revezy",    "SUP3RSoN1K",    "Scream",    "Seb/-\\da/\/\\",    "Speed",    "Tahz",    "Tjester",    "Trex",    "Tylacto",    "Unknow",    "Zaphare",    "Zeddo",    "al0t",    "dave",    "fruity",    "hibbs",    "kash.",    "kirn",    "kuxir97",    "matsgrey",    "rehzzy",    "remkoe",    "tehda",    "womped",    "ASN_RuBiiX",    "B00M",    "BRG rise.",    "Blurry",    "Eckhard",    "Envoy.",    "Gekk",    "Gooch",    "Halden",    "Inferno 0",    "Iryzer",    "LiFox",    "MD",    "Skyy",    "VKSailen",    "cal",    "kash",    "pryyme",    "totothdt",    "42Ferra",    "ASN_RuBiiX.",    "B00MRL",    "Kash_RL",    "Yukiss08",    "blurry",    "fruityl0l",    "Slush!",    "AYYJAYY",    "Allushin",    "Arsenal",    "Atomic",    "BeastMode",    "Chicago",    "Firstkiller",    "GarrettG",    "Gyro.",    "JKnaps",    "Kronovi",    "MaJicBear",    "Memory",    "Rizzo",    "Squishy",    "Sypical",    "Turbopolsa",    "Turinturo",    "jordan",    "jstn.",    "mist",    "percy.",    "rapid",    "retals",    "(: rehzzy",    ".kisai",    "Alex837",    "Bork",    "CalixRL",    "EkonRL",    "EleXiT.",    "Eversax",    "GoochRL",    "Justuszzz",    "Lenrid",    "Makuhebi",    "Radosin",    "Rexo",    "Sebadam",    "StakeMBP",    "Swift",    "TadpoleRL",    "Toxtraptonized",    "Wolf.",    "ZamuAA",    "big.",    "cloud",    "ejby",    "milo",    "nozai",    "AcroniK.",    "BJayB",    "Barist",    "Hyderr",    "Irelique",    "LTK AtomiK",    "Meloshisu",    "Rizual",    "Rob",    "bruh",    "joreuz",    "swoopin",    ".ZPS",    "Retals",    "Satthew",    "Shock",    "jruss",    "kinseh",    "majicbear",    "radoko.",    ".tristn",    "AlphaKep",    "Andy",    "Freshness",    "JPow",    "Kraziks",    "LionBlaze",    "Lj",    "Luke",    "Roll Dizz",    "Taroco.",    "Toastie",    "Turinturo,",    "WondaMike",    "ayjacks",    "beastaboniam",    "delta",    "mectos",    "sosacrdbl",    "tcorrell",    "tcorrell.",    "Aeon",    "Ahduhm",    "Astroh",    "Buddy",    "Comm\"!",    "JWismont",    "Noxes",    "Pirates",    "Spyder",    "r a p i d",    "sosa",    "justin.",    "AxB",    "Dappur",    "Jacob",    "Karma",    "Shadow",    "TURINTURO",    "Tynottyler",    "Wonder",    "gimmick",    "torment",    ".saucy",    "Admin-Fridgy",    "Adverse",    "Aris",    "Bacon",    "Bambii :)",    "Comp",    "Dark",    "Demo",    "FTMHere",    "Gib",    "Harps",    "Heps",    "JJ ^O^",    "Jbot",    "JosherSquasher",    "Kinseh",    "Lubby",    "Sheadrip",    "Skillz.",    "Skyzz ^_^",    "Tool",    "XI",    "alraz",    "ayLucky",    "fishhr",    "freshness",    "hockE",    "hockser",    "money",    "nessCoff.",    "oath",    "primethunder",    "pure",    "testgravity",    "xpurt",    ".rawG",    "Dec",    "Dino",    "Garenn",    "Hato",    "Hec",    "JJ .^O^.",    "Porklet",    "Savvy",    "Splashy",    "Stokelyy",    "Talliebird",    "Thundah",    "TopCheese",    "WarBean",    "caz.",    "dEmo",    "falss",    "kirii",    "night.",    "ostyn",    "sharp",    "tvaristo.",    "zol",    "Chronic",    "MALA",    "Brisky",    "Demon_NF",    "Desi",    "ElOmarMaton",    "Outcast",    "Turtle",    "crave.",    "ctrl.",    "gimmickk",    "indigo",    "j",    "jacob",    "junglies",    "plip",    "plipington"])
})

app.get('/getteamnames', async (req, res) => {
  res.json(["DIGNITAS",    "RENAULT VITALITY",    "OXYGEN ESPORTS",    "FADEAWAY",    "ENDPOINT",    "BARRAGE",    "GUILD",    "TRIPLE TROUBLE",    "BARCA ESPORTS",    "GALAXY RACER",    "SOLARY",    "MAGNIFICO",    "LIBERTAS",    "VODAFONE GIANTS",    "TOP BLOKES",    "TEAM BDS",    "TLR ESPORT",    "HOLY COW!",    "MINKZ GAMING",    "TEAM NAME",    "TEAM LIQUID",    "CHALKED",    "DRILLERS",    "SERVETTE GENEVA",    "SINGULARITY",    "VENC GAMING",    "MONKEYS",    "UNIQUESTARS",    "STORMTROOPERS",    "NORDAVIND DNB",    "NAMESEEKERS",    "ASC. LEGENDS",    "GLORY4BUILDERS",    "OPP BLOCK",    "TLR ESPORTS",    "FIERCE ESPORTS",    "TEAM SINGULARITY",    "GAMEUP",    "ESPORTS BERG",    "2BAGUETTES",    "VGIA",    "PION",    "TEAM ORANGE",    "S2V ESPORTS",    "Catalysm & Kryptos & Ekon",    "G2 ESPORTS",    "KC PIONEERS",    "ROGUE",    "THE PEEPS",    "NRG",    "ALPINE ESPORTS",    "TEAM ENVY",    "SSG",    "KEEP CALM",    "KCAI",    "STAY FRESH",    "Kaydop & Fairy Peak! & Alpha54",    "EDELWEISS",    "NUMB THUMB DUMB",    "TEAM OPLON",    "FIERCE",    "TRAINHARD ESPORT",    "RIXGG",    "ESPORT BERG",    "EKIP",    "GAME FIST",    "STEALTH7 ESPORTS",    "LIQUID",    "DENIED",    "YOU CHOOSE PESCE",    "SAUCE SQUAD",    "DRIFTERS",    "WOLVES ESPORTS",    "REDEMPTION",    "TEAM QUESO",    "SONIQS",    "KNIGHTS",    "SPACESTATION",    "PLOT TWIST",    "BOSF ESPORTS",    "TEAM FRONTLINE",    "GHOST GAMING",    "EUNITED",    "XSET",    "G2",    "JAMAL JABARY",    "CONTINUUM",    "ADEPT",    "NEFARIOUS",    "CHARLOTTE",    "72PC",    "VERSION1",    "JJ",    "PPS",    "DRIP",    "CLT",    "ZOOKEEPERS",    "1ST",    "VALORSGG",    "CRIMSON WINGS",    "MAMBA MODE",    "FFF",    "OMELETTE",    "INFINITE SHOTS",    "THE 1ST GRADERS",    "HC ESPORTS",    "TEAM METEOR",    "ALLMID",    "FLASH POINT",    "OSTYN",    "ZABOOMAFOO",    "8-BIT ESPORTS",    "AND THERE IT IS",    "MORNING LIGHT",    "STROMBOLI",    "ZERO ISSUE",    "THE MATONES",    "DOWN TWO EARTH",    "PINE",    "EMPTY SPACE",    "THE LOVE BELOW"])
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


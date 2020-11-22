import NAFALLR1S1 from "../data/arrayed_json/NAFALLR1S1.js";
import NAFALLR1S2 from "../data/arrayed_json/NAFALLR1S2.js";
import NAFALLR1PO from "../data/arrayed_json/NAFALLR1PO.js";
import NAFALLR2S1 from "../data/arrayed_json/NAFALLR2S1.js";
import NAFALLR2S2 from "../data/arrayed_json/NAFALLR2S2.js";
import NAFALLR2PO from "../data/arrayed_json/NAFALLR2PO.js";
import NAFALLR3S1 from "../data/arrayed_json/NAFALLR3S1.js";
import NAFALLR3S2 from "../data/arrayed_json/NAFALLR3S2.js";
import NAFALLR3PO from "../data/arrayed_json/NAFALLR3PO.js";
import NAFALLMASW from "../data/arrayed_json/NAFALLMASW.js";
import NAFALLMAPO from "../data/arrayed_json/NAFALLMAPO.js";
import EUFALLR1S1 from "../data/arrayed_json/EUFALLR1S1.js";
import EUFALLR1S2 from "../data/arrayed_json/EUFALLR1S2.js";
import EUFALLR1PO from "../data/arrayed_json/EUFALLR1PO.js";
import EUFALLR2S1 from "../data/arrayed_json/EUFALLR2S1.js";
import EUFALLR2S2 from "../data/arrayed_json/EUFALLR2S2.js";
import EUFALLR2PO from "../data/arrayed_json/EUFALLR2PO.js";
import EUFALLR3S1 from "../data/arrayed_json/EUFALLR3S1.js";
import EUFALLR3S2 from "../data/arrayed_json/EUFALLR3S2.js";
import EUFALLR3PO from "../data/arrayed_json/EUFALLR3PO.js";
import EUFALLMASW from "../data/arrayed_json/EUFALLMASW.js";
import EUFALLMAPO from "../data/arrayed_json/EUFALLMAPO.js";

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://host:NGNxDF1XwElvEQ0c@cluster0.gbvl6.mongodb.net/rl_stats?retryWrites=true&w=majority";
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// const client = new MongoClient(uri, { useNewUrlParser: true }, { useUnifiedTopology: true },{useCreateIndex: true});
// client.connect(err => {
//     const collection = client.db("rl_stats").collection("");
//     collection.find().toArray(function(err, result) {
//       
//     });
//     client.close();
//   });

let dataset = [];
let foundNames = [];
let tmpGlobalincrement = 1;
let region;
let season;
let sortConst = 0;
let favoritedPlayers = []
let playerNames = []
let teamNames = []
let secrets = [];

function searchName(replay_group, searchTerm) {
    foundNames = [];
    let i = 0;
    let searchNameAns = replay_group
        .reduce((accumulator, value) => {
            if (value.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
                let id_obj = {
                    name: value,
                    termStart: value.name.toLowerCase().indexOf(searchTerm.toLowerCase())
                }
                foundNames[i] = " " + value.name;
                i++;
                accumulator.push(id_obj);
            }
            return accumulator;
        }, [])
    return searchNameAns.map(c => c.name);
}

function renderTeamLeaderboard() {
    return `<div class="buttons has-addons is-centered">
    <button class="button is-primary" id="lbteams">Teams</button>
    <button class="button" id="lbplayers">Players</button>
    </div>
    <table class="table table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
    <thead>
      <tr>
        <th>Rank</th>
        <th>Team</th>
        <th><abbr title="Games Played">GMP</abbr></th>
        <th><abbr title="Games Won">W</abbr></th>
        <th><abbr title="Games Lost">L</abbr></th>
        <th><abbr title="Win Percentage">WL%</abbr></th>
        <th><abbr title="Goals For">GF</abbr></th>
        <th><abbr title="Goals Against">GA</abbr></th>
        <th><abbr title="Goals Per Game">GPG</abbr></th>
        <th><abbr title="Assists Per Game">APG</abbr></th>
        <th><abbr title="Saves Per Game">SVPG</abbr></th>
        <th><abbr title="Shots Per Game">SHPG</abbr></th>
        <th><abbr title="Shooting Percentage">SH%</abbr></th>
      </tr>
    </thead>
    <tbody id="tbody">
    </tbody>
    </table>
    `
}

function renderPlayerLeaderboard() {
    return `<div class="buttons has-addons is-centered">
    <button class="button" id="lbteams">Teams</button>
    <button class="button is-primary" id="lbplayers">Players</button>
    </div>
    <table class="table table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
    <thead>
      <tr>
        <th>Rank</th>
        <th>Name</th>
        <th>Team</th>
        <th><abbr title="Games Played">GMP</abbr></th>
        <th><abbr title="Win Percentage">WL%</abbr></th>
        <th><abbr title="Average Score">Score</abbr></th>
        <th><abbr title="Demolition Differential">DMD</abbr></th>
        <th><abbr title="Goals Per Game">GPG</abbr></th>
        <th><abbr title="Assists Per Game">APG</abbr></th>
        <th><abbr title="Saves Per Game">SVPG</abbr></th>
        <th><abbr title="Shots Per Game">SHPG</abbr></th>
        <th><abbr title="Shooting Percentage">SH%</abbr></th>
        <th><abbr title="Goal Participation">GP%</abbr></th>
      </tr>
    </thead>
    <tbody id="tbody">
    </tbody>
    </table>`
}

function renderTeamTableEntry(team) {
    return `<tr>
    <th>${tmpGlobalincrement}</th>
    <td>${team.name}</td>
    <td>${team.cumulative.games}</td>
    <td>${team.cumulative.wins}</td>
    <td>${team.cumulative.games - team.cumulative.wins}</td>
    <td>${team.cumulative.win_percentage.toFixed(1)}</td>
    <td>${team.cumulative.core.goals}</td>
    <td>${team.cumulative.core.goals_against}</td>
    <td>${team.game_average.core.goals.toFixed(2)}</td>
    <td>${team.game_average.core.assists.toFixed(2)}</td>
    <td>${team.game_average.core.saves.toFixed(2)}</td>
    <td>${team.game_average.core.shots.toFixed(2)}</td>
    <td>${team.game_average.core.shooting_percentage.toFixed(2)}</td>
  </tr>`
}

function renderPlayerTableEntry(player) {
    return `<tr>
    <th>${tmpGlobalincrement}</th>
    <td>${player.name}</td>
    <td>${player.team}</td>
    <td>${player.cumulative.games}</td>
    <td>${player.cumulative.win_percentage.toFixed(1)}</td>
    <td>${(player.cumulative.core.score / player.cumulative.games).toFixed(1)}</td>
    <td>${player.cumulative.demo.inflicted - player.cumulative.demo.taken}</td>
    <td>${player.game_average.core.goals.toFixed(2)}</td>
    <td>${player.game_average.core.assists.toFixed(2)}</td>
    <td>${player.game_average.core.saves.toFixed(2)}</td>
    <td>${player.game_average.core.shots.toFixed(2)}</td>
    <td>${player.game_average.core.shooting_percentage.toFixed(2)}</td>
    <td>${getGoalParticipation(player)}</td>
  </tr>`
}

function renderSelectorBox() {
    return `<div class="container">
    <div class='content'>
    <div class="box">
        <h4 class="subtitle is-4">Leaderboard</h3>
        <div class="control">
        <div class="buttons has-addons">
                <button class="button" id="lbna">North America</button>
                <button class="button" id="lbeu">Europe</button>
        </div>
        <span id="sznplaceholder"></span>
        </div>
    </div>
    </div>
    </div>
    <br>`
}

function renderLeaderboardSeasonSelector() {
    return `<div class="buttons has-addons">
    <button class="button" id="lbfall">Fall</button>
    <button class="button" id="lbwinter">Winter</button>
    <button class="button" id="lbspring">Spring</button>
    </div>
    <span id="eventselectorplaceholder"></span>`
}

function renderLeaderboardFallEventSelector() {
    return `<div class="select is-primary">
        <select class="event">
            <option>Select Event</option>
            <option>Regional 1 Stage 1</option>
            <option>Regional 1 Stage 2</option>
            <option>Regional 1 Playoffs</option>
            <option>Regional 2 Stage 1</option>
            <option>Regional 2 Stage 2</option>
            <option>Regional 2 Playoffs</option>
            <option>Regional 3 Stage 1</option>
            <option>Regional 3 Stage 2</option>
            <option>Regional 3 Playoffs</option>
            <option>Major Swiss</option>
            <option>Major Playoffs</option>
        </select>
        </div>
        <span id="PorTselectorplaceholder"></span>`
}

function renderLeaderboardPlayerTeamSelector() {
    return `<div id="table">
    <div class="buttons has-addons is-centered">
        <button class="button" id="lbteams">Teams</button>
        <button class="button" id="lbplayers">Players</button>
    </div>
</div>`
}

function handleTeamsButtonClick() {
    tmpGlobalincrement = 1;
    $("#table").empty();
    $("#table").append(renderTeamLeaderboard());
    for (let i = 0; i < dataset[0].teams.length; i++) {
        // the following if compensates for incomplete series'
        // such a series can appear in the data due to joining before
        // everyone is ready or a player lost connection during the match
        if (dataset[0].teams[i].cumulative.games > 2) {
            $("#tbody").append(renderTeamTableEntry(dataset[0].teams[i]))
            tmpGlobalincrement++;
        }
    }
}

function handlePlayersButtonClick() {
    tmpGlobalincrement = 1;
    $("#table").empty();
    $("#table").append(renderPlayerLeaderboard());
    for (let i = 0; i < dataset[0].players.length; i++) {
        // the following if compensates for admin/accidential joins
        if (dataset[0].players[i].cumulative.games > 1) {
            $("#tbody").append(renderPlayerTableEntry(dataset[0].players[i]))
            tmpGlobalincrement++;
        }
    }
}

function getGoalParticipation(player) {
    let goalsParticipatedIn = player.cumulative.core.goals + player.cumulative.core.assists;
    let team = searchName(dataset[0].teams, player.team);
    // another compensational if
    let index = 0;
    for (let i = 0; i < team.length; i++) {
        if (team[i].cumulative.games < 2) {
            index++;
        }
    }
    return ((goalsParticipatedIn / team[index].cumulative.core.goals) * 100).toFixed(2);
}

function handleLeaderboardNAClick() {
    region = "NA"
    $("#sznplaceholder").empty();
    $("#lbna").addClass("is-primary")
    $("#lbeu").removeClass("is-primary")
    $("#sznplaceholder").append(renderLeaderboardSeasonSelector);
}

function handleLeaderboardEUClick() {
    region = "EU"
    $("#sznplaceholder").empty();
    $("#lbeu").addClass("is-primary")
    $("#lbna").removeClass("is-primary")
    $("#sznplaceholder").append(renderLeaderboardSeasonSelector);
}

function handleLeaderboardFallClick() {
    season = "fall";
    $("#eventselectorplaceholder").empty();
    $("#lbfall").addClass("is-primary")
    $("#lbwinter").removeClass("is-primary")
    $("#lbspring").removeClass("is-primary")
    $("#eventselectorplaceholder").append(renderLeaderboardFallEventSelector());
}

function handleLeaderboardWinterClick() {
    season = "winter";
    $("#eventselectorplaceholder").empty();
    $("#lbfall").removeClass("is-primary")
    $("#lbwinter").addClass("is-primary")
    $("#lbspring").removeClass("is-primary")
    $("#eventselectorplaceholder").append(`<div class="notification is-warning"><p><span class="has-text-weight-bold">No Data! </span>This event has not been played yet, check back after the event is complete.</p></div>`);
}

function handleLeaderboardSpringClick() {
    season = "spring"
    $("#eventselectorplaceholder").empty();
    $("#lbfall").removeClass("is-primary")
    $("#lbwinter").removeClass("is-primary")
    $("#lbspring").addClass("is-primary")
    $("#eventselectorplaceholder").append(`<div class="notification is-warning"><p><span class="has-text-weight-bold">No Data! </span>This event has not been played yet, check back after the event is complete.</p></div>`);
}

function handleSelectedEvent(selectedEvent) {
    if (season == "fall") {
        if (region == "NA") {
            switch (selectedEvent) {
                case 'Regional 1 Stage 1':
                    dataset = NAFALLR1S1;
                    break;
                case 'Regional 1 Stage 2':
                    dataset = NAFALLR1S2;
                    break;
                case 'Regional 1 Playoffs':
                    dataset = NAFALLR1PO;
                    break;
                case 'Regional 2 Stage 1':
                    dataset = NAFALLR2S1;
                    break;
                case 'Regional 2 Stage 2':
                    dataset = NAFALLR2S2;
                    break;
                case 'Regional 2 Playoffs':
                    dataset = NAFALLR2PO;
                    break;
                case 'Regional 3 Stage 1':
                    dataset = NAFALLR3S1;
                    break;
                case 'Regional 3 Stage 2':
                    dataset = NAFALLR3S2;
                    break;
                case 'Regional 3 Playoffs':
                    dataset = NAFALLR3PO;
                    break;
                case 'Major Swiss':
                    dataset = NAFALLMASW;
                    break;
                case 'Major Playoffs':
                    dataset = NAFALLMAPO;
                    break;
            }
        } 
        if (region == "EU") {
            switch (selectedEvent) {
                case 'Regional 1 Stage 1':
                    dataset = EUFALLR1S1;
                    break;
                case 'Regional 1 Stage 2':
                    dataset = EUFALLR1S2;
                    break;
                case 'Regional 1 Playoffs':
                    dataset = EUFALLR1PO;
                    break;
                case 'Regional 2 Stage 1':
                    dataset = EUFALLR2S1;
                    break;
                case 'Regional 2 Stage 2':
                    dataset = EUFALLR2S2;
                    break;
                case 'Regional 2 Playoffs':
                    dataset = EUFALLR2PO;
                    break;
                case 'Regional 3 Stage 1':
                    dataset = EUFALLR3S1;
                    break;
                case 'Regional 3 Stage 2':
                    dataset = EUFALLR3S2;
                    break;
                case 'Regional 3 Playoffs':
                    dataset = EUFALLR3PO;
                    break;
                case 'Major Swiss':
                    dataset = EUFALLMASW;
                    break;
                case 'Major Playoffs':
                    dataset = EUFALLMAPO;
                    break;
            }
        }
    }
}


// search stuff
let enteredData;
function renderPlayerSearch() {
    return `<div class="box" style="display: flex">
    <span style="display: inline-flex; flex-grow: 1; align-items: center;">
    <span class="has-text-weight-bold">Result:</span>&nbsp;${searchName(dataset[0].players, enteredData)}</span>
    <strong>${foundNames}</strong>
</div>`
}
document.getElementById('pNameInput').addEventListener('keyup', event => {
    const $searchresults = $('#pName-results');
    $('#pName-results *').replaceWith();
    if (event.code === 'Enter') {
        if (event.currentTarget.value != '') {
            enteredData = event.currentTarget.value;
            $searchresults.append(renderPlayerSearch);
        }
    }
})
let enteredTeam;
function renderTeamSearch() {
    console.log(searchName(dataset[0].teams, enteredTeam))
    return `<div class="box" style="display: flex">
    <span style="display: inline-flex; flex-grow: 1; align-items: center;">
    <span class="has-text-weight-bold">Result:</span>&nbsp;${searchName(dataset[0].teams, enteredTeam)}</span>
    <strong>${foundNames}</strong>
</div>`
}
document.getElementById('tNameInput').addEventListener('keyup', event => {
    const $searchresults = $('#tName-results');
    $('#tName-results *').replaceWith();
    if (event.code === 'Enter') {
        if (event.currentTarget.value != '') {
            enteredTeam = event.currentTarget.value;
            $searchresults.append(renderTeamSearch);
        }
    }
})


function debounce(func, wait) {
    let timeout;
    return function(...args) {
      const context = this;
      const executor = function() {
        timeout = null;
        func.apply(context, args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(executor, wait);
    };
  }

/* 
  TO-DO: perform query
*/

function autoName(searchTerm) {
    if (searchTerm === "") {
        return "";
    }
    let replay_group = dataset[0].players;
    let data = replay_group.find(value => value.name.toLowerCase().indexOf(searchTerm.toLowerCase()) === 0);
    if (data !== undefined) {
        let name = data.name;
        console.log(name)
        return name;
    } else {
        return "";
    }
    
}

function autoTeam(searchTerm) {
    if (searchTerm === "") {
        return "";
    }
    let replay_group = dataset[0].teams;
    let data = replay_group.find(value => value.name.toLowerCase().indexOf(searchTerm.toLowerCase()) === 0);
    if (data !== undefined) {
        let name = data.name;
        console.log(name)
        return name;
    } else {
        return "";
    }
    
}

function handleNameAuto(event) {
    let output = document.getElementById('pNameAuto');
    const inputData = event.target.value;
    let replay_group = dataset[0].players;
    let data = autoName(inputData);
    enteredData = data;
    if (data !== "") {
        output.innerHTML = `<button>${data}</button>`;
    } else {
        output.innerHTML = ``;
    }
    
}

function handleTeamAuto(event) {
    let output = document.getElementById('tNameAuto');
    const inputData = event.target.value;
    let replay_group = dataset[0].players;
    let data = autoTeam(inputData);
    enteredTeam = data;
    if (data !== "") {
        output.innerHTML = `<button>${data}</button>`;
    } else {
        output.innerHTML = ``;
    }
    
}



document.getElementById('pNameInput').addEventListener('input', debounce(handleNameAuto, 400));
document.getElementById('tNameInput').addEventListener('input', debounce(handleTeamAuto, 400));

function handleSubmitPlayerAuto(event) {
    let output = document.getElementById('pNameAuto');
    output.innerHTML = ``;
    // $('#pNameInput').replaceWith(`<input class="input is-primary" id="pNameInput" type="text" placeholder="${enteredData}"/>`);
    const $searchresults = $('#pName-results');
    $searchresults.append(renderPlayerSearch);
}

function handleSubmitTeamAuto(event) {
    let output = document.getElementById('tNameAuto');
    output.innerHTML = ``;
    const $searchresults = $('#tName-results');
    $searchresults.append(renderTeamSearch);
}

function handleLogout(event) {
    $.ajax({
        url: '/logout',
        type: 'GET',
        dataType: 'json',
        success: function(response, textStatus, jqXHR) {
            $.router.set('/');
            location.reload();
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert("error logging out")
       }
     });
    
}

async function getDataBase(id) {
    let result = await $.ajax({
        url: '/getDBbyID',
        type: 'POST',
        dataType: 'json',
        data: { "id": id }
    });
    result = JSON.parse(JSON.stringify(result));
    console.log(result.responseJSON)
    dataset = result.responseJSON;
}

function handleSortPress(event) {
    let id = event.currentTarget.id;
    let arr = dataset[0].players;
    let arr2 = dataset[0].teams;
    switch (id) {
        case ('plname'):
            arr.sort(function compare(a, b) {
                const x = a.name.toUpperCase();
                const y = b.name.toUpperCase();

                let comparison = 0;
                if (x > y) {
                    if (sortConst == 0) { comparison = -1; } else { comparison = 1; }
                } else if (x < y) {
                    if (sortConst == 0) { comparison = 1; } else { comparison = -1; }
                }
                return comparison;
            })

            if (sortConst == 0) { sortConst = 1; } else { sortConst = 0; }

            dataset[0].players = arr;
            handlePlayersButtonClick()
            break;
        case ('plteam'):
            arr.sort(function compare(a, b) {
                const x = a.team.toUpperCase();
                const y = b.team.toUpperCase();

                let comparison = 0;
                if (x > y) {
                    if (sortConst == 0) { comparison = -1; } else { comparison = 1; }
                } else if (x < y) {
                    if (sortConst == 0) { comparison = 1; } else { comparison = -1; }
                }
                return comparison;
            })

            if (sortConst == 0) { sortConst = 1; } else { sortConst = 0; }

            dataset[0].players = arr;
            handlePlayersButtonClick()
            break;
        case ('plgmp'):
            arr.sort(function compare(a, b) {
                const x = a.cumulative.games;
                const y = b.cumulative.games;

                let comparison = 0;
                if (x > y) {
                    if (sortConst == 0) { comparison = -1; } else { comparison = 1; }
                } else if (x < y) {
                    if (sortConst == 0) { comparison = 1; } else { comparison = -1; }
                }
                return comparison;
            })

            if (sortConst == 0) { sortConst = 1; } else { sortConst = 0; }

            dataset[0].players = arr;
            handlePlayersButtonClick()
            break;
        case ('plwl'):
            arr.sort(function compare(a, b) {
                const x = a.cumulative.win_percentage;
                const y = b.cumulative.win_percentage;

                let comparison = 0;
                if (x > y) {
                    if (sortConst == 0) { comparison = -1; } else { comparison = 1; }
                } else if (x < y) {
                    if (sortConst == 0) { comparison = 1; } else { comparison = -1; }
                }
                return comparison;
            })

            if (sortConst == 0) { sortConst = 1; } else { sortConst = 0; }

            dataset[0].players = arr;
            handlePlayersButtonClick()
            break;
        case ('plavgscore'):
            arr.sort(function compare(a, b) {
                const x = a.game_average.core.score;
                const y = b.game_average.core.score;

                let comparison = 0;
                if (x > y) {
                    if (sortConst == 0) { comparison = -1; } else { comparison = 1; }
                } else if (x < y) {
                    if (sortConst == 0) { comparison = 1; } else { comparison = -1; }
                }
                return comparison;
            })

            if (sortConst == 0) { sortConst = 1; } else { sortConst = 0; }

            dataset[0].players = arr;
            handlePlayersButtonClick()
            break;
        case ('pldemodiff'):
            arr.sort(function compare(a, b) {
                const x = a.cumulative.demo.inflicted - a.cumulative.demo.taken;
                const y = b.cumulative.demo.inflicted - b.cumulative.demo.taken;

                let comparison = 0;
                if (x > y) {
                    if (sortConst == 0) { comparison = -1; } else { comparison = 1; }
                } else if (x < y) {
                    if (sortConst == 0) { comparison = 1; } else { comparison = -1; }
                }
                return comparison;
            })

            if (sortConst == 0) { sortConst = 1; } else { sortConst = 0; }

            dataset[0].players = arr;
            handlePlayersButtonClick()
            break;
        case ('plgpg'):
            arr.sort(function compare(a, b) {
                const x = a.game_average.core.goals;
                const y = b.game_average.core.goals;

                let comparison = 0;
                if (x > y) {
                    if (sortConst == 0) { comparison = -1; } else { comparison = 1; }
                } else if (x < y) {
                    if (sortConst == 0) { comparison = 1; } else { comparison = -1; }
                }
                return comparison;
            })

            if (sortConst == 0) { sortConst = 1; } else { sortConst = 0; }

            dataset[0].players = arr;
            handlePlayersButtonClick()
            break;
        case ('plapg'):
            arr.sort(function compare(a, b) {
                const x = a.game_average.core.assists;
                const y = b.game_average.core.assists;

                let comparison = 0;
                if (x > y) {
                    if (sortConst == 0) { comparison = -1; } else { comparison = 1; }
                } else if (x < y) {
                    if (sortConst == 0) { comparison = 1; } else { comparison = -1; }
                }
                return comparison;
            })

            if (sortConst == 0) { sortConst = 1; } else { sortConst = 0; }

            dataset[0].players = arr;
            handlePlayersButtonClick()
            break;
        case ('plsvpg'):
            arr.sort(function compare(a, b) {
                const x = a.game_average.core.saves;
                const y = b.game_average.core.saves;

                let comparison = 0;
                if (x > y) {
                    if (sortConst == 0) { comparison = -1; } else { comparison = 1; }
                } else if (x < y) {
                    if (sortConst == 0) { comparison = 1; } else { comparison = -1; }
                }
                return comparison;
            })

            if (sortConst == 0) { sortConst = 1; } else { sortConst = 0; }

            dataset[0].players = arr;
            handlePlayersButtonClick()
            break;
        case ('plshpg'):
            arr.sort(function compare(a, b) {
                const x = a.game_average.core.shots;
                const y = b.game_average.core.shots;

                let comparison = 0;
                if (x > y) {
                    if (sortConst == 0) { comparison = -1; } else { comparison = 1; }
                } else if (x < y) {
                    if (sortConst == 0) { comparison = 1; } else { comparison = -1; }
                }
                return comparison;
            })

            if (sortConst == 0) { sortConst = 1; } else { sortConst = 0; }

            dataset[0].players = arr;
            handlePlayersButtonClick()
            break;
        case ('plshpcg'):
            arr.sort(function compare(a, b) {
                const x = a.game_average.core.shooting_percentage;
                const y = b.game_average.core.shooting_percentage;

                let comparison = 0;
                if (x > y) {
                    if (sortConst == 0) { comparison = -1; } else { comparison = 1; }
                } else if (x < y) {
                    if (sortConst == 0) { comparison = 1; } else { comparison = -1; }
                }
                return comparison;
            })

            if (sortConst == 0) { sortConst = 1; } else { sortConst = 0; }

            dataset[0].players = arr;
            handlePlayersButtonClick()
            break;
        case ('plgp'):
            arr.sort(function compare(a, b) {
                const x = getGoalParticipation(a);
                const y = getGoalParticipation(b)


                let comparison = 0;
                if (x > y) {
                    if (sortConst == 0) { comparison = -1; } else { comparison = 1; }
                } else if (x < y) {
                    if (sortConst == 0) { comparison = 1; } else { comparison = -1; }
                }
                return comparison;
            })

            if (sortConst == 0) { sortConst = 1; } else { sortConst = 0; }

            dataset[0].players = arr;
            handlePlayersButtonClick()
            break;
        case ('tmname'):
            arr2.sort(function compare(a, b) {
                const x = a.name.toUpperCase();
                const y = b.name.toUpperCase();

                let comparison = 0;
                if (x > y) {
                    if (sortConst == 0) { comparison = -1; } else { comparison = 1; }
                } else if (x < y) {
                    if (sortConst == 0) { comparison = 1; } else { comparison = -1; }
                }
                return comparison;
            })

            if (sortConst == 0) { sortConst = 1; } else { sortConst = 0; }

            dataset[0].teams = arr2;
            handleTeamsButtonClick();
            break;
        case ('tmgmp'):
            arr2.sort(function compare(a, b) {
                const x = a.cumulative.games;
                const y = b.cumulative.games;

                let comparison = 0;
                if (x > y) {
                    if (sortConst == 0) { comparison = -1; } else { comparison = 1; }
                } else if (x < y) {
                    if (sortConst == 0) { comparison = 1; } else { comparison = -1; }
                }
                return comparison;
            })

            if (sortConst == 0) { sortConst = 1; } else { sortConst = 0; }

            dataset[0].teams = arr2;
            handleTeamsButtonClick()
            break;
        case ('tmwin'):
            arr2.sort(function compare(a, b) {
                const x = a.cumulative.wins;
                const y = b.cumulative.wins;

                let comparison = 0;
                if (x > y) {
                    if (sortConst == 0) { comparison = -1; } else { comparison = 1; }
                } else if (x < y) {
                    if (sortConst == 0) { comparison = 1; } else { comparison = -1; }
                }
                return comparison;
            })

            if (sortConst == 0) { sortConst = 1; } else { sortConst = 0; }

            dataset[0].teams = arr2;
            handleTeamsButtonClick()
            break;
        case ('tmloss'):
            arr2.sort(function compare(a, b) {
                const x = a.cumulative.games - a.cumulative.wins;
                const y = b.cumulative.games - b.cumulative.wins;

                let comparison = 0;
                if (x > y) {
                    if (sortConst == 0) { comparison = -1; } else { comparison = 1; }
                } else if (x < y) {
                    if (sortConst == 0) { comparison = 1; } else { comparison = -1; }
                }
                return comparison;
            })

            if (sortConst == 0) { sortConst = 1; } else { sortConst = 0; }

            dataset[0].teams = arr2;
            handleTeamsButtonClick()
            break;
        case ('tmwl'):
            arr2.sort(function compare(a, b) {
                const x = a.cumulative.win_percentage;
                const y = b.cumulative.win_percentage;

                let comparison = 0;
                if (x > y) {
                    if (sortConst == 0) { comparison = -1; } else { comparison = 1; }
                } else if (x < y) {
                    if (sortConst == 0) { comparison = 1; } else { comparison = -1; }
                }
                return comparison;
            })

            if (sortConst == 0) { sortConst = 1; } else { sortConst = 0; }

            dataset[0].teams = arr2;
            handleTeamsButtonClick()
            break;
        case ('tmgf'):
            arr2.sort(function compare(a, b) {
                const x = a.cumulative.core.goals;
                const y = b.cumulative.core.goals;

                let comparison = 0;
                if (x > y) {
                    if (sortConst == 0) { comparison = -1; } else { comparison = 1; }
                } else if (x < y) {
                    if (sortConst == 0) { comparison = 1; } else { comparison = -1; }
                }
                return comparison;
            })

            if (sortConst == 0) { sortConst = 1; } else { sortConst = 0; }

            dataset[0].teams = arr2;
            handleTeamsButtonClick()
            break;
        case ('tmga'):
            arr2.sort(function compare(a, b) {
                const x = a.cumulative.core.goals_against;
                const y = b.cumulative.core.goals_against;

                let comparison = 0;
                if (x > y) {
                    if (sortConst == 0) { comparison = -1; } else { comparison = 1; }
                } else if (x < y) {
                    if (sortConst == 0) { comparison = 1; } else { comparison = -1; }
                }
                return comparison;
            })

            if (sortConst == 0) { sortConst = 1; } else { sortConst = 0; }

            dataset[0].teams = arr2;
            handleTeamsButtonClick()
            break;
        case ('tmgpg'):
            arr2.sort(function compare(a, b) {
                const x = a.game_average.core.goals;
                const y = b.game_average.core.goals;

                let comparison = 0;
                if (x > y) {
                    if (sortConst == 0) { comparison = -1; } else { comparison = 1; }
                } else if (x < y) {
                    if (sortConst == 0) { comparison = 1; } else { comparison = -1; }
                }
                return comparison;
            })

            if (sortConst == 0) { sortConst = 1; } else { sortConst = 0; }

            dataset[0].teams = arr2;
            handleTeamsButtonClick()
            break;
        case ('tmapg'):
            arr2.sort(function compare(a, b) {
                const x = a.game_average.core.assists;
                const y = b.game_average.core.assists;

                let comparison = 0;
                if (x > y) {
                    if (sortConst == 0) { comparison = -1; } else { comparison = 1; }
                } else if (x < y) {
                    if (sortConst == 0) { comparison = 1; } else { comparison = -1; }
                }
                return comparison;
            })

            if (sortConst == 0) { sortConst = 1; } else { sortConst = 0; }

            dataset[0].teams = arr2;
            handleTeamsButtonClick()
            break;
        case ('tmsvpg'):
            arr2.sort(function compare(a, b) {
                const x = a.game_average.core.saves;
                const y = b.game_average.core.saves;

                let comparison = 0;
                if (x > y) {
                    if (sortConst == 0) { comparison = -1; } else { comparison = 1; }
                } else if (x < y) {
                    if (sortConst == 0) { comparison = 1; } else { comparison = -1; }
                }
                return comparison;
            })

            if (sortConst == 0) { sortConst = 1; } else { sortConst = 0; }

            dataset[0].teams = arr2;
            handleTeamsButtonClick()
            break;
        case ('tmshpg'):
            arr2.sort(function compare(a, b) {
                const x = a.game_average.core.shots;
                const y = b.game_average.core.shots;

                let comparison = 0;
                if (x > y) {
                    if (sortConst == 0) { comparison = -1; } else { comparison = 1; }
                } else if (x < y) {
                    if (sortConst == 0) { comparison = 1; } else { comparison = -1; }
                }
                return comparison;
            })

            if (sortConst == 0) { sortConst = 1; } else { sortConst = 0; }

            dataset[0].teams = arr2;
            handleTeamsButtonClick()
            break;
        case ('tmshpcg'):
            arr2.sort(function compare(a, b) {
                const x = a.game_average.core.shooting_percentage;
                const y = b.game_average.core.shooting_percentage;

                let comparison = 0;
                if (x > y) {
                    if (sortConst == 0) { comparison = -1; } else { comparison = 1; }
                } else if (x < y) {
                    if (sortConst == 0) { comparison = 1; } else { comparison = -1; }
                }
                return comparison;
            })

            if (sortConst == 0) { sortConst = 1; } else { sortConst = 0; }

            dataset[0].teams = arr2;
            handleTeamsButtonClick()
            break;
    }
}

// leaderboard stuff
function loadStuffIntoLeaderboard() {
    $("#root").append(renderSelectorBox());
    $(document).on("click", "#lbna", handleLeaderboardNAClick)
    $(document).on("click", "#lbeu", handleLeaderboardEUClick)
    $(document).on("click", "#lbfall", handleLeaderboardFallClick)
    $(document).on("click", "#lbwinter", handleLeaderboardWinterClick)
    $(document).on("click", "#lbspring", handleLeaderboardSpringClick)
    $(document).on("click", "#lbteams", handleTeamsButtonClick)
    $(document).on("click", "#lbplayers", handlePlayersButtonClick)
    $(document).on("click", "#pNameAuto", handleSubmitPlayerAuto)
    $(document).on("click", "#logout", handleLogout)
    $(document).on("click", "#tNameAuto", handleSubmitTeamAuto)
    $(document).on("change", "select.event", function () {
        let selectedEvent = $(this).children("option:selected").val()
        if (selectedEvent == "Select Event") {
            $("#PorTselectorplaceholder").empty();
        } else {
            $("#PorTselectorplaceholder").empty();
            $("#PorTselectorplaceholder").append(renderLeaderboardPlayerTeamSelector)
        }
        handleSelectedEvent(selectedEvent);
    });


    $.ajax({
        url: '/getLoggedInUser',
        type: 'GET',
        dataType: 'json',
        success: function(response, textStatus, jqXHR) {
            let name = jqXHR.responseJSON;
            $("#loginButton").html('Welcome, ' + name + `<br><br><button class="button" id="logout">Log Out</button>`)
        },
        error: function(jqXHR, textStatus, errorThrown){

       }
     });
    $.ajax({
        url: '/getplayernames',
        type: 'GET',
        dataType: 'json',
        success: function (response, textStatus, jqXHR) {
            playerNames = JSON.parse(JSON.stringify(jqXHR.responseJSON));
            console.log(playerNames)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown)
        }
    });
    $.ajax({
        url: '/getteamnames',
        type: 'GET',
        dataType: 'json',
        success: function (response, textStatus, jqXHR) {
            teamNames = JSON.parse(JSON.stringify(jqXHR.responseJSON));
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown)
        }
    });
}
loadStuffIntoLeaderboard();
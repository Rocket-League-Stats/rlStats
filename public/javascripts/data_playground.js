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
import countryOfPlayers from "../data/countryOfPlayers.js";
import currentTeams from "../data/currentTeams.js";

let dataset = [];
let foundNames = [];
let tmpGlobalincrement = 1;
let region;
let season;
let sortConst = 0;
let favoritedPlayers = []
let favoritedTeams = []
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
        <th class="sort" id="tmname">Team</th>
        <th class="sort" id="tmgmp"><abbr title="Games Played">GMP</abbr></th>
        <th class="sort" id="tmwin"><abbr title="Games Won">W</abbr></th>
        <th class="sort" id="tmloss"><abbr title="Games Lost">L</abbr></th>
        <th class="sort" id="tmwl"><abbr title="Win Percentage">WL%</abbr></th>
        <th class="sort" id="tmgf"><abbr title="Goals For">GF</abbr></th>
        <th class="sort" id="tmga"><abbr title="Goals Against">GA</abbr></th>
        <th class="sort" id="tmgpg"><abbr title="Goals Per Game">GPG</abbr></th>
        <th class="sort" id="tmapg"><abbr title="Assists Per Game">APG</abbr></th>
        <th class="sort" id="tmsvpg"><abbr title="Saves Per Game">SVPG</abbr></th>
        <th class="sort" id="tmshpg"><abbr title="Shots Per Game">SHPG</abbr></th>
        <th class="sort" id="tmshpcg"><abbr title="Shooting Percentage">SH%</abbr></th>
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
        <th class="sort" id="plname">Name<i id="arrow"></i></th>
        <th class="sort" id="plteam">Team<i id="arrow"></th>
        <th class="sort" id="plgmp"><abbr title="Games Played">GMP<i id="arrow"></abbr></th>
        <th class="sort" id="plwl"><abbr title="Win Percentage">WL%<i id="arrow"></abbr></th>
        <th class="sort" id="plavgscore"><abbr title="Average Score">Score<i id="arrow"></abbr></th>
        <th class="sort" id="pldemodiff"><abbr title="Demolition Differential">DMD<i id="arrow"></abbr></th>
        <th class="sort" id="plgpg"><abbr title="Goals Per Game">GPG<i id="arrow"></abbr></th>
        <th class="sort" id="plapg"><abbr title="Assists Per Game">APG<i id="arrow"></abbr></th>
        <th class="sort" id="plsvpg"><abbr title="Saves Per Game">SVPG<i id="arrow"></abbr></th>
        <th class="sort" id="plshpg"><abbr title="Shots Per Game">SHPG<i id="arrow"></abbr></th>
        <th class="sort" id="plshpcg"><abbr title="Shooting Percentage">SH%<i id="arrow"></abbr></th>
        <th class="sort" id="plgp"><abbr title="Goal Participation">GP%<i id="arrow"></abbr></th>
      </tr>
    </thead>
    <tbody id="tbody">
    </tbody>
    </table>`
}

function renderTeamTableEntry(team) {
    return `<tr>
    <th>${tmpGlobalincrement}</th>
    <td><a id="${team.name}Name" class="teamName">${teamCase(team.name)}</a><span class="tmheart" id="${team.name}" state="unliked"><a><i class="far fa-heart" id="tmheart${team.name}" state="unliked"></a></i></span></td>
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
    <td><a id="${player.name}Name" class="playerName">${player.name}</a><span class="heart" id="${player.name}" state="unliked"><a><i class="far fa-heart" id="heart${player.name}" state="unliked"></a></i></span></td>
    <td>${teamCase(player.team)}</td>
    <td>${player.cumulative.games}</td>
    <td>${player.cumulative.win_percentage.toFixed(1)}</td>
    <td>${(player.cumulative.core.score / player.cumulative.games).toFixed(1)}</td>
    <td>${player.cumulative.demo.inflicted - player.cumulative.demo.taken}</td>
    <td>${player.game_average.core.goals.toFixed(2)}</td>
    <td>${player.game_average.core.assists.toFixed(2)}</td>
    <td>${player.game_average.core.saves.toFixed(2)}</td>
    <td>${player.game_average.core.shots.toFixed(2)}</td>
    <td>${player.game_average.core.shooting_percentage.toFixed(2)}</td>
    <td>${getGoalParticipation(player).toFixed(2)}</td>
  </tr>`
}

function renderPlayerCard(player) {
    let country = findCountry(player.toLowerCase())
    let team = findCurrentTeamByPlayer(player)
    let teamStr = ""
    if (team.name == "Not Found") {
        teamStr = `<h2 id="${player}Team" class="${player}">Current Team: Not Found</h2>`
    } else {
        teamStr = `<h2 id="${player}Team" class="${player}">Current Team: <a id="${team.name}Name" class="teamName">${team.name}</a></h2>`
    }

    $('.modal').replaceWith(`
        <div id="${player}Card" class="modal is-active playerCard">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <i class="far fa-user fa-2x">&nbsp</i>
                    <p id="${player}Name" class="modal-card-title">&nbsp${player}</p>
                    <button class="delete" aria-label="close"></button>
                </header>
                <section class="modal-card-body">
                <img class="logo" width="72px" height="72px" src="${(team.img != "") ? team.img : "images/icons/unknown.png"}">
                    <div>
                        <h2 id="${player}Country" class="${country.name}">Country of Origin: ${country.name} <img width="18px" height="18px" src="${country.img}"></h2>
                        <h2 id="${player}Status" class="true">Status: ${team.name != "Not Found" ? "Active" : "Free Agent"}&nbsp<img width="18px" height="18px" src="${team.name != "Not Found" ? "images/icons/Green Status.jpg" : "images/icons/Blue Status.jpg"}"></h2>
                        ${teamStr}
                    </div>
                </section>
                <footer class="modal-card-foot" style="float: right">
                <i class="fas fa-info-circle"></i>
                <p>&nbsp Note: The stats shown here are based on the current status of the player.</p>        
                </footer>
            </div>
        </div>
    `)
}

function renderTeamCard(team) {
    let teamPlayers = ""
    for (let i = 0; i < team.players.length; i++) {
        teamPlayers += `<li> - <a id="${team.players[i] + "Name"}" class="playerName">${team.players[i]}</a></li>`
    }

    let teamSub = ""
    if (team.sub != "") {
        teamSub = `<a id="${team.sub + "Name"}" class="playerName">${team.sub}</a>`
    }

    let teamCoach = ""
    if (team.coach != "") {
        teamCoach = `<a id="${team.coach + "Name"}" class="playerName">${team.coach}</a>`
    }

    let teamStatus = ""
    let teamStatusIMG = ""
    if (team.status) {
        if (team.players.length < 3) {
            teamStatus = "Incompete Roster"
            teamStatusIMG = "images/icons/Blue Status.jpg"
        } else {
            teamStatus = "Active"
            teamStatusIMG = "images/icons/Green Status.jpg"
        }
    } else {
        teamStatus = "Inactive"
        teamStatusIMG = "images/icons/Red Status.jpg"
    }

    let isFavorited = false
    for (let i = 0; i < favoritedTeams.length; i++) {
        if(removeSpecialChar(favoritedTeams[i].name).trim() == removeSpecialChar(team.name).trim()) {
            isFavorited = true;
            break;
        }
    }

    $('.modal').replaceWith(`
    <div id="${team.name}Card" class="modal is-active teamCard">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
        <i class="fas fa-users fa-2x">&nbsp</i>
          <p id="${team.name}Name" class="modal-card-title">&nbsp${teamCase(team.name)}</p>
          <button class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body">
        <img class="logo" width="152px" height="152px" src="${(team.img != "") ? team.img : "images/icons/unknown.png"}">
          <div>
            <h2 id="${team.name}Status">Status: ${teamStatus} <img width="18px" height="18px" src="${teamStatusIMG}"></h2>
            <h2 id="${team.name}Players">${team.status ? "Current" : "Former"} Players: </h2>
            <div>
                <ul>
                    ${teamPlayers}
                </ul>
            </div>
            </div>
            <div>
                <h2>${team.coach != "" ? "Coach: " + teamCoach : ""}</h2>
                <h2>${team.sub != "" ? "Substitute: " + teamSub : ""}</h2>
            </div>
        </section>
        <footer class="modal-card-foot">
        <i class="fas fa-info-circle"></i>
                <p>&nbsp Note: The stats shown here are based on the current status of the team.</p>
        </footer>
      </div>
    </div>`)
}

function teamCase(str) {
    let findTeam = findTeamByAlias(str)
    if (findTeam == currentTeams[0].name) {
        return titleCase(str)
    } else {
        return findTeam.name
    }
}

function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
}

function removeSpecialChar(str){
    str = str.toLowerCase()
    if(str == null || str == ''){
    return '';
    }
    return str.replace(/[^\w\s]/gi, "").trim();
}

function findCountry(player) {
    let country = ""
    for (let i = 1; i < countryOfPlayers.length; i++) {
        let playerArr = countryOfPlayers[i].players
        for (let j = 0; j < playerArr.length; j++) {
            if (removeSpecialChar(playerArr[j]) == removeSpecialChar(player)) {
                country = countryOfPlayers[i];
                return country
            }
        }
    }
    return countryOfPlayers[0]
}

function findCurrentTeamByPlayer(player) {
    if (player == "Adverse") {
        player = "AdverseMeteor"
    }

    for (let i = 0; i < currentTeams.length; i++) {
        if (currentTeams[i].status) {
            if (removeSpecialChar(currentTeams[i].sub).trim() == removeSpecialChar(player).trim() || removeSpecialChar(currentTeams[i].coach).trim() == removeSpecialChar(player).trim()) {
                return currentTeams[i];
            }
            let playerArr = currentTeams[i].players
            for (let j = 0; j < playerArr.length; j++) {
                if (removeSpecialChar(playerArr[j]).trim() == removeSpecialChar(player).trim()) {
                    return currentTeams[i];
                }
            }
        }
    }
    return (currentTeams[0])
}

function findTeamByAlias(teamAlias) {
    for (let i = 1; i < currentTeams.length; i++) {
        if (removeSpecialChar(currentTeams[i].name).trim() == removeSpecialChar(teamAlias).trim()) {
            return currentTeams[i]
        } else {
            for (let j = 0; j < currentTeams[i].alias.length; j++) {
                if (removeSpecialChar(currentTeams[i].alias[j]).trim() == removeSpecialChar(teamAlias).trim())
                    return currentTeams[i]
            }
        }
    }
    return currentTeams[0]
}

function renderLikedHeart(playerName) {
    return `<span class="heart" id="${playerName}" state="liked"><a><i class="fa fa-heart" id="heart${playerName}" state="liked" style="color: red"></a></i></span>`
}

function renderUnLikedHeart(playerName) {
    return `<span class="heart" id="${playerName}" state="unliked"><a><i class="far fa-heart" id="heart${playerName}" state="unliked"></a></i></span>`
}

function renderTeamLikedHeart(teamName) {
    return `<span class="tmheart" id="${teamName}" state="liked"><a><i class="fa fa-heart" id="tmheart${teamName}" state="liked" style="color: red"></a></i></span>`
}

function renderTeamUnLikedHeart(teamName) {
    return `<span class="tmheart" id="${teamName}" state="unliked"><a><i class="far fa-heart" id="tmheart${teamName}" state="unliked"></a></i></span>`
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
    return `<div class="select is-primary" id="eventselector">
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

function renderPlayerSearchBar() {
    return `<input class="input is-primary" id="pNameInput" type="text" placeholder="Search by player name..." />
    <div id="pNameAuto"></div>
    <div id="pName-results"></div>`
}

function renderTeamSearchBar() {
    return `<input class="input is-primary" id="tNameInput" type="text" placeholder="Search by team name..." />
    <div id="tNameAuto"></div>
    <div id="tName-results"></div>`
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
    $.ajax({
        url: '/secretteam',
        type: 'GET',
        dataType: 'json',
        success: function (response, textStatus, jqXHR) {
            for (let i = 0; i < jqXHR.responseJSON.length; i++) {
                favoritedTeams[i] = jqXHR.responseJSON[i];
            }
            for (let i = 0; i < favoritedTeams.length; i++) {
                $('#' + favoritedTeams[i].name).replaceWith(renderTeamLikedHeart(favoritedTeams[i].name))
            }
        }
    })
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
    for (let i = 0; i < favoritedPlayers.length; i++) {
        $('#' + CSS.escape(favoritedPlayers[i].name)).replaceWith(renderLikedHeart(favoritedPlayers[i].name))
    }
    $.ajax({
        url: '/secret',
        type: 'GET',
        dataType: 'json',
        success: function (response, textStatus, jqXHR) {
            for (let i = 0; i < jqXHR.responseJSON.length; i++) {
                favoritedPlayers[i] = jqXHR.responseJSON[i];
            }
            for (let i = 0; i < favoritedPlayers.length; i++) {
                $('#' + CSS.escape(favoritedPlayers[i].name)).replaceWith(renderLikedHeart(favoritedPlayers[i].name))
            }
        }
    })
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
    let ans = ((goalsParticipatedIn / team[index].cumulative.core.goals) * 100);
    return ans;
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
                    dataset = NAFALLR1S1
                    break;
                case 'Regional 1 Stage 2':
                    dataset = NAFALLR1S2
                    break;
                case 'Regional 1 Playoffs':
                    dataset = NAFALLR1PO
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

function handlePlayerNameClick(event) {
    let playerName = event.target.id.replace("Name", "")
    $.ajax({
        url: '/secret',
        type: 'GET',
        dataType: 'json',
        success: function (response, textStatus, jqXHR) {
            favoritedPlayers = jqXHR.responseJSON;
        }
    })
    renderPlayerCard(playerName)
}

function handleTeamNameClick(event) {
    let teamName = event.target.id.replace("Name", "")
    $.ajax({
        url: '/secretteam',
        type: 'GET',
        dataType: 'json',
        success: function (response, textStatus, jqXHR) {
            favoritedTeams = jqXHR.responseJSON;
        }
    })
    renderTeamCard(findTeamByAlias(teamName))
}

function handleLikeButtonClick(event) {
    let heartID = event.currentTarget.getAttribute('id');
    let player = dataset[0].players.find(p => p.name == heartID.split("heart").join(""));
    let state = event.currentTarget.getAttribute('state');

    if (state == "unliked") {
        $('#' + CSS.escape(heartID)).empty()
        $('#' + CSS.escape(heartID)).replaceWith(renderLikedHeart(player.name))
        $.ajax({
            url: '/secret',
            type: 'POST',
            data: { "favorite": JSON.stringify(player) }
        });
    }
    if (state == "liked") {
        $('#' + CSS.escape(heartID)).empty()
        $('#' + CSS.escape(heartID)).replaceWith(renderUnLikedHeart(player.name))

         $.ajax({
            url: '/deletesecret',
            type: 'POST',
            data: { "id": JSON.stringify(player) }
        });
    }
}

function handleCloseModal() {
    $('.playerCard').replaceWith(`<div class="modal">`)
    $('.teamCard').replaceWith(`<div class="modal">`)
}

function handleTeamLikeButtonClick(event) {
    let heartID = event.currentTarget.getAttribute('id');
    let state = event.currentTarget.getAttribute('state');
    let team = dataset[0].teams.find(t => removeSpecialChar(t.name).trim() == removeSpecialChar(heartID.split("tmheart").join("")).trim());
    if (state == "unliked") {
        $('#' + CSS.escape(heartID)).empty()
        $('#' + CSS.escape(heartID)).replaceWith(renderTeamLikedHeart(team.name))
        $.ajax({
            url: '/secretteam',
            type: 'POST',
            data: { "favorite": JSON.stringify(team) }
        });
    }
    if (state == "liked") {
        $('#' + CSS.escape(heartID)).empty()
        $('#' + CSS.escape(heartID)).replaceWith(renderTeamUnLikedHeart(team.name))
        $.ajax({
            url: '/deletesecretteam',
            type: 'POST',
            data: { "id": JSON.stringify(team) }
        });
    }
}

// search stuff
let enteredData;
function renderPlayerSearch(player) {
    return `<div class="box" style="display: flex">
                    <span style="display: inline-flex; flex-grow: 1; align-items: center;">
                    <span class="has-text-weight-bold">Result:</span>&nbsp;${player.name}</span>
                    <button class="button" id="pSearchResult" data-id="${player.name}">Player Card</button>
                </div>`
}

function handleClickPlayerResult(event) {
    let player = event.currentTarget.dataset.id;
    renderPlayerCard(player)
}

async function handleSearchName(event) {
    const $searchresults = $('#pName-results');
    $('#pName-results *').replaceWith();
    if (event.code === 'Enter') {
        if (event.currentTarget.value != '') {
            enteredData = event.currentTarget.value;
            let result = await $.ajax({
                url: '/getoneplayer',
                type: 'POST',
                dataType: 'json',
                data: { "name": enteredData },
                success: function (response, textStatus, jqXHR) {
                    let player = jqXHR.responseJSON
                    $searchresults.append(renderPlayerSearch(player));
                }
            });
           
        }
    }
}
let enteredTeam;
function renderTeamSearch(team) {
    return `<div class="box" style="display: flex">
                    <span style="display: inline-flex; flex-grow: 1; align-items: center;">
                    <span class="has-text-weight-bold">Result:</span>&nbsp;${team.name}</span>
                    <button class="button" id="tSearchResult" data-id="${team.name}">Team Card</button>
                </div>`
}
function handleClickTeamResult(event) {
    let team = event.currentTarget.dataset.id;
    renderTeamCard(findTeamByAlias(team))
}
async function handleSearchTeam(event) {
    const $searchresults = $('#tName-results');
    $('#tName-results *').replaceWith();
    if (event.code === 'Enter') {
        if (event.currentTarget.value != '') {
            enteredTeam = event.currentTarget.value;
            let result = await $.ajax({
                url: '/getoneteam',
                type: 'POST',
                dataType: 'json',
                data: { "name": enteredTeam },
                success: function (response, textStatus, jqXHR) {
                    let team = jqXHR.responseJSON
                    $searchresults.append(renderTeamSearch(team));
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(errorThrown)
                }
            });
        }
    }
}
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        const context = this;
        const executor = function () {
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
    let data = playerNames.find(value => value.toLowerCase().indexOf(searchTerm.toLowerCase()) === 0);
    if (data !== undefined) {
        let name = data;
        return name;
    } else {
        return "";
    }

}

function autoTeam(searchTerm) {
    if (searchTerm === "") {
        return "";
    }
    let data = teamNames.find(value => value.toLowerCase().indexOf(searchTerm.toLowerCase()) === 0);
    if (data !== undefined) {
        let name = data;
        return name;
    } else {
        return "";
    }

}

function handleNameAuto(event) {
    let output = document.getElementById('pNameAuto');
    const inputData = event.target.value;
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
    let data = autoTeam(inputData);
    enteredTeam = data;
    if (data !== "") {
        output.innerHTML = `<button>${data}</button>`;
    } else {
        output.innerHTML = ``;
    }

}

document.getElementById('tNameInput').addEventListener('input', debounce(handleTeamAuto, 400));

async function handleSubmitPlayerAuto(event) {
    let output = document.getElementById('pNameAuto');
    output.innerHTML = ``;
    const $searchresults = $('#pName-results');
    let result = await $.ajax({
        url: '/getoneplayer',
        type: 'POST',
        dataType: 'json',
        data: { "name": enteredData },
        success: function (response, textStatus, jqXHR) {
            let player = jqXHR.responseJSON
            $searchresults.append(renderPlayerSearch(player));
        }
    });
}

async function handleSubmitTeamAuto(event) {
    let output = document.getElementById('tNameAuto');
    output.innerHTML = ``;
    const $searchresults = $('#tName-results');
    let result = await $.ajax({
        url: '/getoneteam',
        type: 'POST',
        dataType: 'json',
        data: { "name": enteredTeam },
        success: function (response, textStatus, jqXHR) {
            let team = jqXHR.responseJSON
            $searchresults.append(renderTeamSearch(team));
        }
    });
}

function handleLogout(event) {
    $.ajax({
        url: '/logout',
        type: 'GET',
        dataType: 'json',
        success: function (response, textStatus, jqXHR) {
            $.router.set('/');
            location.reload();
        },
        error: function (jqXHR, textStatus, errorThrown) {
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
    dataset = result.responseJSON;
}

async function getPlayerByName(name) {
    let result = await $.ajax({
        url: '/getplayerbyname',
        type: 'POST',
        dataType: 'json',
        data: { "name": name }
    });
    result = JSON.parse(JSON.stringify(result));
    return result.responseJSON;
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
                    // handle
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

function handlePlayerSearchClick() {
    $("#searchappend").empty();
    $("#searchappend").append(renderPlayerSearchBar());
    $("#plsearch").addClass("is-primary")
    $("#tmsearch").removeClass("is-primary")
    document.getElementById('pNameInput').addEventListener('input', debounce(handleNameAuto, 400));
}

function handleTeamSearchClick() {
    $("#searchappend").empty();
    $("#searchappend").append(renderTeamSearchBar());
    $("#tmsearch").addClass("is-primary")
    $("#plsearch").removeClass("is-primary")
    document.getElementById('tNameInput').addEventListener('input', debounce(handleTeamAuto, 400));
}

// leaderboard stuff
function loadStuffIntoDOM() {
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
    $(document).on("click", ".heart", handleLikeButtonClick)
    $(document).on("click", ".playerName", handlePlayerNameClick)
    $(document).on("click", ".teamName", handleTeamNameClick)
    $(document).on('click', '.delete', handleCloseModal)
    $(document).on('click', '.modal-background', handleCloseModal)
    $(document).on("click", ".tmheart", handleTeamLikeButtonClick)
    $(document).on("click", ".sort", handleSortPress)
    $(document).on('keyup', '#pNameInput', handleSearchName)
    $(document).on('keyup', '#tNameInput', handleSearchTeam)
    $(document).on("click", "#pSearchResult", handleClickPlayerResult)
    $(document).on("click", "#tSearchResult", handleClickTeamResult)
    $(document).on("click", "#plsearch", handlePlayerSearchClick)
    $(document).on("click", "#tmsearch", handleTeamSearchClick)
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
        success: function (response, textStatus, jqXHR) {
            let name = jqXHR.responseJSON;
            $("#loginButton").empty()
            $("#loginButton").append(`<div class="buttons" style="display: flex;  justify-content: flex-end;" id="loginButton">
                                        <div class="box"><p>You are now logged in as: ${name}</p>                      
                                            <a href="/favorites">
                                            <button class="button"> View My Favorites&nbsp&nbsp<i class="fas fa-heart" style="color: hsl(171, 100%, 41%)"></i></button>
                                            </a>
                                            <button class="button" id="logout">Log Out</button>
                                        </div>
                                    </div>`)
            $.ajax({
                url: '/secret',
                type: 'GET',
                dataType: 'json',
                success: function (response, textStatus, jqXHR) {
                    for (let i = 0; i < jqXHR.responseJSON.length; i++) {
                        favoritedPlayers[i] = jqXHR.responseJSON[i];
                    }
                    for (let i = 0; i < favoritedPlayers.length; i++) {
                        $('#' + CSS.escape(favoritedPlayers[i].name)).replaceWith(renderLikedHeart(favoritedPlayers[i].name))
                    }
                }
            })
            $.ajax({
                url: '/secretteam',
                type: 'GET',
                dataType: 'json',
                success: function (response, textStatus, jqXHR) {
                    for (let i = 0; i < jqXHR.responseJSON.length; i++) {
                        favoritedTeams[i] = jqXHR.responseJSON[i];
                    }
                    for (let i = 0; i < favoritedTeams.length; i++) {
                        $('#' + CSS.escape(favoritedTeams[i].name)).replaceWith(renderTeamLikedHeart(CSS.escape(favoritedTeams[i].name)))
                    }
                }
            })
        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    });
    $.ajax({
        url: '/getplayernames',
        type: 'GET',
        dataType: 'json',
        success: function (response, textStatus, jqXHR) {
            playerNames = JSON.parse(JSON.stringify(jqXHR.responseJSON));
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
loadStuffIntoDOM();
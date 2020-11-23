import countryOfPlayers from "../data/countryOfPlayers.js";
import currentTeams from "../data/currentTeams.js";

let favoritedPlayers = []
let favoritedTeams = []
let tmpGlobalincrement = 1;
let tempPlayers = [];

function findCountry(player) {
    let country = ""
    for (let i = 1; i < countryOfPlayers.length; i++) {
        let playerArr = countryOfPlayers[i].players
        for (let j = 0; j < playerArr.length; j++) {
            if (playerArr[j].toLowerCase() == player) {
                country = countryOfPlayers[i];
                return country
            }
        }
    }
    return countryOfPlayers[0]
}

function findTeamByAlias(teamAlias) {
    for (let i = 1; i < currentTeams.length; i++) {
        if (currentTeams[i].name.toLowerCase() == teamAlias.toLowerCase()) {
            return currentTeams[i]
        } else {
            for (let j = 0; j < currentTeams[i].alias.length; j++) {
                if (currentTeams[i].alias[j].toLowerCase() == teamAlias.toLowerCase())
                    return currentTeams[i]
            }
        }
    }
    return currentTeams[0]
}


function findCurrentTeamByPlayer(player) {
    for (let i = 0; i < currentTeams.length; i++) {
        if (currentTeams[i].status) {
            if (currentTeams[i].sub.toLowerCase() == player.toLowerCase() || currentTeams[i].coach.toLowerCase() == player.toLowerCase() ) {
                return currentTeams[i];
            }
            let playerArr = currentTeams[i].players
            for (let j = 0; j < playerArr.length; j++) {
                if (playerArr[j].toLowerCase() == player.toLowerCase()) {
                    return currentTeams[i];
                }
            }
        }
    }
    return (currentTeams[0])
}
async function renderPlayerCard(player) {
    let country = findCountry(player.name.toLowerCase())
    let team = findCurrentTeamByPlayer(player.name)
    await getPlayer(player.name)
    let goals=0, wins=0, games=0, shots = 0, assists=0, saves=0, boost=0, score=0;
    
    for (let i=0; i<tempPlayers.length; i++) {
        goals += tempPlayers[i].cumulative.core.goals;
        wins += tempPlayers[i].cumulative.wins;
        games += tempPlayers[i].cumulative.games;
        shots += tempPlayers[i].cumulative.core.shots;
        assists += tempPlayers[i].cumulative.core.assists;
        saves += tempPlayers[i].cumulative.core.saves;
        boost += tempPlayers[i].cumulative.boost.amount_collected;
        score += tempPlayers[i].cumulative.core.score;
    }



    $('#table').append(
        `<div id="${player.name}" class="box">
                <div class="columns is-multiline justify-center">
                    <div class="column">
                        <h1 class="title" style="">${player.name}</h1>
                        <h2 id="${player}Status" class="true">Status: ${team.name != "Not Found" ? "Active" : "Free Agent"}&nbsp<img width="18px" height="18px" src="${team.name != "Not Found" ? "../images/icons/Green Status.jpg" : "../images/icons/Blue Status.jpg"}"></h2>
                        <h2>Country of Origin: ${country.name} <img width="18px" height="18px" src="${country.img}"></h2>
                        <h2>Team: ${team.name}</h2>
                    </div>

                    <div class="column">
                        <img class="logo" width="144px" height="144px" src="${(team.img != "") ? team.img : "images/icons/unknown.png"}">
                    </div>

                    <div class="column">
                    <h2 class="subtitle"><b>Total RLCSX Goals:</b> ${goals}</h2>
                    <h2 class="subtitle"><b>Total RLCSX Wins:</b> ${wins}</h2>
                    <h2 class="subtitle"><b>Total RLCSX Games:</b> ${games}</h2>
                    <h2 class="subtitle"><b>Total RLCSX Shots:</b> ${shots}</h2>
                    </div>

                    <div class="column">
                    <h2 class="subtitle"><b>Total RLCSX Saves:</b> ${saves}</h2>
                    <h2 class="subtitle"><b>Total RLCSX Assists:</b> ${assists}</h2>
                    <h2 class="subtitle"><b>Total RLCSX Boost:</b> ${boost}</h2>
                    <h2 class="subtitle"><b>Total RLCSX Score:</b> ${score}</h2>
                    </div>
                    
                </div>
            </div>`)
}

function renderTeamCard(queryTeam) {
    let team = findTeamByAlias(queryTeam.name);
    let teamPlayers = ""
    for (let i = 0; i < team.players.length; i++) {
        teamPlayers += `<li> - ${team.players[i]}</li>`
    }

    let teamSub = ""
    if (team.sub != "") {
        teamSub = `${team.sub}`
    }

    let teamCoach = ""
    if (team.coach != "") {
        teamCoach = `${team.coach}`
    }

    let teamStatus = ""
    let teamStatusIMG = ""
    if (team.status) {
        if (team.players.length < 3) {
            teamStatus = "Incompete Roster"
            teamStatusIMG = "../images/icons/Blue Status.jpg"
        } else {
            teamStatus = "Active"
            teamStatusIMG = "../images/icons/Green Status.jpg"
        }
    } else {
        teamStatus = "Inactive"
        teamStatusIMG = "../images/icons/Red Status.jpg"
    }

    $('#table').append(
        `<div id="${team.name}" class="box">
                <div class="columns is-multiline justify-center">
                    <div class="column">
                        <h1 class="title" style="">${team.name}</h1>
                        <h2 class="subtitle">Region: ${team.region} <img width="18px" height="18px" src="${team.region == "Europe" ? `images/flag icons/Europe.png` : `images/flag icons/North America.png`}"></h2> 
                    </div>
                    <div class="column">
                        <h2 id="${team.name}Status">Status: ${teamStatus} <img width="18px" height="18px" src="${teamStatusIMG}"></h2>
                        <h2 id="${team.name}Players">${team.status ? "Current" : "Former"} Players: </h2>            
                        <ul>
                                ${teamPlayers}
                        </ul>    
                        <h2>${team.coach != "" ? "Coach: " + teamCoach : ""}</h2>
                        <h2>${team.sub != "" ? "Substitute: " + teamSub : ""}</h2>              
                    </div>
                    <div class="column">
                        <img class="logo" width="100px" height="100px" src="${(team.img != "") ? team.img : "images/icons/unknown.png"}">
                    </div>
                </div>
            </div>
        </div>`)
}

async function handleTeamsButtonClick() {
    $("#lbteams").addClass("is-primary")
    $("#lbplayers").removeClass("is-primary")
    tmpGlobalincrement = 1;
    $("#table").empty();
    for (let i = 0; i < favoritedTeams.length; i++) {
       await renderTeamCard(favoritedTeams[i]);
    }
}

async function handlePlayersButtonClick() {
    $("#lbplayers").addClass("is-primary")
    $("#lbteams").removeClass("is-primary")
    tmpGlobalincrement = 1;
    $("#table").empty();
    for (let i = 0; i < favoritedPlayers.length; i++) {
       await renderPlayerCard(favoritedPlayers[i]);
    }
}

async function getPlayer(name){
    return await $.ajax({
        url: '/getplayerbyname',
        type: 'POST',
        dataType: 'json',
        data: {"name": name},
        success: function (response, textStatus, jqXHR) {
            tempPlayers = jqXHR.responseJSON;  
        }
    })

}

function loadStuffIntoDom() {
    $(document).on("click", "#lbteams", handleTeamsButtonClick)
    $(document).on("click", "#lbplayers", handlePlayersButtonClick)
    
    $.ajax({
        url: '/secret',
        type: 'GET',
        dataType: 'json',
        success: function (response, textStatus, jqXHR) {
            favoritedPlayers = jqXHR.responseJSON;
        }
    })
    $.ajax({
        url: '/secretteam',
        type: 'GET',
        dataType: 'json',
        success: function (response, textStatus, jqXHR) {
            favoritedTeams = jqXHR.responseJSON;      
        }
    })
}
loadStuffIntoDom();
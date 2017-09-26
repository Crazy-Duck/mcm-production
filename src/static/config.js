function getData(url, cb) {
	let xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.onreadystatechange = () => {
		if (xhr.readyState == 4 && xhr.status == 200) {
			cb(JSON.parse(xhr.responseText));
		}
	};
	xhr.send();
}

function setOptions(options, element) {
	element.options.length = 0;
	options.map(option => element.options[element.options.length] = new Option(option.name, option.id));
}


window.onload = () => {
    let division1 = document.getElementById("home_division");
    let division2 = document.getElementById("away_division");

    let team1 = document.getElementById("home_team");
    let team2 = document.getElementById("away_team");

    let mid1 = document.getElementById("home_mid");
    let mid2 = document.getElementById("away_mid");

    document.getElementById("divisions").addEventListener('click', event => {
        getData(	"/api/competitions/" + division1.value + "/teams", 
					teams => setOptions(teams, team1));
        getData(	"/api/competitions/" + division2.value + "/teams", 
					teams => setOptions(teams, team2));
	});

    document.getElementById("teams").addEventListener('click', event => {
        getData("/api/teams/" + team1.value + "/players", 
				players => setOptions(players, mid1));
        getData("/api/teams/" + team2.value + "/players", 
				players => setOptions(players, mid2));
	});

    document.getElementById("submit").addEventListener('click', event => {
        let xhr = new XMLHttpRequest();
        let url = "/config";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json");

        let data = {};
		data.divisions = {  'home': parseInt(division1.value),
							'away': parseInt(division2.value)};
        data.teams = {
            'home': parseInt(team1.value),
            'away': parseInt(team2.value)
        };
        data.mids = {
            'home': parseInt(mid1.value),
            'away': parseInt(mid2.value)
        };
		console.log(data);
        xhr.send(JSON.stringify(data));
    });

};
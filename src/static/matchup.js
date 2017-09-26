function set(stats, side) {
	if(stats.matchCount>0) {
		document.getElementById(side + "_wr").innerText = Math.round(stats.winCount/stats.matchCount*100) + "% (" + stats.matchCount+")";
		document.getElementById(side + "_k").innerText = stats.avgNumKills.toFixed(0);
		document.getElementById(side + "_d").innerText = stats.avgNumDeaths.toFixed(0);
		document.getElementById(side + "_a").innerText = stats.avgNumAssists.toFixed(0);
		document.getElementById(side + "_gpm").innerText = Math.round(stats.avgGoldPerMinute);
		document.getElementById(side + "_xpm").innerText = Math.round(stats.avgExperiencePerMinute);
	}
}
function fetch(player, hero, side) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			let stats = JSON.parse(this.responseText);
			set(stats, side);
		}
	};
	xhttp.open("GET", "https://api.stratz.com/api/v1/player/" + player + "/heroPerformance/" + hero + "?game_version=70,71,72,73,74,75,76", true);
	xhttp.send();
}

var socket = io('localhost:3000');
socket.on('matchup', matchup => {
	
	document.getElementById("hero1").value = matchup.home.name;
	document.getElementById("hero2").value = matchup.away.name;

	document.getElementById("left_hero").src  = "/images/" + matchup.home.name + ".jpg";
	document.getElementById("right_hero").src = "/images/" + matchup.away.name + ".jpg";
	
	fetch(home_mid, parseInt(matchup.home.id), "left");
	setTimeout(() =>
			fetch(away_mid, parseInt(matchup.away.id), "right")
		, 2000);

});

document.getElementById("fetch").addEventListener("click", () => {
	let h1 = document.getElementById("hero1");
	let h2 = document.getElementById("hero2");

	document.getElementById("left_hero").src  = "/images/" + h1.value+ ".jpg";
	document.getElementById("right_hero").src = "/images/" + h2.value + ".jpg";

	let home_id = parseInt(h1.options[h1.selectedIndex].id.slice(2));
	let away_id = parseInt(h2.options[h2.selectedIndex].id.slice(2));

	fetch(home_mid, home_id, "left");
	setTimeout(() =>
			fetch(away_mid, away_id, "right")
		, 2000);
	
	socket.emit('matchup', {
		'home': {
			'id': home_id,
			'name': h1.value
		},
		'away': {
			'id': away_id,
			'name': h2.value
		}
	});
});
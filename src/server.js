const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');

const GSI = require('./gsi.js');
const IRC = require('./irc.js');
const Persistence = require('./persistence.js');
const SocketServer = require('./socketserver.js');

let gsi  = new GSI(io);
let irc  = new IRC(io);
let pers = new Persistence();
let socket = new SocketServer(io);

let config = {
	"standing" : {},
	"teams" : {"home": {}, "away": {}},
	"mids" : {},
	"standins": undefined
};

const api  = require('./routes/api.js')(pers);
const production = require('./routes/production.js')(pers, gsi, irc, io, config);

app.use(bodyParser.urlencoded({'extended': false}));
app.use(bodyParser.json());
app.use(express.static('static'));

app.set('view engine', 'pug');

app.use('/api', api);
app.use('/production', production);

app.post('/', (req, res) => {
	gsi.handleEvent(req);
	res.end("end");
});

app.get('/config', function(req, res){
	pers.getCompetitions(competitions => res.render('config', {'competitions':competitions}));
});

app.post('/config', (req, res) => {
	pers.getCompetitionStanding(req.body.divisions.home, competition => config.standing.home = competition);
	pers.getCompetitionStanding(req.body.divisions.away, competition => config.standing.away = competition);
	pers.getTeam(req.body.teams.home, team => config.teams.home.name = team[0].name);
	pers.getTeam(req.body.teams.away, team => config.teams.away.name = team[0].name);
	pers.getPlayersInTeam(req.body.teams.home, players => config.teams.home.members = players);
	pers.getPlayersInTeam(req.body.teams.away, players => config.teams.away.members = players);
	pers.getPlayer(req.body.mids.home, player => config.mids.home = player[0]);
	pers.getPlayer(req.body.mids.away, player => config.mids.away = player[0]);
    res.end("end");
});
    
http.listen(3000, function(){
	console.log('listening on *:3000');
});
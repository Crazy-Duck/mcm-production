'use strict';

const mysql = require('mysql');

class Persistence {
	constructor() {
		this.config =  {
			"host": "db",
			"user": "rd2l",
			"password": "password",
			"database": "rd2l",
			"port": 3306
		};
		this.pool = mysql.createPool(this.config);
	}
	
	getHeroes(cb) {
		this._query(`select * from heroes order by localized_name`, undefined, cb);
	}
	
	getCompetitions(cb) {
		this._query(`select * from competitions`, undefined, cb);
	}
	
	getCompetition(id, cb) {
		this._query(`select * from competitions where id = ?`, id, cb);
	}
	
	getTeams(cb) {
		this._query(`select * from teams`, undefined, cb);
	}
	
	getTeam(id, cb) {
		this._query(`select * from teams where id = ?`, id, cb);
	}
	
	getCompetitionDraft(id, cb) {
		this._query(`select t.name as tname, p.name as pname, p.solo_mmr, p.party_mmr, tp.captain from players p
						inner join team_players tp on p.id = tp.player_id
						inner join teams t on t.id = tp.team_id
						inner join competition_teams ct on ct.team_id = tp.team_id
						where ct.competition_id = ?
						order by p.solo_mmr desc;`, 
					 id, cb);
	}
	
	getTeamsInCompetition(id, cb) {
		this._query(`select id, name from teams t
						inner join competition_teams ct on ct.team_id = t.id
						where ct.competition_id = ?;`, 
					 id, cb);
	}
	
	getCompetitionStanding(id, cb) {
		this._query(`select name, sum(wins) as wins, sum(loss) as loss, disbanded from 
					(
						select home_id as team, sum(home_win = 1) as wins, sum(home_win = 0) as loss 
							from matches m 
							where competition_id = ?
							group by home_id
						UNION ALL
							select away_id as team, sum(home_win = 0) as wins, sum(home_win = 1) as loss 
							from matches m 
							where competition_id = ?
							group by away_id
					) AS scores
					JOIN
					(select id, name, disbanded from teams t
					inner join competition_teams ct on ct.team_id = t.id
					where ct.competition_id = ?) AS names
					on team = id
					group by team
					order by wins desc`,
					[id, id, id], cb);
	}
	
	getMatchesInCompetition(id, cb) {
		this._query(`select * from matches where competition_id = ?`, id, cb);
	}
	
	getPlayers(cb) {
		this._query(`select * from players`, undefined, cb);
	}
	
	getPlayer(id, cb) {
		this._query(`select * from players where id = ?`, id, cb);
	}
	
	getPlayersInTeam(id, cb) {
		this._query(`select * from players 
					 inner join team_players on players.id = player_id
					 where team_id = ?
					 order by solo_mmr desc`, 
					 id, cb);
	}
	
	_query(query, values, cb) {
		this.pool.getConnection((err, connection) => {
			this._poller(err, connection, query, values, cb);
		});
	}
	
	_poller(err, connection, query, values, cb) {
		if(err) {
			setTimeout(() => {
				this.pool.getConnection((err, connection) => {
					this._poller(err, connection, query, values, cb);
				});
			}, 2000);
		} else {
			connection.query(query, values, (err, rows) => {
				connection.release();
				cb(rows);
			});
		}
	}
	
}

module.exports = Persistence;
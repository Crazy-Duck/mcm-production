'use strict';

const express = require('express');
const router = express.Router();

module.exports = (persistence) => {
	
	router.get('/heroes', (req, res) => {
		persistence.getHeroes(heroes => res.json(heroes));
	});
	
	router.get('/competitions', (req, res) => {
		persistence.getCompetitions(competitions => res.json(competitions));
	});
	
	router.get('/competitions/:competition_id', (req, res) => {
		persistence.getCompetition(	req.params.competition_id, 
									competition => res.json(competition[0]));
	});
	
	router.get('/competitions/:competition_id/teams', (req, res) => {
		persistence.getTeamsInCompetition(	req.params.competition_id, 
											competition => res.json(competition));
	});
	
	router.get('/competitions/:competition_id/standing', (req, res) => {
		persistence.getCompetitionStanding(	req.params.competition_id, 
											competition => res.json(competition));
	});
	
	router.get('/teams', (req, res) => {
		persistence.getTeams(teams => res.json(teams));
	});
	
	router.get('/teams/:team_id', (req, res) => {
		persistence.getTeam(req.params.team_id, 
							team => res.json(team[0]));
	});
	
	router.get('/teams/:team_id/players', (req, res) => {
		persistence.getPlayersInTeam(	req.params.team_id, 
										team => res.json(team));
	});
	
	router.get('/players', (req, res) => {
		persistence.getPlayers(players => res.json(players));
	});
	
	router.get('/players/:player_id', (req, res) => {
		persistence.getPlayer(	req.params.player_id, 
								player => res.json(player[0]));
	});
	
	return router;
};
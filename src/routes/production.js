'use strict';

const express = require('express');
const router = express.Router();

module.exports = (persistence, gsi, irc, io, config) => {
	
	router.get('/competitions/:competition_id/teams', (req, res) => {
		persistence.getCompetitionDraft(	
			req.params.competition_id, 
			competition => {
				let teams = competition.reduce((acc, curr) => {
					if (curr.tname in acc) acc[curr.tname].push(curr);
					else acc[curr.tname] = [curr];
					return acc;
				}, {});
				res.render('draft', {'teams': teams})
			}
		);
	});
	
	router.get('/standings', (req, res) =>{
		res.render('standings', {'standing': config.standing, 'teams': config.teams});
	});
	
	router.get('/matchup', (req,res) => {
		persistence.getHeroes(heroes => res.render('matchup', {'mids': config.mids, 'heroes': heroes}));
	});
	
	router.get('/minimap', (req,res) => {
		persistence.getHeroes(heroes => res.render('minimap', {'heroes': heroes}));
	});
	
	router.get('/networth', (req,res) => {
		res.render('networth');
	});
	
	router.get('/postgame', (req, res) => {
		res.render('postgame', {'radiant': config.teams.home.name, 'dire': config.teams.away.name, 'players': gsi.players});
	});
	
	router.get('/mvp', (req, res) => {
		res.render('mvp', {'players': gsi.players});
	});
	
	router.get('/stats', (req, res) => {
		res.render('stats');
	});
	
	router.get('/support', (req, res) => {
		res.render('support');
	});
	
	router.get('/spam', (req, res) => {
		res.render('spam', {'spam': irc.getSpam()});
	});
	
	router.post('/spam', (req, res) => {
		irc.addSpam(req.body.message, req.body.interval);
		res.end("end");
	});
	
	router.delete('/spam', (req, res) => {
		irc.stopSpam(req.body.message);
		res.end("end");
	});
	
	return router;
};
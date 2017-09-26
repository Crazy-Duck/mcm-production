"use strict";

let fs = require('fs');

class GSI {
    constructor(io) {
        this.io = io;
        this.players = [];
        //this.items = JSON.parse(fs.readFileSync('items.json'));
    }
	
    //getItemCost(name) {return this.items.filter(item => item.name == name)[0].cost;}

    handleEvent(req) {
        let team2 = [], team3 = [];
        let rGold = 0, dGold = 0;
		let sGPM = 0, sXPM = 0;
        if ( req.body.map && req.body.map.game_state &&
            (req.body.map.game_state == 'DOTA_GAMERULES_STATE_PRE_GAME' ||
             req.body.map.game_state == 'DOTA_GAMERULES_STATE_GAME_IN_PROGRESS')) {

            let itemMap = req.body.items;
            let playerMap = req.body.player;
			let heroMap = req.body.hero;

            for (let i=0; i<5; i++) {
                // Player info
                let rPlayer = playerMap.team2['player'+i];
                let dPlayer = playerMap.team3['player'+(5+i)];
                // Hero info
                let rHero   = heroMap.team2['player'+i];
                let dHero   = heroMap.team3['player'+(5+i)];
                // Item info
                let rItems  = itemMap.team2['player'+i];
                let dItems  = itemMap.team3['player'+(5+i)];

                let rP = {'hero':rHero.name.slice(14), 'name': rPlayer.name, 'items': [], 'networth': rPlayer.net_worth, 'kills': rPlayer.kills, 'deaths': rPlayer.deaths, 'assists': rPlayer.assists, 'gpm': rPlayer.gpm, 'xpm': rPlayer.xpm, 'selected': rHero.selected_unit};
                let dP = {'hero':dHero.name.slice(14), 'name': dPlayer.name, 'items': [], 'networth': dPlayer.net_worth, 'kills': dPlayer.kills, 'deaths': dPlayer.deaths, 'assists': dPlayer.assists, 'gpm': dPlayer.gpm, 'xpm': dPlayer.xpm, 'selected': dHero.selected_unit};
				
                // Gold
                rGold += rPlayer.net_worth;
                dGold += dPlayer.net_worth;
                // Inventory
                for (let j=0; j<6; j++) {
                    let i1 = rItems['slot'+j].name;
                    let i2 = dItems['slot'+j].name;
                    rP.items.push(i1.slice(5));
                    dP.items.push(i2.slice(5));
                }
                team2.push(rP);
                team3.push(dP);
            }

            this.players = team2.concat(team3);
            this.io.emit('networth', { 'radiant': rGold, 'dire': dGold });
			this.io.emit('selected', this.players.filter(player => player.selected)[0]);
        }
    }
}

module.exports = GSI;
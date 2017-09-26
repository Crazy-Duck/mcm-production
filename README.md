# MCM-production
MCM studio's production package

## Installation
1. Download, install and start docker. 
1. Update `src/irc.js` with your twitch OAUTH token.
1. Create a GSI config file in the proper place in your Dota2 install directory

## Usage

`docker-compose up` creates two containers: 
1. A Node-JS container running the express app
1. A MariaDB container running the database

The first time you run `docker-compose up` a persistent volume will be created for the database and the database will be initialized with the SQL scripts in the data folder. To stop the containers, just `ctrl+c` and they will be properly closed down. The next time you want to use them, just execute `docker-compose up` again and the containers will be started, using the persistent volume. Do not use `docker-compose down` as this will destroy the containers and the link with the persistent volume. You'll need to reattach the volume manually since the link no longer exists.

As soon as the containers are running, you can connect to the database using an SQL browser (e.g. HeidiSQL). Point it to `localhost` port `3306`. The express app is running on `localhost` port `3000`.

## Production

Configure the production suite by surfing to `http://localhost:3000/config`. Here you can select the league, teams playing and the players you want to feature in the matchup. Click configure to send the config to the server. 

The express app serves 2 routes: api and production. Api (still in baby shoes) exposes a few basic REST endpoints where you can query some of the data in the database. Only GET endpoints have been implemented as of yet. 
The production endpoint serves several endpoints that can be used for production. Apart from the `/standings` endpoint, all of them can be manipulated via websockets. This means you can configure all the endpoints as browser sources in OBS, and you can update their appearance by surfing to the same endpoint in your browser (except for `/standings` which you'll need to manipulate via the interact menu in OBS).

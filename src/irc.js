"use strict";

const tmi = require("tmi.js");

class IRC {
    constructor(io) {
        this.io = io;
        this.spam = [];
        this.supporters = {
            "radiant": new Set(),
            "dire": new Set()
        };
        let options = {
            options: {
                debug: true
            },
            connection: {
                reconnect: true
            },
            identity: {
                username: "rd2lbot",
                password: ""
            },
            channels: ["crazyduckdota2"]
        };
        this.client = new tmi.Client(options);
        let that = this;
        this.client.on("message", (channel, userstate, message, self) => that._handleMessage(channel, userstate, message, self));
        this.client.connect();
    }

    _handleMessage(channel, userstate, message, self) {
        if (self) return;
        switch(userstate["message-type"]) {
            case "chat":
                switch (message) {
                    case "!radiant":
                        this.supporters.radiant.add(userstate["display-name"]);
                        this.supporters.dire.delete(userstate["display-name"]);
                        this.io.emit("support", {
                            "radiant": this.supporters.radiant.size,
                            "dire": this.supporters.dire.size
                        });
                        break;
                    case "!dire":
                        this.supporters.dire.add(userstate["display-name"]);
                        this.supporters.radiant.delete(userstate["display-name"]);
                        this.io.emit("support", {
                            "radiant": this.supporters.radiant.size,
                            "dire": this.supporters.dire.size
                        });
                        break;
                } 
                break;
        }
    }

    getSpam() {
        return this.spam.map(s => {
            return {
                "message": s.message,
                "interval": s.interval
            };
        });
    }

    addSpam(message, interval) {
        this.spam.push(
            {
                "message":  message,
                "interval": interval,
                "handle":   setInterval(() => {
                                this.client.say("crazyduckdota2", message);
                            }, interval)
            }
        );
    }

    stopSpam(message) {
        let i = this.spam.length;
        while(i--) {
            if(this.spam[i].message === message) this.spam.splice(i,1).map(s => clearInterval(s.handle));
        }
    }

    stopAllSpam() {
        this.spam.map(s => clearInterval(s.handle));
    }
}

module.exports = IRC;
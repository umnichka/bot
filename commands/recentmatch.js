const Discord = require('discord.js');
const fs = require('fs')
const request = require('request');
const talkedRecently = new Set();
const { MessageEmbed } = require('discord.js');
const bignumber = require('bignumber.js');
const heroData = require('./data/heroes.json');
const modeData = require('./data/gamemodes.json');
const helper = require('./helper/helper.js');

 module.exports = {
	name: 'recentm',
	description: 'Shows information about 20 recent matchs of dota player.',
	usage: '!recentm <steamid>',
	async run (client, message,args) {

        if (talkedRecently.has(message.author.id)) {
            message.reply("Wait 5 secs before using this command again.");

        } else {
            var steamUrl = args[0];
            var cSteamUrl = steamUrl.replace(/\D/g, "");
            let SteamId32 = bignumber(cSteamUrl).minus('76561197960265728')
            let requestUrl = "http://api.opendota.com/api/players/";
            let url = requestUrl.concat(SteamId32);
            let urlrecent = url.concat('/recentMatches')

            request(url,function(eror, response,body) {
                console.log(url);
                let data = JSON.parse(body);
                if (data.error == 'Internal Server Error' || typeof data.profile == 'undefined') {
                    message.channel.send('Error, invalid ID');

            } else {

            let username = data.profile.personaname

            request(urlrecent, function (error, response, body) {
                console.log(urlrecent);
                let data = JSON.parse(body);
                if ( typeof data[0] == 'undefined') {
                    message.channel.send('Error, invalid ID');

                } else {
                    var heroName = 'Unknown';
                    for (var hero of heroData['heroes']){
                        if (data[0].hero_id == hero.id){
                            heroName = hero.localized_name;
                        }
                    } 
                    var GameMode = 'Unknown';
                    for (var mode of modeData['gamemode']){
                        if (data[0].game_mode == mode.id){
                            GameMode = mode.localized_name;
                        }
                    }

                    let matchid = data[0].match_id;
                    let gameurl = "https://www.opendota.com/matches/" + matchid;
                    let result = helper.resultOfLastMatch(data[0].radiant_win, data[0].player_slot);
                    let GPM = data[0].gold_per_min;
                    let XPM = data[0].xp_per_min;
                    let lasthit = data[0].last_hits;
                    let dmg = data[0].hero_damage;
                    let kills = data[0].kills;
                    let deaths = data[0].deaths;
                    let assist = data[0].assists;
                    let value = data[0].duration;
                    
                    
                    
                    
                    console.log(gameurl);


                    const match = new MessageEmbed()
                    .setColor('f3f3f3')
                    .setTitle(`${username} recent match`)
                    .setFooter(value)
                    .addField('Game link:', `[Click](${gameurl})`,false )
                    .addField('Gamemode', GameMode, true)
                    .addField('Result', result, true)
                    .addField('Hero',heroName,false)
                    .addField('GPM', GPM, true)
                    .addField('XPM', XPM, true)
                    .addField('Last Hits', lasthit, true)
                    .addField('Damage', dmg, false)
                    .addField('Kills', kills, true)
                    .addField('Deaths', deaths , true)
                    .addField('Assists', assist, true)
                    message.channel.send(match)

                    talkedRecently.add(message.author.id);
                    setTimeout(() => {
                      // Removes the user from the set after a minute
                      talkedRecently.delete(message.author.id);
                    }, 5000);
                }
            });
        }
            });
        }
    }
}
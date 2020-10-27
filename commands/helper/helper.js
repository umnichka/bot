const heroData = require('./data/heroes.json');
const modeData = require('./data/gamemodes.json');
const request = require('request');
const Discord = require('discord.js'); 

const { MessageEmbed } = require('discord.js');

function resultOfMatch(result) {
    if (result == true) {
        return 'Radiant';
    } else {
        return 'Dire';
    }
}

exports.resultOfMatch = resultOfMatch;

function resultOfLastMatch(result, playerslot) {
    if (((playerslot >> 7) & 1) === 0) {
        // Raidant 
        if (resultOfMatch(result) == 'Radiant') {
            return 'Won';
        } else {
            return 'Lost';
        }
    } else {
        // Dire
        if (resultOfMatch(result) == 'Dire') {
            return 'Won';
        } else {
            return 'Lost';
        }
    }
}

exports.resultOfLastMatch = resultOfLastMatch;


function recentMatch(SteamId32,username)
{
    let requestUrl = "http://api.opendota.com/api/players/";
    let url = requestUrl.concat(SteamId32);
    let urlrecent = url.concat('/recentMatches')

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
            let result = resultOfLastMatch(data[0].radiant_win, data[0].player_slot);
            let GPM = data[0].gold_per_min;
            let XPM = data[0].xp_per_min;
            let lasthit = data[0].last_hits;
            let dmg = data[0].hero_damage;
            let kills = data[0].kills;
            let deaths = data[0].deaths;
            let assist = data[0].assists;
            let value = data[0].duration;
            
            
            
            
            console.log(gameurl);
            var match = new MessageEmbed()
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

            function RecentMatch(){
                
                return match;

            }

            

        }
    })
    return rmatch;
}

exports.recentMatch = recentMatch;
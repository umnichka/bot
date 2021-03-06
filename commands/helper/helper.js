const heroData = require('./data/heroes.json');
const modeData = require('./data/gamemodes.json');
const country = require("./data/country.json")
const request = require('request');
const Discord = require('discord.js'); 
const fetch = require("node-fetch");
const { MessageEmbed } = require('discord.js');
const bignumber = require('bignumber.js');
const client = new Discord.Client();
const Faceit = require("faceit-js-api");
const faceIt = new Faceit(process.env.faceit);


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


async function recentMatch(steamid32, callback)
{
    let requestUrl = "http://api.opendota.com/api/players/";
    let url = requestUrl.concat(steamid32);
    let urlrecent = url.concat('/recentMatches');
    let response = await fetch(urlrecent);
    let data = await response.json();
        console.log(urlrecent);

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
            let value1 = data[0].duration;
            let value = value1 / 60;
            let minutes = Math.floor(value);
            let seconds = (value - minutes) * 60;
            let seconds2 = Math.round(seconds)
            let duration = `${minutes} m ${seconds2} s `
            console.log(gameurl);

            const embed = new MessageEmbed()
            .setColor('f3f3f3')
            .setTitle(`Recent match`)
            .setFooter(duration)
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
            .addField('Actions', '`back`')

            callback(embed);

        }
}

exports.recentMatch = recentMatch;

async function DotaProfile(SteamId32, callback) {


    let requestUrl = "http://api.opendota.com/api/players/";
    let url = requestUrl.concat(SteamId32);
    let wlURL = url.concat('/wl')
    let avgRequest = `http://api.opendota.com/api/players/${SteamId32}/matches?limit=10`;
    let response = await fetch(url);
    let data = await response.json();
    let response2 = await fetch(wlURL);
    let data2 = await response2.json();
    let avgResponse = await fetch(avgRequest);
    let avgdata = await avgResponse.json();

        totalK = 0;
        totalD = 0;
        totalA = 0;
        z = 10;
            for (let i = 0; i < 9; i++) {
                totalK += avgdata[i].kills;
                totalD += avgdata[i].deaths;
                totalA += avgdata[i].assists;
        }
        let avgK = totalK / z;
        let avgD = totalD / z;
        let avgA = totalA / z;


        console.log(url);
        
        if ( typeof data == 'undefined') {
            message.channel.send('Error, invalid ID');

        } else {

            let idsteam = data.profile.steamid;
            let steamurl = "https://steamcommunity.com/profiles/"
            let usersteam = steamurl.concat(idsteam); 
            let mmr = data.mmr_estimate.estimate;
            let rank = data.rank_tier;
            let leaderboardrank = data.leaderboard_rank;
            let avatar = data.profile.avatarmedium;
            let username = data.profile.personaname;
            

            let numberOfGames = data2.win + data2.lose;
            var percentWin = (data2.win / numberOfGames) * 100;


            const stats = new MessageEmbed()

                    .setThumbnail(avatar)
                    .setColor('f3f3f3')
                    .setTitle(`${username} profile`)
                    .addField('Profile','---------',true)
                    .addField('Winrate','---------',true)
                    .addField('AVG stats by 10 last matches','---------',true)
                    .addField('MMR~ ', mmr,true)
                    .addField('Wins', data2.win,true)
                    .addField('AVG kills', avgK,true)
                    .addField('LB ranks ', leaderboardrank,true)
                    .addField('Lose',data2.lose,true)
                    .addField('AVG deaths',avgD,true)
                    .addField('Dota tier ', rank,true)
                    .addField('Winrate',percentWin.toFixed(2)+'%',true)
                    .addField('AVG assists',avgA,true)
                    .addField('Actions', '`back`')

                    callback(stats);
    }
}
exports.DotaProfile = DotaProfile;

async function DotaMenu(steamid32,callback) {

    const msg = { createdAt : new Date() };
    const time = msg.createdAt.toLocaleString();

    const menu = new MessageEmbed()
    .setTitle('Menu')
    .setColor('#f3f3f3')
    .setFooter(time)
    .addField('What you wanna see', '`profile`,`rm`')
    callback(menu)
}
exports.DotaMenu = DotaMenu;
const Discord = require('discord.js');
const fs = require('fs')
const request = require('request');
const talkedRecently = new Set();
const { MessageEmbed } = require('discord.js');
const bignumber = require('bignumber.js');

module.exports = {
	name: 'test',
	description: 'test.',
	usage: 'test',
	async run (client, message,args) {

        if (talkedRecently.has(message.author.id)) {
            message.reply("Wait 5 secs before getting typing this again.");
    } else {
        let SteamId64 = args[0];
        let SteamId32 = bignumber(SteamId64).minus('76561197960265728')
		let requestUrl = "http://api.opendota.com/api/players/";
        let url = requestUrl.concat(SteamId32);
        let urlWL = url.concat('/wl')

        request(url, function (error, response, body) {
            console.log(url);
            let data = JSON.parse(body);
            if (data.error == 'Internal Server Error' || typeof data.profile == 'undefined') {
                message.channel.send('Error, invalid ID');

            } else {
                let idsteam = data.profile.steamid;
                let steamurl = "https://steamcommunity.com/profiles/"
                let usersteam = steamurl.concat(idsteam); 
                let solommr = data.solo_competitive_rank;
                let rank = data.rank_tier;
                let leaderboardrank = data.leaderboard_rank;
                let avatar = data.profile.avatarmedium;
                let username = data.profile.name;

                request(urlWL,function(error,response,body ) {
                    console.log(urlWL);
                    let data = JSON.parse(body);
                    if (data.error == 'Internal Server Error') {
                        message.channel.send('try later');
                    }
                    else {
                        let wins = data.win;
                        let loses = data.lose;

                        const stats = new MessageEmbed()
                        .setThumbnail(avatar)
                        .setColor('f3f3f3')
                        .setTitle(`${username} profile`)
                        .addField('Solo MMR ', solommr,true)
                        .addField('Leaderboard rank ', leaderboardrank,true )
                        .addField('Dota tier ', rank,true)
                        .addField('Wins', wins,true)
                        .addField('Loses', loses,true)
                        .addField('Steam profile:',`[Click](${usersteam})`)
                        message.channel.send(stats)

                        talkedRecently.add(message.author.id);
                        setTimeout(() => {
                          // Removes the user from the set after a minute
                          talkedRecently.delete(message.author.id);
                        }, 5000);
                    }
                })
            }
		});
    }
}
}
	
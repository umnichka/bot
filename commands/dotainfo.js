const Discord = require('discord.js');
const fs = require('fs')
const request = require('request');
const talkedRecently = new Set();
const { MessageEmbed } = require('discord.js');
const bignumber = require('bignumber.js');
const helper = require('./helper/helper.js');

module.exports = {
	name: 'dotap',
	description: 'Shows information about dota user.',
	usage: '!dotap <profileURL>',
	async run (client, message,args) {

        if (talkedRecently.has(message.author.id)) {
            message.reply("Wait 5 secs before using this command again.");
    } else {

        var steamUrl = args[0];
        var cSteamUrl = steamUrl.replace(/\D/g, "");
        let SteamId32 = bignumber(cSteamUrl).minus('76561197960265728')
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
                let mmr = data.mmr_estimate.estimate;
                let rank = data.rank_tier;
                let leaderboardrank = data.leaderboard_rank;
                let avatar = data.profile.avatarmedium;
                let username = data.profile.personaname;


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
                        .addField('MMR~ ', mmr,true)
                        .addField('Leaderboard rank ', leaderboardrank,true )
                        .addField('Dota tier ', rank,true)
                        .addField('Wins', wins,true)
                        .addField('Loses', loses,true)
                        .addField('Steam profile:',`[Click](${usersteam})`)
                        .addField('Actions', '`recentm`')
                        message.channel.send(stats)

                        client.on("message", async message => {

                            if(message.author.bot) return;
                            if(message.channel.type === 'dm') return;

                            if(message.content === 'recentm') {
                               let dotarecent = (helper.recentMatch(SteamId32,username));
                               console.log(dotarecent);
                               message.channel.send(dotarecent)
                            }
                          
                        });


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
	
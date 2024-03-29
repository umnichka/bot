const Discord = require('discord.js');
const fs = require('fs')
const request = require('request');
const talkedRecently = new Set();
const { MessageEmbed } = require('discord.js');
const bignumber = require('bignumber.js');
const helper = require('./helper/helper.js');
const fetch = require("node-fetch");
const { profile } = require('console');
const { userInfo } = require('os');
const msg = { createdAt : new Date() };
const time = msg.createdAt.toLocaleString();


module.exports = {
	name: 'dota',
	description: 'Shows information about dota user.',
	usage: '!dota <profileURL>',
	async run (client, message,args) {

        let x = 1;
        if (x = 1) { 
            message.channel.send('Command disabled')
        }

        if (talkedRecently.has(message.author.id)) {
            message.reply("Wait 5 secs before using this command again.");
    } else {


        let whoSended = message.author.id;

        const filter = message => message.content === 'profile' || 'rm'
        const collector = message.channel.createMessageCollector(filter, { time: 10000 });
        

        if (!args[0]){
            message.channel.send('Enter a steam profile')
            return
        }
        var steamLink = args[0];
        var steamID = steamLink.split('/')
        let requestUrl = "http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=11C25DD94021AB4F6607D25893C04D7D&vanityurl="
        
        let steamId64 = [];
        let steam64 = [];
        let steamid32 = [];
        let x = [1];
        console.log(steamid32)

        if(steamID[3] === 'id') {

            let url = requestUrl + steamID[4];
            let response = await fetch(url);
            let data = await response.json();
            const steamId1 = data.response.steamid;
            x++;
            steamId64.push(steamId1);
            console.log('ID 64 = ', steamId1);

        } else  {
            console.log(x)
            steam64.push(steamID[4]);
            console.log('PROFILES 64 =',steam64)
        }

        if (x != 2) {
            let SteamId32 = bignumber(steam64).minus('76561197960265728')
            console.log('big numb', steam64)
            steamid32.push(SteamId32)
            console.log(SteamId32)
        } else {
            let SteamId32 = bignumber(steamId64).minus('76561197960265728')
            console.log('big nubme2',steamId64)
            steamid32.push(SteamId32)
            console.log(SteamId32)
        }



        helper.DotaMenu(steamid32, function (menu){
            

            message.channel.send(menu).then(() => {
                collector.on('collect', message => {
                    console.log(message.content)
                    if (message.content === 'profile' && message.author.id === whoSended)
                    {
                        helper.DotaProfile(steamid32, function (stats){
                            message.channel.send(stats)
                        })
                    }
                    else if (message.content === 'rm' && message.author.id === whoSended) {
                        helper.recentMatch(steamid32, function(embed){
                            message.channel.send(embed)
                        })
                    }
                    else if (message.content === 'back' && message.author.id === whoSended) {
                        message.channel.send(menu);
                    }
                })
            });
        })


             talkedRecently.add(message.author.id);
                setTimeout(() => {
                    // Removes the user from the set after a minute
                talkedRecently.delete(message.author.id);
                 }, 5000);



                }
            }
        }
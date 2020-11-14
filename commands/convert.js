const Discord = require ('discord.js')
const { MessageEmbed } = require('discord.js');
const request = require('request');

module.exports = {
    name: 'convert',
    description: "Converting SteamCustomID to Steam64",
    usage: "!convert [SteamCustomID]",

    async run (client, message,args) {

        var steamUrl = args[0]
        var vanilaId = steamUrl.split('id/')
        console.log(vanilaId)
        let requestUrl = 'http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=11C25DD94021AB4F6607D25893C04D7D&vanityurl='
        let url = requestUrl.concat(vanilaId[1]);

        request(url, function (error, response, body) {
            console.log(url);
            let data = JSON.parse(body);
            if (data.error == 'Internal Server Error')
            {
                message.channel.send('Error, invalid ID');

            } else {

                let steamId64 = data.response.steamid;
                console.log(steamId64)
                let steam64 =  'https://steamcommunity.com/profiles/' + steamId64;
                message.channel.send(steam64)
            }
        });
    }
}
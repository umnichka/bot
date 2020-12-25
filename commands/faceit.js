const request = require('request');
const talkedRecently = new Set();
const { MessageEmbed } = require('discord.js');
const msg = { createdAt : new Date() };
const Faceit = require("faceit-js-api");
const faceIt = new Faceit("118dbece-03cd-4ec9-be31-66a168176c1f");
const country = require("./helper/data/country.json")



module.exports = {
	name: 'faceit',
	description: 'Shows information about dota user.',
	usage: '!dota <profileURL>',
	async run (client, message,args) {


        if (talkedRecently.has(message.author.id)) {
            message.reply("Wait 5 secs before using this command again.");
    } else {
        
        if(!args[0]){
            message.channel.send('Enter a FaceIT nick')
            return
        }

        faceItUName = args[0];
        console.log(args[0])
        playedCSGO = [];
        playedDota = [];
        playerAvatar = [];
        let steamurl = "https://steamcommunity.com/profiles/";


        faceIt.getPlayerInfo(faceItUName).then(function (player) {

           
            var PlayerCountry = 'Unknown';
            for (var tag of country['countrys']){
                if (player.country == tag.name){
                    PlayerCountry = tag.localized_name;
                }
            }
            
            if(typeof player.games.csgo === 'undefined'){
                playedCSGO.push('')
            }
            else {
                playedCSGO.push('`CSGO`')
            }
            if (typeof player.games.dota2 === 'undefined') {
                playedDota.push('')
            }
            else {
                playedDota.push('`Dota 2`')
            }
            if(!player.avatar){
                playerAvatar.push('')
            }
            else {
                playerAvatar.push(player.avatar)
            }

            
        let usersteam = steamurl + player.steamID;
        const msg = { createdAt : new Date() };
        const time = msg.createdAt.toLocaleString();
            

            const facIt = new MessageEmbed()

            .setTitle(`FaceIT player information`)
            .setThumbnail(playerAvatar)
            .setFooter(time)
            .addField(`Nick `, player.nickname, true)
            .addField('Country' , PlayerCountry, true)
            .addField('Games', playedCSGO + playedDota, true)
            .addField('Steam profile', `[Click](${usersteam})`)
            .addField('FaceIT',`[Click](${player.faceitUrl})`,true)
            

            
            message.channel.send(facIt);
        });
    




        talkedRecently.add(message.author.id);
        setTimeout(() => {
            // Removes the user from the set after a minute
        talkedRecently.delete(message.author.id);
         }, 5000);
    

    }






    }
}
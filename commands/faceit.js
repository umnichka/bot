const request = require('request');
const talkedRecently = new Set();
const { MessageEmbed } = require('discord.js');
const msg = { createdAt : new Date() };
const Faceit = require("faceit-js-api");
const helper = require('./helper/helper.js');



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
        else {
            let faceItUName = args[0];

            helper.FaceItMenu(faceItUName, function (facIt){
            
                message.channel.send(facIt)

            })
        }

        talkedRecently.add(message.author.id);
        setTimeout(() => {
            // Removes the user from the set after a minute
        talkedRecently.delete(message.author.id);
         }, 5000);
        }
    }
}
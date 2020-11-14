const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');


module.exports = {
    name: "restart",
    description: "restart bot",
    usage: "!restart",
     async run (client, message, args) {

        if(message.author.id != message.guild.owner.id) return message.reply('no access')
        
        message.channel.send('Restarting')
        .then(msg => client.destroy())
        .then(() => client.login(process.env.token));
    }
    }
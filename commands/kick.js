const Discord = require('discord.js');

module.exports = {
    name: "kick",
    description: "Kick member from the guild",
    usage: "!kick <user>",

    async run (client, message, args) {

        if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply('You dont have perms to do that')
        if(!message.guild.me.hasPermission("KICK_MEMBERS")) return message.reply('I cant do that')

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if(!args[0]) return message.reply('Specify a user');

        if(!member) return message.reply('This user isnt member of that guild');
        if(!member.kickable) return message.reply('This user cant be kicked');

        if(member.id === message.author.id) return message.reply('You cant kick urself');

        let reason = args.slice(1).join(" ");

        if(reason === undefined) reason = 'Unspecified';

        member.kick(reason)
        .catch(err => {
            if(err) return message.channel.send('error')
        })

        const kickembed = new Discord.MessageEmbed()
        .setTitle('Member was kicked')
        .addField('Nick:', member)
        .addField('Kicked by', message.author)
        .addField('Reason', reason)

        message.channel.send(kickembed)
    }
}
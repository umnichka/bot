const Discord = require('discord.js');

module.exports = {
    name: "kick",
    description: "Kick member from the guild",
    usage: "!kick <user>",

    async run (client, message, args) {

        if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply('you dont have perms to do that')
        if(!message.guild.me.hasPermission("KICK_MEMBERS")) return message.reply('i cant do that')

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if(!args[0]) return message.reply('Specify a user');

        if(!member) return message.reply('this user isnt member of that guild');
        if(!member.kickable) return message.reply('this user cant be kicked');

        if(member.id === message.author.id) return message.reply('you cant kick urself');

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

        member.guild.channels.cache.get('767962044560965692').send(kickembed);
    }
}
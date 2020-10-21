const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "serverinfo",
    category: "Shows infromation about server",
     async run (client, message, args) {

        let voiceChannelCount = message.guild.channels.cache.filter(c => c.type === 'voice').size;
        let textChannelCount = message.guild.channels.cache.filter(c=> c.type ==='text').size;
        let membersCount = message.guild.memberCount;
        let botsCount = message.guild.members.cache.filter(m => m.user.bot).size;

        const embed = new MessageEmbed()
            .setThumbnail(message.guild.iconURL({dynamic : true}))
            .setColor('#f3f3f3')
            .setTitle(`${message.guild.name} stats`)
            .addFields(
                {
                    name: "Owner: ",
                    value: message.guild.owner.user.tag,
                    inline: true
                },
                {
                    name: "Members: ",
                    value: `There are ${membersCount-botsCount} users`,
                    inline: false
                },
                {
                    name: "Members Online: ",
                    value: `There are ${message.guild.members.cache.filter(m => m.user.presence.status == "online").size} users online`,
                    inline: true
                },
                {
                    name: "Total Bots: ",
                    value: `There are ${botsCount} bots`,
                    inline: false
                },
                {
                    name: "Total Channels: ",
                    value: `There are ${voiceChannelCount + textChannelCount} channels`,
                    inline: true,

                },
                {
                    name: "Creation Date: ",
                    value: message.guild.createdAt.toLocaleDateString("en-us"),
                    inline: false
                },
            )
        await message.channel.send(embed)
    }
}
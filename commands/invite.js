const Discord = require ('discord.js')
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'invite',
    description: "invite command",

    async run (client, message , args){

        let channel = message.channel;
        let Uamount = args[1]
        let Aamount = args[0]
        if (!args[1]) {
           Uamount = 0 
        }
        if (!args[0]){
            Aamount = 3600
        }

        channel.createInvite({ unique: true, maxAge:  Aamount, maxUses: Uamount }).then(invite => {
            message.reply(" your invite link = https://discord.gg/" + invite.code)

            const invitelink = new Discord.MessageEmbed()
            .setTitle('Invite link created')
            .addFields (
                {
                    name: "Code:  ",
                    value: "https://discord.gg/" + invite.code,
                    inline: false
                },
                {
                    name: "Uses: ",
                    value: Uamount,
                    inline: false
                },
                {
                    name: "Duration: ",
                    value: Aamount,
                    inline: false  
                },
                {
                    name: "Created by",
                    value: message.author,
                    inline: false
                },

            )

            message.guild.channels.cache.get('767962044560965692').send(invitelink);
        })
    }
}
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "top",
    description: "Топ игроков по урону",
    usage: "!top",

    async run (client, message , args,con) {

        con.query(`SELECT * FROM players WHERE id>0 ORDER BY dmg DESC`, (err,rows) =>{

            if (err) throw err;

            const topPlayers = new MessageEmbed()
            .setTitle('Топ 10 игроков по урону')
            .addField('```' + '#' + `1. ${rows[0].name} | Урон - ${rows[0].dmg} | Боев - ${rows[0].battles}` + '\n```','‏‏‎ ‎')

            for(let i = 1; i < 10; i++){
                topPlayers.addField('```'+ '#' + `${i+1}. ${rows[i].name} | Урон - ${rows[i].dmg} | Боев - ${rows[i].battles}` + '\n```','‏‏‎ ‎')
            }
            message.channel.send(topPlayers)
        })
    }
}
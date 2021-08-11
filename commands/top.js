const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "top",
    description: "Топ игроков по урону",
    usage: "!top [значение]",

    async run (client, message , args) {

        let x = 1;
        if (x = 1) { 
            message.channel.send('Command disabled')
        }

        let type = args[0];

        if (type != 'dmg' && type != 'battles' && type != 'wn8') return message.channel.send('Неверное значение. Выберите из этого - `dmg`, `battles`, `wn8`')
        
        

        con.query(`SELECT * FROM players WHERE id>0 ORDER BY ${type} DESC`, (err,rows) =>{

            if (err) throw err;

            const topPlayers = new MessageEmbed()
            if(type === 'battles') {
                topPlayers.setTitle('Топ 10 игроков по кол-ву боев')
            } 
            else if (type === 'wn8') {
                topPlayers.setTitle('Топ 10 игроков по wn8') 
            }
            else { 
                topPlayers.setTitle('Топ 10 игроков по урону')
            }
            topPlayers.addField('```' + '#' + `1. ${rows[0].name} | Урон - ${rows[0].dmg} | Боев - ${rows[0].battles} | WN8 - ${rows[0].wn8}`  + '\n```','‏‏‎ ‎')

            for(let i = 1; i < 10; i++){
                topPlayers.addField('```'+ '#' + `${i+1}. ${rows[i].name} | Урон - ${rows[i].dmg} | Боев - ${rows[i].battles} | WN8 - ${rows[0].wn8}` + '\n```','‏‏‎ ‎')
            }
            message.channel.send(topPlayers)
        })
    }
}
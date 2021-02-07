const { MessageEmbed } = require('discord.js');
const helper = require('./helper/helperWOT.js');

module.exports = {
    name: "setupd",
    description: "Включить авто-обновление информации",
    usage: "!setupd",

    async run (client, message , args,con) {

        var strok = [];

        let x = 2;
        message.channel.send('Starting auto-update info about users')
        setInterval (function () {

        con.query(`SELECT COUNT(*) AS Count FROM player WHERE id>0`, (err, rows) =>{

            let strok = rows[0].Count;

            con.query(`SELECT * FROM player`, (err, rows2) => {
                

                for(i = 0; i < strok; i++) {

                    accId = rows2[i].id;
                    nickName = rows2[i].name;
                    helper.accountStats(accId,nickName,x)
                }
            })
        })
    }, 600000)
    }
}
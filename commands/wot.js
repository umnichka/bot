const Discord = require ('discord.js')
const { MessageEmbed } = require('discord.js');
const fetch = require("node-fetch");
const helper = require('./helper/helperWOT.js');


module.exports = {
    name: "wot",
    description: "World Of Tanks player stats",
    usage: "!wot",

    async run (client, message , args) {

        if (!args[0]) {
            message.channel.send('Введите никнейм')
        }
        let nickName = args[0];
        let TeamUrl = 'https://api.worldoftanks.ru/wot/account/list/?application_id=5303ac49029b8236b4af70fa1c2808e2&type=exact&search=' + nickName;
        let response = await fetch(TeamUrl)
        let wot = await response.json();
            console.log(TeamUrl);



        if (wot.meta.count != '1') {
            message.channel.send('Неверный никнейм'); 
    
        } else { 


            const filter = (msg, user) => {
                 return msg.content === 'стата' || msg.content === 'бб2020' || msg.author.id === user.id
            };

            const collector = message.channel.createMessageCollector(filter, { time: 10000 });

            const nickName = wot.data[0].nickname;
            const accId = wot.data[0].account_id

            const msg = { createdAt : new Date() };
            const time = msg.createdAt.toLocaleString();

            console.log(nickName);
            const wotStart = new MessageEmbed()
            .setTitle(nickName)
            .addField('Выберите дальнейшее действие', '`стата`')
            .setFooter(time)
            message.channel.send(wotStart).then(() => {
                collector.on('collect', message => {
                    console.log(message.content)
                    if (message.content === 'стата')
                    {
                        helper.accountStats(accId, function (stats){
                            message.channel.send(stats)
                        })
                        }
                    })
            })
        }
    }
}
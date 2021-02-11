const Discord = require ('discord.js')
const { MessageEmbed } = require('discord.js');
const fetch = require("node-fetch");
const helper = require('./helper/helperWOT.js');
const talkedRecently = new Set();


module.exports = {
    name: "wot",
    description: "World Of Tanks player stats",
    usage: "!wot",

    async run (client, message , args,con) {


        if (talkedRecently.has(message.author.id)) {
            message.reply("Подождите 5 секунд чтобы воспользоваться командой снова.");
    } else {

        let whoSended = message.author.id;
        let x = 1;

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

            const filter = m => {
                 return m.content === 'Стата' || 'Танки '
            };

            const collector = message.channel.createMessageCollector(filter, { time: 10000 });
            const nickName = wot.data[0].nickname;
            const accId = wot.data[0].account_id
            const msg = { createdAt : new Date() };
            const time = msg.createdAt.toLocaleString();

            const wotStart = new MessageEmbed()
            .setTitle(nickName)
            .addField('Выберите дальнейшее действие', '`Стата` `Танки`')
            .setFooter(time)

            const wotWait = new MessageEmbed()
            .setTitle('Расчет начат')
            .addField('Ожидайте', `Идет расчет статистики для ${nickName}`)
            .setFooter(time)
            message.channel.send(wotStart).then(() => {
                collector.on('collect', message => {
                    if (message.content === 'Стата' && message.author.id === whoSended)
                    {
                        message.channel.send(wotWait)
                        helper.wn8calc(accId,con)
                        setTimeout(function(){
                        helper.accountStats(accId,nickName,x,con, function (stats){
                            message.channel.send(stats)
                        })
                    }, 5000);
                    }
                    })
                })
            }
        }
    }
}
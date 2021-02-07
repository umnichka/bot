const Discord = require('discord.js'); 
const fetch = require("node-fetch");
const { MessageEmbed } = require('discord.js');


async function accountStats(accid,nickName,x,con,callback) {


    const requestUrl = "https://api.worldoftanks.ru/wot/account/info/?application_id=5303ac49029b8236b4af70fa1c2808e2&account_id=" + accid + '&fields=statistics.all';
    let response = await fetch(requestUrl);
    let wot = await response.json();

    const request4bb = "https://api.worldoftanks.ru/wot/account/achievements/?application_id=cf2f77dfac4977080aa7c182250a5736&account_id=" + accid + '&fields=achievements';
    let responseBB = await fetch(request4bb)
    let bb = await responseBB.json();
    
    let totalB = wot.data[accid].statistics.all.battles;
    let maxDMG = wot.data[accid].statistics.all.max_damage;
    let maxXP = wot.data[accid].statistics.all.max_xp;
    let avgDMG = (wot.data[accid].statistics.all.damage_dealt / totalB).toFixed();
    let avgXP = wot.data[accid].statistics.all.battle_avg_xp;
    let pWin = (wot.data[accid].statistics.all.wins / totalB) * 100;
    let maxKills = wot.data[accid].statistics.all.max_frags;
    var whoBB2020 = []; 
    var textavgDMG = [];

    if(totalB < 50) {

        const embed = new MessageEmbed()
        .setTitle('Ошибка')
        .setDescription('Количество боев меньше 50')
        callback(embed)
    } else {

    con.query(`SELECT * FROM players WHERE ID = '${accid}'`, (err,rows ) => {
        if(err) throw err;
        let sql;

        if(rows.length < 1) {
            sql = `INSERT INTO players (id,name,dmg,battles) VALUES ('${accid}', '${nickName}','${avgDMG}', '${totalB}')`
        } else {
            let dmg = rows[0].dmg
            sql = `UPDATE players SET dmg = ${(dmg/dmg - 1) + avgDMG} WHERE ID = '${accid}' AND NAME = '${nickName}' AND BATTLES = '${totalB}'`
        }
        con.query(sql,console.log);

    });


    if ( avgDMG <= 500 && avgDMG < 750) {

        rashet =  '```diff\n'  + avgDMG + '\n```' 

        textavgDMG.push(rashet)

    } else if (avgDMG > 750 && avgDMG < 1000 ) {

        rashet =  '```HTTP\n' + avgDMG + '\n```' 

        textavgDMG.push(rashet)

    } else if (avgDMG > 1000 && avgDMG < 1800 ) {

        rashet =  '```diff\n'  + '!' + avgDMG + '\n```' 

        textavgDMG.push(rashet)

    } else if (avgDMG > 1800 && avgDMG < 2500) {

        rashet =  '```md\n'+ '#' + avgDMG + '\n```' 

        textavgDMG.push(rashet)

    } else if (avgDMG > 2500) {

        rashet =  '```xl\n'+ "'" + avgDMG + "'" + '\n```' 

        textavgDMG.push(rashet)

    }
    if (bb.data[accid].achievements.medalBobKorbenDallas === 1) {

        whoBB2020.push('KorbenTeam')
    } else if (bb.data[accid].achievements.medalBobYusha === 1) {
        whoBB2020.push('YushaTeam')
    } else if (bb.data[accid].achievements.medalBobLebwa === 1) {
        whoBB2020.push('LebwaTeam')
    } else if (bb.data[accid].achievements.medalBobAmway921 === 1) {
        whoBB2020.push('AmwayTeam')
    } else {
        whoBB2020.push('Не участвовал')
    }

    const stats = new MessageEmbed()
    .setColor('f3f3f3')
    .setTitle(`Статистика`)
    .addFields(
        {
            name: "Количество боев",
            value: '`'+ totalB + '`',
            inline: true
        },
        {
            name: "Максимальное кол-во опыта",
            value: '`' + maxXP + '`',
            inline: true
        },
        {
            name: "Максимальный урон",
            value: '`' + maxDMG +'`',
            inline: true
        },
        {
            name: "Процент побед",
            value: '`' + pWin.toFixed(2) + '`',
            inline: false
        },
        {
            name: "Средний опыт",
            value: '`' + avgXP + '`' ,
            inline: true
        },
        {
            name: "Средний урон",
            value: textavgDMG,
            inline: true
        },
        {
            name: "Максимум танков уничтожено",
            value: '`' + maxKills + '`' ,
            inline: true
        },
        {

            name: "Битва блогеров 2020",
            value: '`' + whoBB2020 + '`' ,
            inline: true

        },
    )

    if (x=1) {
    callback(stats);
    } else if (x=2) 
    { 
        console.log('upd')
    }
    
    }
}

exports.accountStats = accountStats;

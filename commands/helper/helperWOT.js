const Discord = require('discord.js'); 
const fetch = require("node-fetch");
const { MessageEmbed } = require('discord.js');


async function accountStats(accid,nickName,x,con,callback) {


    const requestUrl = "https://api.worldoftanks.ru/wot/account/info/?application_id=5303ac49029b8236b4af70fa1c2808e2&account_id=" + accid + '&fields=statistics.all';
    let response = await fetch(requestUrl);
    let wot = await response.json();

    const request4bb = "https://api.worldoftanks.ru/wot/account/achievements/?application_id=cf2f77dfac4977080aa7c182250a5736&account_id=" + accid + '&fields=achievements';
    let responseBB = await fetch(request4bb);
    let bb = await responseBB.json();


    let totalB = wot.data[accid].statistics.all.battles;

    if(totalB < 50) {

        const embed = new MessageEmbed()
        .setTitle('Ошибка')
        .setDescription('Количество боев меньше 50')
        callback(embed)
    } else {

        let maxDMG = wot.data[accid].statistics.all.max_damage;
        let maxXP = wot.data[accid].statistics.all.max_xp;
        let avgDMG = (wot.data[accid].statistics.all.damage_dealt / totalB).toFixed();
        let avgXP = wot.data[accid].statistics.all.battle_avg_xp;
        let pWin = (wot.data[accid].statistics.all.wins / totalB) * 100;
        let maxKills = wot.data[accid].statistics.all.max_frags;
        var whoBB2020 = []; 
        var textavgDMG = [];




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

        con.query(`SELECT AVG(wn8) as wn8Sum FROM ‘${accid}’`, (err,rows ) => {
            if (err) throw err;
            let wn8sum = rows[0].wn8Sum

            con.query (`SELECT COUNT(*) as count FROM ‘${accid}’`, (err, tanks) => {
                if (err) throw err;
                tAmount = tanks[0].count;
                let wn8 = (wn8sum / tAmount) / 2
                console.log(wn8,wn8sum,tAmount)
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
                        name: "WN8",
                        value: '`' + wn8.toFixed() + '`',
                        inline:true
                    },
                    {
            
                        name: "Битва блогеров 2020",
                        value: '`' + whoBB2020 + '`' ,
                        inline: true
                    },
                )
                con.query(`SELECT * FROM players WHERE ID = '${accid}'`, (err,rows ) => {
                    if(err) throw err;
                    let sql;
            
                    if(rows.length < 1) {
                        sql = `INSERT INTO players (id,name,dmg,battles,wn8) VALUES ('${accid}', '${nickName}','${avgDMG}', '${totalB}', '${wn8}')`
                    } else {
                        let dmg = rows[0].dmg
                        sql = `UPDATE players SET dmg = '${(dmg/dmg - 1) + avgDMG}', battles = '${totalB}', wn8 = '${wn8}' WHERE ID = '${accid}'`
                    }
                    con.query(sql);
            
                });
                return callback(stats)
            })
        })
    }
}

exports.accountStats = accountStats;


async function wn8calc(accid,con) {

    const request4wn8 = "https://api.worldoftanks.ru/wot/tanks/stats/?application_id=cf2f77dfac4977080aa7c182250a5736&account_id=" + accid + '&fields=all%2Ctank_id%2Call.damage_dealt%2Call.wins%2Call.losses%2Call.spotted%2Call.frags%2Call.dropped_capture_points'
    let responseWn8 = await fetch(request4wn8);
    let wn8 = await responseWn8.json();

    let countRR = wn8.data[accid].length;

    var tankID = [];
    var WN8 = [];

    con.query(`SELECT *
    FROM information_schema.tables
    WHERE table_schema = 'heroku_4ebbd35da0db6b2'
    AND table_name = '‘${accid}’'
    LIMIT 1`, (err, rows) => {
        if (err) throw err;
        if (!rows[0]){
            con.query(`CREATE TABLE ‘${accid}’ (tankID int(11) NOT NULL, wn8 int(11) NOT NULL)`, (err,rows ) => {
                if(err) throw err;
                console.log('base created')
            });
        } else {
            console.log('account already in base') 
        }
    })

    for(let y = 0; y < countRR; y++) {

        tankID.push(wn8.data[accid][y].tank_id)


        con.query(`SELECT * FROM wn8exp WHERE IDNum = '${tankID[y]}'`, (err,rows) => {

            if (err) throw err;

            let winsTanks = wn8.data[accid][y].all.wins;
            let lossesTanks = wn8.data[accid][y].all.losses;
            let battlesTanks = winsTanks + lossesTanks;
            let Spot = wn8.data[accid][y].all.spotted;
            let avgSpot = (Spot / battlesTanks).toFixed(2);
            let avgDMGtank = (wn8.data[accid][y].all.damage_dealt / battlesTanks).toFixed(3);
            let avgFrag = (wn8.data[accid][y].all.frags / battlesTanks).toFixed(3)
            let avgWinRate = ((winsTanks / battlesTanks) * 100).toFixed(2);
            let avgDef = (wn8.data[accid][y].all.dropped_capture_points / battlesTanks).toFixed(3);


            let expDef = rows[0].expDef;
            let expFrag = rows[0].expFrag;
            let expDmg = rows[0].expDamage;
            let expWinRate = rows[0].expWinRate;
            let expSpot = rows[0].expSpot;

            const rDAMAGE = avgDMGtank     / expDmg
            const rSPOT   = avgSpot    / expSpot 
            const rFRAG   = avgFrag    / expFrag 
            const rDEF    = avgDef     / expDef 
            const rWIN    = avgWinRate / expWinRate

            let rWINc    = Math.max(0,                     (rWIN    - 0.71) / (1 - 0.71) ) 
            let rDAMAGEc = Math.max(0,                     (rDAMAGE - 0.22) / (1 - 0.22) )
            let rFRAGc   = Math.max(0, Math.min(rDAMAGEc + 0.2, (rFRAG   - 0.12) / (1 - 0.12)))
            let rSPOTc   = Math.max(0, Math.min(rDAMAGEc + 0.1, (rSPOT   - 0.38) / (1 - 0.38)))
            let rDEFc    = Math.max(0, Math.min(rDAMAGEc + 0.1, (rDEF    - 0.10) / (1 - 0.10)))

            let rashet = ((980 * rDAMAGEc + 210 * rDAMAGEc * rFRAGc + 155 * rFRAGc * rSPOTc + 75 * rDEFc * rFRAGc + 145 * Math.min(1.8,rWINc)) * battlesTanks).toFixed()
            

            WN8.push(rashet)
        })
    }
    for (let x = 0; x < countRR; x++) {
            con.query(`SELECT * FROM ‘${accid}’`, (err,rows ) => {
                if (err) throw err;

            if(rows.length < 1) {
                sql = `INSERT INTO ‘${accid}’ (tankID,wn8) VALUES ('${tankID[x]}','${WN8[x]}')`
            } else {
                sql = `UPDATE ‘${accid}’ SET wn8 = ${WN8[x]} WHERE tankID = ${tankID[x]}`
            }
            con.query(sql);
        })
    }
}


exports.wn8calc = wn8calc;
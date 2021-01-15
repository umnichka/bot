const Discord = require ('discord.js')
const { MessageEmbed } = require('discord.js');
const fs = require('fs');  

module.exports = {

    name: "setcheck",
    description: "Set autocheck recent games of Dota2",
    usage: "!setCheck <steamprofile>",
    async run (client, message, args) {

        let info = {
            "oldGameId": "1",
            "userId": message.author.id,
            "steamAccountId": args[0]
        };

        console.log(info)
        
        var file = JSON.parse(fs.readFileSync(__dirname +'/helper/data/gameID.json'))

        file = info

        fs.writeFileSync(__dirname + '/helper/data/gameID.json', JSON.stringify(file, null,2));
    }
}


const Discord = require ('discord.js')
const fs = require("fs");


module.exports = {
    name: 'test',
    description: "test",

    async run (client, message, args) {

        fs.readdirSync("./commands/", (err, files) => {
            if(err) console.error(err);
    
            let jsfiles = files.filter(f => f.split(".").pop() === "js");
            if(jsfiles.length <= 0) {
                console.log("No commands to load!");
                return;
            }
    
    
            let result = jsfiles.forEach((f, i) => {
                let props = require(`./${f}`);
                namelist = props.help.name;
                desclist = props.help.description;
                usage = props.help.usage;
            
                // send help text
                message.author.send(`**${namelist}** \n${desclist} \n${usage}`);
            });

        });
    }
}
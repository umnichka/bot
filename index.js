const Discord = require('discord.js'); 
const client = new Discord.Client(); 
const fs = require('fs');  
const { join } = require('path');
const config = require('./config.json');
const prefix = (config.prefix)
const token = (config.token)
const mysql = require("mysql")


client.commands= new Discord.Collection();

const commandFiles = fs.readdirSync(join(__dirname, "commands")).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(join(__dirname, "commands", `${file}`));
    client.commands.set(command.name, command);
}


client.on("error", console.error);


client.on('ready', () => {
  console.log('bot is ready');
});

var con = mysql.createConnection({

  host: process.env.host, // process.env.host
  user: process.env.user, // process.env.user
  password: process.env.password, // process.env.password
  database: process.env.database // process.env.database
});

con.connect(err => {

  if(err) throw err;
  console.log('mysql connected')

  })

  setInterval(function () {
    con.query(`SELECT 1`);
}, 5000);


client.on("message", async message => {

  if(message.author.bot) return;
  if(message.channel.type === 'dm') return;

  if(message.content.startsWith(prefix)) {
      const args = message.content.slice(prefix.length).trim().split(/ +/);

      const command = args.shift().toLowerCase();

      if(!client.commands.has(command)) return;


      try {
          client.commands.get(command).run(client, message, args, con);

      } catch (error){
          console.error(error);
      }
  }
})
client.login(process.env.token)  // process.env.token) 
const Discord = require('discord.js');
const fs = require('fs')
const { join } = require('path');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'help',
	description: 'Information about commands',
	usage: '!help [command name]',
	async run (client, message,args) {

		let x = 1;
        if (x = 1) { 
            message.channel.send('Command disabled')
        }
		
		const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));



		let CCname = [];

		for (const file of commandFiles) {
			const command = require(join(__dirname,`${file}`));
			client.commands.set(command.description);
		}

		for (const file of commandFiles) {
			const command = require(`./${file}`);
			const Cname = '`' + command.name + '`';
			CCname.push(Cname);
		}


		const inffo = new MessageEmbed()
		.setThumbnail(message.guild.iconURL({dynamic : true}))
		.setTitle("Commands:")
		.setColor(0xff00a2)
		.setDescription(`${CCname}`)
		.addField('Type',"!help [command name] to get information about command.")

		if (!args[0]) 
		{
			message.channel.send(inffo)
		
		}
		else {
			let cmd = args[0];
			if (client.commands.has(cmd) || client.commands.get(client.aliases.get(cmd))) {

				let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
				let desc = command.description;
				let usage = command.usage;
				let name = command.name;

				let embed = new Discord.MessageEmbed()
				.setColor(0xff00a2)
				.setTitle(name)
				.setDescription(desc)
				.setFooter("[] optional, <> required.")
				.addField("usage", usage)

				return message.reply(embed);

		}
		}
	}

};
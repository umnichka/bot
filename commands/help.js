const Discord = require('discord.js');
const fs = require('fs')

module.exports = {
	name: 'help',
	description: 'List all available commands.',
	async run (client, message) {
		let str = '';
		const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

		for (const file of commandFiles) {
			const command = require(`./${file}`);
            str += `\nName: ${command.name}, Description: ${command.description} \n`;
        }
        await message.reply(str)
	}
};
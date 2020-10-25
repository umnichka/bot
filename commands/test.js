const Discord = require('discord.js');
const fs = require('fs')
const { join } = require('path');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'test',
	description: 'test.',
	usage: 'test',
	async run (client, message,args) {
		message.channel.send("test")
	}
};
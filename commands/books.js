const Discord = require('discord.js');
const fs = require('fs')
const { join } = require('path');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'books',
	description: 'books',
	usage: '!books',
	async run (client, message,args,con) {

		if (!args[0]) { 
			message.channel.send('`ОШИБКА С ЗНАЧЕНИЯМИ`');
		}
		else if (args[0] === 'add')
		{
			if(!args[1] || !args[2])
			message.channel.send('Книга добавлена')
		}

		const books = new MessageEmbed()
		.setTitle('Books')
		.addField('Ожидайте', `Идет расчет статистики для ${nickName}`)
		.setFooter(time)


    }
}
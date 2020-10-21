const Discord = require ('discord.js')
const { MessageEmbed } = require('discord.js');

module.exports = {

    name: "clear",
    description: "Clears messages",

    async run (client, message, args) {


        const amount = args.join(" ");

        const embed = new MessageEmbed()
        .setTitle(`deleted ${amount} messages`)
        .setColor(`#f3f3f3`)

        if(!amount) return message.reply('enter amount of messages that u wanna delete')

        if(amount > 100) return message.reply(`you cant delete more than 100 messages at once`)

        if(amount < 1) return message.reply(`you cant delete 0 messages`)

        await message.channel.messages.fetch({limit: amount}).then(messages => {
            message.channel.bulkDelete(messages).then(() => {
                message.channel.send(embed)
                .then(message => message.delete({timeout: 5000}));
            })
        });
    }
}
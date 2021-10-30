const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'help',
    description: "List of commands",
    execute(message, args) {
        const helpEmbed = new MessageEmbed()
            .setColor('#0099ff')
	        .setTitle('Commands list')
        	.setDescription('New features coming soon!')
        	.setThumbnail('https://i.imgur.com/TdIMLXy.png')
        	.addFields(
                { name: '\u200B', value: '\u200B' },
                { name: '!!clear [2 - 100]', value: 'Deletes chat messages. (needs version update)' },
        		{ name: '!!help', value: 'Shows this commands list.' },
                { name: '!!play [Search/URL]', value: 'Plays music.' },
                { name: '!!leave', value: 'Leaves voice channel.' },
	        )
        	.setTimestamp()
        	.setFooter('Ganyu', 'https://i.imgur.com/TdIMLXy.png');

        message.channel.send({ embeds: [helpEmbed] });
    }
};
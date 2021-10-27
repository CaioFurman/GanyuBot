const { Client, Intents, Collection } = require('discord.js');
const { token, prefix } = require('./config.json');
const client = new Client({ intents: [Intents.FLAGS.GUILDS]});
const fs = require('fs');

client.botCommands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	if (command.once) {
		client.once(command.name, (...args) => command.execute(...args));
	} else {
		client.on(command.name, (...args) => command.execute(...args));
	}
}

// initialize Ganyu
client.once('ready', () => {
	console.log(`Ready! \nWorking on ${client.guilds.cache.size} servers.`);
	client.user.setStatus('online');
    client.user.setActivity(`${client.guilds.cache.size} servers, !!help for info.`, {
      type: 'WATCHING',
    })
})

// if Ganyu joins a server
client.on('guildCreate', guild => {
	console.log(`Joined a new server:\n${guild.name} (${guild.id})\n${guild.cache.memberCount} members.`);
    client.user.setActivity(`${client.guilds.cache.size} servers, !!help for info.`, {
      type: 'WATCHING',
    })
})

// if Ganyu exits a server
client.on('guildDelete', guild => {
	console.log(`Removed from the server:\n${guild.name} (${guild.id})`);
    client.user.setActivity(`${client.guilds.cache.size} servers, !!help for info.`, {
      type: 'WATCHING',
    })
})

// test using slashcommands
// registered in ./deploy-commands.js
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
    } else if (commandName === 'beep') {
        await interaction.reply('Boop :robot:');
	} else if (commandName === 'server') {
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	} else if (commandName === 'user') {
		await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
	}
});

// to do: save all these commands in their own .js file at ./commands
// HUGE LIST OF BOT COMMANDS!



client.login(token);
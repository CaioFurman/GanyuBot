const { Client, Intents, Collection, MessageEmbed } = require('discord.js');
const { token, prefix } = require('./config.json');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]});
const fs = require('fs')

client.commands = new Collection();

// import commands
const botCommands = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of botCommands){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
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
    client.user.setActivity(`${client.guilds.cache.size} servers, !!help`, {
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

// LIST OF BOT COMMANDS!
// everything is stored at ./commands/

client.on('messageCreate', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return; 
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'help') {
        client.commands.get('help').execute(message, args);
    } else if (command === 'play') {
        client.commands.get ('play').execute(message, args);
    } else if (command === 'leave') {
        client.commands.get ('leave').execute(message, args);
    } else if (command === 'clear') {
      client.commands.get ('clear').execute(message, args);
    } 
 });

client.login(token);
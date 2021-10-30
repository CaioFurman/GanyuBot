module.exports = {
    name: 'clear',
    description: "Clears chat messages",
    async execute(message, args) {
        if (!args[0]) return message.reply("Please, specify the amount of messages you want to clear.");
        if (isNaN(args[0])) return message.reply("Please, enter a real number.");

        if (!args[0] > 100) return message.reply("You cannot delete more than 100 messages at once.");
        if (!args[0] < 1) return message.reply("You must delete at least 2 messages.");

        await message.channel.messages.fetch({limit: args[0]}).then(messages => {
            message.channel.bulkDelete(messages);
        });
    }
};

// needs update.
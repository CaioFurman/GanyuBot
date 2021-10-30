const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
    name: 'leave',
    description: "Leaves the voice channel",
    async execute(message, args) {
        const voiceChannel = message.member.voice.channel;

        const connection = joinVoiceChannel({
            channelId: message.member.voice.channel,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        });

        if (!voiceChannel) return message.channel.send('You need to be in a voice channel to stop the music.')
        connection.destroy();
        message.channel.send('Leaving voice channel.')
    }
};
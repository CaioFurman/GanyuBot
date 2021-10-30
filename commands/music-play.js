const ytDownload = require('ytdl-core');
const ytSearch = require('yt-search');
const {
	AudioPlayerStatus,
	StreamType,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
} = require('@discordjs/voice');


module.exports = {
    name: 'play',
    description: "Plays youtube videos",
    async execute(message, args) {
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) return message.reply('Please, join a voice channel.')
        if (!args.length) return message.reply('Please, enter what you want to listen or send a URL.')

        const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator
            });

        const videoFinder = async (query) => {
            const videoResult = await ytSearch(query);

            return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
        }

        const video = await videoFinder(args.join(' '));

        if (video){
            const stream = ytDownload(video.url, {filter: 'audioonly'});
            const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
            const player = createAudioPlayer();

            player.play(resource);
            connection.subscribe(player);
            await message.reply(`Now playing: **${video.title}**`)

            player.on(AudioPlayerStatus.Idle, () => connection.destroy());
                
        } else {
            message.reply('No results found.')
            connection.destroy();
        }
    }
};
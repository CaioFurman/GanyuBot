const ytDownload = require('ytdl-core');
const ytSearch = require('yt-search');
const {
	AudioPlayerStatus,
	StreamType,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
} = require('@discordjs/voice');

const queue = new Map();

module.exports = {
    name: 'play',
    description: "Plays youtube videos",
    async execute(message, args) {
	    
// voice channel identification
        const voiceChannel = message.member.voice.channel;
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator
        });

// warning due to wrong inputs    
        if (!voiceChannel) return message.reply('Please, join a voice channel.')
        if (!args.length) return message.reply('Please, enter what you want to listen or send a URL.')
	    
        let song = {};
	const server_queue = queue.get(message.guild.id);
	 
// URL request 
        if (ytDownload.validateURL(args[0])) {
            const song_info = await ytDownload.getInfo(args[0]);
            song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url }

// Search Request		
        } else {            
            const videoFinder = async (query) => {
                const videoResult = await ytSearch(query);
                return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
            }

            const video = await videoFinder(args.join(' '));
            if (video){
                song = { title: video.title, url: video.url}

            } else {
                message.reply('No results found.')
                connection.destroy();
            }
        }

// adding songs in the queue
        if (!server_queue) {

            const queue_constructor = {
                voiceChannel: voiceChannel,
                textChannel: message.channel,
                connection: null,
                songs: []
            }

            queue.set(message.guild.id, queue_constructor);
            queue_constructor.songs.push(song);

            try {
                queue_constructor.connection = connection;
                video_player(message.guild, queue_constructor.songs[0]);
            } catch (err) {
                queue.delete(message.guild.id);
                message.channel.send('There was an error...')
                throw err;
            }
        } else {
            server_queue.songs.push(song);
            return message.channel.send(`***${song.title}*** added to the queue.`);
        }
    }
}

const video_player = async (guild, song) => {
const song_queue = queue.get(guild.id);
	
// queue finished
    if (!song) {
        song_queue.connection.destroy();
        queue.delete(guild.id);
        return;
    }
	
// playing requests
    const stream = ytDownload(song.url, {filter: 'audioonly'});
    const resource = createAudioResource( stream, { inputType: StreamType.Arbitrary });
    const player = createAudioPlayer(); 
    song_queue.connection.subscribe(player)
    player.play(resource);

// changing songs
    player.on(AudioPlayerStatus.Idle, () => {
        song_queue.songs.shift();
        video_player(guild, song_queue.songs[0]);
    });
    await song_queue.textChannel.send(`Now playing: ***${song.title}***.`)

    player.on('error', error => {
        console.error(`Error: ${error.message} with resource ${error.resource.metadata}`);
        player.play(getNextResource());
    })
};

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QueryType, useMainPlayer, GuildQueuePlayerNode } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Plays a song in your voice channel. You can provide a song name or link.')
		.addStringOption(option =>
			option
				.setName('query')
				.setDescription('The track you want to play. It can be a music name or a song/playlist link!')
				.setRequired(true)),
	async execute(interaction) {
		const player = useMainPlayer();

		if (!interaction.member.voice.channel) {
			await interaction.reply({ content: 'You must be in a voice channel to use this command', ephemeral: true });
			return;
		}

		// const queue = await player.createQueue(interaction.guild);
		const queue = await player.nodes.create(interaction.guild);

		// if (!queue.connection) await queue.connect(interaction.member.voice.channel);

		const embed = new EmbedBuilder();
		const query = interaction.options.getString('query');
		if (!isValidUrl(query)) {

			const result = await player.search(query, {
				requestedBy: interaction.user,
				searchEngine: QueryType.AUTO,
			});

			if (result.tracks.length === 0) {
				await interaction.reply({ content: 'No results found!', ephemeral: true });
				return;
			}

			const song = result.tracks[0];
			await queue.addTrack(song);

			const node = new GuildQueuePlayerNode(queue);
			const position = node.getTrackPosition(song) + 1;

			embed
				.setDescription(`Added **[${song.title}](${song.url})** by **[${song.author}](${song.url})** to the queue at position **#${position}**`)
				.setThumbnail(song.thumbnail)
				.setColor(0x008000);
				// .setFooter({text: `Duration: ${song.duration}`});
		} 
		else {
			// Implement url/links
			return;
		}

		if (!queue.connection) await queue.connect(interaction.member.voice.channel);
		if (!queue.isPlaying()) {
			const tracks = queue.tracks.toArray();
			await queue.play(tracks);
		}

		await interaction.reply({ embeds: [embed], ephemeral: true });

	},
};

const isValidUrl = urlString => {
	try { 
		return Boolean(new URL(urlString)); 
	}
	catch (e) { 
		return false; 
	}
};
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Shows the current queue for this guild!'),
	async execute(interaction) {

        const queue = useQueue(interaction.guild.id);

        if (!queue /* || !queue.isPlaying() */) {
            const errorEmbed = new EmbedBuilder()
                .setAuthor({ name: 'No queue!'})
                .setDescription('Oops! I need to be playing music to use that feature ( It won\'t make sense to use it when there\'s no music!)')
                .setColor(0x990000);

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            return;
        }

        const currentTrack = queue.currentTrack;

        const queueString = queue.tracks.map((song, i) => {
            return `${i + 1})  [${song.title}](${song.url}) by [${song.author}](${song.url}) requested by <@${song.requestedBy.id}> ${(currentTrack.id == song.id) ? '(▶️)' : ''}`;
        }).join('\n');

        const queueEmbed = new EmbedBuilder()
            .setAuthor({ name: 'Queue!'})
            .setDescription(queueString)
            .setColor(0x008000);

        await interaction.reply({ embeds: [queueEmbed], ephemeral: true });
    },
};
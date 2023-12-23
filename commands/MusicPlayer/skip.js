const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skips the currently playing song!'),
	async execute(interaction) {
        
        const queue = useQueue(interaction.guild.id);

        if (!queue) {
            const notPlayingEmbed = new EmbedBuilder()
                .setAuthor({ name: 'Nothing playing!'})
                .setDescription('Oops! I need to be playing music to use that feature ( It won\'t make sense to use it when there\'s no music!)')
                .setColor(0x990000);

            await interaction.reply({ embeds: [notPlayingEmbed], ephemeral: true });
            return;
        }

        // TODO: determine if loop is on (Maybe, might not need)
        const currentTrack = queue.currentTrack;
        const tracks = queue.tracks.toArray();
        const index = tracks.findIndex(x => x.id === currentTrack.id);

        if (index == (tracks.length - 1)) {
            const noNextEmbed = new EmbedBuilder()
                .setDescription('There is nothing after this track in the queue!')
                .setColor(0x990000);
            
            await interaction.reply({ embeds: [noNextEmbed], ephemeral: true });
            return;
        }

        queue.node.skip();
        // FEATURE: Show buttons (next, play, stop, etc)
        // Note: This shows the buttons instead of embed message

        const successEmbed = new EmbedBuilder()
            .setDescription('⏩ Successfully playing next song!')
            .setColor(0x008000);

        await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    },
};
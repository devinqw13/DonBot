const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QueryType, useMainPlayer, useQueue } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stops the current playback!'),
	async execute(interaction) {
        // const player = useMainPlayer();

        // const queue = player.nodes.get(interaction.guild);
        
        const queue = useQueue(interaction.guild.id);

        if (!queue) {
            const notPlayingEmbed = new EmbedBuilder()
                .setAuthor({ name: 'Nothing playing!', iconURL: interaction.client.user.avatar})
                .setDescription('Oops! I need to be playing music to use that feature ( It won\'t make sense to use it when there\'s no music!)')
                .setColor(0x990000);

            await interaction.reply({ embeds: [notPlayingEmbed], ephemeral: true });
            return;
        }

        queue.delete();

        const successEmbed = new EmbedBuilder()
            .setDescription('⏹ Successfully stopped the music!')
            .setColor(0x008000);

        await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    },
};
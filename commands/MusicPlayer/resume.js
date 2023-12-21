const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Resumes the current playback!'),
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

        // queue.node.setPaused(!queue.node.isPaused());
        if (queue.node.isPaused()) {
            queue.node.setPaused(false);
        } 
        else {
            const successEmbed = new EmbedBuilder()
            .setDescription('▶️ Music is already playing!')
            .setColor(0xEED202);

            await interaction.reply({ embeds: [successEmbed], ephemeral: true });

            return;
        }

        const successEmbed = new EmbedBuilder()
            .setDescription('▶️ Successfully resumed the music!')
            .setColor(0x008000);

        await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    },
};
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clear messages!')
		.addIntegerOption(option =>
			option.setName('amount')
				.setDescription('The amount of messages to clear. (1-100).')
				.setMinValue(1)
				.setMaxValue(100)),
	async execute(interaction) {
		const amount = interaction.options.getInteger('amount');

		const channel = interaction.channel;
		const messageManager = channel.messages;
		const messages = await messageManager.channel.messages.fetch({ limit: amount });
		channel.bulkDelete(messages, true);

		await interaction.reply({ content: `Cleared the last **${amount}** messages!`, ephemeral: true });
	},
};
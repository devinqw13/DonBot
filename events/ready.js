const { Events } = require('discord.js');
const { deployCommands } = require('../deploy-commands.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		await deployCommands();
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};

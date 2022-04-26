const client = require('../lists+constants/fundamentals').client;

const execute = async mention => {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		try {
			return await client.users.fetch(mention);
		} catch(e) {
			return undefined;
		}
	}
}

module.exports = execute;
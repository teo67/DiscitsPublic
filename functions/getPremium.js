const client = require('../lists+constants/fundamentals').client;

const execute = async id => {
    let found;
    try {
        const supportServer = await client.guilds.fetch('925940436340707368');
        found = await supportServer.members.fetch(id);
    } catch(e) {
        return 0;
    }
    if(found.roles.cache.get('925983726058475590')) {
        return 3;
    }
    if(found.roles.cache.get('925983654608502875')) {
        return 2;
    }
    if(found.roles.cache.get('925982023347228684')) {
        return 1;
    }
    return 0;
}

module.exports = execute;
const execute = obj => {
    if(obj.progression !== undefined) {
        return 'user';
    }
    if(obj.index !== undefined) {
        return 'trainer';
    }
    if(obj.nickname !== undefined) {
        return 'wild';
    }
    return; // idk at this point wtf happened basically
}

module.exports = execute;
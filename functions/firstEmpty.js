const User = require('../classes/cls_user');

const execute = user => {
    for(let i = 0; i < user._party.length; i++) {
        if(!User.party(user, i)) {
            return i;
        }
    }
    return -1;
}

module.exports = execute;

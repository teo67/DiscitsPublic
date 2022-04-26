const User = require('../classes/cls_user');
const tag = require('./tag');

const execute = user => {
    let party = [user];
    if(tag(user) == 'trainer') {
        party = user.caught;
    } else if(tag(user) == 'user') {
        party = [User.party(user, 0), User.party(user, 1), User.party(user, 2), User.party(user, 3), User.party(user, 4), User.party(user, 5)];
    }
    
    for(let i = 0; i < party.length; i++) {
        if(party[i] && party[i].temphp > 0) {
            return i;
        }
    }
    return -1;
}

module.exports = execute;
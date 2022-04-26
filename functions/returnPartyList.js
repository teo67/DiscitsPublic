const User = require('../classes/cls_user');

const execute = user => {
    let returning = ``;
    for(let i = 0; i < 6; i++) {
        if(user._party[i] != -1) {
            let nick = User.party(user, i).nickname;
            if(nick == User.party(user, i)._base) {
                nick = `*No nickname*`;
            } else {
                nick = `*"${nick}"*`;
            }
            returning += `\n${i + 1}: ${User.party(user, i)._base} (Level ${User.party(user, i).level}) ${nick}`;
            returning += `    - HP: ${User.party(user, i).temphp} / ${User.party(user, i).stats[5]}`;
        } else {
            returning += `\n${i + 1}: None`;
        } 
    }
    return returning;
}

module.exports = execute;
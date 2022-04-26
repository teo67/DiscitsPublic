const getBothResults = require('./getBothResults');
const takeTurns = require('./takeTurns');
const checkForDiscs = require('../checkForDiscs');
const battleCheck = require('./battleCheck');
const returnEmbed = require('../returnEmbed');
const tag = require('../tag');
const execute = async (p1, p1Discord, p2tag, _p2, p2Discord) => {
    let p2 = _p2;
    if(p2tag == 'wild') {
        p2 = p1.battle.wild;
    } else if(p2tag == 'trainer') {
        p2 = p1.battle.trainer;
    }

    const wager = p1.battle.wager;
    const p1participated = p1.battle.p1participated;
    const p2participated = p1.battle.p2participated;
    const mustSwap = p1.battle.mustSwap;

    const sendAsMultiple = async (text, title) => {
        let realText = (require('../../lists+constants/fundamentals').downtime ? '**WARNING: The bot will go down in under a minute, so it may stop sending messages. If this happens, just use any command on a server to resume the battle.**\n\n' : '') + text;
        for(const user of [p1Discord, p2Discord]) {
            if(user) {
                for(let finalIndex = 0; finalIndex < realText.length; finalIndex += 2000) {
                    try {
                        await user.send(returnEmbed(user, realText.slice(finalIndex, Math.min(finalIndex + 2000, realText.length)), title));
                    } catch(e) {
                        console.log(`error sending user message: ${e}`); // catch our errors yk how it is
                    }
                }
            }
        }
    }

    let results = undefined;
    try {
        results = await getBothResults(p1, p1Discord, p2, p2Discord, mustSwap);
    } catch(e) {
        console.log(e);
        if(p2tag == 'user') {
            await sendAsMultiple((e == 1 ? `<@${p1._id}> didn\'t make a move in time!\n\n` + await battleCheck(p2, p2.caught[p2.equipped], p1, p1.caught[p1.equipped], wager, p2participated) : `<@${p2._id}> didn\'t make a move in time!\n\n` + await battleCheck(p1, p1.caught[p1.equipped], p2, p2.caught[p2.equipped], wager, p1participated)), 'Battle Status');
        } else {
            await sendAsMultiple('You didn\'t make a move in time, and so the battle has been paused. Use any command to resume it automatically.', 'Battle Paused');
            p1.battle.paused = true;
        }
    }

    if(results !== undefined) {
        const moveResults = takeTurns(p1, p2, results[0], results[1], p1participated, p2participated, mustSwap);
    
        for(let i = 0; i < moveResults[0].length; i++) { // send one message per turn (2 total)
            if(moveResults[0][i]) {
                await sendAsMultiple(moveResults[0][i], `TURN ${i + 1}`);
            }
        }

        let swappingNext = false; // null = game over, false = no swap, true = must swap
        if(moveResults[1]) { // if you caught the wild discit
            swappingNext = null;
            await sendAsMultiple(await battleCheck(p1, p1.caught[p1.equipped], p2, p2, 0, p1participated), 'Battle Status');
        } else {
            const sets = [[p1, p1.caught[p1.equipped], p1participated], [p2, (p2tag == 'wild' ? p2 : p2.caught[p2.equipped]), p2participated]];
            for(let i = 0; i < sets.length; i++) {
                if(sets[i][1].temphp < 1) {
                    let sending = null;
                    if(checkForDiscs(sets[i][0])) {
                        swappingNext = true;
                        sending = `${sets[i][1].nickname} fainted! Both players will now have a chance to bring out another Discit!`;
                    } else {
                        swappingNext = null;
                        sending = await battleCheck(sets[1 - i][0], sets[1 - i][1], sets[i][0], sets[i][1], wager, sets[1 - i][2]);
                    }
                    await sendAsMultiple(sending, 'Battle Status');
                }
            }
        }

        if(swappingNext !== null) {
            p1.battle.mustSwap = swappingNext; // booleans aren't referenced, so we do this manually
            execute(p1, p1Discord, p2tag, _p2, p2Discord);
        }
    }

    try {
        await p1.save();
        if(p2tag == 'user') {
            await p2.save();
        }
    } catch(e) {
        console.log(e);
        await sendAsMultiple('WARNING! Servers are failing to save your data, so this battle will probably have no results!', 'Error');
    }
}

module.exports = execute;
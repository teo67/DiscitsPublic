const returnEmbed = require('../functions/returnEmbed');
const Command = require('../classes/cls_command');
const Caught = require('../classes/cls_caught');
const items = require('../lists+constants/items');
const User = require('../classes/cls_user');
const getRequired = require('../functions/getRequired');
const discits = require('../lists+constants/discits');

module.exports = new Command(
    'daily',
    'Premium', 
    'Redeem a daily box with xp, items, and more!', 
    '',
    'Has registered for an account, has at least Tier 1 Premium, is not in battle',
    {
        user: true, 
        premium: 1, 
        battle: false
    },
    (message, args, results) => {
        const user = results.user;
        
        const time = Date.now();
        const difference = user.cds.daily ? 86400000 - (time - user.cds.daily) : 0;
        if(difference > 0) {
            const hours = Math.floor(difference / 3600000);
            const minutes = Math.floor((difference % 3600000) / 60000);
            message.channel.send(returnEmbed(message.author, `You still have ${hours} hour(s) and ${minutes} minute(s) of cooldown before your next daily box!`, 'Error'));
            return;
        }
        user.cds.daily = time;
        

        // now you actually get daily
        let highest = null;
        for(const disc of user.caught) {
            if(highest === null || disc.level > highest.level) {
                highest = disc;
            }
        }
        let returning = '';
        if(highest !== null) {
            const xpGained = Math.round((Math.random() * 0.3 + 0.85) * (getRequired(highest.level + 1, discits[highest._base].levelSpeed) - getRequired(highest.level, discits[highest._base].levelSpeed)));
            for(let i = 0; i < (Math.random() < 0.2 ? 2 : 1); i++) {
                const chosen = Math.floor(Math.random() * user.caught.length);
                if(i == 1) {
                    returning += `\n\n**BONUS XP DROP! (20% chance)**\n`;
                }
                returning += `${user.caught[chosen].nickname} (your number ${chosen + 1} Discit) got XP! The amount was decided by ${highest.nickname}, your highest level Discit.`;
                returning += Caught.gainXP(user.caught[chosen], xpGained);
            }
        } else {
            returning += `*You have no Discits, so nobody got any XP!*`;
        }

        let shop = [];
        for(const key of Object.keys(items)) {
            if(items[key].price > 0) {
                shop.push(key);
            }
        }
        const amount = Math.floor(Math.random() * 3) + 1;
        const item = shop[Math.floor(Math.random() * shop.length)];
        User.gainItem(user, item, amount);
        returning += `\n\n**You also got ${amount} ${item}(s) from the box!**\n\n${items[item].description}`;

        for(let finalIndex = 0; finalIndex < returning.length; finalIndex += 2000) {
            message.channel.send(returnEmbed(message.author, returning.slice(finalIndex, Math.min(finalIndex + 2000, returning.length)), 'You opened a daily box!'));
        }
        return;
    }
);
const returnEmbed = require('../functions/returnEmbed');
const Command = require('../classes/cls_command');
const Caught = require('../classes/cls_caught');
const items = require('../lists+constants/items');
const User = require('../classes/cls_user');
const getRequired = require('../functions/getRequired');
const discits = require('../lists+constants/discits');
const CaughtProto = require('../classes/cls_caughtproto');

module.exports = new Command(
    'weekly', 
    'Premium',
    'Redeem a weekly box that may contain super rare Discits and items!', 
    '',
    'Has registered for an account, has at least Tier 3 Premium, is not in battle',
    {
        user: true, 
        premium: 3, 
        battle: false
    },
    (message, args, results) => {
        const user = results.user;
        
        const time = Date.now();
        const difference = user.cds.weekly ? 604800000 - (time - user.cds.weekly) : 0;
        if(difference > 0) {
            const days = Math.floor(difference / 86400000);
            const hours = Math.floor((difference % 86400000) / 3600000);
            const minutes = Math.floor(((difference % 86400000) % 3600000) / 60000);
            message.channel.send(returnEmbed(message.author, `You still have ${days} day(s), ${hours} hour(s), and ${minutes} minute(s) of cooldown before your next weekly box!`, 'Error'));
            return;
        }
        user.cds.weekly = time;
        

        // now you actually get weekly
        let rare = [];
        for(const key of Object.keys(discits)) {
            if(discits[key].catchRate <= 90 && key != 'Prizeri') {
                rare.push(key); // should be 1/3 of discits that have the lowest catch rate besides prizeri
            }
        }

        let highest = null;
        for(const disc of user.caught) {
            if(highest === null || disc.level > highest.level) {
                highest = disc;
            }
        }

        let returning = '';
        for(let i = 0; i < (Math.random() < 0.2 ? 2 : 1); i++) {
            const chosen = rare[Math.floor(Math.random() * rare.length)];
            const level = (highest === null ? 1 : Math.floor(highest.level * (0.65 + Math.random() * 0.35)));
            User.newCatch(user, new Caught(new CaughtProto(chosen, level, [])));
            if(i == 1) {
                returning += '\n\n**BONUS DISCIT DROP (20% chance)**\n';
            }
            returning += `You got a level ${level} ${chosen} from the box!`
        }

        let shop = [];
        for(const key of Object.keys(items)) {
            if(items[key].price > -1) { // includes items not in shop
                shop.push(key);
            }
        }

        for(let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
            const item = shop[Math.floor(Math.random() * shop.length)];
            const amount = Math.floor(Math.random() * 4) + 2;
            User.gainItem(user, item, amount);
            returning += `\n\n${'*'.repeat(i + 1)}You got ${amount} ${item}(s) from inside the box!${'*'.repeat(i + 1)}\n\n${items[item].description}`;
        }

        const coinGain = 1000 + Math.round((Math.random() * 0.2 + 0.3) * user.coins);
        User.getCoins(user, coinGain);
        returning += `\n\n**At the bottom, you found ${coinGain} extra coins!**`;
        message.channel.send(returnEmbed(message.author, returning, 'You opened a weekly box!'));
        return;
    }
);
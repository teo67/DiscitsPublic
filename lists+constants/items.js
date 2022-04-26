const Item = require('../classes/cls_item'); // patch: item funcs only return a string
const User = require('../classes/cls_user');
const discits = require('./discits');
const Caught = require('../classes/cls_caught');
const tag = require('../functions/tag');
const firstEmpty = require('../functions/firstEmpty');

const calcA = (catching, ball) => {
    let multiplier = 1;
    if(catching.effects.includes('asleep') || catching.effects.includes('frozen')) {
        multiplier = 2.5;
    } else if(catching.effects.includes('paralyzed') || catching.effects.includes('poisoned') || catching.effects.includes('burned')) {
        multiplier = 1.5;
    }
    return ((((3 * catching.stats[5]) - (2 * catching.temphp)) * discits[catching._base].catchRate * ball) / (3 * catching.stats[5])) * multiplier;
}

const doCatcher = (player, otherPlayer, ballRate) => {
    let returning = ``;
    const a = calcA(otherPlayer, ballRate);
    const b = 65536 / ((255 / a) ** 0.1875);
    const milestones = [15, 30, 45, 60];
    let multiplier = 0;
    for(let i = 0; i < milestones.length; i++) {
        if(player.discidex.length >= milestones[i]) {
            multiplier += 0.5;
        }
    }
    const c = Math.round((a * multiplier) / 6);
    const random = Math.floor(Math.random() * 256);
    let worked = true;
    if(a >= 255) {
        returning += 'Perfect catch!';
    } else if(random < c) {
        returning += 'An excellent throw!';
    }
    returning += '\n...\n';
    for(let i = 0; a < 255 && i < 4 && (i < 1 || random >= c); i++) {
        const roll = Math.floor(Math.random() * 65536);
        if(roll >= b) {
            returning += `The wild ${otherPlayer._base} broke free!`;
            i = 4;
            worked = false;
        } else {
            if(i != 3 && random >= c) {
                returning += `*The box shakes from within*...\n`;
            } else {
                returning += `You caught the wild ${otherPlayer._base}!\n`;
                returning += '\n**You may now continue on your journey!**';
            }
        }
    }
    if(worked) {
        //Caught.takeDamage(otherPlayer, otherPlayer.temphp); // kill it
        User.newCatch(player, otherPlayer);
        const returned = firstEmpty(player);
        if(returned == -1) {
            returning += `\n (${otherPlayer._base} has been set aside, as your party is full)`;
        } else {
            player._party[returned] = player.caught.length - 1;
            returning += `\n (${otherPlayer._base} has been added to your party, as there was space available)`;
        }
    }
    return [returning, worked];
}

const items = {
    'Water': new Item((player, otherPlayer, target, isBattling) => {
        let caught = player;
        if(tag(player) == 'user') {
            caught = User.party(player, target);
        } else if(tag(player) == 'trainer') {
            caught = player.caught[target];
        }
        if(caught.temphp == caught.stats[5] || caught.temphp < 1) {
            return false;
        }
        return true;
    }, (player, otherPlayer, target) => { 
        let caught = player;
        if(tag(player) == 'user') {
            caught = User.party(player, target);
        } else if(tag(player) == 'trainer') {
            caught = player.caught[target];
        }
        Caught.takeDamage(caught, -25);
        return [`${caught.nickname} gained 25 health!`, false];
    }, true, 'A quick drink to keep your Discit on its feet! This item restores 20 health to the target, and it can be used in and out of battle.', 50),
    
    'Slurpee': new Item((player, otherPlayer, target, isBattling) => {
        let caught = player;
        if(tag(player) == 'user') {
            caught = User.party(player, target);
        } else if(tag(player) == 'trainer') {
            caught = player.caught[target];
        }
        if(caught.temphp == caught.stats[5] || caught.temphp < 1) {
            return false;
        }
        return true;
    }, (player, otherPlayer, target) => { 
        let caught = player;
        if(tag(player) == 'user') {
            caught = User.party(player, target);
        } else if(tag(player) == 'trainer') {
            caught = player.caught[target];
        }
        Caught.takeDamage(caught, -50);
        return [`${caught.nickname} gained 50 health!`, false];
    }, true, 'Slurpees restore some serious health (50 to be exact) to the Discit you target. Just like bottles of water, this can be used whether you\'re in battle or not.', 100),
    
    'Magic elixir': new Item((player, otherPlayer, target, isBattling) => {
        let caught = player;
        if(tag(player) == 'user') {
            caught = User.party(player, target);
        } else if(tag(player) == 'trainer') {
            caught = player.caught[target];
        }
        if(caught.temphp == caught.stats[5] || caught.temphp < 1) {
            return false;
        }
        return true;
    }, (player, otherPlayer, target) => { 
        let caught = player;
        if(tag(player) == 'user') {
            caught = User.party(player, target);
        } else if(tag(player) == 'trainer') {
            caught = player.caught[target];
        }
        Caught.takeDamage(caught, -90);
        return [`${caught.nickname} gained 90 health!`, false];
    }, true, 'One of the most potent juices in the game, this elixir will restore 90 health to whatever Discit you choose to use it on. It can be used anytime.', 0),
    
    'Energy drink': new Item((player, otherPlayer, target, isBattling) => {
        if(!isBattling) {
            return false;
        }
        let caught = player;
        if(tag(player) == 'user') {
            caught = User.party(player, target);
        } else if(tag(player) == 'trainer') {
            caught = player.caught[target];
        }
        if(caught.temphp < 1) {
            return false;
        }
        return true;
    }, (player, otherPlayer, target) => { 
        let caught = player;
        if(tag(player) == 'user') {
            caught = User.party(player, target);
        } else if(tag(player) == 'trainer') {
            caught = player.caught[target];
        }
        Caught.takeDamage(caught, -20);
        Caught.statChange(caught, 0, 2);
        Caught.statChange(caught, 4, 3);
        return [`${caught.nickname} gained 20 health! Their attack and speed also rose substantially.`, false];
    }, true, 'Unlike bottles of water, energy drinks give your Discit a strong attack and speed boost (along with restoring health). These must be used in battle.', 0),
    
    'Shoebox': new Item((player, otherPlayer, target, isBattling) => {
        if(!isBattling) {
            return false;
        }
        if(tag(otherPlayer) != 'wild') {
            return false;
        }
        if(otherPlayer.temphp < 1) {
            return false;
        }
        return true;
    }, (player, otherPlayer) => {
        return doCatcher(player, otherPlayer, 1);
    }, false, 'Shoeboxes can be used to capture Discits, although they aren\'t too effective. These can only be used while battling a wild Discit.', 25),
    
    'Special box': new Item((player, otherPlayer, target, isBattling) => {
        if(!isBattling) {
            return false;
        }
        if(tag(otherPlayer) != 'wild') {
            return false;
        }
        if(otherPlayer.temphp < 1) {
            return false;
        }
        return true;
    }, (player, otherPlayer) => {
        return doCatcher(player, otherPlayer, 2);
    }, false, 'The special box is an improved version of its shoe-storing counterpart. It has about twice the catch rate, and it should be used against wild Discits.', 75),
    
    'Magnetic box': new Item((player, otherPlayer, target, isBattling) => {
        if(!isBattling) {
            return false;
        }
        if(tag(otherPlayer) != 'wild') {
            return false;
        }
        if(otherPlayer.temphp < 1) {
            return false;
        }
        return true;
    }, (player, otherPlayer) => {
        if(discits[otherPlayer._base].element == 'electric') {
            return doCatcher(player, otherPlayer, 3.5);
        }
        return doCatcher(player, otherPlayer, 0.75);
    }, false, 'A variant of the Shoebox, the magnetic box works especially well when used against electric-type Discits. These can only be used while battling a wild Discit.', 0),
    
    'Floating box': new Item((player, otherPlayer, target, isBattling) => {
        if(!isBattling) {
            return false;
        }
        if(tag(otherPlayer) != 'wild') {
            return false;
        }
        if(otherPlayer.temphp < 1) {
            return false;
        }
        return true;
    }, (player, otherPlayer) => {
        if(discits[otherPlayer._base].element == 'flying') {
            return doCatcher(player, otherPlayer, 3.5);
        }
        return doCatcher(player, otherPlayer, 0.75);
    }, false, 'Floating boxes are best used to capture a flying Discit, but be warned that they are terrible when used against anything else. These can only be used while battling a wild Discit.', 0),
    
    'Sludgy box': new Item((player, otherPlayer, target, isBattling) => {
        if(!isBattling) {
            return false;
        }
        if(tag(otherPlayer) != 'wild') {
            return false;
        }
        if(otherPlayer.temphp < 1) {
            return false;
        }
        return true;
    }, (player, otherPlayer) => {
        if(discits[otherPlayer._base].element == 'poison') {
            return doCatcher(player, otherPlayer, 3.5);
        }
        if(discits[otherPlayer._base].element == 'Water') {
            return doCatcher(player, otherPlayer, 1.75);
        }
        return doCatcher(player, otherPlayer, 0.75);
    }, false, 'Sludgy boxes work well against poison-type Discits, and they\'re pretty good against water-types as well. These can only be used while battling a wild Discit.', 0),
    
    'Black box': new Item((player, otherPlayer, target, isBattling) => {
        if(!isBattling) {
            return false;
        }
        if(tag(otherPlayer) != 'wild') {
            return false;
        }
        if(otherPlayer.temphp < 1) {
            return false;
        }
        return true;
    }, (player, otherPlayer) => {
        if(discits[otherPlayer._base].element == 'dark') {
            return doCatcher(player, otherPlayer, 4);
        }
        return doCatcher(player, otherPlayer, 0.75);
    }, false, 'The black box is a more rare type of Shoebox that works incredibly well against Dark-type Discits. Just like Shoeboxes, these can only be used while in combat against a wild Discit.', 0),
    
    'Gift box': new Item((player, otherPlayer, target, isBattling) => {
        if(!isBattling) {
            return false;
        }
        if(tag(otherPlayer) != 'wild') {
            return false;
        }
        if(otherPlayer.temphp < 1) {
            return false;
        }
        return true;
    }, (player, otherPlayer) => {
        return doCatcher(player, otherPlayer, 255);
    }, false, 'You only get one of these, so use it wisely! The gift box has a 100% catch rate against any Discit, which is why it\'s so rare in the region.', 0),
    
    'Thaw juice': new Item((player, otherPlayer, target, isBattling) => {
        let caught = player;
        if(tag(player) == 'user') {
            caught = User.party(player, target);
        } else if(tag(player) == 'trainer') {
            caught = player.caught[target];
        }
        if(!caught.effects.includes('frozen')) {
            return false;
        }
        return true;
    }, (player, otherPlayer, target) => { 
        let caught = player;
        if(tag(player) == 'user') {
            caught = User.party(player, target);
        } else if(tag(player) == 'trainer') {
            caught = player.caught[target];
        }
        Caught.removeEffect(caught, 'frozen');
        return [`A draft of warm air rose from the ground, and ${caught.nickname} thawed out!`, false];
    }, true, 'Thaw juice will get rid of the frozen effect on any Discit you choose to use it on. Because effects remain after battle, this can be used anytime.', 80),
    
    'Spray bottle': new Item((player, otherPlayer, target, isBattling) => {
        let caught = player;
        if(tag(player) == 'user') {
            caught = User.party(player, target);
        } else if(tag(player) == 'trainer') {
            caught = player.caught[target];
        }
        if(!caught.effects.includes('burned')) {
            return false;
        }
        return true;
    }, (player, otherPlayer, target) => { 
        let caught = player;
        if(tag(player) == 'user') {
            caught = User.party(player, target);
        } else if(tag(player) == 'trainer') {
            caught = player.caught[target];
        }
        Caught.removeEffect(caught, 'burned');
        return [`You Sprayed ${caught.nickname} with some cold water, and it removed the *burned* effect!`, false];
    }, true, 'Spray bottles are\'t very effective at putting out large fires, but they work well when used on Discits. You can use them whether or not you\'re in battle.', 80),
    
    'Insulator': new Item((player, otherPlayer, target, isBattling) => {
        let caught = player;
        if(tag(player) == 'user') {
            caught = User.party(player, target);
        } else if(tag(player) == 'trainer') {
            caught = player.caught[target];
        }
        if(!caught.effects.includes('paralyzed')) {
            return false;
        }
        return true;
    }, (player, otherPlayer, target) => { 
        let caught = player;
        if(tag(player) == 'user') {
            caught = User.party(player, target);
        } else if(tag(player) == 'trainer') {
            caught = player.caught[target];
        }
        Caught.removeEffect(caught, 'paralyzed');
        return [`${caught.nickname} was cured of its paralysis by use of an Insulator!`, false];
    }, true, 'Insulators can be used to get rid of the paralysis effect on your Discits. We aren\'t totally sure how they work, but an item is an item.', 90),
    
    'Cleansing leaves': new Item((player, otherPlayer, target, isBattling) => {
        let caught = player;
        if(tag(player) == 'user') {
            caught = User.party(player, target);
        } else if(tag(player) == 'trainer') {
            caught = player.caught[target];
        }
        if(!caught.effects.includes('poisoned')) {
            return false;
        }
        return true;
    }, (player, otherPlayer, target) => { 
        let caught = player;
        if(tag(player) == 'user') {
            caught = User.party(player, target);
        } else if(tag(player) == 'trainer') {
            caught = player.caught[target];
        }
        Caught.removeEffect(caught, 'poisoned');
        return [`You used cleansing herbs to fight off ${caught.nickname}'s *poisoned* effect!`, false];
    }, true, 'Cleansing leaves are best used to drive out any poison that might be affecting your Discits. They can be used in an out of battle.', 90),
    
    'Deep clean': new Item((player, otherPlayer, target, isBattling) => {
        let caught = player;
        if(tag(player) == 'user') {
            caught = User.party(player, target);
        } else if(tag(player) == 'trainer') {
            caught = player.caught[target];
        }
        if(caught.effects.length < 1) {
            return false;
        }
        return true;
    }, (player, otherPlayer, target) => { 
        let caught = player;
        if(tag(player) == 'user') {
            caught = User.party(player, target);
        } else if(tag(player) == 'trainer') {
            caught = player.caught[target];
        }
        Caught.resetEffects(caught);
        return [`You deep cleaned ${caught.nickname}, and all of its effects wore off!`, false];
    }, true, 'The deep clean is a prized possession that will get rid of all effects that your Discit may be inflicted with. It can be used anytime.', 200),
    
    'Attack module': new Item((player, otherPlayer, target, isBattling) => {
        if(!isBattling) {
            return false;
        }
        return true;
    }, (player, otherPlayer, target) => { 
        let caught = player;
        if(tag(player) == 'user') {
            caught = User.party(player, target);
        } else if(tag(player) == 'trainer') {
            caught = player.caught[target];
        }
        Caught.statChange(caught, 0, 2);
        return [`The attack module increased ${caught.nickname}'s attack stat by two stages!`, false];
    }, true, 'Attack modules give your Discit a strong attack boost during battle. There are different modules that you can collect for every stat.', 0),
    
    'Defense module': new Item((player, otherPlayer, target, isBattling) => {
        if(!isBattling) {
            return false;
        }
        return true;
    }, (player, otherPlayer, target) => { 
        let caught = player;
        if(tag(player) == 'user') {
            caught = User.party(player, target);
        } else if(tag(player) == 'trainer') {
            caught = player.caught[target];
        }
        Caught.statChange(caught, 1, 2);
        return [`The defense module increased ${caught.nickname}'s defense stat by two stages!`, false];
    }, true, 'Defense modules give your Discit a strong defense boost during battle. There are different modules that you can collect for every stat.', 0),
    
    'Special attack module': new Item((player, otherPlayer, target, isBattling) => {
        if(!isBattling) {
            return false;
        }
        return true;
    }, (player, otherPlayer, target) => { 
        let caught = player;
        if(tag(player) == 'user') {
            caught = User.party(player, target);
        } else if(tag(player) == 'trainer') {
            caught = player.caught[target];
        }
        Caught.statChange(caught, 2, 2);
        return [`The special attack module increased ${caught.nickname}'s special attack stat by two stages!`, false];
    }, true, 'Special attack modules give your Discit a strong special attack boost during battle. There are different modules that you can collect for every stat.', 0),
    
    'Special defense module': new Item((player, otherPlayer, target, isBattling) => {
        if(!isBattling) {
            return false;
        }
        return true;
    }, (player, otherPlayer, target) => { 
        let caught = player;
        if(tag(player) == 'user') {
            caught = User.party(player, target);
        } else if(tag(player) == 'trainer') {
            caught = player.caught[target];
        }
        Caught.statChange(caught, 3, 2);
        return [`The special defense module increased ${caught.nickname}'s special defense stat by two stages!`, false];
    }, true, 'Special defense modules give your Discit a strong special defense boost during battle. There are different modules that you can collect for every stat.', 0),
    
    'Speed module': new Item((player, otherPlayer, target, isBattling) => {
        if(!isBattling) {
            return false;
        }
        return true;
    }, (player, otherPlayer, target) => { 
        let caught = player;
        if(tag(player) == 'user') {
            caught = User.party(player, target);
        } else if(tag(player) == 'trainer') {
            caught = player.caught[target];
        }
        Caught.statChange(caught, 4, 2);
        return [`The speed module increased ${caught.nickname}'s speed stat by two stages!`, false];
    }, true, 'Speed modules give your Discit a strong speed boost during battle. There are different modules that you can collect for every stat.', 0),
    
    'Dodge module': new Item((player, otherPlayer, target, isBattling) => {
        if(!isBattling) {
            return false;
        }
        return true;
    }, (player, otherPlayer, target) => { 
        let caught = player;
        if(tag(player) == 'user') {
            caught = User.party(player, target);
        } else if(tag(player) == 'trainer') {
            caught = player.caught[target];
        }
        Caught.statChange(caught, 5, 2);
        return [`The dodge module increased ${caught.nickname}'s evasiveness stat by two stages!`, false];
    }, true, 'Dodge modules give your Discit a strong evasiveness boost during battle. There are different modules that you can collect for every stat.', 0),
    
    'Accuracy module': new Item((player, otherPlayer, target, isBattling) => {
        if(!isBattling) {
            return false;
        }
        return true;
    }, (player, otherPlayer, target) => { 
        let caught = player;
        if(tag(player) == 'user') {
            caught = User.party(player, target);
        } else if(tag(player) == 'trainer') {
            caught = player.caught[target];
        }
        Caught.statChange(caught, 6, 2);
        return [`The accuracy module increased ${caught.nickname}'s accuracy stat by two stages!`, false];
    }, true, 'Accuracy modules give your Discit a strong accuracy boost during battle. There are different modules that you can collect for every stat.', 0),
    
    'Refresher': new Item((player, otherPlayer, target, isBattling) => {
        return true;
    }, (player, otherPlayer, target) => { 
        let caught = player;
        if(tag(player) == 'user') {
            caught = User.party(player, target);
        } else if(tag(player) == 'trainer') {
            caught = player.caught[target];
        }
        Caught.restorePP(caught);
        return [`${caught.nickname} reset its PP values, and can now use all of its moves to their maximum capacity.`, false];
    }, true, 'Using a Refresher on your Discit will reset the amount of times it can use each attack, which makes it very useful for long journeys.', 125),
    
    'Discit magnet': new Item((player, otherPlayer, target, isBattling) => {
        if(isBattling) {
            return false;
        }
        if(player.namedLocation == 'Discit Station') {
            return false;
        }
        return true;
    }, (player, otherPlayer, target) => { 
        User.increaseRate(player);
        return [`The Discit magnet dramatically increased your chance of finding wild enemies!`, false];
    }, false, 'Using a Discit magnet will increase your chance of finding wild Discits, although it resets once you set foot in a Discit Station. If you use enough of these, finding enemies will be guaranteed!', 100),
    
    'Trainer\'s formula': new Item((player, otherPlayer, target, isBattling) => {
        if(isBattling) {
            return false;
        }
        return true;
    }, (player, otherPlayer, target) => {
        let caught = player;
        if(tag(player) == 'user') {
            caught = User.party(player, target);
        } else if(tag(player) == 'trainer') {
            caught = player.caught[target];
        }
        Caught.gainEVs(caught, [8, 8, 8, 8, 8, 8]);
        User.recalcAll(player);
        return [`${caught.nickname} became more experienced on the battlefield, and with that came a slight increase in base stats.`, false];
    }, true, 'This formula ups the effect of how much effort a Discit has put in so far. You can use \'stats\' to check out these values more accurately.', 0),
    
    'Experimental serum': new Item((player, otherPlayer, target, isBattling) => {
        if(isBattling) {
            return false;
        }
        if(tag(player) == 'trainer') {
            return false;
        }
        return true;
    }, (player, otherPlayer, target) => {
        let realDiscits = []; // Discit[]
        let indices = [];
        for(let i = 0; i < player._party.length; i++) { // 1-pikachu   3-growlithe   4-minccino
            if(player._party[i] != -1) {
                realDiscits.push(User.party(player, i)._base); // realDiscits: [pikachu, growlithe, minccino]
                indices.push(i); // indices: [1, 3, 4]
            }
        }
        let returning = 'Due to the effects of the serum, ...\n';
        realDiscits.push(realDiscits[0]);
        realDiscits.splice(0, 1);
        for(let i = 0; i < indices.length; i++) {
            Caught.setBase(User.party(player, indices[i]), realDiscits[i]);
            returning += `\nDiscit #${indices[i] + 1} became a Discit of type *${realDiscits[i]}*!`;
        }
        return [returning, false];
    }, false, 'Use at your own risk! The experimental serum permanently affects the Discits in your party, and there\'s no telling what it\'ll do...', 0),
    
    'Last resort': new Item((player, otherPlayer, target, isBattling) => {
        if(!isBattling) {
            return false;
        }
        let caught = player;
        if(tag(player) == 'user') {
            caught = User.party(player, target);
        } else if(tag(player) == 'trainer') {
            caught = player.caught[target];
        }
        if(caught.temphp / caught.stats[5] > .1) {
            return false;
        }
        return true;
    }, (player, otherPlayer, target) => {
        let caught = player;
        if(tag(player) == 'user') {
            caught = User.party(player, target);
        } else if(tag(player) == 'trainer') {
            caught = player.caught[target];
        }
        Caught.takeDamage(caught, -40);
        Caught.statChange(caught, 0, 4);
        return [`${caught.nickname} gained 40 health as a last resort! Its attack also rose quite sharply!`, false];
    }, true, 'While this item is very potent, it can only be used when the selected Discit has almost no health remaining. To be precise, anything more than 10% health makes this item completely useless.', 200),
    
    'Resistance module': new Item((player, otherPlayer, target, isBattling) => {
        if(!isBattling) {
            return false;
        }
        return true;
    }, (player, otherPlayer, target) => {
        let caught = player;
        if(tag(player) == 'user') {
            caught = User.party(player, target);
        } else if(tag(player) == 'trainer') {
            caught = player.caught[target];
        }
        let returning = 'Due to the effects of the resistance module...\n';
        const stats = ['attack', 'defense', 'special attack', 'special defense', 'speed', 'evasiveness', 'accuracy'];
        for(let i = 0; i < caught.effects.length + 1; i++) {
            const random = Math.floor(Math.random() * stats.length);
            Caught.statChange(caught, random, 1);
            returning += `\n${caught.nickname}'s ${stats[random]} increased slightly!`;
        }
        return [returning, false];
    }, true, 'Unlike some of the other modules, the resistance module\'s effectiveness increases with how badly the target is injured. For every effect they are inflicted with, the module raises one extra stat.', 0),
    
    'Mirror': new Item((player, otherPlayer, target, isBattling) => {
        if(!isBattling) {
            return false;
        }
        return true;
    }, (player, otherPlayer, target) => {
        let caught = player;
        if(tag(player) == 'user') {
            caught = User.party(player, target);
        } else if(tag(player) == 'trainer') {
            caught = player.caught[target];
        }
        let other = otherPlayer;
        if(tag(otherPlayer) == 'user') {
            other = User.party(otherPlayer, otherPlayer.equipped);
        } else if(tag(otherPlayer) == 'trainer') {
            other = otherPlayer.caught[otherPlayer.equipped];
        }
    
        for(let i = 0; i < caught.tempstats.length; i++) {
            Caught.statChange(other, i, caught.tempstats[i] - other.tempstats[i]);
        }
        Caught.resetEffects(other);
        for(let i = 0; i < caught.effects.length; i++) {
            Caught.effect(other, caught.effects[i], caught);
        }
    
        return [`The Mirror reflected ${caught.nickname}'s effects and temporary stats to ${other.nickname}!`, false];
    }, true, 'This item is very hard to come by, and for a good reason. The Mirror automatically copies all of your Discit\'s effects and stat changes onto the opposing Discit, and it completely levels the playing field.', 1000),
    
    'Warp ring': new Item((player, otherPlayer, target, isBattling) => {
        return true;
    }, (player, otherPlayer, target) => {
        return ['To use this item, try the \'warp\' command (\'help\' for more information).', false];
    }, false, 'The Warp ring gives you access to any area of the map in an instant. Just use the \'warp\' command and let it know where you want to go!', -1),
    
    'Water medal': new Item((player, otherPlayer, target, isBattling) => {
        return true;
    }, (player, otherPlayer, target) => {
        return ['This isn\'t a usable item!', false];
    }, false, 'A prize for completing the very first arena!', -1),
    
    'Fire medal': new Item((player, otherPlayer, target, isBattling) => {
        return true;
    }, (player, otherPlayer, target) => {
        return ['This isn\'t a usable item!', false];
    }, false, 'A prize for completing the second arena!', -1),
    
    'Grass medal': new Item((player, otherPlayer, target, isBattling) => {
        return true;
    }, (player, otherPlayer, target) => {
        return ['This isn\'t a usable item!', false];
    }, false, 'A prize for completing the third arena!', -1),
    
    'Flying medal': new Item((player, otherPlayer, target, isBattling) => {
        return true;
    }, (player, otherPlayer, target) => {
        return ['This isn\'t a usable item!', false];
    }, false, 'A prize for completing the fourth arena!', -1),
    
    'Poison medal': new Item((player, otherPlayer, target, isBattling) => {
        return true;
    }, (player, otherPlayer, target) => {
        return ['This isn\'t a usable item!', false];
    }, false, 'A prize for completing the fifth arena!', -1),
    
    'Electric medal': new Item((player, otherPlayer, target, isBattling) => {
        return true;
    }, (player, otherPlayer, target) => {
        return ['This isn\'t a usable item!', false];
    }, false, 'A prize for completing the last arena! Now go fight the final boss!', -1),
    
    'Fire key': new Item((player, otherPlayer, target, isBattling) => {
        return true;
    }, (player, otherPlayer, target) => {
        return ['This isn\'t a usable item!', false];
    }, false, 'A key that can be used somewhere in the second arena...', -1),
    
    'Water key [Special Edition]': new Item((player, otherPlayer, target, isBattling) => {
        return true;
    }, (player, otherPlayer, target) => {
        return ['This isn\'t a usable item!', false];
    }, false, 'A key that can be used somewhere special in the first arena...', -1),
    
    'Water key': new Item((player, otherPlayer, target, isBattling) => {
        return true;
    }, (player, otherPlayer, target) => {
        return ['This isn\'t a usable item!', false];
    }, false, 'A key that can be used somewhere in the first arena...', -1)    
};

module.exports = items;
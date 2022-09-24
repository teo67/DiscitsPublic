const Trigger = require('../classes/cls_trigger');
const prefix = require('./fundamentals').prefix;
const items = require('./items');
const Caught = require('../classes/cls_caught');
const User = require('../classes/cls_user');

const triggerTiles = [
    new Trigger([[197, 116], [198, 116], [199, 116], [188, 125], [208, 125], [188, 126], [208, 126], [188, 127], [208, 127]], ['Professor Purple: Hey! Over here!'], (user, index) => {
        User.setCoords(user, 198, 137);              
    }),
    new Trigger([[201, 82]], ['You feel a brilliant flash of light as you are transported to a remote location...'], (user, index) => {
        User.setLocation(user, 'Arena 3');
        User.setCoords(user, 87, 153);
    }),
    new Trigger([[155, 163], [156, 163]], ['Whoa there! Make sure you equip *Thump* and party your Discit before leaving the station (hint: use \'d!list\' to start).'], (user, index) => {
        User.respawn(user);
    }),
    new Trigger([[150, 183], [150, 184]], ['Mom: Get over here!'], (user, index) => {
        User.setCoords(user, 145, 180);
    }),
    new Trigger([[355, 186]], ['You feel a brilliant flash of light as you are transported to a remote location...'], (user, index) => {
        User.setLocation(user, 'Arena 5');
        User.setCoords(user, 45, 173);
    }),
    new Trigger([[265, 165]], ['You feel a brilliant flash of light as you are transported to a remote location...'], (user, index) => {
        User.setLocation(user, 'Arena 4');
        User.setCoords(user, 223, 216);
    }),
    new Trigger([[98, 99]], ['You feel a brilliant flash of light as you are teleported to a remote location...'], (user, index) => {
        User.setLocation(user, 'Arena 2');
        User.setCoords(user, 102, 198);
    }),
    new Trigger([[197, 122], [198, 122], [199, 122], [194, 125], [202, 125], [194, 126], [202, 126], [194, 127], [202, 127], [197, 130], [198, 130], [199, 130]], ['All right, trainer! It looks like you\'re all registered to partake in the arena battle system. Give me one second while I send you to the arena - it\'s quite far away.', '...'], (user, index) => {
        User.setLocation(user, 'Arena 1');
        User.setCoords(user, 168, 235);
    }),
    new Trigger([[386, 97]], ['You feel a brilliant flash of light as you are teleported to a remote location...'], (user, index) => {
        User.setLocation(user, 'Arena 6');
        User.setCoords(user, 58, 261);
    }),
    new Trigger([[323, 74], [323, 75], [323, 76], [323, 77], [323, 78], [323, 79], [323, 80], [323, 81], [323, 82], [323, 83], [323, 84]], ['Welcome, trainer! You\'ve made it so far, and there are thousands in the audience watching you today!', 'If you defeat the esteemed champion once and for all, you will be regarded as the new champion of Dieze! Plus, you\'ll have the once in a lifetime opportunity of catching the prize Discit.', 'The trainer is just a few steps away. Good luck!'], (user, index) => {
        User.blacklistTrigger(user, index);
    }),
    new Trigger([[87, 78], [87, 79], [87, 80], [87, 81], [87, 82], [375, 112], [375, 113], [175, 127], [177, 127], [291, 147], [291, 148], [155, 158], [156, 158], [361, 215], [371, 215], [361, 216], [371, 216]], ['Hi there! Allow us to restore the health of your Discits! (Press OK)', '🔷🔷🔷🔷🔷🔷 🟩\n\nAll done! Enjoy your adventure.'], (user, index) => {
        User.reviveAll(user);
    }),
    new Trigger([[223, 78], [223, 79], [223, 80]], ['Congratulations on beating the game! All that\'s left to do is catch every Discit out there! Oh, and don\'t forget to try battling your friends once or twice.\nHave fun out there!\n\n~ The Devs', 'Discit Company Employee: Nice job out there! From here on out, you can teleport to anywhere you want using this Warp ring. Just use the warp command - I\'m sure we\'ll meet again, champion.', 'You obtained a Warp ring!'], (user, index) => {
        User.gainItem(user, 'Warp ring', 1);
        User.blacklistTrigger(user, index);
    }),
    new Trigger([[245, 78], [245, 79], [245, 80]], ['Well done, trainer! You are now the official champion of Dieze! Ahead of you lies an opportunity that many trainers only dream of. Prizeri, or the Prize Discit, is a unique Discit that is handed down through champions. Using the Gift box that was in one of the champion reward slots, you should be able to catch it once and for all. Good luck!', 'Oh, and by the way, Prizeri is kinda shy. It might take a few tries moving in and out of the grass to find him!'], (user, index) => {
        User.blacklistTrigger(user, index);
    }),
    new Trigger([[364, 78], [364, 79], [364, 80]], ['Professor Purple: Well, trainer, this is it. You\'ve made it this far, and now it\'s all up to you. And don\'t worry, I won\'t give you a huge lecture this time. See you on the other side!'], (user, index) => {
        User.makeProgress(user);
        User.blacklistTrigger(user, index);
    }),
    new Trigger([[366, 78], [366, 79], [366, 80]], [], (user, index) => {
        User.setLocation(user, 'Final Stage');
    }),
    new Trigger([[367, 78], [367, 79], [367, 80], [381, 110], [381, 111], [381, 112], [381, 113], [381, 114], [381, 115], [383, 177], [384, 177], [385, 177], [386, 177], [387, 177], [388, 177], [389, 177]], [], (user, index) => {
        User.setLocation(user, 'Route 6');
    }),
    new Trigger([[96, 79], [96, 80], [96, 81], [180, 87], [180, 88], [180, 89], [214, 92], [214, 93], [214, 94], [380, 110], [380, 111], [380, 112], [380, 113], [380, 114], [380, 115], [173, 132], [174, 132], [178, 132], [179, 132], [286, 145], [286, 146], [286, 147], [286, 148], [286, 149], [286, 150], [155, 162], [156, 162], [364, 212], [365, 212], [366, 212], [367, 212], [368, 212], [364, 219], [365, 219], [366, 219], [367, 219], [368, 219]], [], (user, index) => {
        User.setLocation(user, 'Discit Station');
        User.setRespawn(user);
    }),
    new Trigger([[97, 79], [97, 80], [97, 81], [97, 83], [98, 83], [99, 83], [179, 87], [179, 88], [179, 89]], [], (user, index) => {
        User.setLocation(user, 'Route 3');
    }),
    new Trigger([[233, 79], [235, 79]], [], (user, index) => {
        if(user.progression < 10) {
            if((() => {
                for(let i = 0; i < user.caught.length; i++) {
                    if(user.caught[i]._base == 'Prizeri') {
                        return true;
                    }
                }
                return false;
            })()) {
                User.makeProgress(user);
                User.setLocation(user, 'Final Stage');
            } else {
                User.setLocation(user, 'Route 7');
            }
        } else {
            User.setLocation(user, 'Final Stage');
        }
    }),
    new Trigger([[232, 79], [236, 79]], [], (user, index) => {
        User.setLocation(user, 'Final Stage');
    }),
    new Trigger([[98, 84], [99, 84]], ['Whoa there! Mandatory medal check - scanning for Fire medal...'], (user, index) => {
        if(user.inventory.includes('Fire medal')) {
            User.blacklistTrigger(user, index);
        } else {
            User.setCoords(user, user.location[0], 85);
        }
    }),
    new Trigger([[187, 84]], ['Hey there! We\'re glad to have you at the Discit Station! Everyone here is very dedicated to improving their healing abilities, so I\'ll do the best I can on your Discits. Have fun!'], (user, index) => {
        User.reviveAll(user);
    }),
    new Trigger([[203, 84]], ['Trainer, the third arena is just ahead! Be wary that the opponents inside these doors tend to use grass-type Discits, so change your party accordingly.', 'The teleporter is just ahead - good luck!'], (user, index) => {
        User.reviveAll(user);
        User.blacklistTrigger(user, index);
    }),
    new Trigger([[97, 85], [98, 85], [99, 85], [168, 116], [168, 117], [168, 118], [173, 133], [174, 133]], [], (user, index) => {
        User.setLocation(user, 'Route 2');
    }),
    new Trigger([[185, 87], [185, 88], [185, 89]], ['Welcome to the Discit Station! Just so you know, this unique location in Dieze also serves as an Arena Center - that is, you can enter the next arena from here.', 'I\'ll heal your Discits for you so you\'re prepared.'], (user, index) => {
        User.reviveAll(user);
        User.blacklistTrigger(user, index);
    }),
    new Trigger([[207, 87], [207, 88], [207, 89]], ['Hold on one sec while I make sure you have the Grass medal...'], (user, index) => {
        if(user.inventory.includes('Grass medal')) {
            User.blacklistTrigger(user, index);
        } else {
            User.setCoords(user, 206, user.location[1]);
        }
    }),
    new Trigger([[386, 90], [387, 90]], ['Mind if I check for that Electric medal? You know how it goes.'], (user, index) => {
        if(user.inventory.includes('Electric medal')) {
            User.blacklistTrigger(user, index);
        } else {
            User.setCoords(user, user.location[0], 91);
        }
    }),
    new Trigger([[215, 92], [215, 93], [215, 94], [285, 145], [285, 146], [285, 147], [285, 148], [285, 149], [285, 150], [285, 185], [285, 186], [285, 187]], [], (user, index) => {
        User.setLocation(user, 'Route 4');
    }),
    new Trigger([[191, 93]], ['Whaddup! I\'m Alex, an amateur healing trainer. So, I hear you\'re going for champion of Dieze! That\'s quite a feat, so be careful out there.', '*Your Discits were healed to full health.*'], (user, index) => {
        User.reviveAll(user);
        User.blacklistTrigger(user, index);
    }),
    new Trigger([[201, 93]], ['Howdy, neighbor! Gimme one second while I heal up those Discits...'], (user, index) => {
        User.reviveAll(user);
    }),
    new Trigger([[98, 97], [96, 99], [100, 99], [98, 101]], ['Trainer! I remember seeing you when I was in the audience in that first arena. You looked good out there - now go show these fire trainers what you got!'], (user, index) => {
        User.blacklistTrigger(user, index);
    }),
    new Trigger([[381, 102], [382, 102], [383, 102], [384, 102], [385, 102], [386, 102], [387, 102], [388, 102], [389, 102], [390, 102], [391, 102]], ['The electric-type arena is just around the corner! Good luck out there, trainer.', '*You received an Insulator!*'], (user, index) => {
        User.gainItem(user, 'Insulator', 1);
        User.blacklistTrigger(user, index);
    }),
    new Trigger([[97, 109], [98, 109], [99, 109]], ['Professor Purple: We meet again, trainer. I see you\'ve already beaten the water arena, but are you ready to take on these ferocious fire types? Here, at least take some healing items'], (user, index) => {
        User.makeProgress(user);
        User.gainItem(user, 'Slurpee', 1);
        User.gainItem(user, 'Water', 1);
        User.blacklistTrigger(user, index);
    }),
    new Trigger([[104, 113]], ['You begin to spin faster and faster, and your vision is getting blurry...'], (user, index) => {
        User.setCoords(user, 144, 115);
    }),
    new Trigger([[144, 115], [145, 115], [144, 116], [145, 116]], ['You begin to spin faster and faster, and your vision is getting blurry...'], (user, index) => {
        User.setCoords(user, 104, 113);
    }),
    new Trigger([[185, 116], [185, 117], [185, 118], [178, 133], [179, 133], [183, 166], [183, 167]], [], (user, index) => {
        User.setLocation(user, 'Route 1');
    }),
    new Trigger([[383, 116], [384, 116], [385, 116], [386, 116], [387, 116], [388, 116], [389, 116], [390, 116]], ['You only have one major arena left, and then it\'s time for the final champion challenge. Get out there and give it your all! What matters is the effort!'], (user, index) => {
        User.blacklistTrigger(user, index);
    }),
    new Trigger([[178, 117], [178, 118], [178, 119]], ['Yo! I\'m Marjorie, a news reporter for the Discit Times. Got time for an interview?', 'Just kidding, I know you\'re probably in a hurry to be the champion or whatever. Anyway, here\'s a little gift from me to keep you going.', '*You received some Refreshers!*'], (user, index) => {
        User.gainItem(user, 'Refresher', 5);
        User.blacklistTrigger(user, index);
    }),
    new Trigger([[184, 117], [184, 118]], ['Hey, trainer! Mind if I check if you have that Water medal? Ya see, this is a checkpoint that can only be crossed once you beat that first arena...'], (user, index) => {
        if(user.inventory.includes('Water medal')) {
            User.blacklistTrigger(user, index);
        } else {
            User.setCoords(user, 185, user.location[1]);
        }
    }),
    new Trigger([[192, 119], [191, 120], [192, 120]], ['Wassup dawg! How\'s that arena treating you? If you haven\'t tried it yet, head over to those assistants in the center.'], (user, index) => {
        User.blacklistTrigger(user, index);             
    }),
    new Trigger([[197, 136], [198, 136], [199, 136]], ['Professor Purple: Glad to see you made it out of Route 1. I\'ve made sure that you\'re all registered and ready to go for the Arena Battle System (ABS). ', 'There are six arenas spread out around the region of Dieze. Ahead of you lies the first one, and you will have the chance to become the new champion of Dieze after beating the last.', 'Good luck, trainer! Oh, and just so you know, this arena is water-themed.'], (user, index) => {
        User.makeProgress(user);
        User.blacklistTrigger(user, index);
        User.blacklistTrigger(user, 0); // first element of list makes you teleport to professor near arena 1
    }),
    new Trigger([[280, 147], [280, 148], [280, 149], [281, 150], [282, 150], [283, 150], [284, 150]], ['How ya doin\', trainer? I\'m a friend of the Professor, you see - so I\'ve heard about your journey so far.', 'I just wanted to congratulate you on comin\' this far, and here\'s a little something to remember me by ~', '*You received a Magic elixir!*'], (user, index) => {
        User.gainItem(user, 'Magic elixir', 1);
        User.blacklistTrigger(user, index);            
    }),
    new Trigger([[124, 149]], ['Whoa! You and your Discits were showered with a volley of poison darts, and everyone was affected with *poisoned*...'], (user, index) => {
        for(let i = 0; i < 6; i++) {
            if(user._party[i] != -1 && User.party(user, i).temphp > 0 && !User.party(user, i).effects.includes('poisoned')) {
                Caught.effect(User.party(user, i), 'poisoned', null);
            }
        }
        User.blacklistTrigger(user, index);
    }),
    new Trigger([[110, 150]], ['A trapdoor opened up, and one of your Discits fell in! They took 10 damage...'], (user, index) => {
        let lowest = null;
        for(let i = 0; i < 6; i++) {
            if(user._party[i] != -1 && User.party(user, i).temphp > 0 && (!lowest || User.party(user, i).temphp < lowest.temphp)) {
                lowest = User.party(user, i);
            }
        }
        if(lowest) {
            Caught.takeDamage(lowest, 10);
        }
        User.blacklistTrigger(user, index);
    }),
    new Trigger([[97, 151]], ['As you walk along, a rat scurries across the floor and steals a bunch of your water bottles! You find yourself missing a few healing items'], (user, index) => {
        User.loseItem(user, 'Water', 3);
        User.blacklistTrigger(user, index);
    }),
    new Trigger([[97, 155]], ['You notice a tiny mouse running along the wall, and it looks harmless. But it quickly jumps off and rips a hole in your coin pouch - you end up losing about 500 coins.'], (user, index) => {
        User.loseCoins(user, 500);
        User.blacklistTrigger(user, index);
    }),
    new Trigger([[110, 156]], ['A penny bomb goes off on the floor, and all of your Discits take 5 damage! It\'s not looking too good...'], (user, index) => {
        for(let i = 0; i < 6; i++) {
            if(user._party[i] != -1 && User.party(user, i).temphp > 0) {
                Caught.takeDamage(User.party(user, i), 5);
            }
        }
        User.blacklistTrigger(user, index);
    }),
    new Trigger([[124, 157]], ['Your pants catch on fire, probably because of the dripping oil from the ceiling. As a result, all of your Discits are affected with *burned*.'], (user, index) => {
        for(let i = 0; i < 6; i++) {
            if(user._party[i] != -1 && User.party(user, i).temphp > 0 && !User.party(user, i).effects.includes('burned')) {
                Caught.effect(User.party(user, i), 'burned', null);
            }
        }
        User.blacklistTrigger(user, index);
    }),
    new Trigger([[154, 158], [153, 159], [155, 159], [154, 160]], ['Purple: Ah, I see you\'ve made your decision. You\'ll have plenty of opportunities to catch more Discits, so it\'s not a big deal if you regret your choice.', 
    'Purple: Anyway, the building we\'re in right now is called a *Discit Station*, and you\'ll probably find a bunch of them along your journey.', 
    'Purple: Every Discit Station has clerks at the back, so feel free to talk to them and heal up your Discits anytime.',
    'Purple: In any case, the next step is to *select* your new Discit so that you can modify it and equip attacks.', 
    'Give it a try! End the dialogue and then save your data with the rightmost button. Then use \'d!list\' to select your first Discit.'], (user, index) => { 
    User.blacklistTrigger(user, index);
    User.makeProgress(user);
    }), 
    new Trigger([[264, 158], [265, 158], [266, 158], [267, 158], [268, 158], [272, 162], [272, 163], [272, 164], [272, 165], [272, 166]], ['Well, trainer, you\'re about halfway through the Arena Battle System by now. How\'re ya feeling? Good? Great! This next arena is dominated by flying-type Discits, so edit your party accordingly.'], (user, index) => {
        User.blacklistTrigger(user, index);             
    }),
    new Trigger([[154, 159]], ['??: Hi there! They call me Professor Purple, and I\'m a Discit expert!', // <--- 154, 159 is spawnpoint
    'Purple: Today, we\'ll be going through the ropes of what it means to be a...\n\n**Discit Trainer!**', 
    `Purple: First, please use ${prefix}choose to pick out your starter Discit.\nOnce you\'re done, you can use 'map' again to enter the game!`], (user, index) => { 
        //console.log(user);
        User.blacklistTrigger(user, index);
        User.makeProgress(user);
    }), 
    new Trigger([[111, 163], [111, 167]], [], (user, index) => {
        User.setCoords(user, 110, 165); // tp to arena 3 boss arena (dont blacklist in case they die to boss and go thru arena again)
    }),
    new Trigger([[114, 163]], ['A panel slides out on the wall, and... wait! Nothing bad is happening this time!', 'Instead, a little old man hops out and fully heals one of your Discits!', '*Note: This won\'t work on a Discit that has fainted already.*'], (user, index) => {
        let chosen = null;
        for(let i = 0; i < 6 && !chosen; i++) {
            if(user._party[i] != -1 && User.party(user, i).temphp > 0) {
                chosen = User.party(user, i);
            }
        }
        User.blacklistTrigger(user, index);
        if(!chosen) {
            return;
        }
        Caught.restorePP(chosen);
        Caught.resetEffects(chosen);
        Caught.reset(chosen);
        Caught.takeDamage(chosen, chosen.temphp - chosen.stats[5]);
        return;
    }),
    new Trigger([[119, 163]], ['You find a quarter on the ground, and it\'s marked with heads on both sides! You aren\'t sure what happened, maybe you should do \'party\'...'], (user, index) => {
        const everything = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890';
        for(let i = 0; i < 6; i++) {
            if(user._party[i] != -1) {
                let nick = '';
                for(let j = 0; j < 8; j++) {
                    nick += everything[Math.floor(Math.random() * everything.length)];
                }
                Caught.setNickname(User.party(user, i), nick);
            }
        }
        User.blacklistTrigger(user, index);
    }),
    new Trigger([[155, 164], [156, 164], [170, 166], [170, 167]], [], (user, index) => {
        User.setLocation(user, 'Twigtown');
    }), 
    new Trigger([[95, 165]], ['You are swiftly warped back to the Arena Center on Route 3, where the next route is waiting!'], (user, index) => {
        User.blacklistTrigger(user, 1); // second element is how you tp to arena 3
        User.blacklistTrigger(user, index);
        User.gainItem(user, 'Grass medal', 1);
        User.setCoords(user, 201, 82);
        User.setLocation(user, 'Discit Station');
    }), 
    new Trigger([[155, 165], [156, 165]], ['Purple: Nice job! I see you and your starter Discit are ready to go!',
    'Purple: If you look on your map, you\'ll notice green tiles scattered around. Whenever you step onto a green tile, you have a chance of encountering a wild Discit!', 
    'Purple: While this may seem like just an obstacle, it\'s also an opportunity to expand your collection.', 
    'Purple: When you enter combat with another Discit, you\'ll have about a minute to DM the bot per attack. Every turn, you have three options: attacking, using an item, or swapping out for another Discit in your party.', 
    'Purple: The bot will help walk you through this once you\'re actually in combat, so I won\'t waste your time with a lengthy explanation.',
    'Purple: That\'s all from me! When you think you have enough Discits in your party, head on over to the nearby *Arena*!\n\n*You picked up 10 Shoeboxes!*'], (user, index) => {
        User.blacklistTrigger(user, index);
        User.makeProgress(user);
        User.gainItem(user, 'Shoebox', 10);
    }), 
    new Trigger([[255, 166], [255, 167], [255, 168], [255, 169], [255, 170], [255, 171], [255, 172], [255, 173], [255, 174], [256, 175], [257, 175], [258, 175], [259, 175], [260, 175], [261, 175], [262, 175], [263, 175], [264, 175]], ['Hey, trainer! This is a mandatory medal check station for Flying-type Discits, give me one minute...'], (user, index) => {
        if(user.inventory.includes('Flying medal')) {
            User.blacklistTrigger(user, index);
        } else {
            User.setCoords(user, 265, 165);
        }
    }),
    new Trigger([[114, 167]], ['A shadow of what looks like a genie pops up on the ceiling, and to you it utters these words: ', '*Traveler, you look weary. Hold still while I double the contents of something you hold most dearly.*', '*Note: This will only work on items that are or were available in the shop.*'], (user, index) => {
        let found = -1;
        for(let i = 0; i < user.inventory.length && found == -1; i++) {
            if(items[user.inventory[i]].price > 0) {
                found = i;
            }
        }
        User.blacklistTrigger(user, index);
        if(found == -1) {
            return;
        }
        User.gainItem(user, user.inventory[found], user.amounts[found]);
    }), 
    new Trigger([[119, 167]], ['You find a bowl of fruit on the ground, and each of your Discits takes a bite. Something strange is happening...'], (user, index) => {
        const fruits = ['apple', 'banana', 'orange', 'mango', 'blueberry', 'strawberry']
        for(let i = 0; i < 6; i++) {
            if(user._party[i] != -1) {
                Caught.setNickname(User.party(user, i), fruits[i]);
            }
        }
        User.blacklistTrigger(user, index);
    }),
    new Trigger([[383, 178], [384, 178], [385, 178], [386, 178], [387, 178], [388, 178], [389, 178], [286, 185], [286, 186], [286, 187], [364, 211], [365, 211], [366, 211], [367, 211], [368, 211], [364, 220], [365, 220], [366, 220], [367, 200], [368, 220]], [], (user, index) => {
        User.setLocation(user, 'Route 5');
    }),
    new Trigger([[145, 181], [146, 181]], ['Mom: Hey honey! I\'m so excited that you\'re finally setting off to work on catching Discits!', 'You\'ll need a little pocket money, so take this on the road with you.', '*You received 1500 coins!*'], (user, index) => {
        User.getCoins(user, 1500);
        User.blacklistTrigger(user, 3); // index of mom telling you to get back here!
        User.blacklistTrigger(user, index);
    }),
    new Trigger([[360, 184], [360, 185], [360, 186], [360, 187], [360, 188]], ['The Arena teleportation station is just ahead! Right this way, trainer!'], (user, index) => {
        User.blacklistTrigger(user, index);
    }),
    new Trigger([[380, 185], [380, 186], [380, 187]], ['It\'s me again, checking to make sure you have that Poison medal...'], (user, index) => {
        if(user.inventory.includes('Poison medal')) {
            User.blacklistTrigger(user, index);
        } else {
            User.setCoords(user, 379, user.location[1]);
        }
    }),
    new Trigger([[361, 195], [362, 195], [363, 195], [364, 195], [365, 195], [366, 195], [367, 195], [368, 195], [369, 195], [370, 195], [371, 195]], ['Get excited! This is the Arena Center on Route 5, the location where you too can enter the famous Poison Arena!!!', 'Just go to the nearby teleporter and you\'ll have access to battles with famous trainers from around the globe!'], (user, index) => {
        User.blacklistTrigger(user, index);
    }),
    new Trigger([[24, 199], [24, 200]], ['You are swiftly warped back to the Arena Center on Route 5, where the next route is waiting!'], (user, index) => {
        User.blacklistTrigger(user, 4); // fifth element is how you tp to arena 5
        User.blacklistTrigger(user, index);
        User.gainItem(user, 'Poison medal', 1);
        User.setCoords(user, 355, 186);
        User.setLocation(user, 'Route 5');
    }), 
    new Trigger([[249, 200], [250, 200]], ['You are swiftly warped back to the Arena Center on Route 4, where the next route is waiting!'], (user, index) => {
        User.blacklistTrigger(user, 5); // sixth element is how you tp to arena 4
        User.blacklistTrigger(user, index);
        User.gainItem(user, 'Flying medal', 1);
        User.setCoords(user, 265, 165);
        User.setLocation(user, 'Route 4');
    }), 
    new Trigger([[87, 205]], ['Whoa there! To pass through here, you\'ll need to have a Fire key on you! Give me a sec to check out your inventory...'], (user, index) => {
        if(user.inventory.includes('Fire key')) {
            User.blacklistTrigger(user, index);
            User.loseItem(user, 'Fire key');
        } else {
            User.setCoords(user, 87, 204);
        }
    }),
    new Trigger([[107, 207]], ['You found... Wait a second, that\'s not an item! The ceiling begins to cave in, but you are able to make a narrow escape.', '*All of your Discits take 10 damage.*'], (user, index) => {
        for(let i = 0; i < 6; i++) {
            if(user._party[i] != -1 && User.party(user, i).temphp > 0) {
                Caught.takeDamage(User.party(user, i), 10);
            }
        }
        User.blacklistTrigger(user, index);
    }),
    new Trigger([[364, 210], [365, 210], [366, 210], [367, 210], [368, 210]], ['Ahoy there, trainer! This here\'s the Arena Center on Route 5, so ya\'d better be prepared!', 'First off, make sure you have yer best Discits equipped that can deal with Poison-Types! This is because all the trainers in this here arena use... you guessed it... Poison-Type Discits!', 'When you complete the Arena and teleport back here, you\'ll receive a medal for doing so! Good luck!'], (user, index) => {
        User.blacklistTrigger(user, index);
    }),
    new Trigger([[87, 216]], ['You are swiftly warped back to the Arena Center on Route 2, where the next route is waiting!'], (user, index) => {
        User.blacklistTrigger(user, 6); // seventh element is how you tp to arena 2
        User.blacklistTrigger(user, index);
        User.gainItem(user, 'Fire medal', 1);
        User.setCoords(user, 98, 99);
        User.setLocation(user, 'Route 2');
    }), 
    new Trigger([[147, 223], [148, 223], [149, 223]], ['This is a VIP access entrance only for those who possess the hidden [Special] Water key! Security check!'], (user, index) => {
        if(user.inventory.includes('Water key [Special Edition]')) {
            User.blacklistTrigger(user, index);
            User.loseItem(user, 'Water key [Special Edition]');
        } else {
            User.setCoords(user, user.location[0], 224);
        }
    }),    
    new Trigger([[146, 226], [147, 226], [148, 226]], ['This is a VIP access entrance only for those who possess the hidden [Special] Water key! Security check!'], (user, index) => {
        if(user.inventory.includes('Water key [Special Edition]')) {
            User.blacklistTrigger(user, index);
            User.loseItem(user, 'Water key [Special Edition]');
        } else {
            User.setCoords(user, user.location[0], 225);
        }
    }),   
    new Trigger([[197, 227], [198, 227]], ['You are swiftly warped back to the Arena Center on Route 1, where the next route is waiting!'], (user, index) => {
        User.blacklistTrigger(user, 7); // eighth element is how you tp to arena 1
        User.blacklistTrigger(user, index);
        User.gainItem(user, 'Water medal', 1);
        User.setCoords(user, 198, 133);
        User.setLocation(user, 'Route 1');
    }), 
    new Trigger([[171, 235]], ['Hey trainer, thanks for checking in. You have just entered the very first Arena built in Dieze!', 'We hope you enjoy your stay, and make sure to leave and collect your rewards after defeating the final boss!'], (user, index) => {
        User.blacklistTrigger(user, index);
    }), 
    new Trigger([[178, 238]], ['Beep boop... scanning for Water key! If you don\'t have it yet, try searching elsewhere in the arena!'], (user, index) => {
        if(user.inventory.includes('Water key')) {
            User.blacklistTrigger(user, index);
            User.loseItem(user, 'Water key');
        } else {
            User.setCoords(user, 177, 238);
        }
    }),  
    new Trigger([[246, 242]], ['You found an Apple! As you reach over to pick it up, you feel a presence behind you.', 'You turn around, only to find an empty room... This *confuses* one of your Discits.'], (user, index) => {
        User.blacklistTrigger(user, index);
        for(let i = 0; i < 6; i++) {
            if(user._party[i] != -1 && User.party(user, i).temphp > 0) {
                Caught.effect(User.party(user, i), 'confused', null);
                return;
            }
        }
    }),
    new Trigger([[95, 255]], ['You are swiftly warped back to the Arena Center on Route 6, where the champion of Dieze is waiting for you!'], (user, index) => {
        User.blacklistTrigger(user, 8); // ninth element is how you tp to arena 6
        User.blacklistTrigger(user, index);
        User.gainItem(user, 'Electric medal', 1);
        User.setCoords(user, 386, 97);
        User.setLocation(user, 'Route 6');
    })
];

const itemLocations = [[119, 59], [293, 68], [293, 70], [293, 72], [142, 74], [293, 74], [164, 75], [293, 76], [152, 78], [293, 78],
 [293, 80], [293, 82], [119, 83], [144, 84], [293, 84], [135, 86], [162, 86], [293, 86], [293, 88], [293, 90], 
 [115, 97], [117, 99], [119, 101], [118, 103], [271, 103], [275, 103], [279, 103], [128, 114], [128, 117], [271, 119], 
 [245, 120], [256, 124], [363, 124], [409, 124], [361, 126], [411, 126], [158, 130], [247, 135], [239, 136], [180, 146], 
 [141, 151], [153, 152], [171, 154], [362, 154], [410, 154], [171, 161], [97, 164], [410, 165], [97, 166], [361, 172],
 [299, 173], [363, 174], [60, 175], [140, 182], [46, 185], [87, 190], [185, 193], [262, 193], [31, 197], [31, 199], 
 [31, 201], [249, 203], [251, 203], [248, 204], [250, 204], [99, 207], [101, 207], [103, 207], [105, 207], [293, 207], 
 [162, 209], [324, 210], [85, 214], [87, 214], [89, 214], [146, 220], [300, 220], [196, 223], [198, 223], [200, 223], 
 [355, 224], [155, 226], [184, 227], [325, 227], [147, 228], [187, 229], [144, 236], [297, 238], [250, 242], [194, 250], 
 [63, 256], [93, 257], [95, 257], [97, 257], [190, 257], [64, 270], [86, 270]
];
const itemTypes = ['Refresher', 'Black box', 'Mirror', 'Trainer\'s formula', 'Insulator', 'Shoebox', 'Special box', 'Deep clean', 'Energy drink', 'Resistance module', 
    'Slurpee', 'Spray bottle', 'Water', 'Cleansing leaves', 'Sludgy box', 'Special attack module', 'Special defense module', 'Gift box', 'Last resort', 'Floating box', 
    'Deep clean', 'Magic elixir', 'Water', 'Last resort', 'Discit magnet', 'Magnetic box', 'Experimental serum', 'Thaw juice', 'Magnetic box', 'Speed module', 
    'Water', 'Spray bottle', 'Defense module', 'Attack module', 'Dodge module', 'Sludgy box', 'Energy drink', 'Shoebox', 'Water', 'Speed module', 
    'Water', 'Spray bottle', 'Energy drink', 'Special box', 'Slurpee', 'Trainer\'s formula', 'Mirror', 'Cleansing leaves', 'Thaw juice', 'Shoebox', 
    'Magic elixir', 'Floating box', 'Accuracy module', 'Discit magnet', 'Slurpee', 'Fire key', 'Special box', 'Deep clean', 'Resistance module', 'Black box', 
    'Trainer\'s formula', 'Energy drink', 'Cleansing leaves', 'Sludgy box', 'Attack module', 'Spray bottle', 'Thaw juice', 'Insulator', 'Cleansing leaves', 'Water', 
    'Slurpee', 'Last resort', 'Defense module', 'Special attack module', 'Special defense module', 'Magic elixir', 'Magnetic box', 'Spray bottle', 'Mirror', 'Special box', 
    'Shoebox', 'Water key [Special Edition]', 'Water', 'Deep clean', 'Accuracy module', 'Water key', 'Refresher', 'Discit magnet', 'Insulator', 'Shoebox', 
    'Insulator', 'Floating box', 'Sludgy box', 'Magnetic box', 'Thaw juice', 'Black box', 'Speed module'
];
const itemAmounts = [1, 5, 1, 3, 1, 20, 1, 1, 1, 1, 
    5, 3, 1, 1, 2, 1, 1, 1, 4, 3, 
    1, 1, 3, 1, 4, 5, 6, 2, 10, 1, 
    1, 2, 1, 2, 1, 5, 1, 3, 3, 1, 
    1, 1, 1, 3, 3, 1, 1, 2, 7, 15, 
    1, 5, 1, 1, 1, 1, 2, 2, 4, 4,
    5, 1 /* this was where the issue was */ , 2, 5, 1, 1, 1, 1, 1, 1, 
    1, 3, 3, 3, 3, 1, 2, 3, 1, 5, 
    1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 
    1, 10, 10, 10, 3, 3, 1
];

for(let i = 0; i < itemLocations.length; i++) {
    triggerTiles.push(new Trigger([itemLocations[i]], [`You found ${itemAmounts[i]} ${itemTypes[i]}(s)! *${items[itemTypes[i]].description}*`], (user, index) => {
        User.gainItem(user, itemTypes[i], itemAmounts[i]);
        User.blacklistTrigger(user, index);
    }));
}

module.exports = triggerTiles;
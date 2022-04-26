const discits = require('./discits');
const TrainerProto = require('../classes/cls_trainerproto');
const CaughtProto = require('../classes/cls_caughtproto');
//first ai return is type of attack, second is index (of attack, of item, etc), third is target for item if applicable
//attack types: 1attack, 2swap, 3item

// ai args are itself, other player

// for attack type and index, give an int 1 higher than what you want

const rect = (left, bottom, w, h) => {
    let returning = [];
    for(let i = 0; i < h; i++) {
        for(let j = 0; j < w; j++) {
            returning.push([left + j, bottom + i]);
        }
    }
    return returning;
}

const trainers = [
    new TrainerProto(
        'Tutorial-Man Theo', // name
        'To pass through here, you\'ll have to go through me!', // greeting
        [new CaughtProto( // caught(base, level, moveSet)
            'Tailick', 
            3, 
            ['Thump', 'Stare Down']
        )],
        160, // coins
        rect(154, 167, 5, 1), // triggers
        [],
        [],
        (me, you) => { // AI function(trainer object, caught object that opponent has equipped)
            if(you.tempstats[1] >= 0) {
                return [1, 2, -1];
            }
            return [1, 1, -1];
        }
    ), 
    new TrainerProto(
        'Teacher Morgan', // route 1 (1) 
        'Begin!!! This battle will not be graded!!!', 
        [new CaughtProto(
            'Sproutlet', 
            5, 
            ['Thump', 'Toughen Up', 'Sprout']
        )],
        200, 
        rect(176, 179, 1, 2),
        [],
        [],
        (me, you) => {
            if(me.caught[me.equipped].tempstats[1] <= 0) {
                return [1, 2, -1];
            }
            return [1, Math.floor(Math.random()) * 2 + 1, -1];
        }
    ), 
    new TrainerProto(
        'Rapper Harley', // route 1 (2) 
        'Mic check, mic check - is this thing on!?!?', 
        [new CaughtProto(
            'Baskett', 
            5, 
            ['First Strike']
        )],
        190, 
        rect(176, 183, 1, 2),
        [],
        [], 
        (me, you) => {
            return [1, 1, -1];
        }
    ), 
    new TrainerProto(
        'Samurai Sidney', // route 1 (3) 
        'This victory Will be mine!', 
        [new CaughtProto(
            'Droppelet', 
            4, 
            ['Weaken', 'Mist Ray']
        )],
        200, 
        rect(203, 168, 4, 1), 
        [],
        [], 
        (me, you) => {
            let random = Math.floor(Math.random() * 100);
            if(you.tempstats[0] >= -1) {
                random += 20;
            }
            if(random > 50) {
                return [1, 1, -1];
            }
            return [1, 2, -1];
        }
    ), 
    new TrainerProto(
        'Youngster Peyton', // route 1 (4) 
        'I\'ve been practicing my Discits! You\'re toast!', 
        [new CaughtProto(
            'Shocklet', 
            7, 
            ['First Strike', 'Static']
        )],
        230, 
        rect(195, 153, 1, 2), 
        [],
        [],
        (me, you) => {
            if(you.temphp / you.stats[5] < 0.5) {
                return [1, 2, -1];
            }
            return [1, 1, -1];
        }
    ), 
    new TrainerProto(
        'Trainer Sasha', // route 1 (5) 
        'One day, you\'ll be a professional Discit trainer like me! Good luck!', 
        [new CaughtProto(
            'Stormish', 
            5, 
            ['Windmill', 'Spore Plant']
        ), new CaughtProto(
            'Sunlet', 
            5, 
            ['Thump', 'Aflame']
        )],
        350, 
        rect(164, 148, 4, 1), 
        [],
        [], 
        (me, you) => {
            if(me.equipped == 0) {
                if(!you.effects.includes('leech seed')) {
                    return [1, 2, -1];
                }
                return [1, 1, -1];
            }
            if(!you.effects.includes('burned')) {
                return [1, 2, -1];
            }
            return [1, 1, -1];
        }
    ), 
    new TrainerProto(
        'Weaver Rowan', // route 1 (6)
        'You just fell right into my trap! You know the deal, we gotta battle now...', 
        [new CaughtProto(
            'Wasket', 
            3, 
            ['Wobble']
        ), new CaughtProto(
            'Baskett', 
            8, 
            ['First Strike', 'Thump']
        )],
        50, 
        rect(170, 145, 1, 2), 
        [],
        [],
        (me, you) => {
            if(me.equipped == 0) {
                return [1, 1, -1];
            }
            if(me.caught[1].temphp == me.caught[1].stats[5]) {
                return [1, 2, -1];
            }
            return [1, 1, -1];
        }
    ), 
    new TrainerProto(
        'Cyborg Kelly', // route 1 (7)
        'GREETINGS HUMAN... IT IS TIME... OUR BATTLE BEGINS...', 
        [new CaughtProto(
            'Tailick', 
            6, 
            ['Tunnel', 'Thump']
        )], 
        150, 
        rect(202, 149, 1, 2), 
        ['Water'],
        [1],
        (me, you) => {
            if(me.inventory.length > 0 && me.caught[me.equipped].temphp / me.caught[me.equipped].stats[5] < 0.6) {
                return [3, 1, 1];
            }
            if(me.caught[me.equipped].tempstats[1] < 2 || me.caught[me.equipped].tempstats[3] < 2) {
                return [1, 1, -1];
            }
            return [1, 2, -1];
        }
    ), 
    new TrainerProto(
        'Musician Harper', // route 1 (8)
        'Get ready! My second Discit is super-duper-rare!', 
        [new CaughtProto(
            'Sproutlet', 
            6, 
            ['Sprout', 'Toughen Up']
        ), new CaughtProto(
            'Stilagon', 
            1, 
            ['Thump']
        )], 
        300, 
        rect(191, 144, 15, 1), 
        [],
        [], 
        (me, you) => {
            if(me.equipped == 0) {
                if(me.caught[me.equipped].temphp <= 2 && me.caught[1].temphp > 0) {
                    return [2, 2, -1];
                }
                return [1, Math.floor(Math.random() * 2) + 1, -1];
            }
            return [1, 1, -1];
        }
    ),
    new TrainerProto(
        'Swimmer Shannon', // arena 1 trainer 1
        'Watch out! You\'re in the splash zone!',
        [new CaughtProto(
            'Droppelet', 
            6, 
            ['Mist Ray', 'First Strike']
        )], 
        240, 
        rect(181, 230, 3, 1), 
        [],
        [],
        (me, you) => {
            if(me.caught[me.equipped].temphp == me.caught[me.equipped].stats[5]) {
                return [1, 2, -1];
            }
            return [1, 1, -1];
        }
    ), 
    new TrainerProto(
        'Marine Biologist Kim', // arena 1 trainer 2
        'Get ready!! My Discits have the evolutionary advantage!!',
        [new CaughtProto(
            'Baskett', 
            4, 
            ['Thump', 'Wobble', 'First Strike']
        ), new CaughtProto(
            'Aquish', 
            6, 
            ['Mist Ray', 'Toughen Up']
        )], 
        250, 
        rect(181, 251, 1, 4),
        [],
        [],
        (me, you) => {
            if(me.equipped == 0) {
                const random = Math.floor(Math.random() * 3) + 1;
                return [1, random, -1];
            }
            if(me.caught[me.equipped].tempstats[1] < 2) {
                return [1, 2, -1];
            }
            return [1, 1, -1];
        }
    ), 
    new TrainerProto(
        'Scuba Diver Ari', // arena 1 trainer 3
        'Let\'s battle! After you get through me, the arena boss is waiting.', 
        [new CaughtProto(
            'Miracule', 
            8, 
            ['Windmill', 'Quick Dodge']
        )], 
        260, 
        rect(165, 218, 1, 5),
        [],
        [],
        (me, you) => {
            if(you.temphp <= you.stats[5] / 2) {
                return [1, 2, -1];
            }
            return [1, 1, -1];
        }
    ),
    new TrainerProto(
        'Water Bottle Jordan', // arena 1 extra trainer
        '... *is water bottle* ...',
        [new CaughtProto(
            'Reflexic', 
            7, 
            ['Mist Ray', 'Wobble']
        )], 
        200, 
        rect(187, 255, 2, 1),
        ['Water', 'Spray bottle'],
        [2, 1],
        (me, you) => {
            const waterIndex = me.inventory.indexOf('Water');
            const SprayIndex = me.inventory.indexOf('Spray bottle');
            if(waterIndex != -1 && me.caught[me.equipped].temphp < me.caught[me.equipped].stats[5]) {
                return [3, waterIndex + 1, 1];
            }
            if(SprayIndex != -1 && me.caught[me.equipped].effects.includes('burned')) {
                return [3, SprayIndex + 1, 1];
            }
            return [1, Math.floor(Math.random() * 2) + 1, -1];
        }
    ), 
    new TrainerProto(
        'Water Boss Winston', // arena 1 boss
        'Let\'s do this, trainer! You\'re fighting for your very own Water Badge!',
        [new CaughtProto(
            'Droppelet', 
            8, 
            ['First Strike']
        ), new CaughtProto(
            'Streamur', 
            10, 
            ['Pour Out', 'Wobble']
        )], 
        300, 
        [[197, 213], [197, 214], [197, 215], [197, 217], [197, 218], [197, 219]],
        ['Slurpee'], 
        [1],
        (me, you) => {
            if(me.equipped == 0) {
                return [1, 1, -1];
            }
            if(me.inventory.length > 0 && me.caught[me.equipped].temphp / me.caught[me.equipped].stats[5] <= 0.4) {
                return [3, 1, me.equipped + 1];
            }
            const random = Math.random();
            if(random <= 0.2) {
                return [1, 2, -1];
            }
            return [1, 1, -1];
        }
    ),
    new TrainerProto(
        'Mechanic Charlie', // route 2 trainer 1
        'Mind if I take a look at your Discits?', 
        [new CaughtProto(
            'Amperas', 
            7, 
            ['Static', 'Weaken']
        ), new CaughtProto(
            'Miracule', 
            7, 
            ['Windmill']
        )], 
        245, 
        rect(162, 131, 7, 1), 
        [],
        [],
        (me, you) => {
            if(me.equipped == 0) {
                if(you.tempstats[0] > 0) {
                    return [1, 2, -1];
                }
                return [1, 1, -1];
            }
            return [1, 1, -1];
        }
    ), 
    new TrainerProto(
        'Soldier Alex', // route 2 trainer 2
        'Leave this area! You are trespassing on private property!',
        [new CaughtProto(
            'Flamesprit',
            8, 
            ['Light', 'Quick Dodge', 'Aflame']
        )], 
        260, 
        rect(162, 100, 7, 1), 
        [],
        [],
        (me, you) => {
            if(!you.effects.includes('burned')) {
                return [1, 1, -1];
            }
            if(me.caught[me.equipped].tempstats[5] < 4) {
                return [1, 2, -1];
            }
            return [1, 3, -1];
        }
    ), 
    new TrainerProto(
        'Acrobat Taylor', // route 2 trainer 3
        'You, over there! Let\'s battle!!!',
        [new CaughtProto(
            'Mascit', 
            7, 
            ['Thump', 'First Strike']
        ), new CaughtProto(
            'Furrow', 
            11, 
            ['Sprint', 'Uneasy']
        )], 
        38, 
        rect(157, 104, 3, 1), 
        [],
        [],
        (me, you) => {
            if(me.equipped == 0) {
                return [1, Math.floor(Math.random() * 2) + 1, -1];
            }
            if(me.caught[me.equipped].tempstats[4] < 2) {
                return [1, 1, -1];
            }
            return [1, 2, -1];
        }
    ), 
    new TrainerProto(
        'Celebrity Jamie', // route 2 trainer 4
        'Yo! It\'s me Jamie! Wait... you mean you don\'t recognize me?? Fine, I\'m sending out my strongest Discit first!',
        [new CaughtProto(
            'Searish', 
            12, 
            ['Light', 'Static', 'Spew']
        ), new CaughtProto(
            'Ripetal', 
            10, 
            ['Suspicious Mixture', 'Sprout']
        ), new CaughtProto(
            'Aquish', 
            8, 
            ['Toughen Up', 'Thump']
        )], 
        2000, 
        rect(133, 101, 1, 3), 
        [],
        [], 
        (me, you) => {
            if(me.equipped == 0) {
                if(!you.effects.includes('burned')) {
                    return [1, 1, -1];
                }
                if(!you.effects.includes('paralyzed')) {
                    return [1, 2, -1];
                }
                return [1, 3, -1];
            }
            if(me.equipped == 1) {
                if(!you.effects.includes('poisoned')) {
                    return [1, 1, -1];
                }
                return [1, 2, -1];
            }
            if(me.caught[me.equipped].tempstats[1] < 6) {
                return [1, 1, -1];
            }
            return [1, 2, -1];
        }
    ), 
    new TrainerProto(
        'Firefighter Emery', // route 2 trainer 5
        'Sirens are blarin\' and I\'m all set to battle!',
        [new CaughtProto(
            'Flubunny', 
            11, 
            ['Uneasy', 'First Strike']
        )], 
        195, 
        rect(130, 127, 3, 1), 
        ['Dodge module'],
        [1], 
        (me, you) => {
            if(me.inventory.length > 0) {
                return [3, 1, 1];
            }
            return [1, Math.floor(Math.random() * 2) + 1, -1];
        }
    ), 
    new TrainerProto(
        'Student Bodhi', // route 2 trainer 6
        'I\'m failing my classes AAAAAAAAAAAAAAAAAAGH! Note: Trainers in this game have absolutely no correlation to the developer whatseover 😉',
        [new CaughtProto(
            'Amperas', 
            12, 
            ['Amper Craze', 'Static']
        )], 
        215, 
        rect(152, 128, 1, 3), 
        [],
        [], 
        (me, you) => {
            if(you.temphp / you.stats[5] <= 0.5) {
                return [1, 2, -1];
            } 
            return [1, 1, -1];
        }
    ), 
    new TrainerProto(
        'Model August', // route 2 trainer 7
        'Could you take a picture for me real quick? It\'ll only take a second...',
        [new CaughtProto(
            'Furrow', 
            14, 
            ['Bonk', 'Uneasy']
        ), new CaughtProto(
            'Mascit', 
            12, 
            ['First Strike', 'Wobble']
        )], 
        300, 
        rect(149, 112, 3, 1), 
        [],
        [],
        (me, you) => {
            if(me.equipped == 0) {
                if(!you.effects.includes('confused')) {
                    return [1, 1, -1];
                }
                return [1, 2, -1];
            }
            return [1, Math.floor(Math.random() * 2) + 1, -1];
        }
    ), 
    new TrainerProto(
        'Photographer Trinity', // route 2 trainer 8
        '3...2...1... Pose! OK, you\'re all set!', 
        [new CaughtProto(
            'Ripetal', 
            15, 
            ['Cloud Over', 'Leaf Blower', 'Spore Plant']
        ), new CaughtProto(
            'Flubunny', 
            12, 
            ['Uneasy', 'Wobble']
        ), new CaughtProto(
            'Flamesprit', 
            15, 
            ['Spew', 'Light', 'Quick Dodge', 'Aflame']
        )], 
        320, 
        rect(141, 109, 1, 3), 
        [],
        [],
        (me, you) => {
            if(me.equipped == 0) {
                if(!you.effects.includes('leech seed')) {
                    return [1, 3, -1];
                }
                if(!you.effects.includes('poisoned')) {
                    return [1, 1, -1];
                }
                if(me.caught[1].temphp > 0) {
                    return [2, 2, -1];
                }
                return [1, 2, -1];
            }
            if(me.equipped == 1) {
                if(me.caught[me.equipped].effects.length < 1) {
                    return [1, 2, -1];
                }
                if(me.caught[2].temphp > 0) {
                    return [2, 3, -1];
                }
                return [1, 1, -1];
            }
            if(!you.effects.includes('burned')) {
                return [1, 2, -1];
            }
            if(me.tempstats[5] < 2) {
                return [1, 3, -1];
            }
            return [1, Math.floor(Math.random() * 2) * 3 + 1, -1];
        }
    ), 
    new TrainerProto(
        'Blacksmith Rio', // route 2 trainer 9
        'I\'ve hammered out the stats on my Discit to perfection, so get prepared!!',
        [new CaughtProto(
            'Searish', 
            15, 
            ['Strengthen', 'Spew', 'Static']
        )], 
        280, 
        rect(138, 119, 3, 1), 
        [],
        [], 
        (me, you) => {
            if(me.caught[me.equipped].tempstats[0] < 2) {
                return [1, 1, -1];
            }
            if(me.caught[me.equipped].temphp / me.caught[me.equipped].stats[5] > 0.6) {
                return [1, 3, -1];
            }
            return [1, 2, -1];
        }
    ), 
    new TrainerProto(
        'Latin Scholar Alexis', // route 2 trainer 10
        'Bruh Rome ain\'t even fall yet 😂👎 Oh fr? nvm', 
        [new CaughtProto(
            'Mascit', 
            13, 
            ['Uneasy', 'Thump']
        ), new CaughtProto(
            'Amperas', 
            17, 
            ['Charge Up', 'String Snare', 'Amper Craze', 'Weaken']
        )], 
        125, 
        rect(144, 120, 1, 3), 
        [],
        [],
        (me, you) => {
            if(me.equipped == 0) {
                if(me.caught[me.equipped].temphp / me.caught[me.equipped].stats[5] < 0.5) {
                    return [1, 1, -1];
                }
                return [1, 2, -1];
            }
            if(!you.effects.includes('paralyzed')) {
                return [1, 1, -1];
            }
            if(you.tempstats[0] >= 0) {
                return [1, 4, -1];
            }
            if(you.temphp / you.stats[5] < 0.5) {
                return [1, 3, -1];
            }
            return [1, 2, -1];
        }
    ), 
    new TrainerProto(
        'Zoologist Parker', // arena 2 trainer 1
        'I\'ve been experimenting with fire-types lately! What about you?', 
        [new CaughtProto(
            'Flamesprit', 
            14, 
            ['Spew', 'Light', 'Quick Dodge']
        )], 
        250, 
        rect(97, 203, 1, 3), 
        ['Thaw juice'], 
        [1],
        (me, you) => {
            if(me.caught[me.equipped].effects.includes('frozen') && me.inventory.length > 0) {
                return [3, 1, 1];
            }
            if(!you.effects.includes('burned')) {
                return [1, 2, -1];
            }
            if(me.caught[me.equipped].tempstats[5] < 2) {
                return [1, 3, -1];
            }
            return [1, 1, -1];
        }
    ), 
    new TrainerProto(
        'Circus Trainer Quinn', // arena 2 trainer 2
        'And now, watch as I jump through this flaming hoop!', 
        [new CaughtProto(
            'Sunlet', 
            17, 
            ['Sprint', 'Spew', 'First Strike']
        ), new CaughtProto(
            'Searish', 
            13, 
            ['Thump', 'Aflame', 'Light']
        )], 
        260, 
        rect(95, 196, 1, 3), 
        [],
        [],
        (me, you) => {
            if(me.equipped == 0) {
                if(me.tempstats[4] < 3) {
                    return [1, 1, -1];
                }
                return [1, Math.floor(Math.random() * 2) + 2, -1];
            }
            if(!you.effects.includes('burned')) {
                return [1, 3, -1];
            }
            if(you.temphp / you.stats[5] < 0.6) {
                return [1, 2, -1];
            }
            return [1, 1, -1];
        }
    ), 
    new TrainerProto(
        'Campfire Expert Jackie', // arena 2 trainer 3
        'All I need is one twig! Believe it!', 
        [new CaughtProto(
            'Rivolley', 
            16, 
            ['Sprint', 'Strengthen', 'Thump', 'Spew']
        ), new CaughtProto(
            'Rivolley', 
            16, 
            ['Aflame', 'First Strike']
        )], 
        270, 
        [[89, 192]],
        ['Attack module', 'Defense module'], 
        [1, 1],
        (me, you) => {
            const attackIndex = me.inventory.indexOf('Attack module');
            const defenseIndex = me.inventory.indexOf('Defense module');
            if(me.equipped == 0) {
                if(defenseIndex != -1) {
                    return [3, defenseIndex + 1, 1];
                }
                if(me.caught[me.equipped].tempstats[0] < 1) {
                    return [1, 2, -1];
                }
                if(you.tempstats[4] > me.caught[me.equipped].tempstats[4]) {
                    return [1, 1, -1];
                }
                return [1, Math.floor(Math.random() * 2) + 3, -1];
            }
            if(attackIndex != -1) {
                return [3, attackIndex + 1, 2];
            }
            if(you.tempstats[4] > 0 || you.stats[4] > me.caught[me.equipped].stats[4]) {
                return [1, 2, -1];
            }
            return [1, 1, -1];
        }
    ), 
    new TrainerProto(
        'Chef Nicky', // arena 2 trainer 4
        'One Discit battle, comin\' right up!', 
        [new CaughtProto(
            'Flamesprit', 
            14, 
            ['Spew', 'Static', 'Quick Dodge']
        ), new CaughtProto(
            'Tuburn', 
            16, 
            ['Strengthen', 'Spew', 'Aflame']
        )], 
        280, 
        rect(93, 187, 2, 1), 
        [],
        [],
        (me, you) => {
            if(me.equipped == 0) {
                if(me.caught[me.equipped].tempstats[5] < 0) {
                    return [1, 3, -1];
                }
                if(you.effects.includes('paralyzed')) {
                    return [1, 1, -1];
                }
                return [1, 2, -1];
            }
            if(me.caught[me.equipped].tempstats[0] < 0) {
                return [1, 1, -1];
            }
            if(me.caught[me.equipped].temphp / me.caught[me.equipped].stats[5] > 0.5) {
                return [1, 2, -1];
            }
            return [1, 3, -1];
        }
    ), 
    new TrainerProto(
        'Fire Boss Delta', // arena 2 boss
        'Get through me, and you\'ll finally have access to that Fire key!!', 
        [new CaughtProto(
            'Slimshaidy', 
            20, 
            ['Charge Up', 'Aflame']
        ), new CaughtProto(
            'Tuburn', 
            18, 
            ['Strengthen', 'Spew', 'Light']
        ), new CaughtProto(
            'Furrow', 
            7, 
            ['Thump']
        )], 
        300, 
        rect(85, 211, 5, 1), 
        ['Magic elixir'], 
        [1],
        (me, you) => {
            if(me.equipped == 0) {
                if(me.caught[me.equipped].temphp / me.caught[me.equipped].stats[5] < 0.5) {
                    if(me.inventory.length > 0) {
                        return [3, 1, 1];
                    }
                    if(me.caught[2].temphp > 0) {
                        return [2, 3, -1];
                    }
                }
                if(!you.effects.includes('paralyzed')) {
                    return [1, 1, -1];
                }
                return [1, 2, -1];
            }
            if(me.equipped == 1) {
                if(me.caught[me.equipped].temphp / me.caught[me.equipped].stats[5] < 0.5 && me.caught[0].temphp < 1 && me.caught[2].temphp > 0) {
                    return [2, 3, -1];
                }
                if(!you.effects.includes('burned')) {
                    return [1, 3, -1];
                }
                if(you.tempstats[1] > me.caught[me.equipped].tempstats[0]) {
                    return [1, 1, -1];
                } 
                return [1, 2, -1];
            }
            return [1, 1, -1];
        }
    ), 
    new TrainerProto(
        'Scientist Aden', // route 3 trainer 1
        'Let\'s get these results analyzed!! Go!!', 
        [new CaughtProto(
            'Weizel', 
            15, 
            ['Bonk', 'Leaf Blower', 'Stare Down']
        ), new CaughtProto(
            'Sirilik I', 
            15, 
            ['Sprint', 'Amper Craze', 'Slow Seep']
        )], 
        207, 
        [[102, 65], [102, 66], [102, 67], [99, 68], [100, 68], [101, 68], [103, 68], [104, 68], [105, 68], [102, 69], [102, 70], [102, 71]], 
        [],
        [],
        (me, you) => {
            if(me.equipped == 0) {
                if(you.tempstats[1] >= 0) {
                    return [1, 3, -1];
                }
                if(!you.effects.includes('confused')) {
                    return [1, 1, -1];
                }
                return [1, 2, -1];
            }
            if(me.caught[me.equipped].tempstats[4] < 0) {
                return [1, 1, -1];
            }
            return [1, Math.floor(Math.random() * 2) + 2, -1];
        }
    ), 
    new TrainerProto(
        'Custodian Avery', // route 3 trainer 2
        'My Discits are about to take this battle up a notch! You\'re not ready!',
        [new CaughtProto(
            'Streamur', 
            17, 
            ['Stare Down', 'Pour Out']
        ), new CaughtProto(
            'Simorchid', 
            16, 
            ['Tunnel', 'Leaf Blower', 'First Strike']
        ), new CaughtProto(
            'Rivolley', 
            16, 
            ['Spew', 'Sprint']
        )], 
        360, 
        [[102, 73], [102, 74], [102, 75], [99, 76], [100, 76], [101, 76], [103, 76], [104, 76], [105, 76], [102, 77], [102, 78], [102, 79]], 
        [],
        [], 
        (me, you) => {
            if(me.equipped == 0) {
                if(you.tempstats[1] > -1) {
                    return [1, 1, -1];
                }
                return [1, 2, -1];
            }
            if(me.equipped == 1) {
                if(me.caught[me.equipped].temphp == me.caught[me.equipped].stats[5]) {
                    return [1, 3, -1];
                }
                if(me.caught[me.equipped].tempstats[0] < 3) {
                    return [1, 1, -1];
                }
                return [1, 2, -1];
            }
            if(me.caught[me.equipped].tempstats[4] < 1) {
                return [1, 2, -1];
            }
            return [1, 1, -1];
        }
    ), 
    new TrainerProto(
        'Painter Salem', // route 3 trainer 3
        'What stark contrast between my Discits and yours! This just needs to be sketched!', 
        [new CaughtProto(
            'Zappstrike', 
            19, 
            ['Static', 'Toughen Up', 'Amper Craze', 'First Strike']
        )], 
        310, 
        [[110, 65], [110, 66], [110, 67], [107, 68], [108, 68], [109, 68], [111, 68], [112, 68], [113, 68], [110, 69], [110, 70], [110, 71]], 
        ['Slurpee'], 
        [1],
        (me, you) => {
            if(me.caught[me.equipped].tempstats[1] < 0) {
                return [1, 2, -1];
            }
            if(you.temphp / you.stats[5] >= 0.1) {
                return [1, 4, -1];
            }
            if(me.caught[me.equipped].temphp / me.caught[me.equipped].stats[5] < 0.4 && me.inventory.length > 0) {
                return [3, 1, 1];
            }
            return [1, Math.floor(Math.random() * 2) * 2 + 1, -1];
        }
    ), 
    new TrainerProto(
        'Astronomer Nova', // route 3 trainer 4
        'It\'s getting dark, so let\'s make this quick.', 
        [new CaughtProto(
            'Gasper', 
            20, 
            ['Cloud Over', 'Slow Seep', 'Smother']
        ), new CaughtProto(
            'Talemes', 
            21, 
            ['Rip Up', 'Spew', 'Windmill']
        )], 
        1, 
        [[110, 73], [110, 74], [110, 75], [107, 76], [108, 76], [109, 76], [111, 76], [112, 76], [113, 76], [110, 77], [110, 78], [110, 79]],
        [],
        [],
        (me, you) => {
            if(me.equipped == 0) {
                if(you.effects.includes('poisoned')) {
                    return [1, 2, -1];
                }
                if(you.tempstats[1] > 0 || you.tempstats[3] > 0) {
                    return [1, 1, -1];
                }
                return [1, 3, -1];
            }
            if(me.caught[me.equipped].tempstats[4] < 2) {
                return [1, 1, -1];
            }
            if(you.temphp / you.stats[5] > 0.6) {
                return [1, 3, -1];
            }
            return [1, 2, -1];
        }
    ), 
    new TrainerProto(
        'Physicist Aster', // route 3 trainer 5
        'Let\'s battle! This could give me most unprecedented data!', 
        [new CaughtProto(
            'Sirilik I', 
            22, 
            ['Charge Up', 'Suspicious Mixture', 'Weaken']
        ), new CaughtProto(
            'Gasper', 
            21, 
            ['Slow Seep', 'Suspicious Mixture', 'Thump']
        )], 
        335, 
        [[118, 65], [118, 66], [118, 67], [115, 68], [116, 68], [117, 68], [119, 68], [120, 68], [121, 68], [118, 69], [118, 70], [118, 71]],
        [],
        [],
        (me, you) => {
            if(me.equipped == 0) {
                if(!you.effects.includes('poisoned')) {
                    return [1, 2, -1];
                }
                if(!you.effects.includes('paralyzed')) {
                    return [1, 1, -1];
                }
                return [1, 3, -1];
            }
            if(you.temphp == 1) {
                return [1, 2, -1];
            }
            return [1, Math.floor(Math.random() * 2) * 2 + 1, -1];
        }
    ), 
    new TrainerProto(
        'Office Clerk Dakota', // route 3 trainer 6
        'Can I help you with something?', 
        [new CaughtProto(
            'Weizel', 
            24, 
            ['Coin Flip', 'Pummel', 'Bonk']
        ), new CaughtProto(
            'Zappstrike', 
            22, 
            ['Toughen Up', 'String Snare']
        )], 
        342, 
        [[118, 73], [118, 74], [118, 75], [115, 76], [116, 76], [117, 76], [119, 76], [120, 76], [121, 76], [118, 77], [118, 78], [118, 79]], 
        [],
        [],
        (me, you) => {
            if(me.equipped == 0) {
                if(!you.effects.includes('confused')) {
                    return [1, 3, -1];
                }
                if(me.caught[me.equipped].temphp / me.caught[me.equipped].stats[5] >= 0.5) {
                    return [1, 2, -1];
                }
                return [1, 1, -1];
            }
            if(me.caught[me.equipped].tempstats[1] < 1) {
                return [1, 1, -1];
            }
            return [1, 2, -1];
        }
    ), 
    new TrainerProto(
        'Cashier Riley', // route 3 trainer 7
        'I\'ve honed my stats to perfection! This will truly be a challenge!!',
        [new CaughtProto(
            'Streamur', 
            25, 
            ['Spray', 'Mist Ray', 'Pour Out']
        ), new CaughtProto(
            'Simorchid', 
            24, 
            ['Snare', 'Sprout', 'Leaf Blower']
        ), new CaughtProto(
            'Rivolley', 
            26, 
            ['Torch', 'Aflame', 'Spew']
        )], 
        365, 
        [[126, 65], [126, 66], [126, 67], [123, 68], [124, 68], [125, 68], [127, 68], [128, 68], [129, 68], [126, 69], [126, 70], [126, 71]], 
        [],
        [],
        (me, you) => {
            const rand = Math.floor(Math.random() * 4);
            if(rand == 0) {
                if(me.equipped != 0 && me.caught[0].temphp > 0) {
                    return [2, 1, -1];
                }
                if(me.equipped != 1 && me.caught[1].temphp > 0) {
                    return [2, 2, -1];
                }
                if(me.equipped != 2 && me.caught[2].temphp > 0) {
                    return [2, 3, -1];
                }
                return [1, 2, -1];
            }
            return [1, rand, -1];
        }
    ), 
    new TrainerProto(
        'Bartender Rey', // route 3 trainer 8
        'Comin\' right up! Let\'s do this, trainer.', 
        [new CaughtProto(
            'Talemes', 
            27, 
            ['Flap', 'Light', 'Rip Up', 'Quick Dodge']
        )], 
        399, 
        [[126, 73], [126, 74], [126, 75], [123, 76], [124, 76], [125, 76], [127, 76], [128, 76], [129, 76], [126, 77], [126, 78], [126, 79]], 
        ['Mirror'], 
        [1],
        (me, you) => {
            if(me.caught[me.equipped].effects.length > 0 && me.inventory.length > 0) {
                return [3, 1, 1];
            }   
            if(!you.effects.includes('burned')) {
                return [1, 2, -1];
            }
            if(you.tempstats[6] > 0) {
                return [1, 4, -1];
            }
            if(you.temphp / you.stats[5] >= 0.5) {
                return [1, 3, -1];
            }
            return [1, 1, -1];
        }
    ), 
    new TrainerProto(
        'Chimneysweep Kendall', // route 3 special trainer
        'You\'re about to be blown away!!', 
        [new CaughtProto(
            'Wasket', 
            17, 
            ['Thump', 'First Strike']
        ), new CaughtProto(
            'Baskett', 
            21, 
            ['Uneasy']
        ), new CaughtProto(
            'Mascit', 
            25, 
            ['Quick Dodge', 'Strengthen', 'Uneasy']
        )], 
        250, 
        rect(115, 97, 9, 1),
        ['Water'], 
        [1],
        (me, you) => {
            if(me.caught[me.equipped].temphp / me.caught[me.equipped].stats[5] <= 0.4 && me.inventory.length > 0) {
                return [3, 1, me.equipped + 1];
            }
            if(me.equipped == 0) {
                if(you.temphp / you.stats[5] == 1) {
                    return [1, 2, -1];
                }
                return [1, 1, -1];
            }
            if(me.equipped == 1) {
                return [1, 1, -1];
            }
            if(me.caught[me.equipped].tempstats[0] < 1) {
                return [1, 2, -1];
            } 
            if(me.caught[me.equipped].tempstats[5] < 1) {
                return [1, 1, -1];
            }
            return [1, 3, -1];
        }
    ), 
    
    // Sproutlet (1)(2), Simorchid (2), Ripetal (3)(4), Wrathorn (3)(4)
    new TrainerProto(
        'Businessperson Presley', // arena 3 trainer 1
        'I got a lot of money, yeah you know who I am!! 💯', 
        [new CaughtProto(
            'Sproutlet', 
            20, 
            ['Tunnel', 'Snare', 'Leaf Blower', 'Sprout']
        )], 
        360, 
        [[104, 153]], 
        [],
        [],
        (me, you) => {
            if(me.caught[me.equipped].tempstats[0] < 2) {
                return [1, 1, -1];
            }
            return [1, Math.floor(Math.random() * 3) + 2, -1];
        }
    ), 
    new TrainerProto(
        'Bug Catcher Remy', // arena 3 trainer 2
        'Do you even know about Discit evolution? No? Let me show you!', 
        [new CaughtProto(
            'Sproutlet', 
            21, 
            ['Snare', 'Leaf Blower']
        ), new CaughtProto(
            'Simorchid', 
            24, 
            ['Snare', 'First Strike']
        ), new CaughtProto(
            'Simorchid', 
            24, 
            ['Leaf Blower', 'Sprout', 'Toughen Up']
        )], 
        370, 
        [[117, 153]], 
        [],
        [],
        (me, you) => {
            if(me.equipped == 0) {
                if(me.caught[me.equipped].temphp / me.caught[me.equipped].stats[5] != 1 && me.caught[1].temphp > 0) {
                    return [2, 2, -1];
                }
                if(!you.effects.includes('leech seed')) {
                    return [1, 1, -1];
                }
                return [1, 2, -1];
            }
            if(me.equipped == 1) {
                if(me.caught[me.equipped].temphp / me.caught[me.equipped].stats[5] < 0.4) {
                    return [1, 1, -1];
                }
                return [1, 2, -1];
            }
            if(me.caught[me.equipped].tempstats[1] < 1) {
                return [1, 3, -1];
            }
            return [1, Math.floor(Math.random() * 2) + 1, -1];
        }
    ), 
    new TrainerProto(
        'Biologist Ryder', // arena 3 trainer 3
        'Allow me to make a quick examination of this sample - it\'ll just take a second.', 
        [new CaughtProto(
            'Ripetal', 
            26, 
            ['Tunnel', 'Cloud Over', 'Suspicious Mixture', 'Leaf Blower']
        )], 
        380, 
        [[129, 160]], 
        [],
        [],
        (me, you) => {
            if(!you.effects.includes('poisoned')) {
                return [1, 3, -1];
            }
            if(you.tempstats[0] > me.caught[me.equipped].tempstats[0]) {
                return [1, 1, -1];
            }
            if(you.temphp / you.stats[5] < 0.5) {
                return [1, 2, -1];
            }
            return [1, 4, -1];
        }
    ), 
    new TrainerProto(
        'Grass Boss London', // arena 3 boss
        'It\'s that time again! Beat me and you get the prestigious Grass medal!!', 
        [new CaughtProto(
            'Ripetal', 
            29, 
            ['Spore Plant', 'Suspicious Mixture', 'Tunnel']
        ), new CaughtProto(
            'Wrathorn', 
            30, 
            ['Stifle', 'Leaf Blower', 'Spore Plant']
        )], 
        400, 
        rect(101, 64, 1, 3), 
        ['Last resort'], 
        [1],
        (me, you) => {
            if(me.equipped == 0) {
                if(!you.effects.includes('leech seed')) {
                    return [1, 1, -1];
                }
                if(!you.effects.includes('poisoned')) {
                    return [1, 2, -1];
                }
                return [1, 3, -1];
            }
            if(me.caught[me.equipped].temphp / me.caught[me.equipped].stats[5] <= 0.1 && me.inventory.length > 0) {
                return [3, 1, 2];
            }
            if(!you.effects.includes('leech seed')) {
                return [1, 3, -1];
            }
            return [1, Math.floor(Math.random() * 2) + 1, -1];
        }
    ), 
    new TrainerProto(
        'Historian Addison', // route 4 trainer 1
        'It\'s battle time!! Let\'s get this party started!!', 
        [new CaughtProto(
            'Tasket', 
            28, 
            ['Stifle', 'Silent Strangle', 'Strengthen']
        )], 
        325, 
        rect(231, 101, 1, 6), 
        [],
        [], 
        (me, you) => {
            if(me.caught[me.equipped].tempstats[0] < 0) {
                return [1, 3, -1];
            }
            if(you.temphp / you.stats[5] < 0.5) {
                return [1, 1, -1];
            }
            return [1, 2, -1];
        }
    ), 
    new TrainerProto(
        'Gardener Finn', // route 4 trainer 2
        'I specialize in grass-type Discits, so prepare yourself!', 
        [new CaughtProto(
            'Simmatree', 
            30, 
            ['String Snare', 'Leaf Blower', 'Bonk']
        ), new CaughtProto(
            'Wrathorn', 
            29, 
            ['Stifle', 'Sprout', 'Spore Plant']
        )], 
        350, 
        [[243, 106]], 
        [],
        [],
        (me, you) => {
            if(me.equipped == 0) {
                if(!you.effects.includes('confused')) {
                    return [1, 3, -1];
                }
                if(!you.effects.includes('leech seed')) {
                    return [1, 2, -1];
                }
                return [1, 1, -1];
            }
            if(!you.effects.includes('leech seed')) {
                return [1, 3, -1];
            }
            if((me.caught[me.equipped].temphp / me.caught[me.equipped].stats[5]) < (you.temphp / you.stats[5])) {
                return [1, 1, -1];
            }
            return [1, 2, -1];
        }
    ), 
    new TrainerProto(
        'Illustrator Marley', // route 4 trainer 3
        'Pose! Photoshoot! Pose!', 
        [new CaughtProto(
            'Kermutt', 
            31, 
            ['Sunrise', 'Light', 'Pummel']
        ), new CaughtProto(
            'Whiskitch', 
            30, 
            ['Stare Down', 'Tunnel', 'String Snare']
        ), new CaughtProto(
            'Tornatian', 
            29, 
            ['Pour Out', 'Rip Up', 'Sleet']
        ), new CaughtProto(
            'Flurrious', 
            32, 
            ['Spray', 'Sleet', 'Sunrise']
        )], 
        344, 
        rect(265, 101, 1, 6), 
        [],
        [],
        (me, you) => {
            if(me.equipped == 0) {
                if(!you.effects.includes('burned')) {
                    return [1, 2, -1];
                }
                if(me.caught[me.equipped].effects.length > 1) {
                    return [1, 1, -1];
                }
                return [1, 3, -1];
            }
            if(me.equipped == 1) {
                if(you.tempstats[1] > -1) {
                    return [1, 1, -1];
                }
                if(you.temphp / you.stats[5] >= 0.5) {
                    return [1, 2, -1];
                }
                return [1, 3, -1];
            }
            if(me.equipped == 2) {
                if(!you.effects.includes('frozen')) {
                    return [1, 3, -1];
                }
                if(me.caught[me.equipped].tempstats[4] < 3) {
                    return [1, 2, -1];
                }
                return [1, 1, -1];
            }
            if(!you.effects.includes('frozen')) {
                return [1, 2, -1];
            }
            if(me.caught[me.equipped].effects.length > 2) {
                return [1, 3, -1];
            }
            return [1, 1, -1];
        }
    ), 
    new TrainerProto(
        'Factory Worker Forrest', // route 4 trainer 4
        'My Discits have been hardened by the heat of battle! There\'s no getting through me!', 
        [new CaughtProto(
            'Yavolt', 
            33, 
            ['Toxin Shower', 'Charge Up', 'Amper Craze']
        ), new CaughtProto(
            'Tulong', 
            27, 
            ['Toughen Up', 'Slow Seep', 'Static']
        )], 
        305, 
        rect(267, 101, 1, 6), 
        ['Resistance module'], 
        [1],
        (me, you) => {
            if(me.caught[me.equipped].effects.length > 1 && me.inventory.length > 0) {
                return [3, 1, me.equipped + 1];
            }
            if(me.equipped == 0) {
                if(!you.effects.includes('paralyzed')) {
                    return [1, 2, -1];
                }
                return [1, Math.floor(Math.random() * 2) * 2 + 1, -1];
            }
            if(me.caught[me.equipped].tempstats[1] < 1) {
                return [1, 1, -1];
            }
            if(you.temphp <= 10) {
                return [1, 3, -1];
            }
            return [1, 2, -1];
        }
    ), 
    new TrainerProto(
        'Archer Robin', // route 4 trainer 5
        'It seems that our eyes have crossed! You know what that means... it means you won\'t have any after this battle!', 
        [new CaughtProto(
            'Gasper', 
            30, 
            ['Strengthen', 'Weaken', 'Smother']
        ), new CaughtProto(
            'Fumulus', 
            34, 
            ['Cloud Over', 'Slow Seep', 'Suspicious Mixture']
        )], 
        397, 
        rect(269, 101, 1, 6), 
        [],
        [],
        (me, you) => {
            if(me.equipped == 0) {
                if(you.tempstats[0] >= me.caught[me.equipped].tempstats[0]) {
                    return [1, Math.floor(Math.random() * 2) + 1, -1];
                }
                return [1, 3, -1];
            }
            if(!you.effects.includes('poisoned')) {
                return [1, 3, -1];
            }
            if(you.tempstats[4] >= 0) {
                return [1, 2, -1];
            }
            return [1, 1, -1];
        }
    ), 
    new TrainerProto(
        'Fishmonger Gray', // route 4 trainer 6
        'Well, it\'s o-fish-ial. We\'re battling.', 
        [new CaughtProto(
            'Tasket', 
            35, 
            ['Sleet', 'Stifle', 'Silent Strangle']
        ), new CaughtProto(
            'Tasket', 
            35, 
            ['Sleet', 'Stifle', 'Silent Strangle']
        ), new CaughtProto(
            'Tasket', 
            35, 
            ['Sleet', 'Stifle', 'Silent Strangle']
        )], 
        435, 
        rect(225, 129, 3, 1),
        ['Speed module'], 
        [3],
        (me, you) => {
            if(me.caught[me.equipped].tempstats[4] <= you.tempstats[4] && me.inventory.length > 0) {
                return [3, 1, me.equipped + 1];
            }
            if(me.caught[me.equipped].temphp / me.caught[me.equipped].stats[5] < 0.5) {
                if(me.equipped != 0 && me.caught[0].temphp > 0) {
                    return [2, 1, -1];
                }
                if(me.equipped != 1 && me.caught[1].temphp > 0) {
                    return [2, 2, -1];
                }
                if(me.equipped != 2 && me.caught[2].temphp > 0) {
                    return [2, 3, -1];
                }
            }
            if(!you.effects.includes('frozen')) {
                return [1, 1, -1];
            }
            if(!you.effects.includes('asleep')) {
                return [1, 3, -1];
            }
            return [1, 2, -1];
        }
    ), 
    new TrainerProto(
        'SIRILIK_DEPLOYER_123', // route 4 trainer 6.5
        'I_AM_NUMBER_1', 
        [new CaughtProto(
            'Sirilik I', 
            36, 
            ['Charge Up', 'Amper Craze']
        )], 
        111, 
        rect(236, 118, 1, 3), 
        [],
        [],
        (me, you) => {
            if(!you.effects.includes('paralyzed')) {
                return [1, 1, -1];
            }
            return [1, 2, -1];
        }
    ), 
    new TrainerProto(
        'Guitarist Jazz', // route 4 trainer 7
        'I\'m all amped up and ready to go!', 
        [new CaughtProto(
            'Yavolt', 
            37, 
            ['Toxin Shower', 'Sunrise']
        )], 
        400, 
        rect(243, 123, 4, 1), 
        [],
        [],
        (me, you) => {
            if(me.caught[me.equipped].effects.length > 0) {
                return [1, 2, -1];
            }
            return [1, 1, -1];
        }
    ), 
    new TrainerProto(
        'Therapist Jesse', // route 4 trainer 8
        'Let\'s talk this through before we battle. Psych! I\'m about to go all out!', 
        [new CaughtProto(
            'Whiskitch', 
            36, 
            ['Suspicious Mixture', 'String Snare', 'Pummel']
        ), new CaughtProto(
            'Flurrious', 
            39, 
            ['Sleet', 'Spray', 'Vacuum Claw']
        )], 
        600, 
        rect(268, 128, 1, 3), 
        [],
        [],
        (me, you) => {
            if(me.equipped == 0) {
                if(me.caught[me.equipped].tempstats[4] <= you.tempstats[4]) {
                    return [1, 2, -1];
                }            
                if(!you.effects.includes('poisoned')) {
                    return [1, 1, -1];
                }
                return [1, 3, -1];
            }
            if(!you.effects.includes('frozen')) {
                return [1, 1, -1];
            }
            return [1, Math.floor(Math.random() * 2) + 2, -1];
        }
    ), 
    new TrainerProto(
        'Movie Critic Ocean', // route 4 trainer 9
        'Hmm... I rate your Discit lineup an 8/10!', 
        [new CaughtProto(
            'Wrathorn', 
            38, 
            ['Snare', 'Stifle']
        ), new CaughtProto(
            'Tornatian', 
            39, 
            ['Quick Dodge', 'Flap', 'Vacuum Claw']
        )], 
        450, 
        rect(275, 118, 1, 4),
        [],
        [],
        (me, you) => {
            if(me.equipped == 0) {
                if(!you.effects.includes('leech seed')) {
                    return [1, 1, -1];
                }
                return [1, 2, -1];
            }
            if(me.caught[me.equipped].tempstats[5] < 2) {
                return [1, 1, -1];
            }
            if(!me.caught[me.equipped].effects.includes('confused')) {
                return [1, 2, -1];
            }
            return [1, 3, -1];
        }
    ), 
    new TrainerProto(
        'SIRILIK_DEPLOYER_234', // route 4 trainer 9.5
        'I_AM_NUMBER_2', 
        [new CaughtProto(
            'Sirilik II', 
            38, 
            ['Light', 'Spore Plant', 'Smother']
        )], 
        222, 
        rect(265, 133, 1, 3),
        [],
        [],
        (me, you) => {
            if(!you.effects.includes('burned')) {
                return [1, 1, -1];
            }
            if(!you.effects.includes('leech seed')) {
                return [1, 2, -1];
            }
            return [1, 3, -1];
        }
    ), 
    new TrainerProto(
        'Show Host Drew', // route 4 trainer 10
        'I\'m about to end your whole career, trainer! Well, at least hopefully that\'s what happens...', 
        [new CaughtProto(
            'Kermutt', 
            40, 
            ['Hurl Attack', 'Tornado Assault', 'Sunrise']
        ), new CaughtProto(
            'Tulong',
            39, 
            ['String Snare', 'Thump', 'Suspicious Mixture']
        ), new CaughtProto(
            'Simmatree', 
            40, 
            ['Charge Up', 'Thorn Shower', 'Lightning Shower']
        )], 
        999, 
        [[266, 138]], 
        [],
        [],
        (me, you) => {
            if(me.equipped == 0) {
                if(me.caught[me.equipped].effects.length > 2) {
                    return [1, 3, -1];
                }
                return [1, Math.floor(Math.random() * 2) + 1, -1];
            }
            if(me.equipped == 1) {
                if(!you.effects.includes('poisoned')) {
                    return [1, 3, -1];
                }
                if(me.caught[me.equipped].tempstats[4] <= you.tempstats[4]) {
                    return [1, 1, -1];
                }
                return [1, 2, -1];
            }
            if(!you.effects.includes('paralyzed')) {
                return [1, 1, -1];
            }
            return [1, Math.floor(Math.random() * 2) + 2, -1];
        }
    ), 
    // Stormish, Tornatian, Flurrious, Miracule, Talemes
    new TrainerProto(
        'Pilot Red', // arena 4 trainer 1
        'Our Discit battle is now boarding!!', 
        [new CaughtProto(
            'Stormish', 
            30, 
            ['Quick Dodge', 'Rip Up', 'Spore Plant']
        )], 
        500, 
        rect(248, 221, 3, 1), 
        [],
        [], 
        (me, you) => {
            if(!you.effects.includes('leech seed')) {
                return [1, 3, -1];
            }
            if(me.caught[me.equipped].tempstats[5] < 2) {
                return [1, 1, -1];
            }
            return [1, 2, -1];
        }
    ), 
    new TrainerProto(
        'Wanna-be Ariel', // arena 4 trainer 2
        'I\'m a superhero! I just know it! And that\'s why I only every carry Flying-type Discits!', 
        [new CaughtProto(
            'Flurrious', 
            34, 
            ['Sleet', 'Windmill', 'Sunrise']
        ), new CaughtProto(
            'Miracule', 
            35, 
            ['Bonk', 'Flap', 'Light', 'First Strike']
        )], 
        520, 
        rect(226, 245, 2, 1), 
        [],
        [],
        (me, you) => {
            if(me.equipped == 0) {
                if(!you.effects.includes('frozen')) {
                    return [1, 1, -1];
                }
                if(me.caught[me.equipped].effects.length >= 2) {
                    return [1, 3, -1];
                }
                return [1, 2, -1];
            }
            if(me.caught[me.equipped].effects.includes('confused')) {
                return [1, 1, -1];
            }
            if(me.caught[me.equipped].effects.includes('burned')) {
                return [1, 3, -1];
            }
            return [1, Math.floor(Math.random() * 2) * 3 + 1, -1];
        }
    ), 
    new TrainerProto(
        'Astronaut Bobbie', // arena 4 trainer 3
        'Wow, life on Earth sure is great! We can eat real food and drink water from rain!', 
        [new CaughtProto(
            'Miracule', 
            36, 
            ['Spew', 'Rip Up']
        ), new CaughtProto(
            'Talemes', 
            37, 
            ['Torch', 'Flap', 'Quick Dodge']
        )], 
        525, 
        rect(264, 238, 3, 1), 
        ['Water'], 
        [1],
        (me, you) => {
            if(me.caught[me.equipped].temphp / me.caught[me.equipped].stats[5] < 0.5 && me.inventory.length > 0) {
                return [3, 1, me.equipped + 1];
            }
            if(me.equipped == 0) {
                if(me.caught[me.equipped].tempstats[4] > me.caught[me.equipped].tempstats[0]) {
                    return [1, 1, -1];
                }
                return [1, 2, -1];
            }
            if(you.tempstats[6] > 0) {
                return [1, 3, -1];
            }
            if(you.temphp / you.stats[5] < 0.4) {
                return [1, 1, -1];
            }
            return [1, 2, -1];
        }
    ), 
    new TrainerProto(
        'Skydiver Mckensie', // arena 4 trainer 4
        ' - Skydiving is dope - I love flying in the air - My trainer haiku - ', 
        [new CaughtProto(
            'Stormish', 
            36, 
            ['Pour Out', 'Rip Up', 'Windmill']
        ), new CaughtProto(
            'Tornatian', 
            37, 
            ['Flap', 'Vacuum Claw', 'Sleet']
        )], 
        550, 
        rect(261, 196, 2, 1), 
        [],
        [],
        (me, you) => {
            if(me.equipped == 0) {
                if(me.caught[me.equipped].temphp / me.caught[me.equipped].stats[5] >= 0.67) {
                    return [1, 1, -1];
                }
                if(me.caught[me.equipped].temphp / me.caught[me.equipped].stats[5] >= 0.33) {
                    return [1, 3, -1];
                }
                return [1, 2, -1];
            }
            if(Math.random() > 0.7) {
                return [1, 3, -1];
            }
            if(me.caught[me.equipped].effects.length == 0) {
                return [1, 1, -1];
            }
            return [1, 2, -1];
        }
    ), 
    new TrainerProto(
        'Flying Boss Nell', // arena 4 boss
        'If you beat me, you\'ll have to face two more arenas and then the champion! Is that even worth it?', 
        [new CaughtProto(
            'Talemes', 
            39, 
            ['Sprint', 'Bonk', 'Flap']
        ), new CaughtProto(
            'Tornatian', 
            39, 
            ['Windmill', 'Rip Up', 'Flap', 'Vacuum Claw']
        ), new CaughtProto(
            'Legenden', 
            41, 
            ['Spew', 'Light', 'Flap']
        )], 
        600, 
        rect(249, 208, 3, 1), 
        ['Spray bottle', 'Thaw juice', 'Insulator', 'Cleansing leaves'], 
        [1, 1, 1, 1],
        (me, you) => {
            const indices = [me.inventory.indexOf('Spray bottle'), me.inventory.indexOf('Thaw juice'), me.inventory.indexOf('Insulator'), me.inventory.indexOf('Cleansing leaves')];
    
            if(me.caught[me.equipped].effects.includes('burned') && indices[0] != -1) {
                return [3, indices[0] + 1, me.equipped + 1];
            }
            if(me.caught[me.equipped].effects.includes('frozen') && indices[1] != -1) {
                return [3, indices[1] + 1, me.equipped + 1];
            }
            if(me.caught[me.equipped].effects.includes('paralyzed') && indices[2] != -1) {
                return [3, indices[2] + 1, me.equipped + 1];
            }
            if(me.caught[me.equipped].effects.includes('poisoned') && indices[3] != -1) {
                return [3, indices[3] + 1, me.equipped + 1];
            }
    
            if(me.equipped == 0) {
                if(me.caught[me.equipped].effects.includes('confused')) {
                    return [1, 2, -1];
                }
                if(you.tempstats[4] >= me.caught[me.equipped].tempstats[4]) {
                    return [1, 1, -1];
                }
                return [1, 3, -1];
            }
            if(me.equipped == 1) {
                if(you.temphp / you.stats[5] > 0.75) {
                    return [1, 4, -1];
                }
                if(you.temphp / you.stats[5] > 0.5) {
                    return [1, 3, -1];
                }
                if(you.temphp / you.stats[5] > 0.25) {
                    return [1, 2, -1];
                }
                return [1, 1, -1];
            }
            if(!you.effects.includes('burned')) {
                return [1, 2, -1];
            }
            if(me.caught[me.equipped].tempstats[0] < 1) {
                return [1, 1, -1];
            }
            return [1, 3, -1];
        }
    ), 
    new TrainerProto(
        'Baker Casey', // route 5 trainer 1 
        'This will be an exquisite battle!', 
        [new CaughtProto(
            'Tuburn', 
            41, 
            ['Enchant', 'Flap', 'Lava Shower']
        ), new CaughtProto(
            'Reflexic', 
            40, 
            ['Wave Shower', 'Bonk', 'Snare']
        )], 
        500, 
        rect(308, 168, 1, 6), 
        ['Energy drink'], 
        [1],
        (me, you) => {
            if(me.equipped == 0) {
                if(!you.effects.includes('asleep')) {
                    return [1, 1, -1];
                }
                if(me.caught[me.equipped].temphp / me.caught[me.equipped].stats[5] > 0.5) {
                    return [1, 3, -1];
                }
                return [1, 2, -1];
            }
            if((me.caught[me.equipped].temphp / me.caught[me.equipped].stats[5] < 0.4 || me.caught[me.equipped].tempstats[4] < you.tempstats[4]) && me.inventory.length > 0) {
                return [3, 1, 2]
            }
            if(!you.effects.includes('confused')) {
                return [1, 2, -1];
            }
            return [1, Math.floor(Math.random() * 2) * 2 + 1, -1];
        }
    ), 
    new TrainerProto(
        'Advertiser Nat', // route 5 trainer 2
        'This will go great on a poster! I can already envision the color scheme...', 
        [new CaughtProto(
            'Sirilik II', 
            42, 
            ['Toxin Shower', 'Lightning Shower', 'Smother']
        ), new CaughtProto(
            'Sirilik II', 
            42, 
            ['Light', 'Spore Plant', 'Cloud Over']
        ), new CaughtProto(
            'Sirilik III',
            43, 
            ['Suspicious Mixture', 'Amper Craze', 'Charge Up']
        )], 
        515, 
        rect(314, 176, 13, 1), 
        [],
        [], 
        (me, you) => {
            if(me.equipped == 0) {
                if(me.caught[me.equipped].temphp / me.caught[me.equipped].stats[5] >= 0.75) {
                    return [1, 3, -1];
                }
                if(me.caught[me.equipped].temphp / me.caught[me.equipped].stats[5] >= 0.45) {
                    return [1, 2, -1];
                }
                return [1, 1, -1];
            }
            if(me.equipped == 1) {
                if(!you.effects.includes('leech seed')) {
                    return [1, 2, -1];
                }
                if(!you.effects.includes('burned')) {
                    return [1, 1, -1];
                }
                return [1, 3, -1];
            }
            if(!you.effects.includes('poisoned')) {
                return [1, 1, -1];
            }
            if(!you.effects.includes('paralyzed')) {
                return [1, 3, -1];
            }
            return [1, 2, -1];
        }
    ), 
    new TrainerProto(
        'Athlete Eden', // route 5 trainer 3
        'Race you to the arena!', 
        [new CaughtProto(
            'Slimshaidy', 
            44, 
            ['Quick Dodge', 'Torch', 'Charge Up']
        )],  
        495, 
        rect(302, 179, 1, 12), 
        [],
        [],
        (me, you) => {
            if(!you.effects.includes('paralyzed') && Math.floor(Math.random() * 10) + 1 <= 2) {
                return [1, 3, -1];
            }
            if(me.caught[me.equipped].tempstats[5] < 2) {
                return [1, 1, -1];
            }
            return [1, 2, -1];
        }
    ), 
    new TrainerProto(
        'Genius Kade', // route 5 trainer 4
        'You\'re about to get obliterated! My Discits are top tier!!', 
        [new CaughtProto(
            'Shadisk', 
            43, 
            ['Pure Darkness', 'Enchant', 'Sunrise']
        ), new CaughtProto(
            'Slithan', 
            43, 
            ['Noxious Fumes', 'Toxin Shower']
        )], 
        90, 
        rect(295, 179, 1, 11), 
        [],
        [],
        (me, you) => {
            if(me.equipped == 0) {
                if(!you.effects.includes('asleep')) {
                    return [1, 2, -1];
                }
                if(me.caught[me.equipped].effects.length > 1) {
                    return [1, 3, -1];
                }
                return [1, 1, -1];
            }
            if(you.temphp / you.stats[5] >= 0.5) {
                return [1, 1, -1];
            }
            return [1, 2, -1];
        }
    ), 
    new TrainerProto(
        'Chemist Brooklyn', // route 5 trainer 5
        'These toxins I\'ve prepared are overpowering! Wanna try some?', 
        [new CaughtProto(
            'Fumulus', 
            44, 
            ['Weaken', 'Strengthen', 'Smother', 'Suspicious Mixture']
        )], 
        250, 
        [[323, 206]], 
        [],
        [],
        (me, you) => {
            if(me.caught[me.equipped].tempstats[0] <= you.tempstats[0] + 1) {
                return [1, Math.floor(Math.random() * 2) + 1, -1];
            }
            if(!you.effects.includes('poisoned')) {
                return [1, 4, -1];
            }
            return [1, 3, -1];
        }
    ),
    new TrainerProto(
        'Dentist Sam', // route 5 trainer 6
        'Wow, it looks like we both made it route 5! That\'s pretty impressive!', 
        [new CaughtProto(
            'Slithan', 
            45, 
            ['String Snare', 'Noxious Fumes']
        ), new CaughtProto(
            'Tulong', 
            40, 
            ['Toughen Up', 'Suspicious Mixture', 'Slow Seep']
        ), new CaughtProto(
            'Tulong', 
            40, 
            ['Toughen Up', 'Suspicious Mixture', 'Slow Seep']
        )], 
        600, 
        rect(314, 241, 1, 2), 
        [],
        [],
        (me, you) => {
            if(me.equipped == 0) {
                if(me.caught[me.equipped].temphp / me.caught[me.equipped].stats[5] < 0.5) {
                    if(me.caught[1].temphp > 0) {
                        return [2, 2, -1];
                    }
                    if(me.caught[2].temphp > 0) {
                        return [2, 3, -1];
                    }
                }
                if(me.caught[me.equipped].tempstats[4] < 1) {
                    return [1, 1, -1];
                }
                return [1, 2, -1];
            }
            if(me.caught[me.equipped].temphp / me.caught[me.equipped].stats[5] < 0.4 && me.caught[0].temphp > 0) {
                return [2, 1, -1];
            }
            if(!you.effects.includes('poisoned')) {
                return [1, 2, -1];
            }
            if(you.tempstats[1] > me.caught[me.equipped].tempstats[1]) {
                return [1, 1, -1];
            }
            return [1, 3, -1];
        }
    ), 
    new TrainerProto(
        'Surveillance Manager Winter', // route 5 trainer 7
        'I see you over there! That means we have to battle!', 
        [new CaughtProto(
            'Tuburn', 
            44, 
            ['Coin Flip', 'Enchant', 'Strengthen']
        ), new CaughtProto(
            'Sirilik III', 
            46, 
            ['Sunrise', 'Lightning Shower', 'Thump']
        )], 
        550, 
        rect(316, 225, 8, 1),
        [],
        [],
        (me, you) => {
            if(me.equipped == 0) {
                if(!you.effects.includes('asleep')) {
                    return [1, 2, -1];
                }
                if(Math.floor(Math.random() * 10) + 1 < 3) {
                    return [1, 3, -1];
                }
                return [1, 1, -1];
            }
            if(Math.floor(Math.random() * 10) + 1 == 1) {
                return [1, 3, -1];
            }
            if(me.caught[me.equipped].effects.length > 0) {
                return [1, 1, -1];
            }
            return [1, 2, -1];
        }
    ), 
    new TrainerProto(
        'Geologist Utah', // route 5 trainer 8
        'Did you know that we\'re standing right along a fault line as we speak? In other words, the ground could shatter at any moment!', 
        [new CaughtProto(
            'Slimshaidy', 
            45, 
            ['Light', 'Spew', 'Torch']
        ), new CaughtProto(
            'Shadisk', 
            47, 
            ['Sleet', 'Pure Darkness', 'Enchant']
        ), new CaughtProto(
            'Reflexic', 
            46, 
            ['Wave Shower', 'Weaken', 'Snare']
        )], 
        910, 
        [[338, 234], [339, 234], [340, 234], [338, 235], [340, 235], [338, 236], [339, 236], [340, 236]], 
        [],
        [], 
        (me, you) => {
            if(me.equipped == 0) {
                if(!you.effects.includes('burned')) {
                    return [1, 1, -1];
                }
                if(me.caught[me.equipped].tempstats[0] <= you.tempstats[0]) {
                    return [1, 2, -1];
                }
                return [1, 3, -1];
            }
            if(me.equipped == 1) {
                if(you.effects.length < 1) {
                    return [1, Math.floor(Math.random() * 2) * 2 + 1, -1];
                }
                return [1, 2, -1];
            }
            if(you.tempstats[0] > 0) {
                return [1, 2, -1];
            }
            if(you.effects.length < 1) {
                return [1, 3, -1];
            }
            return [1, 1, -1];
        }
    ), 
    new TrainerProto(
        'Sailor Sydney', // route 5 trainer 9
        'Ahoy there! Time for us to get down and battle - let\'s go!!', 
        [new CaughtProto(
            'Sirilik II', 
            47, 
            ['Sunrise', 'Spore Plant']
        ), new CaughtProto(
            'Fumulus', 
            47, 
            ['Toxin Shower', 'Strengthen', 'Cloud Over', 'Suspicious Mixture']
        )], 
        800, 
        rect(362, 232, 9, 1), 
        [],
        [],
        (me, you) => {
            if(me.equipped == 0) {
                if(!you.effects.includes('leech seed')) {
                    return [1, 2, -1];
                }
                return [1, 1, -1];
            }
            if(!you.effects.includes('poisoned')) {
                return [1, 4, -1];
            }
            if(me.caught[me.equipped].tempstats[0] < 1) {
                return [1, 2, -1];
            }
            if(you.temphp / you.stats[5] >= 0.5) {
                return [1, 1, -1];
            }
            return [1, 3, -1];
        }
    ), 
    // arena 5 (5 trainers including boss) Fumulus, Gasper, all siriliks, Slithan, Tulong (? (not poison type))
    new TrainerProto(
        'Mad Scientist Shea', // arena 5 trainer 1
        'I\'ve brewed up some toxins for this very occasion! Here, try some out!', 
        [new CaughtProto(
            'Tulong', 
            40, 
            ['Amper Craze', 'Toughen Up', 'String Snare']
        ), new CaughtProto(
            'Slithan', 
            41, 
            ['Noxious Fumes', 'Toxin Shower', 'Charge Up']
        )], 
        600, 
        rect(23, 178, 1, 2), 
        [],
        [],
        (me, you) => {
            if(me.equipped == 0) {
                if(me.caught[me.equipped].tempstats[1] < 1) {
                    return [1, 2, -1];
                }
                if(you.temphp / you.stats[5] >= 0.5) {
                    return [1, 3, -1];
                }
                return [1, 1, -1];
            }
            if(!you.effects.includes('paralyzed')) {
                return [1, 3, -1];
            }
            if(!you.effects.includes('poisoned')) {
                return [1, 1, -1];
            }
            return [1, 2, -1];
        }
    ), 
    new TrainerProto(
        'Bug Catcher Briar', // arena 5 trainer 2
        'My bug-catching methods are quite extraordinary - indeed, you won\'t find my battle style ordinary!', 
        [new CaughtProto(
            'Gasper', 
            42, 
            ['Strengthen', 'Weaken']
        ), new CaughtProto(
            'Fumulus', 
            42, 
            ['Toxin Shower', 'Cloud Over', 'Suspicious Mixture']
        )], 
        610, 
        rect(57, 174, 1, 5), 
        [],
        [],
        (me, you) => {
            if(me.equipped == 0) {
                return [1, Math.floor(Math.random() * 2) + 1, -1];
            }
            if(!you.effects.includes('poisoned')) {
                return [1, 3, -1];
            }
            if(me.caught[me.equipped].temphp / me.caught[me.equipped].stats[5] > 0.6) {
                return [1, 2, -1];
            }
            return [1, 1, -1];
        }
    ), 
    new TrainerProto(
        'Neuroscientist Wren', // arena 5 trainer 3
        'I\'m going to need to put you to sleep to perform this operation...', 
        [new CaughtProto(
            'Sirilik II', 
            43, 
            ['Lightning Shower', 'Toxin Shower', 'Spore Plant']
        )], 
        630, 
        [[46, 180]],
        [],
        [],
        (me, you) => {
            if(!you.effects.includes('leech seed') && Math.floor(Math.random() * 100) + 1 >= 70) {
                return [1, 3, -1];
            }
            if(you.temphp % 2 == 0) {
                return [1, 2, -1];
            }
            return [1, 1, -1];
        }
    ), 
    new TrainerProto(
        'Assassin Keaton', // arena 5 trainer 4
        'You\'re pretty good, trainer! That means it\'s gonna be even more fun to take you down!!', 
        [new CaughtProto(
            'Slithan', 
            44, 
            ['Slow Seep', 'Toughen Up', 'Noxious Fumes']
        ), new CaughtProto(
            'Fumulus', 
            45, 
            ['Enchant', 'Strengthen', 'Smother']
        )], 
        650,
        rect(54, 166, 1, 2), 
        [],
        [],
        (me, you) => {
            if(me.equipped == 0) {
                if(me.caught[me.equipped].tempstats[1] < 0) {
                    return [1, 2, -1];
                }
                if(me.caught[me.equipped].temphp > you.temphp) {
                    return [1, 1, -1];
                }
                return [1, 3, -1];
            }
            if(!you.effects.includes('asleep')) {
                return [1, 1, -1];
            }
            if(me.caught[me.equipped].tempstats[0] < 1) {
                return [1, 2, -1];
            }
            return [1, 3, -1];
        }
    ), 
    new TrainerProto(
        'SIRILIK_DEPLOYER_345', // arena 5 trainer 4.5
        'I_AM_NUMBER_3', 
        [new CaughtProto(
            'Sirilik III', 
            46, 
            ['Lightning Shower', 'Cloud Over', 'Weaken']
        )], 
        333, 
        rect(66, 188, 3, 1),
        [],
        [],
        (me, you) => {
            if(you.tempstats[0] >= 0) {
                return [1, 3, -1];
            }
            return [1, Math.floor(Math.random() * 2) + 1, -1];
        }
    ), 
    new TrainerProto(
        'Poison Boss Tavi', // arena 5 boss
        'It\'s me, the master of all toxins! Beat me in this battle and you\'ll have access to the prestigious Electric Arena!', 
        [new CaughtProto(
            'Sirilik I', 
            40, 
            ['Sprint', 'Suspicious Mixture', 'Charge Up']
        ), new CaughtProto(
            'Sirilik II', 
            42, 
            ['Lightning Shower', 'Light']
        ), new CaughtProto(
            'Sirilik III', 
            48, 
            ['Sunrise', 'Toxin Shower', 'Spore Plant']
        ), new CaughtProto(
            'Sirilik III', 
            46,
            ['Max Nerf']
        )], 
        700, 
        rect(35, 196, 1, 8), 
        ['Magic elixir'], 
        [1],
        (me, you) => {
            if(me.equipped == 0) {
                if(!you.effects.includes('paralyzed')) {
                    return [1, 3, -1];
                }
                if(!you.effects.includes('poisoned')) {
                    return [1, 2, -1];
                }
                return [1, 1, -1];
            }
            if(me.equipped == 1) {
                if(!you.effects.includes('burned')) {
                    return [1, 2, -1];
                }
                return [1, 1, -1];
            }
            if(me.equipped == 2) {
                if(me.caught[me.equipped].temphp / me.caught[me.equipped].stats[5] < 0.5) {
                    if(me.caught[3].temphp > 0) {
                        return [2, 4, -1];
                    }
                    if(me.inventory.length > 0) {
                        return [3, 1, 3];
                    }
                }
                if(me.caught[me.equipped].effects.length > 1) {
                    return [1, 1, -1];
                }
                if(!you.effects.includes('leech seed')) {
                    return [1, 3, -1];
                }
                return [1, 2, -1];
            }
            return [1, 1, -1];
        }
    ), 
    new TrainerProto(
        'Florist Bay', // route 6 trainer 1
        'Don\'t worry, I\'ll find the perfect flowers to fit your Discits!', 
        [new CaughtProto(
            'Wrathorn', 
            44, 
            ['Snare', 'Stifle', 'Tunnel']
        ), new CaughtProto(
            'Tearose', 
            49, 
            ['Thorn Shower', 'Vine Tangle', 'Enchant']
        )], 
        500, 
        rect(405, 166, 1, 4), 
        [],
        [], 
        (me, you) => {
            if(me.equipped == 0) {
                if(me.caught[me.equipped].tempstats[3] <= you.tempstats[3]) {
                    return [1, 3, -1];
                }
                if(!you.effects.includes('leech seedd')) {
                    return [1, 1, -1];
                }
                return [1, 2, -1];
            }
            if(!you.effects.includes('asleep')) {
                return [1, 3, -1];
            }
            if(you.temphp / you.stats[5] > 0.5) {
                return [1, 2, -1];
            }
            return [1, 1, -1];
        }
    ), 
    new TrainerProto(
        'Guard Channing', // route 6 trainer 2
        'You shall not pass!!! Well, unless you defeat me...', 
        [new CaughtProto(
            'Miracule', 
            48, 
            ['Flap', 'Bonk']
        ), new CaughtProto(
            'Talemes', 
            49, 
            ['Vacuum Claw', 'Torch']
        ), new CaughtProto(
            'Legenden',
            50, 
            ['Hurl Attack', 'Sprint', 'Light']
        )], 
        650, 
        rect(382, 161, 8, 1), 
        [],
        [],
        (me, you) => {
            if(me.equipped == 0) {
                if(!you.effects.includes('confused')) {
                    return [1, 2, -1];
                }
                return [1, 1, -1];
            }
            if(me.equipped == 1) {
                return [1, Math.floor(Math.random() * 2) + 1, -1];
            }
            if(!you.effects.includes('burned')) {
                return [1, 3, -1];
            }
            if(me.caught[me.equipped].tempstats[4] < 1) {
                return [1, 2, -1];
            }
            return [1, 1, -1];
        }
    ), 
    new TrainerProto(
        'Lawyer Isa', // route 6 trainer 3
        'This Discit battle will be a test of our logic and reasoning abilities in a high-stress scenario!', 
        [new CaughtProto(
            'Aquish', 
            50, 
            ['Thump', 'Mist Ray', 'Pour Out']
        ), new CaughtProto(
            'Reflexic', 
            52, 
            ['Wave Shower', 'Bonk']
        ), new CaughtProto(
            'Wavelash', 
            54, 
            ['Max Buff', 'Floodwater', 'Sleet']
        )], 
        545, 
        [[409, 158]],
        [],
        [],
        (me, you) => {
            if(me.equipped == 0) {
                if(you.temphp / you.stats[5] > 0.67) {
                    return [1, 3, -1];
                }
                if(you.temphp / you.stats[5] > 0.33) {
                    return [1, 2, -1];
                }
                return [1, 1, -1];
            }
            if(me.equipped == 1) {
                if(!you.effects.includes('confused')) {
                    return [1, 2, -1];
                }
                return [1, 1, -1];
            }
            if(!you.effects.includes('frozen')) {
                return [1, 3, -1];
            }
            if(me.caught[me.equipped].tempstats[0] < 3) {
                return [1, 1, -1];
            }
            return [1, 2, -1];
        }
    ), 
    new TrainerProto(
        'Pharmacist Lane', // route 6 trainer 4
        'My Discits are out of this world! And so is my utility!', 
        [new CaughtProto(
            'Raskett', 
            54, 
            ['Beatdown', 'Shadow Wrap', 'Lightning Shower']
        ), new CaughtProto(
            'Cloakork', 
            53, 
            ['Sunrise', 'Enchant', 'Pure Darkness']
        )], 
        800, 
        [[363, 158]],
        ['Water'], 
        [2],
        (me, you) => {
            if(me.caught[me.equipped].temphp / me.caught[me.equipped].stats[5] < 0.6 && me.inventory.length > 0) {
                return [3, 1, me.equipped + 1];
            }
            if(me.equipped == 0) {
                if(Math.random() > (me.caught[me.equipped].stats[5] / me.caught[me.equipped].temphp) * 2.5) {
                    return [1, 1, -1];
                }
                if(me.caught[me.equipped].temphp / me.caught[me.equipped].stats[5] < 0.6) {
                    return [1, 2, -1];
                }
                return [1, 3, -1];
            }
            if(me.equipped == 1) {
                if(me.caught[me.equipped].effects.length > 1) {
                    return [1, 1, -1];
                }
                if(!you.effects.includes('asleep')) {
                    return [1, 2, -1];
                }
                return [1, 3, -1];
            }
        }
    ), 
    new TrainerProto(
        'Baseball Coach Tatum', // route 6 trainer 5
        'Three strikes from my Discit and you\'re out!', 
        [new CaughtProto(
            'Godzimian', 
            57, 
            ['Burning Fury', 'Coin Flip']
        )], 
        500,
        rect(375, 145, 1, 8), 
        [],
        [],
        (me, you) => {
            if(me.caught[me.equipped].temphp / me.caught[me.equipped].stats[5] > 0.4) {
                return [1, 1, -1];
            }
            return [1, 2, -1];
        }
    ), 
    new TrainerProto(
        'Priest Toni', // route 6 trainer 6
        'Your Discits are nothing but ants compared to mine...', 
        [new CaughtProto(
            'Tornatian', 
            53, 
            ['Vacuum Claw', 'Quick Dodge', 'Rip Up']
        ), new CaughtProto(
            'Bluricane', 
            55, 
            ['Sunrise', 'Spore Plant', 'Flap']
        ), new CaughtProto(
            'Gikatail', 
            56, 
            ['Vine Tangle', 'Hurl Attack', 'Max Buff']
        )], 
        450, 
        rect(397, 145, 1, 8), 
        [],
        [],
        (me, you) => {
            if(me.equipped == 0) {
                if(me.caught[me.equipped].tempstats[5] <= 0) {
                    return [1, 2, -1];
                }
                if(me.caught[me.equipped].tempstats[4] <= 2) {
                    return [1, 3, -1];
                }
                return [1, 1, -1];
            }
            if(me.equipped == 1) {
                if(me.caught[me.equipped].effects.length > 2) {
                    return [1, 1, -1];
                }
                if(!you.effects.includes('leech seed') && Math.random() >= 0.5) {
                    return [1, 2, -1];
                }
                return [1, 3, -1];
            }
            if(me.caught[me.equipped].tempstats[0] <= 0 || me.caught[me.equipped].tempstats[1] <= 0) {
                return [1, 3, -1];
            }
            if(me.caught[me.equipped].tempstats[2] <= 2) {
                return [1, 1, -1];
            }
            return [1, 2, -1];
        }
    ), 
    new TrainerProto(
        'FLight Attendant Jude', // route 6 trainer 7
        'Aaaand we\'ve reached a cruising altitude of 100,000 feet! Wait a second, that\'s way too high!!', 
        [new CaughtProto(
            'Legenden', 
            55, 
            ['Beatdown', 'Hurl Attack', 'Bonk', 'Thump']
        ), new CaughtProto(
            'Bluricane', 
            57, 
            ['Tornado Assault', 'Sleet', 'Pour Out']
        )], 
        756, 
        rect(398, 135, 1, 2), 
        [],
        [], 
        (me, you) => {
            if(me.equipped == 0) {
                const rand = Math.random();
                if(rand < .08) {
                    return [1, 1, -1];
                }
                if(rand < .2) {
                    return [1, 4, -1];
                }
                if(!you.effects.includes('confused')) {
                    return [1, 3, -1];
                }
                return [1, 2, -1];
            }
            if(!you.effects.includes('frozen') && you.temphp / you.stats[5] <= 0.5) {
                return [1, 2, -1];
            }
            if(Math.random() <= 0.65) {
                return [1, 3, -1];
            }
            return [1, 1, -1];
        }
    ), 
    new TrainerProto(
        'Gene the Gambler', // route 6 trainer 8
        'I\'ll bet 400 coins on this battle! Actually, make it 500!', 
        [new CaughtProto(
            'Shadisk', 
            57, 
            ['Sleet', 'Pure Darkness', 'Enchant', 'Sunrise']
        ), new CaughtProto(
            'Cloakork', 
            58, 
            ['Shadow Wrap', 'Charge Up']
        ), new CaughtProto(
            'Tearose', 
            59, 
            ['Shadow Wrap', 'Beatdown', 'Suspicious Mixture']
        )], 
        500, 
        rect(374, 135, 1, 2), 
        [],
        [],
        (me, you) => {
            if(me.equipped == 0) {
                if(me.caught[me.equipped].temphp / me.caught[me.equipped].stats[5] < 0.5 && me.caught[1].temphp > 0) {
                    return [2, 2, -1];
                }
                if(!you.effects.includes('frozen')) {
                    return [1, 1, -1];
                }
                if(!you.effects.includes('asleep') && Math.random() > 0.6) {
                    return [1, 3, -1];
                }
                if(me.caught[me.equipped].effects.length > 1) {
                    return [1, 4, -1];
                }
                return [1, 2, -1];
            }
            if(me.equipped == 1) {
                if(me.caught[0].temphp > 0) {
                    return [2, 1, -1];
                }
                if(Math.random() > 0.55) {
                    return [1, 2, -1];
                }
                return [1, 1, -1];
            }
            if(!you.effects.includes('poisoned')) {
                return [1, 3, -1];
            }
            if(me.caught[me.equipped].temphp / me.caught[me.equipped].stats[5] < you.temphp / you.stats[5] - 0.4 && Math.random() > 0.75) {
                return [1, 2, -1];
            }
            return [1, 1, -1];
        }
    ),
    new TrainerProto(
        'Veterinarian Lex', // route 6 trainer 9
        'Your Discits look hurt! Unfortunately, I can\'t patch them up at the moment...', 
        [new CaughtProto(
            'Wavelash', 
            60, 
            ['Max Buff', 'Floodwater', 'Wave Shower']
        ), new CaughtProto(
            'Godzimian', 
            60, 
            ['Magma Floor', 'Lava Shower', 'Light']
        ), new CaughtProto(
            'Raskett', 
            56, 
            ['Lightning Shower', 'Toxin Shower', 'Thorn Shower', 'Lava Shower']
        )], 
        849, 
        rect(371, 126, 1, 3), 
        [],
        [],
        (me, you) => {
            if(me.equipped == 0) {
                if(me.caught[me.equipped].tempstats[0] < 0) {
                    return [1, 1, -1];
                }
                return [1, Math.floor(Math.random() * 2) + 2, -1];
            }
            if(me.equipped == 1) {
                if(!you.effects.includes('burned')) {
                    return [1, Math.floor(Math.random() * 2) * 2 + 1, -1];
                }
                return [1, 2, -1];
            }
            return [1, Math.floor(Math.random() * 4) + 1, -1];
        }
    ), 
    new TrainerProto(
        'Butcher Jo', // route 6 trainer 10
        'Believe it or not, I\'m the final trainer before the Route 6 Arena!!', 
        [new CaughtProto(
            'Weizel', 
            20, 
            ['Pummel', 'Bonk', 'Leaf Blower']
        ), new CaughtProto(
            'Simmatree', 
            40, 
            ['Charge Up', 'Thorn Shower', 'Coin Flip']
        ), new CaughtProto(
            'Gikatail', 
            60, 
            ['Dismissal', 'Max Buff', 'Sprint']
        ), new CaughtProto(
            'Stilagon', 
            60, 
            ['Shadow Wrap', 'Sleet', 'Vacuum Claw']
        )], 
        1001, 
        rect(401, 126, 1, 3), 
        [],
        [],
        (me, you) => {
            if(me.equipped == 0) {
                if(!you.effects.includes('confused')) {
                    return [1, 2, -1];
                }
                if(you.temphp / you.stats[5] > 0.5) {
                    return [1, 1, -1];
                }
                return [1, 3, -1];
            }
            if(me.equipped == 1) {
                if(!you.effects.includes('paralyzed') && Math.random() >= 0.7) {
                    return [1, 1, -1];
                }
                if(!you.effects.includes('asleep')) {
                    return [1, 3, -1];
                }
                return [1, 2, -1];
            }
            if(me.equipped == 2) {
                if(me.caught[me.equipped].tempstats[4] <= you.tempstats[4]) {
                    return [1, 3, -1];
                }
                if(me.caught[me.equipped].tempstats[2] <= 2) {
                    return [1, 2, -1];
                }
                return [1, 1, -1];
            }
            if(!you.effects.includes('frozen') && you.temphp / you.stats[5] > 0.5) {
                return [1, 2, -1];
            }
            if(me.caught[me.equipped].tempstats[0] <= 5) {
                return [1, 1, -1];
            }
            return [1, 3, -1];
        }
    ), 
    // arena 6 - 5 trainers + boss [electric + dark(?)] - (Yavolt1, Amperas1), (Shocklet1, Zappstrike2), (Tulong1) - add(?): Stilagon, (Shadisk1, Cloakork)
    new TrainerProto(
        'Electrician Clover', // arena 6 trainer 1
        'Ok, the arena\'s all set up! Let\'s battle!', 
        [new CaughtProto(
            'Shocklet', 
            48, 
            ['String Snare', 'Amper Craze', 'Toughen Up']
        )], 
        950, 
        rect(55, 256, 3, 1), 
        ['Water'], 
        [1],
        (me, you) => {
            if(me.caught[me.equipped].temphp / me.caught[me.equipped].stats[5] < 0.5 && me.inventory.length > 0) {
                return [3, 1, 1];
            }
            if(me.caught[me.equipped].tempstats[1] < 0) {
                return [1, 3, -1];
            }
            if(you.tempstats[4] > -1) {
                return [1, 1, -1];
            }
            return [1, 2, -1];
        }
    ), 
    new TrainerProto(
        'Lev "Lightning Rod" Sanchez', // arena 6 trainer 2
        'They call me Lightning Rod because I got so many electric-type Discits up my sleeve!', 
        [new CaughtProto(
            'Amperas', 
            48, 
            ['Charge Up', 'Static']
        ), new CaughtProto(
            'Yavolt', 
            50, 
            ['Beatdown', 'Lightning Shower', 'Toxin Shower', 'Sunrise']
        )], 
        960, 
        rect(61, 254, 3, 1), 
        ['Slurpee'], 
        [1],
        (me, you) => {
            if(me.caught[me.equipped].temphp / me.caught[me.equipped].stats[5] < 0.5 && me.inventory.length > 0) {
                return [3, 1, me.equipped + 1];
            }
            if(me.equipped == 0) {
                if(!you.effects.includes('paralyzed')) {
                    return [1, 1, -1];
                }
                return [1, 2, -1];
            }
            if(me.caught[me.equipped].effects.length >= you.effects.length) {
                return [1, Math.floor(Math.random() * 2) * 3 + 1, -1];
            }
            return [1, Math.floor(Math.random() * 2) + 2, -1];
        }
    ), 
    new TrainerProto(
        'Metalworker Pearl', // arena 6 trainer 3
        'I\'m forging my own path to victory, just like you!!', 
        [new CaughtProto(
            'Tulong', 
            51, 
            ['Suspicious Mixture', 'Toughen Up', 'Amper Craze']
        ), new CaughtProto(
            'Shadisk', 
            52, 
            ['Sleet', 'Pure Darkness', 'Sunrise', 'Enchant']
        )], 
        970,
        rect(72, 263, 5, 1), 
        ['Energy drink'], 
        [1],
        (me, you) => {
            if(me.caught[me.equipped].temphp / me.caught[me.equipped].stats[5] < 0.5 && me.inventory.length > 0) {
                return [3, 1, me.equipped + 1];
            }
            if(me.equipped == 0) {
                if(!you.effects.includes('poisoned')) {
                    return [1, 1, -1];
                }
                if(me.caught[me.equipped].tempstats[1] < 1) {
                    return [1, 2, -1];
                }
                return [1, 3, -1];
            }
            if(you.effects.length < 1) {
                if(discits[you._base].element == 'fire' || discits[you._base].element == 'Water') {
                    return [1, 1, -1];
                }
                return [1, 4, -1];
            }
            if(me.caught[me.equipped].effects.length > 0) {
                return [1, 3, -1];
            }
            return [1, 2, -1];
        }
    ), 
    new TrainerProto(
        'Magician Zappy', // arena 6 trainer 4
        'And just like that, the battle has begun! Good luck!', 
        [new CaughtProto(
            'Zappstrike', 
            55, 
            ['Beatdown', 'Thump']
        ), new CaughtProto(
            'Zappstrike', 
            55, 
            ['Electron Pulse', 'Lightning Shower', 'Flap']
        )], 
        980, 
        rect(67, 270, 1, 2), 
        ['Magic elixir'], 
        [1],
        (me, you) => {
            if(me.caught[me.equipped].temphp / me.caught[me.equipped].stats[5] < 0.5 && me.inventory.length > 0) {
                return [3, 1, me.equipped + 1];
            }
            if(me.equipped == 0) {
                if(you.effects.length < 7) {
                    return [1, 1, -1];
                }
                if(me.caught[1].temphp > 0) {
                    return [2, 2, -1];
                }
                return [1, 2, -1];
            }
            if(you.effects.length < 6 && me.caught[0].temphp > 0) {
                return [2, 1, -1];
            }
            const rand = Math.floor(Math.random() * 100) + 1; // 1-100
            if(rand > 75) {
                return [1, 3, -1];
            }
            if(rand > 25) {
                return [1, 1, -1];
            }
            return [1, 2, -1];
        }
    ), 
    new TrainerProto(
        'Software Developer Lumen', // arena 6 trainer 5
        'Somewhere out there, we\'re all just ones and zeros...', 
        [new CaughtProto(
            'Amperas', 
            41, 
            ['Weaken', 'String Snare']
        ), new CaughtProto(
            'Shocklet', 
            51,
            ['Toughen Up', 'Amper Craze']
        ), new CaughtProto(
            'Shadisk', 
            56, 
            ['Pummel', 'Stifle']
        )], 
        990, 
        rect(80, 270, 1, 2), 
        ['Dodge module'], 
        [20],
        (me, you) => {
            if(me.caught[me.equipped].tempstats[5] < 3 && me.inventory.length > 0) {
                return [3, 1, me.equipped + 1];
            }
            if(me.equipped == 0) {
                if(you.tempstats[0] > -1) {
                    return [1, 1, -1];
                }
                return [1, 2, -1];
            }
            if(me.equipped == 1) {
                if(me.caught[me.equipped].tempstats[1] <= you.tempstats[1]) {
                    return [1, 1, -1];
                }
                return [1, 2, -1];
            }
            return [1, Math.floor(Math.random() * 2) + 1, -1];
        }
    ), 
    new TrainerProto(
        'Electric Boss Pulsar', // arena 6 boss
        'Get ready, trainer! You\'re about to face the toughest boss around these parts!!', 
        [new CaughtProto(
            'Yavolt', 
            58, 
            ['Electron Pulse', 'Lightning Shower', 'Charge Up']
        ), new CaughtProto(
            'Cloakork', 
            59, 
            ['Max Buff', 'Shadow Wrap']
        ), new CaughtProto(
            'Zappstrike', 
            60, 
            ['Electron Pulse', 'Quick Dodge', 'First Strike']
        ), new CaughtProto(
            'Cloakork', 
            61, 
            ['Max Nerf', 'Sleet', 'Pure Darkness']
        ), new CaughtProto(
            'Stilagon', 
            62, 
            ['Ancient Force', 'Shadow Wrap', 'Vacuum Claw', 'Sunrise']
        )], 
        1000, 
        rect(93, 259, 6, 1), 
        [],
        [], 
        (me, you) => {
            if(me.equipped == 0) {
                if(!you.effects.includes('paralyzed')) {
                    return [1, 3, -1];
                }
                if(you.temphp / you.stats[5] > 0.6) {
                    return [1, 2, -1];
                }
                return [1, 1, -1];
            }
            if(me.equipped == 1) {
                if(me.caught[me.equipped].tempstats[6] < 3) {
                    return [1, 1, -1];
                }
                return [1, 2, -1];
            }
            if(me.equipped == 2) {
                if(me.caught[me.equipped].temphp == me.caught[me.equipped].stats[5]) {
                    return [1, 3, -1];
                }
                if(me.caught[me.equipped].tempstats[5] <= you.tempstats[6]) {
                    return [1, 2, -1];
                }
                return [1, 1, -1];
            }
            if(me.equipped == 3) {
                if(!you.effects.includes('frozen')) {
                    return [1, 2, -1];
                }
                if(you.tempstats[0] > -3) {
                    return [1, 1, -1];
                }
                return [1, 3, -1];
            }
            if(me.caught[me.equipped].temphp == me.caught[me.equipped].stats[5]) {
                return [1, 2, -1];
            }
            if(me.caught[me.equipped].effects.length > 1) {
                return [1, 4, -1];
            }
            return [1, Math.floor(Math.random() * 2) * 2 + 1, -1];
        }
    ), 
    new TrainerProto(
        'Discit Champion Ace', // final boss
        'Let\'s do this, trainer. It\'s not every day that I\'m challenged by such a promising fighter.', 
        [new CaughtProto(
            'Tearose', 
            60, 
            ['Max Nerf', 'Shadow Wrap', 'Beatdown', 'Vine Tangle']
        ), new CaughtProto(
            'Wavelash', 
            60, 
            ['Max Buff', 'Floodwater', 'Hurl Attack']
        ), new CaughtProto(
            'Tuburn', 
            60, 
            ['Dismissal', 'Magma Floor', 'Bonk']
        ), new CaughtProto(
            'Bluricane', 
            60, 
            ['Tornado Assault', 'Sunrise', 'Spore Plant']
        ), new CaughtProto(
            'Sirilik III', 
            60, 
            ['Electron Pulse', 'Toxin Shower', 'Lightning Shower', 'Light']
        ), new CaughtProto(
            'Stilagon', 
            60, 
            ['Heart Attack', 'Sleet', 'Pummel']
        )], 
        10000, 
        rect(304, 67, 1, 25), 
        [],
        [],
        (me, you) => {
            if(me.equipped == 0) {
                if(you.tempstats[0] >= 0) {
                    return [1, 1, -1];
                }
                if(me.caught[me.equipped].effects.length > you.effects.length) {
                    return [1, 3, -1];
                }
                if(me.caught[me.equipped].tempstats[2] <= 1) {
                    return [1, 4, -1];
                }
                return [1, 2, -1];
            }
            if(me.equipped == 1) {
                if(me.caught[me.equipped].tempstats[4] <= you.tempstats[4]) {
                    return [1, 1, -1];
                }
                return [1, Math.floor(Math.random() * 2) + 2, -1];
            }
            if(me.equipped == 2) {
                if(Math.random() > 0.6 && me.caught[3].temphp > 0) {
                    return [2, 4, -1];
                }
                if(!you.effects.includes('confused')) {
                    return [1, 3, -1];
                }
                if(you.tempstats[4] >= -2) {
                    return [1, 1, -1];
                }
                return [1, 2, -1];
            }
            if(me.equipped == 3) {
                if(Math.random() > 0.75 && me.caught[2].temphp > 0) {
                    return [2, 3, -1];
                }
                if(me.caught[me.equipped].effects.length > 1) {
                    return [1, 2, -1];
                }
                if(!you.effects.includes('leech seed')) {
                    return [1, 3, -1];
                }
                return [1, 1, -1];
            }
            if(me.equipped == 4) {
                if(!you.effects.includes('burned') && Math.random() > 0.7) {
                    return [1, 4, -1];
                }
                if(Math.random() > 0.6) {
                    return [1, 1, -1];
                }
                return [1, Math.floor(Math.random() * 2) + 2, -1];
            }
            if(me.equipped == 5) {
                if(me.caught[me.equipped].temphp == me.caught[me.equipped].stats[5]) {
                    return [1, 1, -1];
                }
                if(!you.effects.includes('frozen')) {
                    return [1, 2, -1];
                }
                return [1, 3, -1];
            }
        }
    )
];

module.exports = trainers;
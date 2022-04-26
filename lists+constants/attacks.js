const Attack = require('../classes/cls_attack');

const attacks = {
    'Empty': new Attack('normal', 0, 0, 0, [], [], false, 0), 

    //normal
    'Thump': new Attack('normal', 50, 45, 100, [], [], false, 0),
    'Pummel': new Attack('normal', 25, 60, 200, [], [['you', 'confused', 10]], false, 0),
    'First Strike': new Attack('normal', 40, 45, 200, [], [], false, 9),
    'Tunnel': new Attack('normal', 50, 10, 200, [['me', 1, 2], ['me', 3, 2]], [], false, 0),
    'Hurl Attack': new Attack('normal', 10, 90, 100, [], [], false, 0),
    'Barrage of Fists': new Attack('normal', 5, 150, 85, [], [], false, 0),
    
    'Coin Flip': new Attack('normal', 15, 40, 50, [], [['me', 'asleep', 50], ['you', 'asleep', 50]], false, 0),
    'Wobble': new Attack('normal', 45, 25, 100, [], [], false, 0),
    
    //water
    'Mist Ray': new Attack('Water', 30, 40, 100, [], [], true, 0),
    'Spray': new Attack('Water', 25, 55, 90, [], [['you', 'frozen', 35]], false, 0),
    'Floodwater': new Attack('Water', 10, 90, 100, [['me', 1, 2]], [], true, 0),
    'Wave Shower': new Attack('Water', 18, 70, 100, [], [], false, 0),
    'Pour Out': new Attack('Water', 35, 45, 200, [], [['you', 'frozen', 15]], true, 0),
    'Infinity Rain': new Attack('Water', 5, 140, 85, [['me', 5, 1], ['you', 6, -1]], [['you', 'asleep', 40]], true, 0),
    
    //fire
    'Aflame': new Attack('fire', 30, 40, 100, [], [], true, 0),
    'Torch': new Attack('fire', 25, 55, 90, [], [['you', 'burned', 25]], false, 0), 
    'Magma Floor': new Attack('fire', 10, 95, 90, [], [['you', 'burned', 40]], true, 0),
    'Lava Shower': new Attack('fire', 18, 70, 100, [], [], false, 0),
    'Spew': new Attack('fire', 35, 45, 200, ['me', 0, 1], [], true, 0),
    'Burning Fury': new Attack('fire', 5, 150, 75, [['me', 0, 2]], [['you', 'burned', 100]], true, 0),
    
    //grass
    'Sprout': new Attack('grass', 30, 40, 100, [], [], true, 0),
    'Snare': new Attack('grass', 25, 55, 90, [], [['you', 'leech seed', 30]], false, 0),
    'Vine Tangle': new Attack('grass', 10, 80, 200, [['me', 0, 1], ['me', 2, 1]], [['you', 'leech seed', 20]], true, 0),
    'Thorn Shower': new Attack('grass', 18, 70, 100, [], [], false, 0),
    'Leaf Blower': new Attack('grass', 35, 45, 200, [], [['you', 'leech seed', 20]], true, 0),
    'Ancient Force': new Attack('grass', 5, 135, 95, [['me', 1, 2]], [['you', 'confused', 20], ['you', 'leech seed', 20]], true, 0),
    
    //flying
    'Windmill': new Attack('flying', 35, 40, 80, [], [], false, 0),
    'Flap': new Attack('flying', 25, 75, 90, [], [['me', 'confused', 30]], false, 0),
    'Tornado Assault': new Attack('flying', 10, 120, 75, [], [], true, 0),
    'Vacuum Claw': new Attack('flying', 18, 70, 100, [], [], false, 0),
    'Rip Up': new Attack('flying', 30, 50, 200, [['me', 4, 2]], [], true, 0),
    'Blink of an Eye': new Attack('flying', 5, 160, 70, [['me', 4, 1]], [['me', 'confused', 35], ['you', 'paralyzed', 10]], true, 1),
    
    //poison
    'Smother': new Attack('poison', 40, 60, 200, [], [['you', 'poisoned', 10]], true, 0),
    'Cloud Over': new Attack('poison', 25, 60, 100, [], [['you', 'poisoned', 30], ['me', 'poisoned', 15]], false, 0),
    'Noxious Fumes': new Attack('poison', 10, 85, 95, [], [['you', 'poisoned', 50]], true, 0),
    'Toxin Shower': new Attack('poison', 18, 70, 100, [], [], false, 0),
    'Slow Seep': new Attack('poison', 45, 45, 90, [['you', 4, -2]], [], true, 0),
    'Final Breath': new Attack('poison', 5, 100, 200, [], [['you', 'poisoned', 100], ['you', 'burned', 25]], true, 0),
    
    //electric
    'Static': new Attack('electric', 35, 40, 100, [], [['you', 'paralyzed', 20]], true, 1),
    'String Snare': new Attack('electric', 25, 20, 200, [['you', 4, -2], ['me', 4, 2]], [], false, 0),
    'Electron Pulse': new Attack('electric', 10, 105, 85, [], [['you', 'paralyzed', 45]], true, 0),
    'Lightning Shower': new Attack('electric', 18, 70, 100, [], [], false, 0),
    'Amper Craze': new Attack('electric', 30, 45, 200, [['me', 4, 1]], [['you', 'paralyzed', 15]], true, 0),
    'Dismissal': new Attack('electric', 5, 120, 100, [['you', 4, -3]], [['you', 'paralyzed', 100]], true, 1),
    
    //dark
    'Uneasy': new Attack('dark', 25, 40, 200, [], [], true, 0),
    'Stifle': new Attack('dark', 35, 60, 90, [], [], false, 0),
    'Shadow Wrap': new Attack('dark', 10, 80, 100, [['me', 0, 12], ['you', 1, -12], ['me', 6, -3]], [], true, 0),
    'Pure Darkness': new Attack('dark', 18, 70, 100, [], [], false, 0),
    'Silent Strangle': new Attack('dark', 30, 45, 100, [], [['you', 'asleep', 35]], true, 0),
    'Heart Attack': new Attack('dark', 5, 230, 50, [], [], true, 0),
    
    //effects only
    'Light': new Attack('fire', 35, 0, 200, [], [['you', 'burned', 90]], false, 0),
    'Spore Plant': new Attack('grass', 35, 0, 200, [], [['you', 'leech seed', 90]], false, 0),
    'Sleet': new Attack('Water', 35, 0, 200, [], [['you', 'frozen', 90]], false, 0),
    'Bonk': new Attack('normal', 35, 0, 200, [], [['you', 'confused', 90]], false, 0),
    'Enchant': new Attack('normal', 35, 0, 200, [], [['you', 'asleep', 90]], false, 0),
    'Charge Up': new Attack('electric', 35, 0, 200, [], [['you', 'paralyzed', 90]], false, 0),
    'Suspicious Mixture': new Attack('poison', 35, 0, 200, [], [['you', 'poisoned', 90]], false, 0),
    
    'Stare Down': new Attack('normal', 35, 0, 100, [['you', 1, -1]], [], false, 0), 
    'Weaken': new Attack('normal', 35, 0, 100, [['you', 0, -1]], [], false, 0),
    'Strengthen': new Attack('normal', 35, 0, 100, [['me', 0, 1]], [], false, 0),
    'Toughen Up': new Attack('normal', 35, 0, 100, [['me', 1, 1]], [], false, 0),
    
    'Sprint': new Attack('normal', 20, 0, 200, [['me', 4, 2]], [], false, 4),
    'Quick Dodge': new Attack('normal', 20, 0, 200, [['me', 5, 2], ['you', 6, -1]], [], false, 2),
    
    'Sunrise': new Attack('normal', 10, 0, 200, [], [['me', 'remove', 100]], true, 2),
    'Beatdown': new Attack('normal', 5, 0, 80, [], [['you', 'burned', 100], ['you', 'frozen', 100], ['you', 'leech seed', 100], ['you', 'confused', 100], ['you', 'paralyzed', 100], ['you', 'asleep', 100], ['you', 'poisoned', 100]], false, 0),
    'Max Buff': new Attack('normal', 3, 0, 80, [['me', 0, 1], ['me', 1, 1], ['me', 2, 1], ['me', 3, 1], ['me', 4, 1], ['me', 5, 1], ['me', 6, 1]], [], false, 0),
    'Max Nerf': new Attack('normal', 3, 0, 80, [['you', 0, -1], ['you', 1, -1], ['you', 2, -1], ['you', 3, -1], ['you', 4, -1], ['you', 5, -1], ['you', 6, -1]], [], false, 0)
};

module.exports = attacks;
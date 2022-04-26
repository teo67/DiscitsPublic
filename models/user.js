const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const caughtSchema = new Schema({
    _id: false,
    _base: String, 
    level: Number, // full caught schema
    currentXP: Number, 
    moveSet: [String], 
    PPSet: [Number], 
    fullMoves: [String], 
    nickname: String, 
    tempstats: [Number], 
    effects: [String], 
    effectOptions: {
        _id: false,
        poisonedvalue: Number, 
        sleepcounter: Number, 
        confusedcounter: Number, 
        leecher: String
    }, 
    IVs: [Number], 
    EVs: [Number], 
    stats: [Number],
    temphp: Number
});

const trainerSchema = new Schema({
    _id: false, 
    index: Number,
    caught: [caughtSchema],
    equipped: Number, 
    inventory: [String], 
    amounts: [Number]
});

const battleSchema = new Schema({
    _id: false, // should we only save metadata to one player in a 2p battle to save data? #11
    timestamp: Number, // can be undefined
    paused: Boolean,
    uid: String, // can be undefined
    trainer: trainerSchema,
    wild: caughtSchema, // can be undefined
    wager: Number, 
    mustSwap: Boolean, 
    p1participated: {
        type: [Number],
        default: undefined // for some reason we gotta do this so it doesnt make empty arrays
    },
    p2participated: {
        type: [Number], 
        default: undefined
    }
});

const cdSchema = new Schema({
    _id: false, 
    any: Number, 
    daily: Number, 
    weekly: Number
});

const userSchema = new Schema({
    _id: String,
    coins: Number, 
    caught: [caughtSchema], 
    discidex: [String],
    equipped: Number,
    _party: [Number], 
    inventory: [String], 
    amounts: [Number],
    location: [Number], 
    namedLocation: String, 
    sequenceProgression: Number,
    blacklist: [Number],
    trainerBlacklist: [String],
    wasText: Boolean,
    progression: Number,
    respawnPoint: [Number],
    findRate: Number, 
    battle: {
       type: battleSchema,
       default: {}
    },
    cds: {
        type: cdSchema, 
        default: {}
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
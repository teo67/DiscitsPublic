const User = require('../models/user');

const execute = async idInput => {
    try {
        return (await User.findOne({ _id: idInput }));
    } catch(e) {
        console.log(`Servers faied: ${e}`);
        return Promise.reject(e);
    }
}

module.exports = execute;
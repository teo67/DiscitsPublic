const returnEmbed = require('../functions/returnEmbed');
const fundamentals = require('../lists+constants/fundamentals');
const UserModel = require('../models/user');
const User = require('../classes/cls_user');
const Command = require('../classes/cls_command');

module.exports = new Command(
    'register', 
    'Starter',
    'This should be the very first command that you use, as it will register you for an account', 
    '',
    'Doesn\'t have an account already',
    {
        user: false
    },
    (message, args, results) => {
        const newUser = new UserModel(new User(message.author.id)); 
        newUser.save().then(() => {
            console.log('New user saved.');
            message.channel.send(returnEmbed(message.author, 'Account created!\nGo to https://discits.xyz/tutorial to get started.', 'Account Status'));
        }).catch(err => {
            console.log(`error adding user: ${err}`);
            message.channel.send(returnEmbed(message.author, 'Something\'s wrong with the servers... try again later.', 'Account Status'));
        }); 
        return;
    }
);
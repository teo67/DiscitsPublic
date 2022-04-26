const returnEmbed = require('../functions/returnEmbed');
const Command = require('../classes/cls_command');

module.exports = new Command(
    'power', 
    'Admin',
    '[ADMIN COMMAND] turns on/off one minute of downtime for the bot in preparation for an update.',
    '',
    'None',
    {
    },
    (message, args, results) => {
        if(message.author.id !== '898733545210662933') {
            message.channel.send(returnEmbed(message.author, 'You don\'t have permission to use this command!', 'Error'));
            return;
        }
        
        const currentVal = require('../lists+constants/fundamentals').downtime;
        require('../lists+constants/fundamentals').downtime = !currentVal; // i love pointers
        message.channel.send(returnEmbed(message.author, `downtime set to ${!currentVal}!`, 'Success!'));
        return;
    }
);       
      
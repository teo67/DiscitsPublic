const returnEmbed = require('../functions/returnEmbed');
const Command = require('../classes/cls_command');
const User = require('../classes/cls_user');

module.exports = new Command(
    'warp', 
    'Utility',
    'Using the warp ring, teleport to any location you wish!', 
    '[location (example: Route 1)]',
    'Has an account, is not currently in battle',
    {
        user: true, 
        battle: false, 
        args: {
            len: 1
        }
    },
    (message, args, results) => {
        const user = results.user; 
        if(!user.inventory.includes('Warp ring')) {
            message.channel.send(returnEmbed(message.author, 'You don\'t have the warp ring yet...', 'Error'));
            return;
        }

        const locations = ['Twigtown', 'Route 1', 'Route 2', 'Route 3', 'Route 4', 'Route 5', 'Route 6', 'Final Stage'];
        const locationLocations = [[155, 174], [186, 169], [165, 117], [102, 72], [221, 94], [291, 185], [386, 173], [310, 79]];

        let joined = '';
        for(let i = 0; i < args.length; i++) {
            joined += args[i];
            if(i != args.length - 1) {
                joined += ' ';
            }
        }

        if(!locations.includes(joined)) {
            message.channel.send(returnEmbed(message.author, 'Make sure to tell the ring where you want to go!', 'Error'));
            return;
        } 

        const locationIndex = locations.indexOf(joined);
        User.setCoords(user, locationLocations[locationIndex][0], locationLocations[locationIndex][1]);
        User.setLocation(user, locations[locationIndex]);

        message.channel.send(returnEmbed(message.author, `You have been warped to ${locations[locationIndex]}!`, 'Warp complete!'));
        return;
    }
);
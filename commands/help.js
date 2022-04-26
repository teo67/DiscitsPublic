const returnEmbed = require('../functions/returnEmbed');
const fundamentals = require('../lists+constants/fundamentals');
const client = fundamentals.client;
const prefix = fundamentals.prefix;
const Command = require('../classes/cls_command');

module.exports = new Command(
    'help', 
    'Starter',
    'Prints a list of commands or the description of a specific command.', 
    '[name of command (optional)]',
    'None',
    {},
    (message, args, results) => {
        if(args.length < 1) {
            let returning = 'Use \'help [command name]\' to view information on a specific command, or \'tutorial\' if you\'re just getting started.\n\n';
            let types = [];
            let names = [];
            client.commands.forEach(command => {
                const index = types.indexOf(command.type);
                if(index == -1) {
                    types.push(command.type);
                    names.push([command.name]);
                } else {
                    names[index].push(command.name);
                }
            });
            for(let i = 0; i < types.length; i++) {
                returning += `*${types[i]}*\n`;
                let currentLine = 0;
                for(const name of names[i]) {
                    returning += `***${name}***\xa0\xa0\xa0\xa0\xa0\xa0`;
                    currentLine += name.length + 4;
                    if(currentLine > 34) {
                        returning += '\n';
                        currentLine = 0;
                    }
                }
                if(currentLine != 0) {
                    returning += '\n';
                }
                returning += '\n';
            }
            message.channel.send(returnEmbed(message.author, returning, 'Here is a list of commands:'));
        } else {
            const command = client.commands.get(`${args[0].toLowerCase()}`);
            if(!command) {
                message.channel.send(returnEmbed(message.author, 'That command doesn\'t exist! Use \'help\' to view a list of commands.', 'Error'));
                return;
            }
            message.channel.send(returnEmbed(message.author, `Usage: ${prefix}${command.name} ${command.arguments}\n\n*${command.description}*\n\nParameters: \`${command.parameters}\`.\n\n*${command.type} Command*`, command.name));
        }
        return;
    }
);
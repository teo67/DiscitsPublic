const returnEmbed = require('../functions/returnEmbed');
const Command = require('../classes/cls_command');

class Instruction {
    constructor(_title, _subtitle) {
        this.title = _title;
        this.subtitle = _subtitle;
    }
}

const instructions = [
    new Instruction('1. d!register to begin!', 'This command will set you up with an account. The prefix d! is used for all commands.'),
    new Instruction('2. Use d!map to open up your map.', 'You\'ll be prompted to talk to the professor, who will introduce you to the game.'),
    new Instruction('3. Use d!choose without any arguments.', 'This will show you your options for your starter Discit (there are three types offered).'),
    new Instruction('4. When ready, click the button corresponding to your starter\'s type.', 'You\'re now set up with your very first Discit. Let the training begin!'),
    new Instruction('5. Reenter your map using d!map.', 'Move in any direction, and talk to the professor again as your next step. Once you\'re done, use the check button to save your data.'),
    new Instruction('6. Next, use d!list to select your starter Discit.'),
    new Instruction('7. Use d!allmoves to equip your first attack in the first slot.'),
    new Instruction('8. Use d!party 1 1 to party your first Discit into the first slot.', 'If you use d!party with no arguments, it\'ll print out your current party (hopefully with your starter in it).'),
    new Instruction('9. Reenter your map again using d!map.', 'Move towards the exit, where you can talk to the professor for the last time.'),
    new Instruction('10. You\'re done with the tutorial!', 'Make your way towards Route 1 and begin your journey as a Discit Trainer!')
];

module.exports = new Command(
    'tutorial', 
    'Starter',
    'View the tutorial instructions for getting started with Discits.', 
    '',
    'None',
    {},
    (message, args, results) => {
        let returning = '';
        for(const instruction of instructions) {
            returning += `**${instruction.title}**\n*${instruction.subtitle}*\n\n`;
        }
        message.channel.send(returnEmbed(message.author, returning + 'For more tutorial info, head over to https://discits.xyz/tutorial.', 'View Tutorial'));
    }
);
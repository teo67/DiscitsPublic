const map = require('../lists+constants/map');
const professorLocations = [[-1, -1], [-1, -1], [156, 159], [157, 164], [157, 164], [157, 164], [196, 136], [100, 109], [363, 79], [-1, -1], [-1, -1]];

const execute = user => {
    const translation = [
        '<:ai:931046711030329364>',/*player*/ 
        '<:ag:931046711051296828>',/*ground*/
        '<:ap:931046710602498059>',/*grass*/
        '<:ad:931046711080661003>',/*red*/
        '<:ao:931046710657056779>',/*white*/
        '<:ae:931046711072280576>',/*purple*/
        '<:ak:931046711013539920>',/*water*/
        '<:aa:931046711206486016>',/*npc*/
        '<:am:931046710917083197>',/*orange*/
        '<:af:931046711063904266>',/*trainerm*/
        '<:ac:931046711139401778>',/*trainerf*/
        '<:an:931046710829019207>',/*trainern*/
        '<:ah:931046711030345808>',/*sand*/
        '<:al:931046711000969276>'/*item*/
    ];
    const prof = '<:aj:931046711017762826>';
    let returning = '';
    for(let i = 0; i < 13; i++) {
        for(let j = 0; j < 13; j++) {
            if(i == 6 && j == 6) {
                returning += translation[0];
            } else if(user.location[1] + i - 6 == professorLocations[user.progression][1] && user.location[0] + j - 6 == professorLocations[user.progression][0]) {
                returning += prof;
            } else {
                returning += translation[map[user.location[1] + i - 6][user.location[0] + j - 6]];
            }
        }
        returning += '\n';
    }
    return returning;
}

module.exports = execute;
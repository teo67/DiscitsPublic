const Caught = require('./cls_caught');
const CaughtProto = require('./cls_caughtproto');

class Route {
    constructor(_chances, _minLevel, _maxLevel) {
        this.chances = _chances;
        this.minLevel = _minLevel;
        this.maxLevel = _maxLevel;
    }

    returnFind() {
        const random = Math.floor(Math.random() * 100) + 1;
        let total = 0;
        for(let i = 0; i < this.chances.length; i++) {
            total += this.chances[i][1];
            if(random <= total) {
                const rand2 = Math.floor(Math.random() * (1 + this.maxLevel - this.minLevel)) + this.minLevel;
                const finding = new Caught(new CaughtProto(this.chances[i][0], rand2, []));
                const rand3 = Math.floor(Math.random() * 4) + 1;
                for(let j = 0; j < rand3; j++) {
                    let randomMove = Math.floor(Math.random() * finding.fullMoves.length);
                    for(let k = 0; k < 15 && finding.moveSet.includes(finding.fullMoves[randomMove]); k++) {
                        randomMove = Math.floor(Math.random() * finding.fullMoves.length);
                    }
                    if(!finding.moveSet.includes(finding.fullMoves[randomMove])) {
                        Caught.setMove(finding, randomMove, j);
                    }
                }
                return finding;
            }
        }
        return false;
    }
}

module.exports = Route;
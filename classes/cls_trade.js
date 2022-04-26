class Trade {
    constructor(_p1living, _p2living) {
        this.p1 = {
            discits: [], 
            items: [],
            amounts: [], 
            living: _p1living // stored here
        };

        this.p2 = {
            discits: [], 
            items: [],
            amounts: [], 
            living: _p2living
        };
    }

    addDiscit(p, num) {
        const player = (p == 1 ? this.p1 : this.p2);
        if(!player.discits.includes(num)) {
            player.discits.push(num);
        }
    }

    removeDiscit(p, num) {
        const player = (p == 1 ? this.p1 : this.p2);
        const index = player.discits.indexOf(num);
        if(index != -1) {
            player.discits.splice(index, 1);
        }
    }

    addItem(p, num, user) {
        const player = (p == 1 ? this.p1 : this.p2);
        const index = player.items.indexOf(num);
        if(index == -1) {
            player.items.push(num);
            player.amounts.push(1);
        } else {
            if(player.amounts[index] < user.amounts[num - 1]) {
                player.amounts[index]++;
            }
        }
    }

    removeItem(p, num) {
        const player = (p == 1 ? this.p1 : this.p2);
        const index = player.items.indexOf(num);
        if(index != -1) {
            player.amounts[index]--;
            if(player.amounts[index] < 1) {
                player.items.splice(index, 1);
                player.amounts.splice(index, 1);
            }
        }
    }
}

module.exports = Trade;
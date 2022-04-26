const Route = require('../classes/cls_route');
const discits = require('./discits');

const routes = [new Route([['Wasket', 17], ['Stormish', 18], ['Tailick', 16], ['Droppelet', 10], ['Sproutlet', 10], ['Sunlet', 10], ['Shocklet', 10], ['Baskett', 9]], 1, 6), 
new Route([['Mascit', 15], ['Ripetal', 12], ['Miracule', 9], ['Searish', 9], ['Furrow', 13], ['Flubunny', 11], ['Amperas', 13], ['Flamesprit', 9], ['Aquish', 9]], 7, 15), 
new Route([['Weizel', 12], ['Sirilik I', 16], ['Streamur', 10], ['Simorchid', 10], ['Rivolley', 10], ['Zappstrike', 10], ['Gasper', 20], ['Talemes', 12]], 15, 27), 
new Route([['Tasket', 10], ['Kermutt', 14], ['Whiskitch', 11], ['Tornatian', 9], ['Simmatree', 11], ['Flurrious', 15], ['Yavolt', 12], ['Wrathorn', 8], ['Tulong', 10]], 28, 40), 
new Route([['Slimshaidy', 3], ['Sirilik II', 18], ['Tuburn', 12], ['Reflexic', 12], ['Shadisk', 15], ['Slithan', 13], ['Fumulus', 11], ['Sirilik III', 16]], 41, 47), 
new Route([['Tearose', 13], ['Legenden', 11], ['Wavelash', 13], ['Raskett', 10], ['Bluricane', 16], ['Gikatail', 11], ['Cloakork', 15], ['Godzimian', 2], ['Stilagon', 9]], 48, 60), 
new Route([['Prizeri', 100]], 70, 70)];

module.exports = routes;
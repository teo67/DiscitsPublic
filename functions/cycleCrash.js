const execute = () => {
    const nextMidnight = new Date();
    nextMidnight.setDate(nextMidnight.getDate() + 1);
    nextMidnight.setHours(0, 0, 0, 0);
    setTimeout(() => {
        require('../lists+constants/fundamentals').downtime = true;
        console.log('enabling downtime (11:59 reached)');
    }, nextMidnight - Date.now() - 60000); // at 11:59, disable commands (and battling) to prepare for cycle
    setTimeout(() => {
        console.log('cycling bot (12:00 reached)');
        process.exit(0);
    }, nextMidnight - Date.now()); // crash at midnight to cycle with heroku - restart should be automatic, and downtime will be set to false once more
}

module.exports = execute;
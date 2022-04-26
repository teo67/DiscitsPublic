require('dotenv').config();

const mongoose = require('mongoose');
const fundamentals = require('./lists+constants/fundamentals');
const client = fundamentals.client;
const Discord = fundamentals.Discord;
const prefix = fundamentals.prefix;
const cycleCrash = require('./functions/cycleCrash');
const fs = require('fs');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => {
    return file.endsWith('js');
});

for(const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if(command.name) {
        client.commands.set(command.name, command);
    } else {
        continue;
    }
}

cycleCrash();

client.on('ready', () => {
    console.log('Discits is online!');
    client.user.setActivity("d!register | d!help", {
        type: "PLAYING"
    });
});

client.on('messageCreate', message => {
    if(!(message.content.startsWith(prefix) || message.content.startsWith(prefix.toUpperCase())) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd);
    if(command) {
        command.execute(message, args);
    }
});

mongoose.connect(process.env.MONGODB_SRV, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to database!');
}).catch(err => {
    console.log(`Error connecting to database: ${err}`);
});

client.login(process.env.TOKEN);
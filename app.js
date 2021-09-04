const config = require('./config.json');

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const userList = new Map();
const goalHour = 3;

const help = require('./commands/help');
const { start, pause } = require('./commands/stopwatch');
const hours = require('./commands/totaltime');
const dailySummary = require('./commands/summary');
const { whatDate } = require('./commands/convertTime');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', message => {
    const content = message.content.toLowerCase();

    switch (content) {
        case 'help':
            help(message.channel);
            break;
        case 'start':
        case 's':
        case 'ㄴ':
            start(message, userList);
            break;
        case 'pause':
        case 'p':
        case 'ㅔ':
            pause(message, userList);
            break;
        case 'hours':
        case 'h':
        case 'ㅗ':
            hours(message, userList);
            break;
        case 'today':
        case 't':
        case 'ㅅ':
            message.channel.send(`오늘은 ${whatDate(new Date())} 입니다.`);
            break;
        case 'goal':
        case 'g':
        case 'ㅎ':
            const comment = `목표 공부시간은 **${goalHour}**시간입니다.`;
            message.channel.send(comment);
            break;
    }

    if (content === 'set daily summary here') {
        dailySummary(message.channel, userList, goalHour);
    }
});

client.login(config.TOKEN);
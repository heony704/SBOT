const config = require('./config.json');

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const userList = new Map();
const intervalList = new Map();
let goalHour = 6;

const help = require('./commands/help');
const { start, pause } = require('./commands/stopwatch');
const hours = require('./commands/totaltime');
const { setSummary, clearSummary } = require('./commands/summary');
const { whatDate } = require('./commands/convertTime');
const setGoal = require('./commands/setGoal');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', message => {
    if (message.author.bot) return;

    const content = message.content.toLowerCase();
    const args = content.split(' ');
    const command = args.shift();

    if (command === 'setgoal' && args.length === 1){
        goalHour = setGoal(message.channel, args);
    }

    switch (content) {
        case 'help':
            help(message.channel);
            break;

        case 'start':
        case 's':
            start(message, userList);
            break;

        case 'pause':
        case 'p':
            pause(message, userList);
            break;

        case 'hours':
        case 'h':
            hours(message, userList);
            console.log( userList );
            break;

        case 'today':
        case 't':
            message.channel.send(`오늘은 ${whatDate(new Date())} 입니다.`);
            break;

        case 'goal':
        case 'g':
            const comment = `목표 공부시간은 **${goalHour}시간**입니다.`;
            message.channel.send(comment);
            break;

        case 'set daily summary':
            setSummary(message, intervalList, userList, goalHour);
            // if (!intervalList.has(message.channelId)) {
            //     const interval = setSummary(message.channel, userList, goalHour);
            //     intervalList.set(message.channelId, interval);
            // } else {
            //     const comment = `이미 **하루 공부시간 요약**이 설정된 채널입니다.`;
            //     message.channel.send(comment);
            // }
            break;

        case 'clear daily summary':
            clearSummary(message, intervalList);
            break;
    }
});

client.login(config.TOKEN);
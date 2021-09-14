const config = require('./config.json');

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const userList = new Map();
let summaryChannel = null;
let summaryJob = null;
let goalHour = 6;

const help = require('./commands/help');
const { start, pause } = require('./commands/stopwatch');
const hours = require('./commands/totaltime');
const { setSummary, resetSummary, clearSummary } = require('./commands/summary');
const { whatDate } = require('./commands/convertTime');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', message => {
    if (message.author.bot) return;

    const content = message.content.toLowerCase();
    const args = content.split(' ');
    const command = args.shift();

    if (command === 'setgoal' && args.length === 1) {
        const hour = parseInt(args.at(0));
        if (hour > 0 ) {
            goalHour = hour;
            const comment = `목표 공부시간이 **${goalHour}시간**으로 변경되었습니다.`;
            message.channel.send(comment);
        } else {
            const comment = `목표 공부시간을 자연수로 입력해주세요.`;
            message.channel.send(comment);
        }
    }

    if (command === 'summarytime' && args.length === 2) {
        const hour = parseInt(args.at(0));
        const min = parseInt(args.at(1));

        if (summaryJob && summaryChannel) {
            if (hour >= 0 && hour < 24 && min >= 0 && min < 60) {
                summaryJob = resetSummary(summaryJob, hour, min);
                const comment = `앞으로 **하루 정리**가 ${hour}시 ${min}분을 기준으로 동작합니다.`;
                message.channel.send(comment);
            } else {
                const comment = `0시 0분부터 23시 59분 사이로 설정해주세요.`;
                message.channel.send(comment);
            }
        } else {
            const comment = `먼저 **하루 정리**가 올라올 채널을 설정해주세요.`;
            message.channel.send(comment);
        }
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
            if (!summaryJob && !summaryChannel) {
                summaryJob = setSummary(message, userList, goalHour);
                summaryChannel = message.channelId;
            } else if (summaryChannel === message.channelId) {
                const comment = `이미 **하루 정리**가 설정된 채널입니다.`;
                message.channel.send(comment);
            } else {
                const comment = `**하루 정리**가 설정된 다른 채널이 있습니다.`;
                message.channel.send(comment);
            }
            break;

        case 'clear daily summary':
            if (summaryJob) {
                if (summaryChannel === message.channelId) {
                    clearSummary(message, summaryJob);
                    summaryJob = null;
                    summaryChannel = null;
                } else {
                    const comment = `다른 채널의 **하루 정리**를 해제할 수 없습니다.`;
                    message.channel.send(comment);
                }
            }
            break;

        case 'console userlist':
            console.log(userList);
            break;
        case 'console summaryjob':
            console.log(summaryJob);
            break;
        case 'console summarychannel':
            console.log(summaryChannel);
            break;
    }
});

client.login(config.TOKEN);
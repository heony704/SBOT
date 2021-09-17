const config = require('./config.json');

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const userList = new Map();
let summaryChannel = null;
let summaryJob = null;
let goalHour = 6;

const shortList = new Map();
shortList.set('start', ['start', 's']);
shortList.set('pause', ['pause', 'p']);
shortList.set('hours', ['hours', 'h']);
shortList.set('goal', ['goal', 'g']);

const help = require('./commands/help');
const { start, pause } = require('./commands/stopwatch');
const hours = require('./commands/totaltime');
const { setSummary, resetSummary, clearSummary } = require('./commands/summary');
const { whatDate } = require('./commands/convertTime');

client.on('ready', () => {
    console.log(`bot ${client.user.tag} is Ready !`);
});

client.on('channelDelete', channel => {
    if (channel.id === summaryChannel) {
        clearSummary(summaryJob);
        summaryJob = null;
        summaryChannel = null;
    }
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

    if (content === 'init') {
        message.guild.channels.create('공부-채널', { type: 'GUILD_CATEGORY'})
        .then((category) => {
            message.guild.channels.create('출석-체크', { type: 'GUILD_TEXT', parent: category.id, topic: '나 공부하러 왔다 ~ :wave:'});
            message.guild.channels.create('시간-체크', { type: 'GUILD_TEXT', parent: category.id, topic: 'SBOT으로 공부시간 체크하자! :alarm_clock:'})
            .then((channel) => {
               help(channel); 
            });
            message.guild.channels.create('하루-정리', { type: 'GUILD_TEXT', parent: category.id, topic: '오늘 따봉:thumbsup:을 받을까, 벽돌:bricks:을 받을까?'})
            .then((channel) => {
                summaryJob = setSummary(channel, userList, goalHour);
                summaryChannel = channel.id;
            })
            message.guild.channels.create('캠-스터디', { type: 'GUILD_VOICE', parent: category.id});
        });
        
        message.guild.channels.create('SBOT', { type: 'GUILD_CATEGORY'})
        .then((category) => {
            message.guild.channels.create('봇-안내', { type: 'GUILD_TEXT', parent: category.id});
            message.guild.channels.create('봇-관리', { type: 'GUILD_TEXT', parent: category.id});
        });
    }

    if (content === 'help') {
        help(message.channel);
    }
    
    if (shortList.get('start').includes(content)) {
        start(message, userList);
    }

    if (shortList.get('pause').includes(content)) {
        pause(message, userList);
    }

    if (shortList.get('hours').includes(content)) {
        hours(message, userList);
    }

    if (content === 'today') {
        message.channel.send(`오늘은 ${whatDate(new Date())} 입니다.`);
    }

    if (shortList.get('goal').includes(content)) {
        const comment = `목표 공부시간은 **${goalHour}시간**입니다.`;
        message.channel.send(comment);
    }
    
    if (content === 'set daily summary') {
        if (!summaryJob && !summaryChannel) {
            summaryJob = setSummary(message.channel, userList, goalHour);
            summaryChannel = message.channelId;
        } else if (summaryChannel === message.channelId) {
            const comment = `이미 **하루 정리**가 설정된 채널입니다.`;
            message.channel.send(comment);
        } else {
            const comment = `**하루 정리**가 설정된 다른 채널이 있습니다.`;
            message.channel.send(comment);
        }
    }

    if (content === 'clear daily summary') {
        if (summaryJob) {
            if (summaryChannel === message.channelId) {
                clearSummary(summaryJob);
                summaryJob = null;
                summaryChannel = null;
                const comment = `**하루 정리**가 해제되었습니다.`;
                message.channel.send(comment);
            } else {
                const comment = `다른 채널의 **하루 정리**를 해제할 수 없습니다.`;
                message.channel.send(comment);
            }
        }
    }

    if (content === 'set korean command') {
        shortList.get('start').push('ㄴ');
        shortList.get('pause').push('ㅔ');
        shortList.get('hours').push('ㅗ');
        shortList.get('goal').push('ㅎ');
        const comment = `지금부터 한글 명령어 \`ㄴ\` , \`ㅔ\` , \`ㅗ\` , \`ㅎ\` 가 작동합니다.\n`;
        message.channel.send(comment);
    }

    if (content === 'clear korean command') {
        shortList.get('start').pop();
        shortList.get('pause').pop();
        shortList.get('hours').pop();
        shortList.get('goal').pop();
        const comment = `지금부터 한글 명령어가 작동하지 않습니다.`;
        message.channel.send(comment);
    }

    if (content === 'console userlist') {
        console.log(userList);
    }

    if (content === 'console summaryjob') {
        console.log(summaryJob);
    }

    if (content === 'console summarychannel') {
        console.log(summaryChannel);
    }

});

client.login(config.TOKEN)
    .then( function () {
        console.log('client login');
    });
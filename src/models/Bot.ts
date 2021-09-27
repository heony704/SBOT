import { Guild, Message } from 'discord.js';
import Server from './Server';
import config from '../config';
import { help, guide, control } from '../info';

export default class Bot {
    private id: string;
    private serverList: Map<string, Server>;

    constructor() {
        this.serverList = new Map();
        this.id = config.id;
    }

    public initServerList(guilds: Map<string, Guild>) {
        guilds.forEach(guild => {
            const server = new Server();
            this.serverList.set(guild.id, server);
        });
        console.log('Building Server List ...');
    }

    public deleteServer(guildId: string) {
        this.serverList.get(guildId).clearSummary();
        this.serverList.delete(guildId);
    }
    
    public deleteUser(guildId: string, userId: string) {
        const server = this.serverList.get(guildId);
        server.deleteUser(userId);
    }

    public addServer(guildId: string) {
        const server = new Server();
        this.serverList.set(guildId, server);
    }

    public checkSummary(guildId: string, channelId: string) {
        const server = this.serverList.get(guildId);
        if (channelId === server.getSummaryChannelId()) {
            server.clearSummary();
        }
    }

    public createSbotCategory(guild: Guild) {
        const channelManager = guild.channels;
        channelManager.create('SBOT', {
            type: 'GUILD_CATEGORY', 
            permissionOverwrites: [
                { 
                    id: guild.roles.everyone,
                    deny: ['VIEW_CHANNEL']
                },
                {
                    id: this.id,
                    allow: ['VIEW_CHANNEL']
                }
            ]
        })
        .then((category) => {
            channelManager.create('봇-안내', { type: 'GUILD_TEXT', parent:category.    id, topic: 'SBOT 안내 채널입니다.'})
            .then((channel) => {
                channel.send(guide);
            });

            channelManager.create('봇-관리', { type: 'GUILD_TEXT', parent:category.    id, topic: 'SBOT 관리 채널입니다.'})
            .then((channel) => {
                channel.send(control);
            });
        });
    }

    private createStudyCategory(guild: Guild) {
        const channelManager = guild.channels;
        const server = this.serverList.get(guild.id);

        channelManager.create('공부-채널', { type: 'GUILD_CATEGORY'})
        .then((category) => {
            channelManager.create('출석-체크', { type: 'GUILD_TEXT', parent: category.id, topic: '나 공부하러 왔다 ~ :wave:'})
            .then((channel) => {
                channel.send('출석체크를 통해 공부의 시작을 알리세요. :sunglasses:');
                channel.permissionOverwrites.create(this.id, {'VIEW_CHANNEL': false});
            });
            channelManager.create('시간-체크', { type: 'GUILD_TEXT', parent: category.id, topic: 'SBOT으로 공부시간 체크하자! :alarm_clock:'})
            .then((channel) => {
                channel.send('`start` 로 스톱워치를 시작하세요! `help` 를 통해 사용가능한 명령어를 확인할 수 있습니다.\n채널 알림을 꺼두는 것을 추천합니다. :no_bell:');
                channel.send(help);
            });
            channelManager.create('하루-정리', { 
                type: 'GUILD_TEXT', 
                parent: category.id, 
                topic: '오늘 따봉:thumbsup:을 받을까, 벽돌:bricks:을 받을까?', 
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone,
                        deny: ['SEND_MESSAGES']
                    },
                    {
                        id: this.id,
                        allow: ['SEND_MESSAGES']
                    }
                ]
            })
            .then((channel) => {
                server.setSummary(channel);
                let comment = `해당 채널에 **하루 정리**가 설정되었습니다.\n`;
                comment += `목표 시간을 달성하면 따봉:thumbsup:을 , 달성하지 못한다면 벽돌:bricks:을 받습니다.`;
                channel.send(comment);
            });
            channelManager.create('캠-스터디', { type: 'GUILD_VOICE', parent: category.id});
        });
        channelManager.create('사담-채널', { type: 'GUILD_CATEGORY'})
        .then((category) => {
            channelManager.create('수다는-적당히', { type: 'GUILD_TEXT', parent: category.id, topic: ':speaking_head:'})
            .then((channel) => {
                channel.send('자유롭게 이야기할 수 있는 공간입니다.');
            });
            channelManager.create('감정-쓰레기통', { type: 'GUILD_TEXT', parent: category.id, topic: ':wastebasket:'})
            .then((channel)=> {
                channel.send('스트레스를 쏟아붓는 곳입니다. 자유롭게 사용하기 위해 채널 알림을 꺼주세요! :no_bell:');
                category.permissionOverwrites.create(this.id, {'VIEW_CHANNEL': false});
            });
        });
    }

    public processCommand(message: Message) {
        if (message.author.bot) return;
    
        const content = message.content.toLowerCase();
        const args = content.split(' ');
        const command = args.shift();
    
        if (args.length > 3) return;
    
        if (command === 'set') {
            const target = args.shift();
    
            if (args.length === 1 && target === 'goalhour' ) {
                const hour = parseInt(args.at(0));
                this.setGoalHour(message, hour);
                return;
            }
    
            if (args.length === 2 && target === 'summarytime') {
                const hour = parseInt(args.at(0));
                const min = parseInt(args.at(1));
                this.setSummaryTime(message, hour, min);
                return;
            }
        }
        
        const server = this.serverList.get(message.guildId);
        switch (content) {
            case 'set summary':
                return this.setSummary(message);
            case 'clear summary':
                return this.clearSummary(message);
            case 'set korean':
                return this.setKorean(message);
            case 'clear korean':
                return this.clearKorean(message);
            case 'init':
                return this.createStudyCategory(message.guild);
            case 'help':
                message.channel.send(help);
                return;
            case 'start':
            case 's':
                return this.startStopwatch(message);
            case 'pause':
            case 'p':
                return this.pauseStopwatch(message);
            case 'time':
            case 't':
                return this.showTotalTime(message);
            case 'goal':
            case 'g':
                return this.showGoalHour(message);
            case 'ㄴ':
                if (server.useKorean === true) this.startStopwatch(message);
                return;
            case 'ㅔ':
                if (server.useKorean === true) this.pauseStopwatch(message);
                return;
            case 'ㅅ':
                if (server.useKorean === true) this.showTotalTime(message);
                return;
            case 'ㅎ':
                if (server.useKorean === true) this.showGoalHour(message);
                return;
            case 'console server':
                return console.log(this.serverList.get(message.guildId));
            case 'console serverlist':
                return console.log(this.serverList);
            case 'console channels':
                message.guild.channels.cache.forEach(channel => {
                    console.log(channel);
                });
                return;
        }
    }

    private setGoalHour(message: Message, hour: number) {
        const server = this.serverList.get(message.guildId);
        const channel = message.channel;

        if (server.setGoalHour(hour)) {
            channel.send(`목표 공부시간이 **${hour}시간**으로 변경되었습니다.`);
        } else {
            channel.send(`목표 공부시간을 자연수로 입력해주세요.`);
        }
    }

    private setSummaryTime(message: Message, hour: number, min: number) {
        const server = this.serverList.get(message.guildId);
        const channel = message.channel;

        if (server.resetSummary(hour, min)) {
            channel.send(`**하루 정리**가 ${hour}시 ${min}분을 기준으로 동작합니다.`);
        } else {
            channel.send(`0시 0분부터 23시 59분 사이로 설정해주세요.`);
        }
    }

    private setSummary(message: Message) {
        const server = this.serverList.get(message.guildId);
        const channel = message.channel;
        const summary = server.setSummary(channel);

        if (summary === -1) {
            channel.send(`**하루 정리**가 설정된 다른 채널이 있습니다.`);
        } else if (summary === 0) {
            channel.send(`이미 **하루 정리**가 설정된 채널입니다.`);
        } else {
            let comment = `해당 채널에 **하루 정리**가 설정되었습니다.\n`;
            comment += `목표 시간을 달성하면 따봉:thumbsup:을 , 달성하지 못한다면 벽돌:bricks:을 받습니다.`
            channel.send(comment);
        }
    }

    private clearSummary(message: Message) {
        const server = this.serverList.get(message.guildId);
        const channel = message.channel;

        if (server.getSummaryChannelId() && channel.id !== server.getSummaryChannelId()) {
            channel.send(`**하루 정리**를 설정한 채널에서 해제해주세요.`);
        } else if (server.clearSummary()) {
            channel.send(`**하루 정리**가 해제되었습니다.`);
        } else {
            channel.send(`**하루 정리**가 설정된 채널이 없습니다.`)
        }
    }

    private setKorean(message: Message) {
        const server = this.serverList.get(message.guildId);
        const channel = message.channel;

        if (server.useKorean) {
            channel.send(`이미 한글 명령어가 적용된 상태입니다.`);
        } else {
            channel.send(`지금부터 한글 명령어 \`ㄴ\` , \`ㅔ\` , \`ㅅ\` , \`ㅎ\` 가 적용됩니다.\n`);
            server.useKorean = true;
        }
    }

    private clearKorean(message: Message) {
        const server = this.serverList.get(message.guildId);
        const channel = message.channel;

        if (server.useKorean) {
            channel.send(`지금부터 한글 명령어가 해제됩니다.`);
            server.useKorean = false;
        } else {
            channel.send(`이미 한글 명령어가 해제된 상태입니다.`);
        }
    }

    private startStopwatch(message: Message) {
        const server = this.serverList.get(message.guildId);
        const channel = message.channel;
        const userId = message.author.id;

        if (server.addUser(userId)) {
            channel.send(`<@${userId}> 새로운 스터디원을 환영합니다!  :partying_face:`);
        }

        const user = server.getUser(userId);
        if (user.startStopwatch()) {
            channel.send(`<@${userId}> 스톱워치 시작`);
        }
    }
    
    private pauseStopwatch(message: Message) {
        const server = this.serverList.get(message.guildId);
        const channel = message.channel;
        const userId = message.author.id;

        const user = server.getUser(userId);
        if (user && user.pauseStopwatch()) {
            channel.send(`<@${userId}> 스톱워치 멈춤`);
        }
    }

    private showTotalTime(message: Message) {
        const server = this.serverList.get(message.guildId);
        const channel = message.channel;
        const userId = message.author.id;

        const user = server.getUser(userId);
        if (!user) {
            channel.send(`<@${userId}> 스톱워치를 먼저 시작해주세요.`);
            return;
        }

        const totalTime = user.getTotalTime();
        let comment = `<@${userId}> 오늘 하루  **${totalTime.getHours()}시간 ${totalTime.getMinutes()}분** `;
        if (user.getStartTime()) {
            comment += `공부중  :book:`;
        } else {
            comment += `공부  :blue_book:`;
        }
        channel.send(comment);
    }

    private showGoalHour(message: Message) {
        const server = this.serverList.get(message.guildId);
        const channel = message.channel;
        channel.send(`목표 공부시간은 **${server.getGoalHour()}시간**입니다.`);
    }
}
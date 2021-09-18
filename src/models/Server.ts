import { TextBasedChannels } from 'discord.js';
import schedule from 'node-schedule';
import User from './User';

export default class Server {
    private serverId: string;
    private goalHour: number;
    private userList: Map <string, User>;
    // summary;
    private summaryChannel: any;
    private summaryJob: any;
    private summaryTime: string;

    constructor(serverId: string) {
        this.serverId = serverId;
        this.goalHour = 6;
        this.userList = new Map();
        // this.summary = {
        //     channel: null,
        //     job: null,
        //     time: '0 0 15 * * *'
        // }
        this.summaryChannel = null;
        this.summaryJob = null;
        this.summaryTime = '0 0 15 * * *';
    }
    
    public addUser(userId: string) {
        const user = new User(userId);
        this.userList.set(userId, user);
    }

    public hasUser(userId: string): boolean {
        return this.userList.has(userId);
    }

    public getUser(userId: string): any {
        if (this.hasUser(userId)) {
            return this.userList.get(userId);
        } else {
            return false;
        }
    }

    public getGoalhour(): number {
        return this.goalHour;
    }

    public setGoalhour(hour: number) {
        this.goalHour = hour;
    }

    public setSummary(channel: TextBasedChannels) {
        this.summaryChannel = channel;
        this.summaryJob = schedule.scheduleJob(this.summaryTime, () => {
            const now = new Date();
            const week = ['일','월','화','수','목','금','토'];
            let comment = `:mega:  ${now.getMonth()+1}월 ${now.getDate()}일 ${week[now.getDay()]}요일 \n`;
            
            if (this.userList.size === 0) {
                comment += `- 아직 참여한 사용자가 없습니다 -`;
            } else {
                this.userList.forEach((user, userId) => {
                    if (user.getStarttime()) {
                        if (user.getStarttime()){}
                        user.setTotaltime(user.getTotaltime().getTime() + (now.getTime() - user.getStarttime().getTime()));
                        user.setStarttime(now);
                    }

                    comment += `<@${userId}> ${user.getTotaltime().getHours()}시간 ${user.getTotaltime().getMinutes()}분  `;
                    if (user.getTotaltime().getHours() >= this.goalHour) {
                        comment += `:thumbsup:\n`;
                    } else {
                        comment += `:bricks:\n`;
                    }
                    user.setTotaltime(new Date(2021, 0).getTime());
                });

                channel.send(comment);
            }
        });
    }

    public resetSummary(hour: number, min:number) {
        let correctHour = 0;
        if (hour >= 9) {
            correctHour = hour - 9;
        } else {
            correctHour = hour + 15;
        }
        this.summaryTime = `0 ${min} ${correctHour} * * *`;
        schedule.rescheduleJob(this.summaryJob, this.summaryTime);
    }

    public clearSummary() {
        schedule.cancelJob(this.summaryJob);
        this.summaryChannel = null;
        this.summaryJob = null;
    }
}
import { TextBasedChannels } from 'discord.js';
import schedule from 'node-schedule';
import Short from './Short';
import User from './User';

export default class Server {
    private serverId: string;
    private goalHour: number;
    private userList: Map <string, User>;
    private shortList: Short;
    // summary;
    private summaryChannelId: string;
    private summaryJob: schedule.Job;
    private summaryTime: string;

    constructor(serverId: string) {
        this.serverId = serverId;
        this.goalHour = 6;
        this.userList = new Map();
        this.shortList = new Short();
        // this.summary = {
        //     channel: null,
        //     job: null,
        //     time: '0 0 15 * * *'
        // }
        this.summaryChannelId = null;
        this.summaryJob = null;
        this.summaryTime = '0 0 15 * * *';
    }

    public getShortlist(): Short {
        return this.shortList;
    }
    
    public addUser(userId: string): boolean {
        if (this.userList.has(userId)) return false;

        const user = new User(userId);
        this.userList.set(userId, user);
        return true;
    }

    private hasUser(userId: string): boolean {
        return this.userList.has(userId);
    }

    public getUser(userId: string): User {
        if (this.hasUser(userId)) {
            return this.userList.get(userId);
        } else {
            return null;
        }
    }

    public getSummarychannelid(): string {
        return this.summaryChannelId;
    }

    public getGoalhour(): number {
        return this.goalHour;
    }

    public setGoalhour(hour: number): boolean {
        if (hour < 0) return false;
        
        this.goalHour = hour;
        return true;
    }

    public setSummary(channel: TextBasedChannels): number {
        if (this.summaryJob || this.summaryChannelId) {
            return -1;
        }
        if (channel.id === this.summaryChannelId) {
            return 0;
        }
        this.summaryChannelId = channel.id;
        this.summaryJob = schedule.scheduleJob(this.summaryTime, () => {

            console.log('[before]');
            console.log(this.userList);
            const now = new Date();
            const week = ['일','월','화','수','목','금','토'];
            let comment = `:mega:  ${now.getMonth()+1}월 ${now.getDate()}일 ${week[now.getDay()]}요일 \n`;
            
            if (this.userList.size === 0) {
                comment += `- 아직 참여한 사용자가 없습니다 -`;
            } else {
                this.userList.forEach((user, userId) => {
                    if (user.getStarttime()) {
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

                console.log('[after]');
                console.log(this.userList);

                channel.send(comment);
            }
        });
        return 1;
    }

    public resetSummary(hour: number, min:number): boolean {
        if (hour < 0 || hour > 23 || min < 0 || min > 59) return false;

        let correctHour = 0;
        if (hour >= 9) {
            correctHour = hour - 9;
        } else {
            correctHour = hour + 15;
        }
        this.summaryTime = `0 ${min} ${correctHour} * * *`;
        schedule.rescheduleJob(this.summaryJob, this.summaryTime);
        return true;
    }

    public clearSummary(): boolean {
        if (!this.summaryJob) return false;

        schedule.cancelJob(this.summaryJob);
        this.summaryChannelId = null;
        this.summaryJob = null;
        return true;
    }
}
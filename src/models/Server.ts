import { TextBasedChannels } from 'discord.js';
import schedule from 'node-schedule';
import User from './User';

export default class Server {
    private goalHour: number;
    private userList: Map <string, User>;
    public useKorean: boolean;
    private summary: {channelId: string, job: schedule.Job};

    constructor() {
        this.goalHour = 6;
        this.userList = new Map();
        this.useKorean = false;
        this.summary = {channelId: null, job: null};
    }
    
    public addUser(userId: string): boolean {
        if (this.userList.has(userId)) return false;

        const user = new User();
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

    public deleteUser(userId: string): boolean {
        if (!this.hasUser(userId)) return false;

        this.userList.delete(userId);
        return true;
    }

    public getSummaryChannelId(): string {
        return this.summary.channelId;
    }

    public getGoalHour(): number {
        return this.goalHour;
    }

    public setGoalHour(hour: number): boolean {
        if (hour < 0) return false;
        
        this.goalHour = hour;
        return true;
    }

    public setSummary(channel: TextBasedChannels): number {
        if (channel.id === this.summary.channelId) {
            return 0;
        }
        if (this.summary.job || this.summary.channelId) {
            return -1;
        }
        this.summary.channelId = channel.id;
        this.summary.job = schedule.scheduleJob('0 0 15 * * *', () => {

            const now = new Date();
            const week = ['일','월','화','수','목','금','토'];
            let comment = `:mega:  ${now.getMonth()+1}월 ${now.getDate()}일 ${week[now.getDay()]}요일 \n`;
            
            if (this.userList.size === 0) {
                comment += `- 아직 참여한 사용자가 없습니다 -`;
            } else {
                this.userList.forEach((user, userId) => {
                    if (user.pauseStopwatch()) {
                        user.setStartTime(now);
                    }

                    comment += `<@${userId}> ${user.getTotalTime().getHours()}시간 ${user.getTotalTime().getMinutes()}분  `;
                    if (user.getTotalTime().getHours() >= this.goalHour) {
                        comment += `:thumbsup:\n`;
                    } else {
                        comment += `:bricks:\n`;
                    }
                    user.setTotalTime(new Date(2021, 0).getTime());
                });
            }
            channel.send(comment);
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
        const summaryTime = `0 ${min} ${correctHour} * * *`;
        schedule.rescheduleJob(this.summary.job, summaryTime);
        return true;
    }

    public clearSummary(): boolean {
        if (!this.summary.job) return false;

        schedule.cancelJob(this.summary.job);
        this.summary.channelId = null;
        this.summary.job = null;
        return true;
    }
}
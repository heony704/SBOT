import schedule from 'node-schedule';
import { User } from './User';

export class Server {
    public goalHour: number;
    public userList: Map <string, User>;
    public useKorean: boolean;
    public summary: {channelId: string, job: schedule.Job, cron: string};

    constructor() {
        this.goalHour = 6;
        this.userList = new Map();
        this.useKorean = false;
        this.summary = {channelId: null, job: null, cron: '0 0 15 * * *'};
    }

    public hasUser(userId: string): boolean {
        return this.userList.has(userId);
    }

    public getUser(userId: string): User {
        return this.userList.get(userId);
    }

    public addUser(userId: string) {
        const user = new User();
        this.userList.set(userId, user);
    }

    public deleteUser(userId: string) {
        this.userList.delete(userId);
    }

    public setSummary(channelId: string, summary: schedule.JobCallback) {
        this.summary.channelId = channelId;
        this.summary.job = schedule.scheduleJob(this.summary.cron, summary);
    }

    private setSummaryTime(hour: number, min: number) {
        const utcHour = this.kstToUtc(hour);
        this.summary.cron = `0 ${min} ${utcHour} * * *`;
    }

    public editSummaryTime(hour: number, min: number) {
        this.setSummaryTime(hour, min);
        if (this.summary.job) {
            schedule.rescheduleJob(this.summary.job, this.summary.cron);
        }
    }

    private kstToUtc(hour: number) {
        if (hour >= 9) return hour - 9;
        else return hour + 15;
    }

    public clearSummary() {
        schedule.cancelJob(this.summary.job);
        this.summary.channelId = null;
        this.summary.job = null;
    }
}
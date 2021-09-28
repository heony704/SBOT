import schedule from 'node-schedule';
import User from './User';

export default class Server {
    public goalHour: number;
    public userList: Map <string, User>;
    public useKorean: boolean;
    public summary: {channelId: string, job: schedule.Job};

    constructor() {
        this.goalHour = 6;
        this.userList = new Map();
        this.useKorean = false;
        this.summary = {channelId: null, job: null};
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

    public setSummary(channelId: string, summary: Function) {
        this.summary.channelId = channelId;
        this.summary.job = schedule.scheduleJob('0 0 15 * * *', () => summary);
    }

    public resetSummary(hour: number, min: number) {
        const utcHour = this.kstToUtc(hour);
        const summaryTime = `0 ${min} ${utcHour} * * *`;
        schedule.rescheduleJob(this.summary.job, summaryTime);
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
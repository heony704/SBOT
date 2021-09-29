export class User {
    public startTime: Date;
    public totalTime: Date;

    constructor() {
        this.startTime = null;
        this.totalTime = new Date(2021, 0);
    }

    public startStopwatch() {
        this.startTime = new Date();
    }

    public pauseStopwatch() {
        const now = new Date();
        this.totalTime.setTime(this.totalTime.getTime() + (now.getTime() - this.startTime.getTime()));
        this.startTime = null;
    }

    public getCurrentTotal(): Date {
        if (this.startTime) {
            const now = new Date();
            const tmp = new Date();
            tmp.setTime(this.totalTime.getTime() + (now.getTime() - this.startTime.getTime()));
            return tmp;
        } else {
            return this.totalTime;
        }
    }
}
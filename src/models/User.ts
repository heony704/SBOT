export default class User {
    private startTime: Date;
    private totalTime: Date;
    // private brickCount: number;

    constructor() {
        this.startTime = null;
        this.totalTime = new Date(2021, 0);
    }

    public getStarttime(): Date {
        return this.startTime;
    }

    public setStarttime(startTime: Date) {
        this.startTime = startTime;
    }

    public setTotaltime(totalTime: number) {
        this.totalTime.setTime(totalTime);
    }

    public startStopwatch() :boolean {
        if (!this.startTime) {
            this.startTime = new Date();
            return true;
        }
        return false;
    }

    public pauseStopwatch() :boolean {
        if (this.startTime) {
            const now = new Date();
            this.totalTime.setTime(this.totalTime.getTime() + (now.getTime() - this.startTime.getTime()));
            this.startTime = null;
            return true;
        }
        return false;
    }

    public getTotaltime(): Date {
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
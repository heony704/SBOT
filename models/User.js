export class User {

    userId;
    startTime;
    totalTime;
    // brickCount;

    constructor (userId) {
        this.userId = userId;
        this.startTime = null;
        this.totalTime = new Date(2021, 0);
    }

    getStarttime () {
        return this.startTime;
    }

    setStarttime (startTime) {
        this.startTime = startTime;
    }

    setTotaltime (totalTime) {
        this.totalTime = totalTime;
    }

    startStopwatch () {
        this.startTime = new Date();
    }

    pauseStopwatch () {
        const now = new Date();
        this.totalTime.setTime(this.totalTime.getTime() + (now.getTime() - this.startTime.getTime()));
        this.startTime = null;
    }

    getTotaltime () {
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
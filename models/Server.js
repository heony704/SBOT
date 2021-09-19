// const schedule = require('node-schedule');
// const User = require('./User');
import schedule from 'node-schedule';
import User from './User';

export class Server {
    
    serverId;
    goalHour;
    userList;
    // summary;
    summaryChannel;
    summaryJob;
    summaryTime;

    constructor (serverId) {
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
    
    addUser (userId) {
        const user = new User(userId);
        this.userList.set(userId, user);
    }

    hasUser (userId) {
        return this.userList.has(userId);
    }

    getUser (userId) {
        if (this.hasUser(userId)) {
            return this.userList.get(userId);
        } else {
            return false;
        }
    }

    getGoalhour () {
        return this.goalHour;
    }

    setGoalhour (hour) {
        this.goalHour = hour;
    }

    setSummary (channel) {
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
                        user.setTotaltime(user.getTotalTime().getTime() + (now.getTime() - user.getStarttime().getTime()));
                        user.setStarttime(now);
                    }

                    comment += `<@${userId}> ${user.getTotaltime().getHours()}시간 ${user.getTotalTime().getMinutes()}분  `;
                    if (user.getTotaltime().getHours() >= goalHour) {
                        comment += `:thumbsup:\n`;
                    } else {
                        comment += `:bricks:\n`;
                    }
                    user.setTotaltime(new Date(2021, 0));
                });

                channel.send(comment);
            }
        });
    }

    resetSummary (hour, min) {
        let correctHour = 0;
        if (hour >= 9) {
            correctHour = hour - 9;
        } else {
            correctHour = hour + 15;
        }
        this.summaryTime = `0 ${min} ${correctHour} * * *`;
        schedule.rescheduleJob(this.summaryJob, this.summaryTime);
    }

    clearSummary () {
        schedule.cancelJob(this.summaryJob);
        this.summaryChannel = null;
        this.summaryJob = null;
    }
}
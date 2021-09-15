
const { when, howlong, whatDate } = require('./convertTime');
const schedule = require('node-schedule');

const setSummary = function (message, userList, goalHour) {

    let comment = `해당 채널에 **하루 정리**가 설정되었습니다.\n`;
    comment += `목표 시간을 달성하면 따봉:thumbsup:을 , 달성하지 못한다면 벽돌:bricks:을 받습니다.`
    message.channel.send(comment);

    const time = new Date();

    const summary = function () {
        const now = new Date();
        
        let comment = `:mega:  ${whatDate(time)}\n`;
        
        if ( userList.size === 0 ) {
            comment += `- 아직 참여한 사용자가 없습니다 -`;
            message.channel.send(comment);
        } else {
            userList.forEach((user, id) => {
                if (user.startTime) {
                    user.totalTime.setTime(user.totalTime.getTime() + (now.getTime() - user.startTime.getTime()));
                    user.startTime = now;
                }

                comment += `<@${id}> `;
                if (user.totalTime.getHours() >= goalHour) {
                    comment += `${howlong(user.totalTime)}  :thumbsup:\n`;
                } else {
                    comment += `${howlong(user.totalTime)}  :bricks:\n`;
                }
                user.totalTime = new Date(2021, 0);
            });
        
            message.channel.send(comment);
        }
    }

    const job = schedule.scheduleJob('0 29 * * * *', summary);
    
    return job;
}

const resetSummary = function (summaryJob, hour, min) {
    let correctHour = 0;
    if (hour >= 9) {
        correctHour = hour - 9;
    } else {
        correctHour = hour + 15;
    }
    const cron = `0 ${min} ${correctHour} * * *`;
    const job = schedule.rescheduleJob(summaryJob, cron);

    return job;
}

const clearSummary = function (summaryJob) {
    schedule.cancelJob(summaryJob);
}

module.exports = { setSummary, resetSummary, clearSummary };
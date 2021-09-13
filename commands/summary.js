
const { when, howlong, whatDate } = require('./convertTime');
const schedule = require('node-schedule');

const setSummary = function (message, intervalList, userList, goalHour) {

    if (intervalList.has(message.channelId)) {
        const comment = `이미 **하루 공부시간 요약**이 설정된 채널입니다.`;
        message.channel.send(comment);
        return ;
    }

    let comment = `해당 채널에 **하루 공부시간 요약**이 설정되었습니다.\n`;
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
        console.log(new Date());
    }

    const job = schedule.scheduleJob('0 0/2 * * * *', summary);
    
    intervalList.set(message.channelId, job);
}

const clearSummary = function (message, intervalList) {
    if (intervalList.has(message.channelId)) {
        schedule.cancelJob(intervalList.get(message.channelId));
        intervalList.delete(message.channelId);
        const comment = `**하루 공부시간 요약**이 해제되었습니다.`;
        message.channel.send(comment);
    } else {
        const comment =`해당 채널에 **하루 공부시간 요약**이 설정되지 않았습니다.`;
        message.channel.send(comment);
    }
    
}

module.exports = { setSummary, clearSummary };

const { when, howlong, whatDate } = require('./convertTime');

const matchTime = function (time) {
    const now = new Date();
    return (time.getHours() === now.getHours() && time.getMinutes() === now.getMinutes());
}
const matchDate = function (date) {
    return (date.getDate() === new Date().getDate());
}

const setSummary = function (message, intervalList, userList, goalHour) {

    if (intervalList.has(message.channelId)) {
        const comment = `이미 **하루 공부시간 요약**이 설정된 채널입니다.`;
        message.channel.send(comment);
        return ;
    }

    let comment = `해당 채널에 **하루 공부시간 요약**이 설정되었습니다.\n`;
    comment += `목표 시간을 달성하면 따봉:thumbsup: 을 , 달성하지 못한다면 벽돌:bricks: 을 받습니다.`
    message.channel.send(comment);

    const time = new Date();

    const interval = setInterval( function () {

        // matchDate, matchTime 변경
        if (!matchTime(time)) {
        // if (!matchDate(time)) {

            let comment = `:mega:  ${whatDate(time)}\n`;
            const now = new Date();
            
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
            
            // 시간 초기화
            time.setMinutes(now.getMinutes());
            // time.setDate(now.getDate());
        }
    }, 900);
    
    intervalList.set(message.channelId, interval);
}

const clearSummary = function (message, intervalList) {
    clearInterval(intervalList.get(message.channelId));
    intervalList.delete(message.channelId);
    const comment = `**하루 공부시간 요약**이 해제되었습니다.`;
    message.channel.send(comment);
}

module.exports = { setSummary, clearSummary };
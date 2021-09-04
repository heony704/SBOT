
const { when, howlong, whatDate } = require('./convertTime');

const matchTime = function (time) {
    const now = new Date();
    return (time.getHours() === now.getHours() && time.getMinutes() === now.getMinutes());
}
const matchDate = function (date) {
    return (date.getDate() === new Date().getDate());
}

const summary = function (channel, userList, goalHour) {

    let comment = `해당 채널에 하루 공부시간 요약이 설정되었습니다.\n`;
    comment += `목표 시간을 달성하면 따봉:thumbsup: 을 , 달성하지 못한다면 벽돌:bricks: 을 받습니다.`
    channel.send(comment);

    const time = new Date();

    setInterval(function() {

        // matchDate 로 바꿀것. + when 이 아니라 whatDate로 바꿀것
        if (!matchDate(time)) {
            let comment = `:mega:  ${whatDate(time)}\n`;
            const now = new Date();
            
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
            
            channel.send(comment);

            // 시간 초기화
            time.setDate(now.getDate());
        }
    }, 900);
}

module.exports = summary;
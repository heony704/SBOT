
const { howlong } = require('./convertTime');

const totaltime = function (message, userList) {
    let user = userList.get(message.author.id);

    if(userList.has(message.author.id)) {
        if (user.startTime){
            const now = new Date();
            const tmp = new Date();
            tmp.setTime(user.totalTime.getTime() + (now.getTime() - user.startTime.getTime()));
            message.channel.send(`<@${message.author.id}> 오늘 하루  **${howlong(tmp)}** 공부중  :book:`)
        } else {
            message.channel.send(`<@${message.author.id}> 오늘 하루  **${howlong(user.totalTime)}** 공부  :blue_book:`);
        }
    }else {
        message.channel.send(`<@${message.author.id}> 스톱워치를 먼저 시작해주세요.`)
    }
}

module.exports = totaltime;
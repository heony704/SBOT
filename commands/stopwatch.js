
const start = function (message, userList) {
    console.log(userList);
    if (!userList.has(message.author.id)) {
        const userInfo = {
            startTime: null,
            totalTime: new Date(2021, 0)
        }
        userList.set(message.author.id, userInfo);
    }
    console.log(userList);

    let user = userList.get(message.author.id);

    if (user && !user.startTime) {
        user.startTime = new Date();
        const comment = `<@${message.author.id}> 스톱워치 시작`;
        
        message.channel.send(comment);
    }
}

const pause = function (message, userList) {
    let user = userList.get(message.author.id);

    if(userList.has(message.author.id) && user.startTime) {
        const now = new Date();
        user.totalTime.setTime(user.totalTime.getTime() + (now.getTime() - user.startTime.getTime()));
        user.startTime = null;
        const comment = `<@${message.author.id}> 스톱워치 멈춤`;
        message.channel.send(comment);
    }
}

module.exports = { start, pause };
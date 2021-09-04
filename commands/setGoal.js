
const setGoal = function (channel, args) {
    const hour = parseInt(args.at(0));
    if(hour){
        const comment = `목표 공부시간이 **${hour}시간**으로 변경되었습니다.`;
        channel.send(comment);
    }
    return hour;
}

module.exports = setGoal;
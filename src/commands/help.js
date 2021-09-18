
const help = function (channel) {
    let comment = `\`\`\`diff\n`;
    comment += `! 명령어\n`;
    comment += `start , s  스톱워치를 시작합니다.\n`;
    comment += `pause , p  스톱워치를 멈춥니다.\n`;
    comment += `hours , h  오늘 얼마나 공부했는지 알려줍니다.\n`;
    comment += `goal  , g  목표 공부시간을 알려줍니다.\n`;
    comment += `\`\`\``;
    
    channel.send(comment);
}

module.exports = help;
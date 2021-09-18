
const when = function (date) {
    const when = date.getHours() + '시 ' + date.getMinutes() + '분';
    return when;
}

const howlong = function (date) {
    const howlong = date.getHours() + '시간 ' + date.getMinutes() + '분';
    return howlong;
}

const whatDate = function (date) {
    const week = ['일','월','화','수','목','금','토'];
    const day = (date.getMonth()+1) + '월 ' + date.getDate() + '일 ' + week[date.getDay()] + '요일';
    return day;
}

module.exports = { when, howlong, whatDate };
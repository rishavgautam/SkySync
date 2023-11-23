export function GetLocalTime(timeZoneId) {
    const moment = require('moment');
    const currDatetime = moment().tz(timeZoneId).format('YYYY-MM-DD HH:mm');
    return currDatetime
}




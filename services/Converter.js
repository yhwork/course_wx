const moment = require('../lib/moment.min.js');

const __week_text = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
const __week_text_alias = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

class Converter {
    getWeekDay(date) {
        return __week_text[moment(date).isoWeekday() - 1];
    }
    getWeekDayAlias(date) {
        return __week_text_alias[moment(date).isoWeekday() - 1];
    }
}

export default {
    install(app, options) {
        app.plugin('converter', new Converter(options));
    }
} 
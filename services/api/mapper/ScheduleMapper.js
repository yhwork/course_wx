import Mapper from '../Mapper'
const moment = require('../../../lib/moment.min.js');

const __week_day = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
const __week_day_text = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

const ScheduleMapper = {
    weekDay(date) {
        return __week_day[moment(date).day()];
    },

    weekText(weekDays) {
        return weekDays.map(day => __week_day_text[__week_day.findIndex(d => d === day.trim())]);
    },

    reminderText(reminder) {
        switch (reminder) {
            case 15 * 60: return '课前15分钟';
            case 30 * 60: return '课前30分钟';
            case 60 * 60: return '课前1小时';
            case 120 * 60: return '课前2小时';
            case 180 * 60: return '课前3小时';
            case 1440 * 60: return '课前1天';
            case 0: default: return '不提醒';
        }
    },

    mapModel(model) {
        if (!model) { return model; }
        const mapper = new Mapper(model);
        ScheduleMapper.map(mapper);
        return mapper.build();
    },

    map(mapper) {
        mapper.pop('startTime');
        mapper.pop('endTime');
        mapper.push('beginDate', moment(mapper.pop('startDate')).format('YYYY-MM-DD'));
        mapper.push('endDate', moment(mapper.pop('endDate')).format('YYYY-MM-DD'));
        mapper.push('beginTime', mapper.pop('startTimeText'));
        mapper.push('endTime', mapper.pop('endTimeText'));
        ScheduleMapper.mapStatus(mapper);
        ScheduleMapper.mapRule(mapper);
        ScheduleMapper.mapReminder(mapper);
    },

    mapStatus(mapper) {
        const now = moment();
        const begin = moment(`${mapper.peek('beginDate')} ${mapper.peek('beginTime')}`);
        const end = moment(`${mapper.peek('endDate')} ${mapper.peek('endTime')}`);
        if (now.isBefore(begin)) {
            mapper.push('$status', 1);  //! 未开始
        } else if (now.isAfter(end)) {
            mapper.push('$status', 3);  //! 已完结
        } else {
            mapper.push('$status', 2);  //! 已开课
        }
    },

    mapRule(mapper) {
        const rule = mapper.pop('rule');
        const interval = rule.match(/INTERVAL=(\d+)/i)[1];
        const weekDays = rule.match(/BYDAY=(.*?)(;|$)/i)[1].split(',');

        if (interval == 1 && weekDays.length === 7) {
            mapper.push('reptition', 0);
            mapper.push('weekDays', []);
            mapper.push('weekDaysText', '');
            mapper.push('reptitionText', '每天');
            return;
        }

        if (interval == 1 && weekDays.length === 1) {
            mapper.push('reptition', 1);
            mapper.push('weekDays', weekDays);
            mapper.push('weekDaysText', `${ScheduleMapper.weekText(weekDays)[0]}`);
            mapper.push('reptitionText', `每周`);
            return;
        }

        if (interval == 2 && weekDays.length === 1) {
            mapper.push('reptition', 2);
            mapper.push('weekDays', weekDays);
            mapper.push('weekDaysText', `${ScheduleMapper.weekText(weekDays)[0]}`);
            mapper.push('reptitionText', `每两周`);
            return;
        }

        if (interval == 1 && weekDays.length > 1 && weekDays.length < 7) {
            mapper.push('reptition', 3);
            mapper.push('weekDays', weekDays);
            mapper.push('weekDaysText', '');
            mapper.push('reptitionText', `每${ScheduleMapper.weekText(weekDays).join(',')}`);
            return;
        }
    },

    mapConflictModel(model) {
        if (!model) { return model; }
        const mapper = new Mapper(model);
        ScheduleMapper.mapRule(mapper);
        mapper.push('beginDate', moment(mapper.pop('startDate')).format('YYYY-MM-DD'));
        mapper.push('endDate', moment(mapper.pop('endDate')).format('YYYY-MM-DD'));
        mapper.push('beginTime', moment(mapper.pop('startTime')).format('HH:mm'));
        mapper.push('endTime', moment(mapper.pop('endTime')).format('HH:mm'));
        return mapper.build();
    },

    mapReminder(mapper) {
        const reminder = mapper.peek('reminder');
        mapper.push('reminderText', ScheduleMapper.reminderText(reminder));
    },

    parseModel(model) {
        const mapper = new Mapper(model);
        ScheduleMapper.parse(mapper);
        return mapper.build();
    },

    parse(mapper) {
        ScheduleMapper.parseRule(mapper);
        mapper.push('startDate', mapper.pop('beginDate'));
        mapper.push('startTimeText', mapper.pop('beginTime'));
        mapper.push('endTimeText', mapper.pop('endTime'));
    },

    parseRule(mapper) {
        const reptition = mapper.pop('reptition');
        const weekDays = mapper.pop('weekDays');
        const beginDate = mapper.peek('beginDate');
        switch (reptition) {
            case 0:
                mapper.push('rule', 'WEEKLY;INTERVAL=1;BYDAY=MO,TU,WE,TH,FR,SA,SU');
                break;
            case 1:
                mapper.push('rule', `WEEKLY;INTERVAL=1;BYDAY=${ScheduleMapper.weekDay(beginDate)}`);
                break;
            case 2:
                mapper.push('rule', `WEEKLY;INTERVAL=2;BYDAY=${ScheduleMapper.weekDay(beginDate)}`);
                break;
            case 3:
                mapper.push('rule', `WEEKLY;INTERVAL=1;BYDAY=${weekDays.join(',')}`);
                break;
            default:
                break;
        }
    }
}

export default ScheduleMapper
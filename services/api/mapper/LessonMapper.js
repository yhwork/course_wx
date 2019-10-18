import Mapper from '../Mapper'
import CourseMapper from './CourseMapper'
import ScheduleMapper from './ScheduleMapper'
const moment = require('../../../lib/moment.min.js');

const LessonMapper = {
    mapModel(model) {
        const mapper = new Mapper(model);
        LessonMapper.map(mapper);
        return mapper.build();
    },

    map(mapper) {
        mapper.push('date', moment(mapper.pop('date')).format('YYYY-MM-DD'));
        mapper.push('beginDate', moment(mapper.pop('startDate')).format('YYYY-MM-DD'));
        mapper.push('endDate', moment(mapper.pop('endDate')).format('YYYY-MM-DD'));

        const beginTime = moment(mapper.pop('startTime'));
        const endTime = moment(mapper.pop('endTime'));
        mapper.push('beginTime', beginTime.format('HH:mm'));
        mapper.push('endTime', endTime.format('HH:mm'));
        mapper.push('$time', {
            begin: { hour: beginTime.hour(), minute: beginTime.minute() },
            end: { hour: endTime.hour(), minute: endTime.minute() },
            duration: moment.duration(endTime.diff(beginTime)).as('minutes')
        });

        mapper.push('absent', mapper.pop('absent') === 1);
        CourseMapper.mapAddress(mapper);
        LessonMapper.mapStatus(mapper);
        LessonMapper.mapStatusText(mapper);
        LessonMapper.mapWeekDay(mapper);
        ScheduleMapper.mapRule(mapper);
        ScheduleMapper.mapReminder(mapper);
    },

    mapStatus(mapper) {
        const now = moment();
        // const end = moment(`${mapper.peek('date')} ${mapper.peek('endTime')}`);
        const begin = moment(`${mapper.peek('date')} ${mapper.peek('beginTime')}`);
        const absent = mapper.peek('absent');
        mapper.push('$accomplished', (now.isAfter(begin) && !absent));
    },

    mapStatusText(mapper) {
        const absent = mapper.peek('absent');
        const status = mapper.peek('status');
        const accomplished = mapper.peek('$accomplished');
        let $status = '';
        let text = '';

        //! normal, absent, makeup, adjust
        //! 0:正常 1:补课 2:调课
        if (absent) { $status = 'absent'; text = '缺席'; }
        else if (accomplished) { $status = 'accomplished'; text = '已上'; }
        else {
            switch (status) {
                case 0: $status = 'normal'; text = '正常'; break;
                case 1: $status = 'makeup'; text = '补课'; break;
                case 2: $status = 'adjust'; text = '调课'; break;
                default: break;
            }
        }

        mapper.push('$status', $status);
        mapper.push('$statusText', text);
    },

    mapWeekDay(mapper) {
        const date = moment(mapper.peek('date'));
        const text = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
        mapper.push('$weekDay', text[date.isoWeekday() - 1]);
    },

    mapHistoryModel(model) {
        if (!model) return model;
        const mapper = new Mapper(model);
        LessonMapper.mapHistory(mapper);
        return mapper.build();
    },

    mapHistory(mapper) {
        mapper.push('date', moment(mapper.pop('date')).format('YYYY-MM-DD'));
        mapper.push('beginTime', moment(mapper.pop('startTime')).format('HH:mm'));
        mapper.push('endTime', moment(mapper.pop('endTime')).format('HH:mm'));
        LessonMapper.mapWeekDay(mapper);
    },

    parseModel(model) {
        const mapper = new Mapper(model);
        LessonMapper.parse(mapper);
        return mapper.build();
    },

    parse(mapper) {
        mapper.push('absent', Number(mapper.pop('absent')));
    },

    parseAdjustModel(model) {
        const mapper = new Mapper(model);
        const date = mapper.pop('date');
        const beginTime = mapper.pop('beginTime');
        const endTime = mapper.pop('endTime');
        mapper.push('date', moment(date).format('YYYY-MM-DD'));
        mapper.push('startTime', moment(`${date} ${beginTime}`).format('YYYY-MM-DD HH:mm:ss'));
        mapper.push('endTime', moment(`${date} ${endTime}`).format('YYYY-MM-DD HH:mm:ss'));
        return mapper.build();
    },

    parseMakeupModel(model) {
        const mapper = new Mapper(model);
        const date = mapper.pop('date');
        const beginTime = mapper.pop('beginTime');
        const endTime = mapper.pop('endTime');
        mapper.push('date', moment(date).format('YYYY-MM-DD'));
        mapper.push('startTime', moment(`${date} ${beginTime}`).format('YYYY-MM-DD HH:mm:ss'));
        mapper.push('endTime', moment(`${date} ${endTime}`).format('YYYY-MM-DD HH:mm:ss'));
        return mapper.build();
    }


}

export default LessonMapper
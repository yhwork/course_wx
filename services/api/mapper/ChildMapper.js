import Mapper from '../Mapper'
const moment = require('../../../lib/moment.min.js');

const ChildMapper = {


    /*mapModel(model) {
        const mapper = new Mapper(model);
        ChildMapper.map(mapper);
        return mapper.build();
    },

    map(mapper) {
        mapper.replace('birthday', (value) => value ? moment(value).format('YYYY-MM-DD') : value);
        mapper.push('$gender', mapper.peek('gender') === 0 ? '男孩' : '女孩');

        const birthday = mapper.peek('birthday');
        if (birthday) {
            mapper.push('$age', `${Math.floor(moment.duration(moment().diff(moment(birthday))).asYears())}岁`);
        } else {
            mapper.push('$age', '未设置');
        }
    },

    parseModel(model) {
        const mapper = new Mapper(model);
        ChildMapper.parse(mapper);
        return mapper.build();
    },

    parse(mapper) {
        mapper.pop('$gender');
        mapper.pop('$age');
    }*/
}

export default ChildMapper
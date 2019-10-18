import Mapper from '../Mapper'

const CourseMapper = {
    mapModel(model) {
        const mapper = new Mapper(model);
        CourseMapper.map(mapper);
        return mapper.build();
    },

    map(mapper) {
        CourseMapper.mapExternal(mapper);
        CourseMapper.mapCount(mapper);
        CourseMapper.mapAddress(mapper);
        CourseMapper.mapContact(mapper);
    },

    mapExternal(mapper) {
        mapper.push('external', mapper.pop('external') === 1);
        mapper.push('$external', mapper.peek('external') ? '校外' : '校内');
    },

    mapCount(mapper) {
        const count = {
            total: mapper.pop('periodTotal') || 0,
            accomplished: mapper.pop('periodDone') || 0,
        };
        count.last = count.total - count.accomplished;
        mapper.push('count', count);
    },

    mapAddress(mapper) {
        mapper.push('address', {
            address: mapper.pop('addr'),
            latitude: mapper.pop('latitude'),
            longitude: mapper.pop('longitude')
        });
    },

    mapContact(mapper) {
        mapper.push('contact', {
            name: mapper.pop('contact'),
            mobile: mapper.pop('phone')
        });
    },

    parseModel(model) {
        const mapper = new Mapper(model);
        CourseMapper.parse(mapper);
        return mapper.build();
    },

    parse(mapper) {
        CourseMapper.parseExternal(mapper);
        CourseMapper.parseAddress(mapper);
        CourseMapper.parseContact(mapper);
    },

    parseExternal(mapper) {
        mapper.push('external', Number(mapper.pop('external')));
        mapper.pop('$external');
    },

    parseAddress(mapper) {
        const { address, building, latitude, longitude } = mapper.pop('address');
        mapper.push('addr', address);
        mapper.push('latitude', latitude);
        mapper.push('longitude', longitude);
    },

    parseContact(mapper) {
        const { name, mobile } = mapper.pop('contact');
        mapper.push('contact', name);
        mapper.push('phone', mobile);
    }
}

export default CourseMapper
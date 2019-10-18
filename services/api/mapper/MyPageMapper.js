import Mapper from '../Mapper'

const MyPageMapper = {
  mapModel(model) {
    const mapper = new Mapper(model);
    MyPageMapper.map(mapper);
    return mapper.build();
  },

  map(mapper) {
    // MyPageMapper.mapExternal(mapper);
    // MyPageMapper.mapCount(mapper);
    // MyPageMapper.mapAddress(mapper);
    // MyPageMapper.mapContact(mapper);
  },

  
}

export default MyPageMapper
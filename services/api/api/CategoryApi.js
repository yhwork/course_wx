import Resource from '../Resource'
import regeneratorRuntime from '../../../lib/runtime'


class CategoryApi {
  constructor(options) {
    const config = [{
        name: 'get',
        url: '/teachingSubject/getTeachingSub',
        method: 'post'
      },
      {
        name: 'deleteTeachingSub',
        url: '/teachingSubject/deleteTeachingSub',
        method: 'post'
      },
      {
        name: 'addTeachingSub',
        url: '/teachingSubject/addTeachingSub',
        method: 'post'
      }
    ]
    this._resource = new Resource(options, config);
  }

  //获取教学科目
  get(model) {
    const data = {}
    return this._resource.get({
      model: data
    });
  }
  //删除教学科目
  deleteTeachingSub(model) {
    return this._resource.deleteTeachingSub({
      model: model
    });
  }
  //添加教学科目
  addTeachingSub(model) {
    return this._resource.addTeachingSub({
      model: model
    });
  }
}

export default CategoryApi
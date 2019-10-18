import Resource from '../Resource'
import regeneratorRuntime from '../../../lib/runtime'


class AeraApi {
    constructor(options) {
        const config = [
            { name: 'get', url: '/address/loadAreaListByParentId', method: 'post' },
            { name: 'school', url: '/address/loadSchoolListByAreaId', method: 'post' },
            { name: 'schoolSearch', url: '/address/loadAreaListBySchoolName', method: 'post' },
            { name: 'grade', url: '/address/loadGradeListBySchoolType', method: 'post' },
            { name: 'addSchool', url: '/address/addSchool', method: 'post' }
        ]
        this._resource = new Resource(options, config);
    }

    //地区
    get(model) {
        return this._resource.get({ model: model});
    }
    //添加学校
    addSchool(model) {
      return this._resource.addSchool({ model: model });
    }
    //学校
    school(model) {
        return this._resource.school({ model: model});
    }

    //学校搜索
    schoolSearch(model) {
        return this._resource.schoolSearch({ model: model});
    }

    //年级
    grade(model) {
        const modelNew = {typeCode:model.schoolType};
        return this._resource.grade({ model: modelNew});
    }
    
}

export default AeraApi
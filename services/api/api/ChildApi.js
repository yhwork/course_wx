import Resource from '../Resource'
import regeneratorRuntime from '../../../lib/runtime'


class ChildApi {
  constructor(options) {
    const config = [

      {
        name: 'create',
        url: 'child/addChildInfo',
        method: 'post'
      },
      {
        name: 'get',
        url: 'child/getChildListByCondition',
        method: 'post'
      },
      {
        name: 'getShareInfo',
        url: 'child/getChildInfoByShareCode',
        method: 'post'
      },
      {
        name: 'getChildInfor',
        url: '/child/getChildInfor',
        method: 'post'
      },
       
      {
        name: 'getChildListByCondition',
        url: '/child/getChildListByCondition',
        method: 'post'
      },
    ]
    this._resource = new Resource(options, config);
  }


  get(model) {
    const data = {};
    if (typeof model !== 'undefined' && model.childId != '') {
      data.childId = model.childId;
    }
    return this._resource.get({
      model: data
    });
  }

  getChildInfor(model) {
    return this._resource.getChildInfor({
      model: model
    });
  }

  getChildListByCondition(model) {
    return this._resource.getChildListByCondition({
      model: model
    });
  }

  create(model) {
    return this._resource.create({
      model: model
    });
  }

  getShareInfo(model) {
    return this._resource.getShareInfo({
      model: model
    });
  }


}

export default ChildApi
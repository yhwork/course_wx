import regeneratorRuntime from '../../../lib/runtime'
import Resource from '../Resource'

class MyPageApi {
  constructor(options) {
    const config = [
      { name: 'loadMyPageForParent', url: '/user/loadMyPageForParent', method: 'post' },   
      { name: 'getUserTotalIntegral', url: '/integral/getUserTotalIntegral', method: 'post' },   
      { name: 'getAllIntegralRule', url: '/integral/getAllIntegralRule', method: 'post' }, 
      { name: 'getStoreOrderAllByChildId', url: '/storeOrder/getStoreOrderAllByChildId', method: 'post'}    //获取全部订单   
    ] 
    this._resource = new Resource(options, config);
  }

  // 获取我的页面信息(家长端)
  loadMyPageForParent(model) {
    return this._resource.loadMyPageForParent({ model: model });
  }
  // 积分
  getUserTotalIntegral(model) {
    return this._resource.getUserTotalIntegral({ model: model });
  }
  // 积分规则
  getAllIntegralRule(model) {
    return this._resource.getAllIntegralRule({ model: model });
  }
  // 获取全部订单
  getStoreOrderAllByChildId(model) {
    return this._resource.getStoreOrderAllByChildId({ model: model });
  }
}

export default MyPageApi
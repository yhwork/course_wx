const events = {
  ui: {
    tabItem: null,
    delOrder: null, //删除订单
    buyagain: null, //再次购买
    copy: null, //复制
    waitPaymoney:null

  }
}

const effects = {
  getOrderSnapshotInfo: null, //订单详情
  deleteStoreOrder: null, //删除订单 
  addStorePayWx:null,
}

const actions = {}

export {
  events,
  effects,
  actions
}
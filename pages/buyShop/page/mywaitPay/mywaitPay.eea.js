const events = {
  ui: {
    tabItem: null,
    getId: null,
    waitPay: null,
    cancleOrder: null,
    waitPaymoney: null, //待付款
    goBooking: null,
    gotomyBooking: null,
    waitsee: null,
    shopMsgInfo:null,
    goodsDetail:null,
    cancleOrder:null,  //取消订单
    orderDetail:null,//待付款订单详情
    gotoColock:null, //去打卡
    addOrder:null,//邀请好友拼单
    gotoAlreadyColock:null //已打卡

  }
}

const effects = {
  Load_MyPage_For_Parent: null,
  LOAD_IS_BIND_PHONE: null,
  USER_VISIT: null,
  DEMO: null,
  getChildListByCondition: null,
  demoPara: null,
  DEMOWAITPAY: null,
  DEMOWAITSHARE: null,
  DEMOWAITBOOKING: null,
  DEMOWAITRECORD: null,
  DEMOWAITBACK: null,
  addStoreProductGroupHotByNew: null,
  storePayQueryOrder: null,
  addStorePayWx:null,
  updateStoreOrderCancel:null,
  getHotVideoDetails:null,
  getStorePunchToGo:null,
  shareInfoRecord:null //分享功能接口





}

const actions = {}

export {
  events,
  effects,
  actions
}
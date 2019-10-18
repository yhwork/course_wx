import regeneratorRuntime from '../../../lib/runtime'
import Resource from '../Resource'

class CircleApi {
  constructor(options) {
    const config = [{
      name: 'addCommunity',
      url: '/learn/community/addCommunity',
      method: 'post'
    },
    {
      name: 'getCommunityInfo',
      url: '/learn/community/getCommunityInfo',
      method: 'post'
    },
    {
      name: 'getCommunityStatisticsByCondition',
      url: '/learn/community/getCommunityStatisticsByCondition',
      method: 'post'
    },
    {
      name: 'getCommunityUserInfoListByCondition',
      url: '/learn/community/getCommunityUserInfoListByCondition',
      method: 'post'
    },
    {
      name: 'getMyCommunityList',
      url: '/learn/community/getMyCommunityList',
      method: 'post'
    },
    {
      name: 'updateCommunity',
      url: '/learn/community/updateCommunity',
      method: 'post'
    },
    {
      name: 'getCommunityPossiblePerson',
      url: '/learn/community//getCommunityPossiblePerson',
      method: 'post'
    },
    {
      name: 'getCommunityEnumMarks',
      url: '/learn/community/getCommunityEnumMarks',
      method: 'post'
    },
    {
      name: 'updateCommunityFansStatus',
      url: '/fans/updateCommunityFansStatus',
      method: 'post'
    },
    {
      name: 'deleteCommunity',
      url: '/learn/community/deleteCommunity',
      method: 'post'
    },
    {
      name: 'getCommunityMembers',
      url: '/learn/community/getCommunityMembers',
      method: 'post'
    },
    {
      name: 'recommendCommunity',
      url: '/learn/community/recommendCommunity',
      method: 'post'
    },
    {
      name: 'getSignRecordList',
      url: '/learn/signin/getSignRecordList',
      method: 'post'
    },
    {
      name: 'getCommunityStatisticsByCondition',
      url: '/learn/community/getCommunityStatisticsByCondition',
      method: 'post'
    },
    {
      name: 'setCommunityPrivilege',
      url: '/learn/community/setCommunityPrivilege',
      method: 'post'
    },
    {
      name: 'updateReSignInStatus',
      url: '/learn/community/updateReSignInStatus',
      method: 'post'
    },
    {
      name: 'addSignInLike',
      url: '/learn/signin/addSignInLike',
      method: 'post'
    },
    {
      name: 'deleteSignInLike',
      url: '/learn/signin/deleteSignInLike',
      method: 'post'
    },
    {
      name: 'deleteSignIn',
      url: '/learn/signin/deleteSignIn',
      method: 'post'
    },
    {
      name: 'deleteSignInComment',
      url: '/learn/signin/deleteSignInComment',
      method: 'post'
    },
    {
      name: 'deleteSignCommentReply',
      url: '/learn/signin/deleteSignCommentReply',
      method: 'post'
    },
    // /learn/community/getMyCreateValidCommunityList
    {
      name: 'getMyCreateValidCommunityList',
      url: '/learn/community/getMyCreateValidCommunityList',
      method: 'post'
    },
    {
      name: 'updateCommunitySignInTimeRule',
      url: '/learn/community/updateCommunitySignInTimeRule',
      method: 'post'
    },
    {
      name: 'updateCommunityStartEndDate',
      url: '/learn/community/updateCommunityStartEndDate',
      method: 'post'
    },

    {
      name: 'updateSignInDiaryRule',
      url: '/learn/community/updateSignInDiaryRule',
      method: 'post'
    },
    {
      name: 'updateSignInRemindTime',
      url: '/learn/community/updateSignInRemindTime',
      method: 'post'
    },
    {
      name: 'updateCommunityMemberStatus',
      url: '/learn/community/updateCommunityMemberStatus',
      method: 'post'
    },
    {
      name: 'getSignRecordInfo',
      url: '/learn/signin/getSignRecordInfo',
      method: 'post'
    },
    {
      name: 'getSignInStatisticsByCondition',
      url: '/learn/signin/getSignInStatisticsByCondition',
      method: 'post'
    },
    {
      name: 'loadMyFansData',
      url: '/fans/getFansList',
      method: 'post'
    },
    {
      name: 'getMyAttentionList',
      url: '/fans/getMyAttentionList',
      method: 'post'
    },
    {
      name: 'getHistorySubjectList',
      url: '/learn/subject/getHistorySubjectList',
      method: 'post'
    },
    {
      name: 'getSubjectList',
      url: '/learn/subject/getSubjectList',
      method: 'post'
    },
    {
      name: 'updateSubjectStatus',
      url: '/learn/subject/updateSubjectStatus',
      method: 'post'
    },
    {
      name: 'getChildListByCondition',
      url: '/child/getChildListByCondition',
      method: 'post'
    },
    {
      name: 'shareChildInfo',
      url: '/share/shareChildInfo',
      method: 'post'
    },
    {
      name: 'getChildInfoByCondition',
      url: '/child/getChildInfoByCondition',
      method: 'post'
    },
    {
      name: 'copyChildInfoToUser',
      url: '/share/copyChildInfoToUser',
      method: 'post'
    },
    {
      name: 'getUnreadMessageInfo',
      url: '/learn/community/getUnreadMessageInfo',
      method: 'post'
    },
    {
      name: 'reportSignIn',
      url: '/learn/signin/reportSignIn',
      method: 'post'
    },
    {
      name: 'reportCommunity',
      url: '/learn/community/reportCommunity',
      method: 'post'
    },
    {
      name: 'discover',
      url: '/learn/community/discover',
      method: 'post'
    },
    {
      name: 'updateChildInfo',
      url: '/child/updateChildInfo',
      method: 'post'
    },
    {
      name: 'createSubject',
      url: '/learn/subject/createSubject',
      method: 'post'
    },
    {
      name: 'readyCreateSubject',
      url: '/learn/subject/readyCreateSubject',
      method: 'post'
    },
    {
      name: 'getTodaySubject',
      url: '/learn/subject/getTodaySubject',
      method: 'post'
    },
    {
      name: 'getSubjectInfo',
      url: '/learn/subject/getSubjectInfo',
      method: 'post'
    },
    {
      name: 'getCurrentUserInfo',
      url: '/user/getCurrentUserInfo',
      method: 'post'
    },
    {
      name: 'updateUserDetails',
      url: '/user/updateUserDetails',
      method: 'post'
    },
    {
      name: 'getChildMessageRealtionList',
      url: '/share/getChildMessageRealtionList',
      method: 'post'
    },
    {
      name: 'updateChildShareListAuthority',
      url: '/share/updateChildShareListAuthority.do',
      method: 'post'
    },
    {
      name: 'deleteChildShareAuthority',
      url: '/share/deleteChildShareAuthority',
      method: 'post'
    },
    {
      name: 'getUserIsBindingPhone',
      url: '/user/getUserIsBindingPhone',
      method: 'post'
    },
    {
      name: 'subjectSignIn',
      url: 'learn/signin/subjectSignIn',
      method: 'post'
    },
    {
      name: 'getSignInInfo',
      url: '/learn/signin/getSignInInfo',
      method: 'post'
    },
    {
      name: 'getSignInCommentList',
      url: '/learn/signin/getSignInCommentList',
      method: 'post'
    },
    {
      name: 'addSignInComment',
      url: '/learn/signin/addSignInComment',
      method: 'post'
    },
    {
      name: 'addSignInCommentReply',
      url: '/learn/signin/addSignInCommentReply',
      method: 'post'
    },
    {
      name: 'updateSubject',
      url: '/learn/subject/updateSubject',
      method: 'post'
    },
    {
      name: 'getCommunityRule',
      url: '/learn/community/getCommunityRule',
      method: 'post'
    },
    {
      name: 'sendCode',
      url: '/sms/sendCode',
      method: 'post'
    },
    {
      name: 'bindingPhoneAndSetUpPwd',
      url: '/user/bindingPhoneAndSetUpPwd',
      method: 'post'
    },
    {
      name: 'deleteChildInfo',
      url: '/child/deleteChildInfo',
      method: 'post'
    },
    {
      name: 'applyJoinCommunity',
      url: '/learn/community/applyJoinCommunity',
      method: 'post'
    },
    {
      name: 'getSignInLike',
      url: '/learn/signin/getSignInLike',
      method: 'post'
    },
    {
      name: 'updateUnreadMessageInfo',
      url: '/message/updateUnreadMessageInfo',
      method: 'post'
    },

    {
      name: 'getMyAllCommunityList',
      url: '/learn/community/getMyAllCommunityList',
      method: 'post'
    },
    // /learn/signin/getMySignRecordList
    {
      name: 'getMySignRecordList',
      url: '/learn/signin/getMySignRecordList',
      method: 'post'
    },
    { //爆款产品
      name: 'getStoreProductHotList',
      url: '/storeProduct/getStoreProductHotList',
      method: 'post'
    },
    { //爆款产品详情页
      name: 'getStoreProductHotDetailsByPid',
      url: '/storeProduct/getStoreProductHotDetailsByPid',
      method: 'post'

    },
    { //团购页面
      name: 'getStoreProductGroupPreview',
      url: '/storeGroupProduct/getStoreProductGroupPreview',
      method: 'post'
    },
    { //发起拼单
      name: 'addStoreProductGroupHotByNew',
      url: '/storeGroupProduct/addStoreProductGroupHotByNew',
      method: 'post'
    },
    { //参与别人拼单
      name: 'addStoreProductGroupHotJoin',
      url: '/storeGroupProduct/addStoreProductGroupHotJoin',
      method: 'post'
    },
    {
      name: 'storePayQueryOrder', //支付成功接口
      url: '/storePay/storePayQueryOrder',
      method: 'post'
    },
    {
      name: 'checkStoreBuyVerify', //购买产品校验
      url: '/storeBuyVerify/checkStoreBuyVerify',
      method: 'post'
    }, {
      name: "addStorePayWx", //去支付
      url: '/storePay/addStorePayWx',
      method: 'post'
    }, {
      name: "questionnaire", //调查问卷
      url: '/questionnaire/commitQuestionnaire',
      method: 'post'
    },
    {
      name: "shareInfoRecord", //分享
      url: '/share/shareInfoRecord',
      method: 'post'
    },
    {
      name: "getOrderSnapshotInfo", //订单详情
      url: '/storeOrderSnapshot/getOrderSnapshotInfo',
      method: 'post'
    },
      {
        name: "deleteStoreOrder", //删除订单
        url: '/storeOrder/deleteStoreOrder',
        method: 'post'
      },
      {
        name: "getHotVideoDetails", //去观看 视频
        url: '/hotVideo/getHotVideoDetails',
        method: 'post'
      },
      // {
      //   name: "getHotVideoDetails", //去观看 视频
      //   url: '/hotVideo/getHotVideoDetails',
      //   method: 'post'
      // },
      {
        name: 'getHotVideoList',
        url: '/hotVideo/getHotVideoList',
        method: 'post'
      },
      {
        name: "updateStoreOrderCancel", //取消订单
        url: '/storeOrder/updateStoreOrderCancel',
        method: 'post'
      },
      {
        name: "getStorePunchToGo", //取消订单
        url: '/storePunch/getStorePunchToGo',
        method: 'post'
      },
      {
        name: "getStorePunchToResOrg", //去预约接口
        url: '/storePunch/getStorePunchToResOrg',
        method: 'post'
      },
      {
        name: "addStorePunchToResOrgBtn", //预约按钮
        url: '/storePunch/addStorePunchToResOrgBtn',
        method: 'post'
      },
      {
        name: "getMyAppts", //我的预约
        url: '/storePunch/getMyAppts',
        method: 'post'
      },
      {
        name: "getMyClockIn", //我的打卡
        url: '/storePunch/getMyClockIn',
        method: 'post'
      },
      // 视频播放图片列表
      {
        name: 'getUserVideoImgList',
        url: '/hotVideo/getHotVideoList',
        method: 'post'
      },
      {
        name: "addUserVideoCount", //视频次数控制接口
        url: '/hotVideo/addUserVideoCount',
        method: 'post'
      },
      // 视频播放进度
      {
        name:"addVideoTime",
        url:"/hotVideo/addUserVideoTime",
        method:"post"
      },
      {
        name:"getVideoStar",
        url: "/hotVideo/getHotVideoDetails",
        method: "post"
      },
      { //手风琴视频验证
        name: "checkAccordionBuyVerify",
        url: "/storeBuyVerify/checkAccordionBuyVerify",
        method: "post"
      },
      { //手风琴视频验证
        name: "getProductAllGroupInfo",
        url: "/storeGroupProduct/getProductAllGroupInfo",
        method: "post"
      },
      { //产品拼团成功，获取产品拼团
        name: "getProductGroupDetails",
        url: "/storeGroupProduct/getProductGroupDetails",
        method: "post"
      }

    ]
    this._resource = new Resource(options, config);
  }
  // getMyCreateValidCommunityList
  getMyCreateValidCommunityList(model) {
    return this._resource.getMyCreateValidCommunityList({
      model: model
    });
  }
  // 获取我创建和加入的学习圈列表
  getMyAllCommunityList(model) {
    return this._resource.getMyAllCommunityList({
      model: model
    });
  }
  // 我的日记
  getMySignRecordList(model) {
    return this._resource.getMySignRecordList({
      model: model
    });
  }
  // 获取点赞人员头像
  getSignInLike(model) {
    return this._resource.getSignInLike({
      model: model
    });
  }
  // 申请加入圈子
  applyJoinCommunity(model) {
    return this._resource.applyJoinCommunity({
      model: model
    });
  }
  // 删除评论
  deleteSignInComment(model) {
    return this._resource.deleteSignInComment({
      model: model
    });
  }
  // 删除回复的回复
  deleteSignCommentReply(model) {
    return this._resource.deleteSignCommentReply({
      model: model
    });
  }

  // 删除孩子
  deleteChildInfo(model) {
    return this._resource.deleteChildInfo({
      model: model
    });
  }

  // 手机注册
  bindingPhoneAndSetUpPwd(model) {
    return this._resource.bindingPhoneAndSetUpPwd({
      model: model
    });
  }
  // 删除圈子
  deleteCommunity(model) {
    return this._resource.deleteCommunity({
      model: model
    });
  }
  // 发送验证码
  sendCode(model) {
    return this._resource.sendCode({
      model: model
    });
  }

  //获取日记规则
  getCommunityRule(model) {
    return this._resource.getCommunityRule({
      model: model
    });
  }
  //更新主题
  updateSubject(model) {
    return this._resource.updateSubject({
      model: model
    });
  }
  //评论日记
  addSignInComment(model) {
    return this._resource.addSignInComment({
      model: model
    });
  }
  //回复评论
  addSignInCommentReply(model) {
    return this._resource.addSignInCommentReply({
      model: model
    });
  }
  //获取日记回复详情
  getSignInCommentList(model) {
    return this._resource.getSignInCommentList({
      model: model
    });
  }
  //获取日记详情
  getSignInInfo(model) {
    return this._resource.getSignInInfo({
      model: model
    });
  }
  //打卡
  subjectSignIn(model) {
    return this._resource.subjectSignIn({
      model: model
    });
  }

  // 删除孩子对某一人的共享权限
  deleteChildShareAuthority(model) {
    return this._resource.deleteChildShareAuthority({
      model: model
    });
  }

  //获取主题详情
  getSubjectInfo(model) {
    return this._resource.getSubjectInfo({
      model: model
    });
  }
  //获取今日主题
  getTodaySubject(model) {
    return this._resource.getTodaySubject({
      model: model
    });
  }
  //创建主题前查询
  readyCreateSubject(model) {
    return this._resource.readyCreateSubject({
      model: model
    });
  }
  //创建主题readyCreateSubject
  createSubject(model) {
    return this._resource.createSubject({
      model: model
    });
  }

  // 孩子权限管理
  updateChildShareListAuthority(model) {
    return this._resource.updateChildShareListAuthority({
      model: model
    });
  }

  // 获得孩子关系列表
  getChildMessageRealtionList(model) {
    return this._resource.getChildMessageRealtionList({
      model: model
    });
  }

  // 修改个人信息
  updateUserDetails(model) {
    return this._resource.updateUserDetails({
      model: model
    });
  }

  // 修改孩子
  updateChildInfo(model) {
    return this._resource.updateChildInfo({
      model: model
    });
  }

  // 加入孩子
  copyChildInfoToUser(model) {
    return this._resource.copyChildInfoToUser({
      model: model
    });
  }

  // 单个孩子
  getChildInfoByCondition(model) {
    return this._resource.getChildInfoByCondition({
      model: model
    });
  }

  // 分享孩子
  shareChildInfo(model) {
    return this._resource.shareChildInfo({
      model: model
    });
  }

  // 我的孩子
  getChildListByCondition(model) {
    return this._resource.getChildListByCondition({
      model: model
    });
  }

  // 我的关注
  getMyAttentionList(model) {
    return this._resource.getMyAttentionList({
      model: model
    });
  }

  // 我的粉丝
  loadMyFansData(model) {
    return this._resource.loadMyFansData({
      model: model
    });
  }

  // 打卡统计数据
  getSignInStatisticsByCondition(model) {
    return this._resource.getSignInStatisticsByCondition({
      model: model
    });
  }

  // 打卡日历日期
  getSignRecordInfo(model) {
    return this._resource.getSignRecordInfo({
      model: model
    });
  }

  // 更新成员状态
  updateCommunityMemberStatus(model) {
    return this._resource.updateCommunityMemberStatus({
      model: model
    });
  }

  // 打卡提醒时间设置
  updateSignInRemindTime(model) {
    return this._resource.updateSignInRemindTime({
      model: model
    });
  }

  // 日记规则设置
  updateSignInDiaryRule(model) {
    return this._resource.updateSignInDiaryRule({
      model: model
    });
  }

  // 打卡时间设置
  updateCommunitySignInTimeRule(model) {
    return this._resource.updateCommunitySignInTimeRule({
      model: model
    });
  }

  //圈子时间设置
  updateCommunityStartEndDate(model) {
    return this._resource.updateCommunityStartEndDate({
      model: model
    });
  }
  // 补打卡设置
  updateReSignInStatus(model) {
    return this._resource.updateReSignInStatus({
      model: model
    });
  }

  // 圈子隐私
  setCommunityPrivilege(model) {
    return this._resource.setCommunityPrivilege({
      model: model
    });
  }

  // 圈子管理
  getCommunityStatisticsByCondition(model) {
    return this._resource.getCommunityStatisticsByCondition({
      model: model
    });
  }

  // 新增学习圈
  addCommunity(model) {
    return this._resource.addCommunity({
      model: model
    });
  }

  // 孩子
  getMyChildren() {
    return this._resource.getMyChildren({
      model: {}
    });
  }

  // 标签
  getCommunityEnumMarks(model) {
    return this._resource.getCommunityEnumMarks({
      model: model
    });
  }

  // 获取圈子详情信息
  getCommunityInfo(id) {
    return this._resource.getCommunityInfo({
      model: {
        communityId: id
      }
    });
  }

  // 获取圈子统计信息
  getCommunityStatisticsByCondition(model) {
    return this._resource.getCommunityStatisticsByCondition({
      model: model
    });
  }

  // 根据条件获取圈子用户列表数据
  getCommunityUserInfoListByCondition(model) {
    return this._resource.getCommunityUserInfoListByCondition({
      model: model
    });
  }

  // 获取我的学习圈列表
  getMyCommunityList(model) {
    return this._resource.getMyCommunityList({
      model: model
    });
  }

  // 可能认识的人列表
  getCommunityPossiblePerson(model) {
    return this._resource.getCommunityPossiblePerson({
      model: model
    });
  }

  // 关注&取消关注
  updateCommunityFansStatus(model) {
    return this._resource.updateCommunityFansStatus({
      model: model
    });
  }

  // 更新学习圈
  updateCommunity(model) {
    return this._resource.updateCommunity({
      model: model
    });
  }

  // 获取圈子成员
  getCommunityMembers(model) {
    return this._resource.getCommunityMembers({
      model: model
    });
  }

  // 获取精品圈子列表
  recommendCommunity(model) {
    return this._resource.recommendCommunity({
      model: model
    });
  }

  // 获取打卡日记列表
  getSignRecordList(model) {
    return this._resource.getSignRecordList({
      model: model
    });
  }

  // 日记 - 点赞
  addSignInLike(model) {
    return this._resource.addSignInLike({
      model: model
    });
  }

  // 日记 - 取消点赞
  deleteSignInLike(model) {
    return this._resource.deleteSignInLike({
      model: model
    });
  }

  // 日记  -  删除日记
  deleteSignIn(model) {
    return this._resource.deleteSignIn({
      model: model
    });
  }

  //获取圈子历史主题
  getHistorySubjectList(model) {
    return this._resource.getHistorySubjectList({
      model: model
    });
  }
  //删除主题
  updateSubjectStatus(model) {
    return this._resource.updateSubjectStatus({
      model: model
    });
  }
  //获取全部主题
  getSubjectList(model) {
    return this._resource.getSubjectList({
      model: model
    });
  }
  // 获取未读消息
  getUnreadMessageInfo(model) {
    return this._resource.getUnreadMessageInfo({
      model: model
    });
  }

  // 举报日记
  reportSignIn(model) {
    return this._resource.reportSignIn({
      model: model
    });
  }

  // 举报圈子
  reportCommunity(model) {
    return this._resource.reportCommunity({
      model: model
    });
  }

  // 举报圈子
  discover(model) {
    return this._resource.discover({
      model: model
    });
  }

  // 获取当前用户信息
  getCurrentUserInfo(model) {
    return this._resource.getCurrentUserInfo({
      model: model
    });
  }

  // 查询是否绑定手机
  getUserIsBindingPhone(model) {
    return this._resource.getUserIsBindingPhone({
      model: model
    });
  }

  // 更新未读消息的状态
  updateUnreadMessageInfo(model) {
    return this._resource.updateUnreadMessageInfo({
      model: model
    });
  }
  getStoreProductHotList(model) { //获取爆款产品信息
    return this._resource.getStoreProductHotList({
      model: model
    });
  }
  getStoreProductHotDetailsByPid(model) { //爆款产品详情信息
    return this._resource.getStoreProductHotDetailsByPid({
      model: model
    });
  }
  getStoreProductGroupPreview(model) { //团购订单
    return this._resource.getStoreProductGroupPreview({
      model: model
    });
  }
  addStoreProductGroupHotByNew(model) { //发起拼单
    return this._resource.addStoreProductGroupHotByNew({
      model: model
    });
  }
  addStoreProductGroupHotJoin(model) { //参与别人的拼单
    return this._resource.addStoreProductGroupHotJoin({
      model: model
    });
  }
  storePayQueryOrder(model) { //参与别人的拼单
    return this._resource.storePayQueryOrder({
      model: model
    });
  }
  checkStoreBuyVerify(model) { //购买产品校验
    return this._resource.checkStoreBuyVerify({
      model: model
    });
  }
  addStorePayWx(model) { //购买产品校验
    return this._resource.addStorePayWx({
      model: model
    });
  }
  questionnaire(model) { //购买产品校验
    return this._resource.questionnaire({
      model: model
    });
  }
  shareInfoRecord(model) { //分享
    return this._resource.shareInfoRecord({
      model: model
    });
  }
  getOrderSnapshotInfo (model) { //分享
    return this._resource.getOrderSnapshotInfo({
        model: model
      });
  }
  deleteStoreOrder(model) { //删除订单
    return this._resource.deleteStoreOrder({
      model: model
    });
  }
  getHotVideoDetails(model) { //去观看  视频
    return this._resource.getHotVideoDetails({
      model: model
    });
  }
  updateStoreOrderCancel(model) { //取消订单
    return this._resource.updateStoreOrderCancel({
      model: model
    });
  }
  getStorePunchToGo(model) { //去打卡
    return this._resource.getStorePunchToGo({
      model: model
    });
  }
  getStorePunchToGo(model) { //去打卡
    return this._resource.getStorePunchToGo({
      model: model
    });
  }
  getStorePunchToResOrg(model) { //去预约
    return this._resource.getStorePunchToResOrg({
      model: model
    });
  }
 addStorePunchToResOrgBtn(model) { //预约按钮
   return this._resource.addStorePunchToResOrgBtn({
      model: model
    });
  }
  getMyClockIn(model) { //我的打卡
    return this._resource.getMyClockIn({
      model: model
    });
  }
  addUserVideoCount(model) { //视频播放次数
    return this._resource.addUserVideoCount({
      model: model
    });
  }

  getHotVideoList(model){
    return this._resource.getHotVideoList({
      model:model
    })
  }
  // 获取图片列表
  getUserVideoImgList(model){
    return this._resource.getUserVideoImgList({
      model: model
    })
  }
  // 存储播放进度
  addVideoTime(model) {
    return this._resource.addVideoTime({
      model: model
    })
  }
  // 获取视频播放位置
  getVideoStar(){
    return this._resource.getVideoStar({
      model: model
    })
  }
  // 手风琴资格验证
  checkAccordionBuyVerify(model) {
    return this._resource.checkAccordionBuyVerify({
      model: model
    })
  }
  getProductAllGroupInfo(model) { //产品详情页拼团信息
    return this._resource.getProductAllGroupInfo({
      model: model
    })
  }
  getProductGroupDetails(model) { //产品详情页拼团信息
    return this._resource.getProductGroupDetails({
      model: model
    })
  }
}



export default CircleApi
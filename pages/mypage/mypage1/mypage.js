import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../eea/index'
import {
  events,
  effects,
  actions
} from './mypage.eea'

class myPage1 extends EPage {
  get data() {
    return {

      clockerHide: true, //打卡者显示或隐藏 
      childNum: [], //小孩数量
      childList: [], //小孩列表
      courseList: [], //课程列表
      courseNum: 0, //课程数量
      fansList: [], //粉丝列表
      fansNum: 0, //粉丝数量
      followList: [], //关注列表
      followNum: 0, //关注数量
      praisedNum: 0, //被赞次数
      acceptedNum: 0, //被采纳次数
      userInfo: {},
      hasBindPhoneText: '',
      roleSwitchModel: {      // 角色切换
        myClass: '',
        myChild: ''
      },
      role: '',
      userId: null,
      usersd: null,
      childId: null,
      // tabtext:["待付款","待分享","待预约","待打卡","退款订单"]
      tabtext: [{
        text: "待付款",
        src: "https://iforbao-prod.oss-cn-hangzhou.aliyuncs.com/public/assets/img/monney.png"

      }, {
        text: "待分享",
        src: "https://iforbao-prod.oss-cn-hangzhou.aliyuncs.com/public/assets/img/shareone.png"

      }, {
        text: "待预约",
        src: "https://iforbao-prod.oss-cn-hangzhou.aliyuncs.com/public/assets/img/emails.png"
      }, {
        text: "待打卡",
        src: "https://iforbao-prod.oss-cn-hangzhou.aliyuncs.com/public/assets/img/daka.png"
      }, {
        text: "待观看",
        src: "https://iforbao-prod.oss-cn-hangzhou.aliyuncs.com/public/assets/img/daka.png"
      }]

    };
  }

  mapPageEvent({
    put
  }) {
    return {

      [PAGE_LIFE.ON_LOAD](option) {
        this.setData({
          my_11: this.$api.extparam.getPageImgUrl('my_11')
        })
      },
      [PAGE_LIFE.ON_SHOW](option) {
        //this.setData({ my_11: this.$api.extparam.getPageImgUrl('my_11') })
        var role = wx.getStorageSync('role')
        this.setData({
          role: role
        })
        if (role == '0') {
          wx.setTabBarItem({
            index: 1,
            text: '学习圈',
            // iconPath: '/path/to/iconPath',
            // selectedIconPath: '/path/to/selectedIconPath'
          })
        } else if (role == '1') {
          wx.setTabBarItem({
            index: 1,
            text: ' 消息',
            // iconPath: '/path/to/iconPath',
            // selectedIconPath: '/path/to/selectedIconPath'
          })
        }
        let parameter = {};
        put(effects.Load_MyPage_For_Parent, {
          parameter
        });
        //获取本地存储数据
        console.log("获取本地储存数据")
        var that = this
        that.setData({
          childId: wx.getStorageSync('childId')
        })
      },
      // 上拉刷新
      [PAGE_LIFE.ON_PULL_DOWN_REFRESH]() { //上拉刷新
        // put(effects.getStoreProductHotList) //实时请求加载   //方法需要注册
        let time = null;
        time = setTimeout(() => {
          time = null;
          // put(effects.Load_MyPage_For_Parent)
          put(effects.LOAD_IS_BIND_PHONE)
          wx.stopPullDownRefresh()
        }, 200)

      },
      // 下拉刷新
      [PAGE_LIFE.ON_SHARE_APP_MESSAGE]() {
        var time = null;
        time = setTimeout(() => {
          time = null;
          // put(effects.Load_MyPage_For_Parent)
          put(effects.LOAD_IS_BIND_PHONE)
          wx.stopPullDownRefresh()
        }, 800)

        //   // return {
        //   //   title: `[${userInfo.nickName}@我]孩子时间管理利器，我已在使用，不信您试试`,
        //   //   path: '/pages/course/course',
        //   //   imageUrl: '/assets/img/share_course.jpg'
        //   // }
        // },
      }
    }
    mapUIEvent({
      put
    })
    
    return {
      // 个人主页
      [events.ui.MYHOMEPAGE]() {
        wx.navigateTo({
          url: '../../mine/mine?visitId=' + this.data.userInfo.id,
        })
      },
      // 我建的班级
      [events.ui.bindMyClass](e) {
        // wx.navigateTo({
        //   url: '../../course/t_add/class/choose_class?comeFrom=myPage',
        // })
        wx.switchTab({
          url: '../../class/class',
        })
      },
      // 我的圈子
      [events.ui.myCircle](e) {
        console.log(this.data.userInfo.id)
        wx.navigateTo({
          // `../myCircle/myCircle?userMsg=${this.data.userInfo}`   
          url: `../myCircle/myCircle?userId=${this.data.userInfo.id}&userImg=${this.data.userInfo.logo}&userName=${this.data.userInfo.nickName}`
        })
      },
      // 我的日记
      [events.ui.myDiary](e) {
        wx.navigateTo({
          url: `../myDiary?userId=${this.data.userInfo.id}&userImg=${this.data.userInfo.logo}&userName=${this.data.userInfo.nickName}`
        })
      },
      // 使用帮助
      [events.ui.playHelpBind](e) {
        wx.navigateTo({
          url: '../uesHelp/useHelp',
        })
      },
      // 权限管理
      [events.ui.authManageBind](e) {
        wx.navigateTo({
          url: '../authorityManagement/authorityManagement',
        })
      },
      // 申请认证
      [events.ui.bindApplyAuth](e) {
        if (this.data.hasBindPhoneText == '申请认证') {
          wx.navigateTo({
            url: '../../class/class',
          })
        }
      },
      // 切换角色
      [events.ui.changeTeacherBind](e) {
        console.log(this.data.userInfo.role)
        // 家长
        wx.navigateTo({
          url: '../../register/register?ope=changeRole',
        })

      },
      // 消息中心
      [events.ui.messageCenterBind](e) {
        wx.navigateTo({
          url: '../../learningcircle/page/message/message',
        })
      },
      // 关注
      // [events.ui.myAttentionBind](e) {
      //   wx.navigateTo({
      //     // url: '../myAttention/myAttention',
      //     url: '../myFans/myFans?type=attention',
      //   })
      // },
      // 粉丝
      // [events.ui.myFansBind](e) {
      //   wx.navigateTo({
      //     url: '../myFans/myFans?type=fan',
      //   })
      // },
      // [events.ui.seenBind](e) {
      //   // console.log(this.data.userInfo.id)
      //   wx.navigateTo({
      //     // url: '../seen/seen?userId="this.data.userInfo.id"',
      //     url: `../seen/seen?userId=${this.data.userInfo.id}`
      //   })

      // },

      // 打卡者阻止遮罩层下滚动页面
      [events.ui.stopOther](e) {
        return false;
      },
      //显示标签遮罩层
      [events.ui.showLabel](e) {
        this.setData({
          labelHide: false
        })
      },

      //关闭标签遮罩层
      [events.ui.closeLabel](e) {
        this.setData({
          labelHide: true,
          selectMarkIdArray: []
        })
      },

      // 保存选中标签并关闭遮罩层 
      [events.ui.saveMarksAndCloseLabel](e) {
        this.setData({
          labelHide: true,
          'model.communityMark': (this.data.selectMarkIdArray).join(','),
          selectMarkNameArray: this.data.selectMarkNameData
        })
      },

      [events.ui.bindClockerChange](e) { },

      // 积分
      [events.ui.accumulatePoints](e) {
        wx.navigateTo({
          url: '../accumulatePoints/accumulatePoints',
        })
      },
      // 打卡者
      [events.ui.showClocker](e) {
        this.setData({
          clockerHide: false
        })
      },

      // 打卡者
      [events.ui.closeClocker](e) {
        this.setData({
          //关闭标签遮罩层
          clockerHide: true
        })
      },

      [events.ui.bindAllChild](e) {
        // 跳转到全部孩子页面
        wx.navigateTo({
          url: '../myChildren/myChildren',
        })
      },
      [events.ui.bindClickAdd](e) {
        wx.navigateTo({
          url: '../myChildren/myChildren',
        })
      },
      [events.ui.myPay](e) {
        wx.navigateTo({
          url: '../../buyShop/page/mywaitPay/mywaitPay'
        })
      },
      [events.ui.myallList](e) { //查看全部
        wx.navigateTo({
          url: `../../buyShop/page/mywaitPay/mywaitPay?childId=${this.data.childId}&userId=${this.data.userd}`
        })
      },
      [events.ui.waitpayIntem](e) { //查看全部
        let index = e.currentTarget.dataset.index + 1
        console.log(index)
        wx.navigateTo({
          url: `../../buyShop/page/mywaitPay/mywaitPay?childId=${this.data.childId}&userId=${this.data.userd}&showIndex=${index}`
        })
      },

    }
  }

  mapEffect({
    put
  }) {
    const api = this.$api;
    return {
      //加载我的页面数据(家长端)
      [effects.Load_MyPage_For_Parent]({
        parameter
      }) {
        this.$api.mypage.loadMyPageForParent({}).then(res => {
          console.log(res.data)
          this.setData({
            'childNum': res.data.result.childNum,
            'childList': res.data.result.childList,
            'courseList': res.data.result.courseList,
            'courseNum': res.data.result.courseNum,
            'fansList': res.data.result.fansList, //粉丝列表
            'fansNum': res.data.result.fansNum, //粉丝数量
            'followList': res.data.result.followList, //关注列表
            'followNum': res.data.result.followNum, //关注数量          
            userInfo: res.data.result.userInfo
          });
          // console.log(res.data.result.fansNum)

          if (this.data.userInfo.role == 0) {
            // 家长 
            this.setData({
              'roleSwitchModel.myClass': 'true',
              'roleSwitchModel.myChild': '',
            })
            wx.setNavigationBarTitle({
              title: '我的（家长端）'
            })
          } else {
            // 老师
            this.setData({
              'roleSwitchModel.myClass': '',
              'roleSwitchModel.myChild': 'true',
            })
            wx.setNavigationBarTitle({
              title: '我的（教师端）'
            })
          }
          let userd = res.data.result.userInfo.id
          this.setData({
            userd: userd
          })
          console.log("打印用户id*****************************")
          console.log(this.data.userd)
          wx.setStorage({ //储存用户id
            key: 'userId',
            data: this.data.userd,
            success: function (res) {
              console.log(res)
            }
          })
          let inputMap = {
            userId: this.data.userInfo.id
          }
          // console.log(this.data.userInfo.id)
          this.$api.user.getVisitUserNum(inputMap).then((res) => {
            if (res.data.errorCode == 0) {
              this.setData({
                visiteNum: res.data.result.num
              })
            }
          })
          // 查询是否绑定手机
          put(effects.LOAD_IS_BIND_PHONE);
        });
      },
      // [effects.USER_VISIT](){
      //   let inputMap = {
      //     userId: this.data.userInfo.id
      //   }
      //   console.log(inputMap)
      //   this.$api.user.getVisitUserNum(inputMap).then(res => {
      //     console.log(res)
      //   })
      // },
      // 查询当前用户信息
      [effects.LOAD_IS_BIND_PHONE]() {
        this.$api.circle.getUserIsBindingPhone({}).then((res) => {
          let errorCode = res.data.errorCode;
          if (errorCode == '0') {
            // 1绑定 0未绑定
            var isBindingPhone = res.data.result.isBindingPhone;
            if (isBindingPhone == 1) {
              this.setData({
                hasBindPhoneText: '已认证'
              })
            } else {
              this.setData({
                hasBindPhoneText: '申请认证'
              })
            }
          }
        });
      },
    }
  }
}

EApp.instance.register({
  type: myPage1,
  id: 'myPage1',
  config: {
    events,
    effects,
    actions
  }
});
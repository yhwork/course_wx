import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../../eea/index'
import {
  events,
  effects,
  actions
} from './mywaitPay.eea'

const app = getApp();
class mywaitPay extends EPage {
  get data() {
    return {
      // tabText: ["全部", "待付款", "待分享", "待预约", "待打卡", "待观看"],
      tabText: [{
          text: "全部",
          isFlag: false,
          id: 0,
        }, {
          id: 1,
          text: "待付款",
          isFlag: 0
        }, 
        {
          id: 2,
          text: "待分享",
          isFlag: 0
        },
        // {
        //   id: 3,
        //   text: "待预约",
        //   isFlag: 0
        // },
        //  {
        //   id: 4,
        //   text: "待打卡",
        //   isFlag: 0
        // },
        {
          id: 5,
          text: "待观看",
          isFlag: 0
        }
      ],
      activeIndex: 0,
      userId: "",
      childId: "",
      userorderList: "",
      waitPay: "",
      waitShare: "",
      waitBooking: "",
      isIntime: false,
      orderId: "",
      numOrder: "",
      productId: "",
      counts: 3,
      waitSee: "",
      btnShow: "",
      msg: "",
      lable: "",
      courseId: "",
      childId: "",
      isGroup: "",
      type: "",
      orderNumber: "",
      waitseeProductId: "",
      productType: "",
      isPay: false, //是否支付
      waitClock: "",
      shortCode: "",
      showin: false,
      productcourseid: ""

    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        console.log('值', option)
        let activeIndex = option.activeIndex //订单详情删除按钮传过来的tab切换的index
        let type = option.type //订单详情删除按钮传过来的tab切换请求时的类型
        let showIndex = option.showIndex //后期把showIndex 改成 activeIndex
        this.setData({
          userId: option.userId,
          activeIndex: showIndex,
          childId: wx.getStorageSync('childId')
        })
      },
      [PAGE_LIFE.ON_SHOW](option) {
        put(effects.getChildListByCondition)

      },
      [PAGE_LIFE.ON_UNLOAD](option) { //退出当前页
        this.setData({
          isIntime: false
        })
      },
      [PAGE_LIFE.ON_SHARE_APP_MESSAGE](option) {
        console.log("打印分享参数", option)
        let img = option.target.dataset.img
        let title = option.target.dataset.title
        let courseId = option.target.dataset.courseid
        let productId = option.target.dataset.productid
        let productcourseid = option.target.dataset.productcourseid
        console.log("打印productcourseid", productcourseid)
        return {
          title: title,
          desc: '',
          imageUrl: img,
          //## 此为转发给微信好友或微信群后，对方点击后进入的页面链接，可以根据自己的需求添加参数
          path: `/pages/course/courseList/courseList?action=share&code=${this.data.shortCode}&productId=${productId}&courseId=${courseId}& childId=${this.data.childId}&productcourseId=${productcourseid}`,
          //## 转发操作成功后的回调函数，用于对发起者的提示语句或其他逻辑处理
          success: function(res) {
            console.log("转发成功")

          },
          //## 转发操作失败/取消 后的回调处理，一般是个提示语句即可
          fail: function() {
            console.log("转发失败")

          }
        }
      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      [events.ui.tabItem](e) { //tab 切换  进行请求
        console.log(e)
        let index = e.currentTarget.dataset.index
        this.setData({
          activeIndex: index
        })
        if (this.data.activeIndex == 1) { //待付款
          this.$api.mypage.getStoreOrderAllByChildId({
            userId: this.data.userId,
            childId: this.data.childId,
            getType: 1
          }).then(res => {
            console.log('order', res)
            // 先判断请求信息
            let waitPay = res.data.result.orderInfo
            console.log(136, waitPay)
            waitPay.forEach((item, index, array) => {

              let newobj = JSON.parse(item.imgVideo)
              let objArr = Object.values(newobj)
              waitPay[index].imgVideo = objArr

              let newlabobj = JSON.parse(item.lable)
              let labObjArr = Object.values(newlabobj)
              waitPay[index].lable = labObjArr

            })
            this.setData({
              waitPay: waitPay,
              lable: waitPay.lable
            })
            // wx.setStorageSync('waitPay', this.data.waitPay)

          })

        }
        if (this.data.activeIndex == 2) { //点击待分享按钮
          this.$api.mypage.getStoreOrderAllByChildId({
            userId: this.data.userId,
            childId: this.data.childId,
            getType: 2
          }).then(res => {
            if (res.data.errorCode == 0 && res.data.result) {
              let waitShare = res.data.result.orderInfo
              console.log("打印待分享数据", waitShare)
              waitShare.forEach((item, index) => {
                let obj = item.imgVideo
                let newobj = JSON.parse(obj)
                let objArr = Object.values(newobj)
                waitShare[index].imgVideo = objArr
                let lableObj = item.lable
                let newlabobj = JSON.parse(lableObj)
                let labObjArr = Object.values(newlabobj)
                waitShare[index].lable = labObjArr
              })
              this.setData({
                waitShare: waitShare
              })

            } else {

            }
          })

        }
        if (this.data.activeIndex == 3) { //点击待预约按钮
          this.data.tabText[3].isFlag = ++this.data.tabText[3].isFlag
          let num = this.data.tabText[3].isFlag
          this.$api.mypage.getStoreOrderAllByChildId({
            userId: this.data.userId,
            // userId: 100048,
            childId: this.data.childId,
            getType: 3
          }).then(res => {

            let waitBooking = res.data.result.orderInfo
            console.log(999999, waitBooking)
            waitBooking.forEach((item, index) => {
              let obj = item.imgVideo
              let newobj = JSON.parse(obj)
              let objArr = Object.values(newobj)
              waitBooking[index].imgVideo = objArr
              let lableObj = item.lable
              let newlabobj = JSON.parse(lableObj)
              let labObjArr = Object.values(newlabobj)
              waitBooking[index].lable = labObjArr
            })

            this.setData({
              waitBooking: waitBooking
            })

            wx.setStorageSync("waitBooking", this.data.waitBooking)

          })


        }
        if (this.data.activeIndex == 4) { //待打卡
          this.$api.mypage.getStoreOrderAllByChildId({
            userId: this.data.userId,
            // userId: 100048,
            childId: this.data.childId,
            getType: 4
          }).then(res => {
            let waitClock = res.data.result.orderInfo
            waitClock.forEach((item, index) => {
              let obj = item.imgVideo
              let newobj = JSON.parse(obj)
              let objArr = Object.values(newobj)
              waitClock[index].imgVideo = objArr
              let lableObj = item.lable
              let newlabobj = JSON.parse(lableObj)
              let labObjArr = Object.values(newlabobj)
              waitClock[index].lable = labObjArr
            })

            this.setData({
              waitClock: waitClock
            })

            wx.setStorageSync("waitClock", this.data.waitClock)

          })
        }
        if (this.data.activeIndex == 5) { //待观看

          // this.data.tabText[5].isFlag = ++this.data.tabText[3].isFlag
          // let num = this.data.tabText[5].isFlag
          // 获取待观看视频列表
          this.$api.mypage.getStoreOrderAllByChildId({
            userId: this.data.userId,
            // userId: 100048,
            childId: this.data.childId,
            getType: 6
          }).then(res => {
            let waitSee = res.data.result.orderInfo
            waitSee= waitSee.map((item, index) => {
              item.imgVideo= Object.values(JSON.parse(item.imgVideo))    // 数组 返回属性的值
              item.lable = Object.values(JSON.parse(item.lable))
              return item
            })
            this.setData({
              waitSee: waitSee
            })
            console.log('111111',this.data.waitSee)
            // wx.setStorageSync("waitSee", this.data.waitSee)

          })
        }

        // put(effects.DEMO)
        // put(effects.DEMOWAITPAY)
        // put(effects.DEMOWAITSHARE)
        // put(effects.DEMOWAITBOOKING)
        // put(effects.DEMOWAITRECORD)
        // put(effects.DEMOWAITBACK)        // 带观看
      },
      [events.ui.waitPaymoney](e) { //去支付
        console.log("打印去支付===========")
        var that = this
        //跳转待观看或者是待预约
        this.setData({
          orderId: e.currentTarget.dataset.ordernumber,
          productId: e.currentTarget.dataset.productid,
          productType: e.currentTarget.dataset.producttype
        })
        console.log("打印productType", this.data.productType)
        put(effects.addStorePayWx)



      },
      [events.ui.goBooking](e) { //去预约
        let orderNumber = e.currentTarget.dataset.ordernumber
        wx.navigateTo({
          url: `/pages/buyShop/page/myOrder/myOrder?orderNumber=${orderNumber}&childId=${this.data.childId}`
        })
      },
      [events.ui.gotomyBooking](e) { //我的预约
        let orderNumber = e.currentTarget.dataset.ordernumber
        wx.navigateTo({
          url: `../mynewBooking/mynewBooking?orderNumber=${orderNumber}&childId=${this.data.childId}`
        })
      },
      [events.ui.gotoColock](e) { //去打卡
        let orderNumber = e.currentTarget.dataset.num
        // console.log(orderNumber)
        wx.navigateTo({
          url: `../myColockin/myColockin?orderNumber=${orderNumber}`
        })
        // console.log(orderNumber)
        put(effects.getStorePunchToGo)
      },
      // 去观看
      [events.ui.waitsee](e) {
        // wx.showToast({
        //   title: '请在7月6号观看',
        //   duration: 2000,
        //   icon: "success"
        // })
        //  console.log(318,e)
        let productId = e.currentTarget.dataset.productid
        let num = e.currentTarget.dataset.num

        this.setData({
          productId: productId

        })

        // pages/buyShop/page/watchTv/watchTv           观看

        // pages/buyShop/page/watchTvList/watchTvList    产品id和订单数
        // wx.navigateTo({
        //   url: `../watchTvList/watchTvList?productId=${productId}&orderNumber=${num}`
        // })
        wx.navigateTo({
          url: `/pages/buyShop/page/watchTv/watchTv?productId=${productId}&orderNumber=${num}`,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })


      },
      [events.ui.goodsDetail](e) { //跳转商品详情
        console.log("跳转商品详情页============")
        let activeIndex = e.currentTarget.id //显示的activeIndex
        let type = e.currentTarget.id //  tab切换的订单类型 和activeIndex值一样
        let status = e.currentTarget.dataset.paystatus
        let orderNumber = e.currentTarget.dataset.ordernumber
        let productId = e.currentTarget.dataset.productid
        // console.log(productId)
        if (status == 1) {
          wx.navigateTo({
            url: `../orderDetail/orderDetail?order=${orderNumber}&productId=${productId}&activeIndex=${activeIndex}&type=${type}` //待支付订单详情
          })
        } else if (status == 2) {
          // if(e.currentTarget.dataset.type=='8'){
          wx.navigateTo({
            url: `../mywaitOrders/mywaitOrders?order=${orderNumber}&productId=${productId}&activeIndex=${activeIndex}&type=${type}` //已支付订单详情
          })
          // }
        } else {

        }

      },
      [events.ui.cancleOrder](e) { //取消订单

        this.setData({
          orderNumber: e.currentTarget.dataset.ordernumber
        })

        wx.showModal({
          title: '提示',
          content: '确认删除吗？',
          showCancel: true,
          cancelText: '取消',
          confirmText: '确认',
          success: function(res) {
            console.log(res)
            if (res.cancel) {
              //点击取消,默认隐藏弹框
              wx.showToast({
                title: '取消失败',
                icon: 'none'
              })
            } else {
              //点击确定
              put(effects.updateStoreOrderCancel)

            }
          },

        })
      },
      [events.ui.addOrder](e) {

      },
      [events.ui.gotoAlreadyColock](e) { //我的打卡
        let orderNumber = e.currentTarget.dataset.ordernumber
        wx.navigateTo({
          url: `../alreadyColockin/alreadyColockin?orderNumber=${orderNumber}&childId=${this.data.childId}`
        })


      }




    }
  }




  mapEffect({
    put
  }) {
    const api = this.$api;
    return {
      [effects.getChildListByCondition](v) {
        this.$api.circle.getChildListByCondition({}).then(res => {
          let list = res.data.result.childList
          // console.log(list[0].childId)
          this.setData({
            childId: list[0].childId //默认小孩的childId
          })
          put(effects.DEMO)
          if (this.data.activeIndex == 1) { //待付款
            put(effects.DEMOWAITPAY)
          }
          if (this.data.activeIndex == 2) { //待分享
            put(effects.DEMOWAITSHARE)
          }
          if (this.data.activeIndex == 3) {
            put(effects.DEMOWAITBOOKING) //待预约
          }
          if (this.data.activeIndex == 4) {
            put(effects.DEMOWAITRECORD) //待打卡
          }
          if (this.data.activeIndex == 5) {
            put(effects.DEMOWAITBACK) //待观看
          }

        })
      },
      [effects.DEMO]() {
        this.$api.mypage.getStoreOrderAllByChildId({ //全部
          userId: this.data.userId,
          childId: this.data.childId,
          getType: 0
        }).then(res => {
          console.log(res, '全部')
          let userorderList = res.data.result.orderInfo
          userorderList.forEach((item, index) => {
            let obj = item.imgVideo
            let newobj = JSON.parse(obj)
            let objArr = Object.values(newobj)
            userorderList[index].imgVideo = objArr
            let lableObj = item.lable
            let newlabobj = JSON.parse(lableObj)
            let labObjArr = Object.values(newlabobj)
            userorderList[index].lable = labObjArr
          })
          this.setData({
            userorderList: userorderList
          })
        })
      },
      [effects.DEMOWAITPAY]() { //待付款
        this.$api.mypage.getStoreOrderAllByChildId({
          userId: this.data.userId,
          childId: this.data.childId,
          getType: 1
        }).then(res => {
          // console.log(res.data.result)
          let waitPay = res.data.result.orderInfo
          waitPay.forEach((item, index) => {
            let obj = item.imgVideo
            let newobj = JSON.parse(obj)
            let objArr = Object.values(newobj)
            waitPay[index].imgVideo = objArr
            let lableObj = item.lable
            let newlabobj = JSON.parse(lableObj)
            let labObjArr = Object.values(newlabobj)
            waitPay[index].lable = labObjArr

          })
          this.setData({
            waitPay: waitPay,
            lable: waitPay.lable
          })
        })
      },
      [effects.DEMOWAITSHARE]() { //分享
        this.$api.mypage.getStoreOrderAllByChildId({
          userId: this.data.userId,
          childId: this.data.childId,
          getType: 2
        }).then(res => {
          let waitShare = res.data.result.orderInfo
          waitShare.forEach((item, index) => {
            let obj = item.imgVideo
            let newobj = JSON.parse(obj)
            let objArr = Object.values(newobj)
            waitShare[index].imgVideo = objArr
            let lableObj = item.lable
            let newlabobj = JSON.parse(lableObj)
            let labObjArr = Object.values(newlabobj)
            waitShare[index].lable = labObjArr
          })
          this.setData({
            waitShare: waitShare
          })
        })
      },
      [effects.DEMOWAITBOOKING]() { //从我的主页跳进 待预约
        this.$api.mypage.getStoreOrderAllByChildId({
          userId: this.data.userId,
          childId: this.data.childId,
          getType: 3
        }).then(res => {
          // console.log("打印待预约数据 ======")
          // console.log(res.data.result)
          let waitBooking = res.data.result.orderInfo
          waitBooking.forEach((item, index) => {
            let obj = item.imgVideo
            let newobj = JSON.parse(obj)
            let objArr = Object.values(newobj)
            waitBooking[index].imgVideo = objArr
            // console.log("打印数据 155 待分享图片")
            // console.log(waitBooking[0].imgVideo)
            // let lableObj = item.lable
            // let newlabobj = JSON.parse(lableObj)
            // let labObjArr = Object.values(newlabobj)
            //  waitBooking[index].lable = labObjArr
          })

          this.setData({
            waitBooking: waitBooking
          })
          //待分享逻辑
        })
      },
      [effects.DEMOWAITRECORD]() { //待打卡
        this.$api.mypage.getStoreOrderAllByChildId({
          userId: this.data.userId,
          childId: this.data.childId,
          getType: 4
        }).then(res => {
          let waitClock = res.data.result.orderInfo
          waitClock.forEach((item, index) => {
            let obj = item.imgVideo
            let newobj = JSON.parse(obj)
            let objArr = Object.values(newobj)
            waitClock[index].imgVideo = objArr
            let lableObj = item.lable
            let newlabobj = JSON.parse(lableObj)
            let labObjArr = Object.values(newlabobj)
            waitClock[index].lable = labObjArr
          })

          this.setData({
            waitClock: waitClock
          })
        })
      },
      [effects.DEMOWAITBACK]() { //待观看
        this.$api.mypage.getStoreOrderAllByChildId({
          userId: this.data.userId,
          childId: this.data.childId,
          getType: 6
        }).then(res => {
          console.log("待观看数据", res.data.result.orderInfo)
          let waitSee = res.data.result.orderInfo
          waitSee.forEach((item, index) => {
            let obj = item.imgVideo
            let newobj = JSON.parse(obj)
            let objArr = Object.values(newobj)
            waitSee[index].imgVideo = objArr
            let lableObj = item.lable
            let newlabobj = JSON.parse(lableObj)
            let labObjArr = Object.values(newlabobj)
            waitSee[index].lable = labObjArr

          })
          this.setData({
            waitSee: waitSee
          })
          // console.log(this.data.waitSee)
        })
      },
      [effects.updateStoreOrderCancel]() { //取消订单
        this.$api.circle.updateStoreOrderCancel({
          orderNumber: this.data.orderNumber
        }).then(res => {
          if (res.data.errorCode == 0) {
            put(effects.DEMO)
            put(effects.DEMOWAITPAY)
            put(effects.DEMOWAITSHARE)
            put(effects.DEMOWAITBOOKING)
            put(effects.DEMOWAITRECORD)
            put(effects.DEMOWAITBACK)
            wx.showToast({
              title: '取消成功',
            })
          } else {
            wx.showToast({
              title: '取消失败',
            })
          }
        })
      },
      [effects.addStorePayWx]() { //微信支付接口
        console.log("调取微信支付接口===========")
        var that = this
        this.$api.circle.addStorePayWx({
          productId: this.data.productId,
          userId: this.data.userId,
          childId: this.data.childId,
          orderId: this.data.orderId
        }).then((res) => {

          if (res.data.errorCode == 0 && res.data.result != null) { //数据不为空
            this.setData({
              orderNumber: res.data.result.orderId
            })
            let wxPayResult = res.data.result.wxPayResult
            this.setData({
              appId: wxPayResult.appId,
              nonceStr: wxPayResult.nonceStr,
              packageValue: wxPayResult.packageValue,
              paySign: wxPayResult.paySign,
              signType: wxPayResult.signType,
              timeStamp: wxPayResult.timeStamp,

            })
            var pages = this
            wx.requestPayment({
              "appId": this.data.appId,
              "timeStamp": this.data.timeStamp,
              "nonceStr": this.data.nonceStr,
              "package": this.data.packageValue,
              "signType": "MD5",
              "paySign": this.data.paySign,
              success(res) { //点击去支付成功按钮  跳转支付成功页面
                console.log(640, res)
                if (that.data.productType == 7) { //跳转待观看
                  that.setData({ //支付成功跳转待观看 
                    activeIndex: 5
                  })
                  put(effects.DEMOWAITBACK)
                  that.setData({ //已经支付
                    isPay: true
                  })
                } else if (that.data.productType == 29) { //活动类的
                  that.setData({ //支付成功跳转待分享
                    activeIndex: 2
                  })
                  put(effects.DEMOWAITSHARE)

                } else if (that.data.productType == 5) { //点击去支付成功按钮 跳转待预约
                  that.setData({
                    activeIndex: 3
                  })
                  that.setData({ //支付成功后 记录数据状态，再次点击待支付的时候  待支付数据进行删除一条
                    isPay: true
                  })
                  put(effects.DEMOWAITBOOKING)
                }
                that.$api.circle.storePayQueryOrder({
                  outTradeNo: that.data.orderNumber
                }).then((res) => {
                  // console.log(res)
                  // console.log("打印去支付的回调函数 支付成功的回调=======")

                })
              },
              fail(res) {
                wx.showToast({
                  title: '支付失败',
                  mask: true,
                  icon: 'success',
                })
                //跳待付款页面
                // wx.navigateTo({
                //   url: `/pages/buyShop/page/mywaitPay/mywaitPay?showIndex=${pages.data.showIndex}&userId=${pages.data.userId}`
                // })
              }
            })

          } else {
            wx.showToast({
              title: "获取后端数据失败",
              mask: true,
              icon: 'success'
            })

          }

        })

      },
      [effects.getHotVideoDetails]() { //去观看视频

      },
      [effects.getStorePunchToGo]() { //去打卡
        this.$api.circle.getStorePunchToGo({
          orderNumber: this.data.orderNumber

        }).then((res) => {
          console.log(res)

        })

      },
      [effects.shareInfoRecord]() {
        this.$api.circle.shareInfoRecord({
          dataType: 9,
          data: {}
        }).then((res) => { //分享
          let shortCode = res.data.result.shortCode
          this.setData({
            shortCode: shortCode
          })

        })
      }
    }
  }
}

EApp.instance.register({
  type: mywaitPay,
  id: 'mywaitPay',
  config: {
    events,
    effects,
    actions
  }
});
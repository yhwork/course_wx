


import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../../eea/index'
import {
  events,
  effects,
  actions
} from './mywaitOrders.eea'


const app = getApp();
class mywaitOrders extends EPage {
  get data() {
    return {
      orderNumber: "",
      productTitle: "",
      productDescr: "",
      productLable: "",
      orderMoney: "",
      orderPayCanal: "",
      orderPayTime: "",
      orderChildName: "",
      orderChildLogo: "",
      orderAddTime: "",
      imgVideo:'',
      lable: "",
      productId: "",
      userId: "",
      activeIndex: "",
      Tabtype: "",
      courseId: "",  //课程id
      orderPayEndTime: "",//倒计时
      timers: "",
      cutTime: "",
      isshow: true,
      orderPayStatus:'',
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        let order = option.order
        let productId = option.productId
        let activeIndex = option.activeIndex
        let Tabtype = option.type
        this.setData({
          orderNumber: order,
          productId: productId,
          Tabtype: Tabtype,
          activeIndex: activeIndex
        })
        // console.log("打印 productId  ")
        // console.log(this.data.productId)
        put(effects.getOrderSnapshotInfo)


      },

      [PAGE_LIFE.ON_UNLOAD](option) { //退出当前页 返回上一页
        // console.log("清理倒计时")
        clearInterval(this.data.timers)

      },
    }
  }

  mapUIEvent({
    put
  }) {
    return {

      [events.ui.delOrder](e) { //删除订单
        put(effects.deleteStoreOrder)

      },
      [events.ui.buyagain](e) { //再次购买
      // console.log(this.data.courseId)
      // console.log(this.data.productId)
        wx.navigateTo({
          url: `../hotProduct/hotProduct?courseId=${this.data.courseId}&productId=${this.data.productId}`
        })

      },
      [events.ui.copy](e) {
        wx.setClipboardData({
          data: this.data.orderNumber,
          success: function (res) {
            wx.getClipboardData({
              success: function (res) {
                wx.showToast({
                  title: '复制成功'
                })
              }
            })
          }
        })
      }
    }
  }




  mapEffect({
    put
  }) {
    const api = this.$api;
    return {
      [effects.getOrderSnapshotInfo](e) { //订单详情
        this.$api.circle.getOrderSnapshotInfo({
          orderNumber: this.data.orderNumber  // 后期让后端改下 订单号，暂时写死
          //  orderNumber:"0"
        }).then((res) => {
          // console.log("请求订单   在订单中  打印获取订单数据 =====")
          console.log('order',res)
          let self = this
          // console.log(res.data)
          if (res.data.errorCode == 0 && res.data.result) {
            let product = res.data.result.orderSnapshot[0]
            console.log(product)
            let orderPayEndTime = product.orderPayEndTime
            this.setData({
              imgVideo: JSON.parse(product.productImgVideo),
              productTitle: product.productTitle, //标题
              productDescr: product.productSubtitle, //描述
              productLable: JSON.parse(product.productLable), //标签
              orderMoney: product.orderMoney, //价格
              orderPayCanal: product.orderPayCanal, //支付方式
              orderPayTime: product.orderPayTime, //支付时间
              orderChildName: product.orderChildName, //小孩昵称
              orderChildLogo: product.orderChildLogo, //小孩头像
              orderAddTime: product.orderAddTime, //下单时间
              orderOrderNumber: product.orderOrderNumber,//订单号
              userId: product.orderUserId,
              courseId: product.productCourseId,
              orderPayEndTime: orderPayEndTime,
              orderPayStatus:product.orderPayStatus
            })
            // console.log(this.data.courseId)
    
            // console.log(this.data.productTitle)
            //单个倒计时
            // console.log("打印倒计时时间=====")
            // console.log(this.data.orderPayEndTime)
            function countdowm(timestamp) {
              self.data.timers = setInterval(function () {
                let nowTime = new Date()
                let endTime = new Date(timestamp)
                let t = endTime.getTime() - nowTime.getTime()
                if (t > 0) {
                  let day = Math.floor(t / 86400000)
                  let hour = Math.floor((t / 3600000) % 24)
                  let min = Math.floor((t / 60000) % 60)
                  let sec = Math.floor((t / 1000) % 60)
                  // let msec = Math.floor((t % 1000) / 100)
                  hour = hour < 10 ? '0' + hour : hour
                  min = min < 10 ? '0' + min : min
                  sec = sec < 10 ? '0' + sec : sec
                  // msec = msec < 0 ? '0' + msec : msec
                  let format = ''
                  if (day > 0) {
                    format = `${day}天${hour}小时${min}分${sec}秒`
                  }
                  if (day <= 0 && hour > 0) {
                    format = `${hour}小时${min}分${sec}秒`
                  }
                  if (day <= 0 && hour <= 0) {
                    format = `${min}分${sec}秒`
                  }
                  self.setData({
                    cutTime: format
                  })
                  // console.log('单个定时器********************************')
                } else if (t == 0) {
                  self.setData({
                    isshow: false
                  })

                } else {
                  clearInterval(self.data.timers)
                  self.setData({
                    cutTime: "倒计时00天"
                  })
                }
              }, 1000)
            }
            countdowm(this.data.orderPayEndTime)
            // countdowm(orderPayEndTime) 


          }




        })

      },
      [effects.deleteStoreOrder](e) { //删除订单
        this.$api.circle.deleteStoreOrder({
          orderNumber: "20190601172508332250292987113472"
        }).then((res) => {
          // console.log(res)
          if (res.data.errorCode == 0) {
            wx.navigateTo({
              url: `../mywaitPay/mywaitPay?userId=${this.data.userId}&activeIndex=${this.data.activeIndex}&type=${this.data.Tabtype}`
            })
          }

        })

      },




    }
  }
}

EApp.instance.register({
  type: mywaitOrders,
  id: 'mywaitOrders',
  config: {
    events,
    effects,
    actions
  }
});
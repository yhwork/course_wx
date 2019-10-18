// import regeneratorRuntime from '../../../../lib/runtime'
// const clocks = require("../../../../lib/clocks.js")

import {
  clocks
} from "../../../../lib/clocks.js"
import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../../eea/index'
import {
  events,
  effects,
  actions
} from './payList.eea'

class payList extends EPage {
  get data() {
    return {
      shownum: 1,
      showModal: true,
      attendList: true,
      totalMoney: 0,
      price: 20,
      time: "2019,4,27 12:00:00",
      productId: "",
      title: "",
      startTime: "",
      endTime: "",
      groupPrice: "",
      num: "",
      pool: "",
      totalPerson: "",
      poolist: "",
      cutdowm: [],
      newtime: "2019-4-26 19:47:06",
      showDatetime: [],
      userinfoid: "",
      childId: "", //小孩id
      param: {},
      userId: "",
      groupId: "",
      grouplist: [],
      activeNumber: "",
      newpoolist: "",
      counttime: '', //清理定时器
      modalisShow: true,
      userName: "",
      cutTime: "",
      timers: "",
      itemShow: false,
      appId: "",
      nonceStr: "",
      packageValue: "",
      paySign: "",
      signType: "",
      timeStamp: "",
      showIndex:1,
      orderNumber:"",
      showNum:"",
      shopCover:"",
      userLogo:"",
      numIndex:"",
      pindanMaster:"",
      resultType:"",
      gotoGroupIndex:"",
      courseId:"",
      endTime:"",
      startTime:"",
      groupStartTime:"",
      groupEndTimes:"",
      iexist:"",
      text:"参与拼团",
      isshare:"",
      start2:"",
      end2:"",
      changeText:"",
      texttext:"发起拼团",
      iownerArr:[],
      commonArr:[],
      groupSurplusNumber:"",
      newendtime:"",
      newstarttime:""



    };

  }


  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_SHOW](options) {},
      [PAGE_LIFE.ON_LOAD](options) {
        console.log("打印日期",options)
        let {
          productId,
          childId,
          productCourseId,
          courseId,
          changeText,
          endTime,
          startTime
        }=options
        console.log(105, options)
        this.setData({
          productId: productId,
          childId: childId,
          productCourseId: productCourseId,
          courseId: courseId,
          changeText: changeText,
          newendtime:endTime,
          newstarttime: startTime
        })
        console.log(114,this.data.productCourseId, this.data.childId, this.data.productId)
        if (this.data.changeText=="true"){
          this.setData({
            texttext:"参与拼团"
          })
        }
        this.data.param={
          productId: productId,
          childId: childId,
          productCourseId: productCourseId
        }
        put(effects.getStoreProductGroupPreview)
        put(effects.loadMyPageForParent)
        put(effects.getStoreProductHotDetailsByPid)
      },
      [PAGE_LIFE.ON_UNLOAD](options) { //页面离开销毁计时器、
        // console.log("隐藏到后台++++++++++++++++++++++++++++")
        clearInterval(this.data.counttime)

      },
      [PAGE_LIFE.ON_PULL_DOWN_REFRESH](){
        wx.stopPullDownRefresh()
       
      }

    }
  }

  mapUIEvent({ //事件方法
    put
  }) {
    return {
      // [events.ui.cans](e) { //减
      //   this.setData({
      //     shownum: --this.data.shownum
      //   })
      //   if (this.data.shownum < 0) {
      //     this.setData({
      //       shownum: 0
      //     })
      //   }
      //   let money = this.data.price * this.data.shownum
      //   this.setData({
      //     totalMoney: money
      //   })

      // },
      // [events.ui.plus](e) { //加
      //   this.setData({
      //     shownum: ++this.data.shownum
      //   })
      //   let money = this.data.groupPrice * this.data.shownum
      //   this.setData({
      //     totalMoney: money
      //   })
      // },
      [events.ui.showM](e) {
        this.setData({
          showModal: false
        })
      },
      [events.ui.closeM](e) {
        put(effects.getStoreProductGroupPreview)
        this.setData({
          showModal: true
        })
        //关闭定时器
        clearInterval(this.data.counttime)
      },
      [events.ui.goodsDetails](e) {
        wx.navigateTo({
          url: `../hotProduct/hotProduct?productId=${this.data.productId}&courseId=${this.data.productCourseId}&iscanBuy=true&back=true&childId=${this.data.childId}`
        })

      },
      [events.ui.stopPageScroll](e) { //catchtouchmove阻止弹窗后滚动穿透 放在当前显示的元素节点上
        return
      },
      [events.ui.attendlist](e) { //打开去拼单弹框
        let { index, name, time, groupid, iexist} = e.currentTarget.dataset
        if (iexist=="true") {
         this.setData({
           text:"已拼团"
         })

        }
        let pindanMaster = this.data.poolist[index].userLogo
        this.setData({
          modalisShow: false,
          userName: name,
          pindanMaster: pindanMaster,
          groupId: groupid,
        })
        
        //单个倒计时
        let self = this
        function countdowm(timestamp) {
          self.data.timers = setInterval(function() {
            let nowTime = new Date()
            let endTime = new Date(timestamp)
            let t = endTime.getTime() - nowTime.getTime()
            if (t > 0) {
              let day = Math.floor(t / 86400000)
              let hour = Math.floor((t / 3600000) % 24)
              let min = Math.floor((t / 60000) % 60)
              let sec = Math.floor((t / 1000) % 60)
              let msec = Math.floor((t % 1000) / 100)
              hour = hour < 10 ? '0' + hour : hour
              min = min < 10 ? '0' + min : min
              sec = sec < 10 ? '0' + sec : sec
              msec = msec < 0 ? '0' + msec : msec
              let format = ''
              if (day > 0) {
                format = `${day}.${hour}.${min}.${sec}.${msec}`
              }
              if (day <= 0 && hour > 0) {
                format = `${hour}.${min}.${sec}.${msec}`
              }
              if (day <= 0 && hour <= 0) {
                format = `${min}.${sec}.${msec}`
              }
              self.setData({
                cutTime: format
              })
              console.log('单个定时器********************************')
            } else {
              clearInterval(self.data.timers)
              self.setData({
                cutTime: "倒计时00天"
              })
            }
          }, 15)
        }
        // let time = "2019,5,10 12:00:00"
        // countdowm(time)

      },
      [events.ui.joingroup](e) { //参与拼团  能够参与拼团直接支付
      if(this.data.text=="已拼团"){
        wx.showToast({
          title: '已经拼团',
        })
      }else{
        put(effects.addStoreProductGroupHotJoin)
      }
        

      },
      [events.ui.closeLi](e) { //关闭去拼单弹框
        this.setData({
          modalisShow: true
        })
        clearInterval(this.data.timers)
      },
      [events.ui.payMoneny](e) { //去支付按钮
        // put(effects.storePayQueryOrder)
        console.log("微信支付，发起拼单  支付弹框==========")
        let params = this.data.param
        this.$api.circle.addStoreProductGroupHotByNew({
          productId: this.data.productId,
          // userId: this.data.userId,
          childId: this.data.childId,
          productCourseId: this.data.productCourseId

        }).then((res) => {
          console.log("支付回调====",res)
          let {groupId} = res.data.result
          this.setData({
            groupId: groupId
          })

          put(effects.getStoreProductGroupPreview)
        
          
          if (res.data.errorCode == 0 && res.data.result!=null){ //数据不为空
            this.setData({
              orderNumber: res.data.result.orderNumber
            })
            let wxPayResult = res.data.result.wxPayResult
            this.setData({
              appId: wxPayResult.appId,
              nonceStr: wxPayResult.nonceStr,
              packageValue: wxPayResult.packageValue,
              paySign: wxPayResult.paySign,
              signType: wxPayResult.signType,
              timeStamp: wxPayResult.timeStamp
            })
            var pages=this
            wx.requestPayment({
              "appId": this.data.appId,
              "timeStamp": this.data.timeStamp,
              "nonceStr": this.data.nonceStr,
              "package": this.data.packageValue,
              "signType": "MD5",
              "paySign": this.data.paySign,
              success(res) { //支付成功 跳转支付成功页面
                wx.navigateTo({
                  url: `/pages/buyShop/page/payComplete/payComplete?productId=${pages.data.productId}&productCourseId=${pages.data.productCourseId}&groupId= ${pages.data.groupId}&courseId=${pages.data.courseId}&childId=${pages.data.childId}&starttime=${pages.data.newstarttime}&endtime=${pages.data.newendtime}` 
                })
                put(effects.storePayQueryOrder)
              },
              fail(res) {
                wx.showToast({
                  title: '支付失败',
                  mask:true,
                  icon: 'success',
                })
                //跳待付款页面
                wx.navigateTo({
                  url: `/pages/buyShop/page/mywaitPay/mywaitPay?showIndex=${pages.data.showIndex}&userId=${pages.data.userId}`
                })
              }
            })

          }else{
             wx.showToast({
               title:"获取后端数据失败",
               mask: true,
               icon: 'success'
             })

          }
    
        })
      }

    }
  }

  mapEffect({ //公用方法
    put
  }) {
    return {
      [effects.getStoreProductGroupPreview]() { //获取拼单池数据
        this.$api.circle.getStoreProductGroupPreview({
          productId: this.data.productId,
          productCourseId: this.data.productCourseId,
        }).then(res => { 
          let pool = res.data.result.GroupPool
          let groupSurplusNumber = res.data.result.groupSurplusNumber
          if (res.data.result.GroupPool[0]){
            let groupMumber = res.data.result.GroupPool[0].groupMember
            let iownerArr = []
            let commonArr = []
            let newgroupMumber = []
            groupMumber.find((item, index) => {
              if (item.iowner == "true") {
                iownerArr.push(item)
              } else {
                commonArr.push(item)
              }
            })
            this.setData({
              iownerArr: iownerArr,
              commonArr: commonArr,
              groupSurplusNumber: groupSurplusNumber
            })
          }
          let timeArr = []
          pool.forEach((item, index) => {
            let monthStart = item.groupStartTime.split("-")[1]
            let dataStart = item.groupStartTime.split("-")[2].split(" ")[0]
            let monthEnd = item.groupEndTime.split("-")[1]
            let dataEnd = item.groupEndTime.split("-")[2].split(" ")[0]
      
            let groupStartTime = monthStart + "-" + dataStart
            let groupEndTime = monthEnd + "-" + dataEnd
            item.startTime = groupStartTime
            item.endTime = groupEndTime
          })
          if (pool) {
            this.setData({
              poolist: pool
            })
          }
          console.log(359,this.data.poolist)
            this.setData({ 
              showNum: pool.length,
              userLogo: pool.userLogo,
              
            })
          if(pool&&pool instanceof Array){
            pool.forEach((item, index) => {
              item.isShow = false
            })
          }else{
             pool.isShow=false
          }  
          // let group = res.data.result.ProductGroup
          // console.log(357,this.data.result)
          // console.log(group)
        
          // console.log("调试数据=======")
          // console.log(this.data.poolist) //用这个数据进行渲染  调试去拼单弹框
          // this.setData({
          //   grouplist: group //undefined
          // })
          let arr = []
          if (this.data.poolist && this.data.poolist instanceof Array){
            this.data.poolist.forEach((value, index) => {
              arr.push(value.groupEndTime)
            })
          }   
          console.log(365, this.data.poolist)   
          let arritem = []
          arr.forEach((item, index) => {
            let newitem = item.replace(/-/g, ",")
            arritem.push(newitem)
          })
          let cutdowm = arritem
          if (this.data.resultType =="resultType"){ //活动类产品 没有课程次数
              
          }else{ 
             this.setData({
                    // num: course.num,
             })
             
          }
          this.setData({
            totalPerson: this.data.poolist.length,
            cutdowm: cutdowm, //倒计时

          })
          // console.log(this.data.cutdowm) //要传的参数   
          // console.log(362,this.data.title)    

          // 倒计时定时器
          let self = this
          function clocks(timestamp) {
            let format = null;
            let num = timestamp;
            let t = null;
            let nowTime = null;
            let endTime = null;
            self.data.counttime = setInterval(function() {
              let arrs = []
              for (let i = 0; i < num.length; i++) {
                nowTime = new Date()
                endTime = new Date(num[i])
                t = endTime.getTime() - nowTime.getTime()
                if (t >= 0) {
                  let day = Math.floor(t / 86400000)
                  let hour = Math.floor((t / 3600000) % 24)
                  let min = Math.floor((t / 60000) % 60)
                  let sec = Math.floor((t / 1000) % 60)
                  let msec = Math.floor((t % 1000) / 100) //换成毫秒
                  hour = hour < 10 ? '0' + hour : hour
                  min = min < 10 ? '0' + min : min
                  sec = sec < 10 ? '0' + sec : sec
                  msec = msec < 0 ? '0' + msec : msec
                  if (day > 0) {
                    format = `${day}.${hour}.${min}.${sec}.${msec}`
                  }
                  if (day <= 0 && hour > 0) {
                    format = `${hour}.${min}.${sec}.${msec}`
                  }
                  if (day <= 0 && hour <= 0) {
                    format = `${min}.${sec}.${msec}`
                  }
                  arrs.push(format)
                } else {
                  format = `距离倒计时00天`
                  //数组里一项倒计时结束  清除当前项 拼单池数据消失一条
                  // self.remove(this.data.newpoolist[i])

                }
              }
              // console.log("定时器执行执行执行执行++++++++++++++++++++++++++++++++++++++++")
              if (self.data.poolist){
                self.data.poolist.forEach((item, index) => {
                  item.times = arrs[index]
                })
                self.setData({
                  newpoolist: self.data.poolist
                })
              } 
              // console.log(435, self.data.newpoolist)
            }, 150)
          }
          if (this.data.totalPerson==0){
            return
          }else{
            // console.log("打印定时器参数",this.data.cutdowm)
            clocks(this.data.cutdowm)

          }
         

        })

      },
      [effects.loadMyPageForParent]() { //获取用户信息
        this.$api.mypage.loadMyPageForParent({}).then(res => {
          let userId = res.data.result.userInfo.id
          this.setData({
            userId: userId
          })
        })
      },
      [effects.storePayQueryOrder](){
        this.$api.circle.storePayQueryOrder({
          outTradeNo: this.data.orderNumber
        }).then((res)=>{
           console.log(res)

        })
      },
      [effects.getStoreProductHotDetailsByPid](){ //商品详细信息
        this.$api.circle.getStoreProductHotDetailsByPid({
          productId: this.data.productId,
          courseId: this.data.courseId
        }).then((res)=>{
          //获取图片
          console.log(492,res)
          let title = res.data.result.product.title
          let {product}=res.data.result
          let img = product.imgVideo
          let newlist = JSON.parse(img)
          let newlistArr = Object.values(newlist)
          product.imgVideo = newlistArr
          let start2 = product.groupStartTime.split(" ")[1].slice(0, 5)
          let end2 = product.groupEndTime.split(" ")[1].slice(0, 5)
          this.setData({
            shopCover: product.imgVideo[0],
            resultType: res.data.result.resultType,
             title: title,
            groupPrice: product.groupPrice,
            groupStartTimestart: product.groupStartTime.split(" ")[0],
            groupEndTimeend: product.groupEndTime.split(" ")[0],
            start2: start2,
            end2:end2
          })
          console.log(490, this.data.start2, this.data.groupStartTimestart)
          console.log(490, this.data.end2, this.data.groupEndTimeend)

        })

      },
      [effects.addStoreProductGroupHotJoin](){
        this.$api.circle.addStoreProductGroupHotJoin({
          productId: this.data.productId,
          userId: this.data.userId,
          childId: this.data.childId,
          groupId: this.data.groupId
        }).then((res) => {

          if (res.data.errorCode == 0 && res.data.result != null) { //数据不为空
            this.setData({
              orderNumber: res.data.result.orderNumber
            })
            let wxPayResult = res.data.result.wxPayResult
            this.setData({
              appId: wxPayResult.appId,
              nonceStr: wxPayResult.nonceStr,
              packageValue: wxPayResult.packageValue,
              paySign: wxPayResult.paySign,
              signType: wxPayResult.signType,
              timeStamp: wxPayResult.timeStamp
            })
            var pages = this
            wx.requestPayment({
              "appId": this.data.appId,
              "timeStamp": this.data.timeStamp,
              "nonceStr": this.data.nonceStr,
              "package": this.data.packageValue,
              "signType": "MD5",
              "paySign": this.data.paySign,
              success(res) { //支付成功 跳转支付成功页面
                wx.navigateTo({
                  url: `/pages/buyShop/page/payComplete/payComplete?productId=${pages.data.productId}&productCourseId=${pages.data.productCourseId}&groupId= ${pages.data.groupId}&courseId=${this.data.courseId}`
                })
                put(effects.storePayQueryOrder)
              },
              fail(res) {
                wx.showToast({
                  title: '支付失败',
                  mask: true,
                  icon: 'success',
                })
                //跳待付款页面
                wx.navigateTo({
                  url: `/pages/buyShop/page/mywaitPay/mywaitPay?showIndex=${pages.data.showIndex}&userId=${pages.data.userId}`
                })
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
         

      }
    }
  }

}
EApp.instance.register({
  type: payList,
  id: 'payList',
  config: {
    events,
    effects,
    actions
  }
});
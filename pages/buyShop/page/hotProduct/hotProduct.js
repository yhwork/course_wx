function debounce(callback, delay = 500) {
  var t = null
  return function() {
    //console.log("防抖")
    clearTimeout(t)
    t = setTimeout(callback, delay)
  }

} //防抖

function setOrder(timestamp, self) {
  let format = null;
  let num = timestamp;
  let t = null;
  let nowTime = null;
  let endTime = null;
  // clearInterval(self.data.counttime)
  console.log(18, timestamp, self);

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
        self.data.poolist.forEach((item, index) => {
          item.times = arrs[index]
        })
        self.setData({
          poolist: self.data.poolist
        })
      } else { //定时器数据
        format = `团购结束`
        arrs.push(format)
        self.data.poolist[i].endGroup = "false"
        self.setData({
          poolist: self.data.poolist
        })
        self.data.poolist.forEach((item, index) => {
          item.times = arrs[index]
        })
        //  self.put(effects.getProductAllGroupInfo)
      }
    }
    if (self.data.poolist) {
      self.setData({ //这里用 newpoolist 赋值接受poolist 才有效果 
        newpoolist: self.data.poolist,
        // arrpoolist: self.data.poolist
      })
    }
    // console.log("最后数据", self.data.poolist)
  }, 150)

}
import regeneratorRuntime from '../../../../lib/runtime'

import {
  EApp,
  EPage,
  PAGE_LIFE

} from '../../../../eea/index'
import {
  events,
  effects,
  actions
} from './hotProduct.eea'
class hotProduct extends EPage {
  constructor(){
    super()
  }

  get data() {
    return {
      imgUrls: [
        "https://iforbao-prod.oss-cn-hangzhou.aliyuncs.com/public/assets/img/cap3.jpg",
        "https://iforbao-prod.oss-cn-hangzhou.aliyuncs.com/public/assets/img/cap3.jpg",
        "https://iforbao-prod.oss-cn-hangzhou.aliyuncs.com/public/assets/img/cap3.jpg"
      ],
      play:true,
      adress_Detail:{}, //地址详情
      isvideo:true,   // 显示视频  还是轮播
      playindex:0,
      videoUrl:'http://iforbao-qa.oss-cn-shanghai.aliyuncs.com/videoTest/iforbao_video.mp4',
      indicatorDots: true,
      autoplay: true,
      interval: 3000,
      duration: 1000,
      color: "#FF9800",
      activecolor: "white",
      courseId: "",
      productId: "",
      param: {},
      desrc: "",
      name: "",
      groupPrice: "",
      origPrice: "",
      title: "",
      address: [],
      num: "",
      lat: "",
      long: "",
      extratext: "",
      addressname: "",
      isModalshow: true,
      examNumber: "",
      courseNumber: true,
      courseName: true,
      studentName: "",
      orgId: "",
      userId: "",
      childId: "",
      showIndex: 5,
      orderNumber: "",
      number: "准考证不能为空",
      names: "姓名不能为空",
      isGroup: "",
      type: "",
      level: "",
      product: "",
      disPrice: "",
      listcontent: "",
      lable: "",
      storeCountNum: "",
      groupNum: "",
      subjectId: "",
      active: -1,
      modalShow: false,
      sfqModalshow: true,
      verifyType: "", //准考证验证
      shareImg: "",
      activityId: "",
      shortCode: "",
      summerActive: [],   // 夏令营
      groupBuy: "",
      groupModal: "",
      newpoolist: [],
      endTime: "",
      startTime: "",
      groupStartTime: "",
      groupEndTime: "",
      showModal: true,
      attendList: true,
      modalisShow: true,
      many: false,
      productCourseId: "",
      pindanAutoplay: true,
      iscanBuy: false,
      arrpoolist: [],
      changeText: true,
      back:false,
      isAuthorization: true


    };
  }

  mapPageEvent({ //生命周期方法  
    put
  }) {
    return {
      that:this,
      [PAGE_LIFE.ON_LOAD](options) {
        console.log(181, options)
        let {
          courseId,
          productId,
          childId,
          isGroup,
          // iscanBuy,    // 底部是否显示 1
          back
        } = options
        this.setData({
          childId: childId,
          isGroup: isGroup,
          courseId: courseId,
          productId: productId,
          // iscanBuy: iscanBuy,
          back:back              // 底部返回 1
        })
        let param = {
          courseId: courseId,
          productId: productId
        }
        this.setData({
          param: param,
          productId: productId,
          childId: childId
        })
        this.setData({
          examNumber: "",
          studentName: ""
        })
        put(effects.getStoreProductHotDetailsByPid)
        put(effects.shareInfoRecord)
        put(effects.getProductAllGroupInfo)


      },
      [PAGE_LIFE.ON_READY](option) {
        this.mapCtx = wx.createMapContext('myMap')
      },
      [PAGE_LIFE.ON_SHOW](option) {
        console.log('调用uidi')
        put(effects.getProductAllGroupInfo)
      },
      [PAGE_LIFE.ON_SHARE_APP_MESSAGE](option) { //分享功能

        // this.setData({
        //   isvideo:false
        // })

        let img = option.target.dataset.img
        let title = option.target.dataset.title
        let courseId = option.target.dataset.courseid
        let productId = option.target.dataset.productid
        let time =null,state=true;
        

        
        return {
          title: title,
          desc: title,
          // imageUrl:img,
          //## 此为转发给微信好友或微信群后，对方点击后进入的页面链接，可以根据自己的需求添加参数
          path: `/pages/buyShop/page/hotProduct/hotProduct?action=share&code=${this.data.shortCode}&productId=${productId}&courseId=${courseId}`,
          //## 转发操作成功后的回调函数，用于对发起者的提示语句或其他逻辑处理
          success: function (res) {
            console.log("转发成功")
          },
          //## 转发操作失败/取消 后的回调处理，一般是个提示语句即可
          fail: function () {
            console.log("转发失败")

          }
        }
        // function throttle(fn, delay) {
        //   let valid = true
        //   return function () {
        //     if (!valid) {
        //       //休息时间 暂不接客
        //       return false
        //     }
        //     // 工作时间，执行函数并且在间隔期内把状态位设为无效
        //     valid = false
        //     setTimeout(() => {
        //       i++
        //       valid = true;
        //     }, delay)
        //   }
        // }
  



       
      },
            // 上拉刷新
      [PAGE_LIFE.ON_PULL_DOWN_REFRESH]() { //上拉刷新
        put(effects.getStoreProductHotList) //实时请求加载
        wx.stopPullDownRefresh()

      },
      // 上拉刷新
      [PAGE_LIFE.ON_PULL_DOWN_REFRESH]() { //上拉刷新
        let time = null;
        if(time){
          clearTimeout(time)
        }
        time = setTimeout(() => { wx.stopPullDownRefresh()},300)
      },
    }
  }

  mapUIEvent({ //页面事件方法  
    put,
    dispatch
  }) {
    let _this = this
    return {
      //查看位置
      [events.ui.OPEN_LOCATION](e) {
        let longitude = Number(e.currentTarget.dataset.log);
        let latitude = Number(e.currentTarget.dataset.lat);
        wx.openLocation({
          latitude: latitude,
          longitude: longitude
        })
      },
      [events.ui.gotoaddress](e) {
        this.setData({
          lat: e.target.id,
          long: e.currentTarget.dataset.longitude,
          addressname: e.currentTarget.dataset.address

        })
        wx.openLocation({
          latitude: Number(this.data.lat),
          longitude: Number(this.data.long),
          scale: 28,
          name: this.data.addressname,
          address: this.data.addressname
        })

      },
      [events.ui.changeSwiiper](e){
        let changes = e.detail;
        let index = changes.current;   // 当前轮播图的下标
        if (changes.source =='touch'){
          // 手动滑动

          // debugger
          // 如果没有视频播放的时候
          if(!this.data.playindex){
            this.setData({
              playindex:index
            })
            var videoContext = wx.createVideoContext('video0') //这里对应的视频id
            videoContext.pause()
            // 开始播放
            // videoContext.play()
          }else{
            // 有播放先暂停   其他再执行当前的    
           
            if (this.data.playindex != index) {
              var videoContextPrev = wx.createVideoContext('video' + this.data.playindex)  // 获取视频的实例
              videoContextPrev.pause()
            }
            this.setData({
              playindex: index
            })
          }

        }else{
          // if (changes.source == 'autoplay'){
          // autoplay  自动滚动
          this.setData({
            playindex: index
          })

          console.log(' 轮播状态' + this.data.autoplay)
          console.log(' 当前下标' + this.data.playindex, index)
          console.log(' 小图标显示' + this.data.play)
        // }

        }
       
      },
      [events.ui.videoTap](){
        let i = this.data.playindex;
        //获取video
        var videoContext = wx.createVideoContext('video'+i);
        if (this.data.play) {
          //开始播放
          videoContext.play()//开始播放
          this.setData({
            play: false,
            autoplay: false
          })
        } else {
          //当play==false 显示图片 暂停
          videoContext.pause()//暂停播放
          this.setData({
            play: true,
            autoplay: true
          })
        }
        let data = this.data
         console.log(' 轮播状态'+data.autoplay)
        console.log(' 当前下标'+data.playindex)
        console.log(' 小图标显示'+data.play)
   
      },
      [events.ui.catchTouchMove](){
        return false;
      },
      [events.ui.bindplay](){
        // 开始或继续播放
        console.log('开始')
        this.setData({
          autoplay:false,
          play:false,
        })
      },
      [events.ui.bindpause]() {
        // 结束开始执行轮播
        console.log('暂停')
        this.setData({
          autoplay: true,
          play: true,
        })
      },
      [events.ui.bindended](){
        // console.log('结束')
        // this.setData({
        //   isvideo: true
        // })
      },
      [events.ui.changeshare](e){
        
        // this.setData({
        //   isvideo:false
        // })
        // _this.mapPageEvent(put)[PAGE_LIFE.ON_SHARE_APP_MESSAGE](e)

        wx.showShareMenu({
          withShareTicket: true
        })
        
      },
      [events.ui.buy](e) { //点击团购按钮 购买
        //选择日期 
        this.setData({
          modalShow: true, //购买弹框显示
          groupBuy: true,
          active: -1 //清空选择日期
        })
      },
      [events.ui.gotoPaylist](e) { //跳转购买页
        console.log(271,this.data.userId,this.data.productCourseId)
        wx.navigateTo({
          url: `../payList/payList?changeText=${this.data.changeText}&productId=${this.data.productId}&courseId=${this.data.productId}&childId=${this.data.childId}&userId=${this.data.userId}&productCourseId=${this.data.courseId}`,
        })
      },
      [events.ui.goshop](e) { //打开校验框
        // 验证是否授权
        var that = this
        wx.getSetting({
          success: (res) => {
            if (!res.authSetting['scope.userInfo']) {
              this.setData({
                isAuthorization: false
              })
              console.log('没有授权用户信息', this.data.isAuthorization)
              return wx.redirectTo({
                url: `/pages/register/register?backrouter=shop&router=/pages/buyShop/page/hotProduct/hotProduct&productId=${this.data.productId}&courseId=${this.data.courseId}`
                // url:'/pages/mypage/mypage/mypage'
              })
              wx.showToast({
                title: '请先授权',
                icon: 'none',
                // image: '',
                duration: 1500,
                mask: true,
              })
            } else {
              this.setData({
                isAuthorization: true
              })
              console.log('已经授权用户信息', this.data.isAuthorization)
              this.setData({
                active: -1
              })
              if (this.data.type == 7) { //进行准考验证
                if (this.data.verifyType == 1) { //钢琴考级校验 
                  this.setData({
                    isModalshow: false
                  })
                } else if (this.data.verifyType == 2) { //手风琴考级验证
                  this.setData({ //手风琴考试资格验证
                    sfqModalshow: false
                  })

                } else {

                  this.$api.circle.addStoreProductGroupHotByNew({
                    productId: this.data.productId,
                    childId: this.data.childId,
                    productCourseId: this.data.activityId == '' ? 0 : this.data.activityId,
                    activityId: this.data.activityId
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
                        success(res) { //支付成功 跳转支付成功待观看页面
                          if (pages.data.type == 8) { //8 线下课程 支付成功跳转 到待预约
                            wx.navigateTo({
                              url: `/pages/buyShop/page/mywaitPay/mywaitPay?showIndex=3&userId=${pages.data.userId}`
                            })
                          } else { // 视屏课程 支付成功到待观看 7
                            pages.setData({
                              showIndex: 5
                            })
                            wx.navigateTo({
                              url: `/pages/buyShop/page/mywaitPay/mywaitPay?showIndex=${pages.data.showIndex}&userId=${pages.data.userId}`
                            })
                          }
                          //支付成功改变订单状态
                          that.$api.circle.storePayQueryOrder({
                            outTradeNo: that.data.orderNumber
                          }).then((res) => {

                          })
                        },
                        fail(res) {
                          wx.showToast({
                            title: '支付失败',
                            mask: true,
                            icon: 'success',
                          })
                          //跳待支付页面
                          pages.setData({
                            showIndex: 1
                          })
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

              } else if (this.data.type == 29) { //活动类弹框
                this.setData({
                  modalShow: true, //购买弹框显示
                  groupBuy: false
                })
              } else { //不等于7直接购买 
                this.setData({
                  isModalshow: true,
                  showIndex: 5
                })
                console.log('产品类型', this.data.type)
                //唤起支付接口
                this.$api.circle.addStoreProductGroupHotByNew({
                  productId: this.data.productId,
                  childId: this.data.childId,
                  productCourseId: this.data.activityId,
                  activityId: this.data.activityId

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
                      success(res) { //支付成功 跳转支付成功待观看页面
                        if (pages.data.type == 8) { //8 线下课程 支付成功跳转 到待预约
                          wx.navigateTo({
                            url: `/pages/buyShop/page/mywaitPay/mywaitPay?showIndex=3&userId=${pages.data.userId}`
                          })
                        } else { // 视屏课程 支付成功到待观看 7
                          pages.setData({
                            showIndex: 5
                          })
                          wx.navigateTo({
                            url: `/pages/buyShop/page/mywaitPay/mywaitPay?showIndex=${pages.data.showIndex}&userId=${pages.data.userId}`
                          })
                        }
                        //支付成功改变订单状态
                        that.$api.circle.storePayQueryOrder({
                          outTradeNo: that.data.orderNumber
                        }).then((res) => {

                        })
                      },
                      fail(res) {
                        wx.showToast({
                          title: '支付失败',
                          mask: true,
                          icon: 'success',
                        })
                        //跳待支付页面
                        pages.setData({
                          showIndex: 1
                        })
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
              this.setData({
                studentName: "",
                examNumber: "",
                courseNumber: true,
                courseName: true
              })
            }
          },
          fail: function(res) {},
          complete: function(res) {},
        })
        //购买选择类型弹框  夏令营活动选择日期
      },
      [events.ui.stopPageScroll](e) { //catchtouchmove阻止弹窗后滚动穿透 放在当前显示的元素节点上
        return
      },
      [events.ui.cirBtn](e) { //确定按钮
        console.log('确认当前信息', this.data.examNumber, this.data.studentName)
        if (this.data.examNumber == "") {
          this.setData({
            courseNumber: false
          })
        } else {
          this.setData({
            courseNumber: true,
          })
        }
        if (this.data.studentName == "") {
          this.setData({
            courseName: false
          })
        } else {
          this.setData({
            courseName: true,
          })
        }
        if (this.data.examNumber && this.data.studentName) {
          put(effects.checkStoreBuyVerify) //表单校验
        }

      },
      [events.ui.SFQcirBtn](e) { //手风琴确定按钮
        if (this.data.studentName == "") {
          this.setData({
            courseName: false
          })
        } else {
          this.setData({
            courseName: true,
          })
        }
        if (this.data.studentName) {
          put(effects.checkAccordionBuyVerify) //手风琴考级验证
        }
        this.setData({
          sfqModalshow: false
        })

      },
      [events.ui.cancleBtn](e) { //取消按钮
        this.setData({
          isModalshow: true
        })
      },
      [events.ui.SFQcancleBtn](e) { //手风琴取消按钮
        this.setData({
          sfqModalshow: true
        })
      },
      [events.ui.bindReplaceInput1](e) { //获取准考证号
        this.setData({
          examNumber: e.detail.value
        })
        if (this.data.examNumber == "") {
          this.setData({
            courseNumber: false
          })

        } else {
          this.setData({
            courseNumber: true
          })

        }


      },
      [events.ui.showM](e) { //打开查看更多弹框
        this.setData({
          showModal: false,
          // modalShow:true,
        })
      },
      [events.ui.closeLi](e) { //关闭去拼单弹框
        console.log("关闭拼团")
        this.setData({
          modalisShow: true
        })
        clearInterval(this.data.timers)
      },
      [events.ui.attendlist](e) { //打开去拼单弹框
        let {
          index,
          name,
          time,
          groupid,
          productcourseid,

        } = e.currentTarget.dataset
        let id = e.currentTarget.id
        if (id == "false") {
          wx.showToast({
            title: '团购结束',
          })
          return

        } else {
          if (this.data.poolist[index] && this.data.poolist[index].userLogo) {
            let pindanMaster = this.data.poolist[index].userLogo
            this.setData({
              modalisShow: false,
              userName: name,
              pindanMaster: pindanMaster,
              groupId: groupid,
              productCourseId: productcourseid
            })
          } else {

          }

          //console.log("376参与拼团状态 false 显示", this.data.modalisShow)
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
                //console.log('单个定时器********************************')
              } else {
                clearInterval(self.data.timers)
                self.setData({
                  cutTime: "倒计时00天"
                })
              }
            }, 150)
          }

        }

        // let time = "2019,5,10 12:00:00"
        // countdowm(time)

      },
      [events.ui.joingroup](e) { //参与拼团  能够参与拼团直接支付 
        debounce(put(effects.addStoreProductGroupHotJoin), 500)
      },
      [events.ui.closeM](e) { //关闭查看更多弹框

        put(effects.getProductAllGroupInfo)
        this.setData({
          showModal: true
        })
        //关闭定时器
        clearInterval(this.data.counttime)
      },
      [events.ui.bindReplaceInput](e) { //获取考生姓名
        this.setData({
          studentName: e.detail.value
        })
        if (this.data.studentName == "") {
          this.setData({
            courseName: false
          })
        } else {
          this.setData({
            courseName: true
          })
        }
      },
      [events.ui.changeBorder](e) { //点击添加边框样式
      console.log("点击添加边框样式",e)
        var that = this
        this.setData({
          active: e.currentTarget.dataset.index,
          activityId: e.currentTarget.dataset.id,
          endTime: e.currentTarget.dataset.enddate,
          startTime: e.currentTarget.dataset.startdate
        })

      },
      [events.ui.backH]() { //关闭弹框  活动类的
        this.setData({
          modalShow: false,
          active: -1
        })
      },
      [events.ui.stopPageScroll](e) { //catchtouchmove阻止弹窗后滚动穿透
        return
      },
      [events.ui.closeModal]() {
        this.setData({
          modalShow: false
        })
      },
   
      [events.ui.activityBy](e) { //活动类点击确定购买
        if (this.data.active == -1) { //，没有选择日期
          wx.showToast({
            title: '请选择日期',
          })
        } else { //已选日期
          this.setData({
            modalShow: false
          })
          if (this.data.groupBuy == true) { //点击团购，跳转团购产品详情页
            wx.navigateTo({ //团购类的跳转拼团详情页
              url: `/pages/buyShop/page/payList/payList?productId=${this.data.productId}&childId=${this.data.childId}&productCourseId=${this.data.activityId}&courseId=${this.data.courseId}&endTime=${this.data.endTime}&startTime=${this.data.startTime}`
            })
          } else { //不是团购直接购买
            //唤起支付接口
            var that = this
            this.$api.circle.addStoreProductGroupHotByNew({
              productId: this.data.productId,
              childId: this.data.childId,
              activityId: this.data.activityId,
              productCourseId: this.data.activityId

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
                  success(res) { //活动类课程跳转到待打卡 
                    pages.setData({
                      showIndex: 4
                    })
                    wx.navigateTo({
                      url: `/pages/buyShop/page/mywaitPay/mywaitPay?showIndex=${pages.data.showIndex}&userId=${pages.data.userId}`
                    })
                    //支付成功改变订单状态
                    that.$api.circle.storePayQueryOrder({
                      outTradeNo: that.data.orderNumber
                    }).then((res) => {

                    })
                  },
                  fail(res) {
                    wx.showToast({
                      title: '支付失败',
                      mask: true,
                      icon: 'success',
                    })
                    //跳待支付页面
                    pages.setData({
                      showIndex: 1
                    })
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
      },


    }

  }

  mapEffect() { //调接口 方法   存储方法方便调用
    return {
      // 产品详情接口
      /**
       * courseIdDetail
       * courseOrgAddress
       * orgDetail
       * product
       * resultType
       */
      [effects.getStoreProductHotDetailsByPid]() {
        this.$api.circle.getStoreProductHotDetailsByPid(this.data.param).then(res => {
          console.log('详情参数', res.data.result);
          let { 
            courseIdDetail,
            courseOrgAddress,
            orgDetail, 
            product, 
            activity,
            resultType } = res.data.result;

          //8线想下课程待预约， 7线上课程是视频待观看
          this.setData({
            type: resultType
          })
          // 夏令营
          if (activity)
          this.setData({ summerActive: activity})
          let userId='';
          let orgId = courseOrgAddress[0].orgId
          if (resultType != 29) {
            userId  = res.data.result.courseIdDetail.userId
          }
          product.imgVideo = Object.values(JSON.parse(product.imgVideo))
          this.setData({
            desrc: product.descr.replace(/\<img/gi, '<img class="rich-img"'),  //富文本图片溢出处理
            product: product,
            storeCountNum: product.count,
            groupNum: product.memberNum,
            subjectId: product.subjectId,
            verifyType: product.verifyType
          })
          let shareImg = product.imgVideo[0] //分享的图片
          let lableObj = product.lable
          //console.log(612, lableObj)
          let newlabobj = JSON.parse(lableObj)
          let labObjArr = Object.values(newlabobj)
          product.lable = labObjArr
          let iGroup = product.iGroup
          if (iGroup == 1) {
            this.setData({
              groupPrice: product.groupPrice,
            })
          } else {
            this.setData({
              groupPrice: ""
            })
          }
          console.log('价格', product.disPrice)
          this.setData({
            // name: list.name,
            adress_Detail: orgDetail,
            origPrice: product.origPrice,
            title: product.title,
            address: courseOrgAddress,
            num: courseOrgAddress.length,
            orgId: orgId,
            userId: userId,
            level: product.level,
            disPrice: product.disPrice,
            lable: product.lable,
            shareImg: shareImg
          })

        })
      },
      [effects.checkStoreBuyVerify]() { //身份证校验

        this.$api.circle.checkStoreBuyVerify({
          orgId: this.data.orgId,
          checkCode: this.data.examNumber,
          checkName: this.data.studentName,
          productId: this.data.productId
        }).then(res => { 
          let isBuy = res.data.result.BuyVerify.isBuy
          let isNameFlag = res.data.result.BuyVerify.resultValue
          if (isBuy == "OK") {
            wx.showToast({
              title: '可以购买',
              icon: "success",
              duration: 1000,
              mask: true
            })
            this.setData({
              isModalshow: true, //模态框隐藏
              studentName: "",
            })
            //唤起支付接口
            var that = this
            let params ={ 
              productId: this.data.productId,
              // userId: this.data.userId,
              childId: this.data.childId,
              productCourseId: this.data.activityId== ""? 0 : this.data.activityId,
              activityId: this.data.activityId
            }
            console.log('电子琴参数',params)
            this.$api.circle.addStoreProductGroupHotByNew(params).then((res) => {
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
                  success(res) { //视频课程验证成功  后支付成功 跳转支付成功待观看页面
                    pages.setData({
                      showIndex: 5
                    })
                    wx.navigateTo({
                      url: `/pages/buyShop/page/mywaitPay/mywaitPay?showIndex=${pages.data.showIndex}&userId=${pages.data.userId}`
                    })
                    //支付成功改变订单状态
                    that.$api.circle.storePayQueryOrder({
                      outTradeNo: that.data.orderNumber
                    }).then((res) => {

                    })
                  },
                  fail(res) {
                    wx.showToast({
                      title: '支付失败',
                      mask: true,
                      icon: 'success',
                    })
                    //跳待支付页面
                    pages.setData({
                      showIndex: 1
                    })
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

          } else {
            if (isNameFlag == "300") { // 300名字验证错误
              this.setData({
                studentName: "",
                names: "请填写正确的姓名",
                courseName: false
              })
            } else if (isNameFlag == "100") {
              this.setData({
                examNumber: "",
                number: "请填写正确的号码",
                courseNumber: false

              })
            } else if (isNameFlag == "400") {
              wx.showToast({
                title: '等级不匹配',
                icon: "success",
                duration: 2000,
                mask: true
              })

            } else {
              wx.showToast({
                title: '身份认证失败',
                icon: "success",
                duration: 2000,
                mask: true
              })
              this.setData({
                studentName: "",
                examNumber: ""
              })
            }
            this.setData({
              isModalshow: false //模态框显示
            })
          }

        })
      },
      [effects.checkAccordionBuyVerify]() { //手风琴资格验证
        this.$api.circle.checkAccordionBuyVerify({
          level: this.data.level,
          checkName: this.data.studentName,
          orgId: this.data.orgId
        }).then((res) => {
          if (res.data.errorCode == '0' && res.data.result.status == "0") { //验证通过 调支付接口
            this.setData({
              sfqModalshow: true, //模态框隐藏
              studentName: "",
            })
            //唤起支付接口
            var that = this
            let params = {
              productId: this.data.productId,
              // userId: this.data.userId,
              childId: this.data.childId,
              productCourseId: this.data.activityId == '' ? 0 : this.data.activityId,
              activityId: this.data.activityId
            }
            console.log('支付参数', params)
            this.$api.circle.addStoreProductGroupHotByNew(
             params
            ).then((res) => {
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
                  success(res) { //视频课程验证成功  后支付成功 跳转支付成功待观看页面
                    pages.setData({
                      showIndex: 5
                    })
                    wx.navigateTo({
                      url: `/pages/buyShop/page/mywaitPay/mywaitPay?showIndex=${pages.data.showIndex}&userId=${pages.data.userId}`
                    })


                    //支付成功改变订单状态
                    that.$api.circle.storePayQueryOrder({
                      outTradeNo: that.data.orderNumber
                    }).then((res) => {

                    })
                  },
                  fail(res) {
                    wx.showToast({
                      title: '支付失败',
                      mask: true,
                      icon: 'success',
                    })
                    //跳待支付页面
                    pages.setData({
                      showIndex: 1
                    })
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

          } else { //验证未通过  不可以购买
            wx.showModal({
              title: '提示',
              content: '姓名或购买级别不符,请重新填写',
            })
            this.setData({ //清空输入框
              studentName: ""
            })


          }
        })
      },
      [effects.shareInfoRecord]() {
        this.$api.circle.shareInfoRecord({
          dataType: 10,
          data: {}
        }).then((res) => { //分享
          let shortCode = res.data.result.shortCode
          this.setData({
            shortCode: shortCode
          })

        })

      },
      [effects.getProductAllGroupInfo]() { //获取拼团信息
        this.$api.circle.getProductAllGroupInfo({
          productId: this.data.productId
        }).then((res) => { //分享
          // res.data.errorCode == 1 
          if (res.data.errorCode == "0" && !res.data.result) { //返回没有数据
            this.setData({
              many: true
            })
          } else { //有拼团信息
            let pool = res.data.result.GroupPool
            // let pool  = ["2019,8,13 11:40","2019,8,13 11:44","2019,8,13 11:26","2019,8,13 11:47"]
            //console.log(890, pool)
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
            //  debugger 这里没啥用是吧

            if (pool && pool instanceof Array) {
              pool.forEach((item, index) => {
                item.isShow = false
              })
            } else {
              pool.isShow = false
            }
            if (pool) {
              this.setData({
                poolist: pool,
                showNum: pool.length,
                userLogo: pool.userLogo,
              })
            }
            let arr = []
            if (this.data.poolist && this.data.poolist instanceof Array) {
              this.data.poolist.forEach((value, index) => {
                arr.push(value.groupEndTime)
              })
            }
            //console.log(365, this.data.poolist)
            let arritem = []
            arr.forEach((item, index) => {
              let newitem = item.replace(/-/g, ",")
              arritem.push(newitem)
            })
            let cutdowm = arritem
            if (this.data.resultType == "resultType") { //活动类产品 没有课程次数

            } else {
              this.setData({
                // num: course.num,
              })

            }
            this.setData({
              totalPerson: this.data.poolist.length,
              cutdowm: cutdowm, //倒计时
            })
            console.log(1068, this.data.totalPerson);

            if (this.data.totalPerson == 0) {
              return
            } else {
              // let cutdowm = ["2019,8,13 15:00,2019,8,13 9:45,2019,8,13 9:43,2019,8,13 9:48,"]
              setOrder(this.data.cutdowm, this)
              // clocks(cutdowm)
            }
          }

        })
      },
      [effects.addStoreProductGroupHotJoin]() {
        this.$api.circle.addStoreProductGroupHotJoin({
          productId: this.data.productId,
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
                  url: `/pages/buyShop/page/payComplete/payComplete?productId=${pages.data.productId}&productCourseId=${pages.data.productCourseId}&groupId= ${pages.data.groupId}`
                })
                // put(effects.storePayQueryOrder)
              },
              fail(res) {
                wx.showToast({
                  title: '支付失败',
                  mask: true,
                  icon: 'success',
                })
                //跳待付款页面
                wx.navigateTo({
                  url: `/pages/buyShop/page/mywaitPay/mywaitPay?showIndex=1&userId=${pages.data.userId}`
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
  type: hotProduct,
  id: 'hotProduct',
  config: {
    events,
    effects,
    actions
  }
});




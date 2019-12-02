  //index.js
//获取应用实例
const app = getApp();
import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../eea/index'
import {
  events,
  effects,
  actions
} from './circle.eea'
class circle extends EPage {
  get data() {
    return {
      mask_show: true,
      userinfo: false,
      arr: [],
      couseId: "",
      productId: "",
      modalshow: true,
      childlist: "",
      showimage: "",
      childName: "",
      index: 0,
      childId: "",
      activeIndex: 0,
      isGroup: "",
      cover: "",
      type: "",
      lable: "",
      showBottomtext: false

    };
  }

  mapPageEvent({
    put,
    dispatch
  }) {
    return {
      // [PAGE_LIFE.on_tap]() {
      //   let isAuto = this.data.isAuthorization
      //   console.log('点击tab事件', isAuto);
      //   if (isAuto) {
      //     return false
      //   } else {
      //     wx.getSetting({
      //       success: (res) => {
      //         if (!res.authSetting['scope.userInfo']) {
      //           this.setData({
      //             isAuthorization: false
      //           })
      //           console.log('没有授权用户信息', this.data.isAuthorization);
      //           wx.showToast({
      //             title: '暂无该用户信息',
      //             icon: 'none',
      //             duration: 1500,
      //             mask: true,
      //             success: (res) => {
      //               let time = null;
      //               if(time){
      //                  clearTimeout(time)
      //               }else{
      //                 time = setTimeout(()=>{
      //                   return wx.switchTab({
      //                     //  url: '/pages/register/register'
      //                     url: '/pages/mypage/mypage/mypage'
      //                   })
      //                 },1500)
      //               }
      //             },
      //             fail: (res) => {
      //               return wx.switchTab({
      //                 //  url: '/pages/register/register'
      //                 url: '/pages/mypage/mypage/mypage'
      //               })
      //             },
      //             complete: function (res) { },
      //           })
      //         } else {
      //           this.setData({
      //             isAuthorization: true
      //           })
      //           console.log('已经授权用户信息', this.data.isAuthorization)
      //         }
      //       },
      //       fail(err) {
      //         console.log('授权失败')
      //       }
      //     })
      // }
      // },
      // 页面 onload加载
      [PAGE_LIFE.ON_LOAD](option) {
        this.setData({
          'img': this.$api.extparam.getPageImgUrl('timg2')
        })
        put(effects.USERINFO, option)
        put(effects.getStoreInfoDetail)
        put(effects.getStoreProductHotList)
        put(effects.getStoreProductHotDetailsByPid)
      },
      // 页面显示隐藏
      [PAGE_LIFE.ON_SHOW]() {
        put(effects.getChildListByCondition)
      },
      // 上拉刷新
      [PAGE_LIFE.ON_PULL_DOWN_REFRESH]() { //上拉刷新
        put(effects.getStoreProductHotList) //实时请求加载
        wx.stopPullDownRefresh()
      },
      [PAGE_LIFE.ON_REACH_BOTTOM]() {
          // this.setData({
          //   showBottomtext:true
          // })
      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      [events.ui.changeRole](v) {
        this.setData({
          modalshow: false
        })
      },
      [events.ui.adError](){},
      [events.ui.stopPageScroll](e) { //catchtouchmove阻止弹窗后滚动穿透
        return
      },
      // 进入详情页
      [events.ui.gotodetailitem](e) {
        console.log('derails',e)
        this.setData({
          courseId: e.currentTarget.id,
          productId: e.currentTarget.dataset.productid,
          isGroup: e.currentTarget.dataset.isgroup,
          type: e.currentTarget.dataset.kinds

        })
        console.log(this.data.isGroup)
        wx.navigateTo({
          url: `/pages/buyShop/page/hotProduct/hotProduct?courseId=${this.data.courseId}&productId=${this.data.productId}&childId=${this.data.childId}&isGroup=${this.data.isGroup}&type=${this.data.type}`
        })

      },
      [events.ui.choseItem](e) { //切换小孩头像
        let activeIndex = e.currentTarget.dataset.index
        //获取小孩childId 选择的情况下，小孩id
        this.setData({
          childId: this.data.childlist[activeIndex].childId
        })
        app.globalData.childId = this.data.childId //点击切换头像设置当前的小孩 childId
        console.log(this.data.childId)
        this.setData({
          index: e.currentTarget.dataset.index,
          modalshow: true
        })
        wx.setStorageSync("selectChildId", this.data.childId)

      },
      [events.ui.gotoExam](e) {
        wx.navigateTo({
          url: '/pages/buyShop/page/exam/exam'
        })

      }
    }
  }

  mapEffect({
    put,
    dispatch
  }) {
    return {
      [effects.getStoreInfoDetail]() {
        this.$api.circle.getStoreInfoDetail({
          producId: 1
        }).then(res => {
          console.log('是啥',res.data.result)
          let product = res.data.result
        })
      },
      // 订单列表
      [effects.getStoreProductHotList]() {
        this.$api.circle.getStoreProductHotList({}).then(res => {
          let list = res.data.result.productList
          list.forEach((item, index) => {
            let obj = item.img_video
            let newobj = JSON.parse(obj)
            let objArr = Object.values(newobj)
            list[index].img_video = objArr
            let lableObj = item.lable
            let newlabobj = JSON.parse(lableObj)
            let labObjArr = Object.values(newlabobj)
            list[index].lable = labObjArr
          })
          this.setData({
            arr: list,
            lable: list.lable
          })
          console.log('订单', list)
        })
      },
      // 小孩列表
      [effects.getChildListByCondition]() {
        this.$api.circle.getChildListByCondition({}).then(res => {
          console.log(res.data.result.childList)
          let list = res.data.result.childList
          this.setData({
            childId: list[0].childId //默认小孩的childId
          })
          this.setData({
            childlist: list,
            showimage: list[0].logo,
            childName: list[0].childName
          })
          wx.setStorageSync("selectChildId", this.data.childId)
          console.log('getChildListByCondition', this.data.childlist)
        })

      }






    }
  }

  mapAction({
    put
  }) {
    return {
      [actions.HANDLE_ACTION](option) {
        

      }
    }
  }
}




EApp.instance.register({
  type: circle,
  id: 'circle',
  config: {
    events,
    effects,
    actions
  }
});
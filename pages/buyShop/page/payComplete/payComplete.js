
// import regeneratorRuntime from '../../../../lib/runtime'
import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../../eea/index'
import {
  events,
  effects,
  actions
} from './payComplete.eea'

class payComplete extends EPage {
  get data() {
    return {
      productId:"",
      productCourseId:"",
      title:"",
      groupStartTime:"",
      groupEndTime:"",
      shopCover:"",
      groupId:"",
      groupSurplusNumber:"",
      groupMember:"",
      flag:"",
      iownerArr:[],
      commonArr:[],
      shortCode:"",
      courseId:"",
      start:"",
      start2:"",
      end:"",
      end2:"",
      childId:"",
      endtime:"",
      starttime:"",
      username:""
    };

  }


  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_SHARE_APP_MESSAGE](option) {
      
            
        // let img = this.data.shopCover
          // let title = option.target.dataset.title
          // let courseId = option.target.dataset.courseid
          // let productId = option.target.dataset.productid
        let title = `${this.data.username}买过并好评的东西,还差${this.data.groupSurplusNumber}人，赶紧拼单吧!`
          return {
             title: title,
            // desc: title,
            // imageUrl:img,
            //## 此为转发给微信好友或微信群后，对方点击后进入的页面链接，可以根据自己的需求添加参数
            path: `/pages/course/courseList/courseList?action=share&code=${this.data.shortCode}&productId=${this.data.productId}&groupId=${this.data.groupId}&productCourseId=${this.data.productCourseId}&childId=${this.data.childId}`,
            //## 转发操作成功后的回调函数，用于对发起者的提示语句或其他逻辑处理
            success: function (res) {
              console.log("转发成功")
            },
            //## 转发操作失败/取消 后的回调处理，一般是个提示语句即可
            fail: function () {
              console.log("转发失败")
            }
          }
       
      },
      [PAGE_LIFE.ON_LOAD](options) {
        console.log("72数据参数===",options)
        let { productId, productCourseId, groupId, courseId, childId, endtime, starttime}=options
        this.setData({
          productCourseId: productCourseId,
          productId: productId,
          groupId: groupId,
          courseId: courseId,
          childId: childId,
          endtime: endtime,
          starttime: starttime
        })
      
        put(effects.getStoreProductGroupPreview)
        put(effects.getProductGroupDetails)
        put(effects.shareInfoRecord)
        put(effects.getCurrentUserInfo)
       },
       

    }

  }

  mapUIEvent({  //事件方法
    put
  }) {
    return {
      [events.ui.gotoIndex](e) { //跳转到学习圈首页
      console.log("跳转到商品详情页")
        wx.navigateTo({
          url: `../hotProduct/hotProduct?productId=${this.data.productId}&courseId=${this.data.courseId}&childId=${this.data.childId}`
        })
      },
      // [events.ui.goodsDetails](e){
      //    wx.navigateTo({
      //      url: `../hotProduct/hotProduct?productId=${this.data.productId}&courseId=${this.data.productCourseId}&iscanBuy=true&back=true`
      //    })

      // }
     
    }
  }

  mapEffect({ //公用方法
    put
  }) {
    return {
      [effects.getStoreProductGroupPreview]() {
        this.$api.circle.getStoreProductGroupPreview({
          productId: this.data.productId,
          productCourseId: this.data.productCourseId,
          groupId: this.data.groupId
        }).then((res) => {
          console.log(79, res.data.result)
          console.log(80, res.data.result.GroupPool[0].groupMember)
          let { title, groupStartTime, groupEndTime, imgVideo} = res.data.result.ProductDetails
          let groupSurplusNumber = res.data.result.groupSurplusNumber
          let start = groupStartTime.split(" ")[0]
          let end = groupEndTime.split(" ")[0]
          let start2 = groupStartTime.split(" ")[1].slice(0,5)
          let end2 = groupEndTime.split(" ")[1].slice(0, 5)
          let groupMumber = res.data.result.GroupPool[0].groupMember
          let iownerArr=[]
          let commonArr=[]
          let newgroupMumber=[]
          groupMumber.find((item,index)=>{
            if (item.iowner=="true"){
              iownerArr.push(item)
            }else{
              commonArr.push(item)
            }
          })
          console.log(98, iownerArr, 99, commonArr)
          this.setData({
            title:title,
            start:start,
            start2: start2,
            end:end,
            end2:end2,
            groupSurplusNumber: groupSurplusNumber,
            iownerArr: iownerArr,
            commonArr: commonArr

          })
          let newlist = JSON.parse(imgVideo)
          let newlistArr = Object.values(newlist)
          res.data.result.ProductDetails.imgVideo = newlistArr
          this.setData({
            shopCover: res.data.result.ProductDetails.imgVideo[0],
            resultType: res.data.result.resultType
          })
        });
      },
      [effects.getProductGroupDetails](){
        this.$api.circle.getProductGroupDetails({
          productId: this.data.productId,
          groupId: this.data.groupId
        }).then((res)=>{
          let  groupMember  = res.data.result.productDetails.groupMember
          this.setData({
            groupMember: groupMember,
          })
        
        })
      },
      [effects.shareInfoRecord]() { //分享获取shortCode
        this.$api.circle.shareInfoRecord({
          dataType: 11,
          data: {
            productCourseId: this.data.productCourseId,
            productId: this.data.productId,
            groupId: this.data.groupId,
            courseId: this.data.courseId
          }     //页面取值 存值
        }).then((res) => { //分享
          let shortCode = res.data.result.shortCode
          this.setData({
            shortCode: shortCode
          })

        })

      },
      [effects.getCurrentUserInfo](){
        this.$api.circle.getCurrentUserInfo({}).then(res => {
          let username=res.data.result.nickName
          this.setData({
            username:username
          })
        })
      }
      
    }
  }

}

EApp.instance.register({
  type: payComplete,
  id: 'payComplete',
  config: {
    events,
    effects,
    actions
  }
});
import regeneratorRuntime from '../../../../lib/runtime'
//obj 要遍历的对象
//arr  要遍历的数组

import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../../eea/index'
import {
  events,
  effects,
  actions
} from './myColockin.eea'

class myColockin extends EPage {
  get data() {
    return {
      orderNumber: "",
      title: "",
      result: "",
      subtitle: "",
      address: "",
      time: "",
      productInfo: "",
      apptsTimeList: [],
      lable:""






    };
  }

  mapPageEvent({ //生命周期方法  
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](options) { //获取参数
        console.log(options)
        this.setData({
          orderNumber: options.orderNumber
        })
        put(effects.getStorePunchToGo)
      },
      [PAGE_LIFE.ON_READY](option) {

      },
      [PAGE_LIFE.ON_UNLOAD](option) {

      },
      [PAGE_LIFE.ON_SHARE_APP_MESSAGE](option) {



      }
    }
  }

  mapUIEvent({ //页面事件方法  
    put
  }) {
    return {
      [events.ui.radioChange](e) { },


    }

  }

  mapEffect() { //调接口 方法   存储方法方便调用
    return {

      [effects.getStorePunchToGo]() {//去打卡
        this.$api.circle.getStorePunchToGo({
          orderNumber: "20190618134706338356017442336768"
        }).then((res) => {
          let { apptsTimeList, productInfo } = res.data.result
          let img = productInfo.imgVideo
          let newimg = JSON.parse(img)
          let newimgArr = Object.values(newimg)
          productInfo.imgVideo = newimgArr
          apptsTimeList.forEach((item, index) => {
            let attr1 = item.apptsStartTime.split(" ")[0]
            let attr2 = item.apptsStartTime.split(" ")[1]
            item.attr1 = attr1
            item.attr2 = attr2
          })

          this.setData({
            productInfo: productInfo,
            apptsTimeList: apptsTimeList,
            lable: productInfo.lable

          })
          //没有lable
          // let lableObj = item.lable
          // let newlabobj = JSON.parse(lableObj)
          // let labObjArr = Object.values(newlabobj)
          // waitSee[index].lable = labObjArr
        


          console.log(107, productInfo)


        })

      }

    }
  }
}

EApp.instance.register({
  type: myColockin,
  id: 'myColockin',
  config: {
    events,
    effects,
    actions
  }
});
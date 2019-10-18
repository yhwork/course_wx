

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
} from './alreadyColockin.eea'

class alreadyColockin extends EPage {
  get data() {
    return {
     childId: "",
      orderNumber:"",
      resInfo:""
    };
  }

  mapPageEvent({ //生命周期方法  
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](options) { //获取参数
        this.setData({
          childId:options.childId,
          orderNumber: options.orderNumber
        })
        put(effects.getMyClockIn)
      },
      [PAGE_LIFE.ON_READY](option) {

      },
      [PAGE_LIFE.ON_SHOW](option) {
      },
    }
  }

  mapUIEvent({//页面事件方法  
    put
  }) {
    return {
      [events.ui.copy](e) {

      }

    }

  }

  mapEffect() {  //调接口 方法   存储方法方便调用
    return {
      [effects.getMyClockIn]() {
        this.$api.circle.getMyClockIn({
          childId: this.data.childId,
          orderNumber: '20190618134706338356017442336768'
        }).then((res) => {
     
          if (res.data.errorCode == 0 && res.data.result) {
           this.setData({
             resInfo: res.data.result
           })
           console.log(77,this.data.resInfo)
          }
     
        })

      },

    }
  }
}

EApp.instance.register({
  type: alreadyColockin,
  id: 'alreadyColockin',
  config: {
    events,
    effects,
    actions
  }
});




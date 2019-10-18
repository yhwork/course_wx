

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
} from './bookingsSuccess.eea'
class bookingsSuccess extends EPage {
  get data() {
    return {
     



    };
  }

  mapPageEvent({ //生命周期方法  
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](options) { //获取参数
      
      },
    
    }
  }

  mapUIEvent({//页面事件方法  
    put
  }) {
    return {
      [events.ui.gotoBooking](e) {
        wx.navigateTo({
          url: '../myOrder/myOrder'
        })

      }







    }

  }

  mapEffect() {  //调接口 方法   存储方法方便调用
    return {
      [effects.getHotVideoDetails]() {
  







      },

    }
  }
}

EApp.instance.register({
  type: bookingsSuccess,
  id: 'bookingsSuccess',
  config: {
    events,
    effects,
    actions
  }
});




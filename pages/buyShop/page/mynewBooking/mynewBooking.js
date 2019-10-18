

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
} from './mynewBooking.eea'

class mynewBooking extends EPage {
  get data() {
    return {
      orderNumber:"",
      childId:"",
      rsgInfo:""



    };
  }

  mapPageEvent({ //生命周期方法  
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](options) { //获取参数
        console.log(options)
        let {childId,orderNumber}=options
        this.setData({
          orderNumber:orderNumber,
          childId: childId
        })
        put(effects.getMyAppts)
        
      
     
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
      [effects.getMyAppts]() {
        this.$api.circle.getMyAppts({
          orderNumber: '20190618134706338356017442336768',
          childId: this.data.childId
        }).then((res)=>{
          if (res.data.errorCode == 0 && res.data.result){
            let rsgInfo=res.data.result
            console.log(79, rsgInfo)
            this.setData({
              rsgInfo: rsgInfo
            })
          }


        })
       

           

      },

    }
  }
}

EApp.instance.register({
  type: mynewBooking,
  id: 'mynewBooking',
  config: {
    events,
    effects,
    actions
  }
});




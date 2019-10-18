//logs.js
// const util = require('../../utils/util.js')

// pages/circle/DiariesRules/DiariesRules.js

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
} from './Productdetails.eea'

class Productdetails extends EPage {
  get data() {
    return {

      imgUrls: [
        "/assets/img/cap3.jpg",
        "/assets/img/cap3.jpg",
        "/assets/img/cap3.jpg"
      ],
      indicatorDots: false,
      autoplay: false,
      interval: 5000,
      duration: 1000,
      current: 0

    };
  }

  mapPageEvent({ //生命周期方法  
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        this.setData({
          logs: (wx.getStorageSync('logs') || []).map(log => {
            return util.formatTime(new Date(log))
          })
        })
        //另外一种方法
        put(effects.getCurrentUserInfo);
      }
    }
  }

  mapUIEvent({//页面事件方法  
    put
  }) {
    return {
      // 允许一天多次打卡   repeat
      [events.ui.gotoTeacher](e) {
        wx.navigateTo({
          url: '../teacherIntroduction/teacherIntroduction'
        })

      },
      [events.ui.gotoorganization](e){
        wx.navigateTo({
          url: '../organizationIntro/organizationIntro'
        })

      }
    }

  }

  mapEffect() {  //调接口 方法   存储方法方便调用
    return {
      [effects.getCurrentUserInfo]() {
        this.$api.circle.getCurrentUserInfo({}).then(res => {
          console.log(res)
        })
      },
   
    }
  }
}

EApp.instance.register({
  type: Productdetails,
  id: 'Productdetails',
  config: {
    events,
    effects,
    actions
  }
});




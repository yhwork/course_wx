// pages/circle/cardRanking/cardRanking.js
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
} from './teacherIntroduction.eea'

class teacherIntroduction extends EPage {
  get data() {
    return {
      textarray: [
        "数学课程",
        "教师简介",
        "动态"
      ],
      mathcourse_show: false,
      teacher_show: true,
      activity: true,
      activeIndex: 0,
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

      }
    }
  }

  mapUIEvent({//页面事件方法  
    put
  }) {
    return {
      //tab切换
      [events.ui.courseDetail](e) {
        wx.navigateTo({
          url: '../../../buyShop/page/courseDetail/courseDetail'
        })

      },
      [events.ui.tab](e){
        let indexnum = e.currentTarget.dataset.index
        this.setData({
          activeIndex: indexnum
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
  type: teacherIntroduction,
  id: 'teacherIntroduction',
  config: {
    events,
    effects,
    actions
  }
});




















// Page({
//   data: {
//     textarray: [
//       "数学课程",
//       "教师简介",
//       "动态"
//     ],
//     mathcourse_show: false,
//     teacher_show: true,
//     activity: true,
//     activeIndex: 0,
//     imgUrls: [
//       "/assets/img/cap3.jpg",
//       "/assets/img/cap3.jpg",
//       "/assets/img/cap3.jpg"
//     ],
//     indicatorDots: false,
//     autoplay: false,
//     interval: 5000,
//     duration: 1000,
//     current: 0
//   },
//   tab: function(e) {
//     // console.log(e)
//     // console.log(e.currentTarget.dataset.index)
//     let indexnum = e.currentTarget.dataset.index
//     this.setData({
//       activeIndex: indexnum
//     })

//   },
//   courseDetail:function(){
//     console.log(1)
//     wx.navigateTo({
//       url: '../../../buyShop/page/courseDetail/courseDetail'
//     })
//   }

// })
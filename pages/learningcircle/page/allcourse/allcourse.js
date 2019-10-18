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
} from './allcourse.eea'

class allcourse extends EPage {
  get data() {
    return {
      arr:[1,2,3,4,5,6],
      coursearray: [
        "一年级",
        "二年级",
        "三年级",
        "四年级",
        "五年级",
        "六年级"
      ],
     chooseCourse:["音乐","舞蹈","乐器","语文","绘画","数学"],
      dance: ["舞蹈1", "舞蹈1", "舞蹈1", "舞蹈1", "舞蹈1","舞蹈1"],
     variesmusic:["音乐1","音乐2","音乐3","音乐4","音乐5","音乐5"],
     gu:["jiazigu","小姑","大鼓"],
      varies:[1,2,3,4,5,6],
      danceshow:true,
      activeIndex: 0,
      imgUrls: [
        "/assets/img/cap3.jpg",
        "/assets/img/cap3.jpg",
        "/assets/img/cap3.jpg",
        "/assets/img/cap3.jpg",
        "/assets/img/cap3.jpg"

      ],
      indicatorDots: false,
      autoplay: false,
      interval: 5000,
      duration: 1000,
      current: 0,
      chooseIndex:"",
      allcourseshow:true,
      danceshow:true



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
      //tab切换
      [events.ui.opencourse](e) {
        let indexnum = e.currentTarget.dataset.index
        this.setData({
          activeIndex: indexnum
        })
        console.log(this.data.activeIndex)
        if(this.data.activeIndex==2){
          let varies =["三年级","三年级","三年级","三年级","三年级","三年级"]
        }

      },
      [events.ui.passindex](e) {
        let num = e.currentTarget.dataset.idx
        
        this.setData({
          chooseIndex:num,
         
        })
        if (this.data.chooseIndex==0){
          this.setData({
            allcourseshow: false

          })
        }
        if (this.data.chooseIndex == 1) {
          this.setData({
            danceshow: false,
            dance:["wo",'mo',"d","lll","ddde","plkj"],
          


          })
        }
        if(this.data.chooseIndex==2){
         this.setData({
           danceshow: false,
           gu: ["op", "ml", "gh", "er"]
         })
        }
        
        console.log("+++++++++++++++++++++++++++++++++++++++++++")
        console.log(this.data.chooseIndex)
       

      },
      [events.ui.showall](e) {
        console.log("显示，显示")

      },

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
  type: allcourse,
  id: 'allcourse',
  config: {
    events,
    effects,
    actions
  }
});




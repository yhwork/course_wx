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
} from './organizationIntro.eea'

class organizationIntro extends EPage {
  get data() {
    return {
      textarray: [
        "教学课程",
        "机构介绍",
        "动态"
      ],
      mathcourse_show: false,
      teacher_show: true,
      activity: true,
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
      arr: [["一年级", ["english", "math", "gly", "物理", "音乐", "跳舞"], ["你", "哎", 103, 56, 90, 45]

      ], [
        "二年级", ["雷鬼", "hop", "say", "lll", "zhouyi", "跳舞"], ["love", 102, 103, 56, 90, 45]
      ], [
        "三年级", ["english", "math", "gly", "物理", "音乐", "跳舞"], ["u", 102, 103, 56, 90, 45]
      ], [
        "四年级", ["雷鬼", "hop", "say", "lll", "zhouyi", "跳舞"], ["传说中的我们", 102, "我们爱你", 56, 90, 45]
      ], [
        "五年级", ["english", "math", "gly", "物理", "音乐", "跳舞"], ['你爱我像谁', 102, 103, 56, 90, 45]
      ], [
        "六年级", ["雷鬼", "hop", "say", "lll", "zhouyi", "跳舞"], [100, 102, 103, 56, 90, 45]
      ],
      [
        "七年级", ["seveb", "hop", "say", "lll", "zhouyi", "跳舞"], [100, 102, 103, 56, 90, 45]
      ], [
        "八年级", ["雷鬼", "hop", "say", "lll", "zhouyi", "跳舞", "wo", "wni", "来来来", "jkjk", "dajkl", "dhjhd", "你好"], [100, 102, 103, 56, 90, 45]
      ]],
      activeIndex2: "",
      showIndex: "",
      bgIndex: "",
      isActive: "",
      isActiveIndex: "",
      showconfirm: "",
      showT: false,
      showTh: false,
      wrapboxshow: false,
      mask:true
     
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
      [events.ui.tab](e) {
        let indexnum = e.currentTarget.dataset.index
        this.setData({
          activeIndex: indexnum
        })
        console.log(this.data.activeIndex)
       
      },
      [events.ui.chooseclass](e){
        this.setData({
          mask:false,//遮罩层显示
          wrapboxshow: false,
          showconfirm: false,
          showT: true,
          showTh: true,
          bgIndex: 0
        })
         
      },
      [events.ui.gotoMap](e){ //跳转地图
        wx.navigateTo({
          url: '../../../buyShop/page/mapview/mapview'
        })

      },
      [events.ui.passIndex](e) { //三级联动
        let num = e.currentTarget.dataset.index
        this.setData({
          activeIndex2: num,
          isActive: num

        })

      },
      [events.ui.passoneIndex](e) { 
        let oneidx = e.currentTarget.dataset.oneindex
        this.setData({
          showIndex: oneidx,
          bgIndex: oneidx,
          showT: false,
          showTh: false
          
        })

      },
      [events.ui.lastcouse](e) { 
        let lastIndex = e.currentTarget.dataset.indexlast
        this.setData({
          isActiveIndex: lastIndex
        })

      },
      [events.ui.reset](e){
        this.setData({
          showT: true,
          showTh: true,
          bgIndex: 0,
          showIndex: "",
          activeIndex2: ""
        })
      },
      [events.ui.confirm_box](){
      this.setData({
        wrapboxshow: true,
        showconfirm: true,
        mask:true,
        showIndex:"",
        activeIndex2:""

       
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
  type: organizationIntro,
  id: 'organizationIntro',
  config: {
    events,
    effects,
    actions
  }
});




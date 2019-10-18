
var getrecentday = function () {
  var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth()+1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}
//今天是星期几
var getDay = function () {
  var d = new Date()
  return d.getDay()
}

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
} from './booking.eea'

class booking extends EPage {
  get data() {
    return {
      imgUrls: [
        "/assets/img/cap3.jpg",
        "/assets/img/cap3.jpg",
        "/assets/img/cap3.jpg",
        "/assets/img/cap3.jpg"
      ],
      indicatorDots: true,
      autoplay: true,
      interval: 2000,
      duration: 1000,
      color: "#FF9800",
      activecolor: "white",
      date: '2016-09-01',
      weekarray: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      dararray: ["15日", "16日", "17日", "18日", "19日", "20日", "21日"],
      currentTime: getrecentday(),
      weekIndex:""

    };

  }


  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_SHARE_APP_MESSAGE]() {

        return {
        
        }
        
      },
      [PAGE_LIFE.ON_LOAD](){
        put(effects.getday)
      },
      [PAGE_LIFE.ON_SHOW]() {
        put(effects.getday)
      }


    }

  }

  mapUIEvent({  //事件方法
    put
  }) {
    return {
      [events.ui.dayClick](event) {  //点击具体日期
          console.log(event.detail);
         
      }



    }
  }

  mapEffect({ //公用方法
    put
  }) {
    return {
      [effects.getuserinfo]() {
        this.$api.circle.getCurrentUserInfo({}).then((res) => {
          console.log(res)
        });
      },
      [effects.getday]() {
        let x = null
        let index = getDay()
        switch(index){
          case 0:
               x="日";
               break;
          case 1:
            x = "一";
            break;
          case 2:
            x = "二";
            break;
          case 3:
            x = "三";
            break;
          case 4:
            x = "四";
            break;
          case 5:
            x = "五";
            break;
          case 5:
            x = "六";
            break;

        }
        this.setData({
          weekIndex:index
        })
        let item = `周${x}`
        console.log("周几++++++++++++++++++++")
        console.log(item)
        
        
      }
    }
  }

}

EApp.instance.register({
  type: booking,
  id: 'booking',
  config: {
    events,
    effects,
    actions
  }
});
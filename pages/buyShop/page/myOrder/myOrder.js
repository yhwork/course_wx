const MONTHS = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'June.', 'July.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
var getrecentday = function() {
  var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  var hour = date.getHours();
  var min = date.getMinutes();
  var sec = date.getSeconds();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }

  var currentdate = year + seperator1 + month + seperator1 + strDate + " " + hour + ":" + min + ":" + sec;
  return currentdate;
}


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
} from './myOrder.eea'

class myOrder extends EPage {
  get data() {
    return {
      dayStyle: [{
          month: 'current',
          day: new Date().getDate(),
          color: 'white',
        background: '#AAD4F5'
        },
        {
          month: 'current',
          day: new Date().getDate(),
          color: 'white',
          background: '#AAD4F5'
        }
      ],
      showMore: "",
      orderNumber: "",
      arr: [],
      dataArr: [],
      dayscolor: [],
      year: new Date().getFullYear(), // 年份
      month: new Date().getMonth() + 1, // 月份
      day: new Date().getDate(),
      hour: new Date().getHours(),
      min: new Date().getMonth(),
      sec: new Date().getSeconds(),
      str: MONTHS[new Date().getMonth()], // 月份字符串
      resorg: "",
      childId: "",
      shcoId: "",
      apptsStartTime: "",
      apptsEndTime: "",
      orgId: "",
      currentList: ""




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
      [PAGE_LIFE.ON_LOAD](e) {
        this.setData({
          orderNumber: e.orderNumber,
          childId: e.childId
        })
        let date = getrecentday()
        put(effects.getStorePunchToResOrg)

      },
      [PAGE_LIFE.ON_SHOW]() {

      }


    }

  }

  mapUIEvent({ //事件方法
    put
  }) {
    return {
      [events.ui.dayClick](event) { //点击具体日期、
        console.log(105, event.detail)
        let {
          year,
          month,
          day
        } = event.detail
        let newdate = `${year}-${month}-${day}`
        this.$api.circle.getStorePunchToResOrg({
          orderNumber: this.data.orderNumber,
          dateYYMM: newdate
        }).then((res) => {
          let currentList = res.data.result.reservation.currentResOrgDateList
          if (res.data.errorCode == 0 && currentList) {
              currentList.forEach((item, index) => {
              item.isFlag = false //绑定每个订单状态
              item.startdata = item.apptsStartTime.split(" ")[0]
              item.startHour = item.apptsStartTime.split(" ")[1]
            })
            this.setData({
              currentList: currentList
            })
          }
        })
        let clickDay = event.detail.day;
        let changeDay = `dayStyle[1].day`;
        let changeBg = `dayStyle[1].background`;
        this.setData({
          [changeDay]: clickDay,
          [changeBg]: "#AAD4F5"
        })

      },
      [events.ui.prev](event) { //点击上个月按钮
        this.data.dayStyle = null
        let {
          currentYear,
          currentMonth,
        } = event.detail
        let newdate = `${currentYear}-${currentMonth}-${this.data.day}`
        console.log(199, newdate)
        this.$api.circle.getStorePunchToResOrg({
          orderNumber: this.data.orderNumber,
          dateYYMM: newdate
        }).then((res) => {
          console.log(203, res)
          let resorg = res.data.result.reservation.resOrgDateList//所有可以预约的日期
          console.log("上个月可预约日期", resorg)
          let days_count = res.data.result.reservation.dayDate //一月中的天数、
          // let bookimgDate = res.data.result.reservation.resOrgDateList //所有可以预约的日期
          if (resorg) {
            resorg.forEach((item, index) => {
              let singleDate = item.split(" ")[0]
              this.data.arr.push(item.split(" ")[0])

            })
          }

          this.setData({
            resorg: resorg
          })
          this.data.arr.forEach((item, index) => { //处理成需要的日期["1","2"]格式
            this.data.dataArr.push(item.split("-")[2])
          })
          let dayscolor = new Array
          for (let i = 0; i <= days_count.length; i++) { //30天之内
            for (let j = 0; j < this.data.dataArr.length; j++) { //后端返回来的日期
              if (days_count[i] == this.data.dataArr[j]) { //如果后端返回的日期和这个月日期相等  就变色 可以点击
                this.data.dayStyle.push({
                  month: 'current',
                  day: this.data.dataArr[j],
                  color: 'white',
                  background: '#58cc69'
                })
              }

            }
          }
          this.setData({
            dayStyle: this.data.dayStyle
          })

        })

     
      },
      [events.ui.next](event) { //点击下个月按钮
        this.data.dayStyle=null
        let {
          currentYear,
          currentMonth,
        } = event.detail
        let newdate = `${currentYear}-${currentMonth}-${this.data.day}`
        console.log(199,newdate)
        this.$api.circle.getStorePunchToResOrg({
          orderNumber: this.data.orderNumber,
          dateYYMM: newdate
        }).then((res) => {
      console.log(203,res)
          let resorg = res.data.result.reservation.resOrgDateList//所有可以预约的日期
          console.log("下个月可预约日期", resorg)
          let days_count = res.data.result.reservation.dayDate //一月中的天数、
          // let bookimgDate = res.data.result.reservation.resOrgDateList //所有可以预约的日期
          if (resorg){
            resorg.forEach((item, index) => {
              let singleDate = item.split(" ")[0]
              this.data.arr.push(item.split(" ")[0])

            })
          }
       
          this.setData({
            resorg: resorg
          })
          this.data.arr.forEach((item, index) => { //处理成需要的日期["1","2"]格式
            this.data.dataArr.push(item.split("-")[2])
          })
          let dayscolor = new Array
          for (let i = 0; i <= days_count.length; i++) { //30天之内
            for (let j = 0; j < this.data.dataArr.length; j++) { //后端返回来的日期
              if (days_count[i] == this.data.dataArr[j]) { //如果后端返回的日期和这个月日期相等  就变色 可以点击
                this.data.dayStyle.push({
                  month: 'current',
                  day: this.data.dataArr[j],
                  color: 'white',
                  background: '#58cc69'
                })
              }

            }
          }
          this.setData({
            dayStyle: this.data.dayStyle
          })
         
        })
         
      },
      [events.ui.ndateChange](event) { 
        console.log(event.detail)
      },
      [events.ui.openM](e) { //点击更多信息 
        var that = this;
        let index = e.currentTarget.dataset.index
        that.data.currentList[index].isFlag = !that.data.currentList[index].isFlag;
        that.setData({
          currentList: that.data.currentList
        })
      },
      [events.ui.booking](e) {
        this.setData({
          shcoId: e.currentTarget.dataset.shcoid,
          apptsStartTime: e.currentTarget.dataset.bgtime,
          apptsEndTime: e.currentTarget.dataset.endtime,
          orgId: e.currentTarget.dataset.orgid

        })
        put(effects.addStorePunchToResOrgBtn)
      }
    }
  }

  mapEffect({ //公用方法
    put
  }) {
    return {
      [effects.getStorePunchToResOrg]() {
        this.$api.circle.getStorePunchToResOrg({
          orderNumber: this.data.orderNumber,
          dateYYMM: getrecentday()
        }).then((res) => {
          console.log(157, res)
          let resorg = res.data.result.reservation.resOrgDateList
          console.log("当前月份页面可预约所有日期", resorg)
          let days_count = res.data.result.reservation.dayDate //一月中的天数、
          // let bookimgDate = res.data.result.reservation.resOrgDateList //所有可以预约的日期
          resorg.forEach((item, index) => {
            let singleDate = item.split(" ")[0]
            this.data.arr.push(item.split(" ")[0])

          })
          this.setData({
            resorg: resorg
          })
          this.data.arr.forEach((item, index) => { //处理成需要的日期["1","2"]格式
            this.data.dataArr.push(item.split("-")[2])
          })
          let dayscolor = new Array
          for (let i = 0; i <= days_count.length; i++) { //30天之内
            for (let j = 0; j < this.data.dataArr.length; j++) { //后端返回来的日期
              if (days_count[i] == this.data.dataArr[j]) { //如果后端返回的日期和这个月日期相等  就变色 可以点击
                this.data.dayStyle.push({
                  month: 'current',
                  day: this.data.dataArr[j],
                  color: 'white',
                  background: '#58cc69'
                })
              }

            }
          }
          this.setData({
            dayStyle: this.data.dayStyle
          })
          console.log(this.data.dayStyle)

        })

      },
      [effects.addStorePunchToResOrgBtn]() {
        this.$api.circle.addStorePunchToResOrgBtn({
          orderNumber: this.data.orderNumber,
          childId: this.data.childId,
          shcoId: this.data.shcoId,
          apptsStartTime: this.data.apptsStartTime,
          apptsEndTime: this.data.apptsEndTime,
          orgId: this.data.orgId
        }).then((res) => {
          console.log(209, res)
          if (res.data.errorCode == 0) {
            wx.showToast({
              title: '预约成功',
              icon: "success"
            })
          } else {
            wx.showToast({
              title: '预约失败',
              icon: "success"
            })
          }
        })
      }
    }
  }

}

EApp.instance.register({
  type: myOrder,
  id: 'myOrder',
  config: {
    events,
    effects,
    actions
  }
});




// pages/demo/index.js
// const MONTHS = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'June.', 'July.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];

// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {
//     year: new Date().getFullYear(),      // 年份
//     month: new Date().getMonth() + 1,    // 月份
//     day: new Date().getDate(),
//     str: MONTHS[new Date().getMonth()],  // 月份字符串

//     demo1_days_style: [],
//     demo2_days_style: [],
//     demo4_days_style: [],
//     demo5_days_style: [],
//     demo6_days_style: [],
//   },

//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function (options) {
//     const days_count = new Date(this.data.year, this.data.month, 0).getDate();
//     let demo1_days_style = new Array;
//     for (let i = 1; i <= days_count; i++) {
//       if (i <= 9 && i != 7) {
//         demo1_days_style.push({
//           month: 'current', day: i, color: 'white', background: '#8497ee'
//         });
//       } else {
//         demo1_days_style.push({
//           month: 'current', day: i, color: 'white'
//         });
//       }
//     }
//     this.setData({
//       demo1_days_style
//     });

//     let demo2_days_style = new Array;
//     for (let i = 1; i <= days_count; i++) {
//       if (i == 12) {
//         demo2_days_style.push({
//           month: 'current', day: i, color: '#314580', background: '#ffed09'
//         });
//       } else if (i == 16) {
//         demo2_days_style.push({
//           month: 'current', day: i, color: 'white', background: '#30558c'
//         });
//       } else if (i == 21) {
//         demo2_days_style.push({
//           month: 'current', day: i, color: 'white', background: '#3c5281'
//         });
//       } else {
//         demo2_days_style.push({
//           month: 'current', day: i, color: 'white'
//         });
//       }
//     }
//     this.setData({
//       demo2_days_style
//     });

//     let demo4_days_style = new Array;
//     for (let i = 1; i <= days_count; i++) {
//       if (i == 3) {
//         demo4_days_style.push({
//           month: 'current', day: i, color: 'white', background: '#46c4f3'
//         });
//       } else if (i == 7) {
//         demo4_days_style.push({
//           month: 'current', day: i, color: 'white', background: '#ffb72b'
//         });
//       } else if (i == 12 || i == 23 || i == 24) {
//         demo4_days_style.push({
//           month: 'current', day: i, color: 'white', background: '#865fc1'
//         });
//       } else if (i == 21 || i == 22) {
//         demo4_days_style.push({
//           month: 'current', day: i, color: 'white', background: '#eb4986'
//         });
//       } else {
//         demo4_days_style.push({
//           month: 'current', day: i, color: 'white'
//         });
//       }
//     }
//     this.setData({
//       demo4_days_style
//     });

//     let demo5_days_style = new Array;
//     for (let i = 1; i <= days_count; i++) {
//       const date = new Date(this.data.year, this.data.month - 1, i);
//       if (date.getDay() == 0) {
//         demo5_days_style.push({
//           month: 'current', day: i, color: '#f488cd'
//         });
//       } else if (i == 12) {
//         demo5_days_style.push({
//           month: 'current', day: i, color: 'white', background: '#b49eeb'
//         });
//       } else if (i == 17) {
//         demo5_days_style.push({
//           month: 'current', day: i, color: 'white', background: '#f5a8f0'
//         });
//       } else if (i == 21) {
//         demo5_days_style.push({
//           month: 'current', day: i, color: 'white', background: '#aad4f5'
//         });
//       } else if (i == 25) {
//         demo5_days_style.push({
//           month: 'current', day: i, color: 'white', background: '#84e7d0'
//         });
//       } else {
//         demo5_days_style.push({
//           month: 'current', day: i, color: '#a18ada'
//         });
//       }
//     }

//     this.setData({
//       demo5_days_style
//     });

//     let demo6_days_style = new Array;
//     for (let i = 1; i <= days_count; i++) {
//       const date = new Date(this.data.year, this.data.month - 1, i);
//       if (i == 12) {
//         demo6_days_style.push({
//           month: 'current', day: i, color: 'white', background: '#b49eeb'
//         });
//       } else if (i == 17) {
//         demo6_days_style.push({
//           month: 'current', day: i, color: 'white', background: '#f5a8f0'
//         });
//       } else if (i == 21) {
//         demo6_days_style.push({
//           month: 'current', day: i, color: 'white', background: '#aad4f5'
//         });
//       } else if (i == 25) {
//         demo6_days_style.push({
//           month: 'current', day: i, color: 'white', background: '#84e7d0'
//         });
//       } else {
//         demo6_days_style.push({
//           month: 'current', day: i, color: 'black'
//         });
//       }
//     }

//     this.setData({
//       demo6_days_style
//     });
//   },
// })
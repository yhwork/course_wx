import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../eea/index'
import {
  events,
  effects,
  actions
} from './schoolin_add2.eea'
const moment = require('../../../lib/moment.min.js');
function set_times(stute) {
  let val_time = [];
  if (stute == true) {
    for (let i = 6; i < 20; i++) {
      if(i<10){
        i= '0' +i
      }
      val_time.push(i)
    }
  } else {
    let j = 0;
    for (let i = 0; i < 4; i++) {
      if(j==0){
        val_time.push('0'+j)
      }else{
        val_time.push(j)
      }
      j += 15
    }
  }
  return val_time
}
class SchoolinAdd2Page extends EPage {
  get data() {
    return {
      getdate: set_times(true),
      gettime: set_times(),
      userInfo: {
        'role':0      // 角色设计
      },
      courseInfo: {},
      childInfo: {},
      tishi:'选择实际开学时间',
      one: '08:00',
      five: '13:00',
      model: {
        //  moment().format('YYYY-MM-DD')
        startDate:'',
        // moment().add(126, 'day').format('YYYY-MM-DD')
        endDate: '',
        oneStartTime: '',
        twoStartTime: '',
        threeStartTime: '',
        fourStartTime: '',
        fiveStartTime: '',
        sixStartTime: '',
        sevenStartTime: '',
        eightStartTime: '',
        duration: 45,
        remindIndex: 0,
        remindTxt: '不提醒',
        remindValue: '0',
        beginWeekDay: '',
        endWeekDay: '',
        rules: [],
        
      },
      remindItems: [{
          name: '不提醒',
          value: 0
        },
        {
          name: '提前15分钟',
          value: 15
        },
        {
          name: '提前30分钟',
          value: 30
        },
        {
          name: '提前1小时',
          value: 60
        },
        {
          name: '提前2小时',
          value: 120
        },
        {
          name: '提前3小时',
          value: 180
        }
      ],
      weekDays: [
        {
          name: '周一',
          value: '15:30'
        },
        {
          name: '周二',
          value: '15:30'
        },
        {
          name: '周三',
          value: '15:30'
        },
        {
          name: '周四',
          value: '15:30'
        },
        {
          name: '周五',
          value: '15:30'
        }
      ],
      courseList: [],
      showCalendar: false,
      changeBegin: false,
      changeEnd: false,
      hide: true,
      tachertime: true,
      childTime:true,
      mask:true,           // 蒙版
      course:{
        "starttime":false,
        "endtime":false,
        "outschool":false,
      },
      value3:[8,1]
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        console.log('值',option)
        this.setData({
          'schoolInfo': option
        })
      },
      [PAGE_LIFE.ON_SHOW]() {
        put(effects.UPDATE_WEEKDAY);
        this.$storage.get('childInfo').then(
          (res) => {
            this.setData({
              childInfo: res.data,
              'model.childId': res.data.childId

            })
            // console.log(this.data.childInfo)
            put(effects.GET_CHILD);
          },
          (rej) => {}
        )

        //返回comefrom信息
        this.$storage.get('model.comeFrom').then(
          (res) => {
            this.setData({
              'model.comeFrom': res.data
            })
          },
          (reject) => {}
        );
        //返回学校信息
        this.$storage.get('schoolinfo.name').then(
          (name) => {
            this.setData({
              'model.school': name.data,
              school_selected: true
            })
          },
          (reject) => {}
        );
        this.$storage.get('schoolinfo.schoolid').then(
          (schoolid) => {
            this.setData({
              'model.schoolId': schoolid.data
            })
          },
          (reject) => {}
        );
        this.$storage.get('schoolinfo.city').then(
          (city) => {
            this.setData({
              'model.city': city.data
            })
          },
          (reject) => {}
        );
        this.$storage.get('schoolinfo.typecode').then(
          (typecode) => {
            this.setData({
              'model.schoolType': typecode.data
            });
            if (this.data.model.schoolType) {
              put(effects.GET_GRADE);
            }
          },
          (reject) => {}
        )
        
        this.$storage.get('userInfo').then(
          (res) => {
            this.setData({
              userInfo: res.data
            })
          },
          (rej) => {}
        )
        this.$storage.get('courseTable').then(
          (res) => {
            this.setData({
              courseTable: res.data
            })
          },
          (rej) => {}
        )
        this.$storage.get('InterNameList').then(
          (res) => {
            this.setData({
              InterNameList: res.data
            })
          },
          (rej) => {}
        )
      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      [events.ui.bindChange1](e){
        let stute  =e.currentTarget.dataset.id
        const val = e.detail.value
        console.log(val,stute)

        let date = this.data.getdate;
        let time = this.data.gettime;
        console.log(`${ date[val[0]]}:${time[val[1]]}`)
        if(stute == 1){
          if (this.$common.isIntNum(val[0])) {
            this.setData({
             one:`${ date[val[0]]}:${time[val[1]]}`
            })
          }
        }else if(stute==2){
          this.setData({
            five:`${ date[val[0]]}:${time[val[1]]}`
          })
        }else if(stute==3){
          this.setData({
          'model.remindIndex': val[0],
          'model.remindTxt': this.data.remindItems[ val[0]].name,
          'model.remindTime': this.data.remindItems[ val[0]].value
          })
        }
      },
      // 退出
      [events.ui.quit](e){
        console.log('退出')
        let state  =e.currentTarget.dataset.id
        if(state==1){
          this.setData({
            mask:true,
            'course.starttime':false,
            'course.endtime':false,
            'course.outschool':false,
            showCalendar:false
          })
          // 把数据导入
        }else{
          this.setData({
             mask:true,
            'course.starttime':false,
            'course.endtime':false,
            'course.outschool':false,
            showCalendar:false
          })
        }
       
      },
      // 开学日期
      [events.ui.selectok1](e) {
        let stute  =e.currentTarget.dataset.id
        console.log('选择好课程节数',stute)
        if(stute ==1){
          this.setData({
            mask:false,
            showCalendar: true,
            changeBegin: true
          })
        }else if(stute ==2){
          this.setData({
            mask:false,
            'course.starttime':true
          })
        }else if(stute == 3){
          this.setData({
            mask:false,
            'course.endtime':true
          })
        }else if(stute == 4){
          this.setData({
            mask:false,
            'course.outschool':true
          })
        }
      },
      [events.ui.CHANGE_ENDDATE](e) {
        this.setData({
          showCalendar: true,
          changeEnd: true
        });
      },
      [events.ui.CALENDAR_DAY_CHANGED](e) {
        const currentDate = moment(e.detail.year + ' ' + e.detail.month + ' ' + e.detail.day, 'YYYY-MM-DD').format('YYYY-MM-DD');
        this.setData({
          showCalendar: false,
          tishi:'',
          mask:true,  // 蒙版
        })
        if (this.data.changeBegin) {
          this.setData({
            'model.startDate': currentDate,
            changeBegin: false,
            'model.endDate': moment(e.detail.year + ' ' + e.detail.month + ' ' + e.detail.day, 'YYYY-MM-DD').add(126, 'day').format('YYYY-MM-DD'),
          })
        }
        if (this.data.changeEnd) { 
          this.setData({
            'model.endDate': currentDate,
            changeEnd: false
          })
        }
        put(effects.UPDATE_WEEKDAY);
      },
      // 上课时间
      [events.ui.CHANGE_TIMEFIRST](e) {
        console.log(e.detail.value)
        this.setData({
          one: e.detail.value,
          'model.oneStartTime': e.detail.value
        }); 
      },
      [events.ui.CHANGE_TIMEFIVE](e) {
        this.setData({
          five: e.detail.value,
          'model.fiveStartTime': e.detail.value,
        });
      },
      [events.ui.CHANGE_REMIND](e) {
        if (e.detail.value != 0){
          this.setData({
            tachertime: false,
            childTime: false,
          })
        }else{
          this.setData({
            tachertime: true,
            childTime: true,
          })
        }
        this.setData({
          
          'model.remindIndex': e.detail.value,
          'model.remindTxt': this.data.remindItems[e.detail.value].name,
          'model.remindTime': this.data.remindItems[e.detail.value].value
        });
        console.log(e.detail.value)
        if (e.detail.value != 0) {
          this.setData({
            hide: false
          });
          console.log(this.data.hide)
        } else {
          this.setData({
            hide: true
          });
        }
        let courseTable = this.data.courseTable
        let courseData = [];
        let data = {};
        data.rules = [];
        console.log(courseTable)
        courseTable.forEach((item1, index1) => {
          for (var i = 0; i < item1.length; i++) {
            if (i != 0) {
              console.log(item1[i])
              if (item1[i].courseName != '' || typeof item1[i].courseName1 != 'undefined') {
                data.rules.push({
                  dailyRule: index1 + 1,
                  classTime: '设置时间'
                });
                break
              } 
            }
          }
        })
        console.log(data.rules);
        this.setData({
          courseList: data.rules
        })
      },
      [events.ui.CHANGE_DURATION](e) {
        if (this.$common.isIntNum(e.detail.value) == false) {
          return wx.showToast({
            title: '请输入数字',
            duration: 1500,
            icon: 'none',
          });
        }
        this.setData({
          'model.duration': e.detail.value
        });
      },
      // 设置放学时间
      [events.ui.SET_SCHOOLOUT](e){
        let time = e.detail.value;
        let index = e.currentTarget.dataset.index;
        console.log(index)
        let outtime = 'weekDays[' + index + '].value'
        this.setData({
          [outtime]: time
        })
      },
      [events.ui.CHANGE_CLASSTIME](e) {
        let classTime = e.detail.value;
        let index = e.currentTarget.dataset.index;
        console.log(index)
        console.log(this.data.courseList[index].dailyRule)
        let idx = this.data.courseList[index].dailyRule
        let classtimer = 'courseList[' + index + '].classTime'
        this.setData({
          [classtimer]: classTime
        })
        if (idx == 1) {
          this.setData({
            'model.oneStartTime': classTime
          })
          console.log(this.data.model.oneStartTime)
        } else if (idx == 2) {
          this.setData({
            'model.twoStartTime': classTime
          })
          console.log(this.data.model.twoStartTime)
        } else if (idx == 3) {
          this.setData({
            'model.threeStartTime': classTime
          })
        } else if (idx == 4) {
          this.setData({
            'model.fourStartTime': classTime
          })
        } else if (idx == 5) {
          this.setData({
            'model.fiveStartTime': classTime
          })
        } else if (idx == 6) {
          this.setData({
            'model.sixStartTime': classTime
          })
        } else if (idx == 7) {
          this.setData({
            'model.sevenStartTime': classTime
          })
        } else if (idx == 8) {
          this.setData({
            'model.eightStartTime': classTime
          })
        }
      },

      [events.ui.SAVE_NEXT]() {
        put(effects.SAVE_NEXT);
      }
    }
  }

  mapEffect({
    put
  }) {
    const api = this.$api;
    const common = this.$common;
    const converter = this.$converter;
    return {
      [effects.UPDATE_WEEKDAY]() {
        if (this.data.model.startDate && this.data.model.endDate){
          this.setData({
            'model.beginWeekDay': converter.getWeekDay(this.data.model.startDate),
            'model.endWeekDay': converter.getWeekDay(this.data.model.endDate)
          });
        }       
      },
      [effects.GET_CHILD]() {
        const model = this.data.model;
        api.child.get(model).then( (res) => {
            console.log(res)
            this.setData({
              'childInfo': res.data.result.childList[0],
              'childInfo.logo': api.extparam.getLogoUrl(res.data.result.childList[0].logo)
            });
            if (common.isBlank(this.data.model.childId)) {
              this.setData({
                'model.childId': res.data.result.childList[0].childId
              });
            }
            this.$storage.set('childInfo', this.data.childInfo);
          })
      },
      [effects.SAVE_NEXT]() {
        let weekDays = this.data.weekDays
        let canNext = true;
        if (common.isBlank(this.data.model.startDate)) {
          return wx.showToast({
            title: '开学时间不能为空',
            duration: 1500,
            icon: "none",
            mask: true,
          });
        }
        if(this.data.userInfo.role==1){
          console.log(this.data.userInfo.role, this.data.tachertime)
          if (!this.data.tachertime){
            this.data.courseList.forEach( item => {
              console.log(item.dailyRule)
              
              if (item.dailyRule == 1) {
                if (common.isBlank(this.data.model.oneStartTime)) {
                  canNext = false
                }
              } else if (item.dailyRule == 2) {
                if (common.isBlank(this.data.model.twoStartTime)) {
                  canNext = false
                }
              } else if (item.dailyRule == 3) {
                if (common.isBlank(this.data.model.threeStartTime)) {
                  canNext = false
                }
              } else if (item.dailyRule == 4) {
                if (common.isBlank(this.data.model.fourStartTime)) {
                  canNext = false
                }
              } else if (item.dailyRule == 5) {
                if (common.isBlank(this.data.model.fiveStartTime)) {
                  canNext = false
                }
              } else if (item.dailyRule == 6) {
                if (common.isBlank(this.data.model.sixStartTime)) {
                  canNext = false
                }
              } else if (item.dailyRule == 7) {
                if (common.isBlank(this.data.model.sevenStartTime)) {
                  canNext = false
                }
              } else if (item.dailyRule == 8) {
                console.log(this.data.model.eightStartTime)
                if (common.isBlank(this.data.model.eightStartTime)) {
                  canNext = false
                }
              }
            })
          }
        }else{
          if (common.isBlank(this.data.model.oneStartTime)){
            this.setData({
              'model.oneStartTime':this.data.one
            })
          } if (common.isBlank(this.data.model.fiveStartTime)) {
            this.setData({
              'model.fiveStartTime': this.data.five
            })
          }
        }
        console.log(this.data.model)
        console.log(canNext)
        if (canNext) {
          this.$storage.set('model', this.data.model).then(
            this.$storage.set('weekDays', this.data.weekDays).then(
              wx.navigateTo({
                url: './schoolin_add3?school=' + this.data.schoolInfo.school + '&schoold=' + this.data.schoolInfo.schoold
              })
            ))
        } else {
          return wx.showToast({
            title: '请选择上课时间',
            duration: 1500,
            icon: "none",
          })
        }
      },
    }
  }
}


EApp.instance.register({
  type: SchoolinAdd2Page,
  id: 'SchoolinAdd2Page',
  config: {
    events,
    effects,
    actions
  }
});
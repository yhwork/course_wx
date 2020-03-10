import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../eea/index'
import {
  events,
  effects,
  actions
} from './schoolout_add2.eea'

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
    for (let i = 0; i < 12; i++) {
      if(j<10){
        val_time.push('0'+j)
      }else{
        val_time.push(j)
      }
      j += 5
    }
  }
  return val_time
}


const moment = require('../../../lib/moment.min.js');

class SchooloutAdd2Page extends EPage {
  get data() {
    return {
      getdate: set_times(true),
      gettime: set_times(),
      userInfo: {},
      courseInfo: {},
      childInfo: {},
      model: {
        beginDate: moment().format('YYYY-MM-DD'),
        endDate: moment().add(30, 'day').format('YYYY-MM-DD'),
        // startClassTime: moment().format('HH:mm'),
        startClassTime:'',
        endClassTime: '',
        num: 0,
        duration: '',
        repetitionIndex: 0,
        repetitionTxt: '无',
        weekDays: '2',
        weekDaysTxt: '星期一',
        remindIndex: 0,
        remindTxt: '不提醒',
        remindValue: '0',
      },
      repDis: false,
      beginWeekDay: '',
      endWeekDay: '',
      repetitionItems: ['无', '每天', '每周', '每两周', '自定义'],
      weekDayItems: [{
          name: '星期一',
          value: '2',
          checked: true
        },
        {
          name: '星期二',
          value: '3'
        },
        {
          name: '星期三',
          value: '4'
        },
        {
          name: '星期四',
          value: '5'
        },
        {
          name: '星期五',
          value: '6'
        },
        {
          name: '星期六',
          value: '7'
        },
        {
          name: '星期日',
          value: '1'
        },
      ],
      remindItems: [
        {
          name: '不提醒',
          value: 0
        },
        {
          name: '课前15分钟',
          value: 15
        },
        {
          name: '课前30分钟',
          value: 30
        },
        {
          name: '课前1小时',
          value: 60
        },
        {
          name: '课前2小时',
          value: 120
        },
        {
          name: '课前3小时',
          value: 180
        },
        {
          name: '课前1天',
          value: 1440
        }
      ],
      endclass: true,
      endShow: true,
      userDefined: false,
      showCalendar: false,
      mask: true, // 蒙版
      course: {
        'num': false, // 课程节数
        'reapet': false
      },
      value3: [2, 2]    // 开始时间
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        console.log('值',option)
        // if (option.hasOwnProperty('errtime') ){
          // this.setData({
          //   model: this.$storage.getSync('courseInfo')
          // })
        // }
      },
      [PAGE_LIFE.ON_SHOW](option) {
        let select_time = wx.getStorageSync('select_time');
        // console.log('选择的值',select_time)
        if(select_time){
          this.setData({
            'model.beginDate':select_time.date,
            'model.startClassTime':select_time.time+':00',
          })
        }
        // 判断有误课程节数 有
        let a= this.$storage.getSync('courseInfo')         // 调节课程冲突
        if(a.num){
          this.setData({
            model:a
          })
        }
        this.setData({
          courseInfo: this.$storage.getSync('courseInfo'),
          childInfo: this.$storage.getSync('childInfo'),
          userInfo: this.$storage.getSync('userInfo'),
        
        });
        // 获取已经输入的内容

        // this.setData({ model: this.$storage.getSync('model') });
        put(effects.UPDATE_WEEKDAY);

      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      //上课日期
      [events.ui.CHANGE_BEGINDATE](e) {
        this.setData({
          mask: false, 
          showCalendar: true
        });
      },
      [events.ui.SHOW_REMINDER_TIP]() {
        wx.showToast({
          icon: 'none',
          title: '上课提醒通知在公众号中显示，因此如需要此功能，则请关注“小豆包课程表”公众账号'
        });
      },
      [events.ui.SHOW_CLASS_NUM]() {
        wx.showToast({
          icon: 'none',
          title: '课程节数就是上课的总次数'
        });
        console.log(1)
      },
      [events.ui.SHOW_CLASS_TIME]() {
        wx.showToast({
          icon: 'none',
          title: '课程时长就是每次上课的总时间，即下课时间-开始时间的差值'
        });
        console.log(1)
      },
      [events.ui.SHOW_BEGIN_DATE_TIP]() {
        wx.showToast({
          icon: 'none',
          title: '开始日期请输入该课程第一天上课日期'
        });
      },
      //上课日期回调
      [events.ui.CALENDAR_DAY_CHANGED](e) {
        // console.log('wwww'+e)
        const currentDate = moment(e.detail.year + ' ' + e.detail.month + ' ' + e.detail.day, 'YYYY-MM-DD').format('YYYY-MM-DD');
        this.setData({
          'model.beginDate': currentDate,
           showCalendar: false,
           mask: true,
        })
        // 更改开始日期
        put(effects.UPDATE_WEEKDAY);
        if (this.$common.isIntNum(this.data.model.num)) {
          // 获取结束日期
          put(effects.CHANGE_ENDDATE);
        }
      },
      //课程节数
      [events.ui.CHANGE_NUM](e) {
        if (this.$common.isIntNum(e.detail.value) == false) {
          return wx.showToast({
            icon: 'none',
            duration:2000,
            title: '输入内容有误'
          });
        }
        if (e.detail.value == 0){
          return wx.showToast({
            title: '节数不能为0',
            icon: 'none',
          })
        }
        this.setData({
          'model.num': e.detail.value
        });
        if (this.$common.isIntNum(e.detail.value)) {
          put(effects.CHANGE_ENDDATE);
        }
      },
      //课程时长
      [events.ui.CHANGE_DURATION](e) {
        if (this.$common.isIntNum(e.detail.value) == false) {
          return wx.showToast({
            icon: 'none',
            duration:2000,
            title: '请输入数字'
          });
        }
        this.setData({
          'model.duration': e.detail.value,
          endclass: false,
        });
        this.setData({
          'model.endClassTime': moment(this.data.model.startClassTime, 'HH:mm').add('minute', this.data.model.duration).format('HH:mm')
        })
      },
      //开课时间
      [events.ui.CHANGE_TIMEFIRST](e) {
        this.setData({
          'model.startClassTime': e.detail.value,
          'model.endClassTime': moment(e.detail.value, 'HH:mm').add('minute', this.data.model.duration).format('HH:mm')
        })
        console.log(this.data.model.startClassTime)
      },

      //重复
      [events.ui.CHANGE_REPETITION](e) {
        console.log('重复', e, this.data.model.num)
        if (this.data.model.num == 0) {
          wx.showToast({
            title: '请输入课程课节',
            icon: 'none',
            duration: 2000
          })
          return false;
        } else {
          console.log(this.data.repetitionItems[e.detail.value])
          if (e.detail.value) {
            this.setData({
              'model.repetitionIndex': e.detail.value[0],
              'model.repetitionTxt': this.data.repetitionItems[e.detail.value],
              "endShow": false
            });
            console.log(this.data.model)
            if (e.detail.value == 4) {
              this.setData({
                'userDefined': true
              });
            }
          } else {
            this.$common.showMessage(this, '请选择重复方式');
            this.setData({
              'model.repetitionIndex': e.detail.value[0],
              endShow: true
            })
          }
        }
        put(effects.CHANGE_ENDDATE);
      },
      //自定义 ch
      [events.ui.CHANGE_CUSTOM_REPETITION](e) {
        const values = e.detail.value;
        const items = this.data.weekDayItems;
        this.setData({
          'model.weekDaysTxt': ''
        })
        items.forEach(item => {
          item.checked = values.findIndex(val => item.value === val) > -1;
          if (item.checked) {
            this.setData({
              'model.weekDaysTxt': this.data.model.weekDaysTxt + ',' + item.name
            });
          }
        });
        this.setData({
          'model.weekDaysTxt': this.data.model.weekDaysTxt.substr(1)
        });
        this.setData({
          'model.weekDays': values.join(',')
        });
        console.log('自定义日期',items,this.data.model.weekDaysTxt.substr(1),values.join(','))
        this.setData({
          weekDayItems: items
        });
      },
      //确定自定义
      [events.ui.CHANGE_DEFINED](e) {
        if (this.$common.isBlank(this.data.model.weekDays)) {
        
          return wx.showToast({
            title: '请选择星期',
            duration: 0,
            icon: 'none',
            mask: true,
          })
        }
        this.setData({
          'userDefined': false,
          mask:true
        });
        put(effects.CHANGE_ENDDATE);
      },

      //上课提醒
      [events.ui.CHANGE_REMIND](e) {
        this.setData({
          'model.remindIndex': e.detail.value,
          'model.remindTxt': this.data.remindItems[e.detail.value].name,
          'model.remindValue': this.data.remindItems[e.detail.value].value
        });
      },
      [events.ui.selectok1](e) {
        let stute = e.currentTarget.dataset.id
        console.log('选择好课程节数', stute)
        if (stute == 1) {
          this.setData({
            mask: false,
            'course.num': true
          })
        } else if (stute == 2) {
          this.setData({
            mask: false,
            'course.reapet': true
          })
        } else if (stute == 3) {
          this.setData({
            mask: false,
            'course.time': true
          })
        } else if (stute == 4) {
          this.setData({
            mask: false,
            'course.alert': true
          })
        }

      },
      // 选择课程节数
      [events.ui.bindChange1](e) {
        let stute = e.currentTarget.dataset.id
        const val = e.detail.value;
        let date = this.data.getdate;
        let time = this.data.gettime;
        console.log(val, stute)
        if (stute == 1) {
          if (this.$common.isIntNum(val[0])) {
            this.setData({
              'model.num': val[0],
              // 'model.duration': val[0],    // 课程时长
            })
              put(effects.CHANGE_ENDDATE);
          } else {
            return  wx.showToast({
              title: '请输入正确的数值',
              icon: 'none',
              duration: 2000
            })
          }
        } else if (stute == 2) {

          console.log('重复', e, this.data.model.num)
          if (this.data.model.num == '' || this.data.model.num == 0 ) {
            return wx.showToast({
              title: '请输入课程课节',
              icon: 'none',
              duration: 2000
            })
          } else {
            put(effects.UPDATE_WEEKDAY);
            console.log(this.data.repetitionItems[e.detail.value])

            // 如果课程节数 为1   重复为无
            if (e.detail.value) {
              this.setData({
                'model.repetitionIndex': e.detail.value[0],
                'model.repetitionTxt': this.data.repetitionItems[e.detail.value],
                "endShow": false
              });
              if (e.detail.value == 4) {
                this.setData({
                  'userDefined': true,
                  'course.reapet': false,
                });
              }
              if (this.$common.isIntNum(this.data.model.num)) {
                // 获取结束日期
                put(effects.CHANGE_ENDDATE);
              }
            } else {
              this.$common.showMessage(this, '请选择重复方式');
              this.setData({
                'model.repetitionIndex': e.detail.value[0],
                 endShow: true
              })
            }

          }
          // put(effects.CHANGE_ENDDATE);
          // this.setData({
          //   'model.repetitionTxt': this.data.repetitionItems[e.detail.value],
          // })
        } else if (stute == 3) { // 开始时间

          console.log(`${ date[val[0]]}:${time[val[1]]}`)
          this.setData({
            'model.startClassTime':`${ date[val[0]]}:${time[val[1]]}`
          })
          this.setData({
            'model.endClassTime': moment(this.data.model.startClassTime, 'HH:mm').add('minute', this.data.model.duration).format('HH:mm')
          })
        } else if (stute == 4) {
          console.log(this.data.remindItems[e.detail.value].name)
          this.setData({
            'model.remindIndex': e.detail.value[0],
            'model.remindTxt': this.data.remindItems[e.detail.value].name,
            'model.remindValue': this.data.remindItems[e.detail.value].value
          })
        }
      },
      [events.ui.quit](e) {
        console.log('退出')
        let state = e.currentTarget.dataset.id
        if (state == 1) {
          this.setData({
            mask: true,
            'course.num': false,
            'course.reapet': false,
            'course.time': false,
            'course.alert': false,
            showCalendar: false
          })
          // 把数据导入

        } else {
          this.setData({
            mask: true,
            'course.num': false,
            'course.reapet': false,
            'course.time': false,
            'course.alert': false,
            showCalendar: false
          })
        }

      },
      //下一步
      [events.ui.SAVE_NEXT]() {
        this.setData({
          'model.endClassTime': moment(this.data.model.startClassTime, 'HH:mm').add('minute', this.data.model.duration).format('HH:mm')
        })

        put(effects.SAVE_NEXT);
      }
    }
  }

  mapEffect() {
    return {
      [effects.UPDATE_WEEKDAY]() {
        this.setData({
          beginWeekDay: this.$converter.getWeekDay(this.data.model.beginDate)
        });
        //this.setData({ endWeekDay: this.$converter.getWeekDay(this.data.model.endDate) });
      },
      [effects.CHANGE_ENDDATE]() {
        const model = this.data.model;
        this.$api.course.getEndDate(model).then(
          (res) => {
            this.setData({
              'model.endDate': res.data.result.finishTime,
              'model.weedDayName': this.$converter.getWeekDayAlias(res.data.result.finishTime),
              endWeekDay: this.$converter.getWeekDay(res.data.result.finishTime),

            });
          },
          () => {}
        )
      },
      [effects.SAVE_NEXT]() {
        const model = this.data.model;
        if (this.$common.isBlank(model.beginDate)) {
          return  wx.showToast({
            title: '请选择开学日期',
            icon: 'none',
            duration: 2000
          })
        }
        if (this.$common.isBlank(model.num)) {
          return wx.showToast({
            title: '请填写课程节数',
            icon: 'none',
            duration: 2000
          });
        }
        if (model.repetitionTxt == '无') {
          return  wx.showToast({
            title: '请选择重复方式',
            icon: 'none',
            duration: 2000
          });;
        }
        if (!this.$common.isIntNum(model.num)) {
          return  wx.showToast({
            title: '请填写大于0的数字',
            icon: 'none',
            duration: 2000
          });;
        }
        if (this.$common.isBlank(model.startClassTime)) {
          return  wx.showToast({
            title: '请选择开始时间',
            icon: 'none',
            duration: 2000
          });;
        }

        if (this.$common.isBlank(model.duration) || model.duration == '0') {
          return  wx.showToast({
            title: '请填写课程时长',
            icon: 'none',
            duration: 2000
          });;
        }
        this.$storage.set('courseInfo', Object.assign(this.data.courseInfo, this.data.model));

        console.log(wx.getStorageSync('courseInfo'))
        wx.navigateTo({
          url: './schoolout_add3'
        });
      }
    }
  }
}

EApp.instance.register({
  type: SchooloutAdd2Page,
  id: 'SchooloutAdd2Page',
  config: {
    events,
    effects,
    actions
  }
});
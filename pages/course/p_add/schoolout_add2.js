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
const moment = require('../../../lib/moment.min.js');

class SchooloutAdd2Page extends EPage {
  get data() {
    return {
      userInfo: {},
      courseInfo: {},
      childInfo: {},
      model: {
        beginDate: moment().format('YYYY-MM-DD'),
        endDate: moment().add(30, 'day').format('YYYY-MM-DD'),
        startClassTime: moment().format('HH:mm'),
        endClassTime: '',
        num: 0,
        duration: 0,
        repetitionIndex: 0,
        repetitionTxt: '无',
        weekDays: '2',
        weekDaysTxt: '星期一',
        remindIndex: 0,
        remindTxt: '不提醒',
        remindValue: '0'
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
      remindItems: [{
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
      showCalendar: false
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        // console.log(this.$storage)
        // console.log('值·',option)
        // if (option.current){
        //   this.setData({
        //     current: option.current
        //   })
        // }
      },
      [PAGE_LIFE.ON_SHOW](option) {
        if (this.$storage.getSync('courseInfo')){
          // console.log(this.$storage.getSync('courseInfo'))
        }
        this.setData({
          courseInfo: this.$storage.getSync('courseInfo'),
          childInfo: this.$storage.getSync('childInfo'),
          userInfo: this.$storage.getSync('userInfo')
        });
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
        console.log('wwww'+e)
        const currentDate = moment(e.detail.year + ' ' + e.detail.month + ' ' + e.detail.day, 'YYYY-MM-DD').format('YYYY-MM-DD');
        this.setData({
          'model.beginDate': currentDate,
          showCalendar: false
        })
        put(effects.UPDATE_WEEKDAY);
        if (this.$common.isIntNum(this.data.model.num)) {
          put(effects.CHANGE_ENDDATE);
        }
      },

      //课程节数
      [events.ui.CHANGE_NUM](e) {
        if (this.$common.isIntNum(e.detail.value) == false) {
          this.$common.showMessage(this, '请输入数字');
          return false;
        }
        this.setData({
          'model.num': e.detail.value
        });
        // if(e.detail.value==1){

        // this.setData({repDis:true,'model.repetitionIndex':0,'model.repetitionTxt':this.data.repetitionItems[0]})
        // }else{
        // this.setData({repDis:false,'model.repetitionIndex':2,'model.repetitionTxt':this.data.repetitionItems[2]})
        // }
        if (this.$common.isIntNum(e.detail.value)) {
          put(effects.CHANGE_ENDDATE);
        }
      },
      //课程时长
      [events.ui.CHANGE_DURATION](e) {
        if (this.$common.isIntNum(e.detail.value) == false) {
          this.$common.showMessage(this, '请输入数字');
          return false;
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
          'model.startClassTime': e.detail.value
        });
        this.setData({
          'model.endClassTime': moment(this.data.model.startClassTime, 'HH:mm').add('minute', this.data.model.duration).format('HH:mm')
        })
        console.log(this.data.model.startClassTime)
      },

      //重复
      [events.ui.CHANGE_REPETITION](e) {
        if (this.data.model.num == 0) {
          this.$common.showMessage(this, '请填写课程节数');
          return false;
        } else {
          console.log(e.detail.value)
          if (e.detail.value != 0) {
            this.setData({
              'model.repetitionIndex': e.detail.value,
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
              'model.repetitionIndex' : e.detail.value,
              endShow : true
            })
          }
        }
        put(effects.CHANGE_ENDDATE);
      },
      //自定义层
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
        this.setData({
          weekDayItems: items
        });
      },
      //确定自定义
      [events.ui.CHANGE_DEFINED](e) {
        if (this.$common.isBlank(this.data.model.weekDays)) {
          this.$common.showMessage(this, '请选择星期')
          return
        }
        this.setData({
          'userDefined': false
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
          this.$common.showMessage(this, '请选择开学日期');
          return false;
        }
        if (this.$common.isBlank(model.num)) {
          this.$common.showMessage(this, '请填写课程节数');
          return false;
        }
        if (model.repetitionTxt == '无') {
          this.$common.showMessage(this, '请选择重复方式');
          return false;
        }
        if (!this.$common.isIntNum(model.num)) {
          this.$common.showMessage(this, '请填写大于0的数字');
          return false;
        }
        if (this.$common.isBlank(model.startClassTime)) {
          this.$common.showMessage(this, '请选择开始时间');
          return false;
        }

        if (this.$common.isBlank(model.duration) || model.duration == '0') {
          this.$common.showMessage(this, '请填写课程时长');
          return false;
        }
        this.$storage.set('courseInfo', Object.assign(this.data.courseInfo, this.data.model));
        console.log(this.$storage)
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
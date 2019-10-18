import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../eea/index'
import {
  events,
  effects,
  actions
} from './schoolin_class_add.eea'
const moment = require('../../../lib/moment.min.js');
class schoolinClassAddPage extends EPage {
  get data() {
    return {
      tables: [
        ['', '周一', '周二', '周三', '周四', '周五'],
        ['1', '内容2', '内容3', '内容4', '内容5', '内容6'],
        ['2', '内容2', '内容3', '内容4', '内容5', '内容6'],
        ['3', '内容2', '内容3', '内容4', '内容5', '内容6'],
        ['4', '内容2', '内容3', '内容4', '内容5', '内容6'],
        ['5', '内容2', '内容3', '内容4', '内容5', '内容6'],
        ['6', '内容2', '内容3', '内容4', '内容5', '内容6'],
        ['7', '内容2', '内容3', '内容4', '内容5', '内容6'],
        ['8', '内容2', '内容3', '内容4', '内容5', '内容6'],
      ],
      model: {
        beginDate: moment().format('YYYY-MM-DD'),
        endDate: moment().add(30, 'day').format('YYYY-MM-DD'),
        startClassTime: moment().format('HH:mm'),
        endClassTime: moment().format('HH:mm'),
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
      showCalendar: false
    };
  }


  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        console.log(option)
        // if (typeof option.comeFrom != 'undefined') {
        //   this.setData({
        //     'model.comeFrom': option.comeFrom
        //   })
        //   this.$storage.set('model.comeFrom', option.comeFrom);
        // }
        //返回comefrom信息
        this.$storage.get('model.comeFrom').then(
          (res) => { this.setData({ 'model.comeFrom': res.data }) },
          (reject) => { }
        );
        //返回学校信息
        this.$storage.get('schoolinfo.name').then(
          (name) => { this.setData({ 'model.school': name.data, school_selected: true }) },
          (reject) => { }
        );
        this.$storage.get('schoolinfo.schoolid').then(
          (schoolid) => { this.setData({ 'model.schoolId': schoolid.data }) },
          (reject) => { }
        );
        this.$storage.get('schoolinfo.city').then(
          (city) => { this.setData({ 'model.city': city.data }) },
          (reject) => { }
        );
        this.$storage.get('schoolinfo.typecode').then(
          (typecode) => {
            this.setData({ 'model.schoolType': typecode.data });
            if (this.data.model.schoolType) { put(effects.GET_GRADE); }
          },
          (reject) => { }
        )
      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {

      [events.ui.VIEW_AREA](e) {
        wx.redirectTo({
          url: '../../area/area?comefrom=addSchoolClass'
        })
      },

      [events.ui.CLASS_NAME](e) {
        this.setData({
          'model.name': e.detail.value
        });
      },
      //第一节课时间：
      [events.ui.CHANGE_TIMEFIRST](e) {
        this.setData({
          'model.startClassTime': e.detail.value
        });
        console.log(this.data.model.startClassTime)
      },
      //第五节课时间：
      [events.ui.CHANGE_TIMEEND](e) {
        this.setData({
          'model.endClassTime': e.detail.value
        });
        console.log(this.data.model.endClassTime)
      },
      // 课程时长
      [events.ui.CHANGE_DURATION](e) {
        console.log(this.$common.isIntNum(e.detail.value))
        if (this.$common.isIntNum(e.detail.value) == false) {
          this.$common.showMessage(this, '请输入数字');
          
          return false;
        }
        this.setData({
          'model.duration': e.detail.value,
          // endclass: false,

        });
        // this.setData({
        //   'model.endClassTime': moment(this.data.model.startClassTime, 'HH:mm').add('minute', this.data.model.duration).format('HH:mm')
        // })
      },
      //上课日期
      [events.ui.CHANGE_BEGINDATE](e) {
        
        this.setData({ showCalendar: true });
        console.log(this.data.showCalendar)
      },
      [events.ui.CALENDAR_DAY_CHANGED](e) {
        const currentDate = moment(e.detail.year + ' ' + e.detail.month + ' ' + e.detail.day, 'YYYY-MM-DD').format('YYYY-MM-DD');
        this.setData({
          'model.beginDate': currentDate,
          showCalendar: false
        })
        // put(effects.UPDATE_WEEKDAY);
        if (this.$common.isIntNum(this.data.model.num)) {
          // put(effects.CHANGE_ENDDATE);
        }
      },
    }
  }

  mapEffect() {
    return {
      // [effects.]() {

      // },
    }
  }
}

EApp.instance.register({
  type: schoolinClassAddPage,
  id: 'schoolinClassAddPage',
  config: {
    events,
    effects,
    actions
  }
});
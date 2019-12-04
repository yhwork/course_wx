import {
  EApp,
  COMP_LIFE,
  EComponent
} from '../../eea/index'
import {
  events,
  effects,
  actions
} from './timetable.eea'
import moment from '../../lib/moment.min.js';

class TimetableComponent extends EComponent {
  get properties() {
    return {
      childId: {
        type: String,
        value: ''
      },
      hours: {
        type: Array,
        value: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
      },
      weekText: {
        type: Array,
        value: ['一', '二', '三', '四', '五', '六', '日']
      },
      date: {
        type: String,
        value: '',
        observer: (value) => {
          this.context.dispatch(actions.TRIGGER_DATE_CHANGE);
        }
      },
      data: {
        type: Array,
        value: [],
        observer: (value) => {
          this.context.dispatch(actions.MAP_DATA, value);
        }
      },
      dataLesson: {
        type: Array,
        value: [],
        observer: (value) => {
          this.context.dispatch(actions.MAP_LESSON_DATA, value);
        }
      }
    }
  }

  get data() {
    return {
      days: [],
      itemsList: [
        [],
        [],
        []
      ], //每周的课
      diffWeek: '本周',
      timetable: true,    // 日期表

      lessonList: [], //每天的课
      dateLesson: [],
      axis:{
        row:0,
        cell:0
      },
    };
  }

  constructor() {
    super();
    this._week = {
      last: 0,
      date: this.data.date
    };
  }

  mapComponentEvent({
    publish,
    put,
    dispatch
  }) {
    return {

      [COMP_LIFE.ON_CREATED]() { },
      [COMP_LIFE.ON_ATTACHED]() { },

      [COMP_LIFE.ON_READY]() {
        if (!this.data.date) {
          this.setData({
            date: moment().format('YYYY-MM-DD')
          });
        }
        //this.context.dispatch(actions.TRIGGER_DATE_CHANGE);
      },
      [COMP_LIFE.ON_MOVED]() { },
      [COMP_LIFE.ON_DETACHED]() { },

    }
  }

  mapUIEvent({
    publish,
    put,
    dispatch
  }) {
    return {
      //查看位置
      [events.ui.OPEN_LOCATION](e) {
        let longitude = Number(e.currentTarget.dataset.longitude);
        let latitude = Number(e.currentTarget.dataset.latitude);
        wx.openLocation({
          latitude: latitude,
          longitude: longitude
        })
      },
      [events.ui.WEEK_CHANGED](e) {
        const {
          current
        } = e.detail;
        const {
          last
        } = this._week;
        const {
          date
        } = this.data;

        if (((last + 1) % 3) === current) {
          this._week.date = moment(date).add(7, 'days').format('YYYY-MM-DD');
        } else {
          this._week.date = moment(date).add(-7, 'days').format('YYYY-MM-DD');
        }

        this._week.last = current;
        // console.log(this._week.last)
      },
      [events.ui.WEEK_ANI_FINISHED](e) {
        const {
          date
        } = this._week;
        if (!date) {
          return;
        }

        this.setData({
          date
        });
        this._week.date = null;
      },
      [events.ui.TAP_WEEK](e) {
        if (this.data.diffWeek == '本周') {
          return
        }
        const date = moment().format('YYYY-MM-DD');
        this.setData({
          date
        });
        this.triggerEvent('date-changed', {
          begin: moment().isoWeekday(1).format('YYYY-MM-DD'),
          days: 7,
          diff: 0
        });
      },

      // 选择的日期
      [events.ui.TAP_DAY](e) {
        //选中的日期
        const dateLesson = e.currentTarget.dataset.item
        console.log('选中日期', dateLesson)
        // console.log(this.data.dateLesson.length == 0, dateLesson == this.data.dateLesson)
        if (this.data.dateLesson.length == 0 || dateLesson == this.data.dateLesson) {
          this.setData({
            timetable: !this.data.timetable
          })
        }

        this.setData({
          dateLesson
        });
        this.triggerEvent('lesson-date-changed', {
          dateLesson,
          timetable: this.data.timetable
        });
      },
      [events.ui.LESSON_ADD](e){
        let date = e.currentTarget.dataset.date;
        let time = e.currentTarget.dataset.time;
        let row = e.currentTarget.dataset.keyrow;
        let cell = e.currentTarget.dataset.keycell;
        this.setData({
          axis: { row, cell}
        })
        console.log('添加课程', date, time)
        console.log(e)
      },
      // 每个小按钮点击事件
      [events.ui.LESSON_DETAIL](e) {
        const lessonId = e.currentTarget.dataset.lessonid
        console.log(lessonId, this.data.childId)
        // wx.navigateTo({
        //   url: './p_lesson/schoolout_lesson_detail?lessonId=' + lessonId + '&childId=' + this.data.childId
        // })

      }

    }
  }

  mapAction({
    publish,
    put,
    dispatch
  }) {
    return {

      // 改变日期
      [actions.UPDATE_DAYS]() {
        const {
          weekText,
          date
        } = this.data;
        const mon = moment(date).isoWeekday(1);
        const days = weekText.map((text, i) => {
          const day = moment(mon).add(i, 'day');
          return {
            date: day.format('YYYY-MM-DD'),
            today: day.isSame(moment(), 'day'),
            text: {
              date: day.format('DD'),   // 生成指定格式数据day.format('DD日')
              week: text
            }
          };
        });
        // console.log('数据',days)
        this.setData({
          days
        });
      },
      [actions.TRIGGER_DATE_CHANGE]() {
        //! 根据date生成days
        dispatch(actions.UPDATE_DAYS);
        const begin = moment(moment().format('YYYY-MM-DD')).isoWeekday(1);
        const end = moment(this.data.date).isoWeekday(1);
        const diff = moment.duration(end.diff(begin)).asWeeks();
        if (diff == 0) {
          this.setData({
            diffWeek: '本周'
          })
        } else {
          this.setData({
            diffWeek: diff + '周'
          })
        }
        //! 根据date生成查询参数
        this.triggerEvent('date-changed', {
          begin: moment(this.data.date).isoWeekday(1).format('YYYY-MM-DD'),
          days: 7,
          diff: diff
        });

      },
      [actions.MAP_DATA](data) {
        //if (!data || data.length === 0) { return; }
        // console.log(data)

        const itemsList = [[], [], []];

        itemsList[this._week.last] = data.map((item, i) => {


          const date = moment.unix(item.date);
          const min = parseInt(date.format('mm'));
          let colorClass = ''
          // 出勤
          if (item.status == 1) {
            colorClass = 'lesson-attend lesson-attend-color';
          } else if (item.status == 0) {
          // 调课
            if (item.type == 2) {
              colorClass = 'lesson-change lesson-change-color';
            // 补课
            } else if (item.type == 3) {
              colorClass = 'lesson-remedial lesson-remedial-color';
            } else {
              colorClass = 'lesson-noton lesson-noton-color';
            }
          } else {
            colorClass = 'lesson-absent lesson-absent-color';
          }
          if (!item.duration) {
            item.duration = 42
          }
          if (item.name == '放学') {
            item.duration = 30;
            item.courseType = 3; //放学
            colorClass = 'school_after'
          }
          item.$value = {
            date: date.format('YYYY-MM-DD'),
            hour: parseInt(date.format('HH')),
            top: `${Math.round(min / 60 * 100)}%`,
            height: `${Math.round(item.duration / 60 * 100)}%`,
            colorClass: colorClass
          };
          return item;
        });
        this.setData({
          itemsList,
          current: this._week.last
        });
        // console.log(this.data.itemsList)
      },
      [actions.MAP_LESSON_DATA](data) {
        //if (!data || data.length === 0) { return; }
        this.setData({
          lessonList: data
        });
        // console.log(this.data.lessonList)
      }
    }
  }
}

EApp.instance.registerComponent({
  type: TimetableComponent,
  id: 'TimetableComponent',
  config: {
    events,
    effects,
    actions
  }
})
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
      btnclick:{
        type: Boolean,
        value: true,
        observer: (value) => {
          console.log(value)
          this.setData({
            btnclick:value
          })
        }
      },
      my_current:{
        type: String,
        value:1,
        observer: (value) => {
          this.context.dispatch(actions.UPDATE_DAYS);
        }
      },
      childId: {
        type: String,
        value: ''
      },
      hours: {
        type: Array,
        value: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
      },
      weekText_in: {
        type: Array,
        value: ['一', '二', '三', '四', '五']
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
      btnclick:false,
      lessonList: [], //每天的课
      dateLesson: [],
      add_course:false, // 添加课程
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
        // console.log('再次加载',this.data.my_current)

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
      [events.ui.stopTouchMove](){
        // if(this.data.my_current==0)
        // return false
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
      // 添加新的课程
      [events.ui.LESSON_ADD](e){
        let date = e.currentTarget.dataset.date;
        let time = e.currentTarget.dataset.time;
        let row = e.currentTarget.dataset.keyrow;
        let cell = e.currentTarget.dataset.keycell;
        console.log('添加课程', row,cell)

        // itemsList
        let warns = this.data.itemsList[this._week.last];
        // 判断是否第二次点击
        if(row == this.data.axis.row && cell == this.data.axis.cell ){
          if(!this.data.btnclick){
                // 把添加时间抛出去
              this.triggerEvent('add-course', {
                  date,
                  time,
                  childId
                });
              this.setData({
                  btnclick:true
              })
          }

          var childId = this.data.childId
          this.setData({
            add_course:true
          })

          // 进行添加课程
          // console.log('添加课程',this.data.add_course)
        }else{
          // console.log(date,time)
          if (!time && !date){
            return false
          }
          // 判断是不是点击了重复   some部分满足条件。  every 全部满足条件 filter按条件过滤   reduce
          let isads = warns.some((item) => { return date === item.$value.date && time === item.$value.hour })

          if (!isads) {
            this.setData({
              axis: { row, cell },
              add_course: false
            })
          }
          // console.log('切换时间', warns, isads, date, time, this.data.add_course)
        }
      },
      // 课程详情
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
        let {
          weekText,
          date
        } = this.data;

        if(this.data.my_current==1){
          weekText = ['一', '二', '三', '四', '五','六','日']
          
        }else{
          weekText = ['一', '二', '三', '四', '五']
        }
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

        console.log('数据',days)
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
        if (!data || data.length === 0) { return; }
        const itemsList = [[], [], []];
        itemsList[this._week.last] = data.map((item, i) => {
          const date = moment.unix(item.date);
          const min = parseInt(date.format('mm'));
          let colorClass = ''
          //  校外
          if(item.courseType == 2){
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
          } else if (item.courseType == 1){        // 校内课

            let name = item.name.substr(0, 1); 
            switch (name){
              case '语':
                colorClass = 'lesson-China';
                break;
              case '数':
                colorClass = 'lesson-math';
                break;
              case '英':
                colorClass = 'lesson-english ';
                break;
              default:
                colorClass = 'lesson-default ';
            }
            // // 出勤
            // if (item.status == 1) {
            //   colorClass = 'lesson-attend lesson-attend-color';
            // } else if (item.status == 0) {
            //   // 调课
            //   if (item.type == 2) {
            //     colorClass = 'lesson-change lesson-change-color';
            //     // 补课
            //   } else if (item.type == 3) {
            //     colorClass = 'lesson-remedial lesson-remedial-color';
            //     // 未上课
            //   } else {
            //     colorClass = 'lesson-noton lesson-noton-color';
            //   }
            // } else {
            //   // 缺课
            //   colorClass = 'lesson-absent lesson-absent-color';
            // }
          }
            // 过渡时间
          if (!item.duration) {
            item.duration = 42
          }
          if (item.name == '放学') {
            item.duration = 30;
            item.courseType = 3; //放学
            colorClass = 'school_after'
          }
          // 如果同一天  且上课时间小时连着则   第一个的框框变大，第二条数据为空
          item.$value = {
            date: date.format('YYYY-MM-DD'),
            hour: parseInt(date.format('HH')),
            top: `${Math.round(min / 60 * 100)}%`,
            height: `${Math.round(item.duration / 60 * 100)}%`,
            colorClass: colorClass
          };
          return item;
        });
        if(this.data.my_current==0){
          this.setData({
            btnclick: false,
            itemsList:itemsList,
            current: this._week.last
          });
        }else{
          this.setData({
            btnclick: false,
            itemsList,
            current: this._week.last
          });
        }
        
        // console.log('是否改变',this.data.itemsList)
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
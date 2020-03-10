import { EApp, COMP_LIFE, EComponent } from '../../eea/index'
import { events, effects, actions } from './calendarLayer.eea'
import moment from '../../lib/moment.min.js';
class CalendarLayerComponent extends EComponent {
  get properties() {
    return {
      monthLessonNum: {
          type: Array,
          value: [],
          observer: (value) => {
              this.context.dispatch(actions.MAP_MONTHLESSONUM_DATA,value);
          }
      },
      /**
       * 年份
       */
      year: {
        type: Number,
        value: new Date().getFullYear(),
        observer: '_yearChange'
      },

      /**
       * 月份1~12
       */
      month: {
        type: Number,
        value: new Date().getMonth() + 1,
        observer: '_monthChange'
      },

      /**
       * 日期
       */
      day: {
        type: Number,
        value: new Date().getDate(),
        observer: '_dayChange'
      },

      /**
       * 日历范围起点
       */
      startDate: {
        type: String,
        value: '1900-01',
        observer: '_setStartDate'
      },

      /**
       * 日历范围终点
       */
      endDate: {
        type: String,
        value: '2099-12',
        observer: '_setEndDate'
      },

      /**
       * 是否显示标题
       */
      header: {
        type: Boolean,
        value: true,
        observer: '_headerChange'
      },

      /**
       * 是否显示下个月按钮
       */
      next: {
        type: Boolean,
        value: true
      },

      /**
       * 是否显示上个月按钮
       */
      prev: {
        type: Boolean,
        value: true
      },

      /**
       * 显示额外上下月份日期
       */
      showMoreDays: {
        type: Boolean,
        value: false,
        observer: '_moreChange'
      },

      /**
       * 是否显示周标题
       */
      weeks: {
        type: Boolean,
        value: true,
        observer: '_showWeeksChange'
      },

      /**
       * 周标题类型
       */
      weeksType: {
        type: String,
        value: 'en',
        observer: '_weeksTypeChange'
      }

    }
  }

  get data() {
    return {
      days_array: [], // 日期数组
      weekTitle: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      max_year: 2099, // 最大年份
      max_month: 12,  // 最大月份
      min_year: 1900, // 最小年份
      min_month: 1,   // 最小月份
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth() + 1
    };
  }

  constructor() {
    super();
  }
  /**
   * 检查年份
   */
  _checkYear(year) {
    if (year < minYear) {
      throw new RangeError('年份不能小于' + minYear + '年');
    } else if (year > maxYear) {
      throw new RangeError('年份不能大于' + maxYear + '年');
    }
    return true;
  }

  /**
   * 检查月份
   */
  _checkMonth(month) {
    if (month < 1) {
      throw new RangeError('月份不能小于1');
    } else if (month > 12) {
      throw new RangeError('月份不能大于12');
    }
    return true;
  }

  /**
   * 检查日期是否输入正确
   * @param day int 日期
   */
  _checkDay(day) {
    if (day < 1) {
      throw new RangeError('日期不能小于1');
    } else if (day > 31) {
      throw new RangeError('日期不能大于31');
    }
    return true;
  }

  /**
   * 年份属性改变
   */
  _yearChange(newYear, oldYear) {
    if (this._checkYear(newYear)) {
      this.setData({
        year: newYear,
        days_array: this._setCalendarData(newYear, this.data.month)
      });
    }
  }

  /**
   * 月份属性改变
   */
  _monthChange(newMonth, oldMonth) {
    if (this._checkMonth(newMonth)) {
      this.setData({
        month: newMonth,
        days_array: this._setCalendarData(this.data.year, newMonth)
      });
    }
  }

  /**
   * 日期属性改变
   */
  _dayChange(newDay, oldDay) {
    if (this._checkDay(newDay)) {
      this.setData({
        day: newDay
      });
    }
  }

  /**
   * 设置起始日期
   */
  _setStartDate(newDate, oldDate) {
    if (newDate.length == 7 && newDate.indexOf('-') == 4) {
      const year = parseInt(newDate.split('-')[0]);
      const month = parseInt(newDate.split('-')[1]);
      if (!isNaN(year) && year >= minYear && !isNaN(month) && month >= 1 && month <= 12) {
        this.setData({
          startDate: newDate,
          min_year: year,
          min_month: month
        });
      } else {
        throw new Error('起始日期必须是YYYY-MM格式，且大于等于1900-01');
      }
    } else {
      throw new Error('起始日期必须是YYYY-MM格式');
    }
  }

  /**
   * 设置结束日期
   */
  _setEndDate(newDate, oldDate) {
    if (newDate.length == 7 && newDate.indexOf('-') == 4) {
      const year = parseInt(newDate.split('-')[0]);
      const month = parseInt(newDate.split('-')[1]);
      if (!isNaN(year) && year <= 2099 && !isNaN(month) && month >= 1 && month <= 12) {
        this.setData({
          endDate: newDate,
          max_year: year,
          max_month: month
        });
      } else {
        throw new Error('结束日期必须是YYYY-MM格式，且小于等于2099-12');
      }
    } else {
      throw new Error('结束日期必须是YYYY-MM格式');
    }
  }

  /**
   * 是否显示标题
   */
  _headerChange(newHeader, oldHeader) {
    this.setData({
      header: !!newHeader
    });
  }

  /**
   * 是否显示额外的月份日期
   */
  _moreChange(newMore, oldMore) {
    this.setData({
      showMoreDays: !!newMore,
      days_array: this._setCalendarData(this.data.year, this.data.month)
    });
  }

  /**
   * 周标题类型
   */
  _weeksTypeChange(newVal, oldVal) {
    switch (newVal) {
      case 'en':
        this.setData({
          weeksType: 'en',
          weekTitle: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
        });
        break;
      case 'cn':
        this.setData({
          weeksType: 'cn',
          weekTitle: ['日', '一', '二', '三', '四', '五', '六']
        });
        break;
      case 'full-en':
        this.setData({
          weeksType: 'full-en',
          weekTitle: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        });
        break;
      default:
        this.setData({
          weeksType: 'en',
          weekTitle: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
        });
        break;
    }
  }
  /**
   * 是否显示周标题
   */
  _showWeeksChange(newVal, oldVal) {
    this.setData({
      weeks: !!newVal,
    });
  }

  /**
   * 设置日期单元格字体颜色、背景
   */
  _setDaysColor(newDaysColor, oldDaysColor) {
    this.setData({
      days_color: newDaysColor
    }, function () {
      this.setData({
        days_array: this._setCalendarData(this.data.year, this.data.month)
      });
    });
  }

  /**
   * 设置日期背景效果
   */
  _setActiveType(newType, oldType) {
    switch (newType) {
      case 'rounded':
      case 'square':
        this.setData({
          activeType: newType
        });
        break;
      default:
        this.setData({
          activeType: 'rounded'
        });
    }
  }

  /**
   * 设置日历
   * @param int year 年份
   * @param int month 月份，取值1~12
   */
  _setCalendarData(year, month) {
    //const empty_days_count = new Date(year, month - 1, 1).getDay(); // 本月第一天是周几，0是星期日，6是星期六
    const empty_days_count = new Date(year, month - 1, 0).getDay(); // 本月第一天是周几，7是星期日，1是星期一

    let empty_days = new Array;
    const prev_month = month - 1 == 0 ? 12 : month - 1;             // 上个月的月份数
    const prev_year = month - 1 == 0 ? this.data.year - 1 : this.data.year;
    /**
     * 上个月的日期
     */
    for (let i = 0; i < empty_days_count; i++) {
      empty_days.push({
        state: 'inactive',
        day: -1,
        month: prev_month,
        year: prev_year,
        info: 'prev',
        color: '#c3c6d1',
        background: 'transparent'
      });
    }

    /**
     * 下个月的日期
     */
    const last_day = new Date(year, month, 0);         // 本月最后一天
    const days_count = last_day.getDate();              // 本月最后一天是几号
    //const last_date = last_day.getDay();                // 本月最后一天是星期几
    const last_date = new Date(year, month, -1).getDay();
    const next_month = month + 1 == 13 ? 1 : month + 1; // 下个月的月份数
    const next_year = month + 1 == 13 ? this.data.year + 1 : this.data.year;
    let empty_days_last = new Array;
    for (let i = 0; i < 6 - last_date; i++) {
      empty_days_last.push({
        state: 'inactive',
        day: -2,
        month: next_month,
        year: next_year,
        info: 'next',
        color: '#c3c6d1',
        background: 'transparent'
      });
    }
    
    /**
     * 本月的日期
     */
    let temp = new Array;
    for (let i = 1; i <= days_count; i++) {
      temp.push({
        state: 'inactive',
        day: i,
        month: month,
        year: year,
        info: 'current',
        color: '#4a4f74',
        background: 'transparent'
      });
    }
    const days_range = temp;                                   // 本月
    let days = empty_days.concat(days_range, empty_days_last); // 上个月 + 本月 + 下个月

    // 如果要显示前后月份的日期
    if (this.data.showMoreDays) {
      // 显示下月的日期
      let index = days.findIndex(element => { return element.day == -2; });
      if (index != -1) {
        const length = days.length;
        const count = length - index;
        for (let i = 1; i <= count; i++) {
          days[index + i - 1].day = i;
        }
      }

      // 显示上月的日期
      index = days.findIndex(element => { return element.day == 1; }) - 1;
      if (index != -1) {
        const last_month_day = new Date(year, month - 1, 0).getDate();
        for (let i = 0; i <= index; i++) {
          days[i].day = last_month_day - index + i;
        }
      }
    }

    let days_array = new Array;
    let week = new Array;
    for (let i = 0; i < days.length; i++) {
      week.push(days[i]);
      if (i % 7 == 6) {
        days_array.push(week);
        week = new Array;
      }
    }

    if (week.length > 0) {
      days_array.push(week);
    }
    //console.log(days_array)
    return days_array;
  }

  /**
   * 自定义日期数组
   */
  _setDaysAddon(newAddon, oldAddon) {
    if (typeof (newAddon) == 'object' && newAddon instanceof Array) {
      this.setData({
        days_addon: newAddon
      });
    }
  }

  /**
   * 点击下个月
   */
  nextMonth() {
    const eventDetail = {
      prevYear: this.data.year,
      prevMonth: this.data.month
    };

    if (this.data.month == 12) {
      this.setData({
        year: this.data.year + 1,
        month: 1
      });
    } else {
      this.setData({
        month: this.data.month + 1
      });
    }
    this.setData({
      days_array: this._setCalendarData(this.data.year, this.data.month)
    });
    eventDetail['currentYear'] = this.data.year;
    eventDetail['currentMonth'] = this.data.month;
    this.triggerEvent('next-month', eventDetail);
  }
  /**
   * 点击上个月
   */
  prevMonth() {
    const eventDetail = {
      prevYear: this.data.year,
      prevMonth: this.data.month
    };

    if (this.data.month == 1) {
      this.setData({
        year: this.data.year - 1,
        month: 12
      });
    } else {
      this.setData({
        month: this.data.month - 1
      })
    }
    this.setData({
      days_array: this._setCalendarData(this.data.year, this.data.month)
    });
    eventDetail['currentYear'] = this.data.year;
    eventDetail['currentMonth'] = this.data.month;
    this.triggerEvent('prev-month', eventDetail);
  }

  /**
   * 日期选择器变化
   */
  dateChange(event) {
    const eventDetail = {
      prevYear: this.data.year,
      prevMonth: this.data.month
    };
    const value = event.detail.value;
    const date = new Date(value);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    this.setData({
      year: year,
      month: month,
      days_array: this._setCalendarData(year, month)
    });

    eventDetail['currentYear'] = year;
    eventDetail['currentMonth'] = month;
    this.triggerEvent('dateChange', eventDetail);
  }

  /**
   * 点击具体日期
   */
  dayClick(event) {
    const click_day = event.currentTarget.dataset.day;
    const eventDetail = {
      year: click_day.year,
      month: click_day.month,
      day: click_day.day
    };
    this.triggerEvent('day-click', eventDetail);
  }

  mapComponentEvent({ publish, put, dispatch }) {
    return {
      [COMP_LIFE.ON_CREATED]() {
      },
      [COMP_LIFE.ON_ATTACHED]() {
      },
      [COMP_LIFE.ON_READY]() {
        const year = this.data.year;
        const month = this.data.month;
        this.setData({
          days_array: this._setCalendarData(year, month)
        });
      },
      [COMP_LIFE.ON_MOVED]() {
      },
      [COMP_LIFE.ON_DETACHED]() {
      },
    }
  }

  mapUIEvent({ publish, put, dispatch }) {
    return {
      [events.ui.PREV_MONTH](e) {
        this.prevMonth()
      },
      [events.ui.NEXT_MONTH](e) {
        this.nextMonth()
      },
      [events.ui.TAP_DAY](e) {
        this.dayClick(e)
      },
       [events.ui.quit](e) {
         this.triggerEvent('day-close');
       }
      
    }
  }

  mapAction({ publish, put, dispatch }) {
    return {
      [actions.MAP_MONTHLESSONUM_DATA](data) {
          let days_array1 = this.data.days_array;
          days_array1.forEach(
              (item1)=>{
                  item1.forEach(
                     (item2)=>{
                        if(typeof item2.courseNum!='undefined'){
                          delete item2.courseNum
                        }
                     } 
                  )
              }
          )
          this.setData({days_array:days_array1})
          if (!data || data.length === 0) { return; }
          days_array1 = this.data.days_array;
          data.forEach(
              (item)=>{
                  days_array1.forEach(
                      (item1)=>{
                          item1.forEach(
                             (item2)=>{
                                if(item2.year==item.year && item2.month==item.month && item2.day==item.day){
                                  item2.courseNum = item.courseNum;
                                }
                             } 
                          )
                      }
                  )
              }
          )
          this.setData({days_array:days_array1})
      }
    }
  }
}

EApp.instance.registerComponent({
  type: CalendarLayerComponent,
  id: 'CalendarLayerComponent',
  config: { events, effects, actions }
});

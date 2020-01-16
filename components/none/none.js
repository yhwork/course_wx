import {
  EApp,
  COMP_LIFE,
  EComponent
} from '../../eea/index'
import {
  events,
  effects,
  actions
} from './none.eea'
import moment from '../../lib/moment.min.js';

class nonePage extends EComponent {
  get properties() {
    return {
      current:{
        type: String,
        value: '',
      },
      title:{
        type: String,
        value: '',
        observer: (value) => {
          this.context.dispatch(actions.MAP_LESSON_DATA, value);
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
      // 错误返回
      [events.ui.ROUTER_GO](e){
        this.triggerEvent('back_change', {
          data:this.data.title,
          current:this.data.current
        });
      },
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
      }

    }
  }

  mapAction({
    publish,
    put,
    dispatch
  }) {
    return {
      [actions.MAP_LESSON_DATA](data) {
        this.setData({
          title: data
        });
      }
    }
  }
}

EApp.instance.registerComponent({
  type: nonePage,
  id: 'nonePage',
  config: {
    events,
    effects,
    actions
  }
})
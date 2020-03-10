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
      datas:{
        type: Object,
        value: {
          isdata:true,
          name:'你还没有创建',
          btn:'开始创建'
        },
        observer: (value) => {
          this.context.dispatch(actions.MAP_LESSON_DATA, value);
        }
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
        console.log('执行了吗')
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
      // 加入创建
      [events.ui.ROUTER_GO](e){
        this.triggerEvent('back_change', {
          datas:this.data.datas
        });
      },
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
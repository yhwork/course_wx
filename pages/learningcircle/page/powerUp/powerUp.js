import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../../eea/index'
import {
  events,
  effects,
  actions
} from './powerUP.eea'

class powerUPPage extends EPage {
  get data() {
    return {
      handle_list:[
        { title: '圈主头图', complete: false },
        { title: '圈主简介', complete: false },
        { title: '圈主微信号', complete: true },
        { title: '填写打卡详情', complete: false },
        { title: '圈子标签设置', complete: false },
        { title: '创建打卡主题', complete: false },
      ]
    };
  }


  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        let {
          id
        } = option;
        if (typeof id !== 'undefined') {
          id = parseInt(id);
          put(effects.LOAD_CHILD, {
            id
          });
        }
      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      [events.ui.changeTab](e) { //切换tab
        var idx = e.currentTarget.dataset.idx;
        this.setData({
          currentTab: idx
        })

      },
      [events.ui.SAVE]() {
        put(effects.SAVE_CHILD);
      }
    }
  }

  mapEffect() {
    return {
      [effects.LOAD_CHILD]({
        id
      }) {
        this.$api.child.get(id).then(model => {
          this.setData({
            model
          });
        });
      },
    
    }
  }
}

EApp.instance.register({
  type: powerUPPage,
  id: 'powerUPPage',
  config: {
    events,
    effects,
    actions
  }
});
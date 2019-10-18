
import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../../eea/index'
import {
  events,
  effects,
  actions
} from './circleDetail.eea'

class myCirclePage1 extends EPage {
  get data() {
    return {
      nav_tab: ["圈子详情", "圈子日记", "圈子成员"],
      currentTab: 0,
      members: [],
      diarys: [],

    };
  }


  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        let
          { id }
            = option;
        if (typeof id !== 'undefined') {
          id = parseInt(id);
          let parameter = {
            "communityId": id,
            "pageSize": 5,
            "currentPage": 1
          };
          put(effects.LOAD_CIRCLE_INFO, { id });
          put(effects.LOAD_CIRCLE_MEM, { parameter });
        }
      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      [events.ui.CHANGE_TAB](e) { //切换tab
        var idx = e.currentTarget.dataset.idx;
        this.setData({
          currentTab: idx
        })
      },
      [events.ui.SHOW_HIDE_C](e) { //显示隐藏投诉
        var shORhi = e.currentTarget.dataset.shorhi;
        var idx = e.currentTarget.dataset.idx;
        var toast_hide = 'diarys[' + idx + '].toast_hide';
        if (shORhi) {
          this.setData({
            [toast_hide]: false
          })
        } else {
          this.setData({
            [toast_hide]: true
          })
        }
      },
      [events.ui.SAVE]() {
        put(effects.SAVE_CHILD);
      }
    }
  }

  mapEffect() {
    return {
      [effects.LOAD_CIRCLE_INFO]({ id }) {
        this.$api.circle.getCommunityInfo(id).then(model => {
          this.setData({
            model: model.data.result
          });
        });
      },
      [effects.LOAD_CIRCLE_MEM]({ parameter }) {
        console.log(parameter)
        this.$api.circle.getCommunityMembers(parameter).then(res => {
          this.setData({
            member: res.data.result.communityMember
          });
        });
      }
    }
  }
}

EApp.instance.register({
  type: myCirclePage1,
  id: 'myCirclePage1',
  config: {
    events,
    effects,
    actions
  }
});
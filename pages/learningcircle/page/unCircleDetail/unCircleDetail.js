import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../../eea/index'
import {
  events,
  effects,
  actions
} from './uncircleDetail.eea'

class unCircleDetail extends EPage {
  get data() {
    return {
      nav_tab: ["圈子详情", "圈子日记"],
      currentTab: 0,
      diarys: [//圈子日记
        {
          toast_hide: true,
          diary_img: [
            'https://timgsa.baidu.com/timg?image&quality=80 &size=b10000_10000&sec=1532502852587&di=7622b2fadc2ecfcc0b43714a339ef292&imgtype=jpg&src=http%3A%2F%2Fg.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F95eef01f3a292df5bee3b4ccb0315c6035a873c2.jpg',
            'https://timgsa.baidu.com/timg?image&quality=80 &size=b10000_10000&sec=1532502852587&di=7622b2fadc2ecfcc0b43714a339ef292&imgtype=jpg&src=http%3A%2F%2Fg.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F95eef01f3a292df5bee3b4ccb0315c6035a873c2.jpg'
          ]
        }, {
          toast_hide: true,
          diary_img: [
            'https://timgsa.baidu.com/timg?image&quality=80 &size=b10000_10000&sec=1532502852587&di=7622b2fadc2ecfcc0b43714a339ef292&imgtype=jpg&src=http%3A%2F%2Fg.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F95eef01f3a292df5bee3b4ccb0315c6035a873c2.jpg',
            'https://timgsa.baidu.com/timg?image&quality=80 &size=b10000_10000&sec=1532502852587&di=7622b2fadc2ecfcc0b43714a339ef292&imgtype=jpg&src=http%3A%2F%2Fg.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F95eef01f3a292df5bee3b4ccb0315c6035a873c2.jpg'
          ]
        }
      ],
      resultCircleDetail: {}
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        let id = 100000;
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
            resultCircleDetail: model.data.result
          });
          if (this.data.resultCircleDetail.communitySlogan == '' || this.data.resultCircleDetail.communitySlogan == 'undefind') {
            this.setData({
              'resultCircleDetail.communitySlogan':'这个圈主比较懒，什么都没有写呢！'
            })
          }
          console.log(this.data.resultCircleDetail)
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
  type: unCircleDetail,
  id: 'unCircleDetail',
  config: {
    events,
    effects,
    actions
  }
});
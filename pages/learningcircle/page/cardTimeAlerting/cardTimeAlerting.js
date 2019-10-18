// pages/circle/cardTimeAlerting/cardTimeAlerting.js
import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../../eea/index'
import {
  events,
  effects,
  actions
} from './cardTimeAlerting.eea'

class cardTimeAlert extends EPage {
  get data() {
    return {
      time: {
        communityStartTime: '请选择',  // 提醒时间
      },
      model: {}
    };
  }


  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        this.setData({
          'model.communityId':option.id
        })
        put(effects.getCurrentCommunityRule);
      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      // 提醒时间
      [events.ui.bindTimeChange](e) {
        this.setData({
          'time.communityStartTime': e.detail.value,
          dateSelect: true,
          'model.remindTime': e.detail.value
        })
        put(effects.saveRemindTime);
      }
    }
  }

  mapEffect() {
    return {
      [effects.saveRemindTime]() {
        this.$api.circle.updateSignInRemindTime(this.data.model).then(s => {});
      },
      [effects.getCurrentCommunityRule]() {
        let param = { communityId: this.data.model.communityId };
        this.$api.circle.getCommunityRule(param).then(s => {
          if (s.data.errorCode == '0') {
            let alertTime =  s.data.result[2].ruleSettingValue;
            this.setData({
              'time.communityStartTime': alertTime == null ? '请选择' : alertTime.split(":")[0] + ":" + alertTime.split(":")[1]
            })
          }
        })
      }
    }
  }
}

EApp.instance.register({
  type: cardTimeAlert,
  id: 'cardTimeAlert',
  config: {
    events,
    effects,
    actions
  }
});


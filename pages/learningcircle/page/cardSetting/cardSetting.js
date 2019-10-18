import regeneratorRuntime from '../../../../lib/runtime'
import { EApp, EPage, PAGE_LIFE } from '../../../../eea/index'
import { events, effects, actions } from './cardSetting.eea'

class cardSettingPage extends EPage {
  get data() {
    return {
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
      [events.ui.switch1Change](e) {
        console.log(e.detail.value)
        let signInValue;
        if (e.detail.value) {
          // 允许打卡
          signInValue = 1;
        } else {
          signInValue = 2;
        }
        this.setData({
          'model.reSignInStatus': signInValue
        })
        
        this.$api.circle.updateReSignInStatus(this.data.model).then(s => {
          if (s.data.errorCode == '0') {
            wx.showToast({
              title: '设置成功',
            })
          }
        })
      }
    }
  }

  mapEffect() {
    return {
      [effects.getCurrentCommunityRule]() {
        let param = { communityId: this.data.model.communityId };
        this.$api.circle.getCommunityRule(param).then(s => {
          if(s.data.errorCode == '0') {
            this.setData({
              switch1Checked: s.data.result[1].ruleSettingValue == 1?'true':''
            })
          }
        })
      }
    }
  }
}

EApp.instance.register({
  type: cardSettingPage,
  id: 'cardSettingPage',
  config: {
    events,
    effects,
    actions
  }
});
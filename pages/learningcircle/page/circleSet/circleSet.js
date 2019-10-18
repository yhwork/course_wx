import regeneratorRuntime from '../../../../lib/runtime'
import { EApp, EPage, PAGE_LIFE } from '../../../../eea/index'
import { events, effects, actions } from './circleSet.eea'

class circleSetPage extends EPage {
  get data() {
    return {
      model:{

      }
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        console.log(option)
        let prePageParam = option;
        if (prePageParam.gender == 0) {
          prePageParam.gender = '../../../../assets/img/boy.png';
        } else {
          prePageParam.gender = '../../../../assets/img/girl.png';
        }
        this.setData({
          model: prePageParam
        })
      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      // 隐私设置
      [events.ui.privacySetBind](e) {
        wx.navigateTo({
          url: '../setprivacy/setprivacy?id=' + this.data.model.id,
        })
      },
      // 补打卡设置
      [events.ui.repairClockSetBind](e) {
        wx.navigateTo({
          url: '../cardSetting/cardSetting?id=' + this.data.model.id
        })
      },
      // 打卡日期时间设置
      [events.ui.signDateTimeSetBind](e) {
        wx.navigateTo({
          url: '../cardTimeSet/cardTimeSet?id=' + this.data.model.id + '&communityName=' + this.data.model.communityName + '&masterLogo=' + this.data.model.masterLogo + '&masterRealName=' + this.data.model.masterRealName + '&gender=' + this.data.model.gender + '&communityEndDate=' + this.data.model.communityEndDate
        })
      },
      // 打卡提醒时间设置
      [events.ui.signWarnTimeRuleBind](e) {
        wx.navigateTo({
          url: '../cardTimeAlerting/cardTimeAlerting?id=' + this.data.model.id,
        })
      },
      // 日记规则设置
      [events.ui.diaryRuleSetBind](e) {
        wx.navigateTo({
          url: '../DiariesRules/DiariesRules?id=' + this.data.model.id,
        })
      }
    }
  }

  mapEffect() {
    return {
      
    }
  }
}

EApp.instance.register({
  type: circleSetPage,
  id: 'circleSetPage',
  config: {
    events,
    effects,
    actions
  }
});
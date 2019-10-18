// pages/circle/setprivacy/setprivacy.js
import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../../eea/index'
import {
  events,
  effects,
  actions
} from './setprivacy.eea'

class setprivacyPage extends EPage {
  get data() {
    return {
      typeList: [
        { name: '公开', value: '1', explain: '任何人都可以加入圈子，且有机会被小豆包推荐', checked:'true' },
        { name: '私密', value: '2', explain: '必须圈主邀请才能加入，成员邀请需圈主审核', checked:'' },
      ],
      model: {
        communityId:'',
        privilege:''
      }
    };
  }


  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        console.log(option)
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
      [events.ui.typeLChange](e) {
        this.setData({
          'model.privilege': e.detail.value
        })
        this.$api.circle.setCommunityPrivilege(this.data.model).then(s =>{
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
          if (s.data.errorCode == '0') {
            this.setData({
              typeList: s.data.result[3].ruleSettingValue == 2 ? [
                { name: '公开', value: '1', explain: '任何人都可以加入圈子，且有机会被小豆包推荐', checked: '' },
                { name: '私密', value: '2', explain: '必须圈主邀请才能加入，成员邀请需圈主审核', checked: 'true' },
              ] : [
                  { name: '公开', value: '1', explain: '任何人都可以加入圈子，且有机会被小豆包推荐', checked: 'true' },
                  { name: '私密', value: '2', explain: '必须圈主邀请才能加入，成员邀请需圈主审核', checked: '' },
                ]
            })
          }
        })
      }
    }
  }
}

EApp.instance.register({
  type: setprivacyPage,
  id: 'setprivacyPage',
  config: {
    events,
    effects,
    actions
  }
});
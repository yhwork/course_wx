// pages/circle/DiariesRules/DiariesRules.js

import regeneratorRuntime from '../../../../lib/runtime'
import { EApp, EPage, PAGE_LIFE } from '../../../../eea/index'
import { events, effects, actions } from './DiariesRules.eea'

class diariesRulesPage extends EPage {
  get data() {
    return {
      currentAction:"请选择",
      actionSheetHidden:true,
      actionSheets: ['无',"不少于30", "不少于50", "不少于100", "不少于200"],
      model: {
        communityId:'', // 圈子ID
        //repeat:0,      // 重复打卡   1允许  0不允许
        //audio:0,       // 日记必须上传录音   1是  0否
        //video:0,       // 日记必须上传视频   1是  0否
        //pic:0,         // 日记必选上传图片   1是  0否
        //mixWords:0     // 日记最少字数限制   
      },
      pageModel: {
        isChecked1: '',
        isChecked2: '',
        isChecked3: '',
        isChecked4: '',
        numRule:''
      }
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
      // 允许一天多次打卡   repeat
      [events.ui.dozensOfCards](e) {
        let hasRepeat;
        if (e.detail.value) {
          // 允许
          hasRepeat = 1;
        } else {
          // 不允许
          hasRepeat = 0;
        }
        this.setData({
          'model.repeat': hasRepeat
        })
        put(effects.saveDiariesRules);
      },
      // 日记上传录音
      [events.ui.diaryUploadAutio](e) {
        let audioParam;
        if (e.detail.value) {
          audioParam = 1;
        } else {
          audioParam = 0;
        } 
        this.setData({
          'model.audio': audioParam
        })
        put(effects.saveDiariesRules);
      },
      // 日记上路视频
      [events.ui.diaryUploadVideo](e) {
        let videoParam;
        if (e.detail.value) {
          videoParam = 1;
        } else {
          videoParam = 0;
        }
        this.setData({
          'model.video': videoParam
        })
        put(effects.saveDiariesRules);
      },
      // 日志上传图片
      [events.ui.diaryUploadPhoto](e) {
        let picParam;
        if (e.detail.value) {
          picParam = 1;
        } else {
          picParam = 0;
        }
        this.setData({
          'model.pic': picParam
        })
        put(effects.saveDiariesRules);
      },
      //选择最少数字：
      [events.ui.shooseAction](e) {
       let min=e.currentTarget.dataset.min
       this.setData({
         currentAction: min,
         actionSheetHidden: true,
         'model.mixWords': min.indexOf("于") >=0?min.split("于")[1]:'0'
       })
        put(effects.saveDiariesRules);
      },
      //隐藏最少字数弹层：
      [events.ui.closeActionSheet](e) {
        this.setData({
          actionSheetHidden:true
        })
      },
      //显示最少字数弹层：
      [events.ui.showActionSheet](e) {
        this.setData({
          actionSheetHidden:false
        })
      },
    }
  }

  mapEffect() {
    return {
      [effects.saveDiariesRules]() {
        this.$api.circle.updateSignInDiaryRule(this.data.model).then(s => {})
      },
      [effects.getCurrentCommunityRule]() {
        let param = { communityId: this.data.model.communityId };
        this.$api.circle.getCommunityRule(param).then(s => {
          if(s.data.errorCode == '0') {
            const resultData = s.data.result;
            this.setData({
              'pageModel.isChecked1': resultData[4].ruleSettingValue == '0' ? '' : 'true',
              'pageModel.isChecked2': resultData[5].ruleSettingValue == '0' ? '' : 'true',
              'pageModel.isChecked3': resultData[6].ruleSettingValue == '0' ? '' : 'true',
              'pageModel.isChecked4': resultData[7].ruleSettingValue == '0' ? '' : 'true',
              'currentAction': '不少于' + resultData[8].ruleSettingValue,
            })
          }
        })
      }
    }
  }
}

EApp.instance.register({
  type: diariesRulesPage,
  id: 'diariesRulesPage',
  config: {
    events,
    effects,
    actions
  }
});
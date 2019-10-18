import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../../eea/index'
import {
  events,
  effects,
  actions
} from './punch.eea'



class punchPage extends EPage {
  get data() {
    return {
      flag:true,
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option){
        this.setData({
          model:option
        })
        put(effects.LOAD_PUNCH)
      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {}
  }

  mapEffect() {
    return {
      [effects.LOAD_PUNCH](){
        this.$api.circle.getCommunityRule(this.data.model).then(res=>{
          let errorCode = res.data.errorCode;
          if (errorCode==0){
            let rule = res.data.result
            this.setData({
              //打卡时间规则 
              signInTimeRule:{
                type: rule[0].ruleSettingValue,
              },
              reSignIn:{
                //补卡设置
                type: rule[1].ruleSettingValue
              },
              signInRepeat:{
                //多打卡
                type: rule[4].ruleSettingValue
              },
              contentRule:{
                //日记文本
                signInUploadAudio: rule[5].ruleSettingValue,
                signInUploadVideo: rule[6].ruleSettingValue,
                signInUploadPicture: rule[7].ruleSettingValue,
                //文本字数
                signInMinWord: rule[8].detailValue
              },
              signinCircle: {
                // 打卡周期
                startTime: rule[9].ruleSettingValue,
                endTime: rule[10].ruleSettingValue
              },
            });
            if (this.data.signInTimeRule.type == 2){
              this.setData({
                //时间段隐藏
                flag:false,
                startTime: rule[0].detailValue.split(',')[0],
                endTime: rule[0].detailValue.split(',')[1]
              });
            }
          }
        })
      },
    }
  }
}

EApp.instance.register({
  type: punchPage,
  id: 'punchPage',
  config: {
    events,
    effects,
    actions
  }
});


// pages/circle/cardTimeSet/cardTimeSet.js
import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../../eea/index'
import {
  events,
  effects,
  actions
} from './cardTimeSet.eea'
var util = require('../../../../lib/util.js');
var time = util.formatTime(new Date());
class cardTimeSetPage extends EPage {
  get data() {
    return {
      hasDisplaySignTime:true,
      typeList: [
        { name: '不限制日期 长期打卡', value: '1', checked:'true' },
        { name: '指定打卡日期、结束日期', value: '2', checked: '' },
      ],
      // 创建学习圈model
      // time: {
      //   communityStartTime: '请选择',  // 开始日期
      //   communityEndTime: '请选择', // 结束日期
      // },
      model: {
        communityId:'',
        timeRule:'',
        signInStartTime:'',
        signInEndTime:'',
        startDate: time, // 开始日期
        endDate: '请选择', // 结束日期
        
      }
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        console.log(option)
        let circleId = option.id;
        this.setData({
          'model.communityId': circleId,
          'model.communityName': option.communityName,
          'model.gender': option.gender,
          'model.masterLogo': option.masterLogo,
          'model.masterRealName': option.masterRealName,
          'model.communityEndDate': option.communityEndDate,
        })
        console.log(this.data.model)
        put(effects.getCommunityRule, {
          circleId
        });
      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      // 开始时间
      // [events.ui.bindTimeChange](e) {
      //   console.log(e.detail.value)
      //   this.setData({
      //     'model.signInStartTime': e.detail.value + ':00',
      //     'time.communityStartTime': e.detail.value,
      //     dateSelect: true
      //   })
      // },

      // 结束时间
      // [events.ui.bindTimeChangeEnd](e) {
      //   console.log(e.detail.value)
      //   this.setData({
      //     'model.signInEndTime':e.detail.value + ':00',
      //     'time.communityEndTime': e.detail.value,
      //     dateSelect: true
      //   })
      // },
      // 开始日期
      [events.ui.bindDateChange](e) {
        this.setData({
          'model.startDate': e.detail.value,
          dateSelect: true
        })
      },

      // 结束日期
      [events.ui.bindEndDateChange](e) {
        this.setData({
          'model.endDate': e.detail.value
        })
        console.log(this.data.model.endDate)
      },
      // 保存修改
      
      [events.ui.submitDataBind](e) {
        if (this.data.model.timeRule == '') {
          wx.showModal({
            title: '提示',
            content: '请选择时间',
          })
          reutrn;
        }
        if ((this.data.model.timeRule == 2) && (this.data.model.endDate == '' || this.data.model.startDate == '')) {
          wx.showModal({
            title: '提示',
            content: '请选择时间',
          })
          return;
        }
      //   this.$api.circle.updateCommunitySignInTimeRule(this.data.model).then(s=>{
      //     wx.showToast({
      //       title: '修改成功',
      //     })
      //     setTimeout(function() {
      //       wx.navigateBack({
              
      //       })
      //     },1000)
      //   })
      // },
      // this.setData({
      //   'model.startDate': this.data.model.communityStartDate,
      //   'model.endDate': this.data.model.communityEndDate
      // })
        console.log(this.data.model)
        if (this.data.model.timeRule==1){
          this.setData({
            'model.endDate': this.data.model.communityEndDate
          })
        }
        this.$api.circle.updateCommunityStartEndDate(this.data.model).then(s => {
         
        wx.showToast({
          title: '修改成功',
        })
        setTimeout(function () {
          wx.navigateBack({

          })
        }, 1000)
      })
    },
      //tab切换
      [events.ui.typeLChange](e) {
        let returnValue = e.detail.value;
        console.log(returnValue)
        if (returnValue == 2){
          this.setData({
            hasDisplaySignTime:false,
            'model.timeRule':returnValue
          })
        }else{
          this.setData({
            hasDisplaySignTime: true,
            'model.timeRule': returnValue,
            'model.signInEndTime': '',
            'model.signInStartTime': ''
          })
        }
      },
    }
  }

  mapEffect() {
    return {
      [effects.getCommunityRule]({
        circleId
      }) {
        let param = { communityId: circleId }
        this.$api.circle.getCommunityRule(param).then(s => {
          if (s.data.errorCode == '0') {
            let signInTimeRule=s.data.result[0];
            console.log(signInTimeRule)
            if (signInTimeRule.ruleSettingValue == '2') {
              let typeData = [
                { name: '不限制日期 长期打卡', value: '1', checked: '' },
                { name: '指定打卡日期、结束日期', value: '2', checked: 'true' },
              ];
              let valString = signInTimeRule.detailValue.toString();
              // 指定时间段
              this.setData({
                typeList: typeData,
                hasDisplaySignTime: false,
                'time.communityStartTime': valString.split(",")[0].split(":")[0] + ':' + valString.split(",")[0].split(":")[1],
                'time.communityEndTime': valString.split(",")[1].split(":")[0] + ':' + valString.split(",")[1].split(":")[1],
                'model.timeRule':2
              })
            } else {
              this.setData({
                'model.timeRule': 1
              })
            }
          }
        })
      }
    }
  }
}

EApp.instance.register({
  type: cardTimeSetPage,
  id: 'cardTimeSetPage',
  config: {
    events,
    effects,
    actions
  }
});


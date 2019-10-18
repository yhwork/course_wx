import regeneratorRuntime from '../../../../lib/runtime'
import { EApp, EPage, PAGE_LIFE } from '../../../../eea/index'
import { events, effects, actions } from './circleAdmin.eea'

class circleAdminPage extends EPage {
  get data() {
    return {
      model: {},
      resultModel:{},
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        console.log(option)
        this.setData({
          model:option
        })
        let param = {};

        let curDate = new Date();
        let currentDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000); //前一天

        let resultDate = '';
        let dateArray = [];
        dateArray.push(currentDate.getFullYear());
        dateArray.push(currentDate.getMonth() + 1);
        dateArray.push(currentDate.getDate());
        resultDate = dateArray.join('-');
                
        param.communityId = this.data.model.id;
        param.queryDate = resultDate;
        this.$api.circle.getCommunityStatisticsByCondition(param).then(s => {
          if (s.data.errorCode == '0') {
            this.setData({
              resultModel:s.data.result
            })
          }
        })
      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      [events.ui.deleteCommunity](){
        let _this = this
        wx.showModal({
          title: '提示',
          content: '解散圈子，该圈子中的所有信息将全部删除，请慎重是否解散圈子',
          success:function() {
            let inputMap = {
              communityId: _this.data.model.id
            }
            _this.$api.circle.deleteCommunity(inputMap).then(res => {
              if (res.data.errorCode == '0') {
                wx.showToast({
                  title: '删除成功',
                })
                wx.switchTab({
                  url: '../../../circle/circle',
                })
              }
            })
          },
          fail: function() {
            wx.showToast({
              title: '删除失败',
            })
          }
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
  type: circleAdminPage,
  id: 'circleAdminPage',
  config: {
    events,
    effects,
    actions
  }
});
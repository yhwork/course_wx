import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../eea/index'
import {
  events,
  effects,
  actions
} from './accumulatePoints.eea'

class accumulatePointsPage extends EPage {
  get data() {
    return {
      list: null,
      totalIntegral: ''
    };
  }


  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        this.$api.mypage.getUserTotalIntegral({}).then(
          (res) => {
            let errorCode = res.data.errorCode;
            console.log(res.data)
            if (errorCode == '0') {
              this.setData({
                'list': res.data.result.list,
                'totalIntegral': res.data.result.totalIntegral
              })
          

            }
          })



      },
      [PAGE_LIFE.ON_SHOW](option) {


      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      [events.ui.CHANGE](e) {
        wx.navigateTo({
          url: '../pointsRule/pointsRule',
        })
      },
      [events.ui.SHOP](e) {
        wx.showModal({
          title: '提示',
          content: '该功能正在开发中，敬请期待！',
          confirmColor: '#f29219',
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
  type: accumulatePointsPage,
  id: 'accumulatePointsPage',
  config: {
    events,
    effects,
    actions
  }
});
// pages/circle/apply/apply.js
import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../../eea/index'
import {
  events,
  effects,
  actions
} from './apply.eea'

class applyPage extends EPage {
  get data() {
    return {
      clockerHihe: true,//打卡者显示或隐藏

    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
    // 打卡者阻止遮罩层下滚动页面
      [events.ui.stopOther](e) {
        return false;
      },
      //显示标签遮罩层
      [events.ui.showLabel](e) {
        this.setData({
          labelHide: false
        })
      },

      //关闭标签遮罩层
      [events.ui.closeLabel](e) {
        this.setData({
          labelHide: true,
          selectMarkIdArray: []
        })
      },

      // 保存选中标签并关闭遮罩层 
      [events.ui.saveMarksAndCloseLabel](e) {
        this.setData({
          labelHide: true,
          'model.communityMark': (this.data.selectMarkIdArray).join(','),
          selectMarkNameArray: this.data.selectMarkNameData
        })
      },

      [events.ui.bindClockerChange](e) {
      },
      // 打卡者
      [events.ui.showClocker](e) {
        this.setData({
          clockerHihe: false
        })
      },

      // 打卡者
      [events.ui.closeClocker](e) {
        this.setData({
          //关闭标签遮罩层
          clockerHihe: true
        })
      },
    }
  }

}

EApp.instance.register({
  type: applyPage,
  id: 'applyPage',
  config: {
    events,
    effects,
    actions
  }
});
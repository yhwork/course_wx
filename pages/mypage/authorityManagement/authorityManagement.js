// pages/mypage/authorityManagement/authorityManagement.js
import { EApp, EPage, PAGE_LIFE } from '../../../eea/index'
import { events, effects, actions } from './authorityManagement.eea'

class authorityManagementPage extends EPage {
  get data() {
    return {
      clockerHide: true,//打卡者显示或隐藏
      paramModel: {},
      pageModel: [],
      deleteParamModel:{}
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        // console.log(option)
        this.setData({
          'paramModel.childId': option.id
        })
        put(effects.loadRelationList);
      },
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      // 孩子共享切换
      [events.ui.dozensOfCards](e) {
        // 共享
        let childId = e.currentTarget.dataset.childid;
        let id = e.currentTarget.dataset.id;
        let edit;
        // 设置分享权限
        if (e.detail.value) {
          edit = "1";
        } else {
          // 取消分享权限    /share/closeChildShareListAuthority
          edit = "0";
        }
        console.log(e.detail.value)
        put(effects.updateChildShareListAuthority, {
          childId, id, edit
        });
      },
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
      // 打卡者 deleteParamModel
      [events.ui.showClocker](e) {
        this.setData({
          clockerHide: false
        })
        this.setData({
          'deleteParamModel.shareId': e.currentTarget.dataset.id,
          'deleteParamModel.childId': e.currentTarget.dataset.childid
        })
      },

      // 打卡者
      [events.ui.closeClockers](e) {
        this.setData({
          //关闭标签遮罩层
          clockerHide: true
        })
        // 删除孩子亲戚
        put(effects.deleteChildRelation);
      },
      // 打卡者
      [events.ui.closeClocker](e) {
        this.setData({
          //关闭标签遮罩层
          clockerHide: true
        })
      }
    }
  }

  mapEffect({
    put
  }) {
    return {
      [effects.loadRelationList]() {
        console.log(this.data.paramModel)
        this.$api.circle.getChildMessageRealtionList(this.data.paramModel).then(s => {
          if(s.data.errorCode == '0') {
            this.setData({
              pageModel: s.data.result.relationList
            })
          }
          console.log(this.data.pageModel)
        })
      },

      [effects.updateChildShareListAuthority]({
        childId, id, edit
      }) {
        let Params = {
          shareId:id,
          childId: childId,
          edit: edit
        }
        // 孩子权限管理
        this.$api.circle.updateChildShareListAuthority(Params).then(s => {})
      },
      
      [effects.deleteChildRelation]() {
        this.$api.circle.deleteChildShareAuthority(this.data.deleteParamModel).then(s => {
          if (s.data.errorCode == '0') {
              put(effects.loadRelationList);
          }
        })
      }
    }
  }
}

EApp.instance.register({
  type: authorityManagementPage,
  id: 'authorityManagementPage',
  config: {
    events,
    effects,
    actions
  }
});

import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../../eea/index'
import {
  events,
  effects,
  actions
} from './complain.eea'

class complainPage extends EPage {
  get data() {
    return {
      reason_list: [{
          unSelect: true,
          reason: '垃圾营销'
        },
        {
          unSelect: true,
          reason: '淫秽信息'
        },
        {
          unSelect: true,
          reason: '违法信息'
        },
        {
          unSelect: true,
          reason: '人身攻击'
        },
        {
          unSelect: true,
          reason: '有害信息'
        },
        {
          unSelect: true,
          reason: '恶言恶语'
        },
        {
          unSelect: true,
          reason: '其他'
        },

      ],
      contents: [],
      contentIds: [],
      otherText: [],
      param: {
        "contents": []
      },
      complainType: ''
    };
  }


  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        console.log(option)
        this.setData({
          "param.signInId": parseInt(option.signInId),
          "param.communityId": parseInt(option.communityId),
          complainType: option.type,
        })
      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      //选择原因
      [events.ui.reasonSelect](e) {
        var unselect = e.currentTarget.dataset.unselect;
        var idx = e.currentTarget.dataset.idx;
        var unSelect = "reason_list[" + idx + "].unSelect";
        var tempContentIds = this.data.contentIds;
        if (unselect) {
          // 选中
          tempContentIds = tempContentIds.concat(idx);
          this.setData({
            [unSelect]: false,
            contentIds: tempContentIds
          })
        } else {
          // 取消选中
          for (var i = 0; i < tempContentIds.length; i++) {
            if (tempContentIds[i] == idx) {
              tempContentIds.splice(i, 1);
            }
          }
          this.setData({
            [unSelect]: true,
            contentIds: tempContentIds
          })
        }
      },
      // 获取‘其他’的输入内容
      [events.ui.bindinput](e) {
        this.setData({
          otherText: e.detail.value
        })
      },
      // 提交表单
      [events.ui.submitBtn]() {
        put(effects.submitComplain);
      }
    }
  }

  mapEffect() {
    return {
      [effects.submitComplain]() {
        var tempContents = [];
        var tempContentIds = this.data.contentIds;
        for (var i = 0; i < tempContentIds.length; i++) {
          var id = tempContentIds[i];
          var text1 = this.data.reason_list[id].reason;
          var text2 = this.data.otherText;

          if (this.data.reason_list[id].reason == "其他") {
            if (text2.length > 0) {
              tempContents = tempContents.concat('"' + text2 + '"');
              console.log(tempContents)
            } else {
              wx.showToast({
                title: '其他不能为空',
                icon: 'none',
                duration: 2000
              })
              return
            }
          } else {
            tempContents = tempContents.concat('"' + text1 + '"');
          }
        }
        this.setData({
          "param.contents": tempContents,
        })

        if (tempContents.length == 0) {
          wx.showToast({
            title: '投诉原因不能为空',
            icon: 'none',
            duration: 2000,
          })
          return;
        }

        if (this.data.complainType == 'circle') {

          let inputMap = {
            communityId: this.data.param.communityId,
            contents: this.data.param.contents,
          }
          // console.log(inputMap)
          this.$api.circle.reportCommunity(inputMap).then((res) => {
            // console.log(res.data)
            var errorCode = res.data.errorCode;
            if (errorCode == "0") {
              showMsg("投诉成功");
            } else if (errorCode == "100065") {
              showMsg('你已经投诉过当前圈子，请不要重复提交')
            }
          });
        } else {
          console.log(this.data.param)
          this.$api.circle.reportSignIn(this.data.param).then((res) => {
            var errorCode = res.data.errorCode;
            if (errorCode == "0") {
              showMsg("投诉成功");
            } else if (errorCode == "100065") {
              showMsg('你已经投诉过当前日记，请不要重复提交')
            }
          });
        }

      },
    }
  }
}

EApp.instance.register({
  type: complainPage,
  id: 'complainPage',
  config: {
    events,
    effects,
    actions
  }
});

function showMsg(msg) {
  wx.showToast({
    title: msg,
    icon: 'none',
    duration: 2000,
  })
  setTimeout(function() {
    wx.navigateBack({
      changed: true
    })
  }, 1500)
}
import regeneratorRuntime from '../../../../lib/runtime'
import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../../eea/index'
import {
  events,
  effects,
  actions
} from './personalPage.eea'

const that = this;

class personalPage extends EPage {
  get data() {
    return {
      possiblePersonParam: {
        currentPage: 1,
        pageSize:15
      }, // 参数 - 可能人数的人
      attentionModel: {}, // 参数 - 关注
      possiblePersonList: null,
      clickid: null, // 当前点击的关注按钮的id
    };
  }


  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        put(effects.loadUserInfo); // 获取可能认识的人列表 
      },
      [PAGE_LIFE.ON_PULL_DOWN_REFRESH](option) {
        console.log(option)
        this.setData({
          'possiblePersonParam.currentPage': 1
        });
        put(effects.loadUserInfo); // 获取可能认识的人列表 
      },
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      // 关注
      [events.ui.focus](e) {
        var id = e.currentTarget.dataset.id;
        var index = e.currentTarget.dataset.index;
        var flag = e.currentTarget.dataset.flag; // flag == 0 未关注 1已关注

        var itemColor = 'possiblePersonList[' + index + '].color';
        var itemText = 'possiblePersonList[' + index + '].text';
        var itemFlag = 'possiblePersonList[' + index + '].flag';

        if (flag == 0) {
          this.setData({
            'attentionModel.fansUserId': e.currentTarget.dataset.id,
            [itemColor]: '#BEBEBE',
            [itemText]: '已关注',
            [itemFlag]: 1,
          })
        } else {
          this.setData({
            'attentionModel.fansUserId': e.currentTarget.dataset.id,
            [itemColor]: '',
            [itemText]: '关注',
            [itemFlag]: 0,
          })
        }
        put(effects.updateFocusStatus, {id});
      },
      // 翻页
      [events.ui.nextPage](e) {
        this.setData({
          'possiblePersonParam.currentPage': this.data.possiblePersonParam.currentPage + 1
        });
        put(effects.loadUserInfo);
        console.log(this.data.possiblePersonParam)
      },
      // 点击头像进入这个人的主页
      [events.ui.HOMEPAGE](e) {
        console.log(e.currentTarget.dataset.id)
        wx.navigateTo({
          url: '../../../mine/mine?visitId=' + e.currentTarget.dataset.id,
        })
      },
    }
  }

  mapEffect() {
    return {
      [effects.loadUserInfo]() {
        this.$api.circle.getCommunityPossiblePerson(this.data.possiblePersonParam).then((res) => {
          let errorCode = res.data.errorCode;
          if (errorCode == '0') {
            let list = res.data.result.possibleList;
            if (this.data.possiblePersonParam.currentPage == 1) {
              // 第一页
              this.setData({
                'possiblePersonList': list
              })
            } else {
              // 大于第一页
              this.data.possiblePersonList = this.data.possiblePersonList.concat(list);
            }
            // console.log(this.data.possiblePersonList)
            for (var i = 0; i < this.data.possiblePersonList.length; i++) {
              var color = 'possiblePersonList[' + i + '].color';
              var text = 'possiblePersonList[' + i + '].text';
              var flag = 'possiblePersonList[' + i + '].flag';
              if (this.data.possiblePersonList[i].nick_name== null){
                this.data.possiblePersonList.splice(i, 1)
              }
              this.setData({
                possiblePersonList:this.data.possiblePersonList
              })
              // console.log(this.data.possiblePersonList)
              this.setData({
                [color]: '',
                [text]: '关注',
                [flag]: 0, // flag == 0 代表没关注
              })
              
            }
          } else if (errorCode == '100006') {
            // 无数据
          } else {
            // 网络请求超时，请稍后再试
          }
        });
      },
      [effects.updateFocusStatus]({id}) {
        this.setData({
          "attentionModel.targetUserId" : id
        })
        this.$api.circle.updateCommunityFansStatus(this.data.attentionModel).then((res) => {
          let errorCode = res.data.errorCode;
          if (errorCode == '0') {
            var status = res.data.result.status;
            wx.showToast({
              title: status,
            })
            if (status == '关注成功') {
              var s = 'focus_text_color' + this.data.attentionModel.index;
              console.log(s)
              this.setData({
                [s]: '#BEBEBE'
              })
            } else {
              this.setData({
                [s]: ''
              })
            }
          } else if (errorCode == '100006') {
            // 无数据
          } else {
            // 网络请求超时，请稍后再试
          }
        });
      },
    }
  }
}

EApp.instance.register({
  type: personalPage,
  id: 'personalPage',
  config: {
    events,
    effects,
    actions
  }
});
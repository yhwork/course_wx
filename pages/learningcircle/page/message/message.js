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
} from './message.eea'

const that = this;

class MessagePage extends EPage {
  get data() {
    return {
      list: null,
      updateParam : {},
    };
  }


  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        put(effects.load_message_list);
      },
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      [events.ui.message_info](e){
        this.setData({
          'updateParam.id': e.currentTarget.dataset.id,
          'updateParam.refid': e.currentTarget.dataset.refid
        })
        put(effects.updateUnreadMessageInfo);
      }
    }
  }

  mapEffect() {
    return {
      [effects.load_message_list]() {
        this.$api.message.getUnreadMessageInfo({}).then((res) => {
          let errorCode = res.data.errorCode;
          if (errorCode == '0') {
            this.setData({
              'list': res.data.result
            })
            // 获取图片全路径
            for (var i = 0; i < this.data.list.length; i++) {
              var test = 'list[' + i + '].img';
              this.setData({
                [test]: this.$api.extparam.getFileUrl(this.data.list[i].logo)
              })
            }
            console.log(this.data)
          } else if (errorCode == '100006') {
            // 无数据
          } else {
            // 网络请求超时，请稍后再试
          }
        });
      },
      [effects.updateUnreadMessageInfo]() {
        this.$api.circle.updateUnreadMessageInfo(this.data.updateParam).then((res) => {
          let errorCode = res.data.errorCode;
          if (errorCode == '0') {
            wx:wx.navigateTo({
          url: '../diaryDetail/diaryDetail?id=' + this.data.updateParam.refid,
        })
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
  type: MessagePage,
  id: 'MessagePage',
  config: {
    events,
    effects,
    actions
  }
});
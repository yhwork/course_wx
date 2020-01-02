// import regeneratorRuntime from '../../lib/runtime'
import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../../eea/index'
import {
  events,
  effects,
  actions
} from './qrcode.eea'

const that = this;
// const audioPlay = require("../../lib/audioPlay");
class qrcodes extends EPage {
  get data() {
    return {
      selected: true,
      inputMap: {
        currentPage: 1,
        pageSize: 1000
      },
      diaryList: [],
      progress: 0,
      value: '',
      childInfo:''
    };
  }


  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        console.log(option)
        this.setData({
          value: option.val
        })
        // 调用其他方法
        // put(effects.GETALL_CHILD_LIST)
        // put(effects.GETALL_DIARY_LIST)
        // this.setData({
        //   img: this.$api.extparam.getPageImgUrl('boyb'),
        // })
      },
    }
  }
  // 界面ui事件
  mapUIEvent({
    put
  }) {
    return {
      // 事件需要注册
      [events.ui.CHOOSE](e) {
        console.log(e.currentTarget.dataset.id, e.currentTarget.dataset.type)
        this.setData({
          idxs: e.currentTarget.dataset.index
        })
        if (e.currentTarget.dataset.type == '1') {

          this.setData({
            'inputMap.childId': e.currentTarget.dataset.id
          })
          console.log(this.data.inputMap)
        } else {
          this.setData({
            inputMap: {
              currentPage: 1,
              pageSize: 1000
            },
          })
        }
        // put(effects.GETALL_DIARY_LIST)
      },
      // 同意
      [events.ui.btnOk](e) {
        let data = e.currentTarget.dataset.value;
        console.log(data,e)
        if (data=='true'){
          // 同意
          console.log('同意')
          put(effects.ADREE_OK,data)
        }else{
          // 拒绝
          console.log('拒绝')
          wx.showToast({
            title: '拒绝授权',
            icon: 'node',
            duration: 1500,
          })
        }
          // 发送请求OK
      },
      // 右下角键盘完成
      [events.ui.btninputOKs](e) {
        this.$storage.set('valname', this.data.value);
        // wx.redirectTo({
        //   url: 'pages/mypage/editMyChild/editMyChild?vals=' + this.data.value
        // })
        wx.navigateBack({
          delta: 1,
        })
      },
      [events.ui.btninputOK](e) {
        if (e.detail.value == undefined) {
          // 通过点击保存 跳转
          wx.navigateBack({
            delta: 1, 
          })
          this.$storage.set('valname', this.data.value);
        } else {
          var vals = e.detail.value;
          this.setData({
            value: vals
          })
          this.$storage.set('valname', this.data.value);
        }

      }
    }
  }
  // 请求
  mapEffect() {
    return {
      // 发送请求
      async [effects.GETALL_CHILD_LIST]() {
        this.$api.child.getChildListByCondition({}).then(res => {
          this.setData({
            childList: res.data.result.childList,
            theindex: res.data.result.childList.length
          })
          // console.log(res.data.result.childList)
        })
      },
      // 同意请求
      [effects.ADREE_OK](data){
        // 发送请求
        console.log('请求', data)
        wx.showToast({
          title: '授权成功',
          icon: 'node',
          duration:1500,
        })
        this.$api.circle.getqrcode({}).then((res) => {
          let errorCode = res.data.errorCode;
          if (errorCode == '0') {
            // 1绑定 0未绑
            console.log(res)
          }else{

          }
        });
      },
    }
  }
}

EApp.instance.register({
  type: qrcodes,
  id: 'qrcodes',
  config: {
    events,
    effects,
    actions
  }
});
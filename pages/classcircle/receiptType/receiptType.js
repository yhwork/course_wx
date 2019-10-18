// classPage
import regeneratorRuntime from '../../../lib/runtime'
import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../eea/index'
import {
  events,
  effects,
  actions
} from './receiptType.eea'
class receiptType extends EPage {
  get data() {
    return {
      receiptType: [{
        type: '同意/不同意',
        id: 0,
        checked: false
      }, {
        type: '已阅',
        id: 1,
        checked: false
      }, {
        type: '参加/不参加',
        id: 2,
        checked: false
      }, {
        // img:'../../../assets/img/editor.png',
        type: '信息回执',
        id: 3,
        checked: false,
      }]
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        
        wx.getStorage({
          key: 'myclassid',
          success: (res)=> {
            console.log(res.data)
            this.setData({
                classId:res.data
            })
          },
        })
        wx.getStorage({
          key: 'idx',
          success: (res)=> {
            this.setData({
              type:res.data
            })
          },
          
        })
        put(effects.GETMSG)
      },
      [PAGE_LIFE.ON_SHOW](option) {}
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      [events.ui.CHOOSETYPE](e) {
        console.log(e.detail.value)
        let typelist = parseInt(e.detail.value) + parseInt(1)
        this.setData({
          'model.receiptType': typelist,
          'previewMsg.receiptType': typelist
        })
        console.log('表单数据',this.data.model, this.data.previewMsg)
        this.$storage.set('previewMsg', this.data.previewMsg)
        this.$storage.set('submitMsg', this.data.model)
      },
      [events.ui.ADDRECEIPT](e) {
        if (!this.data.model.receiptType || !this.data.previewMsg.receiptType){
          this.$common.showMessage(this, '请选择回执方式')
          return;
        }
        // console.log(e.detail.target.dataset.type)
        let type = e.detail.target.dataset.type
        console.log('在哪个班级发的',this.data.classId)
        if (type == 1) {   // 通知预览
          wx.navigateTo({
            url: '../preview/preview?type=' + this.data.type + '&classId=' + this.data.classId,
          })
        } else {    // 发布
          put(effects.addClassNotify)
        }

      }
    }
  }

  mapEffect({
    put
  }) {
    return {
      [effects.GETMSG]() {
        let that = this
        this.$storage.get('previewMsg').then(res => {
          that.setData({
            'previewMsg': res.data
          })
          this.data.previewMsg.receiptType = 0
          this.setData({
            previewMsg: this.data.previewMsg
          })
        })
        this.$storage.get('submitMsg').then(res => {
          that.setData({
            'model': res.data
          })
          this.data.model.receiptType = 0
          this.setData({
            model: this.data.model
          })
        })
      },
      // 发布
      [effects.addClassNotify]() {
        let inputMap = this.data.model
        console.log(inputMap)
        this.$api.class.addClassNotify(inputMap).then(res => {

          console.log(res.data)
          if (res.data.errorCode == 0) {
            // wx.setStorageSync('idx', this.data.type)
            // wx.navigateBack({
            //   delta: 2
            // })
            
            // 返回班级信息列表
            wx.showToast({
              title: '发布成功',
              icon: 'success',
              image: '',
              duration: 1500,
              mask: true,
              success: (res)=> {
                wx.redirectTo({
                  url: '../classMsg/classMsg?classId=' + this.data.classId + '&role=' + 1 + '&idx=0',
                })
              },
              fail: function(res) {},
              complete: function(res) {},
            })
          }
        })
      }
    }
  }
}

EApp.instance.register({
  type: receiptType,
  id: 'receiptType',
  config: {
    events,
    effects,
    actions
  }
});
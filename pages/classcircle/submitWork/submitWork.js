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
} from './submitWork.eea'
class submitwork extends EPage {
  get data() {
    return {
      workId: '',
      type:'',
      imgNum: 9,
      imgList: [],
      imgContent: [],
      audioNum: 1,
      audioList: [],
      audioContent: [],
      isSpeaking: true,
      startSpeak: false,
      videoNum: 1,
      videoList: [],
      videoContent: [],
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        console.log(option)
        this.setData({
          workId: option.workId,
          type: option.type
        })
        put(effects.GETWORKMSG)

      },
      [PAGE_LIFE.ON_SHOW](option) {
        
      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      //显示地图
      // [events.ui.showMap](e) {
      //   var that = this;
      //   this.setData({
      //     mapHide: false
      //   })
      //   wx.chooseLocation({
      //     success: function (res) {
      //       // success
      //       console.log(res, "location")
      //       that.setData({
      //         hasLocation: true,
      //         location: {
      //           longitude: res.longitude,
      //           latitude: res.latitude
      //         },
      //         mapHide: true,
      //         detail_info: res.address,
      //         wd: res.latitude,
      //         jd: res.longitude
      //       })
      //     },
      //     fail: function () {
      //       console.log('拒绝授权')
      //     },
      //     complete: function () {
      //       // complete
      //     }
      //   })
      // },

      



    }
  }

  mapEffect({
    put
  }) {
    return {
      
    }
  }
}

EApp.instance.register({
  type: submitwork,
  id: 'submitwork',
  config: {
    events,
    effects,
    actions
  }
});
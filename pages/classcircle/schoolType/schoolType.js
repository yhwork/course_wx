
import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../eea/index'
import {
  events,
  effects,
  actions
} from './schoolType.eea'
class schoolType extends EPage {
  get data() {
    return {
      userinfo: {},
      schoolList:[{
        value:'全日制学校',
        idx:0,
        checked:true
      },
      {
        value:'非全日制学校',
        idx:1,
        checked:false
      }],
      schoolType:0
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        this.setData({
          img: this.$api.extparam.getPageImgUrl('set_tearch')
        }) 
      },
      [PAGE_LIFE.ON_SHOW](option) {
        wx.removeStorage({
          key: 'subjectinfo'
        })
      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      [events.ui.CHOOSETYPE](e){
        console.log(e.currentTarget.dataset.idx)
        this.setData({
          schoolType: e.currentTarget.dataset.idx
        })
      },
      [events.ui.NAXT](e){
        console.log(e.currentTarget.dataset.idx)
        wx.redirectTo({
          url: '../addClass/addClass?schoolType=' + this.data.schoolType
        })
      },
      [events.ui.rediochange](e){
        console.log(e.detail.value)
        this.setData({
          schoolType: e.detail.value
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
  type: schoolType,
  id: 'schoolType',
  config: {
    events,
    effects,
    actions
  }
});
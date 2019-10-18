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
} from './searchClass.eea'
class searchClass extends EPage {
  get data() {
    return {
      classLists: [],
      childId: ''
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        console.log(option)
        if (option.childId) {
          this.setData({
            childId: option.childId
          })
        }
        put(effects.USERINFO)
      },
      [PAGE_LIFE.ON_SHOW](option) {}
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      [events.ui.inputvalue](e) {
        console.log(e.detail.value)
        this.setData({
          value: e.detail.value
        })
      },
      [events.ui.searchClass]() {
        console.log(this.data.value)
        this.setData({
          'tishi':'',
          classLists: [],
        })
        put(effects.SEARCHCLASS)
      },
      [events.ui.GO_MYCLASS](e) {
        console.log(e.currentTarget.dataset.classid)
        wx.navigateTo({
          url: '../classMsg/classMsg?classId=' + e.currentTarget.dataset.classid + '&childId=' + this.data.childId + '&role=' + this.data.userinfo.role,
        })

      }
    }
  }

  mapEffect() {
    return {
      [effects.USERINFO]() {
        this.$api.user.gerUserInfo({}).then(res => {
          this.setData({
            userinfo: res.data.result,

          })
          console.log(this.data.userinfo)
        })
      },
      [effects.SEARCHCLASS]() {
        let inputMap = {
          classId: this.data.value
        }
        this.$api.class.searchClass(inputMap).then(res => {
          console.log(res)
          if (res.data.errorCode==0){
            this.setData({
              classLists: [res.data.result]
            })
          }else{
            this.setData({
              'tishi':'没有搜索到该班级哦~'
            })
          }
          
          console.log(this.data.classLists)
        })
      }

    }
  }
}

EApp.instance.register({
  type: searchClass,
  id: 'searchClass',
  config: {
    events,
    effects,
    actions
  }
});
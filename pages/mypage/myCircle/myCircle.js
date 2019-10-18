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
} from './myCircle.eea'

const that = this;

class myCircle extends EPage {
  get data() {
    return {
      selected: true,
      inputMap: {
        currentPage: 1,
        pageSize: 1000,
        isHistory: false
      }
    };
  }


  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        console.log(option)
        this.setData({
          users: option.userId,
          userImg: option.userImg,
          userName: option.userName,
          idx:1000
        })
        console.log(option.userId,this.data.users)
        put(effects.GETALL_CHILD_LIST)
        put(effects.GETALL_CIRLE_LIST)
        this.setData({
          img: this.$api.extparam.getPageImgUrl('boyb'),
        })
      },
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      [events.ui.SELECD]() {
        this.setData({
          selected: !this.data.selected,
          'inputMap.isHistory': !this.data.inputMap.isHistory
        })
        put(effects.GETALL_CIRLE_LIST)
        console.log(this.data.selected)
      },
      [events.ui.CHOOSE](e) {
        console.log(this.data.idx, e.currentTarget.dataset.index)
        this.setData({
          idx: e.currentTarget.dataset.index
        })
        if (e.currentTarget.dataset.type=='1') {
          this.setData({
            'inputMap.childId': e.currentTarget.dataset.id
          })
        }else{
          this.setData({
            'inputMap.childId': ''
          })
        }

        put(effects.GETALL_CIRLE_LIST)
      }
    }
  }

  mapEffect() {
    return {
      [effects.GETALL_CIRLE_LIST]() {
        // /learn/community/getMyAllCommunityList
        this.$api.circle.getMyAllCommunityList(this.data.inputMap).then(res => {
          this.setData({
            circleList: res.data.result
          })
          console.log(this.data.circleList)
        })
      },
      // 获取孩子
      async [effects.GETALL_CHILD_LIST]() {
        this.$api.child.getChildListByCondition({}).then(res => {

          this.setData({
            childList: res.data.result.childList,
            theindex: res.data.result.childList.length
          })
          console.log(res.data.result.childList)
        })
      }
    }
  }
}

EApp.instance.register({
  type: myCircle,
  id: 'myCircle',
  config: {
    events,
    effects,
    actions
  }
});
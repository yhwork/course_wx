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
} from './upinputs.eea'

const that = this;
// const audioPlay = require("../../lib/audioPlay");
class upInputs extends EPage {
  get data() {
    return {
      selected: true,
      inputMap: {
        currentPage: 1,
        pageSize: 1000
      },
      diaryList: [],
      progress: 0,
      value:'',
      resultModel:{}
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        console.log(option)
        this.setData({
          value:option.val
        })

        // 读取缓存
        this.setData({
          resultModel: wx.getStorageSync("resultModel")
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
      // 右下角键盘完成
      [events.ui.btninputOKs](e) {
        console.log('名字',this.data.value) 
        let myparams ={
          name: this.data.value
        }
        this.$storage.set('resultModel', Object.assign(this.data.resultModel, myparams));
        wx.navigateBack({
          delta: 1,
        })
      },
      [events.ui.btninputOK](e){
        if(e.detail.value==undefined){
          // 通过点击保存 跳转
          wx.navigateBack({
            delta: 1,
          })
          // // 合并缓存数据
          // wx.setStorage({
          //   key: 'resultModel',
          //   data: Object.assign(this.data.resultModel, { name: vals }),
          // })
        }else{
          var vals = e.detail.value;
          this.setData({
            value: vals
          })
          // 合并缓存数据
          // 合并缓存数据
          wx.setStorage({
            key: 'resultModel',
            data: Object.assign(this.data.resultModel, { name: vals }),
          })
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
      }
    }
  }
}


EApp.instance.register({
  type: upInputs,
  id: 'upInputs',
  config: {
    events,
    effects,
    actions
  }
});

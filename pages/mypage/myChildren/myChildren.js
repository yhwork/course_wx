import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../eea/index'
import {
  events,
  effects,
  actions
} from './myChildren.eea'

class myChildrenPage extends EPage {
  get data() {
    return {
      resultModel: {},
      isdata:false
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        console.log('值',option)
        put(effects.loadMyChildrens);
        this.setData({
          boy: this.$api.extparam.getPageImgUrl('boyb'),
          girl: this.$api.extparam.getPageImgUrl('girlb')
        })
      },
      [PAGE_LIFE.ON_SHOW](option) {
        put(effects.loadMyChildrens);
        wx: wx.removeStorageSync('model.comeFrom');
        wx: wx.removeStorageSync('schoolinfo.name');
        wx: wx.removeStorageSync('schoolinfo.city');
        wx: wx.removeStorageSync('schoolinfo.typecode');
        wx: wx.removeStorageSync('schoolinfo.schoolid');
      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      [events.ui.bindAddChild](e) {
        // 跳转到添加孩子页面
        wx.navigateTo({
          url: '../../register/info/p_info?comeFrom=addChild',
        })
      },
      [events.ui.bindClildEdit](e) {
        // console.log(e.currentTarget.dataset.whochild) + '&whoChild=' + e.currentTarget.dataset.whochild
        wx.navigateTo({
          url: '../editMyChild/editMyChild?childId=' + e.currentTarget.dataset.childid +'&manage=false',
        })
      }
    }
  }

  mapEffect({
    put
  }) {
    return {
      [effects.loadMyChildrens]() {
        this.$api.circle.getChildListByCondition({}).then(s => {
          console.log(s.data.result.childList)
          if (s.data.errorCode == '0') {
            let childData = s.data.result.childList;
            for (let i = 0; i < childData.length; i++) {
              let myShare = null;
              let myShareList = [];
              let shareMe = null;
              let shareMeList = [];
              if ((childData[i].logo == null) || ((childData[i].logo.toString().indexOf("http") < 0) &&
                (childData[i].logo.toString().indexOf("png") < 0) && (childData[i].logo.toString().indexOf("jpg") < 0))) {
                if (childData[i].gender==0){
                  childData[i].logo = this.data.boy;
                }else{
                  childData[i].logo = this.data.girl;
                }
                
              }
              // if (childData[i].shareMeUser!=null){
              //   childData[i].myShareUser=null
              // }
              if (childData[i].myShareUser != null && childData[i].shareMeUser == null) {
                myShare = childData[i].myShareUser.split(',')
                for (let j = 0; j < myShare.length; j++) {
                  myShareList.push(myShare[j].split('|')[1])
                }
                childData[i].myShareUser = myShareList
              } else if (childData[i].myShareUser == null && childData[i].shareMeUser != null) {
                shareMe = childData[i].shareMeUser.split(',')
                for (let j = 0; j < shareMe.length; j++) {
                  shareMeList.push(shareMe[j].split('|')[1])
                }
                childData[i].shareMeUser = shareMeList
              }
            }
            if(childData.length>0){
              this.setData({
                isdata:true
              }) 
            }else{
             
              this.setData({
                isdata:false
              }) 
            }
            this.setData({
              resultModel: childData
            })
            // console.log(this.data.resultModel)
          }
        })
      }
    }
  }
}

EApp.instance.register({
  type: myChildrenPage,
  id: 'myChildrenPage',
  config: {
    events,
    effects,
    actions
  }
});
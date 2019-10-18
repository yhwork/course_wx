import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../eea/index'
import {
  events,
  effects,
  actions
} from './myFans.eea'

class myFansPage extends EPage {
  get data() {
    return {
      selected: true,
      selected1: false,
      model: {
        pageSize: 1000,
        currentPage: 1
      },
      resultModel: {},
      winH: '',
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        this.setData({
          img: this.$api.extparam.getPageImgUrl('boyb'),
        })
        console.log(option.type)
        if (option.type == 'fan') {
          wx:wx.setNavigationBarTitle({
            title: '我的粉丝',
          })
          this.setData({
            sele: true,
            seled: false,
            selected1: true,
            selected: false
          })
        }
        let that = this;
        wx.getSystemInfo({
          success: function(res) {
            that.setData({
              winH: res.windowHeight
            })
          },
        });
        put(effects.loadMyFansData);
        put(effects.loadMyAttentionData);
        
      },
      [PAGE_LIFE.ON_SHOW]() {
        put(effects.loadMyFansData);
        put(effects.loadMyAttentionData);
      }
    }
  }
  mapUIEvent
  mapUIEvent({
    put
  }) {
    return {
      [events.ui.attentionOrNot](e) {
        // let fansId = e.currentTarget.dataset.fansid;
        // put(effects.updateCommunityFansStatus,{
        //   fansId
        // });
        // let attentionId = e.currentTarget.dataset.fansid;
        var self = this;
        wx.showModal({
          title: '确定不关注此人!',
          content: '请考虑一下',
          confirmColor: '#f29219',
          // cancelColor: '#007aff',
          confirmText: '确认',
          cancelText: '取消',
          success: function(res) {
            let fansId = e.currentTarget.dataset.fansid;
            put(effects.updateCommunityFansStatus, {
              fansId
            });
          }
        })
      },
      [events.ui.fansOrNot](e) {
        let fansId = e.currentTarget.dataset.fansid;
        put(effects.updateCommunityFansStatus, {
          fansId
        });
        // let attentionId = e.currentTarget.dataset.fansid;
      },
      [events.ui.SELECD_ATTENTION](e) {
        this.setData({
          sele: true,
          seled: false
        })

      },

      [events.ui.SELECD](e) {
        this.setData({
          selected1: true,
          selected: false
        })
        wx: wx.setNavigationBarTitle({
          title: '我的粉丝',
        })
      },
      [events.ui.SELECDS](e) {
        this.setData({
          selected1: false,
          selected: true
        })
        wx: wx.setNavigationBarTitle({
          title: '我的关注',
        })
      },

      [events.ui.PAGEPLUS](e) {
        let currentPage = this.data.model.currentPage + 1;
        this.setData({
          'model.currentPage': currentPage
        })
        put(effects.loadMyFansData);
        put(effects.loadMyAttentionData);
      },
    }
  }

  mapEffect({
    put
  }) {
    return {
      [effects.loadMyFansData]() {
        this.$api.circle.loadMyFansData(this.data.model).then(s => {
          console.log(s)
          if (s.data.errorCode == '0') {
            if (this.data.model.currentPage == 1) {
              // console.log(111111)
              this.setData({
                resultModel: s.data.result.fansList
              })
            } else {
              // console.log(111111)
              this.setData({
                resultModel: this.data.resultModel.concat(s.data.result.fansList)
              })
            }
            for (let i = 0; i < this.data.resultModel.length; i++) {
              if ((this.data.resultModel[i].logo == null) || ((this.data.resultModel[i].logo.indexOf("http") < 0) &&
                  (this.data.resultModel[i].logo.indexOf("png") < 0) && (this.data.resultModel[i].logo.indexOf("jpg") < 0))) {
                this.data.resultModel[i].logo = this.data.img;
              }
            }
            this.setData({
              resultModel: this.data.resultModel
            })
            console.log(this.data.resultModel)
          }
        })
      },
      [effects.updateCommunityFansStatus]({
        fansId
      }) {
        let param = {
          targetUserId: fansId
        }
        this.$api.circle.updateCommunityFansStatus(param).then(s => {
          if (s.data.errorCode == '0') {
            this.setData({
              'model.currentPage': 1
            })
            put(effects.loadMyFansData);
            put(effects.loadMyAttentionData);
          }
          console.log(this.data)
        })
      },
      // 关注
      [effects.loadMyAttentionData]() {
        this.$api.circle.getMyAttentionList(this.data.model).then(s => {
          if (s.data.errorCode == '0') {
            if (this.data.model.currentPage == 1) {
              this.setData({
                resultModelAttention: s.data.result.attentionList
              })
            } else {
              this.setData({
                resultModelAttention: this.data.resultModelAttention.concat(s.data.result.attentionList)
              })
            }
            for (let i = 0; i < this.data.resultModelAttention.length; i++) {
              if ((this.data.resultModelAttention[i].logo == null) || ((this.data.resultModelAttention[i].logo.indexOf("http") < 0) &&
                  (this.data.resultModelAttention[i].logo.indexOf("png") < 0) && (this.data.resultModelAttention[i].logo.indexOf("jpg") < 0))) {
                this.data.resultModelAttention[i].logo = this.data.img;
              }
            }
            this.setData({
              resultModelAttention: this.data.resultModelAttention
            })
            console.log(this.data.resultModelAttention)
          }
        })
      } //关注
    }
  }
}

EApp.instance.register({
  type: myFansPage,
  id: 'myFansPage',
  config: {
    events,
    effects,
    actions
  }
});
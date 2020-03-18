import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../eea/index'
import {
  events,
  effects,
  actions
} from './category.eea'

class CategoryPage extends EPage {
  get data() {
    return {
      model: {
        comefrom: 'teacher'
      },
      haveZD: false
    };
  }


  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        if (typeof option.comefrom != 'undefined') {
          this.setData({
            'model.comefrom': option.comefrom
          })
        }

      },
      [PAGE_LIFE.ON_SHOW]() {
        put(effects.GETSUBJECT);

      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      // //选择一级
      // [events.ui.SELECT_LEVEL1](e) {
      //   const index = e.currentTarget.dataset.index
      //   this.setData({
      //     'model.id': e.currentTarget.dataset.id,
      //     'model.name': e.currentTarget.dataset.name,
      //     index: index,
      //     level1name: e.currentTarget.dataset.name,
      //     level2name: '请选择',
      //     level3name: '请选择',
      //     level3: []
      //   });
      //   if (typeof this.data.level1[index].childList != 'undefined' && this.data.level1[index].childList.length > 0) {
      //     this.setData({
      //       level2: this.data.level1[index].childList
      //     })
      //   } else {
      //     console.log(222)
      //     console.lopg(this.data.model.comefrom)
      //     this.$storage.set('subjectinfo', this.data.model);
      //     if (this.data.model.comefrom == 'teacher') {
      //       wx.navigateTo({
      //         url: '../register/info/t_info'
      //       });
      //     } else if (this.data.model.comefrom == 'personalInfo') {
      //       wx.navigateTo({
      //         url: '../mypage/personalInfo/personalInfo'
      //       });
      //     } 
      //   }
      // },
      // //选择二级
      // [events.ui.SELECT_LEVEL2](e) {
      //   const index = e.currentTarget.dataset.index
      //   this.setData({
      //     'model.id': e.currentTarget.dataset.id,
      //     'model.name': e.currentTarget.dataset.name,
      //     index: index,
      //     level2name: e.currentTarget.dataset.name,
      //     level3name: '请选择',
      //     level3: []
      //   });
      //   if (typeof this.data.level2[index].childList != 'undefined' && this.data.level2[index].childList.length > 0) {
      //     this.setData({
      //       level3: this.data.level2[index].childList
      //     })
      //   } else {
      //     this.$storage.set('subjectinfo', this.data.model);
      //     if (this.data.model.comefrom == 'teacher') {
      //       wx.navigateTo({
      //         url: '../register/info/t_info'
      //       });
      //     } else if (this.data.model.comefrom == 'personalInfo') {
      //       wx.navigateTo({
      //         url: '../mypage/personalInfo/personalInfo?from=category'
      //       });
      //     } else if (this.data.model.comefrom == 'subject') {
      //       console.log(111)
      //       wx.navigateBack({})
      //     }

      //   }
      // },
      // //选择三级
      // [events.ui.SELECT_REGION](e) {
      //   const index = e.currentTarget.dataset.index
      //   this.setData({
      //     'model.id': e.currentTarget.dataset.id,
      //     'model.name': e.currentTarget.dataset.name,
      //     index: index,
      //     level3name: e.currentTarget.dataset.name
      //   });
      //   this.$storage.set('subjectinfo', this.data.model);
      //   if (this.data.model.comefrom == 'teacher') {
      //     wx.navigateTo({
      //       url: '../register/info/t_info'
      //     });
      //   } else if (this.data.model.comefrom == 'personalInfo') {
      //     wx.navigateTo({
      //       url: '../mypage/personalInfo/personalInfo'
      //     });
      //   }
      // },


      [events.ui.SELECT_REGION](e) {
        this.setData({
          'model.id': e.currentTarget.dataset.id,
          'model.name': e.currentTarget.dataset.name,
        });
        console.log(this.data.model)
        this.$storage.set('subjectinfo', this.data.model);
        if (this.data.model.comefrom == 'teacher') {
          wx.redirectTo({
            url: '../register/info/t_info'
          });
        } else if (this.data.model.comefrom == 'personalInfo') {
          wx.navigateBack({})
          // wx.redirectTo({
          //   url: '../mypage/personalInfo/personalInfo?comefrom=area'
          // });
        } else{
          wx.navigateBack({})
        }
      },
      [events.ui.ADDSUBJECT]() {
        wx.navigateTo({
          url: './subject/subjectlist',
        })
      },
      mytouchstart: function(e) {
        let that = this;
        that.setData({
          'touch_start': e.timeStamp
        })
        console.log(this.data.touch_start)
      },
      mytouchend: function(e) {
        let that = this;
        that.setData({
          'touch_end': e.timeStamp
        })
      },

      [events.ui.DELSUBJECT](e) {
        var touchTime = this.data.touch_end - this.data.touch_start;
        console.log(touchTime);
        //如果按下时间大于350为长按  
        if (touchTime > 350) {
          this.setData({
            delId: e.currentTarget.dataset.id
          })
          let id = e.currentTarget.dataset.id
          wx.showModal({
            title: '提示',
            content: '确定删除该自定义科目吗？',
            confirmColor: '#f29219',
            success: res => {
              console.log(res)
              if (res.confirm) {
                console.log(res)
                put(effects.DEL_NAME)
              }
            }
          })
        } else {
          this.setData({
            'model.id': e.currentTarget.dataset.id,
            'model.name': e.currentTarget.dataset.name,
          });
          console.log(this.data.model)
          this.$storage.set('subjectinfo', this.data.model);
          if (this.data.model.comefrom == 'teacher') {
            wx.redirectTo({
              url: '../register/info/t_info'
            });
          } else if (this.data.model.comefrom == 'personalInfo') {
            wx.navigateTo({
              url: '../mypage/personalInfo/personalInfo'
            });
          }
        }
      }
    }
  }

  mapEffect({
    put
  }) {
    return {
      [effects.GETSUBJECT]() {
        this.$api.category.get({}).then((res) => {
          this.setData({
            'subjectList': res.data.result
          })
          this.data.subjectList.forEach(item => {
            if (item.sys == 1) {
              this.setData({
                haveZD: true
              })
              return
            }
          })
          let that = this
          wx.getStorage({
            key: 'subjectinfo',
            success: function(res) {
              let id = res.data.id
              that.data.subjectList.forEach(item => {
                if (item.id == id) {
                  item.isselect = 1
                } else {
                  item.isselect = 0
                }
              })
              that.setData({
                subjectList: that.data.subjectList,
                'selectId': res.data.id
              })
            },
          })
        });
      },
      [effects.DEL_NAME]() {
        this.$api.category.deleteTeachingSub({
          id: this.data.delId
        }).then(res => {
          console.log(res)
          if (res.data.errorCode == 0) {
            wx.showToast({
              title: '删除成功',
            })
            if (this.data.selectId == this.data.delId){
              wx.removeStorageSync('subjectinfo')
            }
            put(effects.GETSUBJECT)
            this.setData({
              haveZD: false
            })
          }
        })
      }
    }
  }
}

EApp.instance.register({
  type: CategoryPage,
  id: 'CategoryPage',
  config: {
    events,
    effects,
    actions
  }
});
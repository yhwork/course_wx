// classPage
import regeneratorRuntime from '../../lib/runtime'
import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../eea/index'
import {
  events,
  effects,
  actions
} from './class.eea'
class createClass extends EPage {
  get data() {
    return {
      userinfo: {},
      haveClass: true,
      hipeChild: true,
      childMsg: '',
      formId: '',
      msgcount:0
    };
  }
  mapPageEvent({
    put,
    dispatch 
  }) {
    return {
      // [PAGE_LIFE.on_tap]() {
      //   let isAuto = this.data.isAuthorization
      //   console.log('点击tab事件', isAuto);
      //   if (isAuto) {
      //     return false
      //   } else {
      //     return wx.redirectTo({
      //       url: '/pages/register/register'
      //     })
      //   }
      // },
      // 页面加载
     async [PAGE_LIFE.ON_LOAD](option) {
        this.setData({
          'img': this.$api.extparam.getPageImgUrl('girlb'),
          "img1": this.$api.extparam.getPageImgUrl('set_class'),
        })

       await new Promise((resolve,reject)=>{
         put(effects.USERINFO, option);
       })
        await new Promise((res,rej)=>{
          put(effects.GETMESSAGE);
        })
      

        console.log(put(effects.USERINFO, option))
      },
      // 页面显示
      [PAGE_LIFE.ON_SHOW](option) {
        put(effects.USERINFO)
        wx.removeStorage({
          key: 'subjectinfo',
          success: function(res) {},
        })
      },
      // 上拉刷新
      [PAGE_LIFE.ON_PULL_DOWN_REFRESH]() { //上拉刷新
        put(effects.USERINFO)
        // put(effects.getStoreProductHotList) //实时请求加载   //方法需要注册
        let time = null;
        time = setTimeout(()=>{
          wx.stopPullDownRefresh();
           time = null;
        },200)
       
      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      [events.ui.GoSetClass]() {
        wx.navigateTo({
          url: '../classcircle/schoolType/schoolType',
        })
      },
      [events.ui.GO_MYCLASS](e) {
        this.setData({
          'formId': e.detail.formId
        })
        put(effects.ADDFOEMID)
        if (this.data.userinfo.role == 0) {
          this.$storage.set('childId', this.data.childId)
          wx.navigateTo({
            url: '../classcircle/classMsg/classMsg?classId=' + e.currentTarget.dataset.classid + '&childId=' + this.data.childId + '&role=' + this.data.userinfo.role,
          })
        } else {
          wx.navigateTo({
            url: '../classcircle/classMsg/classMsg?classId=' + e.currentTarget.dataset.classid + '&role=' + this.data.userinfo.role,
          })
        }

      },
      [events.ui.searchClass]() {
        if (this.data.userinfo.role == 0) {
          // console.log(this.data.childId)
          wx: wx.navigateTo({
            url: '../classcircle/searchClass/searchClass?childId=' + this.data.childId,
          })
        } else {
          wx: wx.navigateTo({
            url: '../classcircle/searchClass/searchClass',
          })
        }

      },
      [events.ui.choose](e) {
        this.setData({
          hipeChild: false
        })
      },
      [events.ui.changeChild](e) {
        // console.log(e.currentTarget.dataset)
        let index = e.currentTarget.dataset.index
        this.setData({
          hipeChild: true,
          childMsg: this.data.childList[index],
          childId: e.currentTarget.dataset.childid
        })
        // console.log(this.data.childMsg)
        let inputMap = {
          childId: e.currentTarget.dataset.childid
        }
        this.$api.class.getClassList(inputMap).then((res) => {
          if (res.data.errorCode == 0) {
            this.setData({
              'classList': res.data.result,
              'haveClass': true
            })
          } else {
            this.setData({
              'classList': [],
              'haveClass': false
            })
          }
          put(effects.GETMESSAGE)
        });

      },
      [events.ui.GO_CLASSMSG_LIST](){
        if(this.data.userinfo.role==0){
          wx.navigateTo({
            url: '../classcircle/classMsgList/classMsgList?childId=' + this.data.childId
          })
        }else{
          wx.navigateTo({
            url: '../classcircle/classMsgList/classMsgList'
          })
        }
       
      }
    }
  }

  mapEffect({
    put,
    dispatch
  }) {
    return {
      [effects.USERINFO](option) {
        this.$api.user.gerUserInfo({}).then(res => {
          this.setData({
            userinfo: res.data.result
          })
          if (this.data.userinfo.role == 0) {
            wx.setNavigationBarTitle({
              title: '班级圈（家长端）',
            })
          } else {
            wx.setNavigationBarTitle({
              title: '班级圈（教师端）',
            })
          }
          // console.log(this.data.userinfo)
          if (this.data.userinfo.role == 0) {
            this.$api.child.get({}).then(res => {
              this.setData({
                childList: res.data.result.childList,
              })
              // console.log(this.data.childList)
              let inputMap = {}
              if (this.data.childMsg) {
                inputMap = {
                  childId: this.data.childId
                }
              } else {
                this.setData({
                  childId: this.data.childList[0].childId
                })
                inputMap = {
                  childId: this.data.childList[0].childId
                }
              }
              // console.log(inputMap)
              put(effects.GET_CLASSLIST, {
                inputMap
              })
              
            })
          } else {
            let inputMap = {
              teacherId: this.data.userinfo.id
            }
            put(effects.GET_CLASSLIST, {inputMap})
          }
          if (option) {
            dispatch(actions.HANDLE_ACTION, option);
          }
        })
      },
      
      [effects.GET_CLASSLIST](inputMap) {
        let map = inputMap.inputMap
        this.$api.class.getClassList(map).then((res) => {
          // console.log(res.data.result)
          if (res.data.errorCode == '0') {
            this.setData({
              'classList': res.data.result,
              haveClass: true
            })
          } else if (res.data.errorCode == 100006) {
            // 没有课程
            this.setData({
              haveClass: false
            })
          }
          put(effects.GETMESSAGE)
        });
      },
      // 获取消息
      [effects.GETMESSAGE]() {
        let inputMap = {}
        if (this.data.userinfo.role == 0) {
          inputMap = {
            childId: this.data.childId
          }
        }
        console.log('获取消息1', inputMap)
        this.$api.class.getClassUnreadMessageInfo(inputMap).then(res => {
          console.log('获取消息结果', res)
          if(res.data.errorCode==0){
            this.setData({
              msgcount: res.data.result.classMessageCount,
              'msgimg': res.data.result.userLogo
            })
          }else{
            this.setData({
              msgcount: 0,
              'msgimg': ''
            })
          }
        })

      },
      // 添加formId
      [effects.ADDFOEMID]() {
        let map = {
          ids: this.data.formId
        }
        // console.log(map)
        this.$api.user.addUserForm(map).then(res => {
          // console.log('保存formId')
        })
      }
    }
  }
  mapAction({
    put
  }) {
    return {
      [actions.HANDLE_ACTION](option) {
        // console.log(option)
        const {
          action,
        } = option;
        if (action === 'classNotifyTemplateMessage') {
          const {
            classId,
            role,
            id,
            type
          } = option;
          if (role == 0) {
            this.$storage.set('childId', option.childId)
          }
          if (this.data.userinfo.role != role) {
            let model = {
              role: role,
              changeRole: this.data.userinfo.role
            }
            this.$api.user.changeRole(model).then(res => {
              this.$api.auth.clearToken().then(res => {
                this.$api.auth.clearToken().then(res => {
                  wx.navigateTo({
                    url: '../classcircle/workMsg/workMsg?id=' + id + '&type=' + type + '&classId=' + classId + '&role=' + role,
                  })
                })
              })
            })
          } else {
            wx.navigateTo({
              url: '../classcircle/workMsg/workMsg?id=' + id + '&type=' + type + '&classId=' + classId + '&role=' + role,
            })
          }
        } else if (action === 'joinClassTemplateMessage') {
          const {
            classId,
            role,
          } = option;
          if (this.data.userinfo.role != role) {
            let model = {
              role: role,
              changeRole: this.data.userinfo.role
            }
            this.$api.user.changeRole(model).then(res => {
              this.$api.auth.clearToken().then(res => {
                this.$api.auth.clearToken().then(res => {
                  if(role==0){
                    wx.navigateTo({
                      url: '../classcircle/classMsg/classMsg?classId=' + classId + '&role=' + role + '&childId=' + option.childId + '&idx=5',
                    })
                  }else{
                    wx.navigateTo({
                      url: '../classcircle/classMsg/classMsg?classId=' + classId + '&role=' + role + '&idx=5',
                    })
                  }                  
                })
              })
            })
          } else {
            if (role == 0) {
              wx.navigateTo({
                url: '../classcircle/classMsg/classMsg?classId=' + classId + '&role=' + role + '&childId=' + option.childId + '&idx=5',
              })
            } else {
              wx.navigateTo({
                url: '../classcircle/classMsg/classMsg?classId=' + classId + '&role=' + role + '&idx=5',
              })
            }
          }




          // wx.navigateTo({
          //   url: '../classcircle/classMsg/classMsg?classId=' + classId + '&role=' + role + '&idx=2',
          // })
        }
      }
    }
  }

}


EApp.instance.register({
  type: createClass,
  id: 'createClass',
  config: {
    events,
    effects,
    actions
  }
});
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
} from './register.eea'


class RegisterPage extends EPage {
  get data() {
    return {
      model: {
        encryptedData: '',
        iv: '',
        role: '',
        changeRole: '0'
      },
      inputMap: {

      },
      isToShare: '',
      style: '',
      btn: false,
      isphone: true,
      code: '',
      comfrom: 'change',
      router:'',
      productId:'',
      courseId:'',
      duration:3000
    };
  }

  mapPageEvent({
    put,
    dispatch
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {



        console.log('授权',option)
        if (option.hasOwnProperty('backrouter')){
          if (option.backrouter == 'shop'){
            let router = `${option.router}?courseId= ${option.courseId}&productId=${option.productId}`
            console.log(router)
            this.setData({
              router
            })
          }
        }
        if (option.comfrom) {
          this.setData({
            comfrom: "share",
            classId: option.classId 
          })
        }
        this.setData({
          head: this.$api.extparam.getPageImgUrl('head'),
          teacher_img: this.$api.extparam.getPageImgUrl('teacher_img'),
          home_img: this.$api.extparam.getPageImgUrl('home_img'),
        })
        if (typeof option.ope != 'undefined' && option.ope == 'changeRole') {
          this.setData({
            'model.changeRole': '1'
          })
        }
        // debugger
        // console.log(option, this.data.model)
        if (option.ope != 'changeRole' && option.backrouter == null ) {
          // if(option.action=='share'){
          let str = JSON.stringify(option)
          // console.log(str)
          if (str != '{}') {
            let options = JSON.parse(option.shareMsg)
            // console.log(option)
            this.setData({
              isToShare: options.action,
              code: options.code
            })
            // console.log(options)
          }
          // }
        }
      },
      [PAGE_LIFE.ON_SHOW]() {

      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      [events.ui.CHOOSE_ROLE](e) {
        console.log('role',e)
        wx.setStorageSync('role', e.currentTarget.dataset.role)
        var that = this;
        wx.getSetting({
          success(res) {
            // console.log(res)
            if (res.authSetting['scope.userInfo']) {
              that.$api.auth.token().then(() => wx.getUserInfo({
                success: function(res) {
                  // console.log(res)
                  that.setData({
                    'model.encryptedData': res.encryptedData,
                    'model.iv': res.iv,
                    'model.role': e.currentTarget.dataset.role
                  })
                  // console.log(e.currentTarget.dataset.role)
                  if (e.currentTarget.dataset.role == 0) {
                    // 家长
                    that.setData({
                      btn: true,
                      style: 'change',
                      isphone: false,
                      type: '家长/学生'
                    })
                  } else {
                    that.setData({
                      btn: true,
                      style: 'change',
                      isphone: false,
                      type: '老师'
                    })
                  }
                  put(effects.SET_USERINFO);
                }
              }))

            }
          }
        })
      },
      // 获取电话号码
      [events.ui.getPhoneNumber](e) {
        console.log('phones',e)
        if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
          return;
        } else {
          this.setData({
            'inputMap.iv': e.detail.iv,
            'inputMap.encryptedData': e.detail.encryptedData  
          })
          // console.log(this.data.inputMap)
          put(effects.updateUserPhoneByWX);
        }
      },


      //切换角色
      [events.ui.CHANGE_ROLE](e) {
        wx.setStorageSync('role', e.currentTarget.dataset.role)
        this.setData({
          'model.role': e.currentTarget.dataset.role
        })
        put(effects.CHANGE_ROLE);
      }
    }
  }

  mapEffect({
    put
  }) {
    return {
      [effects.SET_USERINFO]() {
        const model = this.data.model;
        // console.log(this.data.model)
        this.$api.user.updateUserInfoByWX(model).then(
          (res) => {
            this.$api.auth.clearToken().then(
              (res) => {
                this.setData({
                  isphone: false
                })
                // wx.switchTab({
                //   url: '../course/course'
                // })
                // this.$api.child.get().then(
                //   (res) => {
                //     if (res.data.errorCode == '0') { //有孩子信息
                //       wx.switchTab({
                //         url: '../course/course'
                //       })
                //     } else if (res.data.errorCode == '100006') { //空
                //       if (model.role == 1) { //教师
                //         wx.navigateTo({
                //           url: './info/t_info'
                //         });
                //       } else { //家长
                //         wx.navigateTo({
                //           url: './info/p_info'
                //         })
                //       }
                //     }
                //   },
                //   (rej) => {}
                // )
              }
            )
          }
        );
      },

      [effects.updateUserPhoneByWX]() {
        const model = this.data.inputMap
        // console.log()
        this.$api.user.updateUserPhoneByWX(model).then(
          (res) => {
            console.log('phone',res)
            if (res.data.errorCode == '0') {
              wx: wx.showToast({
                title: '绑定成功',
              })
              // console.log(this.data.isToShare)
              if (this.data.isToShare == 'share') {
                // console.log(this.data.code)
                let inputMap = {
                  code: this.data.code
                }
                this.$api.user.addUserShareInfo(inputMap).then((res) => {
                  // console.log(22)
                  // console.log(res)
                })
              }
              let router = this.data.router
              console.log('router', router)
              // 家长端获取  教室的数据
              if (this.data.model.role == 1) {
                this.$api.user.gerUserInfo().then(res => {
                  console.log('是否有授权数据',res.data.result)
                  let result = res.data.result
                  if (!result.name) {
                    wx.navigateTo({
                      url: './info/t_info'
                    });
                  } else {
                    if (router){

                        // 跳到tabbar页面
                        // return wx.redirectTo({
                        //   url:
                        // })
                    }else{
                      wx.switchTab({
                        url: '../course/courseList/courseList'
                      })
                    }

                  }
                })
              } else {
                if (router) {
                  var sss = '/pages/mypage/mypage/mypage'
                  // 跳到tabbar页面
                  return wx.navigateTo({
                    url: router
                  })
                } else {
                  wx.switchTab({
                    url: '../course/courseList/courseList'
                  })
                }
              }
            }
          })
      },


      //切换角色
      [effects.CHANGE_ROLE]() {
        let model = this.data.model;
        model.type = 'changeRole'
        this.$api.user.changeRole(model).then(
          (res) => {
            // console.log(res.data)
            if (model.role == 1) { //教师
              this.$api.user.verifyTeacherInfo({}).then(res => {
                // console.log(res.data.result)
                if (res.data.result.teacherInfoStatus) {
                  this.$api.auth.clearToken().then(
                    (res) => {
                      this.$api.child.get().then(res => {
                        if (res.data.errorCode == 0) {
                          if (this.data.comfrom == 'share') {
                            wx.redirectTo({
                              url: `/pages/classcircle/classMsg/classMsg?classId=${this.data.classId}&role=${model.role}&isfrom=share`
                            });
                          } else {
                            //有孩子跳转到我的页面
                            this.$storage.set('childId', res.data.result.childList[0].childId)
                            // this.$storage.set('childId', res.data.result.childList[0].childId).then(
                            wx.switchTab({
                              url: '../mypage/mypage/mypage'
                            })
                            // )
                          }

                        }
                      })
                    })
                } else {
                  wx.navigateTo({
                    url: './info/t_info'
                  });
                }
              })
            } else { //家长
              this.$api.auth.clearToken().then(res => {
                this.$api.child.get().then((res) => {
                  if (res.data.errorCode == 0) {
                    let childId = res.data.result.childList[0].childId
                    this.$storage.set('childId', childId)
                    this.$api.auth.clearToken().then(res => {
                      if (this.data.comfrom == 'share') {
                        wx.redirectTo({
                          url: `/pages/classcircle/classMsg/classMsg?classId=${this.data.classId}&role=${model.role}&childId=${childId}&isfrom=share`
                        });
                      } else {
                        //有孩子跳转到我的
                        wx.switchTab({
                          url: '../mypage/mypage/mypage'
                        })
                      }

                    })
                  }
                })
              })

            }


          }
        )
      },

    }
  }


}

EApp.instance.register({
  type: RegisterPage,
  id: 'RegisterPage',
  config: {
    events,
    effects,
    actions
  }
});
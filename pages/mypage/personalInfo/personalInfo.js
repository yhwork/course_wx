// pages/mypage/personalInfo/personalInfo.js
import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../eea/index'
import {
  events,
  effects,
  actions
} from './personalInfo.eea'

class personalInfoPage extends EPage {
  get data() {
    return {
      pageModel: {},
      modifyModel: {},
      genders: [{
        name: '男',
        value: '0'
      },
      {
        name: '女',
        value: '1'
      },
      ],
      genderHide: true,
      manage:'false',
      city: '',
      subjectNameFromCategory: '',
      schoolNameFromArea: '',
      hasBindPhoneText: null
    };

  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        let { avatar } = option
        if (avatar) {
          this.$api.upload.upload(avatar).then(res => {
            this.setData({
              'pageModel.logo': this.$api.extparam.getFileUrl(res.key)
            });
            this.setData({
              'modifyModel.logo': this.$api.extparam.getFileUrl(res.key)
            });
          });
        }

        
        // if (typeof option.comefrom != 'undefined') {
        //   // 返回学校信息
        //   this.$storage.get('schoolinfo.name').then(
        //     (schoolinfo) => {
        //       this.setData({
        //         'modifyModel.workOrganizationName': schoolinfo.data,
        //         schoolNameFromArea: schoolinfo.data
        //       })
        //     },
        //     (reject) => { }
        //   );

        //   this.$storage.get('schoolinfo.schoolid').then(
        //     (schoolinfo) => {
        //       this.setData({
        //         'modifyModel.shcoolId': schoolinfo.data
        //       })
        //     },
        //     (reject) => { }
        //   );
        // }
        put(effects.LOAD_IS_BIND_PHONE);
        put(effects.loadOwnerInfo);
        if (option.city != '' && option.city != null && option.city != 'undefind') {
          this.setData({
            city: option.city
          })
        }
      },
      [PAGE_LIFE.ON_SHOW](option) {
        let that = this 
        wx.getStorage({
          key: 'subjectinfo',
          success: function(res) {
            console.log(res.data)
            that.setData({
              'modifyModel.teachSubjects': res.data.id,
              'pageModel.subjectName': res.data.name 
            })
          },
        })
        wx.getStorage({
          key: 'schoolinfo.name',
          success: function (res) {
            console.log(res.data)
            that.setData({
              'modifyModel.workOrganizationName': res.data,
              schoolNameFromArea: res.data
            })
          },
        })
        wx.getStorage({
          key: 'schoolinfo.schoolid',
          success: function (res) {
            console.log(res.data)
            that.setData({
              'modifyModel.shcoolId': res.data
            })
          },
        })
        // if (typeof option.comefrom != 'undefined') {
        //   //返回教学科目信息
        //   this.$storage.get('subjectinfo').then(
        //     (subjectinfo) => {
              
        //     },
        //     (reject) => { }
        //   );
        // }
      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      // 学科
      [events.ui.bindTeacherClass](e) {
        wx.navigateTo({
          url: '../../category/category?comefrom=personalInfo',
        })
      },
      // 非全日制获取学校名称
      [events.ui.bindSchoolInput](e) {
        this.setData({
          'modifyModel.workOrganizationName': e.detail.value
        })
      },
      // 学校
      [events.ui.bindTeacherSchool](e) {
        // 这里需要做判断，如果是全日制就跳转选择学校，如果不是全日制，就让自己输入
        if (this.data.pageModel.teacherProp == 1) {
          wx.redirectTo({
            // pages/mypage/school/school
            url:'../school/school?comefrom=personalInfo'
            // url: '../../area/area?comefrom=personalInfo',
          })
        }
      },
      // 保存个人信息
      [events.ui.submitChangeInfo](e) {
        put(effects.savePersonalInfo);
      },


      // 头像
      [events.ui.bindPhotoChange](e) {
        wx.showActionSheet({
          itemList: ['拍照', '从手机相册选择'],
          success: (res) => {
            if (res.cancel) {
              return;
            }
            var sourceType = [];
            if (res.tapIndex === 0) {
              sourceType.push('camera');
            }
            if (res.tapIndex === 1) {
              sourceType.push('album');
            }
            wx.chooseImage({
              sourceType: sourceType,
              count: 1,
              success: (resp) => {
                console.log(resp.tempFilePaths[0])
                wx.redirectTo({
                  url: '../../../upload/upload?src=' + resp.tempFilePaths[0] + '&type=user'
                })


                // this.$api.upload.upload(resp.tempFilePaths[0]).then(res => {
                //   this.setData({ 'pageModel.logo': this.$api.extparam.getFileUrl(res.key) });
                //   this.setData({ 'modifyModel.logo': this.$api.extparam.getFileUrl(res.key) });
                //   console.log(this.data)
                // });
              }
            })
          }
        });
      },



      // 昵称   modifyModel
      [events.ui.bindNickInput](e) {
        this.setData({
          'modifyModel.nickName': e.detail.value
        })
      },
      [events.ui.bindName](e){
        this.setData({
          'modifyModel.name': e.detail.value
        })
      },
      // 取消
      [events.ui.bindDeleteTap](e) {
        wx.navigateBack({
          delta: 1,
        })
      },
      // 居住地
      [events.ui.bindAddrInput](e) {
        this.setData({
          'modifyModel.city': e.detail.value
        })
      },
      // 个人签名
      [events.ui.bindSignInput](e) {
        this.setData({
          'modifyModel.personalSign': e.detail.value
        })
      },
      //隐藏性别：
      [events.ui.hideGender](e) {
        this.setData({
          'pageModel.gender': e.currentTarget.dataset.index,
          'modifyModel.gender': e.currentTarget.dataset.index,
          genderHide: true
        })
      },
      //显示性别：
      [events.ui.showGender](e) {
        this.setData({
          genderHide: false
        })
      },
      //跳转地址：
      [events.ui.chooseAddr](e) {
        wx.setStorageSync("personalChangeInfo", this.data.modifyModel);
        wx.redirectTo({
          url: '../area/area'
        })
      }
    }
  }

  mapEffect({
    put
  }) {
    return {
      [effects.loadOwnerInfo]() {
        this.$api.circle.getCurrentUserInfo({}).then(s => {
          if (s.data.errorCode == '0') {
            this.setData({
              pageModel: s.data.result,
            })
            console.log(this.data.pageModel)
            if (this.data.city != '' && this.data.city != null && this.data.city != 'undefined') {
              this.setData({
                'modifyModel.city': this.data.city,
                'pageModel.city': this.data.city,
              })
            }
            if (this.data.schoolNameFromArea != '') {
              this.setData({
                'pageModel.workOrganizationName': this.data.schoolNameFromArea
              })
            }
            if (this.data.subjectNameFromCategory != '') {
              this.setData({
                'pageModel.subjectName': this.data.subjectNameFromCategory,
              })
            }
          }
        })
      },

      [effects.savePersonalInfo]() {
        console.log(this.data.modifyModel)
        this.$api.circle.updateUserDetails(this.data.modifyModel).then(s => {
          if (s.data.errorCode == '0') {
            wx.showToast({
              title: '修改成功',
            })    
            setTimeout( ()=>{
              wx.navigateBack({
                delta: 1,
              })
            }, 200)
          }
        })
      },
      // 查询当前用户信息
      [effects.LOAD_IS_BIND_PHONE]() {
        this.$api.circle.getUserIsBindingPhone({}).then((res) => {
          let errorCode = res.data.errorCode;
          if (errorCode == '0') {
            // 1绑定 0未绑定
            var isBindingPhone = res.data.result.isBindingPhone;
            if (isBindingPhone == 1) {
              this.setData({
                hasBindPhoneText: '已认证'
              })
            } else {
              this.setData({
                hasBindPhoneText: '未认证'
              })
            }
          }
        });
      },
    }
  }
}

EApp.instance.register({
  type: personalInfoPage,
  id: 'personalInfoPage',
  config: {
    events,
    effects,
    actions
  }
});
import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../eea/index'
import {
  events,
  effects,
  actions
} from './reviseClass.eea'
class reviseClass extends EPage {
  get data() {
    return {
      userinfo: {},
      model: {},
      shareCavansOptions: {
        id: 'share_canvas',
        width: 0,
        height: 0
      },
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        console.log(option)
        put(effects.USERINFO)
        this.setData({
          classId: option.classId,
          type: option.type,
          img: this.$api.extparam.getPageImgUrl('boyb')
        })
        const {
          shareCavansOptions
        } = this.data;
        shareCavansOptions.width = wx.getSystemInfoSync().screenWidth;
        shareCavansOptions.height = shareCavansOptions.width * 5 / 4;
        this.setData({
          shareCavansOptions,
        });
        if (this.data.type == 'remove') {
          wx.setNavigationBarTitle({
            title: '移除班级成员',
          })
        }
        put(effects.GETCLASSINFO)
        if (this.data.type == 'merge'){
          put(effects.GETSHAREIMG)
        }
        
        if (option.classlogo) {
          this.$api.upload.upload(option.classlogo).then(res => {
            this.setData({
              'classinfo.classLogo': this.$api.extparam.getFileUrl(res.key)
            });
            console.log(this.data.classinfo)
          });
        }
      },
      [PAGE_LIFE.ON_SHOW](option) {

      },
      [PAGE_LIFE.ON_SHARE_APP_MESSAGE](e) {
        const {
          from
        } = e;
        const {
          teacherNumber,
          imageUrl,
          shortCode
        } = this.data
        console.log(imageUrl)
        if (from === 'button') {
          console.log(this.data)
          return {

            title: `${teacherNumber[0].teacherName}老师想与您合并班级，点击查看Ta的班级详情`,
            path: `/pages/course/courseList/courseList?action=share&code=${shortCode}`,
            imageUrl: `${imageUrl}`,
            success: (res) => {
              this.$common.showToast('分享成功', 'success')
            }
          }
        }
      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      [events.ui.SAVE_LOGO]() {
        let inputMap = {
          classId: this.data.classId,
          classLogo: this.data.classinfo.classLogo
        }
        put(effects.UPCLASSINFO, {
          inputMap
        })
      },
      [events.ui.saveinputname](e) {
        console.log(e.detail.value)
        this.setData({
          'classinfo.className': e.detail.value
        })
      },
      [events.ui.SAVE_NAME]() {
        console.log(this.data.classinfo.className)
        if (this.$common.isBlank(this.data.classinfo.className)) {
          this.$common.showMessage(this, '班级名称不能为空')
          return
        }
        let inputMap = {
          classId: this.data.classId,
          className: this.data.classinfo.className
        }
        // return
        put(effects.UPCLASSINFO, {
          inputMap
        })
      },
      // 管理员踢出班级
      [events.ui.delclass](e) {
        let type = e.currentTarget.dataset.type
        let id = e.currentTarget.dataset.id
        let inputMap = {}
        if (type == 'tearcher') {
          inputMap = {
            classId: this.data.classId,
            teacherId: id,
            status: 4
          }
        } else {
          inputMap = {
            classId: this.data.classId,
            childId: id,
            status: 4
          }
        }
        wx.showModal({
          title: '提示',
          content: '确定删除该成员？',
          confirmColor: '#DDC01F',
          success: res => {
            if (res.confirm) {
              put(effects.updataStstus, {
                inputMap
              })
            }
          }
        })
      },
      [events.ui.MERGE_CLASS](e) {
        console.log(e.detail.formId)
        this.setData({
          formId: e.detail.formId
        })
        put(effects.ADDFOEMID)
      }
    }
  }

  mapEffect({
    put
  }) {
    return {
      [effects.USERINFO]() {
        this.$api.user.gerUserInfo({}).then(res => {
          console.log(res.data.result)
          this.setData({
            userinfo: res.data.result
          })
        })
      },
      // 获取班级详情
      [effects.GETCLASSINFO]() {
        let inputdata = {
          classId: this.data.classId,
          childId: ''
        }
        this.$api.class.getClassDetailsByClassId(inputdata).then(res => {
          this.setData({
            'classinfo': res.data.result.classInfo,
            'teacherNumber': res.data.result.listTeacher,
            'childNumber': res.data.result.listChild
          })
          console.log(res.data.result)
        })
      },
      [effects.UPCLASSINFO](data) {
        this.$api.class.updateClassInfo(data).then(res => {
          console.log(res.data)
          wx.navigateBack({
            delta: 1
          })
        })
      },
      [effects.updataStstus](inputMap) {
        console.log(inputMap)
        this.$api.class.updateClassMemberStatus(inputMap).then(res => {
          console.log(res.data)
          if (res.data.errorCode == 0) {
            put(effects.GETCLASSINFO)
          }
        })
      },
      // 
      [effects.GETSHAREIMG]() {
        let _this = this
        wx.getStorage({
          key: 'inviteimg',
          success(res) {
            console.log(res.data)
            if (res.data) {
              _this.setData({
                inviteimg: res.data
              })
              
            } else {
              let inviteimg = _this.$api.extparam.getPageImgUrl('inviteimg')
              wx.downloadFile({
                url: inviteimg,
                success: function(res) {
                  _this.setData({
                    inviteimg: res.data
                  })
                }
              })
            }
          }
        })

        const param = {};
        param.dataType = 7;
        param.data = {
          'classId': this.data.classId
        };
        this.$api.user.shareInfoRecord(param).then(res => {
          // console.log(res.data)
          const param1 = {};
          param1.dataType = 7;
          param1.data = {
            'classId': this.data.classId,
            'target': 'reviseclass',
            'shortCode': res.data.result.shortCode
          };
          this.$api.user.shareInfoRecord(param1).then(res => {
            this.setData({
              'shortCode': res.data.result.shortCode
            })
            // console.log(this.data.shortCode)

            let shareInfo = this.data.classinfo
            shareInfo.teacherName = this.data.teacherNumber[0].teacherName
            wx.downloadFile({
              url: shareInfo.classLogo,
              success: function(res) {
                shareInfo.classLogo = res.tempFilePath
                shareInfo.shareimg = _this.data.inviteimg
                _this.$image.generateShareCourse(_this.data.shareCavansOptions, shareInfo, 'reviseclass').then(imageUrl => {
                  // console.log(imageUrl)
                  _this.setData({
                    imageUrl: imageUrl
                  });
                });
              }
            })
          })
        })

      },
      // 添加formId
      [effects.ADDFOEMID]() {
        let map = {
          ids: this.data.formId
        }
        this.$api.user.addUserForm(map).then(res => {
          console.log('保存formId')
        })
      }

    }
  }
}

EApp.instance.register({
  type: reviseClass,
  id: 'reviseClass',
  config: {
    events,
    effects,
    actions
  }
});
import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../eea/index'
import {
  events,
  effects,
  actions
} from './classManage.eea'
class classmanage extends EPage {
  get data() {
    return {
      userinfo: {},
      shareCavansOptions: {
        id: 'share_canvas',
        width: 0,
        height: 0
      },
    };
  }

  mapPageEvent({put}) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        put(effects.USERINFO)
        this.setData({
          classId: option.classId,
          'shareclass': this.$api.extparam.getPageImgUrl('shareclass'),
        })
        put(effects.GETCLASSINFO)
        put(effects.SHARE_IMG)
        const {
          shareCavansOptions
        } = this.data;
        shareCavansOptions.width = wx.getSystemInfoSync().screenWidth;
        shareCavansOptions.height = shareCavansOptions.width * 5 / 4;
        this.setData({
          shareCavansOptions,
        });
        let inviteimg = this.$api.extparam.getPageImgUrl('inviteimg')
        wx.downloadFile({
          url: inviteimg,
          success: function(res) {
            wx.setStorage({
              key: 'inviteimg',
              data: res.tempFilePath
            })
          }
        })
        
      },
      [PAGE_LIFE.ON_SHOW](option) {
        put(effects.GETCLASSINFO)
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
            title: `【${teacherNumber[0].teacherName}老师@您】邀请您加入Ta建立的班级`,
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
      [events.ui.del_class]() {
        wx.showModal({
          title: '班级解散警告',
          content: '解散班级，班级所有内容将全部删除，是否解散班级？',
          confirmColor: '#ff4081',
          success: res => {
            if (res.confirm) {
              put(effects.DELCLASS)
            }
          }
        })
      },
      [events.ui.REVISE_LOGO]() {
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
                wx.navigateTo({
                  url: '../../../upload/upload?src=' + resp.tempFilePaths[0] + '&type=classlogo' + '&classId=' + this.data.classId
                })
              }
            })
          }
        });
      },
      [events.ui.REVISE_NAME]() {
        wx.navigateTo({
          url: '../reviseClass/reviseClass?type=name&classId=' + this.data.classId,
        })
      },
      [events.ui.REMOVE_CLASS]() {
        wx.navigateTo({
          url: '../reviseClass/reviseClass?type=remove&classId=' + this.data.classId,
        })
      },
      [events.ui.MERGE_CLASS]() {
        wx.navigateTo({
          url: '../reviseClass/reviseClass?type=merge&classId=' + this.data.classId,
        })
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
          let _this = this
          console.log(this.data.classinfo)
        
        })       
      },
      // 解散班级
      [effects.DELCLASS]() {
        let input = {
          classId: this.data.classId
        }
        this.$api.class.deleteClassInfo(input).then(res => {
          console.log(res)
          if (res.data.errorCode == 0) {
            wx.switchTab({
              url: '../../class/class',
            })
          }
        })
      },
      [effects.SHARE_IMG]() {
        console.log(this.data)
        const param = {};
        param.dataType = 7;
        param.data = {
          'classId': this.data.classId
        };
        this.$api.user.shareInfoRecord(param).then(res => {
          console.log(res.data)
          const param1 = {};
          param1.dataType = 7;
          param1.data = {
            'classId': this.data.classId,
            'target': 'class',
            'shortCode': res.data.result.shortCode
          };
          this.$api.user.shareInfoRecord(param1).then(res => {
            this.setData({
              'shortCode': res.data.result.shortCode
            })
            console.log(this.data.teacherNumber)

            let shareInfo = this.data.classinfo
            shareInfo.teacherName = this.data.teacherNumber[0].teacherName

            let _this = this
            wx.downloadFile({
              url: this.data.shareclass,
              success: function(res) {
                shareInfo.shareimg = res.tempFilePath
                _this.$image.generateShareCourse(_this.data.shareCavansOptions, shareInfo, 'class').then(imageUrl => {
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

    }
  }
}

EApp.instance.register({
  type: classmanage,
  id: 'classmanage',
  config: {
    events,
    effects,
    actions
  }
});
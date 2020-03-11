import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../eea/index'
import {
  events,
  effects,
  actions
} from './editMyChild.eea'

class editMyChildPage extends EPage {
  get data() {
    return {
      // 分享弹框显示或隐藏
      clockerHide: true,
      // 打开分享弹框
      scopeHide: true,
      model: {},
      resultModel: {},
      shareCode: '',
      resultCode: '',
      shareHide: true,
      shareCavansOptions: {
        id: 'share_canvas',
        width: 0,
        height: 0
      },
      genderHide: true,
      pageModel: {},
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
      schoolModel: {
        schoolType: '',
        school: '',
        city: ''
      },
      fromPage: '',
      childId:'',
      deleteParamModel: {
        childId: '',
        city: '',
        gender: '',
        school: '',
        schoolId: '',
        logo: '',
      },
      // valname
      paramModel: {
        childId: '',
        city: '',
        gender: '',
        school: '',
        schoolId: '',
        logo: '',
      },
      msgalert: false,
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        console.log('值', option)
        // 获取 修改的用户名
        this.setData({
          manage: option.manage ? option.manage : ''
        })
        /**
         * manage   true  日程表共享
         *          false 日程表设置
         */
        if (option.manage == 'true') {
          wx.setNavigationBarTitle({
            title: '日程表共享',
          })
          this.setData({
            msgalert: true
          })

        } else {
          this.setData({
            msgalert: false
          })
          wx.setNavigationBarTitle({
            title: '日程表个人信息修改',
          })
        }

        let {
          avatar
        } = option
        if (avatar) {
          // 首次加载请求  用户头像
          console.log(avatar)
          this.$api.upload.upload(avatar).then(res => {
            console.log('用户信息', res)
            this.setData({
              'resultModel.logo': this.$api.extparam.getFileUrl(res.key)
            });
            this.setData({
              'paramModel.logo': this.$api.extparam.getFileUrl(res.key)
            });
          });
        }
        wx.hideShareMenu();
        const {
          shareCavansOptions
        } = this.data;
        shareCavansOptions.width = wx.getSystemInfoSync().screenWidth;
        shareCavansOptions.height = shareCavansOptions.width * 5 / 4;
        this.setData({
          shareCavansOptions
        });
       
        this.setData({
          'childId': option.childId,
          'model.childId': option.childId,
          'paramModel.childId': option.childId,
        })
        if (typeof option.from != 'undefined') {
          this.setData({
            fromPage: option.from
          })
        }
        if (typeof option.code != 'undefined') {
          this.setData({
            resultCode: option.code,
            scopeHide: false
          })
          this.$storage.set('childId', this.data.model.childId);
          put(effects.loadShareChildInfo);
        } else {
          // put(effects.loadOneChildInfo);
        }
        // 不是编辑过来的
        if (!option.hasOwnProperty('isupdate')){
         
          
        }
        put(effects.loadOneChildInfo);
        put(effects.GET_USER_INFO);
       
        // 调分享记录接口
        //put(effects.shareChildInfo);

        //put(effects.addChildToList);
      },
      // 页面加载
      [PAGE_LIFE.ON_SHOW]() {
        // // 姓名
        // this.$storage.get('valname').then(
        //   (vals) => {
        //     console.log('读取到没', vals.data)
        //     this.setData({
        //       'resultModel.name': vals.data
        //     })
        //     // console.log(this.data.resultModel.name)
        //   },
        //   (reject) => {}
        // );
        this.$storage.get('resultModel').then(
          (res) => {
            this.setData({
              'resultModel': res.data
            });
          },
          (reject) => { }
        )
        // this.$storage.get('schoolinfo.name').then(
        //   (name) => {
        //     this.setData({
        //       'schoolModel.school': name.data
        //     })
        //   },
        //   (reject) => {}
        // );

        // this.$storage.get('schoolinfo.schoolid').then(
        //   (id) => {
        //     this.setData({
        //       'schoolModel.schoolid': id.data
        //     })
        //   },
        //   (reject) => {}
        // );
        // this.$storage.get('schoolinfo.city').then(
        //   (city) => {
        //     this.setData({
        //       'schoolModel.city': city.data
        //     })
        //   },
        //   (reject) => {}
        // );
        // this.$storage.get('schoolinfo.typecode').then(
        //   (typecode) => {
        //     this.setData({
        //       'schoolModel.schoolType': typecode.data
        //     });
        //   },
        //   (reject) => {}
        // )

        this.setData({
          boyimg: this.$api.extparam.getPageImgUrl('boyb'),
        })


      },
      // 分享
      [PAGE_LIFE.ON_SHARE_APP_MESSAGE](e) {
      
        this.setData({
          shareHide: true
        });
        const {
          from
        } = e;
        const {
          shareInfo,
          userInfo
        } = this.data;
        if (from === 'button') {
          return {
            title: `[${userInfo.nickName}@您]给您分享了“${shareInfo.name}”的信息`,
            path: `/pages/course/courseList/courseList?action=share&code=${shareInfo.shortCode}`,
            // imageUrl: `${shareInfo.imageUrl}`,
            success: (res) => {
              this.$common.showToast('分享成功', 'success')
            }
          }
        }
        return {
          title: `[${userInfo.nickName}@您]分享了小豆包课程表`,
          path: '/pages/course/courseList/courseList',
          imageUrl: '/assets/img/share.jpg'
        }
      },
      [PAGE_LIFE.ON_UNLOAD](e){
        // let mange =this.data.manage;
        // if (mange == 'true'){
        //   put(effects.updateChildShareListAuthority)
        // }
      
      },
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      // 
      [events.ui.CHOOSESCHOOL](){
        console.log('你好')
        // wx.setStorageSync("personalChangeInfo", this.data.modifyModel);
        console.log(this.data.model.childId)
        if (this.data.userEdit == 'true') {
          wx.redirectTo({
            url: '/pages/mydemo/pages/school/school?comefrom=childMsg&childId=' + this.data.model.childId
          })
        }
      },
      // 孩子共享切换
      [events.ui.dozensOfCards](e) {
        // 共享
        let childId = e.currentTarget.dataset.childid;
        let id = e.currentTarget.dataset.id;
        let edit;
        // 设置分享权限
        if (e.detail.value) {
          edit = "1";
        } else {
          // 取消分享权限    /share/closeChildShareListAuthority
          edit = "0";
        }
        console.log(childId, id, edit)
        put(effects.updateChildShareListAuthority, {
          childId,
          id,
          edit
        });
      },
      // 取消共享
      [events.ui.showClocker](e) {
        console.log(e.currentTarget.dataset)
        let _this = this;
        wx: wx.showModal({
          title: '确定取消共享?',
          showCancel: true,
          success: function(res) {
            if (res.confirm) {
              _this.setData({
                'deleteParamModel.shareId': e.currentTarget.dataset.id,
                'deleteParamModel.childId': e.currentTarget.dataset.childid
              })
              put(effects.deleteChildRelation)
            }
          }
        })

      },



      // 删除孩子
      [events.ui.bindDeleteTap](e) {
        if (this.data.childHeigth > 1) {
          wx: wx.showModal({
            title: '提示',
            content: '确定删除该孩子?',
            confirmColor: '#f29219',
            showCancel: true,
            success: function(res) {
              if (res.confirm) {
                put(effects.deleteMyChild);
              }
            },
            fail: function(res) {},
            complete: function(res) {},
          })
        }
        else {
          wx: wx.showToast({
            title: '孩子不能再删除了',
          })
        }

      },
      // 权限管理
      [events.ui.anthManageBind](e) {
        wx.navigateTo({
          url: '../authorityManagement/authorityManagement?id=' + this.data.model.childId,
        })
      },
      // 修改孩子信息
      [events.ui.bindModifyChildInfo](e) {
        wx.navigateTo({
          url: '../modifyInformation/modifyInformation?id=' + this.data.model.childId,
        })
      },
      // 打卡者阻止遮罩层下滚动页面
      [events.ui.stopOther](e) {
        return false;
      },
      //显示标签遮罩层
      [events.ui.showLabel](e) {
        this.setData({
          labelHide: false
        })
      },

      //关闭标签遮罩层
      [events.ui.closeLabel](e) {
        this.setData({
          labelHide: true,
          selectMarkIdArray: []
        })
      },

      // 保存选中标签并关闭遮罩层 
      [events.ui.saveMarksAndCloseLabel](e) {
        this.setData({
          labelHide: true,
          'model.communityMark': (this.data.selectMarkIdArray).join(','),
          selectMarkNameArray: this.data.selectMarkNameData
        })
      },

      [events.ui.bindClockerChange](e) {},

      [events.ui.closeClocker](e) {
        this.setData({
          //关闭标签遮罩层
          clockerHide: true
        })
      },
      [events.ui.cancelScope](e) {
        this.setData({
          //关闭标签遮罩层
          scopeHide: true
        })
      },
      [events.ui.comfireScope](e) {
        this.setData({
          //关闭标签遮罩层
          scopeHide: true
        })
        // 调接口
        put(effects.addChildToList);
      },
      //显示分享遮罩层   // 页面加载时调用  销毁时取消
      [events.ui.SHOW_SHARE](e) {
        this.setData({
          shareHide: false,
        });
       
        let shareInfo = this.data.resultModel;
        const param = {};
        param.dataType = 3;
        param.data = {
          'childId': shareInfo.id
        };
        this.$api.user.shareInfoRecord(param).then(
          (res) => {
            if (res.data.errorCode == '0') {
              const param1 = {};
              param1.dataType = 0;
              param1.data = {
                'childId': shareInfo.id,
                'target': 'child',
                'shortCode': res.data.result.shortCode
              };
              this.$api.user.shareInfoRecord(param1).then(
                (res) => {
                  shareInfo.shortCode = res.data.result.shortCode;
                  console.log(shareInfo)
                  this.$image.generateShareCourse(this.data.shareCavansOptions, shareInfo, 'child').then(imageUrl => {
                    shareInfo.imageUrl = imageUrl;
                    console.log(shareInfo.imageUrl)
                    this.setData({
                      shareHide: false,
                      shareInfo
                    });
                    console.log(this.data.shareHide)
                  });
                }
              )
            } else {
              this.$common.showMessage(this, res.data.errorMessage);
              return;
            }
          }
        )

      },
      // [events.ui.nopower](){
      //   console.log(1)
      //   this.$common.showMessage(this, '共享人没有开启修改孩子的权限');
      // },
      //隐藏分享遮罩层
      [events.ui.HIDE_SHARE](e) {
        this.setData({
          shareHide: true
        })
      },


      // 更换头像
      [events.ui.CHANGEPHOTO](e) {
        wx.showActionSheet({
          itemList: ['拍照', '从手机相册选择'],
          success: (res) => {

            console.log(res);

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
            // 选择头像
            wx.chooseImage({
              sourceType: sourceType,
              count: 1,
              success: (resp) => {
                // 切图
                wx.redirectTo({
                  url: '../../../upload/upload?src=' + resp.tempFilePaths[0] + '&type=child&childId=' + this.data.model.childId
                })
                console.log(this.data.manage)
                // 向服务器发送  头像
                this.$api.upload.upload(resp.tempFilePaths[0]).then(res => {

                  var imgsrc = this.$api.extparam.getFileUrl(res.key)
                  // console.log(imgsrc,'请求结果是：', res.key)
                  // 切换 
                  this.setData({
                    'resultModel.logo': imgsrc,
                    'paramModel.logo': imgsrc,
                    manage: 'false'
                  });
                });
              }
            })
          }
        });
      },

      // 昵称
      [events.ui.bindNickInput](e) {
        // console.log(e)
        var val = e.currentTarget.dataset.values;
        // 跳转
        url: '../school/school?comefrom=childMsg&childId=' + this.data.model.childId
        wx.navigateTo({
          url: '/pages/mydemo/pages/editName/rditname?val=' + val,
        })
        if (this.data.userEdit == 'true') {
          this.setData({
            'paramModel.name': e.detail.value,
            'resultModel.name': e.detail.value
          })
        }

      },

      // 性别
      [events.ui.bindSexInput](e) {
        let gender;
        if (e.detail.value == '女') {
          gender = 1
        } else if (e.detail.value == '男') {
          gender = 0
        }
        this.setData({
          'paramModel.gender': gender,
          'resultModel.gender': gender
        })
      },

      //隐藏性别弹框：
      [events.ui.hideGender](e) {
        console.log(2)
        this.setData({
          'resultModel.gender': e.currentTarget.dataset.index,
          'modifyModel.gender': e.currentTarget.dataset.index,
          'paramModel.gender': e.currentTarget.dataset.index,
          genderHide: true
        })
      },
      //显示性别弹框：
      [events.ui.showGender](e) {
        let i = e.currentTarget.dataset.id;
        console.log(i)
        this.setData({
          weeks: i,
          'resultModel.gender': i 
        })
        this.$storage.set('model.gender', i );
        // if (this.data.userEdit == 'true') {
        //   this.setData({
        //     genderHide: false
        //   })
        // }
      },
      //跳转学校：
      [events.ui.chooseSchools](e) {
        // wx.setStorageSync("personalChangeInfo", this.data.modifyModel);
        console.log(this.data.model.childId)
        if (this.data.userEdit == 'true'){
          wx.redirectTo({
            url: '/pages/mydemo/pages/school/school?comefrom=childMsg&childId=' + this.data.model.childId
          })
        }
      },

      // 保存
      [events.ui.saveChildInfo](e) {
        // 
        var a = this.data.resultModel
        // resultModel
        console.log('保存数据', a)
        put(effects.saveChildInfo, a);
      },
    }
  }

  mapEffect({
    put
  }) {
    return {
      [effects.updateChildShareListAuthority]({
        childId,
        id,
        edit
      }) {
        let Params = {
          shareId: id,
          childId: childId,
          edit: edit
        }
        // 孩子权限管理
        this.$api.circle.updateChildShareListAuthority(Params).then(s => {})
      },
      //显示分享遮罩层   // 页面加载时调用  销毁时取消
      [effects.SHAREINFOS](e) {
        // this.setData({
        //   shareHide: false,
        // });
        console.log('分享加载')
        let shareInfo = this.data.resultModel;
        const param = {};
        param.dataType = 3;
        param.data = {
          'childId': shareInfo.id
        };
        this.$api.user.shareInfoRecord(param).then(
          (res) => {
            if (res.data.errorCode == '0') {
              const param1 = {};
              param1.dataType = 0;
              param1.data = {
                'childId': shareInfo.id,
                'target': 'child',
                'shortCode': res.data.result.shortCode
              };
              // console.log(param1)
              this.$api.user.shareInfoRecord(param1).then(
                (res) => {
                  shareInfo.shortCode = res.data.result.shortCode;
                  console.log(shareInfo);
                  this.setData({
                    shareInfo: shareInfo
                  })
                  this.$image.generateShareCourse(this.data.shareCavansOptions, shareInfo, 'child').then(imageUrl => {
                    shareInfo.imageUrl = imageUrl;
                    console.log(shareInfo.imageUrl)
                    this.setData({
                      shareHide: false,
                      shareInfo
                    });
                    // console.log(this.data.shareHide)
                  });
                }
              )
            } else {
              this.$common.showMessage(this, res.data.errorMessage);
              return;
            }
          }
        )

      },
      [effects.deleteChildRelation]() {
        this.$api.circle.deleteChildShareAuthority(this.data.deleteParamModel).then(s => {
          if (s.data.errorCode == '0') {
            console.log(this.data.model)
            // 孩子权限
            this.$api.circle.getChildMessageRealtionList(this.data.model).then(res => {
              console.log(res.data.result)
              if (res.data.result != null) {
                this.setData({
                  relationList: res.data.result.relationList
                })
              } else {
                this.setData({
                  relationList: 0
                })
              }
            })
          }
        })
      },
      // 加载一个小孩信息
      [effects.loadOneChildInfo]() {
        console.log('当前孩子参数', this.data.model)
        // 孩子个数
        this.$api.circle.getChildListByCondition({}).then(res => {
          // console.log('孩子',res.data.result)
          this.setData({
            childHeigth: res.data.result.childList.length
          })
        })
        // getChildInfor修改孩子信息的权限
        this.$api.child.getChildInfor(this.data.model).then(res => {
          if (res.data.errorCode == '0') {
            this.setData({
              userEdit: res.data.result.childInfo.edit
            })
            // console.log(this.data.userEdit, this.data.relationList)
          }
        })
        // 孩子共享信息
        this.$api.circle.getChildMessageRealtionList(this.data.model).then(res => {
          if (res.data.result != null) {
            this.setData({
              relationList: res.data.result.relationList
            })
          } else {
            this.setData({
              relationList: 0
            })
          }
        })
        // 孩子信息
        this.$api.circle.getChildInfoByCondition(this.data.model).then(s => {
          console.log(s.data)
          if (s.data.errorCode == '0') {
            if (this.data.model.childId != '') {
              // 需要改id
              this.setData({
                resultModel: s.data.result.childInfo
              })
            } else {
              this.setData({
                resultModel: s.data.result.childInfo
              })
            }
            this.setData({
              'resultModel.childId': this.data.model.childId
            })
            console.log('全部信息', this.data.resultModel)
            if ((this.data.resultModel.logo == null) || ((this.data.resultModel.logo.indexOf("http") < 0) &&
                (this.data.resultModel.logo.indexOf("png") < 0) && (this.data.resultModel.logo.indexOf("jpg") < 0))) {
              console.log('没有头像', this.data.boyimg)
              this.setData({
                'resultModel.logo': this.data.boyimg
              })
            }

            wx.setStorage({
              key: 'resultModel',
              data: this.data.resultModel,
            })

            if (this.data.fromPage != '') {
              this.setData({
                // 'resultModel.school': this.data.schoolModel.school,
                // 'resultModel.schoolType': this.data.schoolModel.schoolType,
                // 'resultModel.city': this.data.schoolModel.city,
                // 'resultModel.schoolId': this.data.schoolModel.schoolid,
                'paramModel.school': this.data.schoolModel.school,
                'paramModel.schoolType': this.data.schoolModel.schoolType,
                'paramModel.city': this.data.schoolModel.city,
                'paramModel.schoolId': this.data.schoolModel.schoolid,
                // 'resultModel.schoolType': this.data.schoolModel.schoolType,
                // 'resultModel.city': this.data.schoolModel.city,
                // 'resultModel.schoolId': this.data.schoolModel.schoolid
              })
              console.log('学校信息', this.data.paramModel, this.data.resultModel)
            }

            // 头像
            // 地址
            // 性别
            // 昵称




          }
        })
      },
      // 保存孩子个人信息
      [effects.saveChildInfo](a) {



        this.$api.circle.updateChildInfo(a).then(s => {
          console.log(s.data)
          if (s.data.errorCode == '0') {
            wx.showToast({
              title: '保存成功',
            })
            console.log('家长');
            wx.removeStorageSync('resultModel')
            var time = null;
            time = setTimeout(() => {
              wx.navigateBack({
                delta: 2,
              })
            }, 500)

          } else if (s.data.errorCode == '100073' || s.data.errorCode == '100074') {
            wx.showToast({
              title: '保存失败',
              icon: 'loading',
            })
            this.$common.showMessage(this, s.data.errorMessage);
          }
        })
      },
      // 获取小孩信息
      [effects.GET_USER_INFO]() {
        this.$api.user.gerUserInfo().then(
          (res) => {
            if (res.data.errorCode == 0) {
              this.setData({
                userInfo: res.data.result
              })
              put(effects.SHAREINFOS)
              console.log('调用分享')
            } else {
              this.$common.showMessage(this, res.data.errorMessage);
              return;
            }
          }
        );
      },
      // 加载分享孩子信息
      [effects.loadShareChildInfo]() {
        this.$api.child.getShareInfo({
          code: this.data.resultCode
        }).then(s => {
          console.log(s.data.result)
          if (s.data.errorCode == '0') {
            let rs = s.data.result.childInfo;
            rs.logo = this.$api.extparam.getLogoUrl(rs.logo)
            rs.childName = rs.name;
            this.setData({
              resultModel: rs
            })
          } else {
            this.$common.showMessage(this, s.data.errorMessage)
          }
        })
      },
      // 添加小孩
      [effects.addChildToList]() {
        //this.$api.circle.copyChildInfoToUser({ code: '7899962155076551100005' }).then(s => {
        this.$api.circle.copyChildInfoToUser({
          code: this.data.resultCode
        }).then(s => {
          // 跳转到孩子列表
          wx.redirectTo({
            url: '../myChildren/myChildren?id=' + this.data.model.childId,
          })
        })
      },
      [effects.shareChildInfo]() {
        this.$api.circle.shareChildInfo(this.data.model).then(s => {
          if (s.data.errorCode == '0') {
            this.setData({
              shareCode: s.data.result.shortCode
            })
          }
        })
      },
      // 删除小孩
      [effects.deleteMyChild]() {
        let param = {
          'childId': this.data.model.childId
        }
        this.$api.circle.deleteChildInfo(param).then(s => {
          wx.showToast({
            title: '删除成功',
          })
          wx.removeStorageSync("childId")
          wx.removeStorageSync("childid_i")
          setTimeout(function() {
            wx.navigateBack({
              delta: 1,
            })
          }, 1000)

        })
      }
    }
  }
}


EApp.instance.register({
  type: editMyChildPage,
  id: 'editMyChildPage',
  config: {
    events,
    effects,
    actions
  }
});
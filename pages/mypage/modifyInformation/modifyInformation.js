import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../eea/index'
import {
  events,
  effects,
  actions
} from './modifyInformation.eea'

class modifyInformationPage extends EPage {
  get data() {
    return {
      paramModel: {
        childId: '', // 孩子ID、
        //name: '', // 孩子姓名
        //logo: '', // 孩子头像
        //gender: '', // 孩子性别
        //birthday: '', // 孩子出生年月
        //school: '', // 孩子学校
        //schoolType: '', // 学校类型   0：幼儿园  1：小学  2：初中  3：高中
        // city:''        // 城市

      },
      model: {},
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
        schoolType:'',
        school:'',
        city:''
      },
      fromPage:''
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        console.log(option)
        this.setData({
          'paramModel.childId': option.id,
          'model.childId': option.id
        })
        put(effects.loadMyChildrenInfo);

        if (typeof option.from != 'undefined') {
          this.setData({ fromPage: option.from })
        }

        this.$storage.get('schoolinfo.name').then(
          (name) => {
            this.setData({
              'schoolModel.school': name.data
            })
            console.log(name.data)
          },
          (reject) => {}
        );

        this.$storage.get('schoolinfo.city').then(
          (city) => {
            this.setData({
              'schoolModel.city': city.data
            })
          },
          (reject) => {}
        );
        this.$storage.get('schoolinfo.typecode').then(
          (typecode) => {
            this.setData({
              'schoolModel.schoolType': typecode.data
            });
          },
          (reject) => {}
        )
        this.setData({
          img: this.$api.extparam.getPageImgUrl('boyb'),
        })
      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      // 更换头像
      [events.ui.CHANGEPHOTO](e) {
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
                this.$api.upload.upload(resp.tempFilePaths[0]).then(res => {
                  this.setData({
                    'pageModel.logo': this.$api.extparam.getFileUrl(res.key)
                  });
                  this.setData({
                    'paramModel.logo': this.$api.extparam.getFileUrl(res.key)
                  });
                });
              }
            })
          }
        });
      },
      // 昵称
      [events.ui.bindNickInput](e) {
        this.setData({
          'paramModel.name': e.detail.value
        })
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
          'paramModel.gender': gender
        })
      },
      //隐藏性别弹框：
      [events.ui.hideGender](e) {
        this.setData({
          'pageModel.gender': e.currentTarget.dataset.index,
          'modifyModel.gender': e.currentTarget.dataset.index,
          'paramModel.gender': e.currentTarget.dataset.index,
          genderHide: true
        })
      },
      //显示性别弹框：
      [events.ui.showGender](e) {
        this.setData({
          genderHide: false
        })
      },
      //跳转学校：
      [events.ui.chooseSchool](e) {
        // wx.setStorageSync("personalChangeInfo", this.data.modifyModel);
        wx.redirectTo({
          url: '../../area/area?comefrom=modifyChildInfo&childId=' + this.data.model.childId
        })
      },
      // 学校
      [events.ui.bindSchoolInput](e) {
        this.setData({
          'paramModel.school': e.detail.value
        })
      },
      // 保存
      [events.ui.saveChildInfo](e) {
        put(effects.saveChildInfo);
      }
    }
  }

  mapEffect({
    put
  }) {
    return {
      [effects.loadMyChildrenInfo]() {
        this.$api.circle.getChildInfoByCondition(this.data.model).then(s => {
          if (s.data.errorCode == '0') {
            console.log(s.data.result.childInfo)
            this.setData({
              pageModel: s.data.result.childInfo
            })

            if (this.data.fromPage != '') {
              // 从地址页面回来
              this.setData({
                'pageModel.school': this.data.schoolModel.school,
                'paramModel.school': this.data.schoolModel.school,
                'paramModel.schoolType': this.data.schoolModel.schoolType,
                'paramModel.city': this.data.schoolModel.city
              })
            }
          }
        })
      },
      [effects.saveChildInfo]() {
        this.$api.circle.updateChildInfo(this.data.paramModel).then(s => {
          if (s.data.errorCode == '0') {
            wx.showToast({
              title: '保存成功',
            })
           
            let childId = this.data.paramModel.childId;
            setTimeout(function() {
              wx.navigateBack({ 
                url: '../editMyChild/editMyChild?childId=' + childId,
              })
            }, 1000)
          }else if(s.data.errorCode == '100073' || s.data.errorCode == '100074'){
            this.$common.showMessage(this,s.data.errorMessage);
          }
        })
      }
    }
  }
}

EApp.instance.register({
  type: modifyInformationPage,
  id: 'modifyInformationPage',
  config: {
    events,
    effects,
    actions
  }
});
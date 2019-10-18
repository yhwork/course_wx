import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../eea/index'
import {
  events,
  effects,
  actions
} from './p_info.eea'

class PInfoPage extends EPage {
  get data() {
    return {
      grade_selected: false,
      school_selected: false,
      model: {
        gender: '0'
      },
      genders: [{
          name: '男孩',
          value: '0',
          checked: 'true'
        },
        {
          name: '女孩',
          value: '1'
        },
      ],
      grade: [],
      showTopTips: false,
      message: ''
    };
  }


  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        if (typeof option.comeFrom != 'undefined') {
          this.setData({
            'model.comeFrom': option.comeFrom
          })
          this.$storage.set('model.comeFrom', option.comeFrom);
        }
        this.setData({
          girlb: this.$api.extparam.getPageImgUrl('girlb'),
          boyb: this.$api.extparam.getPageImgUrl('boyb'),
        })
      },
      [PAGE_LIFE.ON_SHOW](option) {
        //返回comefrom信息
        this.$storage.get('model.comeFrom').then(
          (res) => {
            this.setData({
              'model.comeFrom': res.data
            })
          },
          (reject) => {}
        );
        //返回学校信息
        this.$storage.get('schoolinfo.name').then(
          (name) => {
            this.setData({
              'model.school': name.data,
              school_selected: true
            })
          },
          (reject) => {}
        );
        this.$storage.get('schoolinfo.schoolid').then(
          (schoolid) => {
            this.setData({
              'model.schoolId': schoolid.data
            })
          },
          (reject) => {}
        );
        this.$storage.get('schoolinfo.city').then(
          (city) => {
            this.setData({
              'model.city': city.data
            })
          },
          (reject) => {}
        );
        this.$storage.get('schoolinfo.typecode').then(
          (typecode) => {
            this.setData({
              'model.schoolType': typecode.data
            });
            console.log(this.data.model.schoolType)
            if (this.data.model.schoolType) {
              put(effects.GET_GRADE);
            }
          },
          (reject) => {}
        )
        this.$storage.get('model.name').then(
          (name) => {
            this.setData({
              'model.name': name.data
            })
          },
          (reject) => {}
        );
        this.$storage.get('model.gender').then(
          (gender) => {
            this.setData({
              'model.gender': gender.data
            });
            if (gender.data == 0) {
              this.setData({
                'genders[0].checked': 'true'
              })
            } else {
              this.setData({
                'genders[1].checked': 'true'
              })
            }
          },
          (reject) => {}
        );

        this.$storage.get('model.logo').then(
          (logo) => {
            this.setData({
                'model.logourl': this.$api.extparam.getFileUrl(logo.data)
              }),
              this.setData({
                'model.logo': logo.data
              })
          },
          (reject) => {}
        );

      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      [events.ui.CHANGE_AVATAR]() {
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
                    'model.logourl': this.$api.extparam.getFileUrl(res.key)
                  });
                  this.setData({
                    'model.logo': res.key
                  });
                  this.$storage.set('model.logo', res.key);
                });
              }
            })
          }
        });
      },
      [events.ui.CHANGE_NAME](e) {
        this.setData({
          'model.name': e.detail.value
        });
        this.$storage.set('model.name', e.detail.value);
      },
      //选择性别
      [events.ui.CHANGE_GENDER](e) {
        this.setData({
          'model.gender': e.detail.value
        })
        this.$storage.set('model.gender', e.detail.value);
      },
      //选择年级
      [events.ui.CHANGE_GRADE](e) {
        if (this.data.grade[e.detail.value]) {
          this.setData({
            grade_selected: true,
          })
        }
        this.setData({
          greadindex: e.detail.value,
          'model.grade': this.data.grade[e.detail.value]
        })
      },
      [events.ui.VIEW_AREA](e) {
        wx.redirectTo({
          url: '../../mypage/school/school?comefrom=addChild'
        })
      },
      //保存
      [events.ui.SAVE]() {
        put(effects.SAVE_CHILD);
      },
      // 返回主页
      [events.ui.back]() {
        wx.switchTab({
          url: '../../mypage/mypage/mypage',
        })
      }
    }
  }

  mapEffect() {
    return {
      [effects.GET_GRADE]() {
        this.$api.area.grade(this.data.model).then((res) => this.setData({
          grade: res.data.result
        }));
      },
      [effects.SAVE_CHILD]() {
        const model = this.data.model;
        if (this.$common.isBlank(model.name)) {
          this.$common.showMessage(this, '名字不能为空');
          return false;
        }
        if (this.$common.isBlank(model.gender)) {
          this.$common.showMessage(this, '请选择性别');
          return false;
        }
        if (this.$common.isBlank(model.school)) {
          this.$common.showMessage(this, '请选择学校');
          return false;
        }
        if (this.$common.isBlank(model.grade)) {
          this.$common.showMessage(this, '请选择年级');
          return false;
        }
        this.$api.child.get().then(
          (res) => {
            if (res.data.errorCode == 0) {
              const childNum = res.data.result.childList.length;
              if (childNum < 5) {
                this.$api.child.create(model).then(
                  (res) => {
                    
                      this.$storage.clear();
                      if (typeof model.comeFrom != 'undefined' && model.comeFrom == 'addChild') {
                        wx: wx.navigateBack({
                          delta: 1,
                        })
                      }else if (typeof this.data.model.comeFrom != 'undefined' && this.data.model.comeFrom == 'firstaddChild') {
                        wx.switchTab({
                          url: '../mypage/mypage/mypage'
                        })
                      } else if (typeof this.data.model.comeFrom != 'undefined' && this.data.model.comeFrom == 'courseaddchild') {
                        wx.redirectTo({
                          url: '../../mypage/myChildren/myChildren'
                        })
                      } else {
                        wx.navigateTo({
                          url: '../../course/p_add/schoolout_add1?childId=' + res.data.result.childId
                        })
                      }
                    
                  }
                );
              } else {
                this.$common.showModalError('最多可以添加5个孩子。');
              }
            } else if (res.data.errorCode == '100006') {
              this.$api.child.create(model).then(
                (res) => {

                  this.$storage.clear();
                  if (typeof this.data.model.comeFrom != 'undefined' && this.data.model.comeFrom == 'addChild') {
                    wx.redirectTo({
                      url: '../../mypage/myChildren/myChildren'
                    })
                  } else {
                    wx.navigateTo({
                      url: '../../course/p_add/schoolout_add1?childId=' + res.data.result.childId
                    })
                  }


                }
              );
            }
          },
          (rej) => {}
        )
      }

    }
  }
}

EApp.instance.register({
  type: PInfoPage,
  id: 'PInfoPage',
  config: {
    events,
    effects,
    actions
  }
});
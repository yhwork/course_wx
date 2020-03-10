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
      weeks: 1,
      model: {
        gender: '0',
        name: "",
        school: '',
        grade: '',
        logo: ''
      },
      genders: [{
        name: '男孩',
        value: '0',
        checked: 'true'
      },
      {
        name: '女孩',
        value: '1',
        checked: 'false'
      },
      ],
      weeks: 1,
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
        console.log('值', option)
        // 获取昵称
        if (typeof option.comeFrom != 'undefined') {
          this.setData({
            'model.comeFrom': option.comeFrom
          })
          this.$storage.set('model.comeFrom', option.comeFrom);
        }
        // 获取性别
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
          (reject) => { }
        );
        //返回学校信息
        this.$storage.get('schoolinfo.name').then(
          (name) => {
            this.setData({
              'model.school': name.data,
              school_selected: true
            })
          },
          (reject) => { }
        );
        this.$storage.get('schoolinfo.schoolid').then(
          (schoolid) => {
            this.setData({
              'model.schoolId': schoolid.data
            })
          },
          (reject) => { }
        );
        this.$storage.get('schoolinfo.city').then(
          (city) => {
            this.setData({
              'model.city': city.data
            })
          },
          (reject) => { }
        );
        this.$storage.get('schoolinfo.typecode').then(
          (typecode) => {
            this.setData({
              'model.schoolType': typecode.data
            });
            // 自定义
            console.log(this.data.model.schoolType)
            // if (this.data.model.schoolType) {
            put(effects.GET_GRADE);
            // }
          },
          (reject) => { }
        )
        this.$storage.get('model.name').then(
          (name) => {
            this.setData({
              'model.name': name.data
            })
          },
          (reject) => { }
        );
        this.$storage.get('model.gender').then(
          (gender) => {
            this.setData({
              'model.gender': gender.data
            });
            if (gender.data == 0) {
              this.setData({
                weeks: 1,
                'genders[0].checked': 'true'
              })
            } else {
              this.setData({
                weeks: 2,
                'genders[1].checked': 'true'
              })
            }
          },
          (reject) => { }
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
          (reject) => { }
        );

      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      // 性别
      [events.ui.getisweek](e) {
        let i = e.currentTarget.dataset.id;
        console.log(i - 1)
        this.setData({
          weeks: i,
          'model.gender': i - 1
        })
        this.$storage.set('model.gender', i - 1);
      },
      // 头像
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
                    'model.logo': this.$api.extparam.getFileUrl(res.key)
                  });
                  // this.setData({
                  //   'model.logo': res.key
                  // });
                  console.log('图片头像', res.key)
                  this.$storage.set('model.logo', this.data.model.logo);
                });
              }
            })
          }
        });
      },

      // 昵称
      [events.ui.CHANGE_NAME](e) {
        this.setData({
          'model.name': e.detail.value
        });
        console.log(e.detail.value)
        this.$storage.set('model.name', e.detail.value);
      },



      // 学校   添加学校
      [events.ui.CHANGE_SCHOOL](e) {
        let val = e.detail.value
        if (this.$common.isBlank(val)) {
          wx.showToast({
            icon: 'none',
            title: '请输入标准的学校名称',
            duration: 3000
          })
          return false;
        }




        // 把学校添加进库里面-----可以最后添加的
        // this.$api.area.addSchool({
        //   schoolName: val
        // }).then(res => {
        //   if (res.data.errorCode == 0) {
        //     wx.showToast({
        //       title: '添加成功',
        //     })
        //     this.setData({
        //       schoolname: val,
        //       schoolid: res.data.result.schoolId
        //     })
        //     // this.$storage.set('schoolinfo.name', this.data.inputname);
        //     // this.$storage.set('schoolinfo.schoolid', res.data.result.schoolId);
        //     // this.$storage.set('schoolinfo.city', '自定义');
        //     // this.$storage.set('schoolinfo.typecode', 0);
        //   }
        // })
        // 把学校添加进库里面-----可以最后添加的
        this.$api.area.addSchool({ schoolName: val }).then(res => {
          if (res.data.errorCode == 0) {
            this.setData({
              'model.school': val,
              'model.schoolId': res.data.result.schoolId,
              'model.schoolType': 0,
              'model.city': '上海'

            })
            console.log('学校的名称', res)
          } else {
            wx.showToast({
              icon: 'none',
              title: '添加失败',
              duration: 3000
            })
          }
        }).catch(res => {
          wx.showToast({
            icon: 'none',
            title: '添加失败',
            duration: 3000
          })
        })

      },
      //选择性别
      [events.ui.CHANGE_GENDER](e) {
        console.log(e.detail.value)
        this.setData({
          'model.gender': e.detail.value
        })
        console.log(e.detail.value)
        this.$storage.set('model.gender', e.detail.value);
      },
      //选择年级
      [events.ui.CHANGE_GRADES](e) {
        let school = this.data.model.school
        // 如果没有学校
        if (!school) {
          return wx.showToast({
            title: '请先选择学校',
            icon: 'none',

          })
        }
        this.setData({
          'model.grade': e.detail.value
        })
        console.log(e.detail.value)
        this.$storage.set('model.grade', e.detail.value);
      },

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
        // 选择学校
        console.log('学校', e)
        wx.navigateTo({
          url: '/pages/mydemo/pages/school/school?comefrom=addChild'
        })
      },
      //保存
      [events.ui.SAVE]() {
        // 验证数据

        put(effects.SAVE_CHILD);
      },
      // 返回主页
      [events.ui.back]() {
        wx.navigateBack({
          delta: 1,
        })
      }
    }
  }

  mapEffect() {
    return {
      [effects.GET_GRADE]() {
        this.$api.area.grade(this.data.model).then((res) => {
          console.log('获取班级', this.data.model, res.data.result);
          this.setData({
            grade: res.data.result
          })
        });
      },
      [effects.SAVE_CHILD]() {
        const model = this.data.model;
        console.log('保存数据', model)
        if (!model.logo) {
          model.logo = 'https://oss.iforbao.com/public/assets/img/girlb.png'
        }
        if (model.name == '') {
          wx.showToast({
            title: '名字不能为空',
            icon: 'none',
          })
          return false;
        }
        if (model.school == '') {

          return wx.showToast({
            title: '请选择学校',
            icon: 'none',
          });
        }
        if (model.grade == '') {

          return wx.showToast({
            title: '请选择年级',
            icon: 'none',
          });
        }
        this.$api.child.get().then(
          (res) => {
            if (res.data.errorCode == 0) {
              const childNum = res.data.result.childList.length;
              if (childNum < 5) {
                console.log('创建孩子数据1', model, res.data);
                this.$api.child.create(model).then(
                  (res) => {
                    wx.removeStorageSync('resultModel')
                    wx.removeStorageSync('model.comeFrom')
                    wx.removeStorageSync('model.name')
                    wx.removeStorageSync('schoolinfo.name')
                    wx.removeStorageSync('schoolinfo.typecode')
                    wx.removeStorageSync('schoolinfo.schoolid')
                    // this.$storage.clear();
                    if ( model.comeFrom == 'addChild') {
                      wx.switchTab({
                        url: '/pages/course/courseList/courseList',
                      })
                    } else if ( this.data.model.comeFrom == 'firstaddChild') {
                      wx.switchTab({
                        url: '../mypage/mypage/mypage'
                      })
                    } else if (typeof this.data.model.comeFrom != 'undefined' && this.data.model.comeFrom == 'courseaddchild') {
                      wx.navigateTo({
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
              console.log('创建孩子数据2', model)
              this.$api.child.create(model).then(
                (res) => {
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
          (rej) => { }
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
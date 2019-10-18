import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../eea/index'
import {
  events,
  effects,
  actions
} from './t_info.eea'

class TInfoPage extends EPage {
  get data() {
    return {
      model: {
        type: '1',
        className: ''
      },
      types: [{
          name: '全日制学校',
          value: '1',
          checked: 'true'
        },
        {
          name: '非全日制学校',
          value: '2'
        },
      ]
    };
  }


  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {

        this.setData({
          xinxi: this.$api.extparam.getPageImgUrl('xinxi')
        })
        // this.$api.extparam.getPageImgUrl('xinxi').then(res => {
        //   console.log(res)
        // })
        // console.log(this.data.xinxi)
      },
      [PAGE_LIFE.ON_SHOW](option) {
        //返回教学科目信息
        this.$storage.get('subjectinfo').then(
          (subjectinfo) => {
            this.setData({
              'model.subject': subjectinfo.data.name,
              'model.subjectid': subjectinfo.data.id,
            })
          },
          (reject) => {}
        );

        this.$storage.get('model.name').then(
          (name) => {
            this.setData({
              'model.name': name.data
            })
          },
          (reject) => {}
        );
        this.$storage.get('model.className').then(
          (name) => {
            this.setData({
              'model.className': name.data
            })
          },
          (reject) => {}
        );


        this.$storage.get('model.type').then(
          (type) => {
            this.setData({
              'model.type': type.data
            });
            if (type.data == 1) {
              this.setData({
                'types[0].checked': 'true'
              })
              this.$storage.get('schoolinfo.schoolid').then(
                (schoolid) => {
                  this.setData({
                    'model.schoolid': schoolid.data
                  })
                },
                (reject) => {}
              );
              this.$storage.get('schoolinfo.name').then(
                (name) => {
                  this.setData({
                    'model.schoolname': name.data
                  })
                },
                (reject) => {}
              );
            } else {
              this.setData({
                'types[1].checked': 'true'
              })
              this.$storage.get('model.schoolname').then(
                (name) => {
                  this.setData({
                    'model.schoolname': name.data
                  })
                },
                (reject) => {}
              );
            }
          },
          (reject) => {
            this.$storage.get('schoolinfo.schoolid').then(
              (schoolid) => {
                this.setData({
                  'model.schoolid': schoolid.data
                })
              },
              (reject) => {}
            );
            this.$storage.get('schoolinfo.name').then(
              (name) => {
                this.setData({
                  'model.schoolname': name.data
                })
              },
              (reject) => {}
            );
          }
        );



      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      //选择教师类别
      [events.ui.CHANGE_TYPE](e) {
        this.setData({
          'model.type': e.detail.value
        })
        this.$storage.set('model.type', e.detail.value);
      },
      //姓名
      [events.ui.CHANGE_NAME](e) {
        this.setData({
          'model.name': e.detail.value
        });
        this.$storage.set('model.name', e.detail.value);
      },
      //学校
      [events.ui.CHANGE_SCHOOLNAME](e) {
        this.setData({
          'model.schoolname': e.detail.value
        });
        this.$storage.set('model.schoolname', e.detail.value);
      },
      //班级
      // [events.ui.CHANGE_CLASSNAME](e) {
      //   this.setData({
      //     'model.className': e.detail.value
      //   });
      //   this.$storage.set('model.className', e.detail.value);
      // },


      //保存
      [events.ui.SAVE_NEXT]() {
        put(effects.SAVE_NEXT);
      }
    }
  }

  mapEffect({
    put
  }) {
    return {

      [effects.SAVE_NEXT]() {
        const model = this.data.model;
        console.log(model)
        if (this.$common.isBlank(model.name)) {
          this.$common.showMessage(this, '姓名不能为空');
          return false;
        }
        if (this.$common.isBlank(model.type)) {
          this.$common.showMessage(this, '选择教师类别');
          return false;
        }
        if (this.$common.isBlank(model.schoolname)) {
          this.$common.showMessage(this, '请输入学校名称');
          return false;
        }
        if (this.$common.isBlank(model.subject)) {
          this.$common.showMessage(this, '请选择教学科目');
          return false;
        }
        put(effects.SAVE_TEACHER)
      },
      // 
      [effects.SAVE_TEACHER]() {
        const model = this.data.model;
        this.$api.user.createTeacher(model).then(
          (res) => {

            if (res.data.errorCode == 0) {
              // console.log('完成1')
              this.$api.auth.clearToken().then(res => {
                this.$storage.clear()
                // console.log('完成2')
              })
              wx.switchTab({
                url: '../../course/courseList/courseList',
                success: () => {
                  // console.log('跳转成功')
                },
                fail: (err) => {
                  // console.log('跳转失败', err)
                },
                complete: function(res) {},
              });
            } else {
              console.log('失败')
              this.$common.showMessage(this, res.data.errorMessage);
              return;
            }
          }
        );
      }
    }
  }
}

EApp.instance.register({
  type: TInfoPage,
  id: 'TInfoPage',
  config: {
    events,
    effects,
    actions
  }
});
import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../eea/index'
import {
  events,
  effects,
  actions
} from './schoolout_manage_share.eea'
const moment = require('../../../lib/moment.min.js');

class SchooloutManageSharePage extends EPage {

  get data() {
    return {
      toView:'',
      scrollTop: 100,
      userInfo: {}, //当前用户信息
      model: {},
      childInfo: {},
      courseInfo: {},
      showConflict: false
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        const courseId = option.courseId; //课程id
        const code = option.code;
        this.setData({
          'model.courseId': courseId,
          'model.code': code
        });
        //获取用户信息
        put(effects.GET_USER_INFO);
      },
      [PAGE_LIFE.ON_SHOW](option) {

      }
    }
  }


  mapUIEvent({
    put
  }) {
    return {
      //查看位置
      [events.ui.OPEN_LOCATION](e) {
        let longitude = Number(this.data.courseInfo.longitude);
        let latitude = Number(this.data.courseInfo.latitude);
        wx.openLocation({
          latitude: latitude,
          longitude: longitude
        })
      },
      //选择孩子
      [events.ui.CHOOSE_CHILD](e) {
        let childId = e.currentTarget.dataset.childid;
        this.setData({
          'model.childId': childId
        })
        put(effects.IMPORT_COURSE)
      },
      //关闭层
      [events.ui.CLOSE_LAYER](e) {
        this.setData({
          showConflict: false
        })
      },
      // 确定
      [events.ui.SURE_LAYER](e) {
        this.setData({
          showConflict: false
        })
        put(effects.IMPORT_COURSE)
      },
      //跳转详情页
      [events.ui.VIEW_LESSON_DETAIL](e) {
        let lessonId = e.currentTarget.dataset.lessonid;
        wx.navigateTo({
          url: '../p_lesson/schoolout_lesson_detail?lessonId=' + lessonId + '&childId=' + this.data.model.childId + '&source=share'
        })
      },
      //添加课程
      [events.ui.ADD_COURSE](e) {
        if (this.data.userInfo.role == '0') {
          wx.navigateTo({
            url: '../../register/info/p_info'
          })
        } else {
          wx.navigateTo({
            url: '../t_add/class/choose_class'
          })
        }
      }
    }
  }


  mapEffect({
    put
  }) {
    const api = this.$api;
    const common = this.$common;
    return {

      //用户信息
      [effects.GET_USER_INFO]() {
        api.user.gerUserInfo().then(
          (res) => {
            if (res.data.errorCode == 0) {
              this.setData({
                userInfo: res.data.result
              })
              put(effects.GET_COURSE_BY_ID);
              put(effects.LOAD_CHILDALL);
            } else {
              //this.$common.showMessage(this,res.data.errorMessage);
              return;
            }
          }
        );
      },

      //全部孩子
      [effects.LOAD_CHILDALL]() {
        api.child.get().then(
          (res) => {
            if (res.data.errorCode == 0) {
              this.setData({
                'loadChildAll': true
              });
              res.data.result.childList.forEach(function(e) {
                e.logo = api.extparam.getLogoUrl(e.logo)
              })
              this.setData({
                'childList': res.data.result.childList
              });
            }
          },
          (rej) => {}
        )
      },

      //课程详细信息
      [effects.GET_COURSE_BY_ID]() {
        api.course.getone(this.data.model).then(
          (res) => {
            const rs = res.data.result;
            rs.beginDate = moment(rs.issueTime).format('YYYY-MM-DD')
            rs.endDate = moment(rs.finishTime).format('YYYY-MM-DD')
            rs.startClassTime = moment(rs.startTime, 'HH:mm').format('HH:mm')
            rs.endClassTime = moment(rs.endTime, 'HH:mm').format('HH:mm')
            this.setData({
              courseInfo: rs
            })
          },
          (rej) => {}
        )
      },

      //导入课程
      [effects.IMPORT_COURSE]() {
        const model = this.data.model;
        api.course.imporCourse(model).then(
          (res) => {
            if (res.data.errorCode == '0') {
              this.$storage.set('childId', model.childId).then(
                wx.switchTab({
                  url: '../course'
                })
              )
              wx.showToast({
                title: '导入成功',
                icon: 'success',

                duration: 1500,
                mask: true,
             
              })
            } else if (res.data.errorCode == '100070') {
              let rs = res.data.result;
              rs.forEach(
                (item) => {
                  item.date = moment(item.start_time, 'YYYY-MM-DD').format('YYYY-MM-DD')
                  item.beginTime = moment(item.start_time, 'YYYY-MM-DD HH:mm').format('HH:mm')
                  item.endTime = moment(item.end_time, 'YYYY-MM-DD HH:mm').format('HH:mm')
                  item.weekDay = this.$converter.getWeekDay(item.date)
                }
              )

              this.setData({
                showConflict: true,
                conflictList: rs
              })
              wx.showToast({
                title: res.data.errorMessage,
                icon: 'none',
                duration: 1500,
                mask: true,

              })
            } else if (res.data.errorCode == '100073' || res.data.errorCode == '100074') {
              common.showMessage(this, res.data.errorMessage);
              wx.showToast({
                title: res.data.errorMessage,
                icon: 'none',
                duration: 1500,
                mask: true,

              })
            }

          },
          (rej) => {

          }
        );
      }

    }
  }
}

EApp.instance.register({
  type: SchooloutManageSharePage,
  id: 'SchooloutManageSharePage',
  config: {
    events,
    effects,
    actions
  }
});
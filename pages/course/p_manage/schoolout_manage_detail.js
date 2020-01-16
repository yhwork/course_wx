import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../eea/index'
import {
  events,
  effects,
  actions
} from './schoolout_manage_detail.eea'
const moment = require('../../../lib/moment.min.js');

class SchooloutManageDetailPage extends EPage {

  get data() {
    return {
      shareHide: true,
      userInfo: {}, //当前用户信息
      activeIndex: 0,
      model: {
        childId: '',
        currentMonth: moment().format('YYYY-MM'),
        courseStatus: ''
      },
      childInfo: {},
      courseInfo: {},
      lessonInfo: {},
      remindItems: [{
          name: '不提醒',
          value: 0
        },
        {
          name: '课前15分钟',
          value: 15
        },
        {
          name: '课前30分钟',
          value: 30
        },
        {
          name: '课前1小时',
          value: 60
        },
        {
          name: '课前2小时',
          value: 120
        },
        {
          name: '课前3小时',
          value: 180
        },
        {
          name: '课前1天',
          value: 1440
        }
      ],
      lessonInfoCalendar: [],
      calendarClass: 'calendar_mask',
      showCalendar: false,
      CALENDAR_NAME: '切换日历',
      scrollTop:0,
      shareCavansOptions: {
        id: 'share_canvas',
        width: 0,
        height: 0
      }
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      // 屏幕滚动
      [PAGE_LIFE.ON_PAGE_SCROLL](ev){
        console.log('滚动',ev)
        var _this = this;
        //当滚动的top值最大或者最小时，为什么要做这一步是由于在手机实测小程序的时候会发生滚动条回弹，所以为了解决回弹，设置默认最大最小值   
        if (ev.scrollTop <= 0) {
          ev.scrollTop = 0;
        } else if (ev.scrollTop > wx.getSystemInfoSync().windowHeight) {
          ev.scrollTop = wx.getSystemInfoSync().windowHeight;
        }
        //判断浏览器滚动条上下滚动   
        if (ev.scrollTop > this.data.scrollTop || ev.scrollTop == wx.getSystemInfoSync().windowHeight) {
            console.log('向下滚动');
           
           } else {
            console.log('向上滚动');  
            }  
          //给scrollTop重新赋值    
          setTimeout(function () {
            _this.setData({
              scrollTop: ev.scrollTop
            })
          }, 10)
    
      },
      [PAGE_LIFE.ON_LOAD](option) {
        wx.hideShareMenu();
        const {
          shareCavansOptions
        } = this.data;
        shareCavansOptions.width = wx.getSystemInfoSync().screenWidth;
        shareCavansOptions.height = shareCavansOptions.width * 5 / 4;
        this.setData({
          shareCavansOptions
        });
        console.log('值',option)
        this.setData({
          editpower: option.editpower    //
        })
        console.log(this.data.editpower)
        //获取用户信息
        put(effects.GET_USER_INFO);

        const childId = option.childId; //链接过来的childId
        const courseId = option.courseId; //课程id
        this.setData({
          'model.childId': childId,
          'model.courseId': courseId
        });
      },
      [PAGE_LIFE.ON_SHOW](option) {
        put(effects.GET_CHILD);
        put(effects.GET_COURSE_BY_ID);
        put(effects.GET_LESSONS_BY_COURSEID);
      },
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
            title: `[${userInfo.nickName}@您]给您分享了${shareInfo.orgName}《${shareInfo.name}》课程，点击加入课表`,
            path: `/pages/course/courseList/courseList?action=share&code=${shareInfo.shortCode}`,
            imageUrl: `${shareInfo.imageUrl}`,
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
      }
    }
  }
  mapUIEvent({
    put
  }) {
    return {
      [events.ui.TAB_CLICK](e) {
        let activeIndex = e.currentTarget.dataset.id
        this.setData({
          activeIndex: activeIndex,
          'model.condition': activeIndex
        });
        if (activeIndex == '0') {
          this.setData({
            'model.courseStatus': ''
          })
        } else if (activeIndex == '1') {
          this.setData({
            'model.courseStatus': '1'
          })
        } else if (activeIndex == '2') {
          this.setData({
            'model.courseStatus': '0'
          })
        } else if (activeIndex == '3') {
          this.setData({
            'model.courseStatus': '2'
          })
        }
        if (this.data.showCalendar) {
          put(effects.GET_CHECKWORK);
        } else {
          put(effects.GET_LESSONS_BY_COURSEID);
        }
      },
      //切换日历
      [events.ui.CHANGE_CALENDAR](e) {
        if (this.data.showCalendar) {
          this.setData({
            CALENDAR_NAME: '切换日历'
          })
          put(effects.GET_LESSONS_BY_COURSEID);
        } else {
          this.setData({
            CALENDAR_NAME: '切换列表'
          })
          put(effects.GET_CHECKWORK);
        }
        this.setData({
          'showCalendar': !this.data.showCalendar,
          'model.currentMonth': moment().format('YYYY-MM')
        })
      },
      //查看位置
      [events.ui.OPEN_LOCATION](e) {
        let longitude = Number(this.data.courseInfo.longitude);
        let latitude = Number(this.data.courseInfo.latitude);
        wx.openLocation({
          latitude: latitude,
          longitude: longitude
        })
      },
      //修改
      [events.ui.OPE_EDIT](e) {
        wx.navigateTo({
          url: './schoolout_manage_edit?childId=' + this.data.model.childId + '&courseId=' + this.data.model.courseId
        })
      },
      //删除
      [events.ui.OPE_DEL](e) {
        wx.showModal({
          title: '提示',
          content: '你确定要删除当前课程么？',
          showCancel: true,
          confirmColor: '#FF4500',
          success: function(res) {
            if (res.confirm) {
              put(effects.DEL_COURSE);
            }
          }
        })
      },
      [events.ui.nopower]() {
        this.$common.showMessage(this, '共享人没有开启孩子的权限');
      },
      //接收月份改变
      [events.ui.CALENDAR_MONTH_CHANGED](e) {
        const currentMonth = moment(e.detail.currentYear + ' ' + e.detail.currentMonth).format('YYYY-MM');
        this.setData({
          'model.currentMonth': currentMonth
        })
        put(effects.GET_CHECKWORK);
      },
      //显示分享遮罩层
      [events.ui.SHOW_SHARE](e) {
        let shareInfo = this.data.courseInfo; //console.log(shareInfo);return;
        const param = {};
        param.dataType = 1;
        param.data = {
          'courseId': shareInfo.id
        };
        this.$api.user.shareInfoRecord(param).then(
          (res) => {
            if (res.data.errorCode == '0') {
              const param1 = {};
              param1.dataType = 0;
              param1.data = {
                'courseId': shareInfo.id,
                'target': 'course',
                'shortCode': res.data.result.shortCode
              };
              this.$api.user.shareInfoRecord(param1).then(
                (res) => {
                  console.log(res.data.result.shortCode)
                  shareInfo.shortCode = res.data.result.shortCode;
                  this.$image.generateShareCourse(this.data.shareCavansOptions, shareInfo, 'course').then(imageUrl => {
                    shareInfo.imageUrl = imageUrl;
                    this.setData({
                      shareHide: false,
                      shareInfo
                    });
                  });
                }
              )
            } else {
              this.$common.showMessage(this, res.data.errorMessage);
              return;
            }
          }
        )

      }, //隐藏分享遮罩层
      [events.ui.HIDE_SHARE](e) {
        this.setData({
          shareHide: true
        })
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
            } else {
              this.$common.showMessage(this, res.data.errorMessage);
              return;
            }
          }
        );
      },
      //一个孩子的信息
      [effects.GET_CHILD]() {
        api.child.get(this.data.model).then(
          (res) => {
            this.setData({
              'childInfo': res.data.result.childList[0],
              'childInfo.logo': api.extparam.getLogoUrl(res.data.result.childList[0].logo)

            });
            if (common.isBlank(this.data.model.childId)) {
              this.setData({
                'model.childId': res.data.result.childList[0].childId
              });
            }
          },
          (rej) => {}
        )
      },

      //课程详细信息
      [effects.GET_COURSE_BY_ID]() {
        console.log('课程信息',this.data.model)
        let rs = {}
        api.course.getone(this.data.model).then(
          (res) => {
            console.log('课程信息', res)
            rs = res.data.result;
            rs.beginDate = moment(rs.issueTime).format('YYYY-MM-DD')
            rs.endDate = moment(rs.finishTime).format('YYYY-MM-DD')
            rs.beginTime = moment(rs.startTime, 'HH:mm').format('HH:mm')
            rs.endTime = moment(rs.endTime, 'HH:mm').format('HH:mm')
            rs.notifyTxt = ''
            this.data.remindItems.forEach(function(e) {
              if (e.value == rs.notify) {
                rs.notifyTxt = e.name
              }
            })
            // console.log('课程信息',rs)
            this.setData({
              courseInfo: rs
            })
          },
          (rej) => {}
        )
      },
      //课程对应的课节列表
      [effects.GET_LESSONS_BY_COURSEID]() {
        api.course.getLesson(this.data.model).then(
          (res) => {
            console.log(res)
            const converter = this.$converter;
            const rs = res.data.result;
            rs.courseList.forEach(function(e) {
              e.formatDate = moment(e.startTime).format('YYYY-MM-DD')
              e.formatBeginTime = moment(e.startTime, 'YYYY-MM-DD HH:mm').format('HH:mm')
              e.formatEndTime = moment(e.endTime, 'YYYY-MM-DD HH:mm').format('HH:mm')
              e.weekDay = converter.getWeekDay(e.formatDate)
              if (typeof e.status == 'undefined') {
                e.status = ''
              }
            })
            this.setData({
              'lessonInfo.list': rs.courseList, //status:1=出勤 0=未上; type:1=缺课 2=调课 3=补课
              'lessonInfo.allClass': rs.allClass,
              'lessonInfo.attendClass': rs.attendClass, //出勤
              'lessonInfo.absentClass': rs.absentClass, //缺勤
              'lessonInfo.leftClass': rs.leftClass, //剩余
              'lessonInfo.leftClassShow': Number(rs.leftClass) + Number(rs.absentClass),
              'lessonInfo.percent': Math.round(rs.attendClass / rs.allClass * 100) //百分比
            })
          },
          (rej) => {}
        )
      },
      //删除课程
      [effects.DEL_COURSE]() {
        api.course.deleteCourse(this.data.model).then(
          (res) => {
            put(effects.GET_CHILD);
          },
          (rej) => {}
        )
      },
      //课程对应的课节状态信息
      [effects.GET_CHECKWORK]() {
        api.course.monthCheckWork(this.data.model).then(
          (res) => {
            console.log(res)
            if (res.data.errorCode == '0') {
              const rs = res.data.result.courseDetails
              rs.forEach(
                (item) => {
                  item.year = moment(item.date).format('YYYY')
                  item.month = moment(item.date).format('M')
                  item.day = moment(item.date).format('D')
                }
              )
              this.setData({
                lessonInfoCalendar: res.data.result.courseDetails,
              });
            } else if (res.data.errorCode == '100006') {
              this.setData({
                lessonInfoCalendar: []
              });
            }
          },
          (rej) => {}
        )
      }
    }
  }
}

EApp.instance.register({
  type: SchooloutManageDetailPage,
  id: 'SchooloutManageDetailPage',
  config: {
    events,
    effects,
    actions
  }
});
import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../eea/index'



import {
  events,
  effects,
  actions
} from './course.eea'

import moment from '../../lib/moment.min.js'

class CoursePage extends EPage {
  get data() {
    return {
      title:'快点添加课程吧！',
      btnclick: false,
      userInfo: {}, //当前用户信息
      lessons: [], //一周的课 
      dayLessons: [], //当天的课
      morelessons: [], //更多的课
      monthLessonNum: [], //某月每天的课节数
      select_time:{
        date:'',
        time:''
      },
      model: {
        currentDate: moment().format('YYYY-MM-DD'),
        currentMonth: moment().format('YYYY-MM'),
        childId: '',
        diff: 0,
        comefrom: ''
      },
      url: "https://qa.oss.iforbao.com/public",
      childInfo: {},
      childId: '',
      showCalendar: false,
      loadChildAll: false,
      childList: {},
      showFollowModel: false,
      code: '',
      isShare: 0,
      productId: "",
      courseId: "",
      changeText: true,
      childpeportType: [{
          id: '0',
          value: '课程添加',
          src: 'coursecourseadd'
        },
        {
          id: '1',
          value: '课程管理',
          src: 'courseset'
        },
        {
          id: '2',
          value: '课表创建',
          src: 'coursecreate'
        },
        {
          id: '3',
          value: '孩子共享',
          src: 'courseshare'
        }
      ],
      teacherpeportType: [{
          id: '0',
          value: '课程添加',
          src: 'coursecourseadd'
        },
        {
          id: '1',
          value: '课程管理',
          src: 'courseset'
        },
        {
          id: '2',
          value: '班级创建',
          src: 'coursecreate'
        }
      ],
      isSubmit: true,
      isList: true, // 日历界面
      current: '',  // 校内课还是校外课
      isback: false,
      productCourseId: "",
    };
  }
  mapPageEvent({
    put,
    dispatch
  }) {
    return {

      /**
       * loadAllCourseTimeList   // 校外
       * 
       * 
       * getAllInternalCourseName  // 校内校外
       * 
       * 
       */
      [PAGE_LIFE.ON_LOAD](option) {
        console.log('值',option)
        if (option.hasOwnProperty('childId')) {
          this.setData({
            childId: option.childId,
            btnclick: false,
          })
          console.info('有小孩')
          put(effects.GET_USER_INFO); // 获取用户信息
        }else{
          console.info('莫有小孩')
          wx.getStorage({
            key: 'childId',
            success:(res)=>{
              this.setData({
                childId: option.childId
              })
            },
            fail:(res)=>{
              console.log('获取小孩失败')
              this.$api.child.get().then(
                res => {
                  this.setData({
                    'childId': res.data.result.childList[0].childId
                  })
                })
            },
            complete: function(res) {},
          })
          put(effects.GET_USER_INFO); // 获取用户信
        }
        if (option.isback) {
          this.setData({
            isback: option.isback
          })
        } else {
          this.setData({
            isback: false
          })
        }
        // 判断是否是 校内 校外 查看更多
        if (option.hasOwnProperty('current')) {
          this.setData({
            'model.lessonDate': this.data.model.currentDate,
            current: option.current
          })

          this.$api.child.get().then(
            res => {
              console.log('所有小孩列表', res.data.result.childList,'现在小孩的id',this.data.childId);
              let childList = res.data.result.childList;
              let childId = this.data.childId
              if (childList && childId){
               let data =  childList.filter(res=>childId == res.childId)
               console.log('是否一样',data,childId)
                this.setData({
                  'model.childId': data[0].childId
                })
              }else{
                this.setData({
                  'model.childId': res.data.result.childList[0].childId
                })
              }
             
              if (option.current == 0) {
                put(effects.GET_USER_INFO); // 获取用户信息
              } else {
                put(effects.GET_USER_INFO); // 获取用户信息
              }
            })
        }
        if (option.productId != undefined || option.courseId != undefined || option.current != undefined || option.productCourseId != undefined || option.childId != undefined) {
          this.setData({
            productId: option.productId,
            courseId: option.courseId,
            current: option.current,
            productCourseId: option.productCourseId,
            childId: option.childId
          })
        }
        // console.log("打印productCourseId", this.data.productCourseId)

        this.$common.checkAuth1().then(
          (res) => {
            console.log(res)
            if (res.authSetting['scope.userInfo']) {
              dispatch(actions.HANDLE_ACTION, option);
            } else {
              let str = JSON.stringify(option)
              if (str != '{}') {
                wx.redirectTo({
                  url: '../register/register?shareMsg=' + str
                })
              } else {
                wx.redirectTo({
                  url: '../register/register'
                })
              }
            }
          },
          (rej) => {
            wx.redirectTo({
              url: '../register/register'
            })
          }
        )

        this.setData({
          timetableHeight: wx.getSystemInfoSync().windowHeight - 150,
          img: this.$api.extparam.getPageImgUrl('boyb'),
          width: wx.getSystemInfoSync().windowWidth,
          height: wx.getSystemInfoSync().windowHeight
        })

        wx.hideShareMenu();
      },

      [PAGE_LIFE.ON_SHOW]() {
        console.log('值');
        this.setData({
          btnclick: false,
        })
        //获取用户信息
        this.$common.checkAuth1().then(
          (res) => {
            if (res.authSetting['scope.userInfo']) {
              put(effects.GET_USER_INFO);
              this.$api.child.get().then(
                res => {
                  this.setData({
                    childLength: res.data.result.childList.length
                  })
                })
              let that = this
            }
          }
        )

        // data = "{{lessons}}" dataLesson = "{{dayLessons}}" childId = "{{model.childId}}" date = "{{model.currentDate}}"

        // put(effects.GET_USER_INFO);
        // // put(effects.GET_CHILD);
        // this.$api.child.get().then(
        //   res => {
        //     console.log(res)
        //     this.setData({
        //       childLength: res.data.result.childList.length
        //     })
        //   })
        // let that = this
        // wx.getStorage({
        //   key: 'childId',
        //   success: function(res) {
        //     that.setData({
        //       'model.childId': res.data
        //     })
        //     put(effects.GET_CHILD);
        //   },
        //   fail: function(res) {
        //     put(effects.GET_CHILD);
        //   }
        // })
        // this.$storage.get('childId').then((res) => {
        //     this.setData({
        //       'model.childId': res.data
        //     })
        //     put(effects.GET_CHILD);
        //     this.$storage.clear()

        //   },
        //   (rej) => {
        //     if (!this.$common.isBlank(this.data.model.childId)) {
        //       put(effects.GET_WEEK_LESSON)
        //     }
        //   }
        // )
        // this.$storage.clear()
      },
      // 下拉刷新
      [PAGE_LIFE.ON_SHARE_APP_MESSAGE]() {
        put(effects.GET_MONTH_LESSON_NUM) // 更多日历
        put(effects.loadCourseTimelist) // 获取更多的列表
        const {
          userInfo
        } = this.data;
        wx.stopPullDownRefresh()
        return {
          title: `[${userInfo.nickName}@我]孩子时间管理利器，我已在使用，不信您试试`,
          path: '/pages/course/courseList/courseList',
          imageUrl: '/assets/img/share_course.jpg'
        }
      },

    }
  }

  mapUIEvent({
    put
  }) {
    let api = this.$api
    return {
      // 没有课程添加课程
      [events.ui.back_change](e){

      },
      // 返回主页
      [events.ui.backhome]() {
        console.log('主页')
        wx.reLaunch({
          url: '/pages/course/courseList/courseList',
          success: function(res) {},
          fail: function(res) {
            console.log('失败')
          },
          complete: function(res) {},
        })
      },
      // 添加课程
      [events.ui.add_course](data){
        let date = data.detail.date;
        let time = data.detail.time;
        let select_time= {
          date,time
        }
        let { current, childId} = this.data;
        console.log('添加的课程', time, current,date)
        wx.setStorageSync('select_time',select_time)
        // 判断校内还是校外
        if (current == 1){
         
          wx.navigateTo({
            url: `/pages/course/p_add/schoolout_add1?childId=${childId}&activeIndex=1&time=${time}&date=${date}`,
          })
        }else if(current == 0){
          // 校内查询是否有课程  有课程 跳转课程列表  没有泽跳转 添加校内课程
          api.course.getAllInternalCourseName({ childId: childId }).then(res => {
            if (res.data.errorCode == 0 && res.data.result.length >= 0) {
                  wx.navigateTo({
                    url: '/pages/course/p_manage/schoolout_manage?activeIndex=0' + "&childId=" + childId, // 打开校内
                  })
            } else {
              wx.navigateTo({
                url: `/pages/course/p_add/schoolout_add1?childId=${childId}&activeIndex=0`,
              })
            }
          })
        }
       
      },
      // 查看详情
      [events.ui.courdetails](e) {
        // 获取孩子  childId   获取  日程 courseId  editpower true  // 权限
        // console.log(e)
        var lessonId = e.currentTarget.dataset.id;
        var childId = this.data.childId;
        // console.log('courseId' + courseId,'childId'+this.data.childId);
        // wx.navigateTo({
        //   url: `/pages/course/p_manage/schoolout_manage_share?courseId=${rs.courseId}&code=${rs.shortCode}`
        // });
        wx.navigateTo({
          url: `/pages/course/p_manage/schoolout_manage_detail?courseId=${courseId}&childId=${childId}&editpower=${true}`
        })



        //pages/course/p_manage/schoolin_manage_detail
        // wx.navigateTo({
        //   // pages/course/p_lesson/schoolout_lesson_detail
        //   url: `/pages/course/p_lesson/schoolout_lesson_detail?lessonId=${lessonId}&childId=${childId}`
        // })
      },
      //查看位置
      [events.ui.OPEN_LOCATION](e) {
        let longitude = Number(e.currentTarget.dataset.log);
        let latitude = Number(e.currentTarget.dataset.lat);
        wx.openLocation({
          latitude: latitude,
          longitude: longitude
        })
      },
      // tab日历切换   默认
      [events.ui.chargeTab](e) {
        let id = e.currentTarget.dataset.id;
        let childId = this.data.childId
        if(id == 1){
          this.setData({
            isList: !(this.data.isList)
          })
        }else{
          wx.navigateTo({
            url: '/pages/course/p_manage/schoolout_manage?activeIndex=1' + "&childId=" + childId, // 打开校内
          })
        }
        
       
      },
      [events.ui.goAdd](e) {
        // console.log('当前',e.detail)
        wx.navigateTo({
          url: '/pages/course/p_add/schoolout_add1?current=' +e.detail.current,
        })
      },
      [events.ui.CHOOSE_TYPE]() {
        this.setData({
          isSubmit: false
        })
      },
      [events.ui.ESTOP](e) {
        this.setData({
          isSubmit: true,
        })
        // console.log('------------')
      },
      [events.ui.CHOOSUBMITSETYPE](e) {
        // console.log(e.currentTarget.dataset.type)
        this.setData({
          isSubmit: true
        })
        let type = e.currentTarget.dataset.type
        console.log("type", type)
        if (type == 0) {
          wx.navigateTo({
            url: 'pages/course/p_add/schoolout_add1?childId=' + this.data.model.childId
          })
        } else if (type == 1) {
          wx.navigateTo({
            url: `../p_manage/schoolout_manage?childId=${this.data.model.childId}`
          })
        } else if (type == 2) {
          if (this.data.userInfo.role == 0) {
            wx.navigateTo({
              url: '../register/info/p_info?comeFrom=courseaddchild',
            })
          } else {
            wx.navigateTo({
              url: '../classcircle/schoolType/schoolType',
            })
          }

        } else if (type == 3) {
          wx.navigateTo({
            url: '../mypage/editMyChild/editMyChild?childId=' + this.data.model.childId
          })
        }
      },
      //课程管理链接
      [events.ui.COURSE_MANAGE](e) {
        // console.log(this.data)
        wx.navigateTo({
          url: `./p_manage/schoolout_manage?childId=${this.data.model.childId}`
        })
      },
      //切换头像
      [events.ui.CHANGE_LOGO](e) {
        this.setData({
          loadChildAll: true
        });
        put(effects.LOAD_CHILDALL);
      },
      //选择孩子
      [events.ui.CHOOSE_CHILD](e) {
        var a = e.currentTarget.dataset.id
        this.setData({
          'model.childId': a,
          childId: a,
          loadChildAll: false
        });
        wx.setStorage({
          key: 'childId',
          data: a,
          success: (res) => {
            put(effects.GET_CHILD);
            put(effects.GET_MONTH_LESSON_NUM) // 更多日历
            put(effects.loadCourseTimelist) // 更多的信息
          },
          fail: function(res) {
            put(effects.GET_MONTH_LESSON_NUM) // 更多日历
            put(effects.GET_CHILD);
            put(effects.loadCourseTimelist)   // 更多的信息
          },

        })
        this.setData({
          childId: a
        })
        console.log('choose_child', e.currentTarget.dataset.id)
        // put(effects.GET_DAY_LESSON);
        put(effects.GET_CHILD);
        put(effects.loadCourseTimelist) // 更多的信息
      },
      //添加课程
      [events.ui.ADD_COURSE](e) {
        wx.navigateTo({
          url: './p_add/schoolout_add1?childId=' + this.data.model.childId
        })
      },
      //课程左右滑动
      [events.ui.TIMETABLE_DATE_CHANGED](e) {
        const currentDate = moment().add(e.detail.diff, 'weeks').format('YYYY-MM-DD');
        if (this.data.model.comefrom == '') {
          this.setData({
            'model.currentDate': currentDate
          })
        }
        this.setData({
          'model.diff': e.detail.diff,
          'model.comefrom': ''
        })

        if (!this.$common.isBlank(this.data.model.childId)) {
          put(effects.GET_WEEK_LESSON);
        } else {
          put(effects.GET_CHILD);
        }
      },
      //点击星期
      [events.ui.LESSON_DATE_CHANGED](e) {
        this.setData({
          'model.lessonDate': e.detail.dateLesson
        })
        if (e.detail.timetable) {
          put(effects.GET_WEEK_LESSON);
        } else {
          put(effects.GET_DAY_LESSON);
        }
      },
      //点击日期
      [events.ui.SHOW_CALENDAR](e) {
        this.setData({
          showCalendar: true
        })

        put(effects.GET_MONTH_LESSON_NUM);
      },
      //接收日期改变
      [events.ui.CALENDAR_DAY_CHANGED](e) {

        const currentDate = moment(e.detail.year + ' ' + e.detail.month + ' ' + e.detail.day, 'YYYY-MM-DD').format('YYYY-MM-DD');
        this.setData({
          'model.currentDate': currentDate,
          'model.comefrom': 1,
          showCalendar: false
        })
        console.log('选择的日期', currentDate);
        put(effects.GET_DAY_LESSON);
      },
      //接收月份改变
      [events.ui.CALENDAR_MONTH_CHANGED](e) {
        const currentMonth = moment(e.detail.currentYear + ' ' + e.detail.currentMonth).format('YYYY-MM');
        this.setData({
          'model.currentMonth': currentMonth
        })
        put(effects.GET_MONTH_LESSON_NUM);
      },
      //取消关注
      [events.ui.CANCEL_FOLLOW](e) {
        this.setData({
          showFollowModel: false
        })
      },
      [events.ui.gotoExam](e) {
        console.log("跳转")
        wx.navigateTo({
          url: './p_exam/p_exam'
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
        var that = this;
        api.user.gerUserInfo().then(
          (res) => {
            console.log('用户信息', res.data)
            if (res.data.errorCode == 0) {
              this.setData({
                userInfo: res.data.result,
                name: res.data.result.name
              })
              if (this.data.userInfo.role == 0) {
                wx.setNavigationBarTitle({
                  title: '课程表（家长端）',
                })

                put(effects.GET_CHILD);
                // 校外
                put(effects.loadCourseTimelist) // 更多日程
                put(effects.GET_MONTH_LESSON_NUM) // 更多日历

              } else {
                wx.setNavigationBarTitle({
                  title: '课程表（教师端）',
                })
                // 直接获取列表
                put(effects.loadCourseTimelist) // 更多日程
                put(effects.GET_MONTH_LESSON_NUM) // 更多日历
                
              }

              if (this.data.userInfo.nickName == null || this.data.userInfo.nickName == '') {
                wx.getSetting({
                  success(res) {
                    // console.log(res)
                    if (res.authSetting['scope.userInfo']) {
                      api.auth.token().then(() => wx.getUserInfo({
                        success: function(res) {
                          // console.log(res)
                          that.setData({
                            'inputMap.encryptedData': res.encryptedData,
                            'inputMap.iv': res.iv,
                            'inputMap.role': that.data.userInfo.role,
                            'inputMap.changeRole': '0'
                          })
                          api.user.updateUserInfoByWX(that.data.inputMap).then(
                            (res) => {
                              api.auth.clearToken().then(
                                (res) => {
                                  // console.log(res)
                                }
                              )
                            }
                          );
                        }
                      }))
                    }
                  }
                })
              }
            } else {
              common.showMessage(this, res.data.errorMessage);
              return;
            }
          }
        );
      },
      //一个孩子的信息
      [effects.GET_CHILD]() {
        if (this.data)
          api.child.get(this.data.model).then((res) => {
              // console.log(res)
              if (res.data.errorCode == '100006') {
                api.user.gerUserInfo().then(
                  (res) => {
                    if (res.data.errorCode == 0) {
                      if (res.data.result.role == '0') {
                        // wx.redirectTo({
                        //   url: '/pages/register/info/p_info'
                        // }); //没有孩子信息，跳转到注册孩子信息页面
                      } else {
                        this.$api.user.verifyTeacherInfo({}).then(res => {
                          // console.log(res.data.result)
                          if (res.data.result.teacherInfoStatus) {} else {
                            wx.redirectTo({
                              url: '/pages/register/info/t_info'
                            });
                          }
                        })
                      }
                    } else {
                      common.showMessage(this, res.data.errorMessage);
                      return;
                    }
                  }
                );
              } else {
                if (res.data.result.childList[0].shareMeUser != null) {
                  this.setData({
                    shareChild: 2 //别人分享给我的
                  })
                } else if (res.data.result.childList[0].myShareUser != null) {
                  this.setData({
                    shareChild: 1 //我分享的
                  })
                } else {
                  this.setData({
                    shareChild: 0 //没有分享
                  })
                }
                // console.log("打印小孩信息====================")
                // console.log(res.data.result.childList[0])
                let img = res.data.result.childList[0].logo
                this.setData({
                  'childInfo': res.data.result.childList[0],
                  //'childInfo.logo': api.extparam.getLogoUrl(res.data.result.childList[0].logo)  //如果没有数据显示默认头像

                });

                // console.log(this.data)
                if (common.isBlank(this.data.model.childId)) {
                  this.setData({
                    'model.childId': res.data.result.childList[0].childId
                  });
                }
                put(effects.GET_WEEK_LESSON);
                put(effects.CHECK_FOLLOW);
              }

            },
            (rej) => {}
          )
      },

      //判断用户是否关注过公众号
      [effects.CHECK_FOLLOW]() {
        this.$api.course.loadCourseNum({}).then(res => {
          if (res.data.result.courseNum != 0) {
            api.user.checkFollow().then(
              (res) => {
                // console.log(res)
                if (res.data.errorCode == 0) {
                  if (res.data.result.isFollow == false) {
                    this.setData({
                      showFollowModel: true
                    })
                  }
                } else {
                  common.showMessage(this, res.data.errorMessage);
                  return;
                }
              }
            );
          }

        })
      },

      //全部孩子
      [effects.LOAD_CHILDALL]() {
        api.child.get().then(
          (res) => {
            if (res.data.errorCode == 0) {
              let childData = res.data.result.childList;
              for (let i = 0; i < childData.length; i++) {
                let myShare = null;
                let myShareList = [];
                let shareMe = null;
                let shareMeList = [];
                if (childData[i].shareMeUser != null) {
                  childData[i].myShareUser = null
                }
                if (childData[i].myShareUser != null && childData[i].shareMeUser == null) {
                  myShare = childData[i].myShareUser.split(',')
                  for (let j = 0; j < myShare.length; j++) {
                    myShareList.push(myShare[j].split('|')[1])
                  }
                  childData[i].myShareUser = myShareList
                } else if (childData[i].myShareUser == null && childData[i].shareMeUser != null) {
                  shareMe = childData[i].shareMeUser.split(',')
                  for (let j = 0; j < shareMe.length; j++) {
                    shareMeList.push(shareMe[j].split('|')[1])
                  }
                  childData[i].shareMeUser = shareMeList
                }
                childData[i].courseNum = childData[i].courseNum + childData[i].internalCourseNum
              }
              // res.data.result.childList.forEach(function(e) {
              //   e.logo = api.extparam.getLogoUrl(e.logo)
              // })
              this.setData({
                'childList': childData
              });
              console.log("打印小孩数据列表  ==========")
              console.log(this.data.childList)
            }
          },
          (rej) => {}
        )
      },

      //一周的课节信息
      [effects.GET_WEEK_LESSON]() {
        let current = this.data.current;
        let params = {
          childId: this.data.model.childId,
          diff: this.data.model.diff,
        }
        console.log('日历表参数', params, current)
        if (current == 0){
          api.course.loadInternalCourseListByWeek(params).then(
            (res) => {
              if (res.data.errorCode == 0) {
                const rs = res.data.result;
                rs.forEach(
                  (item) => {
                    item.date = moment(item.startTime).unix()
                    item.beginTime = moment(item.startTime, 'YYYY-MM-DD HH:mm').format('HH:mm')
                    item.endTime = moment(item.endTime, 'YYYY-MM-DD HH:mm').format('HH:mm')
                    // console.log(item.name.march(/^[a-z]*|[A-Z]*$/g))
                    let re1 = new RegExp("^[\u4e00-\u9fa5]");
                    let re2 = new RegExp("^[a-zA-Z]+$");
                    if (re1.test(item.name)) {
                      item.name = item.name.substring(0, 4)
                    } else if (re2.test(item.name)) {
                      item.name = item.name.substring(0, 8)
                    } else {
                      item.name = item.name.substring(0, 4)
                    }
                    if (re1.test(item.schoolName)) {
                      item.schoolName = item.schoolName.substring(0, 4)
                    } else if (re2.test(item.schoolName)) {
                      item.schoolName = item.schoolName.substring(0, 8)
                    } else {
                      item.schoolName = item.schoolName.substring(0, 4)
                    }
                  }
                )
                this.setData({
                  lessons: rs
                });
              } else if (res.data.errorCode == 100006) {
                this.setData({
                  lessons: []
                });
              }

            },
            (rej) => { }
          )
        } else if (current ==1){
          api.course.loadOutSchoolCourseListByWeek(params).then(
            (res) => {
              if (res.data.errorCode == 0) {
                const rs = res.data.result;
                rs.forEach(
                  (item) => {
                    item.date = moment(item.startTime).unix()
                    item.beginTime = moment(item.startTime, 'YYYY-MM-DD HH:mm').format('HH:mm')
                    item.endTime = moment(item.endTime, 'YYYY-MM-DD HH:mm').format('HH:mm')
                    // console.log(item.name.march(/^[a-z]*|[A-Z]*$/g))
                    let re1 = new RegExp("^[\u4e00-\u9fa5]");
                    let re2 = new RegExp("^[a-zA-Z]+$");
                    if (re1.test(item.name)) {
                      item.name = item.name.substring(0, 4)
                    } else if (re2.test(item.name)) {
                      item.name = item.name.substring(0, 8)
                    } else {
                      item.name = item.name.substring(0, 4)
                    }
                    if (re1.test(item.schoolName)) {
                      item.schoolName = item.schoolName.substring(0, 4)
                    } else if (re2.test(item.schoolName)) {
                      item.schoolName = item.schoolName.substring(0, 8)
                    } else {
                      item.schoolName = item.schoolName.substring(0, 4)
                    }
                  }
                )
                this.setData({
                  lessons: rs
                });
              } else if (res.data.errorCode == 100006) {
                this.setData({
                  lessons: []
                });
              }

            },
            (rej) => { }
          )
        } else{
          api.course.weekLesson(this.data.model).then(
            (res) => {
              console.log('教师端一周',res.data.result)
              if (res.data.errorCode == 0) {
                const rs = res.data.result;
                rs.forEach(
                  (item) => {
                    item.date = moment(item.startTime).unix()
                    item.beginTime = moment(item.startTime, 'YYYY-MM-DD HH:mm').format('HH:mm')
                    item.endTime = moment(item.endTime, 'YYYY-MM-DD HH:mm').format('HH:mm')
                    // console.log(item.name.march(/^[a-z]*|[A-Z]*$/g))
                    let re1 = new RegExp("^[\u4e00-\u9fa5]");
                    let re2 = new RegExp("^[a-zA-Z]+$");
                    if (re1.test(item.name)) {
                      item.name = item.name.substring(0, 4)
                    } else if (re2.test(item.name)) {
                      item.name = item.name.substring(0, 8)
                    } else {
                      item.name = item.name.substring(0, 4)
                    }
                    if (re1.test(item.schoolName)) {
                      item.schoolName = item.schoolName.substring(0, 4)
                    } else if (re2.test(item.schoolName)) {
                      item.schoolName = item.schoolName.substring(0, 8)
                    } else {
                      item.schoolName = item.schoolName.substring(0, 4)
                    }
                  }
                )
                this.setData({
                  lessons: rs
                });
              } else if (res.data.errorCode == 100006) {
                this.setData({
                  lessons: []
                });
              }

            },
            (rej) => { }
          )
        }
      },

      // 更多的课节信息
      [effects.loadCourseTimelist]() {
        let current  = this.data.current
        var role = this.data.userInfo.role;
        // 判断家长端还是教师端
        if (role == 0) { // 家长端
          // 判断是校内0  校外0  查看更多
          if (current != '' && current != 3  ){
            if(current == 0){
              var params = {
                childId: this.data.childId,
                type: 2,
              }
            }
            if(current == 1){
              var params = {
                childId: this.data.childId,
                type: 1
              }
            }
            console.log('孩子id', params, '角色状态', role, '日程状态', current);
            api.course.loadCourseList(params).then((res) => {
             
              if (res.data.errorCode == 0 && res.data.result) {
                this.setData({
                  morelessons: res.data.result.splice(0, 20)
                })
              }else{
                this.setData({
                  morelessons: []
                })
              }
               console.log('课表1',  this.data.morelessons)
            })
          } else{
            var params = {
              childId: this.data.childId,
            }
            api.course.loadCourseTimelist(params).then((res) => {
         
              if (res.data.errorCode == 0 && res.data.result) {
                this.setData({
                  morelessons: res.data.result.splice(0, 20)
                })
              } else {
                this.setData({
                  morelessons: []
                })
               
              }
              console.log('最近课表', this.data.morelessons)
            })
          }
        } else if (role == 1) { // 教师端
          // 判断是校内0  校外0  查看更多
          if (current != '' && current!=3 ) {
            let params ={}
            if (current == 0) {
             params = {
                type: 2,
              }
            }
            if (current == 1) {
              params = {
                type: 1
              }
            }
            api.course.loadCourseList(params).then((res) => {
              // console.log('课表', res.data.result)
              if (res.data.errorCode == 0 && res.data.result) {
                put(effects.GET_WEEK_LESSON);
                this.setData({
                  morelessons: res.data.result.splice(0, 20)
                })
              }
              console.log('老师校内外课表', this.data.morelessons)
            })
          } else {
            api.course.loadCourseTimelist({}).then((res) => {
            
              if (res.data.errorCode == 0 && res.data.result) {
                put(effects.GET_WEEK_LESSON);
                this.setData({
                  morelessons: res.data.result.splice(0, 20)
                })
              }
              console.log('老师更多课表', this.data.morelessons)
            })
          }

        }

      },

      //一个月的课节数量信息
      [effects.GET_MONTH_LESSON_NUM]() {
        console.log('日期呢', this.data.model)
        api.course.monthLessonNum(this.data.model).then(
          (res) => {
            if (res.data.errorCode == '0') {
              const rs = res.data.result.courseList
              rs.forEach(
                (item) => {
                  item.year = moment(item.date).format('YYYY')
                  item.month = moment(item.date).format('M')
                  item.day = moment(item.date).format('D')
                }
              )
              this.setData({
                monthLessonNum: rs
              });
            } else if (res.data.errorCode == '100006') {
              this.setData({
                monthLessonNum: []
              });
            }
          },
          (rej) => {}
        )
      },

      //一天的课节信息
      // [effects.GET_DAY_LESSON]() {
      //   this.setData({
      //     'model.childId': this.data.model.childId
      //   })
      //   api.course.dayLesson(this.data.model).then(
      //     (res) => {
      //       console.log('this.data.model', res)
      //       if (res.data.errorCode == 0) {
      //         const rs = res.data.result;
      //         rs.forEach(
      //           (item) => {
      //             item.beginTime = moment(item.startTime, 'YYYY-MM-DD HH:mm').format('HH:mm')
      //             item.endTime = moment(item.endTime, 'YYYY-MM-DD HH:mm').format('HH:mm')
      //           }
      //         )
      //         this.setData({
      //           dayLessons: rs
      //         });
      //       } else if (res.data.errorCode == 100006) {
      //         this.setData({
      //           dayLessons: []
      //         });
      //       }

      //     },
      //     (rej) => { }
      //   )
      // },
      //一天的课节信息
      [effects.GET_DAY_LESSON]() {
        this.setData({
          'model.childId': this.data.model.childId
        })
        console.log('参数', this.data.model)
        api.course.dayLesson(this.data.model).then(res => {
          console.log(res)
          var lessonList = res.data.result;
          if (lessonList == undefined){
            this.setData({
              dayLessons: []
            })
            return 
          }
          lessonList.forEach(item => {
            var date = new Date(item.startTime.replace(new RegExp('-', 'g'), '/'))
            var edate = new Date(item.endTime.replace(new RegExp('-', 'g'), '/'))
            var week = date.getDay()
            var year = date.getFullYear()
            var month = (parseInt(date.getMonth()) + 1) < 9 ? '0' + parseInt(date.getMonth() + 1) : (parseInt(date.getMonth()) + 1)
            var day = date.getDay() < 9 ? '0' + date.getDay() : date.getDay()
            var h = date.getHours() < 9 ? '0' + date.getHours() : date.getHours()
            var m = date.getMinutes() < 9 ? '0' + date.getMinutes() : date.getMinutes()
            var s = date.getSeconds() < 9 ? '0' + date.getSeconds() : date.getSeconds()
            var hh = edate.getHours() < 9 ? '0' + edate.getHours() : edate.getHours()
            var mm = edate.getMinutes() < 9 ? '0' + edate.getMinutes() : edate.getMinutes()
            var ss = edate.getSeconds() < 9 ? '0' + edate.getSeconds() : edate.getSeconds()
            var days = ''
            switch (week) {
              case 1:
                days = '星期一';
                break;
              case 2:
                days = '星期二';
                break;
              case 3:
                days = '星期三';
                break;
              case 4:
                days = '星期四';
                break;
              case 5:
                days = '星期五';
                break;
              case 6:
                days = '星期六';
                break;
              case 0:
                days = '星期日';
                break;

            }
            item.startDate = `${year}-${month}-${day}`
            item.sTime = `${h}:${m}`
            item.eTime = `${hh}:${mm}`
            item.week = days
          })


          // 判断是校内还是校外
          let current = this.data.current;
          let arrs = []
          if(current ==0){
            lessonList.map(item=>{
              if(item.dataType == 2){
                arrs.push(item)
              }
            })
          }else if(current == 1){
            lessonList.map(item => {
              if (item.dataType == 1) {
                arrs.push(item)
              }
            })
          }
          console.log('区别',current,arrs)
          this.setData({
            dayLessons: arrs
          })
          console.log('选择日期', this.data.dayLessons) // 
        })
      },

      //获取校内课程
      [effects.GET_inlet_LESSON]() {
        var params = {
          childId: this.data.model.childId
        }

        this.$api.course.getAllInternalCourseName(params).then(res => {
          console.log('class', res)
          var dayLessons = res.data.result

          dayLessons.forEach(item => {
            var date = new Date(item.startDate.replace(new RegExp('-', 'g'), '/'))
            var week = date.getDay()
            var days = ''
            switch (week) {
              case 1:
                days = '星期一';
                break;
              case 2:
                days = '星期二';
                break;
              case 3:
                days = '星期三';
                break;
              case 4:
                days = '星期四';
                break;
              case 5:
                days = '星期五';
                break;
              case 6:
                days = '星期六';
                break;
              case 0:
                days = '星期日';
                break;
            }
            item.week = days
          })
          this.setData({
            dayLessons: res.data.result
          })
        })
      },
    }
  }

  mapAction({
    put
  }) {
    return {
      [actions.HANDLE_ACTION](option) {
        console.log('值', option)
        const {
          action
        } = option;
        // console.log(action)
        if (!action) {
          // 判断是否是由分享进来且第一次注册
          this.$api.user.getUserShareInfo().then(res => {
            if (res.data.result != null) {
              this.setData({
                code: res.data.result.code,
                isShare: 1,
                loadChildAll: false
              })
              console.log(this.data.code, this.data.isShare)
            }
            if (this.data.code != '') {
              console.log('-----------------')
              let inputMap = {
                code: this.data.code
              }
              this.$api.user.getShareInfo(inputMap).then( //分享接口
                (res) => {
                  console.log(res)
                  let result = res.data.result
                  if (res.data.errorCode == '0') {
                    let rs = JSON.parse(res.data.result.jsonData);
                    if (rs.target == 'course') {
                      wx.navigateTo({
                        url: `/pages/course/p_manage/schoolout_manage_share?courseId=${rs.courseId}&code=${rs.shortCode}`
                      });
                    } else if (rs.target == 'lesson') {
                      wx.navigateTo({
                        url: `/pages/course/p_lesson/schoolout_lesson_share?code=${rs.shortCode}`
                      });
                    } else if (rs.target == 'sign') {
                      wx.navigateTo({
                        url: `/pages/learningcircle/page/diaryDetail/diaryDetail?id=${rs.signinId}code=${rs.shortCode}`
                      });
                    } else if (rs.target == 'community') {
                      wx.navigateTo({
                        url: `/pages/learningcircle/page/myCircle/myCircle ?id=${rs.communityId}`
                      });
                    } else if (rs.target == 'child') {
                      wx.navigateTo({
                        url: `/pages/mypage/editMyChild/editMyChild?childId=${rs.childId}&code=${rs.shortCode}`
                      });
                    } else if (rs.target == 'internalCourse') {
                      wx.navigateTo({
                        url: `/pages/course/p_manage/schoolin_manage_share?code=${rs.internalClassId}`
                      });
                    } else if (rs.target == 'classCommunity') {
                      if (result.userRole == 0) {
                        wx.navigateTo({
                          url: `/pages/classcircle/classMsg/classMsg?classId=${rs.classId}&role=${result.userRole}&childId=${result.childId}`
                        });
                      } else {
                        wx.navigateTo({
                          url: `/pages/classcircle/classMsg/classMsg?classId=${rs.classId}&role=${result.userRole}`
                        });
                      }
                    }
                  }
                }
              )
            }
          })
          return;
        }
        if (action === 'share') {
          console.log('登录成功')
          this.$api.user.getShareInfo(option).then(
            (res) => {
              console.log("course的res======", res.data.result)
              let result = res.data.result
              if (res.data.errorCode == '0') {
                let rs = JSON.parse(res.data.result.jsonData);
                console.log(rs)
                if (rs.target == 'course') {
                  wx.navigateTo({
                    url: `/pages/course/p_manage/schoolout_manage_share?courseId=${rs.courseId}&code=${rs.shortCode}`
                  });
                } else if (rs.target == 'lesson') {
                  wx.navigateTo({
                    url: `/pages/course/p_lesson/schoolout_lesson_share?code=${rs.shortCode}`
                  });
                } else if (rs.target == 'sign') {
                  console.log(rs.signinId)
                  wx.navigateTo({
                    // /learningcircle/page/diaryDetail/diaryDetail
                    url: `/pages/learningcircle/page/diaryDetail/diaryDetail?id=${rs.signinId}&code=${rs.shortCode}`
                  });
                } else if (rs.target == 'community') {
                  wx.navigateTo({
                    url: `/pages/learningcircle/page/myCircle/myCircle?id=${rs.communityId}`
                  });
                } else if (rs.target == 'child') {
                  wx.navigateTo({
                    url: `/pages/mypage/editMyChild/editMyChild?childId=${rs.childId}&code=${rs.shortCode}`
                  });
                } else if (rs.target == 'internalCourse') {
                  wx.navigateTo({
                    url: `/pages/course/p_manage/schoolin_manage_share?code=${rs.internalClassId}`
                  });
                } else if (rs.target == 'questionnaire') {
                  wx.navigateTo({
                    url: `/pages/buyShop/page/exam/exam?productId=${this.data.productId}&courseId=${this.data.courseId}`
                  });
                } else if (rs.target == "productGroup" || rs.target == "product") {
                  wx.navigateTo({
                    url: `/pages/buyShop/page/hotProduct/hotProduct?productId=${this.data.productId}&courseId=${this.data.courseId}&isshare=1`,
                  })

                } else if (rs.target == "activityProductGroup") { //拼团成功的分享
                  console.log("拼团成功=====")
                  wx.navigateTo({
                    url: `/pages/buyShop/page/payList/payList?productId=${this.data.productId}&courseId=${this.data.courseId}&changeText=${this.data.changeText}&productCourseId=${this.data.productCourseId}&childId=${this.data.childId}`
                  })

                } else if (rs.target == 'classCommunity') {
                  if (result.userRole == 0) {
                    wx.navigateTo({
                      url: `/pages/classcircle/classMsg/classMsg?classId=${rs.classId}&role=${result.userRole}&childId=${result.childId}&isfrom=share&code=${rs.shortCode}`
                    });
                  } else {
                    wx.navigateTo({
                      url: `/pages/classcircle/classMsg/classMsg?classId=${rs.classId}&role=${result.userRole}&isfrom=share&code=${rs.shortCode}`
                    });
                  }
                }
              }
            }
          )
        } else if (action === 'templateMessage') {
          const {
            lessonId,
            childId
          } = option;
          wx.navigateTo({
            url: `./p_lesson/schoolout_lesson_detail?lessonId=${lessonId}&childId=${childId}`
          })
        }
      }
    }
  }
}

EApp.instance.register({
  type: CoursePage,
  id: 'CoursePage',
  config: {
    events,
    effects,
    actions
  }
});
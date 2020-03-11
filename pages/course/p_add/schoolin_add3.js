import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../eea/index'
import {
  events,
  effects,
  actions
} from './schoolin_add3.eea'
const moment = require('../../../lib/moment.min.js');

class SchoolinAdd3Page extends EPage {
  get data() {
    return {
      model: {
        childId: '',
      },
      classId: '',
      setClassMsg: {},
      iptHide: true,
      shareCavansOptions: {
        id: 'share_canvas',
        width: 0,
        height: 0
      },
      userInfo:{
        role:0
      },
      share_img:'',
      isshare:false
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        this.setData({
          // img: this.$api.extparam.getPageImgUrl('newcourse')
          share_img: 'https://qa.oss.iforbao.com/public/assets/local/share_course.png'
        })
        console.log(option)

        const {
          shareCavansOptions
        } = this.data;
        shareCavansOptions.width = wx.getSystemInfoSync().screenWidth;
        shareCavansOptions.height = shareCavansOptions.width * 5 / 4;
        this.setData({
          shareCavansOptions
        });
        this.setData({
          'schoolInfo': option,
          'schoold': option.schoold
        })
       this.setData({
         'model.childId': wx.getStorageSync('childId')
       })
      },
      [PAGE_LIFE.ON_SHOW]() {
        if (this.data.isshare) {
          return wx.switchTab({
            url: '/pages/course/courseList/courseList'
          })
        }
        this.$storage.get('schoolinfo.name').then(
          (name) => {
            this.setData({
              'schoolModel.school': name.data,

            })
            console.log(this.data.schoolModel.school)
          },
          (reject) => {}
        );
       
        this.$storage.get('userInfo').then(
          (res) => {
            this.setData({
              userInfo: res.data,
            })
            console.log(this.data.userInfo)
          },
          (rej) => {}
        )
        wx.getStorage({
          key: 'childId',
          success: (res)=> {
            console.log(res.data.childId)
            this.setData({
              childId:res.data,
              'model.childId': res.data
            })
          },
          fail:(res)=> {
            console.log('childId失败',)
          },
        })
        // this.$storage.get('schoolInfo').then(
        //   (res) => {
        //     if (this.data.userInfo.role == 0) {
        //       this.setData({
        //         schoolInfo: res.data
        //       })
        //     }

        //   console.log(this.data.schoolInfo)
        // },
        //   (rej) => {}
        // )
        this.$storage.get('model').then(
          (res) => {
            this.setData({
              model: res.data
            })
            console.log('获取model',this.data.model)
          },
          (rej) => {}
        )
        this.$storage.get('weekDays').then(
          (res) => {
            this.setData({
              weekDays: res.data
            })
            console.log(this.data.weekDays)
          },
          (rej) => {}
        )
        this.$storage.get('courseTable').then(
          (res) => {
            this.setData({
              courseTable: res.data
            })
            console.log(this.data.courseTable)
          },
          (rej) => {}
        )
        this.$storage.get('InterNameList').then(
          (res) => {
            this.setData({
              InterNameList: res.data
            })
            console.log(this.data.InterNameList)
            let sharecourse = []
            this.data.InterNameList.forEach( item => {
              sharecourse.push(item.courseName)
            })
            console.log(sharecourse)
            if (sharecourse.length>3){
              sharecourse = sharecourse[0] + ',' + sharecourse[1] + ',' + sharecourse[2]+'……'
            }else{
              sharecourse = sharecourse.join(',')
            }
            this.setData({
              'sharecourse': sharecourse
            })
            console.log(this.data.sharecourse)
          },
          (rej) => {}
        )
        // this.$storage.get('InterClassDetailsId').then(
        //   (res) => {
        //     this.setData({
        //       InterClassDetailsId: res.data
        //     })
        //     console.log(this.data.InterClassDetailsId)
        //   },
        //   (rej) => {}
        // )
        this.$storage.get('schoolinfo.schoolid').then(
          (schoolid) => {
            this.setData({
              'schoold': schoolid.data
            });
            console.log(this.data.schoold)
          },
          (reject) => {}
        )
        // if(this.userInfo.role==1){
          this.$storage.get('fistClass').then(
            (res) => {
              if(res){
                this.setData({
                  classId: res.data.classId,
                  className: res.data.className
                })
              }
              
              console.log(this.data.classId)
              console.log(this.data.className)
            },
            (rej) => { }
          )
        // }
        
        this.$storage.get('SchoolClassId').then(
          (res) => {
            this.setData({
              classId: res.data
            })
            console.log(this.data.classId)
          },
          (rej) => {}
        )
        this.$storage.get('schoolinclassname').then(
          (res) => {
            this.setData({
              className: res.data
            })
            console.log(this.data.className)
          },
          (rej) => {}
        )
        this.$storage.get('setClassMsg').then(
          (res) => {
            this.setData({
              setClassMsg: res.data,
              classId: res.data.classId
            })
            console.log(this.data.classId)
          },
          (rej) => {}
        )

        this.$storage.get('courseInfo').then(
          (res) => {
            this.setData({
              courseInfo: res.data
            })
            console.log(this.data.courseInfo)
          },
          (rej) => {
            console.log(this.data.courseInfo)
          }
        )
      },
      [PAGE_LIFE.ON_SHARE_APP_MESSAGE](e) {
        this.setData({
          iptHide: true,
          isshare:true
        });

        const {
          from
        } = e;
        const {
          courseInfo,
          userInfo,
          shortCode,
          imageUrl
        } = this.data;
        console.log('图片',imageUrl,'码', shortCode)
        if (from === 'button') {
          return {
            title: `[${userInfo.nickName}@您]给您分享了校内课程，点击加入自己的课表`,
            path: `/pages/course/courseList/courseList?action=share&code=${shortCode}`,
            imageUrl: this.data.share_img,
            success: (res) => {
              console.log('fenxiang')
              this.$common.showToast('分享成功', 'success')
              setTimeout(function() {
                wx.switchTab({
                  url: '/pages/course/courseList/courseList'
                })
              }, 1000)
            },
            file: (res) => {
              setTimeout(function() {
                wx.switchTab({
                  url: '/pages/course/courseList/courseList'
                })
              }, 1000)
            }
          }
        }
        return {
          title: `[${userInfo.nickName}@您]分享了小豆包课程表`,
          path: '/pages/course/course',
          imageUrl: this.data.share_img
        }
      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      [events.ui.SAVE_NEXT]() {
        put(effects.SAVE_NEXT);
      },
      [events.ui.delShare]() {
        this.setData({
          iptHide: true
        })
        const childId = this.data.model.childId;
        console.log('小孩子id', childId)
        this.setData({
          iptHide: true
        })
        // 缓存获取
        // 少了参数
        // 跳转tabbae页面
        wx.switchTab({
          url: '/pages/course/courseList/courseList',
          success: (res) => { },
          fail: (res) => { },
          complete: (res) => { },
        })
        // wx.reLaunch({
        //   // url: '/pages/course/course?isback=' + false + '&current=' + this.data.current + "&childId=" + childId,
        //   url: '/pages/course/courseList/courseList',
        //   success: function (res) { },
        //   fail: function (res) { },
        //   complete: function (res) { },
        // })
        // pages / course / courseList / courseList
        // wx.switchTab({
        //     url: '../course'
        // })
      }
    }
  }

  mapEffect({
    put
  }) {
    const api = this.$api;
    const common = this.$common;
    const converter = this.$converter;
    return {
      [effects.SAVE_NEXT]() {
        let schoolInfo = this.data.schoolInfo
        let model = this.data.model
        let weekDays = this.data.weekDays
        let courseTable = this.data.courseTable
        let InterNameList = this.data.InterNameList
        // let InterClassDetailsId = this.data.InterClassDetailsId
        let childId = this.data.model.childId
        let classId = this.data.classId
        let schoolId = this.data.schoold
        let className = this.data.courseInfo.className
        var courseData = [];
        if (model.remindIndex == 0) {
          model.remindIndex = 2
        } else {
          model.remindIndex = 1
        }
        let savedata = {
          childId: model.childId,
          duration: model.duration,
          startDate: model.startDate,
          endDate: model.endDate,
          remind: model.remindIndex,
          oneStartTime: model.oneStartTime,
          twoStartTime: model.twoStartTime,
          threeStartTime: model.threeStartTime,
          fourStartTime: model.fourStartTime,
          fiveStartTime: model.fiveStartTime,
          sixStartTime: model.sixStartTime,
          sevenStartTime: model.sevenStartTime,
          eightStartTime: model.eightStartTime,
          remindTime: model.remindTime,
          MonRemindTime: weekDays[0].value,
          TuesRemindTime: weekDays[1].value,
          WedRemindTime: weekDays[2].value,
          TuhRemindTime: weekDays[3].value,
          FriRemindTime: weekDays[4].value,
        }

        console.log(model, weekDays)
        console.log(savedata)
        // return;
        // 家长端
        if (this.data.userInfo.role == 0) {
          courseTable.forEach((item1, index1) => {
            item1.forEach((item2, index2) => {
              let data = {};
              data.rules = [];
              if (index2 != 0) {
                if (item2.courseName != '') {
                  data.childId = childId;
                  data.className = className;
                  data.schoolId = schoolId;
                  data.rules.push({
                    weekday: index2,
                    dailyRule: index1 + 1
                  });
                  if (item2.courseName1 != '' && typeof item2.courseName1 != 'undefined') {
                    data.courseName = item2.courseName + ',' + item2.courseName1;
                    data.weeklyRule = 1;
                  } else {
                    data.courseName = item2.courseName;
                    data.weeklyRule = 0;
                  }
                  if (data) {
                    courseData.push(data)
                  }
                }
              }
            })
          })
        } else {
          // 教师端
          courseTable.forEach((item1, index1) => {
            item1.forEach((item2, index2) => {
              let data = {};
              data.rules = [];
              if (index2 != 0) {
                if (item2.courseName != '') {
                  data.classId = classId;
                  data.rules.push({
                    weekday: index2,
                    dailyRule: index1 + 1
                  });
                  if (item2.courseName1 != '' && typeof item2.courseName1 != 'undefined') {
                    data.courseName = item2.courseName + ',' + item2.courseName1;
                    data.weeklyRule = 2;
                  } else {
                    if (item2.courseSwitch) {
                      data.weeklyRule = 1;
                      data.courseName = item2.courseName + ',*';
                    } else {
                      data.weeklyRule = 0;
                      data.courseName = item2.courseName;
                    }
                  }
                  if (data) {
                    courseData.push(data)
                  }
                } else {
                  if (item2.courseName1 != '' && typeof item2.courseName1 != 'undefined') {
                    console.log(1)
                    data.classId = classId;
                    data.rules.push({
                      weekday: index2,
                      dailyRule: index1 + 1
                    });
                    data.courseName = '*,' + item2.courseName1;
                    data.weeklyRule = 2;
                    if (data) {
                      courseData.push(data)
                    }
                  }
                }
              }
            })
          })
        }
        console.log(courseData)
        for (let i = 0, len = courseData.length; i < len; i++) {
          for (let j = 0, len = courseData.length; j < len; j++) {
            if (i != j && courseData[i]) {
              if (courseData[i].courseName == courseData[j].courseName) {
                courseData[i].rules.push(courseData[j].rules[0])
              }
            }
          }
        }
        console.log(courseData)
        var result = [];
        var obj = {};
        for (var i = 0; i < courseData.length; i++) {
          if (!obj[courseData[i].courseName]) {
            result.push(courseData[i]);
            obj[courseData[i].courseName] = true;
          }
        }
        courseData = result
        console.log(courseData)
        // return;
        courseData.forEach((item, index) => {
          // console.log(item)
          // console.log(courseData.length, index)
          // if (courseData.length == index + 1) {
          // console.log(item)
          // return
          this.$api.course.addInternalCourse(item).then((res) => {
            console.log(res.data.result)
            if (res.data.errorCode == 0) {
             
              var timeData = Object.assign({
                internalClassId: res.data.result.internalClassId
              }, savedata);
              this.setData({
                internalClassId: res.data.result.internalClassId
              })
              console.log(timeData)

              if (courseData.length == index + 1) {
                this.$api.course.saveChildClassInfo(timeData).then(
                  (res) => {
                    if (res.data.errorCode == 0) {
                      // wx.clearStorage()
                      wx.removeStorageSync('model');
                      wx.removeStorageSync('childInfo');
                      wx.removeStorageSync('courseInfo');
                      // 家长分享
                      if (this.data.userInfo.role == 0) {
                        
                        this.setData({
                          iptHide: false
                        })
                        const param = {};
                        param.dataType = 6;
                        param.data = {
                          'internalClassId': this.data.internalClassId
                        };
                        let _this = this
                        this.$api.user.shareInfoRecord(param).then(
                          (res) => {
                            console.log(res)
                            if (res.data.errorCode == '0') {
                              const param1 = {};
                              param1.dataType = 6;
                              param1.data = {
                                'internalClassId': this.data.internalClassId,
                                'shortCode': res.data.result.shortCode
                              };
                              console.log(param1)
                              this.$api.user.shareInfoRecord(param1).then(
                                (res) => {
                                  _this.setData({
                                    shortCode: res.data.result.shortCode,
                                  })
                                  let shareInfo = {
                                    courseName: this.data.sharecourse,
                                    className: this.data.courseInfo.className,
                                    schoolName: this.data.schoolInfo.school,
                                  }
                                  this.$image.generateShareCourse(this.data.shareCavansOptions, shareInfo, 'createinternalClass').then(imageUrl => {
                                    console.log(imageUrl)
                                    this.setData({
                                      imageUrl: imageUrl
                                    });
                                  });



                                  console.log(_this.data.shortCode)
                                })
                            } else {
                              this.$common.showMessage(this, res.data.errorMessage);
                              return;
                            }
                          }
                        )
                      } else {
                        this.$common.showToast('创建成功', 'success')
                        setTimeout(function() {
                          wx.switchTab({
                            url: '/pages/course/courseList/courseList'
                          })
                        }, 100)

                      }

                    } else {
                      common.showMessage(this, '网络不好，稍后再试哦~');
                    }
                  },
                  (rej) => {}
                )
              }

            }
          })
          // } else {
          //   this.$api.course.addInternalCourse(item);
          // }

        })
      },
    }
  }
}


EApp.instance.register({
  type: SchoolinAdd3Page,
  id: 'SchoolinAdd3Page',
  config: {
    events,
    effects,
    actions
  }
});
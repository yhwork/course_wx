import {
  EApp,
  EPage,

  PAGE_LIFE
} from '../../../eea/index'
import {
  events,
  effects,
  actions
} from './schoolin_manage_edit.eea'
const moment = require('../../../lib/moment.min.js');
var weekOfday = moment().format('E') //计算今天是这周第几天
var last_monday = moment().subtract(weekOfday - 1, 'days').format('YYYY/MM/DD'); //周一日期
var last_sunday = moment().add(7 - weekOfday, 'days').format('YYYY/MM/DD'); //周日日期
console.log('今天是周', weekOfday)
console.log('周一日期', last_monday)
var sliderWidth = 96;

function courseTableF() {
  let empty_course = new Array;
  for (let i = 0; i < 8; i++) {
    empty_course[i] = new Array;
    for (let j = 0; j < 6; j++) {
      if (j == 0) {
        empty_course[i][j] = i;
      } else {
        empty_course[i][j] = {
          courseName: '',
          courseNameSub: '',
          courseClass: '',
          courseIndex: ''
        }
      }

    }

  }
  console.log(empty_course)
  return empty_course;
}
function set_times(stute) {
  let val_time = [];
  if (stute == true) {
    for (let i = 6; i < 20; i++) {
      if(i<10){
        i= '0' +i
      }
      val_time.push(i)
    }
  } else {
    let j = 0;
    for (let i = 0; i < 4; i++) {
      if(j==0){
        val_time.push('0'+j)
      }else{
        val_time.push(j)
      }
      j += 15
    }
  }
  return val_time
}
class SchoolinEditePage extends EPage {

  get data() {
    return {
      getdate: set_times(true),
      gettime: set_times(),
      course: {
        starttime: false,
        endtime: false,
        alert:false,
        mask:false,
      },
      InterNameList: [{
          courseName: "语文",
          courseNameSub: "语",
          courseDel: false,
          color: 'yuwen',
          isbg: 1,
          checked: 1
        },
        {
          courseName: "英语",
          courseNameSub: "英",
          courseDel: false,
          color: 'shuxue',
          isbg: 1,
          checked: 0
        },
        {
          courseName: "数学",
          courseNameSub: "数",
          courseDel: false,
          color: 'yingyu',
          isbg: 1,
          checked: 0
        },
      ],
      showCalendar: false,
      weeks: false,
      switched: false,
      weekday: moment().format('E') > 6 ? 0 : moment().format('E'), // 今天是周几
      swiper: {
        indicatorDots: false,
        autoplay: false,
        interval: 5000,
        vertical: false,
        duration: 1000,
        multiple: 3,
        current: 0,
        previous: '0rpx'
      },
      weekList: [{
        name: '周一',
        id: 0,
        data: moment().subtract(weekOfday - 1, 'days').format('DD')
      }, {
        name: '周二',
        id: 1,
        data: moment().subtract(weekOfday - 2, 'days').format('DD')
      }, {
        id: 2,
        name: '周三',
        data: moment().subtract(weekOfday - 3, 'days').format('DD')
      }, {
        id: 3,
        name: '周四',
        data: moment().subtract(weekOfday - 4, 'days').format('DD')
      }, {
        id: 4,
        name: '周五',
        data: moment().subtract(weekOfday - 5, 'days').format('DD')
      }],
      switched: false,
      shrink: false,
      infoHeight: 170,
      one: '',
      five: '',
      tabs: ["课程信息修改", "课节信息修改"],
      index: 0,
      activeIndex: 1,
      sliderOffset: 0,
      sliderLeft: 0,
      activeIndex: 1,
      weekDays: [{
          name: '周一',
          value: '15:30'
        },
        {
          name: '周二',
          value: '15:30'
        },
        {
          name: '周三',
          value: '15:30'
        },
        {
          name: '周四',
          value: '15:30'
        },
        {
          name: '周五',
          value: '15:30'
        }
      ],
      schoolname: '',
      model: {
        classId: '',
        startDate: moment().format('YYYY-MM-DD'),
        endDate: '结束日期',
        oneStartTime: '08:00',
        twoStartTime: '',
        threeStartTime: '',
        fourStartTime: '',
        fiveStartTime: '13:00',
        sixStartTime: '',
        sevenStartTime: '',
        eightStartTime: '',
        remindIndex: '',
        remindTime: '',
        endWeekDay: '',
      },
      beginWeekDay: '',
      userInfo: {
        role: 0
      },
      courseList: [],
      childTime: true,
      remindItems: [{
          name: '不提醒',
          value: 0
        },
        {
          name: '提前15分钟',
          value: 15
        },
        {
          name: '提前30分钟',
          value: 30
        },
        {
          name: '提前1小时',
          value: 60
        },
        {
          name: '提前2小时',
          value: 120
        },
        {
          name: '提前3小时',
          value: 180
        },
        {
          name: '提前1天',
          value: 1440
        }
      ],
      changeBegin: false,
      setClassMsg: {},
      tachertime: true,
      theindex: 0,
      courseMsg: {
        schoolName: '学校名字可以编辑',
        className: '班级名称',
      }
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        console.log('值', option);
        if (typeof option.childId != 'undefined') {
          const childId = option.childId; //链接过来的childId
          this.setData({
            'model.childId': childId,
          });
        }
        this.setData({
          img: this.$api.extparam.getPageImgUrl('boyb'),
        })
        console.log(option)
        this.setData({
          internalClassId: option.internalClassId,
        })
        put(effects.GETCourseDetails, {
          internalClassId: option.internalClassId
        })
        put(effects.GET_USER_INFO)
        var that = this;
        wx.getSystemInfo({
          success: function (res) {
            that.setData({
              sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
              sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
            });
          }
        });

        let courseTable = courseTableF();
        this.setData({
          courseTable: courseTable
        })

      },
      [PAGE_LIFE.ON_SHOW]() {
        let _this = this
        wx.getStorage({
          key: 'schoolinfo.name',
          success: function (res) {
            _this.setData({
              schoolname: res.data
            })
          },
        })
        wx.getStorage({
          key: 'setClassMsg',
          success(res) {
            _this.setData({
              'setClassMsg': res.data
            })
          },
          fail(res) {
            _this.setData({
              index: 0
            })

          }
        })
        wx.getStorage({
          key: 'schoolinfo.schoolid',
          success: function (res) {
            console.log(res.data)
            _this.setData({
              'courseMsg.schoolId': res.data
            })
          },
        })
        this.$storage.get('InterNameList').then(
            (res) => {
              this.setData({
                InterNameList: res.data
              })

            },
            (rej) => {}
          ),
          this.$storage.get('weekDays').then(
            (res) => {
              this.setData({
                weekDays: res.data
              })
              console.log(this.data.weekDays)
            },
            (rej) => {}
          )
      }

    }
  }

  mapUIEvent({
    put
  }) {
    return {
      [events.ui.quit](e) {
        console.log('退出')
        let state = e.currentTarget.dataset.id
        if (state == 1) {
          this.setData({
            'course.mask': true,
            'course.num': false,
            'course.reapet': false,
            'course.time': false,
            'course.alert': false,
            showCalendar: false
          })
          // 把数据导入

        } else {
          this.setData({
            'course.mask': true,
            'course.num': false,
            'course.reapet': false,
            'course.time': false,
            'course.alert': false,
            showCalendar: false
          })
        }

      },
      // 选择校内课程名称
      [events.ui.CHOOSE_TAG_SEL](e) {

        let swiper = this.data.swiper;
        let i = e.currentTarget.dataset.id;
        let j = swiper.current;
        let l = this.data.InterNameList.length;
        console.log('点击', i, j, swiper, l)
        if (i <= j) {
          if (i == 0) {
            swiper.previous = '0rpx';
            swiper.multiple = 3;
            swiper.current = Math.abs(j);
          } else {
            swiper.current = Math.abs(j - 1);
          }
          console.log('前面');
          this.setData({
            swiper: swiper
          })
        } else if (l - 1 > i) {
          swiper.current = Math.abs(i - 1);
          this.setData({
            swiper: swiper
          })
          console.log('后面')
        } else {
          console.log('最后几个')
        }




        if (this.data.switched) {
          return wx.showToast({
            title: '请先关闭单双周设置开关',
            duration: 1500,
            icon: "none"
          })
        }

        let tagName = e.currentTarget.dataset.name // 菜单选中的课
        let InterNameList = this.data.InterNameList
        let courseTable = this.data.courseTable;
        let color = e.currentTarget.dataset.cor;

        console.log(InterNameList, courseTable, '-------------------')
        InterNameList.forEach(
          (item, index) => {
            if (item.courseName == tagName) {
              item.checked = 1
            } else {
              item.checked = 0
            }
          }
        )

        // 渲染表格样式
        courseTable.forEach(

          (item, index) => {
            item.forEach(
              (item1, index1) => {
                if (index1 != 0 && (item1.courseName || item1.courseName1)) {
                  if (item1.courseName == tagName) {
                    item1.courseClass = 'c_select';
                  } else if (item1.courseName != '' && item1.courseName) {
                    item1.courseClass = 'selected';
                  }
                  if (typeof item1.courseName1 != 'undefined') {
                    if (item1.courseName1 == tagName) {
                      item1.courseClass1 = 'even_w c_select';
                    } else if (item1.courseName1 != '') {
                      item1.courseClass1 = 'selected';
                    }
                  }
                }
              })
          })

        // (item, index) => {
        //   item.forEach(
        //     (item1, index1) => {
        //       if (index1 != 0) {
        //         if (item1.courseName == tagName) {            // 当前课的名字
        //           item1.courseClass = `c_select ${color}`;
        //         } else if (item1.courseName != '') {          // 否
        //           // item1.courseClass = `selected `;            // 灰色
        //         } 
        //         if (typeof item1.courseName1 != 'undefined') {    // 单双周  
        //           if (item1.courseName1 == tagName) {             // 名字不一样
        //             // item1.courseClass1 = 'even_w c_select';
        //             item1.courseClass1 = `${color} c_select`;
        //           } else if (item1.courseName1 != '') {           // 
        //             // item1.courseClass1 = 'selected';
        //           }
        //         }
        //       }
        //     }
        //   )
        // }
        // ) 
        this.setData({
          InterNameList: InterNameList,
          courseTable: courseTable
        });
        console.log('颜色', color, this.data.courseTable)
        this.$storage.set('InterNameList', this.data.InterNameList);

      },
      // 选择课程节数
      [events.ui.bindChange1](e) {
        let stute = e.currentTarget.dataset.id
        const val = e.detail.value;
        let date = this.data.getdate;
        let time = this.data.gettime;
        console.log(val, stute)
        if (stute == 1) {
          // 上课时间
          console.log(`${ date[val[0]]}:${time[val[1]]}`)
          this.setData({
            one:`${ date[val[0]]}:${time[val[1]]}`,
            'model.oneStartTime':`${ date[val[0]]}:${time[val[1]]}`
          })
         
        }else if(stute==2){
          // 下课时间
          this.setData({
            five:`${ date[val[0]]}:${time[val[1]]}`,
            'model.fiveStartTime':`${ date[val[0]]}:${time[val[1]]}`
          });
        }else if(stute ==3){
          // 放学提醒
          this.setData({
            'model.remindIndex': val,
            'model.remindTime': this.data.remindItems[val].value
          });
          console.log(this.data.model)
          if (this.data.userInfo.role == 1 && this.data.model.remindIndex != 0) {
            this.setData({
              tachertime: false
            })
          } else {
            this.setData({
              tachertime: true
            })
          }
          if (this.data.userInfo.role == 0 && this.data.model.remindIndex != 0) {
            this.setData({
              childTime: false,
            })
          } else {
            this.setData({
              childTime: true,
            })
          }
        }
      },
      // 选课
      [events.ui.CHOOSE_TAGS](e) {
        console.log('选课', e.detail.current)
        let swiper = this.data.swiper;
        let InterNameList = this.data.InterNameList;
        let weeks = this.data.weeks;
        swiper.current = e.detail.current
        if (e.detail.current == 0) {
          swiper.previous = '0rpx';
          this.setData({
            swiper: swiper
          })
        } else {
          this.setData({
            swiper: swiper
          })
        }

        if (!weeks) {
          InterNameList.forEach(
            (item, index) => {
              if (index == swiper.current + 1) {
                item.checked = 1
              } else {
                item.checked = 0
              }
            }
          )
          this.setData({
            InterNameList
          })
        }

      },
      // 选择单双周
      [events.ui.getisweek](e) {
        // let i = e.currentTarget.dataset.id;
        let i = e.detail.value;
        console.log('i', i)
        if (this.data.weeks) {
          this.setData({
            weeks: false,
            switched: false
          })
        } else {
          this.setData({
            weeks: true,
            switched: true,
          })
        }
        let InterNameList = this.data.InterNameList
        if (this.data.switched == true) {
          InterNameList.forEach(item => {
            console.log(item)
            item.checked = 0
          })
        } else {
          InterNameList[0].checked = 1
        }
        this.setData({
          InterNameList: InterNameList
        })

        console.log(this.data.switched, this.data.InterNameList)
      },
      //选择孩子
      [events.ui.CHOOSE_CHILD](e) {
        this.setData({
          'model.childId': e.currentTarget.dataset.id,
          'loadChildAll': false
        });
        put(effects.GET_CHILD);
      },
      // 设置放学时间
      [events.ui.SET_SCHOOLOUT](e) {
        let time = e.detail.value;
        let index = e.currentTarget.dataset.index;
        console.log(index)
        let outtime = 'weekDays[' + index + '].value'
        this.setData({
          [outtime]: time
        })
      },
      // 切换tab
      [events.ui.TAB_CLICK](e) {
        this.setData({
          sliderOffset: e.currentTarget.offsetLeft,
          activeIndex: e.currentTarget.id
        });
        if (this.data.activeIndex == 0 && this.data.userInfo.role == 0) {
          put(effects.HAVE_COUSER, {
            childId: this.data.childInfo.childId
          })
        }
      },
      //上课日期
      [events.ui.CHANGE_BEGINDATE](e) {
        let id = e.currentTarget.dataset.id;
        if(id==1){
          // 开学日期
          this.setData({
            showCalendar: true,
            changeBegin: true
          });
        }else if(id == 2){
          // 上课时间
          this.setData({
            'course.starttime':true
          })
        }else if(id ==3){
          // 放学时间
           // 上课时间
           this.setData({
            'course.endtime':true
          })
        }else{
          // 放学提醒
          this.setData({
            'course.alert':true
          })
        }

        
      },
      //上课日期回调
      [events.ui.CALENDAR_DAY_CHANGED](e) {
        console.log(e.detail)
        const currentDate = moment(e.detail.year + ' ' + e.detail.month + ' ' + e.detail.day, 'YYYY-MM-DD').format('YYYY-MM-DD');
        this.setData({
          showCalendar: false
        })
        if (this.data.changeBegin) {
          this.setData({
            'model.startDate': currentDate,
            changeBegin: false,
            'model.endDate': moment(e.detail.year + ' ' + e.detail.month + ' ' + e.detail.day, 'YYYY-MM-DD').add(126, 'day').format('YYYY-MM-DD'),
          })
        }

        put(effects.UPDATE_WEEKDAY);

      },
      //第一节课
      [events.ui.CHANGE_TIMEFIRST](e) {
        this.setData({
          one: e.detail.value,
          'model.oneStartTime': e.detail.value
        });
      },
      // 修改班级
      [events.ui.CHANGE_CLASSNAME](e) {
        console.log(e.detail.value)
        this.setData({
          'model.className': e.detail.value
        })
      },
      //第5节课
      [events.ui.CHANGE_TIMEFIVE](e) {
        this.setData({
          five: e.detail.value,
          'model.fiveStartTime': e.detail.value,
        });
      },
      // 放学提醒
      [events.ui.CHANGE_REMIND](e) {

        // this.setData({
        //   'model.remindIndex': val[0],
        //   'model.remindTxt': this.data.remindItems[ val[0]].name,
        //   'model.remindTime': this.data.remindItems[ val[0]].value
        //   })

        this.setData({
          'model.remindIndex': e.detail.value,
          'model.remindTime': this.data.remindItems[e.detail.value].value
        });
        console.log(this.data.model)
        if (this.data.userInfo.role == 1 && this.data.model.remindIndex != 0) {
          this.setData({
            tachertime: false
          })
        } else {
          this.setData({
            tachertime: true
          })
        }
        if (this.data.userInfo.role == 0 && this.data.model.remindIndex != 0) {
          this.setData({
            childTime: false,
          })
        } else {
          this.setData({
            childTime: true,
          })
        }
      },
      // 选择班级
      [events.ui.chooseClass](e) {
        var num = e.detail.value
        var thisdata = "classList[" + num + "].className"
        var id = this.data.classList[num].classId
        var schoolinclassname = this.data.classList[num].className
        console.log(schoolinclassname)

        console.log(this.data.courseMsg.classId, id)
        if (this.data.model.classId != id) {
          this.$api.course.getCourseCount({
            classId: id
          }).then(res => {
            if (res.data.result != 0) {
              let _this = this
              wx.showModal({
                title: '提示',
                content: '当前班级已经创建校内课程',
                confirmColor: '#f29219',
                success: res => {
                  _this.setData({
                    'courseMsg.className': _this.data.setclassname,
                    'courseMsg.classId': _this.data.setclassid
                  })
                }
              })
            }
          })
        }
        if (num == this.data.classList.length - 1) {
          wx.navigateTo({
            url: '../../classcircle/addClass/addClass?type=course&schoolType=0',
          })
        } else {
          this.setData({
            'setclassname': this.data.courseMsg.className,
            'setclassid': this.data.courseMsg.classId,
            'courseMsg.className': schoolinclassname,
            'courseMsg.classId': id
          })
        }
      },

      [events.ui.shrink](e) {
        if (this.data.shrink) {
          this.setData({
            shrink: false,
            infoHeight: 170
          });
        } else if (!this.data.shrink) {
          this.setData({
            shrink: true,
            infoHeight: 1200
          });
        }
      },
      // 切换tab
      [events.ui.TAB_CLICK](e) {
        this.setData({
          sliderOffset: e.currentTarget.offsetLeft,
          activeIndex: e.currentTarget.id
        });
        if (e.currentTarget.id == 0 && this.data.userInfo.role == 1) {
          console.log(this.data.courseTable)
          let courseTable = this.data.courseTable
          let courseData = [];
          let data = {};
          data.rules = [];
          courseTable.forEach((item1, index1) => {
            for (var i = 0; i < item1.length; i++) {
              if (i != 0) {
                if (typeof item1[i].courseName != 'undefined' && item1[i].courseName != '' || typeof item1[i].courseName1 != 'undefined') {
                  let classTime = ''
                  if (index1 == 0) {
                    classTime = this.data.model.oneStartTime
                  } else if (index1 == 1) {
                    classTime = this.data.model.twoStartTime
                  } else if (index1 == 2) {
                    classTime = this.data.model.threeStartTime
                  } else if (index1 == 3) {
                    classTime = this.data.model.fourStartTime
                  } else if (index1 == 4) {
                    classTime = this.data.model.fiveStartTime
                  } else if (index1 == 5) {
                    classTime = this.data.model.sixStartTime
                  } else if (index1 == 6) {
                    classTime = this.data.model.sevenStartTime
                  } else if (index1 == 7) {
                    classTime = this.data.model.eightStartTime
                  }
                  data.rules.push({
                    dailyRule: index1 + 1,
                    classTime: classTime
                  });
                  break
                }
              }
            }
          })

          this.setData({
            courseList: data.rules
          })
        }
      },
      //跳转学校：
      [events.ui.chooseSchool](e) {
        console.log(e)
        console.log(this.data.model.childId)
        wx.navigateTo({
          url: '../../mypage/school/school?comefrom=changeschool&childId=' + this.data.model.childId
        })
      },
      // 选择校内课程名称
      // [events.ui.CHOOSE_TAG](e) {

      //   if (this.data.switched) {
      //     this.$common.showMessage(this, '请先关闭单双周设置开关');
      //     return;
      //   }
      //   console.log('-------------------')
      //   let tagName = e.currentTarget.dataset.name
      //   let InterNameList = this.data.InterNameList
      //   let courseTable = this.data.courseTable;
      //   InterNameList.forEach(
      //     (item, index) => {
      //       if (item.courseName == tagName) {
      //         item.checked = 1
      //       } else {
      //         item.checked = 0
      //       }
      //     }
      //   )
      //   console.log(this.data.courseTable)
      //   courseTable.forEach(
      //     (item, index) => {
      //       item.forEach(
      //         (item1, index1) => {
      //           if (index1 != 0 && (item1.courseName || item1.courseName1)) {
      //             if (item1.courseName == tagName) {
      //               item1.courseClass = 'c_select';
      //             } else if (item1.courseName != '' && item1.courseName) {
      //               item1.courseClass = 'selected';
      //             }
      //             if (typeof item1.courseName1 != 'undefined') {
      //               if (item1.courseName1 == tagName) {
      //                 item1.courseClass1 = 'even_w c_select';
      //               } else if (item1.courseName1 != '') {
      //                 item1.courseClass1 = 'selected';
      //               }
      //             }
      //           }
      //         })
      //     })
      //   this.setData({
      //     InterNameList: InterNameList,
      //     courseTable: courseTable
      //   });
      //   this.$storage.set('InterNameList', this.data.InterNameList);
      // },


      //老师设置上课时间
      [events.ui.CHANGE_CLASSTIME](e) {
        let classTime = e.detail.value;
        let index = e.currentTarget.dataset.index;
        console.log(index)
        console.log(this.data.courseList[index].dailyRule)
        let idx = this.data.courseList[index].dailyRule
        let classtimer = 'courseList[' + index + '].classTime'
        this.setData({
          [classtimer]: classTime
        })
        if (idx == 1) {
          this.setData({
            'model.oneStartTime': classTime
          })
          console.log(this.data.model.oneStartTime)
        } else if (idx == 2) {
          this.setData({
            'model.twoStartTime': classTime
          })
          console.log(this.data.model.twoStartTime)
        } else if (idx == 3) {
          this.setData({
            'model.threeStartTime': classTime
          })
        } else if (idx == 4) {
          this.setData({
            'model.fourStartTime': classTime
          })
        } else if (idx == 5) {
          this.setData({
            'model.fiveStartTime': classTime
          })
        } else if (idx == 6) {
          this.setData({
            'model.sixStartTime': classTime
          })
        } else if (idx == 7) {
          this.setData({
            'model.sevenStartTime': classTime
          })
        } else if (idx == 8) {
          this.setData({
            'model.eightStartTime': classTime
          })
        }
      },
      // 开启单双周
      [events.ui.BIND_SWITCH](e) {
        console.log(this.data.switched)
        this.setData({
          switched: e.detail.value
        })
        let InterNameList = this.data.InterNameList



        if (this.data.switched == true) {
          InterNameList.forEach((item, index) => {
            console.log(item, index)
            if (item.checked) {
              this.setData({
                theindex: index
              })
            }
          })
          console.log(this.data.theindex)
          InterNameList.forEach(item => {
            item.checked = 0
          })
        } else {
          InterNameList[this.data.theindex].checked = 1
        }
        this.setData({
          InterNameList: InterNameList
        })
      },
      // 加入双周
      [events.ui.ADD_COURSE_CIRCLE](e) {
        if (this.data.switched == false) {
          return;
        }
        let courseTable = this.data.courseTable;
        let row = e.currentTarget.dataset.row;
        let col = e.currentTarget.dataset.col;
        if (typeof courseTable[row][col].courseSwitch != 'undefined') {
          courseTable[row][col].courseSwitch = !courseTable[row][col].courseSwitch;
        } else {
          courseTable[row][col].courseSwitch = true;
        }
        courseTable[row][col].courseName1 = '';
        courseTable[row][col].courseClass1 = '';
        courseTable[row][col].courseNameSub1 = '';
        courseTable[row][col].courseIndex1 = '';
        this.setData({
          courseTable: courseTable
        })
        console.log(this.data.courseTable)
      },


      // 添加单周课程
      [events.ui.BIND_COURSE](e) {
        if (this.data.switched) {
          return;
        }
        let InterNameList = this.data.InterNameList;
        let courseTable = this.data.courseTable;
        let row = e.currentTarget.dataset.row;
        let col = e.currentTarget.dataset.col;
        InterNameList.forEach(

          // (item, index) => {
          //   if (item.checked == 1) {
          //     let currCourseName = item.courseName
          //     let currCourseNameSub = item.courseNameSub
          //     if (courseTable[row][col].courseClass != 'selected') {
          //       if (courseTable[row][col].courseClass == 'c_select') {
          //         courseTable[row][col].courseName = '';
          //         courseTable[row][col].courseClass = '';
          //         courseTable[row][col].courseNameSub = '';
          //         courseTable[row][col].courseIndex = '';
          //       } else {
          //         console.log(this.data.courseTable[row][col], this.data.courseTable[row][col].courseName1)
          //         console.log(currCourseName, item.color)
          //         if (courseTable[row][col].courseName1 == currCourseName) {
          //           return wx.showToast({
          //             title: '双周课程名不能相同',
          //             duration: 1500,
          //             icon: "none",
          //           })
          //         } else {
          //           courseTable[row][col].courseName = currCourseName;
          //           // courseTable[row][col].courseClass = '';
          //           courseTable[row][col].courseClass = `c_select ${item.color}`;
          //           courseTable[row][col].courseNameSub = currCourseNameSub;
          //           courseTable[row][col].courseIndex = index;
          //         }
          //       }
          //     }
          //     this.setData({
          //       courseTable: courseTable
          //     })
          //   }
          // }


          (item, index) => {
            if (item.checked == 1) {
              let currCourseName = item.courseName
              let currCourseNameSub = item.courseNameSub
              if (courseTable[row][col].courseClass != 'selected') {
                if (courseTable[row][col].courseClass == 'c_select') {
                  courseTable[row][col].courseName = '';
                  courseTable[row][col].courseClass = '';
                  courseTable[row][col].courseNameSub = '';
                  courseTable[row][col].courseIndex = '';
                } else {
                  // console.log(this.data.courseTable[row][col], this.data.courseTable[row][col].courseName1)
                  // console.log(currCourseName)
                  if (courseTable[row][col].courseName1 == currCourseName) {
                    this.$common.showMessage(this, '双周课程名不能相同');
                    return;
                  } else {
                    courseTable[row][col].courseName = currCourseName;
                    courseTable[row][col].courseClass = 'c_select';
                    courseTable[row][col].courseNameSub = currCourseNameSub;
                    courseTable[row][col].courseIndex = index;
                  }
                }
              }
              this.setData({
                courseTable: courseTable
              })
            }
          }
        )
        this.$storage.set('InterNameList', this.data.InterNameList);
      },
      // 添加双周课程
      [events.ui.BIND_COURSE_DOUBLE](e) {
        if (this.data.switched) {
          return;
        }
        let InterNameList = this.data.InterNameList;
        let courseTable = this.data.courseTable;
        let row = e.currentTarget.dataset.row;
        let col = e.currentTarget.dataset.col;
        console.log(row, col)
        InterNameList.forEach(
          (item, index) => {
            if (item.checked == 1) {
              let currCourseName = item.courseName
              let currCourseNameSub = item.courseNameSub
              // console.log(currCourseName)
              if (courseTable[row][col].courseClass1 != 'selected') {
                if (courseTable[row][col].courseClass1 == 'even_w c_select') {
                  courseTable[row][col].courseName1 = '';
                  courseTable[row][col].courseClass1 = '';
                  courseTable[row][col].courseNameSub1 = '';
                  courseTable[row][col].courseIndex1 = '';
                } else {
                  console.log(this.data.courseTable[row][col], this.data.courseTable[row][col].courseName)
                  console.log(currCourseName)
                  if (courseTable[row][col].courseName == currCourseName) {
                    this.$common.showMessage(this, '双周课程名不能相同');
                    return;
                  } else {
                    courseTable[row][col].courseName1 = currCourseName;
                    courseTable[row][col].courseClass1 = 'even_w c_select';
                    courseTable[row][col].courseNameSub1 = currCourseNameSub;
                    courseTable[row][col].courseIndex1 = index;
                  }

                }

              }
              this.setData({
                courseTable: courseTable
              })
            }
          }
        )
      },
      [events.ui.BIND_LONG_PRESS](e) {
        let tagName = e.currentTarget.dataset.name
        let InterNameList = this.data.InterNameList
        InterNameList.forEach(
          (item, index) => {
            console.log(item.courseDel, !item.courseDel && item.courseName == tagName)
            if (!item.courseDel && item.courseName == tagName) {
              item.courseDel = true;
            } else {
              item.courseDel = false;
            }
          }
        )
        this.setData({
          InterNameList: InterNameList
        });
        this.setData({
          InterNameList: InterNameList
        });
        this.$storage.set('InterNameList', this.data.InterNameList);
      },
      [events.ui.DEL_TAG](e) {
        let index = e.currentTarget.dataset.index;
        let courseName = e.currentTarget.dataset.coursename;
        let InterNameList = this.data.InterNameList;
        let courseTable = this.data.courseTable;
        let that = this;
        wx.showModal({
          title: '提示',
          content: '您确认要删除该课程吗？',
          showCancel: true,
          confirmColor: '#FF4500',
          success: function (res) {
            if (res.confirm) {
              InterNameList.splice(index, 1);
              courseTable.forEach(
                (item, index) => {
                  item.forEach(
                    (item1, index1) => {
                      if (index1 != 0) {
                        if (item1.courseName == courseName) {
                          item1.courseName = '';
                          item1.courseClass = '';
                          item1.courseNameSub = '';
                          item1.courseIndex = '';
                        }
                        if (typeof item1.courseName1 != 'undefined' && item1.courseName1 == courseName) {
                          item1.courseName1 = '';
                          item1.courseClass1 = '';
                          item1.courseNameSub1 = '';
                          item1.courseIndex1 = '';
                        }
                      }
                    })
                })
              that.setData({
                InterNameList: InterNameList,
                courseTable: courseTable
              });
              that.$storage.set('InterNameList', that.data.InterNameList);
            }
          }
        })
      },
      [events.ui.EDIT_TAG]() {
        let InterNameList = this.data.InterNameList;
        InterNameList.forEach(
          (item, index) => {
            if (item.checked == 1) {
              wx.navigateTo({
                url: '../p_add/schoolin_tag_modify?index=' + index
              })
            }
          }
        )
      },
      [events.ui.ADD_TAG]() {
        wx: wx.setStorageSync('InterNameList', this.data.InterNameList)
        wx.navigateTo({
          url: '../p_add/schoolin_tag_add'
        })
      },
      //保存
      [events.ui.SAVE_NEXT]() {
        put(effects.SAVE_NEXT);
      },
    }
  }

  mapEffect({
    put
  }) {
    const api = this.$api;
    const common = this.$common;
    return {
      //开始日期
      [effects.UPDATE_WEEKDAY]() {
        this.setData({
          beginWeekDay: this.$converter.getWeekDay(this.data.model.startDate)
        });
      },
      //用户信息
      [effects.GET_USER_INFO]() {
        api.user.gerUserInfo().then(
          (res) => {
            if (res.data.errorCode == 0) {
              this.setData({
                userInfo: res.data.result
              })
              put(effects.GET_CHILD);
              if (this.data.userInfo.role == 1) {
                put(effects.GET_CLASSLIST)
              }
              // console.log(this.data.userInfo)
            } else {
              this.$common.showMessage(this, res.data.errorMessage);
              return;
            }
          }
        );
      },
      [effects.GET_CHILD]() {
        const model = this.data.model;
        api.child.get(model).then((res) => {
          // console.log(res)
          this.setData({
            'childInfo': res.data.result.childList[0],
            'childInfo.logo': api.extparam.getLogoUrl(res.data.result.childList[0].logo)
          });
          if (common.isBlank(this.data.model.childId)) {
            this.setData({
              'model.childId': res.data.result.childList[0].childId
            });
          }
          this.$storage.set('childInfo', this.data.childInfo);
          // console.log(this.data.childInfo)
        })
        this.$storage.set('childInfo', this.data.childInfo);
        put(effects.getChildSchoolName);
        put(effects.getAllInternalCourseName);
      },
      // 获取课程表
      [effects.GETCourseDetails](data) {
        api.course.getInternalCourseDetails(data).then(res => {
          this.setData({
            courseMsg: res.data.result,
            courseTable: res.data.result.courseList,
            'model.startDate': res.data.result.startDate,
            'model.endDate': res.data.result.endDate,
            beginWeekDay: this.$converter.getWeekDay(res.data.result.startDate),
            'model.classId': res.data.result.classId,
            'model.oneStartTime': res.data.result.oneStartTime.split(':')[0] + ':' + res.data.result.oneStartTime.split(':')[1],
            'model.twoStartTime': res.data.result.twoStartTime.split(':')[0] + ':' + res.data.result.twoStartTime.split(':')[1],
            'model.threeStartTime': res.data.result.threeStartTime.split(':')[0] + ':' + res.data.result.threeStartTime.split(':')[1],
            'model.fourStartTime': res.data.result.fourStartTime.split(':')[0] + ':' + res.data.result.fourStartTime.split(':')[1],
            'model.fiveStartTime': res.data.result.fiveStartTime.split(':')[0] + ':' + res.data.result.fiveStartTime.split(':')[1],
            'model.sixStartTime': res.data.result.sixStartTime.split(':')[0] + ':' + res.data.result.sixStartTime.split(':')[1],
            'model.sevenStartTime': res.data.result.sevenStartTime.split(':')[0] + ':' + res.data.result.sevenStartTime.split(':')[1],
            'model.eightStartTime': res.data.result.eightStartTime.split(':')[0] + ':' + res.data.result.eightStartTime.split(':')[1],
            'model.remindIndex': res.data.result.outSchoolRemind,
            'model.remindTime': res.data.result.remindTime,
            'mondayRemindTime': res.data.result.mondayRemindTime.split(':')[0] + ':' + res.data.result.mondayRemindTime.split(':')[1],
            'tuesRemindTime': res.data.result.tuesdayRemindTime.split(':')[0] + ':' + res.data.result.tuesdayRemindTime.split(':')[1],
            'wedRemindTime': res.data.result.wednesdayRemindTime.split(':')[0] + ':' + res.data.result.wednesdayRemindTime.split(':')[1],
            'tuhRemindTime': res.data.result.thursdayRemindTime.split(':')[0] + ':' + res.data.result.thursdayRemindTime.split(':')[1],
            'friRemindTime': res.data.result.fridayRemindTime.split(':')[0] + ':' + res.data.result.fridayRemindTime.split(':')[1],
            one: res.data.result.oneStartTime.split(':')[0] + ':' + res.data.result.oneStartTime.split(':')[1],
            five: res.data.result.fiveStartTime.split(':')[0] + ':' + res.data.result.fiveStartTime.split(':')[1],
          })
          console.log(this.data.courseMsg)
          console.log(this.data.courseMsg.courseNameStr.split(','))
          let courseList = this.data.courseMsg.courseNameStr.split(',')

          let interName = []
          courseList.forEach(item => {
            interName.push({
              courseName: item,
              courseNameSub: item.substring(0, 1),
              courseDel: false,
              checked: 0
            })
          })
          console.log(interName)
          interName[0].checked = 1
          this.setData({
            InterNameList: interName
          })
          if (this.data.model.remindIndex == 1) {
            if (this.data.model.remindTime == 0 || !this.data.model.remindTime) {
              this.setData({
                tachertime: true,
                childTime: true,
                'model.remindIndex': 0,
              })
            } else {
              this.setData({
                tachertime: false,
                childTime: false,
              })
              switch (this.data.model.remindTime) {
                case 15:
                  this.setData({
                    'model.remindIndex': 1,
                  })
                  break;
                case 30:
                  this.setData({
                    'model.remindIndex': 2,
                  })
                  break;
                case 60:
                  this.setData({
                    'model.remindIndex': 3,
                  })
                  break;
                case 120:
                  this.setData({
                    'model.remindIndex': 4,
                  })
                  break;
                case 180:
                  this.setData({
                    'model.remindIndex': 5,
                  })
                  break;
                default:
                  this.setData({
                    'model.remindIndex': 6,
                  })
              }
            }
          } else {
            this.setData({
              'model.remindIndex': 0
            })
          }


          let time1 = 'weekDays[0].value'
          let time2 = 'weekDays[1].value'
          let time3 = 'weekDays[2].value'
          let time4 = 'weekDays[3].value'
          let time5 = 'weekDays[4].value'
          this.setData({
            [time1]: this.data.mondayRemindTime,
            [time2]: this.data.tuesRemindTime,
            [time3]: this.data.wedRemindTime,
            [time4]: this.data.tuhRemindTime,
            [time5]: this.data.friRemindTime,
          })
          let courseTable = this.data.courseTable
          let courseData = [];
          let data = {};
          data.rules = [];
          courseTable.forEach((item1, index1) => {
            for (var i = 0; i < item1.length; i++) {
              if (i != 0) {
                if (typeof item1[i].courseName != 'undefined' || typeof item1[i].courseName1 != 'undefined') {
                  // console.log(item1[i].courseName)
                  data.rules.push({
                    dailyRule: index1 + 1,
                    classTime: '设置时间'
                  });
                  break
                }
              }
            }
          })
          // console.log(data.rules);
          this.setData({
            courseList: data.rules
          })
          // console.log(this.data.courseList)
          this.setData({
            'model.startDate': this.data.courseMsg.startDate,
            'model.endDate': this.data.courseMsg.endDate,
            'model.schoolName': this.data.courseMsg.schoolName,
            'model.className': this.data.courseMsg.className,
          })
          this.data.InterNameList.forEach((item, index) => {
            if (item.checked == 1) {
              this.setData({
                theCheckedData: item
              })
            }
          })
          console.log(this.data.courseTable)
          this.data.courseTable.forEach((list, num) => {
            list.forEach((item, index) => {
              if (index != 0 && (item.courseNameSub || item.courseNameSub1)) {
                if (!item.courseSwitch) {
                  if (item.courseNameSub == this.data.theCheckedData.courseNameSub) {
                    item.courseClass = "c_select"
                  } else {
                    item.courseClass = 'selected'
                  }
                } else {
                  if (item.courseNameSub == this.data.theCheckedData.courseNameSub) {
                    item.courseClass = "c_select"
                  } else if (item.courseNameSub) {
                    item.courseClass = 'selected'
                  }
                  if (item.courseNameSub1 == this.data.theCheckedData.courseNameSub) {
                    item.courseClass1 = "even_w c_select"
                  } else if (item.courseNameSub1) {
                    item.courseClass1 = 'selected'
                  }
                }
              }
              let courseindex = 'courseTable[' + num + '][' + index + ']'
              this.setData({
                [courseindex]: item
              })
            })
          })
          console.log(this.data.courseTable)
        })
      },
      // 获取班级列表
      [effects.GET_CLASSLIST]() {
        this.$api.class.getClassList({}).then(res => {
          let zidingyi = {
            classId: '000',
            className: "自定义",
          }
          var list = []
          if (res.data.errorCode == 0) {
            if (res.data.result.length > 0) {
              res.data.result.forEach(item => {
                if (item.classType == 1) {
                  list.push(item)
                }
              })
              // console.log(list)
              this.setData({
                list: res.data.result,
                classList: list.concat(zidingyi)
              })
            }
          }
          // console.log(this.data.classList)
          this.$storage.set('fistClass', this.data.classList[0]);
        })
      },

      [effects.SAVE_NEXT]() {
        console.log(this.data)
        let canNext = true;
        if (this.data.userInfo.role == 1) {
          if (!this.data.tachertime) {
            this.data.courseList.forEach(item => {
              console.log(item.dailyRule)
              if (item.dailyRule == 1) {
                if (common.isBlank(this.data.model.oneStartTime)) {
                  canNext = false
                }
              } else if (item.dailyRule == 2) {
                if (common.isBlank(this.data.model.twoStartTime)) {
                  canNext = false
                }
              } else if (item.dailyRule == 3) {
                if (common.isBlank(this.data.model.threeStartTime)) {
                  canNext = false
                }
              } else if (item.dailyRule == 4) {
                if (common.isBlank(this.data.model.fourStartTime)) {
                  canNext = false
                }
              } else if (item.dailyRule == 5) {
                if (common.isBlank(this.data.model.fiveStartTime)) {
                  canNext = false
                }
              } else if (item.dailyRule == 6) {
                if (common.isBlank(this.data.model.sixStartTime)) {
                  canNext = false
                }
              } else if (item.dailyRule == 7) {
                if (common.isBlank(this.data.model.sevenStartTime)) {
                  canNext = false
                }
              } else if (item.dailyRule == 8) {
                console.log(this.data.model.eightStartTime)
                if (common.isBlank(this.data.model.eightStartTime)) {
                  canNext = false
                }
              }
            })
          }
        }
        let courseTable = this.data.courseTable
        var courseData = [];
        // if (this.data.userInfo.role == 0) {
        courseTable.forEach((item1, index1) => {
          item1.forEach((item2, index2) => {
            let data = {};
            data.rules = [];
            if (index2 != 0) {
              if (item2.courseName != '' && typeof item2.courseName != 'undefined') {
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
        // } else {
        //   // 教师端
        //   courseTable.forEach((item1, index1) => {
        //     item1.forEach((item2, index2) => {
        //       let data = {};
        //       data.rules = [];
        //       if (index2 != 0) {
        //         if (item2.courseName != '' && typeof item2.courseName != 'undefined') {
        //           data.rules.push({
        //             weekday: index2,
        //             dailyRule: index1 + 1
        //           });
        //           if (item2.courseName1 != '' && typeof item2.courseName1 != 'undefined') {
        //             data.courseName = item2.courseName + ',' + item2.courseName1;
        //             data.weeklyRule = 2;
        //           } else {
        //             if (item2.courseSwitch) {
        //               data.weeklyRule = 1;
        //               data.courseName = item2.courseName + ',*';
        //             } else {
        //               data.weeklyRule = 0;
        //               data.courseName = item2.courseName;
        //             }
        //           }
        //           if (data) {
        //             courseData.push(data)
        //           }
        //         } else {
        //           if (item2.courseName1 != '' && typeof item2.courseName1 != 'undefined') {
        //             console.log(1)
        //             data.rules.push({
        //               weekday: index2,
        //               dailyRule: index1 + 1
        //             });
        //             data.courseName = '*,' + item2.courseName1;
        //             data.weeklyRule = 2;
        //             if (data) {
        //               courseData.push(data)
        //             }
        //           }
        //         }
        //       }
        //     })
        //   })
        // }
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
        let remind = ''
        if (this.data.model.remindIndex == 0) {
          remind = 2
        } else {
          remind = 1
        }
        let weekDays = this.data.weekDays
        let model = this.data.model

        var inputMap = {
          internalClassId: this.data.internalClassId,
          courseNames: courseData,
          classId: this.data.courseMsg.classId,
          className: model.className,
          schoolId: this.data.courseMsg.schoolId,
          startDate: model.startDate,
          endDate: model.endDate,
          oneStartTime: model.oneStartTime,
          twoStartTime: model.twoStartTime,
          threeStartTime: model.threeStartTime,
          fourStartTime: model.fourStartTime,
          fiveStartTime: model.fiveStartTime,
          sixStartTime: model.sixStartTime,
          sevenStartTime: model.sevenStartTime,
          eightStartTime: model.eightStartTime,
          remind: remind,
          remindTime: model.remindTime,
          MonRemindTime: weekDays[0].value,
          TuesRemindTime: weekDays[1].value,
          WedRemindTime: weekDays[2].value,
          TuhRemindTime: weekDays[3].value,
          FriRemindTime: weekDays[4].value,
        }


        if (canNext) {
          console.log(inputMap)
          // return;
          this.$api.course.updateInternalCourse(inputMap).then(res => {
            console.log(res.data)
            if (res.data.errorCode == 0) {
              wx.showToast({
                title: '修改成功',
              })
              wx.showToast({
                title: '修改成功',
                icon: 'success',
                duration: 1500,
                'course.mask': true,
                success: (res) => {
                  if (time) {
                    clearTimeout(time)
                  }
                  let time = setTimeout(() => {
                    wx.navigateBack({
                      delta: 1,
                    })
                  }, 1500)

                },
                fail: (res) => {
                  wx.navigateBack({
                    delta: 1,
                  })
                },
                complete: function (res) {},
              })

              // setTimeout(function() {
              //   wx.switchTab({
              //     url: '../course',
              //   })
              // }, 1000)

            }
          })
        } else {
          common.showMessage(this, '请选择上课时间');
          return
        }
      },
    }
  }
}

EApp.instance.register({
  type: SchoolinEditePage,
  id: 'SchoolinEditePage',
  config: {
    events,
    effects,
    actions
  }
});
import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../eea/index'
import {
  events,
  effects,
  actions
} from './schoolout_manage_edit.eea'
const moment = require('../../../lib/moment.min.js');

function set_times(stute) {
  let val_time = [];
  if (stute == true) {
    for (let i = 6; i < 20; i++) {
      if (i < 10) {
        i = '0' + i
      }
      val_time.push(i)
    }
  } else {
    let j = 0;
    for (let i = 0; i < 12; i++) {
      if (j < 10) {
        val_time.push('0' + j)
      } else {
        val_time.push(j)
      }
      j += 5
    }
  }
  return val_time
}

var sliderWidth = 96;

class SchooloutManageEditPage extends EPage {

  get data() {
    return {
      getdate: set_times(true),
      gettime: set_times(),
      userInfo: {}, //当前用户信息
      tabs: ["上课时间", "增加课节", "删除课程"],
      activeIndex: 0, // 二级切换下标
      sliderOffset: 0,
      sliderLeft: 0, // 元素左边的距离
      tabsSub: ["未上", "已上", "全部"],
      activeIndexSub: 0,
      sliderOffsetSub: 0,
      sliderLeftSub: 0,
      tabsSub1: ["课程信息修改", "课节信息修改"],
      activeIndexSub1: 1, // 一级切换下标
      sliderOffsetSub1: 0,
      sliderLeftSub1: 0, // left 距离
      repDis: false,
      model: {
        childId: '',
        condition: 3,
        // condition: 0,

      },
      childInfo: {},
      courseInfo: {
        repetitionTxt: '无',

      },
      lessonInfo: {},
      repetitionItems: ['无', '每天', '每周', '每两周', '自定义'],
      weekDayItems: [{
          name: '星期一',
          value: '2',
          checked: true
        },
        {
          name: '星期二',
          value: '3'
        },
        {
          name: '星期三',
          value: '4'
        },
        {
          name: '星期四',
          value: '5'
        },
        {
          name: '星期五',
          value: '6'
        },
        {
          name: '星期六',
          value: '7'
        },
        {
          name: '星期日',
          value: '1'
        },
      ],
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
      endClass: true,
      endShow: true,
      userDefined: false,
      classnews1: true,
      classnews2: false,
      block1: true,
      block2: false,
      block3: true,
      opeTxt: '调整上课时间',
      selectAllTxt: '全选',
      selectAll: false, //控制全选图标
      showCalendar: false,
      mask: true,
      location: false,
      course: {
        reapet: false,
        time: false,
        alert: false
      },
      value: '',
      value3: '',
      myactiveIndex:''
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        console.log('值', option)
        const childId = option.childId; //链接过来的childId
        const courseId = option.courseId; //课程id
        if (option.hasOwnProperty('activeIndex')){
          this.setData({
            myactiveIndex: option.activeIndex
          })
        }
        this.setData({
          'model.childId': childId,
          'model.courseId': courseId
        });
        //获取用户信息
        put(effects.GET_USER_INFO);
        put(effects.GET_CHILD);
        put(effects.GET_COURSE_BY_ID);
        put(effects.GET_LESSONS_BY_COURSEID);
        var that = this;
        wx.getSystemInfo({
          success: function(res) {
            that.setData({
              sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
              sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
              // sliderLeftSub: (res.windowWidth / that.data.tabsSub.length - sliderWidth) / 2,
              // sliderOffsetSub: res.windowWidth / that.data.tabsSub.length * that.data.activeIndexSub,
              // sliderLeftSub1: (res.windowWidth / that.data.tabsSub1.length - sliderWidth) / 2,
              // sliderOffsetSub1: res.windowWidth / that.data.tabsSub1.length * that.data.activeIndexSub1
            });
          }
        });
      },
      [PAGE_LIFE.ON_SHOW](option) {

      }
    }
  }


  mapUIEvent({
    put
  }) {
    return {
      // 一级切换
      [events.ui.TAB_CLICK_SUBS](e) {
        this.setData({
          sliderOffsetSub1: e.currentTarget.offsetLeft,
          activeIndexSub1: e.currentTarget.id
        });
        if (e.currentTarget.id == 0) {
          this.setData({
            'model.condition': 0
          })
        } else if (e.currentTarget.id == 1) {
          this.setData({
            opeTxt: '调整上课时间'
          })
          this.setData({
            'model.condition': 3,
            activeIndexSub: 0,
            sliderOffsetSub: 0
          })
        }
      },
      // 二级切换
      [events.ui.TAB_CLICK](e) {
        this.setData({
          sliderOffset: e.currentTarget.offsetLeft,
          activeIndex: e.currentTarget.id
        });
        if (e.currentTarget.id == 0) {
          put(effects.CHANGE_BLOCK1)
          this.setData({
            opeTxt: '调整上课时间'
          })
          this.setData({
            'model.condition': 3,
            activeIndexSub: 0,
            sliderOffsetSub: 0
          })
        } else if (e.currentTarget.id == 2) {
          put(effects.CHANGE_BLOCK1)
          this.setData({
            opeTxt: '删除'
          })
          this.setData({
            'model.condition': 3,
            activeIndexSub: 0,
            sliderOffsetSub: 0
          })
        } else {
          this.setData({
            'model.condition': 1
          })
          put(effects.CHANGE_BLOCK2)
        }

      },
      [events.ui.TAB_CLICK_SUB](e) {
        this.setData({
          sliderOffsetSub: e.currentTarget.offsetLeft,
          activeIndexSub: e.currentTarget.id
        });
        if (e.currentTarget.id == 0) {
          this.setData({
            'model.condition': 3
          })
        } else if (e.currentTarget.id == 1) {
          this.setData({
            'model.condition': 1
          })
        } else if (e.currentTarget.id == 2) {
          if (typeof this.data.model.condition != 'undefined') {
            delete this.data.model.condition;
          }
        }
        put(effects.GET_LESSONS_BY_COURSEID);
      },
      //地点
      [events.ui.SELECT_ADDRESS]() {
        console.log('选择地点')

        let that = this
        wx.getSetting({
          success(res) {
            console.log(res)
            if (!res.authSetting['scope.userLocation']) {
              wx.authorize({
                scope: 'scope.userLocation',
                success() {
                  wx.chooseLocation({
                    success: (res) => {
                      console.log(res);
                      const address = res.address || res.name;
                      that.setData({
                        'courseInfo.classAddress': address,
                        'courseInfo.latitude': res.latitude,
                        'courseInfo.longitude': res.longitude
                      });
                    },
                  })
                },
                fail() {
                  // setTimeout( res => {
                  that.setData({
                    location: true
                  })
                  // },500)
                }
              })
            } else {
              console.log('获取位置')
              wx.chooseLocation({
                success: (res) => {
                  console.log(res);
                  const address = res.address || res.name;
                  that.setData({
                    'courseInfo.classAddress': address,
                    'courseInfo.latitude': res.latitude,
                    'courseInfo.longitude': res.longitude
                  });
                },
              })
            }
          },
          fail(res) {
            wx.hideLoading()
            console.log('wx.getSetting 失败回调')
            console.log(res);
          }
        })


        // wx.chooseLocation({
        //   success: (res) => {
        //     const address = res.address || res.name;
        //     this.setData({
        //       'courseInfo.classAddress': address,
        //       'courseInfo.latitude': res.latitude,
        //       'courseInfo.longitude': res.longitude
        //     });

        //   },
        //   fail:function (res) {
        //     console.log('getLocation res fail:', res);
        //     // 系统关闭定位
        //     if(res.errMsg === 'getLocation:fail:system permission denied' || res.errMsg === 'getLocation:fail:system permission deny'){
        //         return wx.showModal({
        //             title:'无法获取你的位置信息',
        //             content:'请到手机系统的[设置]->[位置信息]中打开定位服务，并允许微信使用定位服务。',
        //             showCancel:false,
        //             confirmText:'确定',
        //             confirmColor:'#0052A4'
        //         })
        //     }
        //     //用户取消授权
        //     if(res.errMsg === 'getLocation:fail:auth deny' || res.errMsg === 'getLocation:fail:auth denied'){
        //         //用户取消授权
        //        return wx.showToast({
        //          title: '用户取消授权',
        //          duration: 1500,
        //          icon: 'none',
        //        })
        //     }else{
        //       getLocation.call(this)
        //     }
        // }
        // });
      },
      //教室
      [events.ui.CHANGE_CLASSROOM](e) {
        this.setData({
          'courseInfo.classRoom': e.detail.value
        });
      },
      [events.ui.CHANGE_TEACHER](e) {
        this.setData({
          'courseInfo.teacher': e.detail.value
        });
      },
      [events.ui.CHANGE_TEL](e) {
        this.setData({
          'courseInfo.contactTel': e.detail.value
        });
      },
      //上课日期
      [events.ui.CHANGE_BEGINDATE](e) {
        this.setData({
          showCalendar: true
        });
      },
      //上课日期回调
      [events.ui.CALENDAR_DAY_CHANGED](e) {
        const currentDate = moment(e.detail.year + ' ' + e.detail.month + ' ' + e.detail.day, 'YYYY-MM-DD').format('YYYY-MM-DD');
        this.setData({
          'courseInfo.beginDate': currentDate,
          showCalendar: false
        })
        put(effects.UPDATE_WEEKDAY);
        put(effects.CHANGE_ENDDATE);
      },
      //课程节数
      [events.ui.CHANGE_NUM](e) {
        if (this.$common.isIntNum(e.detail.value) == false) {
          this.$common.showMessage(this, '请输入数字');
          return false;
        }
        this.setData({
          'courseInfo.num': e.detail.value,
          "endShow": true
        });
        if (e.detail.value == 1) {
          // this.setData({repDis:true,'courseInfo.repetitionIndex':0})
        } else {
          this.setData({
            repDis: false,
            'courseInfo.repetitionIndex': 0
          })
        }
        if (this.$common.isIntNum(e.detail.value)) {
          put(effects.CHANGE_ENDDATE);
        }
      },
      //课程时长
      [events.ui.CHANGE_DURATION](e) {
        if (this.$common.isIntNum(e.detail.value) == false) {
          this.$common.showMessage(this, '请输入大于0的数字');
          //this.setData({'courseInfo.duration':0})
          return false;
        }
        this.setData({
          'courseInfo.duration': e.detail.value,
          endclass: false,
          'courseInfo.endClassTime': moment(this.data.courseInfo.startClassTime, 'HH:mm').add('minute', e.detail.value).format('HH:mm')
        });
      },
      // 选择课程节数
      [events.ui.bindChange1](e) {
        let stute = e.currentTarget.dataset.id
        const val = e.detail.value
        console.log(val, stute)
        if (stute == 1) {
          // if (this.$common.isIntNum(val[0])) {
          //   this.setData({
          //     'model.num': val[0],
          //     // 'model.duration': val[0],    // 课程时长
          //   })
          //     put(effects.CHANGE_ENDDATE);
          // } else {

          //   return  wx.showToast({
          //     title: '请输入正确的数值',
          //     icon: 'none',
          //     duration: 2000
          //   })
          // }
        } else if (stute == 2) {

          // console.log('重复', e, this.data.model.num)
          console.log(e.detail.value)
          if (e.detail.value != 0) {
            this.setData({
              'courseInfo.repetitionIndex': e.detail.value[0],
              'courseInfo.repetitionTxt': this.data.repetitionItems[e.detail.value],
              "endShow": false
            });
            if (e.detail.value == 4) {
              this.setData({
                mask: true,
                'userDefined': true,
                'course.reapet': false,
              });
              put(effects.CHANGE_ENDDATE);
            }
            if (this.$common.isIntNum(this.data.model.num)) {
              // 获取结束日期
              put(effects.CHANGE_ENDDATE);
            }
          } else {
            this.$common.showMessage(this, '请选择重复方式');
            this.setData({
              'model.repetitionIndex': e.detail.value[0],
              endShow: true
            })
          }
          put(effects.UPDATE_WEEKDAY);
          put(effects.CHANGE_ENDDATE);
        } else if (stute == 3) { // 开始时间
          let date = this.data.getdate;
          let time = this.data.gettime;
          let time1 = `${date[val[0]]}:${time[val[1]]}`
          if (this.$common.isIntNum(val[0])) {
            this.setData({
            'courseInfo.startClassTime': time1,
            'courseInfo.endClassTime': moment(time1, 'HH:mm').add('minute', this.data.courseInfo.duration).format('HH:mm')
            })
          }
          // let time = `${Math.abs(val[0]-1)<10?'0'+ Math.abs(val[0]-1) :Math.abs(val[0]-1)}:${Math.abs(val[1]-1)<10?'0'+ Math.abs(val[1]-1) :Math.abs(val[1]-1)}`
          // this.setData({
          //   'courseInfo.startClassTime': time,
          //   'courseInfo.endClassTime': moment(time, 'HH:mm').add('minute', this.data.courseInfo.duration).format('HH:mm')
          // });



        } else if (stute == 4) {
          this.setData({
            'courseInfo.remindIndex': e.detail.value,
            'courseInfo.remindTxt': this.data.remindItems[e.detail.value].name,
            'courseInfo.remindValue': this.data.remindItems[e.detail.value].value
          });
        }
      },
      [events.ui.quit](e) {
        console.log('退出')
        let state = e.currentTarget.dataset.id
        if (state == 1) {
          this.setData({
            mask: true,
            location: false,
            'course.num': false,
            'course.reapet': false,
            'course.time': false,
            'course.alert': false,
            showCalendar: false
          })
          // 把数据导入

        } else {
          this.setData({
            mask: true,
            location: false,
            'course.num': false,
            'course.reapet': false,
            'course.time': false,
            'course.alert': false,
            showCalendar: false
          })
        }

      },
      //开始时间
      [events.ui.CHANGE_TIMEFIRST](e) {
        this.setData({
          'courseInfo.startClassTime': e.detail.value,
          'courseInfo.endClassTime': moment(e.detail.value, 'HH:mm').add('minute', this.data.courseInfo.duration).format('HH:mm')
        });
      },

      //重复
      [events.ui.CHANGE_REPETITION](e) {
        console.log(e.detail)
        this.setData({
          'courseInfo.repetitionIndex': e.detail.value,
          'courseInfo.repetitionTxt': this.data.repetitionItems[e.detail.value],
          "endShow": false
        });
        console.log(this.data.courseInfo.repetitionTxt)
        if (e.detail.value == 4) {
          this.setData({
            'userDefined': true
          });
        }
        // if (e.detail.value == 4) {
        //   this.setData({ "endShow": false});
        // }
        if (e.detail.value != 4) {
          put(effects.CHANGE_ENDDATE);
        }

      },
      //自定义层
      [events.ui.CHANGE_CUSTOM_REPETITION](e) {
        const values = e.detail.value;
        const items = this.data.weekDayItems;
        this.setData({
          'courseInfo.weekDaysTxt': ''
        });
        items.forEach(item => {
          item.checked = values.findIndex(val => item.value === val) > -1;
          if (item.checked) {
            this.setData({
              'courseInfo.weekDaysTxt': this.data.courseInfo.weekDaysTxt + ',' + item.name
            });
          }
        });
        this.setData({
          'courseInfo.weekDaysTxt': this.data.courseInfo.weekDaysTxt.substr(1)
        });
        this.setData({
          'courseInfo.weekDays': values.join(',')
        });
        this.setData({
          weekDayItems: items
        });
      },
      //确定自定义
      [events.ui.CHANGE_DEFINED](e) {
        if (this.$common.isBlank(this.data.courseInfo.weekDays)) {
          this.$common.showMessage(this, '请选择星期')
          return
        }
        this.setData({
          'userDefined': false
        });
        put(effects.CHANGE_ENDDATE);
      },

      // 弹框提示
      [events.ui.CHANGE_ALERT](e) {
        let stute = e.currentTarget.dataset.id;
        if (stute == 1) {
          // 打开 上课提醒
          this.setData({
            mask: false,
            'course.alert': true,
          })
        } else if (stute == 2) {
          // 打开 重复
          this.setData({
            mask: false,
            'course.reapet': true,
          })
        } else if (stute == 3) {
          // 打开上课时间
          this.setData({
            mask: false,
            'course.time': true,
          })
        }
        console.log(stute)
      },
      [events.ui.CHANGE_REMIND](e) {
        this.setData({
          'courseInfo.remindIndex': e.detail.value,
          'courseInfo.remindTxt': this.data.remindItems[e.detail.value].name,
          'courseInfo.remindValue': this.data.remindItems[e.detail.value].value
        });
      },
      [events.ui.CHANGE_REMIND_B](e) {
        this.setData({
          'courseInfo.remindIndex': e.detail.value,
          'courseInfo.remindTxt': this.data.remindItems[e.detail.value].name,
          'courseInfo.remindValue': this.data.remindItems[e.detail.value].value
        });
      },
      //复选框
      [events.ui.CHAGNE_CHECKBOX](e) {
        const list = this.data.lessonInfo.list;
        const index = e.currentTarget.dataset.index;
        let ids = [];
        list[index].checked = !list[index].checked;
        list.forEach(
          item => {
            if (item.checked) {

              ids.push(item.id)
            }
          }
        )
        this.setData({
          'lessonInfo.list': list,
          'model.ids': ids
        })
      },
      //全选、取消全选
      [events.ui.SELECT_ALL](e) {
        const list = this.data.lessonInfo.list;
        let ids = [];
        if (this.data.selectAll == false) {
          list.forEach(
            item => {
              console.log(item.id)
              item.checked = true
              ids.push(item.id)
            }
          )
          this.setData({
            selectAllTxt: '取消全选'
          })
        } else {
          list.forEach(
            item => {
              item.checked = false
            }
          )
          this.setData({
            selectAllTxt: '全选'
          })
        }

        this.setData({
          'selectAll': !this.data.selectAll,
          'lessonInfo.list': list,
          'model.ids': ids
        })
      },
      //批量删除或显示调整时间
      [events.ui.OPE_BUTTON](e) {

        // wx.showModal({
        //   title: '提示!',
        //   content: '你确定要删除当前课程么？',
        //   confirmColor: '#f29219',
        //   cancelColor: '#007aff',
        //   confirmText: '确认',
        //   cancelText: '取消',
        //   success: function (res) {}
        // })
        if (this.data.activeIndex == 0) {
          //调整时间
          if (this.$common.isBlank(this.data.model.ids)) {
            this.$common.showMessage(this, '请勾选课节')
            return false;
          }
          this.setData({
            'courseInfo.num': this.data.model.ids.length,
            updata_num: 0
          })
          put(effects.CHANGE_BLOCK2);
          put(effects.CHANGE_ENDDATE);
          this.setData({
            'model.condition': 1
          })
          if (this.data.model.ids.length == 1) {
            this.setData({
              repDis: true,
              'courseInfo.repetitionIndex': 0
            })
          } else {
            this.setData({
              repDis: false,
              'courseInfo.repetitionIndex': 2
            })
          }
        } else if (this.data.activeIndex == 2) {
          //删除
          var _this = this;
          wx.showModal({
            title: '提示!',
            content: '你确定要删除当前课程么？',
            confirmColor: '#f29219',
            // cancelColor: '#007aff',
            confirmText: '确认',
            cancelText: '取消',
            success: function(res) {
              if (res.confirm) {
                if (_this.$common.isBlank(_this.data.model.ids)) {
                  _this.$common.showMessage(_this, '请勾选课节')
                  return false;
                }
                put(effects.DELETE_LESSON);
              } else if (res.cancel) {}
            }

          })


        }



      },
      //批量修改或增加
      [events.ui.SAVE](e) {
        if (this.data.activeIndex == 0) {
          put(effects.BATCH_UPDATE);

        } else if (this.data.activeIndex == 1) {
          put(effects.SAVE);
          console.log(12)
        }

      },
      //课程信息修改
      [events.ui.CLASS_NEW](e) {
        put(effects.COURSE_UPDATE);
        console.log(0)
        //  if(this.data.activeIndex==0){
        //    put(effects.COURSE_UPDATE);
        //  }

      },
      //阻止遮罩层下滚动页面
      [events.ui.eStop](e) {
        // this.setData({
        //   showCalendar: false
        // })
        return false;
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
      //block1/2的显示、隐藏
      [effects.CHANGE_BLOCK1]() {
        this.setData({
          block1: true,
          block2: false
        })
      },
      [effects.CHANGE_BLOCK2]() {
        this.setData({
          block1: false,
          block2: true
        })
      },
      [effects.UPDATE_WEEKDAY]() {
        this.setData({
          'courseInfo.beginWeekDay': this.$converter.getWeekDay(this.data.courseInfo.beginDate)
        });
      },
      [effects.CHANGE_ENDDATE]() {
        const model = this.data.courseInfo;
        api.course.getEndDate(model).then(
          (res) => {
            this.setData({
              'courseInfo.endDate': res.data.result.finishTime,
              'courseInfo.endWeekDay': this.$converter.getWeekDay(res.data.result.finishTime)
            });
          },
          () => {}
        )
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
        api.course.getone(this.data.model).then(
          (res) => {
            const rs = res.data.result;
            rs.beginDate = moment(rs.issueTime).format('YYYY-MM-DD')
            rs.endDate = moment(rs.finishTime).format('YYYY-MM-DD')
            rs.startClassTime = moment(rs.startTime, 'HH:mm').format('HH:mm')
            rs.endClassTime = moment(rs.endTime, 'HH:mm').format('HH:mm')
            rs.beginWeekDay = this.$converter.getWeekDay(rs.beginDate)
            rs.endWeekDay = this.$converter.getWeekDay(rs.endDate)
            rs.repetitionIndex = rs.frequency
            rs.remindValue = rs.notify
            rs.remindIndex = 0;
            rs.num = 0;
            this.data.remindItems.forEach(function(e, index) {
              if (e.value == rs.notify) {
                rs.remindIndex = index
              }
            })
            rs.weekDaysTxt = '';
            rs.weekDays = rs.userDefine;
            if (!common.isBlank(rs.userDefine)) {
              const items = this.data.weekDayItems;
              items.forEach(item => {
                item.checked = rs.userDefine.indexOf(item.value) > -1;
                if (item.checked) {
                  rs.weekDaysTxt += ',' + item.name;
                }
              });
              rs.weekDaysTxt = rs.weekDaysTxt.substr(1);
              this.setData({
                weekDayItems: items
              });
            }
            if (rs.num == 1 || rs.num == 0) {
              this.setData({
                repDis: true
              });
            }
            this.setData({
              courseInfo: res.data.result
            })
          },
          (rej) => {}
        )
      },
      //课程对应的课节列表
      [effects.GET_LESSONS_BY_COURSEID]() {
        api.course.getLesson(this.data.model).then(
          (res) => {
            const converter = this.$converter;
            const rs = res.data.result;
            rs.courseList.forEach(function(e) {
              e.formatDate = moment(e.startTime).format('YYYY-MM-DD')
              e.formatBeginTime = moment(e.startTime, 'YYYY-MM-DD HH:mm').format('HH:mm')
              e.formatEndTime = moment(e.endTime, 'YYYY-MM-DD HH:mm').format('HH:mm')
              e.weekDay = converter.getWeekDay(e.formatDate)
              e.checked = false
            })

            this.setData({
              'lessonInfo.list': rs.courseList, //status:1=出勤 0=剩余; type:1=缺课 2=调课 3=补课
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
      //增加课程
      [effects.SAVE]() {
        const model = this.data.courseInfo;
        if (common.isBlank(model.beginDate)) {
          common.showMessage(this, '请选择开学日期');
          return false;
        }
        if (common.isBlank(model.num)) {
          common.showMessage(this, '请填写课程节数');
          return false;
        }
        if (!common.isIntNum(model.num)) {
          common.showMessage(this, '请填写大于0的数字');
          return false;
        }
        if (common.isBlank(model.startClassTime)) {
          common.showMessage(this, '请选择开始时间');
          return false;
        }

        if (common.isBlank(model.duration) || model.duration == '0') {
          common.showMessage(this, '请填写课程时长');
          return false;
        }
        api.course.createLesson(model).then(
          (res) => {
            if (res.data.errorCode == '0') {
              // wx.navigateTo({url:'./schoolout_manage?childId='+model.childId})
              wx.navigateBack({

              })
            } else if (res.data.errorCode == '100070') {
              wx.showModal({
                title: '警告',
                content: `该时间段已经安排了课程“${res.data.result[0].NAME}”，请重新选择时间。`,
                confirmText: '查看',
                confirmColor: '#f29219',
                showCancel: true,
                cancelText: '取消',
                success(resp) {
                  if (resp.confirm) {
                    wx.navigateTo({
                      url: '../p_lesson/schoolout_lesson_detail?lessonId=' + res.data.result[0].id + '&childId=' + model.childId
                    })
                  }
                  if (resp.cancel) {

                  }
                }
              });
            } else if (res.data.errorCode == '100073' || res.data.errorCode == '100074') {
              common.showMessage(this, res.data.errorMessage);
            }

          },
          (rej) => {

          }
        );
      },
      //课程信息修改
      [effects.COURSE_UPDATE]() {
        const model = this.data.courseInfo;
        // console.log(model); return false;
        api.course.updateCourseInfo(model).then(
          (res) => {
            if (res.data.errorCode == '0') {
              let activeIndex = this.data.activeIndex;
              console.log('这是个啥', res.data.result, activeIndex)
              // pages/course/p_manage/schoolout_manage
              // activeIndex = 1 & childId=102177

              wx.showModal({
                title: '提示',
                content: '课程信息修改成功！',
                showCancel: false,
                confirmColor: '#EFCF0B',
                confirmText: '完成修改',
                success: function (res) {
                  if (res.confirm) {

                    wx.navigateBack({
                      delta: 1,
                    })
                }
                }
              })

            }

          })
      },
      //批量修改
      [effects.BATCH_UPDATE]() {
        const model = this.data.courseInfo;
        model.ids = this.data.model.ids;
        // console.log(model);return false;
        api.course.batchUpdateLesson(model).then(
          (res) => {
            if (res.data.errorCode == '0') {
              // wx.navigateTo({url:'./schoolout_manage?childId='+model.childId})
              wx.navigateBack({

              })
            } else if (res.data.errorCode == '100070') {
              wx.showModal({
                title: '警告',
                content: `该时间段已经安排了课程“${res.data.result[0].NAME}”，请重新选择时间。`,
                confirmText: '查看',
                confirmColor: '#f29219',
                showCancel: true,
                cancelText: '取消',
                success(resp) {
                  if (resp.confirm) {
                    wx.navigateTo({
                      url: '../p_lesson/schoolout_lesson_detail?lessonId=' + res.data.result[0].id + '&childId=' + model.childId
                    })
                  }
                  if (resp.cancel) {

                  }
                }
              });
            } else if (res.data.errorCode == '100073' || res.data.errorCode == '100074') {
              common.showMessage(this, res.data.errorMessage);
            }

          },
          (rej) => {

          }
        );
      },
      //批量删除课节
      [effects.DELETE_LESSON]() {
        const model = this.data.courseInfo;
        model.ids = this.data.model.ids;
        console.log(model)
        api.course.deleteLesson(model).then(
          (res) => {
            if (res.data.errorCode == 0) {
              // wx.navigateTo({url:'./schoolout_manage?childId='+model.childId})
              wx.navigateBack({

              })
            } else if (res.data.errorCode == '100073' || res.data.errorCode == '100074') {
              common.showMessage(this, res.data.errorMessage);
            }
          },
          (rej) => {}
        );
      }
    }
  }
}

EApp.instance.register({
  type: SchooloutManageEditPage,
  id: 'SchooloutManageEditPage',
  config: {
    events,
    effects,
    actions
  }
});
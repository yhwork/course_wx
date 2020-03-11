import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../eea/index'
import {
  events,
  effects,
  actions
} from './schoolout_lesson_detail.eea'
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
    for (let i = 0; i < 4; i++) {
      if (j == 0) {
        val_time.push('0' + j)
      } else {
        val_time.push(j)
      }
      j += 15
    }
  }
  return val_time
}


class SchooloutLessonDetailPage extends EPage {
  get data() {
    return {
      getdate: set_times(true),
      gettime: set_times(),
      shareHide: true,
      userInfo: {}, //当前用户信息
      model: {
        childId: '',
        source: ''
      },
      childInfo: {
        logo: '/assets/img/gexing.png'
      },
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
      imageUrl: '',
      mask: true,
      isshare: false,
      course: {
        'time': false,
        'update': true,
        endDate: true,
        beginTime: true
      },
      isrwo: false,
      updata_data: {
        'date': '',
        'time': ''
      },
      shareCavansOptions: {
        id: 'share_canvas',
        width: 0,
        height: 0
      },
      share_img: 'https://qa.oss.iforbao.com/public/assets/local/share_course1.png',
      showCalendar: false,
    };
  }

  mapPageEvent({
    put
  }) {

    return {
      [PAGE_LIFE.ON_LOAD](option) {
        this.setData({
          // img : this.$api.extparam.getPageImgUrl('newcourse')
          // https://qa.oss.iforbao.com/public/assets/local/share_course1.png
          share_img: 'https://qa.oss.iforbao.com/public/assets/local/share_course1.png'
        })
        console.log('值', option)
        wx.hideShareMenu();
        const {
          shareCavansOptions
        } = this.data;
        shareCavansOptions.width = wx.getSystemInfoSync().screenWidth;
        shareCavansOptions.height = shareCavansOptions.width * 5 / 4;
        this.setData({
          shareCavansOptions
        });

        if (typeof option.childId != 'undefined' && typeof option.lessonId != 'undefined') {
          const childId = option.childId;
          const lessonId = option.lessonId;
          this.setData({
            'model.childId': childId,
            'model.lessonId': lessonId
          });
        } else {
          put(effects.GET_CHILD);
        }

        if (typeof option.source != 'undefined') {
          const source = option.source;
          this.setData({
            'model.source': source
          });
        }
      },
      [PAGE_LIFE.ON_SHOW](option) {
        if (this.data.isshare){
          return  wx.navigateBack({
            delta: 1,
          })
        }
       



        put(effects.GET_CHILD);
        //获取用户信息
        put(effects.GET_USER_INFO);
        put(effects.GET_USER_INFOS);

      },
      [PAGE_LIFE.ON_SHARE_APP_MESSAGE](e) {
        this.setData({
          shareHide: true,
          isshare:true
        });
        const {
          from
        } = e;
        const {
          shareInfo,
          userInfo,
          model,
        } = this.data;
        if (from === 'button') {
          return {
            title: `[${userInfo.nickName}@您]给您分享了${shareInfo.orgName}《${shareInfo.name}》课程，点击查看详情`,
            path: `/pages/course/courseList/courseList?action=share&code=${shareInfo.shortCode}&childId=${model.childId}`,
            imageUrl: '/assets/local/share_course1.png',
            success: (res) => {
              // this.$common.showToast('分享成功', 'success');
              wx.showToast({
                title: '分享成功',
                icon: 'success',
                duration: 1500,
                mask: true,
                success: (res) => {
                  console.log('分享成功')
                  wx.navigateBack({
                    delta: 1,
                  })
                },
                complete:()=>{
                  console.log('分享失败')
                  wx.navigateBack({
                    delta: 1,
                  })
                }
              })
            }
          }
        }

        return {
          title: `[${userInfo.nickName}@您]分享了小豆包课程表`,
          path: '/pages/course/course',
          imageUrl: this.data.share_img
        }
      },
      // 上拉刷新
      [PAGE_LIFE.ON_PULL_DOWN_REFRESH]() { //上拉刷新
        // put(effects.getStoreProductHotList) //实时请求加载   //方法需要注册
        let time = null;
        time = setTimeout(() => {
          wx.stopPullDownRefresh();
          time = null;
          put(effects.GET_CHILD);
          //获取用户信息
          put(effects.GET_USER_INFO);
        }, 200)

      }

    }
  }

  mapUIEvent({
    put
  }) {
    const api = this.$api;
    const common = this.$common;
    const converter = this.$converter;
    return {
      // 保存修改时间
      [events.ui.SAVE_NEXT](e) {
        const model = this.data.model
        // model.type=2  // 调课
        // 判断是调课还是补课
        // if (model.type==2){

        // }else{

        // }
        model.startTime = this.data.lessonInfo.beginDate + ' ' + this.data.lessonInfo.beginTime
        model.endTime = this.data.lessonInfo.endDate + ' ' + this.data.lessonInfo.endTime
        console.log(model);
        api.course.updateLesson(this.data.model).then(
          (res) => {
            if (res.data.errorCode == '0') {
              console.log('修改课程成功')
              wx.showToast({
                title: '修改课程成功',
                duration: 1500,
                icon: "none",
              })
              this.setData({
                mask: true,
                'course.update': true,
              })

              put(effects.GET_CHILD);
              //获取用户信息
              put(effects.GET_USER_INFO);
              // this.$storage.set('childId',model.childId)
              // wx.navigateBack({
              //   delta: 1, // 返回上一级
              // })
              // wx.reLaunch({
              //   url: '/pages/course/course?current =' + 3 + "&childId=" + model.childId,
              //   success: (res)=>{},
              //   fail: function(res) {},
              //   complete: function(res) {},
              // })
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
                      url: './schoolout_lesson_detail?lessonId=' + res.data.result[0].id + '&childId=' + model.childId
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

        )
      },
      // 下课时间
      [events.ui.bindChange1](e) {

        //  `${Math.abs(val[0]-1)<10?'0'+ Math.abs(val[0]-1) :Math.abs(val[0]-1)}:${Math.abs(val[1]-1)<10?'0'+ Math.abs(val[1]-1) :Math.abs(val[1]-1)}`
        const val = e.detail.value;
        let date = this.data.getdate;
        let time = this.data.gettime;

        console.log(time[val[1]], date[val[0]], val)
        this.setData({
          'lessonInfo.beginTime': `${ date[val[0]]}:${time[val[1]]}`,
          'lessonInfo.endTime': moment(`${ date[val[0]]}:${time[val[1]]}`, 'HH:mm').add('minute', this.data.lessonInfo.duration).format('HH:mm')
        })

        // this.setData({ 
        //   'lessonInfo.beginTime': e.detail.value,
        //   'lessonInfo.endTime': moment(e.detail.value,'HH:mm').add('minute',this.data.lessonInfo.duration).format('HH:mm')
        // });
      },
      // 消失
      [events.ui.quit]() {
        let isrwo = this.data.isrwo;
        console.log('消失', isrwo)
        if (isrwo) {
          this.setData({
            showCalendar: false,
            'course.time': false,
            isrwo: false,
          })
        } else {
          this.setData({
            showCalendar: false,
            'course.time': false,
            isrwo: false,
            mask: true,
            'course.update': true,
          })
        }
      },
      //上课日期
      [events.ui.CHANGE_BEGINDATE](e) {
        console.log(e)
        var times = e.currentTarget.dataset.times;
        if (times == 0) {
          // 开始日期
          this.setData({
            state_datatime: true,
            'course.time': true,
            'course.beginTime': false
          });

        } else {
          // 结束日期
          this.setData({
            state_datatime: false,
            showCalendar: true,
            'course.endDate': false
          });
        }
        this.setData({
          isrwo: true,
        });
      },
      //上课日期回调
      [events.ui.CALENDAR_DAY_CHANGED](e) {
        console.log(this.data.state_datatime)
        if (this.data.state_datatime == true) {
          const currentDate = moment(e.detail.year + ' ' + e.detail.month + ' ' + e.detail.day, 'YYYY-MM-DD').format('YYYY-MM-DD');
          console.log('日期1', currentDate)
          this.setData({
            'lessonInfo.beginDate': currentDate, //开始时间
            'lessonInfo.endDate': currentDate, // 结束时间
            showCalendar: false,
            isrwo: false,
          });
        } else {
          const currentDate = moment(e.detail.year + ' ' + e.detail.month + ' ' + e.detail.day, 'YYYY-MM-DD').format('YYYY-MM-DD');
          console.log('日期2', currentDate)
          this.setData({
            'lessonInfo.beginDate': currentDate, //开始时间
            'lessonInfo.endDate': currentDate, // 结束时间
            showCalendar: false,
            isrwo: false,
          });
        }
        put(effects.UPDATE_WEEKDAY);
      },
      //查看位置
      [events.ui.OPEN_LOCATION](e) {
        let longitude = Number(this.data.lessonInfo.longitude);
        let latitude = Number(this.data.lessonInfo.latitude);
        wx.openLocation({
          latitude: latitude,
          longitude: longitude
        })
      },
      //调课
      [events.ui.OPE_CHANGE](e) {
        if (this.data.editpower == 'true') {

          this.setData({
            'course.update': false,
            mask: false,
            'model.type': 2
          })
          console.log(this.data.model, this.data.lessonInfo)
          // wx.redirectTo({
          //   url: './schoolout_lesson_change?childId=' + this.data.model.childId + '&lessonId=' + this.data.model.lessonId + '&type=2&source=' + this.data.model.source
          // })

        }
      },
      //补课
      [events.ui.OPE_REMEDIAL](e) {
        if (this.data.editpower == 'true') {
          // wx.redirectTo({
          //   url: './schoolout_lesson_change?childId=' + this.data.model.childId + '&lessonId=' + this.data.model.lessonId + '&type=3'
          // })

          this.setData({
            'course.update': false,
            mask: false,
            'model.type': 3
          })
        }

      },
      //缺席
      [events.ui.OPE_ABSENT](e) {
        if (this.data.editpower == 'true') {
          this.setData({
            'model.lessonId': this.data.model.lessonId
          });
          wx.showModal({
            title: '提示',
            content: '你确定要缺勤当前课程么？',
            showCancel: true,
            confirmColor: '#FF4500',
            success: (res) => {
              if (res.confirm) {
                put(effects.UPDATE_LESSON);
              }
            }
          })
        } else {
          common.showMessage(this, '共享人没有开启修改孩子的权限')
        }

      },
      //删除
      [events.ui.OPE_DEL](e) {
        if (this.data.editpower == 'true') {
          wx.showModal({
            title: '提示',
            content: '你确定要删除该课程么？',
            showCancel: true,
            confirmColor: '#FF4500',
            success: function(res) {
              if (res.confirm) {
                put(effects.DEL_LESSON);
              }
            }
          })
        }

      },
      //显示分享遮罩层
      [events.ui.SHOW_SHARE](e) {
        wx.getImageInfo({
          src: 'https://iforbao-prod.oss-cn-hangzhou.aliyuncs.com/public/assets/img/share_internalcourse.jpg',
          success: (res) => {
            // this.setData({
            //   imageUrl: res.path
            // })
            wx.showLoading({
              title: '图片生成中',
              mask: true,
            })
            let shareInfo = this.data.lessonInfo;
            shareInfo.imageUrl = res.path;
            const param = {};
            param.dataType = 2;
            param.data = {
              'lessonId': shareInfo.lessonId,
            };
            this.$api.user.shareInfoRecord(param).then(
              (res) => {
                if (res.data.errorCode == '0') {
                  const param1 = {};
                  param1.dataType = 0;
                  param1.data = {
                    'lessonId': shareInfo.lessonId,
                    'target': 'lesson',
                    'shortCode': res.data.result.shortCode,
                    'childId': this.data.model.childId,
                  };
                  this.$api.user.shareInfoRecord(param1).then(
                    (res) => {
                      shareInfo.shortCode = res.data.result.shortCode;
                      console.log('分享', this.data.shareCavansOptions, '信息', shareInfo)
                      this.$image.generateShareCourse(this.data.shareCavansOptions, shareInfo, 'lesson').then(imageUrl => {
                        console.log('保存本地', imageUrl);

                        // wx.saveImageToPhotosAlbum({
                        //   filePath:imageUrl,
                        //   success:(res)=> {
                        //     console.log(res,'成功')
                        //   }
                        // })
                        //'https://iforbao-prod.oss-cn-hangzhou.aliyuncs.com/public/assets/img/share_internalcourse.jpg'

                        shareInfo.imageUrl = imageUrl;
                        this.setData({
                          shareHide: false,
                          shareInfo
                        });
                        wx.hideLoading()
                        wx.showToast({
                          title: '生成成功',
                          icon: 'success',
                          duration: 1500,
                          mask: true,
                        })
                      }).catch(err => {
                        console.log(err)
                        wx.showToast({
                          title: '生成失败',
                          icon: 'success',
                          duration: 1500,
                          mask: true,
                        })
                      })
                    }
                  )
                } else {
                  this.$common.showMessage(this, res.data.errorMessage);
                  return;
                }
              }
            )


          },
          fail: (err) => {
            wx.showToast({
              title: '分享失败',
              icon: 'waining',
              duration: 1500,
            })
          }
        })


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
    const converter = this.$converter;
    return {
      // 获取分享信息
      [effects.GETSHARE_INFOS](e) {
        let shareInfo = this.data.lessonInfo;
        const param = {};
        param.dataType = 2;
        param.data = {
          'lessonId': shareInfo.lessonId,
        };
        this.$api.user.shareInfoRecord(param).then(
          (res) => {
            if (res.data.errorCode == '0') {
              const param1 = {};
              param1.dataType = 0;
              param1.data = {
                'lessonId': shareInfo.lessonId,
                'target': 'lesson',
                'shortCode': res.data.result.shortCode,
                'childId': this.data.model.childId,
              };
              this.$api.user.shareInfoRecord(param1).then(
                (res) => {
                  shareInfo.shortCode = res.data.result.shortCode;
                  this.setData({
                    // shareHide: false,
                    shareInfo
                  });
                  console.log('分享信息详情', shareInfo)
                })
            }
          })
      },
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
            put(effects.GET_LESSON_DETAIL);
          },
          (rej) => {}
        )
      },
      //课节信息
      [effects.GET_LESSON_DETAIL]() {
        console.log('请求课节信息', this.data.model)
        api.course.getLessonOne(this.data.model).then(
          (res) => {
            console.log('请求课节信息', res)
            this.setData({
              editpower: res.data.result.edit
            })
            console.log(this.data.editpower)
            const rs = res.data.result;
            rs.lessonId = this.data.model.lessonId
            rs.beginDate = moment(rs.startTime).format('YYYY-MM-DD')
            rs.endDate = moment(rs.endTime).format('YYYY-MM-DD')
            rs.notifyTxt = ''
            this.data.remindItems.forEach(function(e) {
              if (e.value == rs.notify) {
                rs.notifyTxt = e.name
              }
            })
            rs.leftClassShow = Number(rs.leftClass) + Number(rs.absentClass),
              rs.percent = Math.round(rs.attendClass / rs.allClass * 100)
            if (typeof rs.status == 'undefined') {
              rs.status = '';
            }
            this.setData({
              lessonInfo: rs,
              'updata_data.date': rs.startTime.split(' ')[1],
              'updata_data.beginDate': rs.beginDate,
              'lessonInfo.beginTime': rs.startTime.split(' ')[1], //开始时间
            })
            put(effects.GETSHARE_INFOS)
          },
          (rej) => {}
        )
      },
      //课节操作
      [effects.UPDATE_LESSON]() {
        const model = this.data.model;
        model.type = 1;
        api.course.updateLesson(model).then(res => {
          if (res.data.errorCode == '100073' || res.data.errorCode == '100074') {
            return common.showMessage(_this, '共享人没有开启修改孩子的权限');
          } else if (res.data.errorCode == 0) {
            this.$storage.set('childId', model.childId).then(res => {

              //返回上一级
              const wxCurrPage = getCurrentPages(); //获取当前页面的页面栈
              const wxPrevPage = wxCurrPage[wxCurrPage.length - 2]; //获取上级页面的page对象
              console.log('获取当前页面的页面栈', wxCurrPage, 'sss', wxPrevPage);
              if (wxPrevPage) {
                //修改上级页面的数据
                wxPrevPage.setData({
                  baseData: true, //baseData为上级页面的某个数据
                })
              }
              wx.navigateBack({
                delta: 1, // 返回上一级
              })


              // 返回列表
              // wx.reLaunch({
              //   url: '/pages/course/course?current =' + 3 + "&childId=" + model.childId,
              //   success: (res) => {},
              //   fail: function(res) {},
              //   complete: function(res) {},
              // })
            })
          }

        })
      },
      //删除课节
      [effects.DEL_LESSON]() {
        const model = this.data.model;
        model.id = this.data.lessonInfo.courseId;
        const ids = this.data.model.lessonId;
        const arr = new Array();
        arr[0] = ids;
        model.ids = arr;
        let _this = this
        api.course.deleteLesson(model).then(res => {
          console.log(res)
          if (res.data.errorCode == '100073' || res.data.errorCode == '100074') {
            common.showMessage(_this, '共享人没有开启修改孩子的权限');
          } else {
            wx.navigateBack()
          }
        })
      }

    }
  }
}

EApp.instance.register({
  type: SchooloutLessonDetailPage,
  id: 'SchooloutLessonDetailPage',
  config: {
    events,
    effects,
    actions
  }
});
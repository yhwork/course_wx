import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../eea/index'
import {
  events,
  effects,
  actions
} from './courseList.eea'

import moment from '../../../lib/moment.min.js'
const app = getApp();

class CourseListPage extends EPage {
  get data() {
    return {
      childlist: [],
      showFollowModel: false,
      chooldchild: {},
      headImg: '', // 头像
      userName: '', // 孩子姓名
      nickName: '', // 用户昵称
      name: '', // 真实姓名
      mask_state: false,
      current: -1,
      childId: '',
      queryDate: '',
      childid_i: '',
      model: {
        currentDate: '2019-06-27',
        currentMonth: moment().format('YYYY-MM'),
        childId: '',
        diff: 0,
        comefrom: ''
      },
      lessonList: [],
      more_staste: false,
      role: '',
      headImg1: '',
      manage: '',
      gender: '', // 性别
      haveClass: '',
      lessonLists: [],
      one: false,
      two: false,
      imgType: false,
      isAuthorization: false
    };
  }
  // 页面  默认首页  
  mapPageEvent({
    put,
    dispatch
  }) {
    return {
      // [PAGE_LIFE.on_tap]() {
      //   let isAuto = this.data.isAuthorization
      //   if (isAuto) {
      //     return false
      //   } else {
      //     wx.getSetting({
      //       success: (res) => {
      //         if (!res.authSetting['scope.userInfo']) {
      //           this.setData({
      //             isAuthorization: false
      //           })
      //           // return wx.redirectTo({
      //           //   // url: '/pages/register/register'
      //           //   url:'/pages/mypage/mypage/mypage'
      //           // })
      //           wx.showToast({
      //             title: '请先授权',
      //             icon: 'none',
      //             // image: '',
      //             duration: 1500,
      //             mask: true,
      //             success: function(res) {},
      //             fail: function(res) {},
      //             complete: function(res) {},
      //           })
      //         } else {
      //           this.setData({
      //             isAuthorization: true
      //           })
      //         }
      //       },
      //       fail(err) {
      //         console.log('授权失败')
      //       }
      //     })
      //   }
      // },
      [PAGE_LIFE.ON_LOAD](option) {
        console.log('值', option)
        put(effects.USERINFO) // 获取用户信息
        put(effects.CHECK_FOLLOW) // 是否关注公众号
      

        this.$common.checkAuth1().then(
          (res) => {
            console.log('授权了嘛', res)
            if (res.authSetting['scope.userInfo']) {
              if (option) {
                put(effects.GET_SHARE, option)
              }
              dispatch(actions.HANDLE_ACTION, option);
            } else {
              let str = JSON.stringify(option)
              if (str != '{}') {
                wx.redirectTo({
                  url: '/pages/register/register?shareMsg=' + str
                })
              } else {
                // wx.redirectTo({
                //   url: '/pages/register/register'
                // })
              }
            }
          },
          (rej) => {
            wx.redirectTo({
              url: '/pages/register/register'
            })
          }
        )
      },

      [PAGE_LIFE.ON_SHOW]() {
        put(effects.USERINFO)
        wx.getSetting({
          success: (res) => {
            if (!res.authSetting['scope.userInfo']) {
              this.setData({
                isAuthorization: false
              })
              console.log('没有授权用户信息', this.data.isAuthorization)
            } else {
              this.setData({
                isAuthorization: true
              })
              console.log('已经授权用户信息', this.data.isAuthorization)
            }
          },
          fail(err) {
            console.log('授权失败')
          }
        })

      },
      // 上拉刷新
      [PAGE_LIFE.ON_PULL_DOWN_REFRESH]() { //上拉刷新
        // put(effects.getStoreProductHotList) //实时请求加载   //方法需要注册
        let time = null;
        time = setTimeout(() => {
          wx.stopPullDownRefresh();
          time = null;
          put(effects.USERINFO)
          put(effects.getChildList)
          put(effects.loadCourseTime)
          // put(effects.getChildList)
        }, 200)

      }
    }
  }
  // 事件
  mapUIEvent({
    put,
    dispatch
  }) {
    return {
      // 点击授权事件
      [events.ui.scopeUserInfo](e) {

        let isAuto = e.currentTarget.dataset.isauto
        console.log('点击', isAuto, e)
        if (isAuto) {
          console.log('点击sssss')
          return false
        } else {
          wx.showToast({
            title: '暂无该用户信息',
            icon: 'none',
            duration: 1500,
            mask: true,
            success: (res) => {
              let time = null;
              if (time) {
                clearTimeout(time)
              } else {
                var sss = '/pages/mypage/mypage/mypage'
                time = setTimeout(() => {
                  // 跳到tabbar页面
                  return wx.switchTab({
                    url: sss
                  })
                }, 1500)
              }
            },
            fail: (res) => {
              return wx.switchTab({
                //  url: '/pages/register/register'
                url: '/pages/mypage/mypage/mypage'
              })
            },
            complete: function(res) {},
          })

        }
      },
      // 查看更多
      [events.ui.goIndex](e) {
        var state = e.currentTarget.dataset.current
        this.setData({
          current: state,
          more_staste: false
        })
        let imgType = this.data.imgType;
        var childId = this.data.childId
        console.log(childId, state, imgType)
        if (this.data.role == 0) {
          if (state == 1) {
            wx.navigateTo({
              url: '/pages/course/course?current=' + state + "&childId=" + childId,
            })
          } else if (state == 0) {
            // 课程管理
            if (imgType == true) {
              wx.navigateTo({
                url: '/pages/course/p_manage/schoolout_manage?activeIndex=0' + "&childId=" + childId, // 打开校内
              })
            } else {
              wx.navigateTo({
                url: '/pages/course/course?current=' + state + "&childId=" + childId,
              })
            }

          } else if (state == 3) {
            // 传一个
            wx.navigateTo({
              url: '/pages/course/course?current=' + 3 + "&childId=" + childId,
            })

          }
        } else {
          if (state == 1) {
            wx.navigateTo({
              url: '/pages/course/course?current=' + state + "&childId=" + childId,
            })
          } else if (state == 0) {
            // 课程管理
            if (imgType == true) {
              wx.navigateTo({
                url: '/pages/course/p_manage/schoolout_manage?activeIndex=0', // 打开校内
              })
            } else {
              wx.navigateTo({
                url: '/pages/course/course?current=' + state + "&childId=" + childId,
              })
            }
          } else if (state == 3) {
            // 传一个
            wx.navigateTo({
              url: '/pages/course/course?current=' + 3 + "",
            })
          }
        }



      },
      // 新建日程
      [events.ui.addClass]() {
        var childId = this.data.childId
        wx.navigateTo({
          url: '/pages/course/p_add/schoolout_add1?childId=' + childId,
        })
      },
      // 点击切换身份
      [events.ui.showMask]() {
        put(effects.getChildList)
        this.setData({
          mask_state: true
        })
      },
      [events.ui.showMore](e) {
        put(effects.GET_CLASSLIST)
        this.setData({
          current: e.currentTarget.dataset.current,
          more_staste: !(this.data.more_staste)
        })
      },
      [events.ui.goManage](e) {
        this.setData({
          current: e.currentTarget.dataset.current,
          more_staste: false
        })
        console.log('逝者嘛')
        let childId = this.data.childId;
        wx.navigateTo({
          url: '/pages/course/p_manage/schoolout_manage?activeIndex=1' + "&childId=" + childId, // 打开校内
        })
      },
      // 日程表
      [events.ui.goCourseManage](e) {
        var manage = e.currentTarget.dataset.manage // 判断日程表
        this.setData({
          current: e.currentTarget.dataset.current,
          more_staste: false
        })
        console.log('状态', manage);
        if (this.data.role == 0) {
          console.log('家长端')
          // 等下再跳转
          // wx.navigateTo({
          //   url: '/pages/mypage/editMyChild/editMyChild?childId=' + this.data.childId + '&manage=' + manage,
          // })
          // 再判断是设置还是共享
          if (manage == 'false') {
            wx.navigateTo({
              url: '/pages/mypage/myChildren/myChildren?childId=' + this.data.childId
            })
          } else {
            wx.navigateTo({
              url: '/pages/mypage/editMyChild/editMyChild?childId=' + this.data.childId + '&manage=' + manage,
            })
          }
        } else if (this.data.role == 1) {
          console.log('教师端')
          wx.navigateTo({
            url: '/pages/mypage/personalInfo/personalInfo?&manage=' + manage,
          })

        }
      },
      //取消关注
      [events.ui.CANCEL_FOLLOW](e) {
        this.setData({
          showFollowModel: false
        })
      },
      [events.ui.goClassInfo](e) {

        // 判断有没有班级
        var haveClass = this.data.haveClass;
        console.log(haveClass)
        if (haveClass) {
          // 创建班级
          wx.navigateTo({
            url: '/pages/classcircle/addPeport/addPeport?userId=' + wx.getStorageSync('userId') + '&role=' + this.data.role + '&type=' + e.currentTarget.dataset.type,
          })
        } else {
          // 跳到创建班级界面
          wx.switchTab({
            url: '/pages/class/class',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        }
      },
      // 查看日程表详情
      [events.ui.courdetails](e) {
        // 获取孩子  childId   获取  日程 courseId  editpower true  // 权限
        console.log(e)
        var lessonId = e.currentTarget.dataset.id;
        var childId = this.data.childId;
        let dataType = e.currentTarget.dataset.datatype // 2校内   1校外
        let internalClassId = e.currentTarget.dataset.classid;
        console.log(dataType, internalClassId, '查看校内还是校外');
        if (dataType == 1) {
          wx.navigateTo({
            url: `../p_lesson/schoolout_lesson_detail?lessonId=${lessonId}&childId=${childId}`
          })
        } else if (dataType == 2 && internalClassId) {
          wx.navigateTo({
            url: `/pages/course/p_manage/schoolin_manage_detail?childId=${childId}&internalClassId=${internalClassId}`
          })
        }
        // wx.navigateTo({
        //   url: `/pages/course/p_manage/schoolout_manage_share?courseId=${rs.courseId}&code=${rs.shortCode}`
        // });
        // wx.navigateTo({
        //   url: `/pages/course/p_manage/schoolout_manage_detail?courseId=${courseId}&childId=${childId}&editpower=${tuue}`
        // })

      },
      [events.ui.changeMask](e) {
        this.setData({
          mask_state: false
        })
      },
      // 切换小孩子
      [events.ui.chargeUser](e) {
        // 重新请求小孩子列表
        var childid = e.currentTarget.dataset.id;
        var i = e.currentTarget.dataset.i;
        this.setData({
          childid_i: i
        })
        console.log(childid, i)
        var childlist = this.data.childlist
        childlist.forEach(item => {
          console.log(item)
          if (item.childId == childid) {
            this.setData({
              headImg: item.logo,
              userName: item.childName,
              childId: item.childId,
              gender: item.gender
            })
          }
        })
        this.setData({
          mask_state: false,
          childId: childid,
          'model.childId': childid
        })
        wx.setStorage({
          key: 'childId',
          data: childid
        })
        put(effects.loadCourseTime) // 最近
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


    }
  }
  // 接口 api
  mapEffect({
    put,
    dispatch
  }) {

    const api = this.$api;
    const common = this.$common;
    return {
      [effects.GET_SHARE](option) {
        const {
          action
        } = option;
        console.log(action)
        if (action === 'share') {
          console.log('登录成功')
          this.$api.user.getShareInfo(option).then(
            (res) => {
              console.log(res.data.result)
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
                } else if (rs.target == "productGroup") {
                  wx.navigateTo({
                    url: `/pages/buyShop/page/hotProduct/hotProduct`,
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
      // 获取用户信息
      [effects.USERINFO](option) {
        this.$api.user.gerUserInfo({}).then(res => {
          var role = res.data.result.role;
          var nickName = res.data.result.nickName;
          var name = res.data.result.name;
          this.setData({
            role: role,
            headImg1: res.data.result.logo,
            nickName: nickName,
            name: name
          })
          if (role == 0) { // 家长获取孩子
            put(effects.getChildList) // 获取孩子列表
          } else if (role == 1) {
            put(effects.loadCourseTime) // 获取日程
          }

          /**
           * role 0 家长端
           *      1 教师端
           */
          if (role == 0) {

            wx.setTabBarItem({
              index: 1,
              text: '学习圈',
              // iconPath: '/path/to/iconPath',
              // selectedIconPath: '/path/to/selectedIconPath'
            })
            this.setData({
              manage: 'true'
            })
            wx.setNavigationBarTitle({
              title: '课程表（家长端）',
            })
          } else if (role == 1) {
            this.setData({
              manage: 'false'
            })
            wx.setTabBarItem({
              index: 1,
              text: ' 消息',
              // iconPath: '/path/to/iconPath',
              // selectedIconPath: '/path/to/selectedIconPath'
            })
            wx.setNavigationBarTitle({
              title: '课程表（教师端）',
            })
          }


        })
      },
      //获取孩子列表
      [effects.getChildList]() {
        // 判断是家长端还是教师端的
        let role = this.data.role;                 // 判断角色
        let childList = [];                         // 控制优先级
        let secnder = [];                           // 备选优先级
        const currentDate = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD');
        this.$api.circle.getChildListByCondition({}).then(async res => {
          var i = this.data.childid_i              // 第一次点击
          if (res.data.errorCode == '0') {
            let list = res.data.result.childList;  // 小孩列表
            console.log('小孩id',list)
            for (let item of list){
            // list.map(  (item,index)=>{
              let params = {
                queryDate: currentDate,
                childId: item.childId
              }
              // console.log('参数家长0', params, role); 
              let data =  await this.$api.course.loadCourseTime(params)  // 查找课程
              console.log('课程',data)
              var lessonLists = data.data.result.list;           // 课程
              if (lessonLists != null && lessonLists.length >= 1) {                    // 两天都有数据
                  if (currentDate == lessonLists[0].date) { // 第一天有数据
                    console.log('第一天数据的条数', lessonLists[0].courseList.length)
                    childList.push({ 
                      headImg: item.logo,
                      userName: item.childName,
                      childId: item.childId,
                      gender: item.gender,
                      })            // 记录改小孩的id
                      // 设置 消息的数量
                      this.setData({
                        messagenum: lessonLists[0].courseList.length
                      })
                  }else{
                    console.log('第二天数据的条数', lessonLists[0].courseList.length)
                    secnder.push({
                      headImg: item.logo,
                      userName: item.childName,
                      childId: item.childId,
                      gender: item.gender,
                    })
                  }
              }
            }
            if (i == '') {
              if (childList.length > 0) {
                this.setData({
                  childlist: childList,
                  headImg: childList[0].logo,
                  userName: childList[0].childName,
                  childId: childList[0].childId,
                  gender: childList[0].gender,
                })
                wx.setStorage({
                  key: 'childId',
                  data: childList[0].childId,
                })
              } else if (secnder.length > 0) {
                this.setData({
                  childlist: secnder,
                  headImg: secnder[0].logo,
                  userName: secnder[0].childName,
                  childId: secnder[0].childId,
                  gender: secnder[0].gender,
                })
                wx.setStorage({
                  key: 'childId',
                  data: secnder[0].childId,
                })
              }
              console.log('第一次优化完', childList[0], secnder[0])
            } else {
              this.setData({
                headImg: list[i].logo,
                userName: list[i].childName,
                childId: list[i].childId,
                gender: list[i].gender,
                childlist: list,
                // chooldchild
              })
              wx.setStorage({
                key: 'childId',
                data: list[i].childId,
              })
            }
          }
          put(effects.loadCourseTime) // 最近
        })
      },
      // 最近
      [effects.loadCourseTime]() {
        // 参数
        const currentDate = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD');

        // 判断是家长端还是教师端的
        var role = this.data.role; //

        Date.prototype.format = function(fmt) {
          var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S": this.getMilliseconds() //毫秒
          };
          if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
          for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
          return fmt;
        }
        var day2 = new Date();
        day2.setDate(day2.getDate() + 1);
        var s2 = day2.format("yyyy-MM-dd")
        // var tommrow= new Date(s2).toLocaleDateString()
        var tommrow = moment(s2, 'YYYY-MM-DD').format('YYYY-MM-DD')
        var weel_str = "星期" + "日一二三四五六".charAt(new Date().getDay());
        var weel_strs = "星期" + "日一二三四五六".charAt(new Date(s2).getDay());
        if (role == 0) {
          // 家长端  
          var params = {
            queryDate: currentDate,
            childId: this.data.childId
          }
          console.log('参数家长0', params, role);
          this.$api.course.loadCourseTime(params).then((res) => {
            console.log('1', res.data.result)
            // 两天都没有数据
            if (res.data.result == null) {
              let a1 = {
                date: currentDate,
                week: weel_str,
                courseList: []
              }
              let a2 = {
                date: tommrow,
                week: weel_strs,
                courseList: []
              }
              lessonList[0] = a1;
              lessonList[1] = a2;

              console.log(lessonList);
              this.setData({
                lessonLists: lessonList
              })
              return
            }
            var lessonLists = res.data.result.list; // 
            let imgType = res.data.result.imgType; // 校内日程日否含有图片   true
            this.setData({
              imgType: imgType,
            })
            var lessonList = []
            // 调用其他方法
            dispatch(actions.flutterDate)
            if (lessonLists != null) {
              if (lessonLists.length == 1) { // 有数据
                if (currentDate != lessonLists[0].date) { // 第二天有数据
                  console.log('第二天有数据', currentDate, lessonLists[0].date)
                  let a = {
                    date: currentDate,
                    week: weel_str,
                    courseList: []
                  }
                  lessonList[0] = a
                  lessonList[1] = lessonLists[0]
                } else { // 第一天有数据
                  let a = {
                    date: tommrow,
                    week: weel_strs,
                    courseList: []
                  }
                  lessonList[1] = a;
                  let startList = lessonLists[0].courseList.filter(item => {
                    // let nowdate = moment().set({'hours': 15,'minutes':'01'}).format('YYYY-MM-DD HH:mm');
                    let nowdate = moment().format('YYYY-MM-DD HH:mm');
                    let endTime = moment().set({
                      'hours': item.endTime.split(':')[0],
                      'minutes': item.endTime.split(':')[1]
                    }).add(30, 'minutes').format('YYYY-MM-DD HH:mm')
                    if (moment(nowdate, 'YYYY-MM-DD HH:mm').valueOf() > moment(endTime, 'YYYY-MM-DD HH:mm').valueOf()) {
                      console.log('已经过期', endTime)
                    } else {
                      console.log('没过期', item)
                      return item
                    }
                  })
                  // 判断今天的数据是否过期
                  if (startList.length == 0) {
                    let a = {
                      date: currentDate,
                      week: weel_str,
                      courseList: []
                    }
                    lessonList[0] = a;
                  } else {
                    let a = {
                      date: currentDate,
                      week: weel_str,
                      courseList: []
                    }
                    a.courseList = startList;
                    lessonList[0] = a
                  }
                }
              } else if (lessonLists.length == 2) {
                let startList = lessonLists[0].courseList.filter(item => {
                  // let nowdate = moment().set({'hours': 11,'minutes':40}).format('YYYY-MM-DD HH:mm');
                  let nowdate = moment().format('YYYY-MM-DD HH:mm');
                  let endTime = moment().set({
                    'hours': item.endTime.split(':')[0],
                    'minutes': item.endTime.split(':')[1]
                  }).add(30, 'minutes').format('YYYY-MM-DD HH:mm')
                  console.log('现在时间', nowdate, '结束时间', endTime)
                  if (moment(nowdate, 'YYYY-MM-DD HH:mm').valueOf() > moment(endTime, 'YYYY-MM-DD HH:mm').valueOf()) {
                    console.log('已经过期', endTime)
                  } else {
                    console.log('没过期', item)
                    return item
                  }
                })
                // 判断今天的数据是否过期
                if (startList.length == 0) {
                  let a = {
                    date: currentDate,
                    week: weel_str,
                    courseList: []
                  }
                  lessonLists[0] = a;
                } else {
                  let a = {
                    date: currentDate,
                    week: weel_str,
                    courseList: []
                  }
                  a.courseList = startList;
                  lessonLists[0] = a
                }
                lessonList = lessonLists
              }
            } else { // 最近两天都没有数据
              console.log('列表无数据');
              let a1 = {
                date: currentDate,
                week: weel_str,
                courseList: []
              }
              let a2 = {
                date: tommrow,
                week: weel_strs,
                courseList: []
              }
              lessonList[0] = a1;
              lessonList[1] = a2;
            }
            console.log(lessonList);
            this.setData({
              lessonLists: lessonList
            })
          })
        } else if (role == 1) {
          var params = {
            queryDate: currentDate,
            // childId: this.data.childId
          }
          // 教师端
          console.log('参数家长2', params, role)
          this.$api.course.loadCourseTime(params).then((res) => {
            let lessonList = []
            if (res.data.result == null) {
              let a1 = {
                date: currentDate,
                week: weel_str,
                courseList: []
              }
              let a2 = {
                date: tommrow,
                week: weel_strs,
                courseList: []
              }
              lessonList[0] = a1;
              lessonList[1] = a2;

              console.log(lessonList);
              this.setData({
                lessonLists: lessonList
              })
              return
            }

            let lessonLists = res.data.result.list
            console.log('最近日程', lessonLists)
            let imgType = res.data.result.imgType; // 校内日程日否含有图片   true
            this.setData({
              imgType: imgType,
            })
            if (lessonLists != null) { // 今天有数据
              if (lessonLists.length == 1) { // 第一天（今天）
                if (currentDate != lessonLists[0].date) { // 第一天数据
                  console.log('第一天没有数据')
                  let a = {
                    date: currentDate,
                    week: weel_str,
                    courseList: []
                  }
                  lessonList[0] = a
                  lessonList[1] = lessonLists[0]
                } else {         // 第一天有数据
                  let a = {
                    date: tommrow,
                    week: weel_strs,
                    courseList: []
                  }
                  lessonList[1] = a;
                  let startList = lessonLists[0].courseList.filter(item => {
                    // let nowdate = moment().set({'hours': 18,'minutes':'10'}).format('YYYY-MM-DD HH:mm');
                    let nowdate = moment().format('YYYY-MM-DD HH:mm');
                    let endTime = moment().set({
                      'hours': item.endTime.split(':')[0],
                      'minutes': item.endTime.split(':')[1]
                    }).add(30, 'minutes').format('YYYY-MM-DD HH:mm')
                    console.log('现在时间', nowdate, '结束时间', endTime)
                    if (moment(nowdate, 'YYYY-MM-DD HH:mm').valueOf() > moment(endTime, 'YYYY-MM-DD HH:mm').valueOf()) {
                      console.log('已经过期', endTime)
                    } else {
                      console.log('没过期', item)
                      return item
                    }
                  })
                  // 判断今天的数据是否过期
                  if (startList.length == 0) {
                    let a = {
                      date: currentDate,
                      week: weel_str,
                      courseList: []
                    }
                    lessonList[0] = a;
                  } else {
                    let a = {
                      date: currentDate,
                      week: weel_str,
                      courseList: []
                    }
                    a.courseList = startList;
                    lessonList[0] = a
                  }
                  lessonList[0] = lessonLists[0]
                }

              } else if (lessonLists.length == 2) {
                let listdate = []
                let startList = lessonLists[0].courseList.filter(item => {
                  // let nowdate = moment().set({'hours': 17,'minutes':'53'}).format('YYYY-MM-DD HH:mm');
                  let nowdate = moment().format('YYYY-MM-DD HH:mm');
                  let endTime = moment().set({
                    'hours': item.endTime.split(':')[0],
                    'minutes': item.endTime.split(':')[1]
                  }).add(30, 'minutes').format('YYYY-MM-DD HH:mm')
                  console.log('现在时间', nowdate, '结束时间', endTime)
                  if (moment(nowdate, 'YYYY-MM-DD HH:mm').valueOf() > moment(endTime, 'YYYY-MM-DD HH:mm').valueOf()) {
                    console.log('已经过期', endTime)
                  } else {
                    console.log('没过期', item)
                    return item
                  }
                })
                // 判断今天的数据是否过期
                if (startList.length == 0) {
                  let a = {
                    date: currentDate,
                    week: weel_str,
                    courseList: []
                  }
                  lessonLists[0] = a;
                } else {
                  let a = {
                    date: currentDate,
                    week: weel_str,
                    courseList: []
                  }
                  a.courseList = startList;
                  lessonLists[0] = a
                }
                lessonList = lessonLists
              }
            } else {
              console.log('列表无数据');
              let a1 = {
                date: currentDate,
                week: weel_str,
                courseList: []
              }
              let a2 = {
                date: tommrow,
                week: weel_strs,
                courseList: []
              }
              lessonList[0] = a1;
              lessonList[1] = a2;
            }
            console.log(lessonList);
            this.setData({
              lessonLists: lessonList
            })
          })
        }
      },
      // 获取班级列表
      [effects.GET_CLASSLIST]() {
        // let map = inputMap.inputMap
        this.$api.class.getClassList({}).then((res) => {
          console.log('班级', res.data.result)
          if (res.data.errorCode == '0') {
            this.setData({
              // 'classList': res.data.result,
              haveClass: true
            })
          } else if (res.data.errorCode == 100006) {
            // 没有课程
            this.setData({
              haveClass: false
            })
          }
          put(effects.GETMESSAGE)
        });
      },

    }
  }
  mapAction({
    put
  }) {
    return {
      [actions.HANDLE_ACTION](option) {
        // console.log(option)
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
              // console.log(this.data.code, this.data.isShare)
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
              console.log(res.data.result)
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
                } else if (rs.target == "productGroup") {
                  wx.navigateTo({
                    url: `/pages/buyShop/page/hotProduct/hotProduct`,
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
      },
      [actions.flutterDate](e) {
      }
    }
  }
}



EApp.instance.register({
  type: CourseListPage,
  id: 'CourseListPage',
  config: {
    events,
    effects,
    actions
  }
});
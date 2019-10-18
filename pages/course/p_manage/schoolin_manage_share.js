import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../eea/index'
import {
  events,
  effects,
  actions
} from './schoolin_manage_share.eea'

class schoolinmanageshare extends EPage {
  get data() {
    return {
      userInfo: {}, //当前用户信息
      model: {},
      childInfo: {},
      courseInfo: {},
      showConflict: false,
      courseTable: [{
          0: 0,
          1: {
            courseName: "",
            courseNameSub: "",
            courseClass: "",
            courseIndex: ""
          },
          2: {
            courseName: "语文",
            courseNameSub: "语",
            courseClass: "selected",
            courseIndex: 0
          },
          3: {
            courseName: "",
            courseNameSub: "",
            courseClass: "",
            courseIndex: ""
          },
          4: {
            courseName: "英语",
            courseNameSub: "英",
            courseClass: "selected",
            courseIndex: 1,
            courseSwitch: true,
          },
          5: {
            courseName: "",
            courseNameSub: "",
            courseClass: "",
            courseIndex: ""
          }
        },
        {
          0: 1,
          1: {
            courseClass: "selected",
            courseClass1: "even_w c_select",
            courseIndex: 0,
            courseIndex1: 1,
            courseName: "语文",
            courseName1: "英语",
            courseNameSub: "语",
            courseNameSub1: "英",
            courseSwitch: true,
          },
          2: {
            courseClass: "selected",
            courseClass1: "even_w c_select",
            courseIndex: 0,
            courseIndex1: 1,
            courseName: "语文",
            courseName1: "英语",
            courseNameSub: "语",
            courseNameSub1: "英",
            courseSwitch: true,
          },
          3: {
            courseName: "",
            courseNameSub: "",
            courseClass: "",
            courseIndex: ""
          },
          4: {
            courseName: "",
            courseNameSub: "",
            courseClass: "",
            courseIndex: ""
          },
          5: {
            courseName: "",
            courseNameSub: "",
            courseClass: "",
            courseIndex: ""
          }
        },
        {
          0: 2,
          1: {
            courseName: "",
            courseNameSub: "",
            courseClass: "",
            courseIndex: ""
          },
          2: {
            courseName: "语文",
            courseNameSub: "语",
            courseClass: "selected",
            courseIndex: 0
          },
          3: {
            courseName: "",
            courseNameSub: "",
            courseClass: "",
            courseIndex: ""
          },
          4: {
            courseName: "英语",
            courseNameSub: "英",
            courseClass: "selected",
            courseIndex: 1,
            courseSwitch: true,
          },
          5: {
            courseName: "",
            courseNameSub: "",
            courseClass: "",
            courseIndex: ""
          }
        },
        {
          0: 3,
          1: {
            courseName: "",
            courseNameSub: "",
            courseClass: "",
            courseIndex: ""
          },
          2: {
            courseName: "语文",
            courseNameSub: "语",
            courseClass: "selected",
            courseIndex: 0
          },
          3: {
            courseName: "",
            courseNameSub: "",
            courseClass: "",
            courseIndex: ""
          },
          4: {
            courseName: "英语",
            courseNameSub: "英",
            courseClass: "selected",
            courseIndex: 1,
            courseSwitch: true,
          },
          5: {
            courseName: "",
            courseNameSub: "",
            courseClass: "",
            courseIndex: ""
          }
        },
        {
          0: 4,
          1: {
            courseName: "",
            courseNameSub: "",
            courseClass: "",
            courseIndex: ""
          },
          2: {
            courseName: "语文",
            courseNameSub: "语",
            courseClass: "selected",
            courseIndex: 0
          },
          3: {
            courseName: "",
            courseNameSub: "",
            courseClass: "",
            courseIndex: ""
          },
          4: {
            courseName: "英语",
            courseNameSub: "英",
            courseClass: "selected",
            courseIndex: 1,
            courseSwitch: true,
          },
          5: {
            courseName: "",
            courseNameSub: "",
            courseClass: "",
            courseIndex: ""
          }
        },
        {
          0: 5,
          1: {
            courseName: "",
            courseNameSub: "",
            courseClass: "",
            courseIndex: ""
          },
          2: {
            courseName: "语文",
            courseNameSub: "语",
            courseClass: "selected",
            courseIndex: 0
          },
          3: {
            courseName: "",
            courseNameSub: "",
            courseClass: "",
            courseIndex: ""
          },
          4: {
            courseName: "英语",
            courseNameSub: "英",
            courseClass: "selected",
            courseIndex: 1,
            courseSwitch: true,
          },
          5: {
            courseName: "",
            courseNameSub: "",
            courseClass: "",
            courseIndex: ""
          }
        },
        {
          0: 6,
          1: {
            courseName: "",
            courseNameSub: "",
            courseClass: "",
            courseIndex: ""
          },
          2: {
            courseName: "语文",
            courseNameSub: "语",
            courseClass: "selected",
            courseIndex: 0
          },
          3: {
            courseName: "",
            courseNameSub: "",
            courseClass: "",
            courseIndex: ""
          },
          4: {
            courseName: "英语",
            courseNameSub: "英",
            courseClass: "selected",
            courseIndex: 1,
            courseSwitch: true,
          },
          5: {
            courseName: "",
            courseNameSub: "",
            courseClass: "",
            courseIndex: ""
          }
        },
        {
          0: 7,
          1: {
            courseName: "",
            courseNameSub: "",
            courseClass: "",
            courseIndex: ""
          },
          2: {
            courseName: "语文",
            courseNameSub: "语",
            courseClass: "selected",
            courseIndex: 0
          },
          3: {
            courseName: "",
            courseNameSub: "",
            courseClass: "",
            courseIndex: ""
          },
          4: {
            courseName: "英语",
            courseNameSub: "英",
            courseClass: "selected",
            courseIndex: 1,
            courseSwitch: true,
          },
          5: {
            courseName: "",
            courseNameSub: "",
            courseClass: "",
            courseIndex: ""
          }
        },
      ]
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        // this.setData({
        //   courseMsg: option.courseMsg
        // })
        console.log(option)
        this.setData({
          internalClassId: option.code
        })
        //获取用户信息
        put(effects.GET_USER_INFO);
        put(effects.GETCourseDetails, {
          internalClassId: option.code
        })

      },
      [PAGE_LIFE.ON_SHOW]() {
        put(effects.LOAD_CHILDALL)

      },

    }
  }

  mapUIEvent({
    put
  }) {
    return {
      //选择孩子
      [events.ui.CHOOSE_CHILD](e) {
        this.setData({
          'childId': e.currentTarget.dataset.childid
        })
        console.log()
        if (this.data.userInfo.role == 0) {
          put(effects.IMPORT_COURSE)
        } else {
          wx.showModal({
            title: '提示',
            content: '您的课程表应该自己创建',
          })
        }

      },
      //添加课程
      [events.ui.ADD_COURSE](e) {
        if (this.data.userInfo.role == '0') {
          wx.navigateTo({
            url: '../../register/info/p_info?comeFrom=addChild'
          })
        }
      },

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
      // 获取课程表
      [effects.GETCourseDetails](data) {
        api.course.getInternalCourseDetails(data).then(res => {
          console.log(res.data)
          if (res.data.errorCode==0){
            this.setData({
              courseMsg: res.data.result,
              courseTable: res.data.result.courseList
            })
          } else if (res.data.errorCode == "100006"){
            wx.showModal({
              title: '提示',
              content: '该课程已经被删除',
              confirmColor: '#f29219',        
              complete:res => {
                wx.switchTab({
                  url: '../course',
                })
              }
            })
          }
          
        })
      },
      
      //导入课程
      [effects.IMPORT_COURSE]() {
        const model = {
          internalClassId: this.data.internalClassId,
          childId: this.data.childId
        }
        api.course.importInternalCourse(model).then(res => {
          console.log(res.data)
          if (res.data.errorCode == 0) {
            wx.showToast({
              title: '添加成功',
            })
            setTimeout(function(){
              wx.switchTab({
                url: '../course',
              })
            },1000)
          } 
        })
      }
    }
  }
}

EApp.instance.register({
  type: schoolinmanageshare,
  id: 'schoolinmanageshare',
  config: {
    events,
    effects,
    actions
  }
});
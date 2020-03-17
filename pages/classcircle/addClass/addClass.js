import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../eea/index'
import {
  events,
  effects,
  actions
} from './addClass.eea'
class addClassPage extends EPage {
  get data() {
    return {
      isRemind: [{
        id: 1,
        value: '全日制学校',
        checked: true
      }, {
        id: 0,
          value: '非全日制学校',
      }],
      userinfo: {},
      className: '',
      hitpshow: true,
      index: 0,
      courseId: '',
      formType: '',
      outschool:"",
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        console.log('值',option)
        this.setData({
          schoolType: option.schoolType,
          outschool:''
        })
        put(effects.USERINFO)
        if (option.type) {
          this.setData({
            formType: 'course'
          })
        }
      },
      [PAGE_LIFE.ON_SHOW](option) {
        if (wx.getStorageSync('subjectinfo')) {
          this.setData({
            subject: wx.getStorageSync('subjectinfo').name,
            'subjectid': wx.getStorageSync('subjectinfo').id,
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
      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      // 
      [events.ui.isRemindChange](e){
        console.log(e)
        this.setData({
          schoolType: e.detail.value
          // outschool: ''
        })
      },
      [events.ui.chooseSchool]() {
        wx.navigateTo({
          url: '../../mypage/school/school?comefrom=personalInfo'
        })
      },
      [events.ui.setName](e) {
        console.log(e.detail.value)
        this.setData({
          name: e.detail.value
        })
      },
      [events.ui.setSchool](e) {
        console.log(e.detail.value)
        this.setData({
          'outschool': e.detail.value
        })
      },
      [events.ui.setSubject](e) {
        wx.navigateTo({
          url: '../../category/category?comefrom=subject',
        })


      },
      [events.ui.setClassName](e) {
        // console.log(e.detail.value)
        this.setData({
          'className': e.detail.value
        })
      },
      [events.ui.chooseSubject](e) {
        console.log(e)
        this.setData({
          index: e.detail.value,
          courseId: this.data.haveSubject[e.detail.value].id
        })
      },
      [events.ui.SAVE]() {
        let inputMap = {
          classType: this.data.schoolType,
          className: this.data.className,
          outschoolName: this.data.outschool,
          teacherName: this.data.name,
          teacherLogo: this.data.logo,
          teachSubjects: this.data.subjectid,
          courseId: this.data.courseId,
          schoolId: this.data.schoolId
        }
        if (this.data.schoolType == 1) {
          inputMap.classType = 2
          if (this.$common.isBlank(inputMap.outschoolName) || inputMap.outschoolName == 'undefined') {
            wx: wx.showModal({
              title: '提示',
              content: '请输入机构名称',
            })
            return false;
          }
        } else {
          // 校内班级
          inputMap.classType = 1
        }

        if (this.$common.isBlank(inputMap.className) || inputMap.className == 'undefined') {
          wx: wx.showModal({
            title: '提示',
            content: '请输入班级名称',
          })
          return false;
        }
        console.log(inputMap)
        this.$api.class.create(inputMap).then(res => {
          console.log(res)
          if (res.data.errorCode == '0') {
            if (this.data.formType) {
              let classMsg = {
                classId: res.data.result.id,
                className: res.data.result.className
              }
              this.$storage.set('setClassMsg', classMsg);
              wx.navigateBack({})
            } else {
              wx.redirectTo({
                url: '../classMsg/classMsg?classId=' + res.data.result.id + '&role=' + this.data.userinfo.role + '&comefrom=create',
              })
            }
          }else{
            wx.showModal({
              title: '提示',
              content: res.data.errorMessage,
            })
            return;
          }
        })
      }
    }
  }

  mapEffect() {
    return {
      [effects.USERINFO]() {
        this.$api.user.gerUserInfo({}).then(res => {
          console.log(res.data.result)
          this.setData({
            userinfo: res.data.result,
            'name': res.data.result.name,
            'school': '',
            'subject': res.data.result.subjectName,
            'subjectid': res.data.result.teachSubjects,
            'logo': res.data.result.logo
          })
          this.setData({
            school: res.data.result.workOrganizationName
          })
          // if (this.data.schoolType == 0) {
          //   // 学校id
          //   this.setData({
          //     schoolId: res.data.result.workOrganizationName
          //   })
          // } else {        
          // }
          if (this.data.userinfo.role == 1) {
            let inputMap = {
              userId: this.data.userinfo.id
            }
            // 获取老师的课程表 
            // this.$api.course.getCourseListByUserId(inputMap).then(res => {
            //   console.log(res.data)
            //   if (res.data.errorCode == '0') {
            //     this.setData({
            //       'haveSubject': res.data.result,
            //       hitpshow: false
            //     })
            //   } else if (res.data.errorCode == '100006') {
            //     this.setData({
            //       hitpshow: true
            //     })
            //   }
            // })
          }

        })
      },

      //课程信息
      [effects.LOAD_COURSE]() {
        api.course.get(this.data.model).then(
          (res) => {
            if (res.data.result.courseList) {
              console.log(res.data.result.courseList[0].edit)
              this.setData({
                editpower: res.data.result.courseList[0].edit
              })
            }

            if (res.data.errorCode == '100006') {
              this.setData({
                courseList: []
              })
            } else {
              res.data.result.courseList.forEach(function(e) {
                e.beginDate = moment(e.issueTime).format('YYYY-MM-DD')
                e.endDate = moment(e.finishTime).format('YYYY-MM-DD')
                e.beginTime = moment(e.startTime, 'HH:mm').format('HH:mm')
                e.endTime = moment(e.endTime, 'HH:mm').format('HH:mm')
              })
              this.setData({
                courseList: res.data.result.courseList
              })
            }
          },
          (rej) => {}
        )
      },
    }
  }
}

EApp.instance.register({
  type: addClassPage,
  id: 'addClassPage',
  config: {
    events,
    effects,
    actions
  }
});
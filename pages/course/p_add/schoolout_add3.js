import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../eea/index'
import {
  events,
  effects,
  actions
} from './schoolout_add3.eea'

class SchooloutAdd3Page extends EPage {
  get data() {
    return {
      userInfo: {},
      courseInfo: {},
      childInfo: {},
      iptHide: true,
      current:''  // 校内校外
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        this.setData({
          // img : this.$api.extparam.getPageImgUrl('newcourse')
          img:'https://qa.oss.iforbao.com/public/assets/local/share_course.png'
        })
        wx.getStorage({
          key: 'current',
          success: (res)=> {
            console.log(res)
            this.setData({
                current: res.data
          })
          },
        })
        // console.log('值',option)
        // if (option.current){
        //   this.setData({
        //     current: option.current
        //   })
        // }
      },
      [PAGE_LIFE.ON_SHOW](option) {
        this.setData({  
          userInfo: this.$storage.getSync('userInfo')
        });
        this.setData({
          courseInfo: this.$storage.getSync('courseInfo')
        });
        this.setData({
          childInfo: this.$storage.getSync('childInfo')
        });
      },
      [PAGE_LIFE.SHARE](option) {},


      [PAGE_LIFE.ON_SHARE_APP_MESSAGE](e) {
        this.setData({
          iptHide: true
        });
       
        const {
          from
        } = e;
        const { 
          courseInfo,
          userInfo,
          shortCode,
        } = this.data;
        console.log(this.data, shortCode)
        if (from === 'button') {
          let imageUrl = this.data.img
          return {
            title: `[${userInfo.nickName}@您]给您分享了《${courseInfo.name}》课程，点击加入课表`,
            path: `/pages/course/courseList/courseList?action=share&code=${shortCode}`,
            imageUrl: imageUrl,
            success: (res) => {
              console.log('fenxiang')
              this.$common.showToast('分享成功', 'success')
              setTimeout(function(){
                wx.switchTab({
                  url: '../course'
                })
              },1000)
              
            },
            fail:()=>{
              wx.switchTab({
                url: '/pages/course/courseList/courseList?childId=' + this.data.childId,
              })
            }
          }
        }
      }

    }

  }

  mapUIEvent({
    put
  }) {
    return {
      //确认添加
      [events.ui.SAVE_NEXT]() {
        put(effects.SAVE_NEXT);
      },
      // 关闭广告
      [events.ui.delShare](){
        const childId = this.data.childInfo.childId;
        console.log('小孩子id',childId)
        this.setData({
          iptHide: true
        })
        // 缓存获取
        // 少了参数

        // 跳转tabbae页面
        wx.switchTab({
          url: '/pages/course/courseList/courseList?childId='+this.data.childId,
          success: (res)=> {},
          fail: (res)=> {},
          complete: (res)=> {},
        })

        // 关闭所有页面
        // wx.reLaunch({
        //   url: '/pages/course/course?isback=' + false + '&current=' + this.data.current+"&childId="+childId,
        //   success: function(res) {},
        //   fail: function(res) {},
        //   complete: function(res) {},
        // })
      }
    }
  }
  mapEffect() {
    return {
      // 创建校外课程
      [effects.SAVE_NEXT]() {
        const model = this.data.courseInfo;
        console.log(model);
        const childId = model.childId;
        this.$api.course.create(model).then(
          (res) => {    
            console.log(res)
            
            if (res.data.errorCode == '0') {
              console.log(res.data.result)
              this.setData({
                courseId: res.data.result.courseId,
                iptHide:false
              })
              
              const param = {};
              param.dataType = 1;
              
              param.data = {
                'courseId': this.data.courseId
              };
              let _this = this
              // 清除课程
              wx.removeStorageSync('courseInfo')
              this.$api.user.shareInfoRecord(param).then(
                (res) => {
                  console.log(res)
                  if (res.data.errorCode == '0') {     
                    const param1 = {};
                    param1.dataType = 0;
                    param1.data = {
                      'courseId': this.data.courseId,
                      'target': 'course',
                      'shortCode': res.data.result.shortCode
                    };
                    console.log(param1)
                    this.$api.user.shareInfoRecord(param1).then(
                      (res) => {
                        _this.setData({
                          shortCode: res.data.result.shortCode
                        })
                        console.log(_this.data.shortCode)
                      })
                  } else {
                    this.$common.showMessage(this, res.data.errorMessage);
                    return;
                  }
                }
              )
            } else if (res.data.errorCode == '100070') {
              console.log(model)
              let _this = this
              wx.showModal({
                title: '警告',
                content: `该时间段已经安排了课程《${res.data.result[0].NAME}》，请重新选择时间。`,
                confirmText: '查看冲突',
                confirmColor: '#f29219',
                showCancel: true,
                cancelText: '返回',
                success(resp) {
                  if (resp.confirm) {
                    wx.navigateTo({
                      url: '/pages/course/p_lesson/schoolout_lesson_detail?lessonId=' + res.data.result[0].id + '&childId=' + childId
                    })
                  }
                  if (resp.cancel) {
                    console.log(1)
                    console.log(_this.data.courseInfo)
                    let model = _this.data.courseInfo
                    console.log(model)
                    _this.$storage.set('courseInfo', model);
                    wx.navigateBack({})
                  }
                }
              });
            }
          },
          (rej) => {});
      }
    }
  }
}

EApp.instance.register({
  type: SchooloutAdd3Page,
  id: 'SchooloutAdd3Page',
  config: {
    events,
    effects,
    actions
  }
});
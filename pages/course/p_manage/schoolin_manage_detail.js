import { 
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../eea/index'
import {
  events,
  effects,
  actions
} from './schoolin_manage_detail.eea'

class schoolinmanagedetail extends EPage {
  get data() {
    return {
      childId:'',
      userInfo: {}, //当前用户信息
      model: {},
      childInfo: {},
      courseInfo: {},
      showConflict: false,
      courseTable: [],
      shareCavansOptions: {
        id: 'share_canvas',
        width: 0,
        height: 0
      },
      share_imageUrl:"",
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        const {
          shareCavansOptions
        } = this.data;
        shareCavansOptions.width = wx.getSystemInfoSync().screenWidth;
        shareCavansOptions.height = shareCavansOptions.width * 5 / 4;
        this.setData({
          shareCavansOptions
        });
        wx.getStorage({
          key: 'childId',
          success: (res)=> {
            console.log('小孩id',res)
            this.setData({
              childId: res.data
            })
          },
         
        })
        //获取用户信息
        put(effects.GET_USER_INFO);
        console.log(option.internalClassId)
        this.setData({
          internalClassId: option.internalClassId
        })
        put(effects.GETCourseDetails, {
          internalClassId: option.internalClassId
        })
        wx.getImageInfo({
          src: 'https://iforbao-prod.oss-cn-hangzhou.aliyuncs.com/public/assets/img/share_internalcourse.jpg',
          success: (res) => {
            this.setData({
              share_imageUrl: res.path
            })
          }
        })
      },
      [PAGE_LIFE.ON_SHOW]() {


      },
      [PAGE_LIFE.ON_SHARE_APP_MESSAGE](e) {
        const {
          from
        } = e;
        const {
          shortCode,
          userInfo,
         
          courseMsg
        } = this.data;
        wx.showToast({
          title: '图片生成中',
          icon: 'success',
          duration: 1500,
          mask: true,
        })
        console.log('选择图片', this.data.share_imageUrl)
        let share_imageUrl = this.data.share_imageUrl;
        if (from === 'button'&&this.data.userInfo.role == 0) {    
          return {
            title: `[${userInfo.nickName}@您]给您分享了校内课程，点击加入自己的课表`, 
            path: `/pages/course/courseList/courseList?action=share&code=${shortCode}`,
            imageUrl: `${share_imageUrl}`,
            success: (res) => {
              wx.hideLoading()
              // this.$common.showToast('分享成功', 'success')
              wx.navigateBack({
                delta: 1,
              })
            }
          }
        }else{
          wx.showModal({
            title: '提示',
            content: '老师无法分享课程哦~',
          })
        }

      },
      // 上拉刷新
      [PAGE_LIFE.ON_PULL_DOWN_REFRESH]() { //上拉刷新
        // put(effects.getStoreProductHotList) //实时请求加载   //方法需要注册
        let time = null;
        time = setTimeout(() => {
          wx.stopPullDownRefresh();
          time = null;
          //获取用户信息
          put(effects.GET_USER_INFO);
        }, 200)

      }

    }
  }

  mapUIEvent({
    put
  }) {
    return {
      //选择孩子
      [events.ui.CHOOSE_CHILD](e) {
        let childId = e.currentTarget.dataset.childid;
        this.setData({
          'model.childId': childId
        })
        if (this.data.userInfo.role == 0) {
          put(effects.IMPORT_COURSE)
        } else {
          wx.showModal({
            title: '提示',
            content: '您的课程表应该自己创建',
          })
        }

      },
      [events.ui.OPE_EDIT]() {
        let internalClassId = this.data.internalClassId
        wx.navigateTo({
          url: './schoolin_manage_edit?internalClassId=' + internalClassId
        })
      },
      [events.ui.OPE_DEL]() {
        wx: wx.showModal({
          title: '提示',
          content: '确定删除校内课程表？',
          confirmColor: '#f29219',
          success(res) {
            if (res.confirm) {
              console.log('校内')
              put(effects.DEL_INTERNALCOURSE)
            }
          }
        })
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
            } else {
              //this.$common.showMessage(this,res.data.errorMessage);
              return;
            }
          });
      },
      // 获取课程表
      [effects.GETCourseDetails](data) {
        api.course.getInternalCourseDetails(data).then(res => {
          console.log(res.data)
          this.setData({
            courseMsg: res.data.result,
            courseTable: res.data.result.courseList
          })
          console.log(this.data.courseMsg)

          if (this.data.userInfo.role == 0) {
            const param = {};
            param.dataType = 6;
            param.data = {
              'internalClassId': this.data.internalClassId
            };

            this.$api.user.shareInfoRecord(param).then(
              (res) => {
                if (res.data.errorCode == '0') {
                  const param1 = {};
                  param1.dataType = 6;
                  param1.data = {
                    'internalClassId': this.data.internalClassId,
                    'shortCode': res.data.result.shortCode,
                    'childId':this.data.childId,
                  };
                  console.log(param1)
                  this.$api.user.shareInfoRecord(param1).then(
                    (res) => {
                      let shareInfo = {
                        courseName: this.data.courseMsg.courseNameStr,
                        className: this.data.courseMsg.className,
                        schoolName: this.data.courseMsg.schoolName,
                        imageUrl:this.data.share_imageUrl
                      }
                      this.setData({
                        shortCode: res.data.result.shortCode
                      })
                      this.$image.generateShareCourse(this.data.shareCavansOptions, shareInfo, 'internalClass').then(share_imageUrl => {
                        this.setData({
                          shareHide: false,
                          share_imageUrl: share_imageUrl
                        });
                      });
                    })
                } else {
                  this.$common.showMessage(this, res.data.errorMessage);
                  return;
                }
              })
          }
        })
      },

      // 删除
      [effects.DEL_INTERNALCOURSE]() {
        let inputMap = {
          internalClassId: this.data.internalClassId
        }
        this.$api.course.deleteInternalCourse(inputMap).then(res => {
          console.log(res.data)
          if (res.data.errorCode == 0) {
            wx: wx.showToast({
              title: '删除成功',
            })
            setTimeout(function() {
              wx.switchTab({
                url: '../course',
              })
            }, 1000)
          }
        })
      },


    }
  }
}

EApp.instance.register({
  type: schoolinmanagedetail,
  id: 'schoolinmanagedetail',
  config: {
    events,
    effects,
    actions
  }
});
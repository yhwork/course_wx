import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../eea/index'
import {
  events,
  effects,
  actions
} from './schoolout_manage.eea'
const moment = require('../../../lib/moment.min.js');

var sliderWidth = 96;
class SchooloutManagePage extends EPage {
  get data() {
    return {
      shareHide: true,
      // tabs: ["校内课程", "校外课程"],
      userInfo: {}, //当前用户信息
      tabs: [{
        name: "校内课程",
        url: 'https://iforbao-prod.oss-cn-hangzhou.aliyuncs.com/public/assets/img/7.png'
      },
      {
        name: "校外课程",
        url: 'https://iforbao-prod.oss-cn-hangzhou.aliyuncs.com/public/assets/img/8.png'
      }
      ],
      activeIndex: 0, // 切换tab
      sliderOffset: 0,
      sliderLeft: 0,
      sliderLeftSub: 0,
      sliderOffsetSub: 0,
      tabsSub: [{
        id: 0,
        type: '全部',
        num: 0
      }, {
        id: 1,
        type: '已开课',
        num: 0
      }, {
        id: 2,
        type: '未开课',
        num: 0
      }, {
        id: 3,
        type: '已结课',
        num: 0
      },],
      activeIndexSub: 0,
      loadChildAll: false,
      model: {
        childId: '',
        condition:0
      },
      childId: '',
      childInfo: {},
      childList: {},
      shareCavansOptions: {
        id: 'share_canvas',
        width: 0,
        height: 0
      },
      nonedatas:{
        isdata: true,
        name: '暂时没有课程哦',
        btn: '创建课程'
      }
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_UNLOAD](){
        // 当前是否有数据
        let courseList = this.data.courseList.length
        if (courseList==0){
            // 调用上一页面的方法或数据
          var pages = getCurrentPages();
          var currPage = pages[pages.length - 1];
          var prevPage = pages[pages.length - 2];     //获取上一个页面
          prevPage.setData({                           //修改上一个页面的变量
            lessons: []
          })
          console.log('假的', prevPage)
        }else{
          console.log('清除1')
        }
        console.log('清除2', courseList)

      },
      [PAGE_LIFE.ON_LOAD](option) {
        console.log('值', option)
        put(effects.GET_USER_INFO);
        wx.hideShareMenu();
        const {
          shareCavansOptions
        } = this.data;
        shareCavansOptions.width = wx.getSystemInfoSync().screenWidth;
        shareCavansOptions.height = shareCavansOptions.width * 5 / 4;
        this.setData({
          role: wx.getStorageSync('role'),
          shareCavansOptions
        });
        // 读取角色判断
        // wx.getStorageSync("key")
        // 判断校内外
        if (option.hasOwnProperty('activeIndex')) {
          this.setData({
            activeIndex: option.activeIndex
          })
        }

        if (option.hasOwnProperty('childId')) {
          console.log('有小孩id', option.childId)
          const childId = option.childId; //链接过来的childId
          this.setData({
            childId,
            'model.childId': childId,
          });
        } else {
          this.setData({
            childId: wx.getStorageSync('childId'),
            'model.childId': wx.getStorageSync('childId')
          });
        }
        var that = this;
        wx.getSystemInfo({
          success: function (res) {
            that.setData({
              sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
              sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
              sliderLeftSub: (res.windowWidth / that.data.tabsSub.length - sliderWidth) / 2,
              sliderOffsetSub: res.windowWidth / that.data.tabsSub.length * that.data.activeIndexSub
            });
          }
        });
        this.setData({
          img: this.$api.extparam.getPageImgUrl('boyb'),
        })
      },
      [PAGE_LIFE.ON_SHOW](option) {
        // put(effects.GET_CHILD);
        wx.getStorage({
          key: 'childId',
          success: (res)=> {
            if(res.data){
              this.setData({
                childId: res.data
              })
            }
          },
          fail: (res)=> {},
          complete: function(res) {},
        })
        // 读取 当前小孩数据
        wx.getStorage({
          key: 'COURSENUM',
          success: (res)=> {
            if(res.data){
              this.setData({
                activeIndexSub: res.data,
                'model.condition':res.data
              })
            }else{
              this.setData({
                'model.condition': 0,
                  activeIndexSub: 0
              })
            }
          },
          complete:  (res) =>{ 
            // put(effects.GET_CHILD);
            console.log('获取课程',this.data.activeIndexSub)
            put(effects.LOAD_COURSE)
            put(effects.LOAD_COURSE_NUM);
          },
          
        })
      },
      [PAGE_LIFE.ON_PULL_DOWN_REFRESH]() { //上拉刷新
        // put(effects.getStoreProductHotList) //实时请求加载   //方法需要注册
        let time = null;
        time = setTimeout(() => {
          time = null;
          put(effects.GET_USER_INFO);
          put(effects.LOAD_COURSE);
          put(effects.LOAD_COURSE_NUM)
          wx.stopPullDownRefresh();
        }, 100)

      },
      [PAGE_LIFE.ON_SHARE_APP_MESSAGE](e) {
        this.setData({
          shareHide: true
        });
        const {
          from
        } = e;
        const {
          shareInfo,
          userInfo
        } = this.data;
        if (from === 'button') {
          if (this.data.activeIndex == 1) {
            return {
              title: `[${userInfo.nickName}@您]给您分享了${shareInfo.orgName}《${shareInfo.name}》课程，点击加入课表`,
              path: `/pages/course/courseList/courseList?action=share&code=${shareInfo.shortCode}`,
              imageUrl: `${shareInfo.imageUrl}`,
              success: (res) => {
                this.$common.showToast('分享成功', 'success')
              }
            }
          } else {
            return {
              title: `[${userInfo.nickName}@您]给您分享了校内课程，点击加入自己的课表`,
              path: `/pages/course/courseList/courseList?action=share&code=${this.data.shortCode}`,
              imageUrl: `${this.data.imageUrl}`,
              success: (res) => {
                this.$common.showToast('分享成功', 'success')
              }
            }
          }

        }
        return {
          title: `[${userInfo.nickName}@您]分享了小豆包课程表`,
          path: '/pages/course/courseList/courseList',
          imageUrl: '/assets/img/share.jpg'
        }
      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      mytouchstart: function (e) { //记录触屏开始时间
        this.setData({
          start: e.timeStamp
        })
      },
      mytouchend: function (e) { //记录触屏结束时间
        this.setData({
          end: e.timeStamp
        })
      },
      deleteitem: function (e) {
        // 长按事件内容
      },
      onLinkDatail: function (e) {
        if (_that.data.end - _that.data.start < 350) {
          // 单击事件内容
        }
      },
      // 创建课程
      [events.ui.backchange](e){
        let activeIndex = this.data.activeIndex;
        // 创建校外
        if (activeIndex ==1){
          wx.redirectTo({
            url: `/pages/course/p_add/schoolout_add1?childId=${this.data.childId}&activeIndex=${1}`, 
          })
        // 创建校内
        }else{
          wx.redirectTo({
            url: `/pages/course/p_add/schoolout_add1?childId=${this.data.childId}&current=${0}`,
          })
          wx.showToast({
            title: '校内只能添加一次哦',
            icon: 'none',
          })
        }
        console.log('空白返回',e)
      },

      [events.ui.TAB_CLICK](e) {
        this.setData({
          sliderOffset: e.currentTarget.offsetLeft,
          activeIndex: e.currentTarget.id
        });
       
        put(effects.LOAD_COURSE)
      },
      [events.ui.TAB_CLICK_SUB](e) {
        this.setData({
          sliderOffsetSub: e.currentTarget.offsetLeft,
          activeIndexSub: e.currentTarget.id,
          'model.condition': e.currentTarget.id
        });
        wx.setStorage({
          key: "COURSENUM",
          data: e.currentTarget.id
        })
        put(effects.LOAD_COURSE);
        // console.log(this.data.courseList)
      },
      //切换头像
      // [events.ui.CHANGE_LOGO](e) {
      //   put(effects.LOAD_CHILDALL);
      // },
      // //选择孩子
      // [events.ui.CHOOSE_CHILD](e) {
      //   this.setData({
      //     'model.childId': e.currentTarget.dataset.id,
      //     'loadChildAll': false
      //   });
      //   put(effects.GET_CHILD);
      // },
      //查看位置
      [events.ui.OPEN_LOCATION](e) {
        let longitude = Number(e.currentTarget.dataset.longitude);
        let latitude = Number(e.currentTarget.dataset.latitude);
        wx.openLocation({
          latitude: latitude,
          longitude: longitude
        })
      },
      //上传课程表图片
      [events.ui.uploadclassPhoto](e) {
        // console.log('拍照')
        wx.showActionSheet({
          itemList: ['拍照', '从手机相册选择'],
          success: (res) => {
            if (res.cancel) {
              return;
            }
            var sourceType = [];
            if (res.tapIndex === 0) {
              sourceType.push('camera');
            }
            if (res.tapIndex === 1) {
              sourceType.push('album');
            }
            wx.chooseImage({
              sourceType: sourceType,
              count: 1,
              success: (resp) => {
                this.$api.upload.upload(resp.tempFilePaths[0]).then(res => {
                  this.setData({
                    'pageModel.logo': this.$api.extparam.getFileUrl(res.key)
                  });
                  this.setData({
                    'modifyModel.logo': this.$api.extparam.getFileUrl(res.key)
                  });
                });
              }
            })
          }
        });
      },
      // 图片预览
      [events.ui.previmg](e) {
        let img = e.currentTarget.dataset.img;
        let arr = [];
        arr.push(img)
        console.log('图片', img)
        wx.previewImage({
          current: img, // 当前显示图片的http链接
          urls: arr // 需要预览的图片http链接列表
        })
      },
      // 删除图片
      [events.ui.deleteimg](e) {
        let id = e.currentTarget.dataset.courseid;
        let childId = this.data.model.childId
        console.log('删除id', id)
        let params = {
          id,
          childId,
        }
        wx.showModal({
          title: '提示',
          content: '确认删除？',
          success(res) {
            if (res.confirm) {
              // console.log('用户点击确定')
              put(effects.delInternalCourseImg, params)
            } else if (res.cancel) {
              wx.showToast({
                title: '已取消',
                icon: 'success',
                duration: 1500,
                mask: true,
              })
            }
          }
        })
        // 注意

      },
      // 修改图片
      [events.ui.updataimg](e) {
        let id = e.currentTarget.dataset.courseid;
        let childId = this.data.model.childId
        console.log('修改', id);
        wx.showActionSheet({
          itemList: ['拍照', '从手机相册选择'],
          itemColor: "#f29219",
          success: (res) => {
            if (res.cancel) {
              return;
            }
            var sourceType = [];
            if (res.tapIndex === 0) {
              sourceType.push('camera');
            }
            if (res.tapIndex === 1) {
              sourceType.push('album');
            }
            wx.chooseImage({
              sourceType: sourceType,
              count: 1,
              sizeType: ['original'],
              success: (resp) => {
                wx.showLoading({
                  title: '图片上传中...',
                })
                for (let item of resp.tempFilePaths) {
                  this.$api.upload.upload(item).then(res => {
                    console.log(res.key)
                    let imgs = this.$api.extparam.getFileUrl(res.key).split('!')[0] + "!org";
                    // 调用接口
                    let childId = this.data.model.childId;
                    let params = {
                      img: imgs,
                      childId,
                      id: id,
                    }
                    console.log('图片地址', imgs, '参数', params)
                    put(effects.updateInternalCourseImg, params)
                    wx.stopPullDownRefresh();
                    wx: wx.hideLoading();
                  });

                }
              }
            })
          }
        });
      },

      // 课程预览
      [events.ui.PREVIEW]() {
        wx.navigateTo({
          url: './schoolin_curriculum',
        })
      },

      //详情
      [events.ui.OPE_DETAIL](e) {
        const courseId = e.currentTarget.dataset.courseid;
        if (this.data.activeIndex == 1) {
          wx.navigateTo({
            url: './schoolout_manage_detail?childId=' + this.data.model.childId + '&courseId=' + courseId + '&editpower=' + this.data.editpower
          })
        } else {
          wx.navigateTo({
            url: './schoolin_manage_detail?internalClassId=' + courseId
          })
        }
      },
      //复制
      [events.ui.OPE_COPY](e) {
        const courseId = e.currentTarget.dataset.courseid;
        wx.navigateTo({
          url: './schoolout_manage_copy?childId=' + this.data.model.childId + '&courseId=' + courseId
        })
      },
      //修改
      [events.ui.OPE_EDIT](e) {
        const courseId = e.currentTarget.dataset.courseid;
        let cactiveIndex = this.data.activeIndex;
        console.log('修改', courseId, cactiveIndex)
        if (this.data.activeIndex == 1) { // 校外
          wx.navigateTo({
            url: './schoolout_manage_edit?childId=' + this.data.model.childId + '&courseId=' + courseId
          })
        } else { // 校内
          wx.navigateTo({
            url: './schoolin_manage_edit?internalClassId=' + courseId
          })
        }

        //       [events.ui.OPE_EDIT]() {
        // let internalClassId = this.data.internalClassId
        // wx.navigateTo({
        //   url: './schoolin_manage_edit?internalClassId=' + internalClassId
        // })
        //},



      },
      //删除
      [events.ui.OPE_DEL](e) {
        const courseId = e.currentTarget.dataset.courseid;
        console.log('删除', courseId)
        if (this.data.activeIndex == 0) {
          this.setData({
            internalClassId: courseId
          })
          wx: wx.showModal({
            title: '提示',
            content: '确定删除校内课程表？',
            confirmColor: '#f29219',
            success(res) {
              if (res.confirm) {
                put(effects.DEL_INTERNALCOURSE)
              }
            }
          })
        } else {
          this.setData({
            'model.courseId': courseId
          });
          wx.showModal({
            title: '提示',
            content: '确定删除当前课程？',
            showCancel: true,
            confirmColor: '#f29219',
            success: function (res) {
              if (res.confirm) {
                put(effects.DEL_COURSE);
              }
            }
          })
        }

      },
      //添加课程
      [events.ui.ADD_COURSE](e) {
        wx.navigateTo({
          url: '../p_add/schoolout_add1?childId=' + this.data.model.childId
        })


      },
      //考勤
      [events.ui.VIEW_CHECK_WORK](e) {
        const courseId = e.currentTarget.dataset.courseid;
        wx.navigateTo({
          url: './schoolout_manage_checkwork?childId=' + this.data.model.childId + '&courseId=' + courseId
        })
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

            if (this.data.activeIndex == 0) {
              // console.log(e.currentTarget.dataset)
              this.setData({
                shareHide: false,
              })
              let shareInfo = {}
              shareInfo = this.data.courseList[0];
              shareInfo.imageUrl = res.path;
              this.setData({
                shareInfo: shareInfo
              })
              // console.log(this.data)
              if (this.data.role == 0) {
                const param = {};
                param.dataType = 6;
                param.data = {
                  'internalClassId': this.data.shareInfo.internalClassId
                };
                let _this = this
                console.log('分享参数', param)
                this.$api.user.shareInfoRecord(param).then(
                  (res) => {
                    console.log(res)
                    if (res.data.errorCode == '0') {
                      const param1 = {};
                      param1.dataType = 6;
                      param1.data = {
                        'internalClassId': this.data.shareInfo.internalClassId,
                        'shortCode': res.data.result.shortCode
                      };

                      // console.log(param1)
                      this.$api.user.shareInfoRecord(param1).then(
                        (res) => {
                          shareInfo.shortCode = res.data.result.shortCode;
                          this.setData({
                            shortCode: res.data.result.shortCode
                          })
                          this.$image.generateShareCourse(this.data.shareCavansOptions, shareInfo, 'internalClass').then(imageUrl => {
                            // console.log(imageUrl)

                            this.setData({
                              shareHide: false,
                              imageUrl: imageUrl
                            });
                            wx.hideLoading()
                            wx.showToast({
                              title: '生成成功',
                              icon: 'success',
                              duration: 1500,
                              mask: true,
                            })
                          });
                          // console.log(_this.data.shareInfo)
                        })
                    } else {
                      this.$common.showMessage(this, res.data.errorMessage);
                      return;
                    }
                  }
                )
              }
            } else {
              let index = e.currentTarget.dataset.index;
              let shareInfo = {}
              shareInfo = this.data.courseList[index];
              shareInfo.imageUrl = res.path;
              // console.log(this.data.courseList[index])
              const param = {};
              param.dataType = 1;
              param.data = {
                'courseId': shareInfo.id
              };
              this.$api.user.shareInfoRecord(param).then(
                (res) => {
                  if (res.data.errorCode == '0') {
                    const param1 = {};
                    param1.dataType = 0;
                    param1.data = {
                      'courseId': shareInfo.id,
                      'target': 'course',
                      'shortCode': res.data.result.shortCode,

                    };
                    // console.log(param1)
                    this.$api.user.shareInfoRecord(param1).then(
                      (res) => {
                        shareInfo.shortCode = res.data.result.shortCode;
                        this.$image.generateShareCourse(this.data.shareCavansOptions, shareInfo, 'course').then(imageUrl => {
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
                        });
                      }
                    )
                  } else {
                    this.$common.showMessage(this, res.data.errorMessage);
                    return;
                  }
                }
              )
            }

          }
        })


      },
      //隐藏分享遮罩层
      [events.ui.HIDE_SHARE](e) {
        this.setData({
          shareHide: true
        })
      },
      //获取小程序码
      [events.ui.GET_WX_CODE](e) {
        put(effects.GET_WX_CODE);
      },
      [events.ui.nopower]() {
        return wx.showToast({
          title: '共享人没有开启孩子的权限',
          icon: 'none',
          duration: '1500'
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
      // 删除
      [effects.delInternalCourseImg](data) {
        console.log('参数为', data)
        api.course.delInternalCourseImg(data).then(res => {
          if (res.data.errorCode == 0) {
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              image: '',
              duration: 2000,
              mask: true,
            })

            //  console.log('删除', res)
            put(effects.LOAD_COURSE)
          }
        })
      },
      // 修改
      [effects.updateInternalCourseImg](data) {
        console.log('参数为', data)
        api.course.updateInternalCourseImg(data).then(res => {
          if (res.data.errorCode == 0) {
            console.log('修改', res);
            put(effects.LOAD_COURSE)
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
              console.log(res.data.result)
            } else {
              this.$common.showMessage(this, res.data.errorMessage);
              return;
            }
          }
        );
      },

      //一个孩子的信息
      [effects.GET_CHILD]() {
        api.child.get().then(
          (res) => {
            let childId = this.data.model.childId;
            let childIdList = res.data.result.childList
            console.log('全部小孩数据', childIdList, '现在的小孩', childId)
            if (childId && childIdList) {
              let data = childIdList.filter(res => childId == res.childId);
              console.log('值嘛', data)
              this.setData({
                'model.childId': data[0].childId,
                'model.condition': 0,
                'childInfo': data[0],
                // 'childInfo.logo': api.extparam.getLogoUrl(res.data.result.childList[0].logo),
                'childInfo.logo': (data[0].logo),
                'childInfo.courseNum': data[0].courseNum + data[0].internalCourseNum
              });
            } else {
              this.setData({
                'childInfo': res.data.result.childList[0],
                // 'childInfo.logo': api.extparam.getLogoUrl(res.data.result.childList[0].logo),
                'childInfo.logo': (res.data.result.childList[0].logo),
                'childInfo.courseNum': res.data.result.childList[0].courseNum + res.data.result.childList[0].internalCourseNum
              });
              if (common.isBlank(this.data.model.childId)) {
                this.setData({
                  'model.childId': res.data.result.childList[0].childId
                });
              }
              if (common.isBlank(this.data.model.condition)) {
                this.setData({
                  'model.condition': 0
                })
              }
            }
            put(effects.LOAD_COURSE);
            put(effects.LOAD_COURSE_NUM);
          },
          (rej) => { }
        )
      },

      //全部孩子
      [effects.LOAD_CHILDALL]() {
        api.child.get().then(
          (res) => {
            if (res.data.errorCode == 0) {
              this.setData({
                'loadChildAll': true
              });
              res.data.result.childList.forEach(function (e) {
                console.log(e)
                e.logo = (e.logo)
                e.courseNum = e.courseNum + e.internalCourseNum
              })
              this.setData({
                'childList': res.data.result.childList
              });
            }
          },
          (rej) => { }
        )
      },

      //课程信息
      [effects.LOAD_COURSE]() {
        // 校外 操作
        if (this.data.activeIndex == 1) {
          api.course.get(this.data.model).then(
            (res) => {
              console.log('课程信息1', res.data.result, this.data.model)
              if (res.data.result.courseList) {
                // 是否对孩子有权限
                this.setData({
                  editpower: res.data.result.courseList[0].edit
                })
              }
              if (res.data.errorCode == '100006') {
                this.setData({
                  courseList: []
                })
               
              } else {
                res.data.result.courseList.forEach(function (e) {
                  e.beginDate = moment(e.issueTime).format('YYYY-MM-DD')
                  e.endDate = moment(e.finishTime).format('YYYY-MM-DD')
                  e.beginTime = moment(e.startTime, 'HH:mm').format('HH:mm')
                  e.endTime = moment(e.endTime, 'HH:mm').format('HH:mm')
                })
                this.setData({
                  courseList: res.data.result.courseList
                })
                console.log('课程', this.data.courseList)
              }
            },
            (rej) => { }
          )
        } else {
          // 校内 查询
          let {
            role,
            model
          } = this.data
          console.log('家长角色', role, this.data.userInfo.role)
          if (this.data.role == 0) {
            api.course.getAllInternalCourseName(model).then(
              (res) => {
                console.log('课程信息2', res.data.result)
                if (res.data.errorCode == 0) {
                  let {
                    imgType,
                    img
                  } = res.data.result;
                  this.setData({
                    courseList: res.data.result
                  })
                } else if (res.data.errorCode == 100006) {
                  this.setData({
                    courseList: []
                  })


                  // 
                  // wx.reLaunch({
                  //   url: '/pages/course/courseList/courseList?childId=' + this.data.childId,
                  // })
                }

              },
              (rej) => { }
            )
          }else{
            // 获取校内课内容
            api.course.getAllInternalCourseName(model).then((res)=>{
              console.log('教师端', res.data.result)
              if (res.data.errorCode == 0 && res.data.result) {
                let {
                  imgType,
                  img
                } = res.data.result;
                if (res.data.result.length>0){
                  this.setData({
                    courseList: res.data.result
                  })
                }else{
                  this.setData({
                    courseList: []
                  })
                }
                
                
                
               
              } else if (res.data.errorCode == 100006) {
                this.setData({
                  courseList: []
                })


                // wx.reLaunch({
                //   url: '/pages/course/courseList/courseList'
                // })

              }
            })
          }

        }
      },

      //课程数量
      [effects.LOAD_COURSE_NUM]() {
        api.course.getCountNum(this.data.model).then(
          (res) => {
            let nums = res.data.result[0]
            this.setData({
              courseCountNum: nums,
              'tabsSub[0].num': nums.all, //全部
              'tabsSub[1].num': nums.open, // 
              'tabsSub[2].num': nums.notOpen, // 未开课
              'tabsSub[3].num': nums.close, // 已结课
            })
            if (nums.all == 0 && this.data.activeIndex == 1 ){
                // 没有课程显示校外
                // wx.reLaunch({
                //   url: '/pages/course/courseList/courseList?childId='+this.data.childId,
                // })
            }
            console.log('课程数量', res.data, this.data.tabsSub)
          })
      },

      //删除校外课程
      [effects.DEL_COURSE]() {
        api.course.deleteCourse(this.data.model).then(
          (res) => {
            console.log(res)
            // put(effects.GET_CHILD);
            put(effects.LOAD_COURSE)
            put(effects.LOAD_COURSE_NUM);
            // 删除完刷新
            if (res.data.errorCode == '100073' || res.data.errorCode == '100074') {
              common.showMessage(this, '共享人没有开启修改孩子的权限');
            }
          },
          (rej) => { })
      },

      // 删除校内
      [effects.DEL_INTERNALCOURSE]() {
        let inputMap = {
          internalClassId: this.data.internalClassId
        }
        this.$api.course.deleteInternalCourse(inputMap).then(res => {
          // console.log(res.data)
          if (res.data.errorCode == 0) {
            wx: wx.showToast({
              title: '删除成功',
            })
            put(effects.LOAD_COURSE)
          }
        })
      },

      //获取小程序码
      [effects.GET_WX_CODE]() {
        api.user.getWxCode(this.data.shareInfo).then(
          (res) => {
            // console.log(res)
          },
          (rej) => { }
        )
      }
    }
  }
}

EApp.instance.register({
  type: SchooloutManagePage,
  id: 'SchooloutManagePage',
  config: {
    events,
    effects,
    actions
  }
});
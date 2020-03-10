import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../eea/index'
import {
  events,
  effects,
  actions
} from './schoolout_add1.eea'
import moment from '../../../lib/moment.min.js'
var weekOfday = moment().format('E') //计算今天是这周第几天
// var last_monday = moment().subtract(weekOfday - 1, 'days').format('YYYY/MM/DD'); //周一日期
// var last_sunday = moment().add(7 - weekOfday, 'days').format('YYYY/MM/DD'); //周日日期
console.log('今天是周', weekOfday)
// console.log('周一日期', last_monday)
var sliderWidth = 96;
class SchooloutAdd1Page extends EPage {
  get data() {
    return {
      weeks: false, // 每周/单双周
      select_img: '',
      tabshow: true,
      tabIndex: 0, // 默认添加方式   0  拍照  1手动
      switched: false,
      userInfo: {}, //当前用户信息
      mask:true,
      tabs: [{
          name: "校内课程",
          url: 'https://iforbao-prod.oss-cn-hangzhou.aliyuncs.com/public/assets/img/7.png',
          current: 0
        },
        {
          name: "校外课程",
          url: 'https://iforbao-prod.oss-cn-hangzhou.aliyuncs.com/public/assets/img/8.png',
          current: 1
        }
      ],
      activeIndex: 1, // 默认校内、校外显示的 1校外
      sliderOffset: 0,
      sliderLeft: 0,
      model: {
        school: ''
      },
      schoolinfo: {

      },
      childInfo: {
        courseNum: '',
        childName: '',
        logo: '',
        gender: 0
      },
      isShow: true,
      classList: [],
      list: [],
      index: 0,
      setname: true,
      course_index: 0,
      setClassMsg: {},
      Inter_data: [1, 2, 3],
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
      schoolname: '',
      Next: 0,
      location: false,
      // weekday: moment().format('E')>6?0:moment().format('E'),    // 今天是周几
      weekday: 6,
      select_time: {
        date: '',
        time: ''
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
      swiper: {
        indicatorDots: false,
        autoplay: false,
        interval: 5000,
        vertical: false,
        duration: 1000,
        multiple: 3,
        current: 0,
        previous: '0rpx'
      }
    };
  }
  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        console.log('值', option)
        let {
          current,
          childId,
          time,
          date,
          tabshow
        } = option;
        if (childId) {
          this.setData({
            childId: childId,
          })
        }
        this.setData({
          activeIndex: current ? current : 1,
          'model.childId': childId ? childId : this.$storage.getSync('childId'),
          tabshow: tabshow ? tabshow : true
        })
        // 直接从课程表进来的
        if (!time) {
          wx.removeStorageSync('select_time')
        }
        //获取用户信息
        put(effects.GET_USER_INFO, {
          option
        });
        if (current == 0) { // 校内
          wx.setNavigationBarTitle({
            title: '添加校内日程',
          })
          // 查看是否有校内课  有禁止添加
          this.$api.course.getAllInternalCourseName({
            "childId": childId,
            "condition": 1
          }).then(
            (res) => {
              console.log('课程信息2', res.data.result)
              if (res.data.errorCode == 0) {
                // 如果有校内课
                if (res.data.result.length > 0) {
                  wx.showModal({
                    title: '已经存在校内课程',
                    content: '校内课程只能添加一个，是否删除原课程',
                    showCancel: true,
                    cancelText: '删除',
                    cancelColor: '#e90e0e',
                    confirmText: '返回',
                    confirmColor: '#e7c60e',
                    success: function(res) {
                      console.log(res)
                      if (res.cancel) {
                        wx.redirectTo({
                          url: `/pages/course/p_manage/schoolout_manage?activeIndex=${0}&childId=${childId}`,
                          success: function(res) {},
                          fail: function(res) {},
                          complete: function(res) {},
                        })
                      } else if (res.confirm) {
                        wx.navigateBack({

                        })
                      }
                    },
                    fail: function(res) {},
                    complete: function(res) {},
                  })
                }
              }
            },
            (rej) => {}
          )
        } else {
          wx.setNavigationBarTitle({
            title: '添加校外日程',
          })
        }
        let role = wx.getStorageSync('role')
        this.setData({
          'userInfo.role': role
        })
        console.log(this.data.activeIndex, current, role)
        // if (typeof option.childId != 'undefined') {
        //   const childId = option.childId; //链接过来的childId
        //   this.setData({

        //   });
        // }



        // put(effects.GET_CHILD);
        let courseTable = courseTableF();
        this.setData({
          courseTable: courseTable
        })

        var that = this;
        wx.getSystemInfo({
          success: function(res) {
            that.setData({
              sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
              sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
              'height': res.windowHeight,
              'width': res.windowWidth
            });
          }
        });

        // wx.getStorage({
        //   key: 'schoolinfo.name',
        //   success: (res)=> {
        //     console.log(res.data)
        //     this.setData({
        //       schoolname: res.data,
        //     })
        //   },
        // })
        // wx.getStorage({
        //   key: 'schoolinfo.schoolid',
        //   success:(res)=> {
        //     this.setData({
        //       schoolid: res.data,
        //     })
        //   },
        // })


      },
      [PAGE_LIFE.ON_SHOW](option) {
        // this.setData({
        //   model: this.$storage.getSync('courseInfo')
        // })

        wx.getStorage({
          key: 'courseInfo',
          success: (res) => {
            // console.log('课程数据',res.data)
            this.setData({
              model: res.data
            })
          },
          fail: (res) => {
            // console.log('课程数据',res.data)
          },
        })
        wx.getStorage({
          key: 'childId',
          success: (res) => {
            if (!res.data) {
              this.setData({
                'model.childId': this.data.childId
              })
            } else {
              this.setData({
                'model.childId': res.data
              })
            }

          },
          fail: (res) => {
            // console.log('课程数据',res.data)
          },
        })
        //获取用户信息
        let _this = this
        wx.getStorage({
          key: 'setClassMsg',
          success(res) {
            _this.setData({
              'setClassMsg': res.data,
              xnclassId: res.data.classId,
            })
          },
          fail(res) {
            _this.setData({
              index: 0,
            })

          }
        })
        // wx.getStorage({
        //   key: 'schoolinfo.name',
        //   success: function (res) {
        //     // console.log(res.data)
        //     _this.setData({
        //       schoolname: res.data,
        //     })
        //   },
        // })
        // put(events.ui.TAB_CLICK,1)

        // wx.getStorage({
        //   key: 'xnindex',
        //   success: function(res) {
        //     console.log(res.data)
        //     _this.setData({
        //       index: res.data,
        //     })
        //     wx.removeStorageSync('xnindex')
        //     console.log(_this.data.classList[_this.data.index].className)
        //     if (_this.data.classList[_this.data.index].className == '自定义') {
        //       _this.setData({
        //         index: 0,
        //         schoolinclassname: _this.data.classList[0].className,
        //         xnclassId: _this.data.classList[0].classId,
        //       })
        //       wx.removeStorage({
        //         key: 'schoolinclassname'
        //       })
        //     }
        //   },
        // })
        // wx.getStorage({
        //   key: 'schoolinfo.schoolid',
        //   success: function(res) {
        //     _this.setData({
        //       schoolid: res.data,
        //     })
        //   },
        // })

        this.$storage.get('InterNameList').then(
          (res) => {
            if (res.data) {
              if (res.data.length>3) {
                console.log('执行1')
                this.setData({
                  InterNameList: res.data,
                })
              }
            }
          },
          (rej) => {}
        )



        // this.$storage.get('schoolinclassname').then((name) => {
        //   this.setData({
        //     'schoolinclassname': name.data,
        //   })
        //   console.log(this.data.schoolinclassname)
        // } );


        put(effects.GET_USER_INFO, {});

      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      // 隐藏
      [events.ui.quit](e){
        this.setData({
          mask:true,
          switched: false,
          weeks: false,
        })
      },
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
      // 计算切换课程标签
      [events.ui.CHOOSE_ITEMS](e) {
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
      },
      [events.ui.CREATE_COURSE](e) {
        // console.log('00000000000000000000000000000000');
        // wx.chooseImage({
        //   count: 1,
        //   sizeType: ['original', 'compressed'],
        //   sourceType: ['album', 'camera'],
        //   success: (res) => {
        //     // tempFilePath可以作为img标签的src属性显示图片
        //     let tempFilePaths = res.tempFilePaths;
        //     this.setData({
        //       select_img: tempFilePaths[0],
        //     })
        //     console.log('图片地址', this.data.select_img)
        //   }
        // })


        //
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
                    this.setData({
                      tabshow: false,
                      select_img: imgs,
                    })

                    console.log('图片地址', this.data.select_img)
                    wx.stopPullDownRefresh();
                    wx: wx.hideLoading();
                  });

                }
              }
            })
          }
        });
      },
      // 切换添加方式
      [events.ui.chargeTab](e) {
        console.log(e.currentTarget.dataset.tabindex)
        this.setData({
          tabIndex: e.currentTarget.dataset.tabindex,
          tabshow: false
        })
      },
      // 创建校外班级 
      [events.ui.SELECT_CLASS](e) {
        if (this.data.classList.length == 0) {
          wx.navigateTo({
            url: '../../classcircle/addClass/addClass?type=course&schoolType=1',
          })
        }
      },
      // 创建校内班级
      [events.ui.SELECT_XN_CLASS](e) {
        if (this.data.classList.length == 0) {
          wx.navigateTo({
            url: '../../classcircle/addClass/addClass?type=course&schoolType=0',
          })
        }
      },
      // 选择课程节数
      [events.ui.bindChange1](e) {
        let stute = e.currentTarget.dataset.id
        const num = e.detail.value;
        console.log(val, stute)
        let id = this.data.classList[num].classId
        let schoolinclassname = this.data.classList[num].className
        this.setData({
          index: e.detail.value,
          setClassMsg: {},
          'xnclassId': id,
          'schoolinclassname': schoolinclassname,
          'list': num
        })
        this.$storage.set('SchoolClassId', this.data.xnclassId);
        if (this.data.activeIndex == 1) {
          if (num == this.data.classList.length - 1) {
            wx.navigateTo({
              url: '../../classcircle/addClass/addClass?type=course&schoolType=1',
            })
          }
        } else {
          if (num == this.data.classList.length - 1) {
            wx.navigateTo({
              url: '../../classcircle/addClass/addClass?type=course&schoolType=0',
            })
          }
          if (this.data.activeIndex == 0) {
            put(effects.HAVE_COUSER, {
              classId: this.data.xnclassId
            })
            console.log(this.data.xnclassId)
          }
        }
      },
      // 选择班级
      [events.ui.chooseClass](e) {
        let num = e.detail.value;
        console.log('班级列表', this.data.classList, e)
        let thisdata = "classList[" + num + "].className"
        let id = this.data.classList[num].classId
        let schoolinclassname = this.data.classList[num].className
        this.setData({
          index: e.detail.value,
          setClassMsg: {},
          'xnclassId': id,
          'schoolinclassname': schoolinclassname,
          'list': num
        })
        // this.$storage.set('xnindex', this.data.index);
        this.$storage.set('SchoolClassId', this.data.xnclassId);
        // this.$storage.set('schoolinclassname', this.data.schoolinclassname);
        // console.log(this.data.xnclassId)
        if (this.data.activeIndex == 1) {
          if (num == this.data.classList.length - 1) {
            wx.navigateTo({
              url: '../../classcircle/addClass/addClass?type=course&schoolType=1',
            })
          }
        } else {
          if (num == this.data.classList.length - 1) {
            wx.navigateTo({
              url: '../../classcircle/addClass/addClass?type=course&schoolType=0',
            })
          }
          if (this.data.activeIndex == 0) {
            put(effects.HAVE_COUSER, {
              classId: this.data.xnclassId
            })
            console.log(this.data.xnclassId)
          }
        }
      },

      // 课程名字
      [events.ui.CHANGE_NAME](e) {
        console.log(e.detail.value)
        this.setData({
          'model.courseName': e.detail.value,
          'model.name': e.detail.value
        });
      },
      // 机构名字
      [events.ui.CHANGE_ORGNAME](e) {
        console.log(e.detail.value)
        this.setData({
          'model.orgName': e.detail.value
        });
      },
      // 选择位置信息
      [events.ui.SELECT_ADDRESS]() {
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
                        'model.classAddress': address,
                        'model.latitude': res.latitude,
                        'model.longitude': res.longitude
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
                    'model.classAddress': address,
                    'model.latitude': res.latitude,
                    'model.longitude': res.longitude
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
      },
      // 教室
      [events.ui.CHANGE_CLASSROOM](e) {
        this.setData({
          'model.classRoom': e.detail.value
        });
      },
      // 任课老师
      [events.ui.CHANGE_TEACHER](e) {
        this.setData({
          'model.teacher': e.detail.value
        });
      },
      //联系方式  
      [events.ui.CHANGE_TEL](e) {
        this.setData({
          'model.contactTel': e.detail.value
        });
      },
      // 输入学校班级
      [events.ui.getSchoolName](e) {
        let i = e.currentTarget.dataset.id;
        let val = e.detail.value;
        // 学校
        if (i == 1 && val.trim().length !== 0) {
          // schoolname?schoolname:schoolInfo.school 
          if (this.$common.isBlank(val)) {
            wx.showToast({
              icon: 'none',
              title: '请输入标准的学校名称',
              duration: 3000
            })
            return false;
          }
          // 把学校添加进库里面-----可以最后添加的
          this.$api.area.addSchool({
            schoolName: val
          }).then(res => {
            if (res.data.errorCode == 0) {
              // wx.showToast({
              //   title: '添加成功',
              // })
              this.setData({
                schoolname: val,
                'model.school': val,
                schoolid: res.data.result.schoolId
              })
              // this.$storage.set('schoolinfo.name', this.data.inputname);
              // this.$storage.set('schoolinfo.schoolid', res.data.result.schoolId);
              // this.$storage.set('schoolinfo.city', '自定义');
              // this.$storage.set('schoolinfo.typecode', 0);
            }
          })
        // 班级
        } else if (i == 0 && val.trim().length !== 0) {
          this.setData({
            'model.className': val
          })
        } else {
          // console.log('为空')
          if (this.$common.isBlank(val)) {
            return wx.showToast({
              icon: 'none',
              title: '名称不能为空',
              duration: 3000
            });

          }
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
            switched: false,
            mask:true,
          })
        } else {
          this.setData({
            mask:false,
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
      //切换头像
      [events.ui.CHANGE_LOGO](e) {
        put(effects.LOAD_CHILDALL);
      },
      //选择孩子
      [events.ui.CHOOSE_CHILD](e) {
        this.setData({
          'model.childId': e.currentTarget.dataset.id,
          'loadChildAll': false
        });
        put(effects.GET_CHILD);
      },

      [events.ui.cancel]() {
        this.setData({
          location: false
        })
      },

      [events.ui.handler](e) {
        this.setData({
          location: false
        })
        var that = this;
        if (e.detail.authSetting['scope.userLocation']) {
          wx.chooseLocation({
            success: (res) => {
              console.log(res);
              const address = res.address || res.name;
              that.setData({
                'model.classAddress': address,
                'model.latitude': res.latitude,
                'model.longitude': res.longitude
              });
            },
          })
        }
      },
      // 切换tab校内校外
      [events.ui.TAB_CLICK](e) {
        // 问题 1
        console.log(e.currentTarget.dataset.current);
        var a = e.currentTarget.dataset.current
        wx.setStorage({
          key: 'current',
          data: a
        })
        // 结束
        // this.setData({
        //   sliderOffset: e.currentTarget.offsetLeft,
        //   activeIndex: e.currentTarget.id,
        //   current: e.currentTarget.dataset.current
        // });

        // if (this.data.activeIndex == 0 && this.data.list.length > 0) {
        //   let zidingyi = {
        //     classId: '000',
        //     className: "自定义",
        //   }
        //   let list = []
        //   this.data.list.forEach(item => {
        //     if (item.classType == 1) {
        //       list.push(item)
        //     }


        //   })
        this.setData({
          sliderOffset: e.currentTarget.offsetLeft,
          activeIndex: e.currentTarget.id, //  1
          current: e.currentTarget.dataset.current // 1
        });
        if (this.data.activeIndex == 0 && this.data.list.length > 0) {
          let zidingyi = {
            classId: '000',
            className: "自定义",
          }
          let list = []
          this.data.list.forEach(item => {
            if (item.classType == 1) {
              list.push(item)
            }
          })
          if (list.length > 0) {
            this.setData({
              classList: list.concat(zidingyi)
            })
          } else {
            this.setData({
              classList: []
            })
          }
        } else if (this.data.activeIndex == 1 && this.data.list.length > 0) {
          let zidingyi = {
            classId: '000',
            className: "自定义",
          }
          let list = []
          this.data.list.forEach(item => {
            if (item.classType == 2) {
              list.push(item)
            }
          })
          if (list.length > 0) {
            this.setData({
              classList: list.concat(zidingyi)
            })
          } else {
            this.setData({
              classList: []
            })
          }
        }
        if (this.data.activeIndex == 0 && this.data.userInfo.role == 0) {
          put(effects.HAVE_COUSER, {
            childId: this.data.childInfo.childId
          })
        }
      },

      [events.ui.ISSHOW]() {
        this.data.isShow = !this.data.isShow
        this.setData({
          isShow: this.data.isShow
        })
      },
      //跳转学校：
      [events.ui.chooseSchool](e) {
        console.log(this.data.model.childId)
        wx.navigateTo({
          url: '/pages/mydemo/pages/school/school?comefrom=changeschool&childId=' + this.data.model.childId
        })
      },

      // 选择校内课程名称
      [events.ui.CHOOSE_TAG](e) {
        let swiper = this.data.swiper;
        let i = e.currentTarget.dataset.id;
        let j = swiper.current;
        let l = this.data.InterNameList.length;
        let tagName = e.currentTarget.dataset.name // 菜单选中的课
        let InterNameList = this.data.InterNameList;
        let courseTable = this.data.courseTable;

        let color = e.currentTarget.dataset.cor;              
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
        console.log('-------------------')

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
                if (index1 != 0) {
                  if (item1.courseName == tagName) { // 当前课的名字
                    item1.courseClass = `c_select ${color}`;
                  } else if (item1.courseName != '') { // 否
                    // item1.courseClass = `selected ${color}`;            // 灰色
                  }
                  if (typeof item1.courseName1 != 'undefined') { // 单双周  
                    if (item1.courseName1 == tagName) { // 名字不一样
                      // item1.courseClass1 = 'even_w c_select';
                      item1.courseClass1 = `${color} c_select`;
                    } else if (item1.courseName1 != '') { // 
                      // item1.courseClass1 = 'selected';
                    }
                  }
                }
              }
            )
          }
        )
        this.setData({
          InterNameList: InterNameList,
          courseTable: courseTable
        });
        console.log('颜色', color, this.data.courseTable)
        this.$storage.set('InterNameList', this.data.InterNameList);

      },
      // 增加课程
      [events.ui.BIND_COURSE](e) {
        if (this.data.switched) {
          return wx.showToast({
            title: '请先关闭单双周',
            duration: 1500,
            icon: 'none',
          });
        }
        let InterNameList = this.data.InterNameList;
        let courseTable = this.data.courseTable;
        let row = e.currentTarget.dataset.row;
        let col = e.currentTarget.dataset.col;
        // 添加当前颜色
        let color = e.currentTarget.dataset.cor;
        InterNameList.forEach(
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
                  console.log(this.data.courseTable[row][col], this.data.courseTable[row][col].courseName1)
                  console.log(currCourseName, item.color)
                  if (courseTable[row][col].courseName1 == currCourseName) {
                    return wx.showToast({
                      title: '双周课程名不能相同',
                      duration: 1500,
                      icon: "none",
                    })
                  } else {
                    courseTable[row][col].courseName = currCourseName;
                    // courseTable[row][col].courseClass = '';
                    courseTable[row][col].courseClass = `c_select ${item.color}`;
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
                    courseTable[row][col].courseClass1 = `c_select ${item.color}`;
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
        // this.$storage.set('InterNameList', this.data.InterNameList);
      },
      [events.ui.ADD_TAG]() {
        wx.setStorageSync('InterNameList', this.data.InterNameList)
        wx.navigateTo({
          url: './schoolin_tag_add'
        })
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
          confirmColor: '#f29219',
          success: function(res) {
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

                    }
                  )
                }
              )
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
                url: './schoolin_tag_modify?index=' + index
              })
            }
          }
        )
      },

      [events.ui.BIND_SWITCH](e) {
        console.log(this.data.switched)
        this.setData({
          switched: e.detail.value
        })
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

      },



      //班级
      [events.ui.CHANGE_CLASSNAME](e) {
        this.setData({
          'model.className': e.detail.value
        });
      },
      // 校内下一步
      [events.ui.PREVIEW]() {
        let tabIndex = this.data.tabIndex;
        console.log(tabIndex, '校内下一步')
        if (tabIndex == 0) {
          // 拍照上传
          // this.$common.showMessage(this, '图片上传中');
          let childId = this.data.model.childId;
          let obj = {}
          if (this.data.userInfo.role == 0) {
            obj = {
              img: this.data.select_img,
              childId,
            }
          } else {
            obj = {
              img: this.data.select_img,
            }
          }
          put(effects.addInternalCourseImg, obj);
          // this.$common.showMessage(this, res.data.errorMessage);
        } else if (tabIndex == 1) {
          // 手动添加
          if (this.data.userInfo.role == 1) {
            this.$storage.set('fistClass', this.data.classList[0]);
          }
          // 检验输入的内容
          put(effects.SAV_NEXT);
        }
      },
      // 校外下一步
      [events.ui.SAVE_NEXT]() {
        if (this.data.userInfo.role == 1 && this.data.model.orgName == '') {
          this.setData({
            'model.orgName': this.data.userInfo.workOrganizationName
          });
        }
        console.log(this.data.model)
        put(effects.SAVE_NEXT);
      }
    }
  }

  mapEffect({
    put
  }) {
    const api = this.$api;
    const common = this.$common;
    return {
      [effects.addInternalCourseImg](data) {
        let childId = this.data.model.childId;
        api.course.addInternalCourseImg(data).then(res => {
          if (res.data.result != 0) {
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000,
              success: () => {
                // 展示校内课程
                // wx.navigateTo({
                //   url: '/pages/course/course?current=' + 0 + "&childId=" + childId,
                // })
                // 跳转课程管理

                wx.reLaunch({
                  // url: '/pages/course/course?isback=' + false + '&current=' + this.data.current + "&childId=" + childId,
                  url: '/pages/course/courseList/courseList',
                  success: function(res) {},
                  fail: function(res) {},
                  complete: function(res) {},
                })

                // wx.navigateTo({
                //   url: '/pages/course/p_manage/schoolout_manage?activeIndex=0',   // 打开校内
                // })
              }
            })
          }
        })
      },
      //用户信息
      [effects.GET_USER_INFO]({
        option
      }) {
        console.log('获取用户信息')
        this.$api.user.gerUserInfo().then(
          (res) => {
            console.log('获取用户信息2234324', res.data)
            if (res.data.errorCode == 0) {
              this.setData({
                userInfo: res.data.result
              })
              console.log('获取用户信息2234324')
              this.$storage.set('userInfo', res.data.result);
              if (this.data.userInfo.role == 0) {
                put(effects.GET_CHILD);
              }
              console.log('家长端')
              if (option) {
                if (typeof option.classId != 'undefined') {
                  const classId = option.classId;
                  this.setData({
                    'model.classId': classId
                  });
                  put(effects.GET_CLASS_INFO);
                }
              }
              // 教师端获取 班级列表
              if (this.data.userInfo.role == 1) {
                put(effects.getClassList)
              }
            } else {
              this.$common.showMessage(this, res.data.errorMessage);
              return;
            }
          }
        );
      },
      // 自定义班级
      [effects.getClassList]() {
        this.$api.class.getClassList({}).then(res => {
          let zidingyi = {
            classId: '000',
            className: "自定义",
          }
          console.log(res.data.result)
          var list = []
          if (res.data.errorCode == 0) {
            if (res.data.result.length > 0) {
                // 校内
              if (this.data.activeIndex == 0) {
                res.data.result.forEach(item => {
                  // classType  2校内
                  if (item.classType == 1) {
                    list.push(item)
                  }
                })
              } else {
                // 校外
                res.data.result.forEach(item => {
                  // classType  2校外
                  if (item.classType == 2) {
                    list.push(item)
                  }
                })
              }
              console.log(list)
              if (list.length>0){
                this.setData({
                  'model.className': list[0].className,
                })
              }else{
                this.setData({
                  'model.className':'',
                })
              }
              this.setData({
                list: res.data.result,
                classList: list.concat(zidingyi)
              })
            }
          }  
          console.log(this.data.classList)
        })

      },
      // 获取班级详情
      [effects.GET_CLASS_INFO]() {
        this.$api.class.getOne(this.data.model).then(
          (res) => {
            if (res.data.errorCode == 0) {
              let rs = res.data.result.classInfo[0];
              rs.teacherLogoShow = '';
              if (!common.isBlank(rs.teacherLogo)) {
                rs.teacherLogoShow = api.extparam.getLogoUrl(rs.teacherLogo)
              }
              //this.setData({classInfo:res.data.result.classInfo[0]})
              this.setData({
                'model.orgName': res.data.result.classInfo[0].outschoolName,
                'model.teacher': res.data.result.classInfo[0].teacherName
              });
              if (this.data.userInfo.role == 1) {
                if (!common.isBlank(rs.teacherLogoShow)) {
                  this.setData({
                    'userInfo.logo': rs.teacherLogoShow,
                    'userInfo.name': rs.teacherName
                  })
                  this.$storage.set('userInfo', this.data.userInfo);
                }
              }
              //this.$storage.set('classInfo', res.data.result.classInfo[0]);
            } else {
              this.$common.showMessage(this, res.data.errorMessage);
              return;
            }
          });
      },
      // 查询是否已经有校内课程表
      [effects.HAVE_COUSER](data) {
        this.$api.course.getCourseCount(data).then(res => {
          if (res.data.result != 0) {
            console.log(res.data.result)
            if (this.data.userInfo.role == 0) {
              wx.showModal({
                title: '提示',
                content: ` 当前孩子已经添加校内课程,
请到课程管理进行修改`,
                confirmText: '课程管理',
                confirmColor: '#f29219',
                success: res => {
                  if (res.confirm) {
                    wx.redirectTo({
                      url: '../p_manage/schoolout_manage',
                    })
                  } else if (res.cancel) {
                    wx.switchTab({
                      url: '/pages/course/courseList/courseListcourse',
                    })
                  }
                }
              })
            } else {
              wx.showModal({
                title: '提示',
                content: `当前班级已经创建校内课程
请到课程管理进行修改`,
                confirmText: '课程管理',
                confirmColor: '#f29219',
                success: res => {
                  if (res.confirm) {
                    wx.redirectTo({
                      url: '../p_manage/schoolout_manage',
                    })
                  } else if (res.cancel) {
                    wx.switchTab({
                      url: '../course',
                    })
                  }
                }
              })
            }
            this.setData({
              Next: 1
            })
          }
        })
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
                e.logo = (e.logo)
                e.courseNum = e.courseNum + e.internalCourseNum
              })
              this.setData({
                'childList': res.data.result.childList
              });
            }
          },
          (rej) => {}
        )
      },
      [effects.GET_CHILD]() {
        // const model = this.data.model;
        // api.child.get(model).then((res) => {
        //   console.log(res)
        //   this.setData({
        //     'childInfo': res.data.result.childList[0],
        //     'childInfo.logo': (res.data.result.childList[0].logo),
        //     'childInfo.courseNum': res.data.result.childList[0].courseNum + res.data.result.childList[0].internalCourseNum
        //   });
        //   if (common.isBlank(this.data.model.childId)) {
        //     this.setData({
        //       'model.childId': res.data.result.childList[0].childId
        //     });
        //   }
        //   this.$storage.set('childInfo', this.data.childInfo);
        //   // console.log(this.data.childInfo)
        // })
        // this.$storage.set('childInfo', this.data.childInfo);
        // put(effects.getChildSchoolName);
        // put(effects.getAllInternalCourseName);
      },
      [effects.SAVE_NEXT]() {
        const model = this.data.model;
        console.log('校外添加第一步', this.data.model)
        if (common.isBlank(model.name)) {
          return wx.showToast({
            title: '课程不能为空',
            duration: 2000,
            icon: 'none',

          })
        }
        if (common.isBlank(model.orgName)) {
          common.showMessage(this, '教学机构不能为空');
          return wx.showToast({
            title: '教学机构不能为空',
            duration: 2000,
            icon: 'none',
          })
        }
        if (this.data.userInfo.role == 1 && this.data.classList.length == 0 && common.isBlank(model.className)) {
          common.showMessage(this, '班级名称不能为空');
          return wx.showToast({
            title: '班级名称不能为空',
            duration: 2000,
            icon: 'none',
          })
        }
        let _this = this
        this.$storage.set('courseInfo', this.data.model);
        if (this.data.select_time.time !== '') {

        } else {

        }
        wx.navigateTo({
          url: './schoolout_add2',
        });
      },
      // 
      [effects.SAV_NEXT]() {
        console.log(this.data.userInfo, '端')
        if (this.data.userInfo.role == 0) {

          put(effects.HAVE_COUSER, {
            childId: this.data.model.childId
          })

        } else {
          if (this.data.xnclassId != '000' && this.data.xnclassId && typeof this.data.xnclassId != 'undefind') {
            put(effects.HAVE_COUSER, {
              classId: this.data.xnclassId
            })
          } else {
            put(effects.HAVE_COUSER, {
              classId: this.data.classList[0].classId
            })
          }


        }

        if (this.data.schoolname) {
          this.setData({
            'schoolInfo.schoold': this.data.schoolid,
            'schoolInfo.school': this.data.schoolname
          })
        } else {
          this.setData({
            'schoolInfo.schoold': this.data.schoolid,
            'schoolInfo.school': this.data.userInfo.workOrganizationName
          })
        }
        const model = this.data.model;
        let courseTable = this.data.courseTable
        let canNext = false;

        console.log('用户信息', this.data.model);
        console.log('角色状态', this.data.userInfo.role)
        console.log('学校id', this.data.schoolid, '学校名称', this.data.schoolname)
        console.log('班级', this.data.model.className)
        console.log('课程', courseTable)

        if (this.data.userInfo.role == 0 && (this.data.schoolInfo.schoold == 0 || this.data.schoolInfo.school == '默认学校')) {
          return wx.showToast({
            title: '请输入学校',
            icon: 'none',
          });
        }

        if (this.data.userInfo.role == 0 || this.data.classList.length == 0) {
          if (common.isBlank(model.className)) {
            return wx.showToast({
              title: '请输入班级名称',
              icon: 'none',
            });
          }
          if (common.isBlank(this.data.schoolname)) {
            return wx.showToast({
              title: '请输入学校名称',
              icon: 'none',
            });
          }
        }


        let Iscourse = courseTable.some(item => item.courseName !== '')
        if (!Iscourse) {
          return wx.showToast({
            title: '请填写课程内容',
            icon: 'none',
          })
        }

        courseTable.forEach(
          (item, index) => {
            item.forEach((item1, index1) => {
              if (index1 != 0) {
                if (item1.courseName != '') {
                  canNext = true;
                } else {
                  if (typeof item1.courseName1 != 'undefined') {
                    canNext = true;
                  }
                }
              }
            })
          })

        if (canNext) {
          this.$storage.set('courseInfo', this.data.model);

          wx.navigateTo({
            url: './schoolin_add2?school=' + this.data.schoolInfo.school + '&schoold=' + this.data.schoolInfo.schoold
          });
          this.$storage.set('courseTable', this.data.courseTable)
        } else {
          common.showMessage(this, '请添加校内课程');
          return
        }

      },
      // 学校
      [effects.getChildSchoolName]() {
        const model = this.data.model;
        api.course.getChildSchoolName(model).then(
          (res) => {
            console.log(res.data)
            if (res.data.errorCode == 0) {
              this.setData({
                'schoolInfo': res.data.result[0],
              });
              console.log(this.data.schoolInfo)
              if (!this.data.schoolInfo.school) {
                this.data.schoolInfo.school = '请选择学校'
                this.setData({
                  schoolInfo: res.data.result
                });
              }

            }
          }
        )
      },
    }
  }
}



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
EApp.instance.register({
  type: SchooloutAdd1Page,
  id: 'SchooloutAdd1Page',
  config: {
    events,
    effects,
    actions
  }
});
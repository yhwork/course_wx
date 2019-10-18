
import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../../eea/index'
import {
  events,
  effects,
  actions
} from './newCircle.eea'

var util = require('../../../../lib/util.js');
var nameArray = [];
var idArray = [];
var firstLevelMarkData = []; // 一级标签数据传输
var secondLevelMarkData = []; // 二级标签数据传输
var time = util.formatTime(new Date());
class newCirclePage extends EPage {
  get data() {
    return {
      listselected: false,
      selected: false,
      clockerS: false,
      hasDisplaySignTime: true, // 是否显示打卡时间
      hasMark: 1, // 1：没有点击效果
      hasSecondMark: 1, // 1:没有二级标签
      clockerHihe: true, //打卡者显示或隐藏
      labelHide: true, //标签显示或隐藏
      types: [{
          name: '常规类型',
          value: '1'
        },
        {
          name: '闯关类型',
          value: '2'
        },
      ],
      typeList: [{
          name: '公开',
          value: '1',
          checked: 'true',
          explain: '任何人都可以加入圈子，且有机会被小豆包推荐'
        },
        {
          name: '私密',
          value: '2',
          explain: '必须圈主邀请才能加入，成员邀请需圈主审核'
        },
      ],

      dateSelect: false,
      timeSelect: false,
      childSelect: false,
      // 创建学习圈model
      model: {
        // communityType: '', // 圈子类型  0：常规类型   1：闯关类型
        communityName: '', // 圈子名称
        // communitySlogan: '', // 圈子理念
        communityStartDate: time, // 开始日期
        communityEndDate: '请选择', // 结束日期
        // communitySignInStartTime: '请选择',  // 打卡开始时间
        // communitySignInEndTime: '请选择', // 打卡结束时间
        // communitySignInChild: '',// 打卡者
        communityPrivilege: '1', // 圈子类型2  0：公开   1：私密
        communityMark: '', // 圈子标签
        communityHeadImg: '',
        markNamelist: ''

      },

      markDatas: '', // 一级标签数据集
      secondMarkDatas: '', // 二级标签数据集
      childrenDatas: [{
        childId: '',
        childName: '本人'
      }], // 孩子数据集
      communitySignInChildName: '本人', // 打卡者Name
      selectMarkIdArray: [], // 选中标签Id数组
      markNamelist: '请选择(最多三个)', // 选中标签名称数组
      selectMarkNameData: [], // 选中标签名称数据传输数组
      currentClickMarkId: '', // 当前点击的标签ID
      hasHiddenClockView: '',
      userInfo: [],
      today: ''
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        let {
          id
        } = option;
        if (typeof id !== 'undefined') {
          id = parseInt(id);
          put(effects.LOAD_CHILD, {
            id
          });
        }
        this.setData({
          img: this.$api.extparam.getPageImgUrl('boyb'),
        })
        this.$api.child.get().then(s => {
          if (s.data.errorCode = '0') {
            this.setData({
              childrenDatas: this.data.childrenDatas.concat(s.data.result.childList)
            })
          }
        })
        put(effects.getCurrentRole);
      },
      [PAGE_LIFE.ON_SHOW]() {
        //获取缓存
        this.$storage.get('communityMark').then(
          (res) => {
            console.log(res)
            this.setData({
              communityMark: res.data
            })
            console.log(this.data.communityMark)
            this.setData({
              'model.communityMark': this.data.communityMark.join(',')
            })
            console.log(this.data.model)
            // wx.removeStorageSync('communityMark')
          },
          (rej) => {}
        )
        this.$storage.get('markNamelist').then(
          (res) => {
            console.log(res)
            this.setData({
              markNamelist: res.data
            })
            console.log(this.data.communityMark)
            this.setData({
              'model.markNamelist': this.data.markNamelist.join(',')
            })
            console.log(this.data.model)
            // wx.removeStorageSync('markNamelist')
          },
          (rej) => {}
        )
      },
      [PAGE_LIFE.ON_SHARE_APP_MESSAGE](e) {
        this.setData({
          invitHide: true
        })
        const {
          from
        } = e;
        const {
          shareInfo,
          userInfo
        } = this.data;
        if (from === 'button') {
          
          let imageUrl = this.$api.extparam.getPageImgUrl('newcircle')
          return {
            path: `/pages/course/courseList/courseList?action=share&code=${shareInfo.shortCode}`,
            imageUrl: imageUrl,
            success: (res) => {}
          }
        }
      },
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      // 清楚标签
      [events.ui.clearLabelTap](e) {
        //firstLevelMarkData = [];
        secondLevelMarkData = [];
        nameArray = [];
        idArray = [];
        const markDataRecord = this.data.markDatas;
        for (let i = 0; i < markDataRecord.length; i++) {
          markDataRecord[i].firstMark = '';
          markDataRecord[i].secondMark = '';
          markDataRecord[i].dispalySecondMark = true;
        }
        firstLevelMarkData = markDataRecord;

        this.setData({
          markDatas: markDataRecord,
          secondMarkDatas: '',
          selectMarkIdArray: [],
          selectMarkNameArray: '请选择(最多三个)',
          selectMarkNameData: [],
          currentClickMarkId: ''
        })
      },
      // 开始日期
      [events.ui.bindDateChange](e) {
        console.log(e)
        this.setData({
          'model.communityStartDate': e.detail.value,
          dateSelect: true
        })
      },

      // 结束日期
      [events.ui.bindEndDateChange](e) {
        this.setData({
          'model.communityEndDate': e.detail.value
        })
      },

      // 二级标签点击事件
      [events.ui.secondLevelMarkBind](e) {
        secondLevelMarkData[e.currentTarget.dataset.secondmarkindex].hasClick = 'sec_select';
        this.setData({
          secondMarkDatas: secondLevelMarkData,
        })
        if (idArray.length < 3) {
          nameArray.push(this.data.secondMarkDatas[e.currentTarget.dataset.secondmarkindex].markName);
          idArray.push(this.data.secondMarkDatas[e.currentTarget.dataset.secondmarkindex].markId);

          this.setData({
            selectMarkNameData: nameArray,
            selectMarkIdArray: idArray
          })
        }
      },

      // 点击一级标签时间、
      [events.ui.firstLevelMark](e) {
        let firstMarkIds = e.currentTarget.dataset.markindex;

        if (firstLevelMarkData[firstMarkIds].firstMark == '' && this.data.markDatas[firstMarkIds].isParent != 1) {
          firstLevelMarkData[firstMarkIds].firstMark = 'la_select';
          if (idArray.length < 3) {
            nameArray.push(this.data.markDatas[firstMarkIds].markName);
            idArray.push(this.data.markDatas[firstMarkIds].markId);

            this.setData({
              selectMarkNameData: nameArray,
              selectMarkIdArray: idArray
            })
          }

          this.setData({
            markDatas: firstLevelMarkData
          })
        }
        if (this.data.markDatas[firstMarkIds].isParent == 1) {
          // 是父元素 获取二级标签
          this.setData({
            currentClickMarkId: this.data.markDatas[firstMarkIds].markId
          })
          const param = {
            parentMarkId: this.data.currentClickMarkId
          };
          this.$api.circle.getCommunityEnumMarks(param).then(res => {
            if (res.data.errorCode == '0' && res.data.result.data.length > 0) {
              // 有二级标签  secondMark
              firstLevelMarkData[firstMarkIds].secondMark = 'la_active';
              firstLevelMarkData[firstMarkIds].firstMark = '';
              // 二级标签显示出来
              firstLevelMarkData[firstMarkIds].dispalySecondMark = '';
              // 给二级标签赋值   secondMarkDatas
              secondLevelMarkData = res.data.result.data;
              for (let i = 0; i < secondLevelMarkData.length; i++) {
                secondLevelMarkData[i].hasClick = '';
              }

              this.setData({
                secondMarkDatas: secondLevelMarkData,
                markDatas: firstLevelMarkData
              })
            } else {
              if (firstLevelMarkData[firstMarkIds].firstMark == '') {
                firstLevelMarkData[firstMarkIds].firstMark = 'la_select';

                if (idArray.length < 3) {
                  nameArray.push(this.data.markDatas[firstMarkIds].markName);
                  idArray.push(this.data.markDatas[firstMarkIds].markId);
                  this.setData({
                    selectMarkNameData: nameArray,
                    selectMarkIdArray: idArray
                  })
                }

                this.setData({
                  markDatas: firstLevelMarkData
                })
              }
              this.setData({
                secondMarkDatas: ''
              })
            }
          })
        }
      },

      // 打卡时间total
      [events.ui.signTimesBind](e) {
        if (e.detail.value == 2) {
          // 指定时间段
          this.setData({
            hasDisplaySignTime: ''
          })
        } else {
          // 全天任意时间
          this.setData({
            hasDisplaySignTime: true,
          })
        }
      },

      // 打卡开始时间
      [events.ui.startTimeChange](e) {
        this.setData({
          'model.communitySignInStartTime': e.detail.value,
          startTimeSelect: true
        })
      },

      // 打卡结束时间   
      [events.ui.endTimeChange](e) {
        this.setData({
          'model.communitySignInEndTime': e.detail.value
        })
      },

      // 打卡者阻止遮罩层下滚动页面
      [events.ui.stopOther](e) {
        return false;
      },
      //
      [events.ui.showLabel](e) {
        if (this.data.communityMark == undefined) {
          wx.navigateTo({
            url: '../CircleType/CircleType',
          })
        } else {
          wx.navigateTo({
            url: '../CircleType/CircleType?communityMark=' + this.data.communityMark + '&markNamelist=' + this.data.model.markNamelist,
          })
        }

      },

      //关闭标签遮罩层
      [events.ui.closeLabel](e) {
        let selectMarkNameArray = this.data.selectMarkNameArray;
        if (selectMarkNameArray !== '请选择(最多三个)' || selectMarkNameArray !== '') {
          this.setData({
            selected: true
          })
        }
        this.setData({
          labelHide: true,
          selectMarkIdArray: []
        })
      },

      // 保存选中标签并关闭遮罩层 
      [events.ui.saveMarksAndCloseLabel](e) {
        let selectMarkNameArray = this.data.selectMarkNameArray;
        if (selectMarkNameArray !== '请选择(最多三个)' || selectMarkNameArray !== '') {
          this.setData({
            selected: true
          })
        }
        this.setData({
          labelHide: true,
          'model.communityMark': (this.data.selectMarkIdArray).join(','),
          selectMarkNameArray: this.data.selectMarkNameData
        })
      },

      [events.ui.bindClockerChange](e) {},
      // 打卡者
      [events.ui.showClocker](e) {
        console.log(this.data)
        if (this.data.childrenDatas == '' || this.data.childrenDatas.length == 0) {
          wx.showModal({
            title: '提示',
            content: '您还没有孩子哦~',
          })
          return;
        }
        this.setData({
          clockerHihe: false
        })
      },

      // 打卡者
      [events.ui.closeClocker](e) {
        const currentIndex = e.currentTarget.dataset.index;
        let childrenDatas = this.data.childrenDatas;
        if (childrenDatas !== '') {
          this.setData({
            clockerS: true
          })
        }
        this.setData({
          // index: e.detail.value,
          'model.communitySignInChild': this.data.childrenDatas[currentIndex].childId,
          communitySignInChildName: this.data.childrenDatas[currentIndex].childName,
          childSelect: true,
        })
        this.setData({
          //关闭标签遮罩层
          clockerHihe: true
        })
      },
      // 圈子类型02
      [events.ui.typeLChange](e) {
        this.setData({

          'model.communityPrivilege': e.detail.value
        })
      },
      // 头像
      [events.ui.bindPhotoChange](e) {
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
                console.log(sourceType),
                  console.log(resp)
                this.$api.upload.upload(resp.tempFilePaths[0]).then(res => {
                  this.setData({
                    'communityHeadImg': this.$api.extparam.getFileUrl(res.key)
                  });
                  this.setData({
                    'modifyModel.logo': this.$api.extparam.getFileUrl(res.key)
                  });
                  console.log(this.data)
                  this.setData({
                    'model.communityHeadImg': this.data.communityHeadImg
                  })
                  // console.log(this.data.communityHeadImg)
                  // put(effects.saveMyCircle,{
                  //  communityHeadImg
                  // });
                });
              }
            })
          }

        });

      },

      // 圈子类型
      [events.ui.radioChange](e) {
        this.setData({
          'model.communityType': e.detail.value
        })
      },
      // 圈子名称
      [events.ui.circleNameInput](e) {
        this.setData({
          'model.communityName': e.detail.value
        })
      },
      // 圈子理念   
      // [events.ui.circleIdeaInput](e) {
      //   this.setData({
      //     'model.communitySlogan': e.detail.value  // 圈子理念
      //   })
      // },
      // 新建学习圈
      [events.ui.saveMyCircle](e) {
        // if (this.data.model.communityType == '' || this.data.model.communityName == '' || this.data.model.communityStartDate == '请选择'
        if (
          this.data.model.communityStartDate == '请选择' ||
          this.data.model.communityStartDate == '请选择' ||
          this.data.model.communityMark == '' ||
          this.data.model.communityName == ''
          // || this.data.model.communityHeadImg == '' || 
          // this.data.model.communityPrivilege == ''
        ) {
          wx.showModal({
            title: '提示',
            content: '信息还没填写完整哦~~~',
          })
          // return;
        } else {
          put(effects.saveMyCircle);
        }
      },
      [events.ui.switchEntryFee](e) {
        wx.showModal({
          title: '提示',
          content: '不符合条件',
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
    }
  }

  mapEffect() {
    return {
      [effects.saveMyCircle]() {
        const model = this.data.model;
        console.log(model)

        this.$api.circle.addCommunity(model).then(s => {
          console.log(s.data.result)
          if (s.data.errorCode == "0") {
            wx.showToast({
              title: '创建成功',
            })
            setTimeout(function() {
              wx.redirectTo({
                url: '../circleEditor/circleEditor?id=' + s.data.result.communityId + '&isnew=new' +'&Jump=Jump'
              })
            }, 1000)
          }
        })
      },
      [effects.getCurrentRole]() {
        this.$api.user.gerUserInfo().then(s => {
          console.log(s.data)
          this.setData({
            userInfo: s.data.result
          })
          if (s.data.errorCode == '0' && s.data.result.role == '1') {
            // 隐藏
            this.setData({
              hasHiddenClockView: true,

            })
          }
        })
      }
    }
  }
}

EApp.instance.register({
  type: newCirclePage,
  id: 'newCirclePage',
  config: {
    events,
    effects,
    actions
  }
});
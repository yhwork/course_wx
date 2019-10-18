import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../../eea/index'
import {
  events,
  effects,
  actions
} from './CircleType.eea'
var nameArray = [];
var idArray = [];
var firstLevelMarkData = []; // 一级标签数据传输
var secondLevelMarkData = []; // 二级标签数据传输

class CircleType extends EPage {
  get data() {
    return {
      hiddencustom: true,
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
        communityType: '', // 圈子类型  0：常规类型   1：闯关类型
        communityName: '', // 圈子名称
        communitySlogan: '', // 圈子理念
        communityStartDate: '请选择', // 开始日期
        communityEndDate: '请选择', // 结束日期
        communitySignInStartTime: '请选择', // 打卡开始时间
        communitySignInEndTime: '请选择', // 打卡结束时间
        communitySignInChild: '', // 打卡者
        communityPrivilege: '1', // 圈子类型2  0：公开   1：私密
        communityMark: '', // 圈子标签
        markNamelist: ''
      },
      list: {},
      hasClick: '',
      secondList1: '',
      markDatas: '', // 一级标签数据集
      secondMarkDatas: '', // 二级标签数据集
      childrenDatas: [{
        childId: '',
        childName: '本人',
        logo: ''
      }], // 孩子数据集
      communitySignInChildName: '本人', // 打卡者Name
      selectMarkIdArray: [], // 选中标签Id数组
      selectMarkNameArray: '选择圈子标签，最多选择三个',
      // 选中标签名称数组

      selectMarkNameData: [], // 选中标签名称数据传输数组
      currentClickMarkId: '', // 当前点击的标签ID
      hasHiddenClockView: '',
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        if (option.communityMark) {
          let chooselabel = option.communityMark.split(',')
          let choosename = option.markNamelist.split(',')
          this.setData({
            'selectMarkIdArray': chooselabel,
            'selectMarkNameData': choosename
          })
          console.log(this.data.selectMarkIdArray)
        }
        let {
          id
        } = option;
        if (typeof id !== 'undefined') {
          id = parseInt(id);
          put(effects.LOAD_CHILD, {
            id
          });
        }
        var secondList = []
        var secondList2 = []
        new Promise((resolve, reject) => {
          this.$api.circle.getCommunityEnumMarks({}).then(s => {
            if (s.data.errorCode == 0) {
              // console.log(s.data.result.data)
              firstLevelMarkData = s.data.result.data;
              for (let i = 0; i < firstLevelMarkData.length; i++) {
                const sag = {
                  markId: firstLevelMarkData[i].markId,
                  markName: firstLevelMarkData[i].markName,
                  secondMarkDatas: []
                }
                secondList.push(sag)
              }
            }
            this.setData({
              markDatas: secondList
            })
            resolve(this.data.markDatas)
          })
        }).then(res => {
          for (let i = 0; i < res.length; i++) {
            const param = {
              parentMarkId: res[i].markId
            };
            // console.log(param)
            this.$api.circle.getCommunityEnumMarks(param).then(res => {
              let secondMarkDatas = `markDatas.[${i}].secondMarkDatas`;
              secondLevelMarkData = res.data.result.data;
              for (let items of secondLevelMarkData) {
                // console.log(items)
                items.hasClick = '';
                items.isSelect = false
                let chooselabel = this.data.selectMarkIdArray
                if (chooselabel) {
                  for (let i = 0, len = chooselabel.length; i < len; i++) {
                    if (items.markId == chooselabel[i]) {
                      items.isSelect = true
                      items.hasClick = 'sec_select';
                    }
                  }
                }
              }
              this.setData({
                [secondMarkDatas]: secondLevelMarkData,
              })
            })
          }
        })
        this.setData({
          'childrenDatas.logo': this.$api.extparam.getPageImgUrl('boyb'),
        })
      },
      [PAGE_LIFE.ON_SHOW](option) {

      }
    }

  }

  mapUIEvent({
    put
  }) {
    return {
      // // 清楚标签
      // [events.ui.clearLabelTap](e) {
      //   //firstLevelMarkData = [];
      //   secondLevelMarkData = [];
      //   nameArray = [];
      //   idArray = [];
      //   const markDataRecord = this.data.markDatas;

      //   for (let i = 0; i < markDataRecord.length; i++) {
      //     markDataRecord[i].firstMark = '';
      //     markDataRecord[i].secondMark = '';
      //     markDataRecord[i].dispalySecondMark = true;
      //   }
      //   firstLevelMarkData = markDataRecord;

      //   this.setData({
      //     markDatas: markDataRecord,
      //     secondMarkDatas: '',
      //     selectMarkIdArray: [],
      //     selectMarkNameArray: '请选择(最多三个)',
      //     selectMarkNameData: [],
      //     currentClickMarkId: ''
      //   })
      // },
      // 保存选中标签
      [events.ui.saveMarksAndCloseLabel](e) {
        this.$storage.set('communityMark', this.data.selectMarkIdArray); //id
        this.$storage.set('markNamelist', this.data.selectMarkNameData); //name
        // console.log(this.data.selectMarkNameData)
        // console.log(this.data.selectMarkIdArray)
        wx.navigateBack({})

      },
      // 二级标签点击事件
      [events.ui.secondLevelMarkBind](e) {
        let idx = e.currentTarget.dataset.idx;
        let index = e.currentTarget.dataset.markindex;
        let isselect = e.currentTarget.dataset.isselect;
        let value = e.currentTarget.dataset.value;
        let id = e.currentTarget.dataset.id;
        if (!isselect) {
          console.log(nameArray)
          if (this.data.selectMarkNameData.length < 3) {
            this.data.markDatas[idx].secondMarkDatas[index].hasClick = 'sec_select';
            this.data.markDatas[idx].secondMarkDatas[index].isSelect = true;
            this.setData({
              markDatas: this.data.markDatas
            })
            nameArray.push(value);
            idArray.push(id);
            this.setData({
              selectMarkNameData: nameArray,
              selectMarkIdArray: idArray
            })
            console.log(nameArray)
            console.log(idArray)
          }
        } else {
          this.data.markDatas[idx].secondMarkDatas[index].hasClick = '';
          this.data.markDatas[idx].secondMarkDatas[index].isSelect = false;
          this.setData({
            markDatas: this.data.markDatas
          })
          nameArray = nameArray.filter(item => {
            if (item != value) {
              return item
            }
          })
          console.log(nameArray)
          idArray = idArray.filter(item => {
            if (item != id) {
              return item
            }
          })
          this.setData({
            selectMarkNameData: nameArray,
            selectMarkIdArray: idArray
          })
        }

      },
      [events.ui.bindCircleType](e) {
        this.setData({
          'hiddencustom': false
        })
      },
      // [events.ui.CHANGE_CUSTOM](e) {
      //   this.setData({
      //     'selectMarkNameArray': e.detail.value
      //   });
      // },
      // 点击一级标签时间、
      // [events.ui.firstLevelMark](e) {
      //   let firstMarkIds = e.currentTarget.dataset.markindex;
      //   console.log(firstLevelMarkData)
      //   if (firstLevelMarkData[firstMarkIds].firstMark == '' && this.data.markDatas[firstMarkIds].isParent != 1) {
      //     firstLevelMarkData[firstMarkIds].firstMark = 'la_select';
      //     if (idArray.length < 3) {
      //       nameArray.push(this.data.markDatas[firstMarkIds].markName);
      //       idArray.push(this.data.markDatas[firstMarkIds].markId);

      //       this.setData({
      //         selectMarkNameData: nameArray,
      //         selectMarkIdArray: idArray
      //       })
      //     }

      //     this.setData({
      //       markDatas: firstLevelMarkData
      //     })
      //     console.log(markDatas)
      //   }
      //   if (this.data.markDatas[firstMarkIds].isParent == 1) {
      //     // 是父元素 获取二级标签
      //     this.setData({
      //       currentClickMarkId: this.data.markDatas[firstMarkIds].markId
      //     })
      //     const param = {
      //       parentMarkId: this.data.currentClickMarkId
      //     };
      //     console.log(param)
      //     this.$api.circle.getCommunityEnumMarks(param).then(res => {
      //       console.log(res)
      //       if (res.data.errorCode == '0' && res.data.result.data.length > 0) {
      //         // 有二级标签  secondMark
      //         firstLevelMarkData[firstMarkIds].secondMark = 'la_active';
      //         firstLevelMarkData[firstMarkIds].firstMark = '';
      //         // 二级标签显示出来
      //         firstLevelMarkData[firstMarkIds].dispalySecondMark = '';
      //         // 给二级标签赋值   secondMarkDatas
      //         secondLevelMarkData = res.data.result.data;
      //         for (let i = 0; i < secondLevelMarkData.length; i++) {
      //           secondLevelMarkData[i].hasClick = '';
      //         }
      //         this.setData({
      //           secondMarkDatas: secondLevelMarkData,
      //           markDatas: firstLevelMarkData
      //         })
      //         console.log(this.data.secondMarkDatas)


      //       } else {
      //         if (firstLevelMarkData[firstMarkIds].firstMark == '') {
      //           firstLevelMarkData[firstMarkIds].firstMark = 'la_select';

      //           if (idArray.length < 3) {
      //             nameArray.push(this.data.markDatas[firstMarkIds].markName);
      //             idArray.push(this.data.markDatas[firstMarkIds].markId);
      //             this.setData({
      //               selectMarkNameData: nameArray,
      //               selectMarkIdArray: idArray
      //             })
      //           }

      //           this.setData({
      //             markDatas: firstLevelMarkData
      //           })
      //         }
      //         this.setData({
      //           secondMarkDatas: ''
      //         })

      //       }
      //     })
      //   }

      // },




      // 打卡者阻止遮罩层下滚动页面
      [events.ui.stopOther](e) {
        return false;
      },
      // 新建学习圈
      [events.ui.saveMyCircle](e) {
        if (this.data.model.communityType == '' || this.data.model.communityName == '' || this.data.model.communityStartDate == '请选择' ||
          this.data.model.communityEndDate == '请选择'
        ) {
          wx.showModal({
            title: '提示',
            content: '信息还没填写完整哦~~~',
          })
          return;
        } else {
          // 信息完整，允许创建学习圈   hasDisplaySignTime
          if (this.data.model.communitySignInStartTime == "请选择" || this.data.hasDisplaySignTime == true) {
            this.setData({
              'model.communitySignInStartTime': ''
            })
          }

          if (this.data.model.communitySignInEndTime == "请选择" || this.data.hasDisplaySignTime == true) {
            this.setData({
              'model.communitySignInEndTime': ''
            })
          }
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
      // saveMyCircle
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
                url: './myCircle?id=' + s.data.result.communityId
              })
              /*wx.switchTab({
                url: 'circle'
              })*/
            }, 1000)
          }
        })
      },
      [effects.getCurrentRole]() {
        this.$api.user.gerUserInfo().then(s => {
          // console.log(s)
          if (s.data.errorCode == '0' && s.data.result.role == '1') {
            // 隐藏
            this.setData({
              hasHiddenClockView: true
            })
          }
        })
      }
    }
  }
}

EApp.instance.register({
  type: CircleType,
  id: 'CircleType',
  config: {
    events,
    effects,
    actions
  }
});
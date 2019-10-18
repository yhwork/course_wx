import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../../eea/index'
import {
  events,
  effects,
  actions
} from './moreCircle.eea'

let cirecle_list = [];
// const that = this;

class moreCirclePage extends EPage {
  get data() {
    return {
      selectlist:[
        {
          mark: '英语',
          id: 1,
          img:'../../../../assets/img/yingyu.png',
          select:false
        },{
          mark:'阅读',
          id:2,
          img: '../../../../assets/img/yuedu.png',
          select: false
        },{
          mark:'艺术',
          id:3,
          img: '../../../../assets/img/yishu.png',
          select: false
        },{
          mark:'运动',
          id:4,
          img: '../../../../assets/img/yundong.png',
          select: false
        },{
          mark:'教育',
          id:5,
          img: '../../../../assets/img/jiaoyu.png',
          select: false
        },{
          mark:'亲子',
          id:6,
          img: '../../../../assets/img/qinzi.png',
          select: false
        }],
      discoverParam: {
        pageSize: 20,
        currentPage: 1
      }, // 搜索（参数）
      discoverList:{}, // 搜索（返回值）
      tabsParam: {
        flag: 1
      }, // 获取圈子标签参数(flag == 1 不是接口需要的参数，是发请求的时候用来判断请求一级还是二级的)
      hasSecond: false, // 是否存在二级标签
      selectIds: [], // 选中的标签ids
      hide_swiper: '', // 轮播图显示状态，默认显示
      hide_sec: 'true', // 二级标签显示状态，默认隐藏
      firTabList: null, // 一级标签数据
      secTabList: null, // 二级标签数据
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        var e = null;
        put(effects.loadTabList, {
          e
        });
        put(effects.loadCircleList);
      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      // // 清除标签
      // [events.ui.clearLabelTap](e) {
      //   const firstLevelTab = this.data.firTabList;
      //   for (let i = 0; i < firstLevelTab.length; i++) {
      //     firstLevelTab[i].firSelected = 0;
      //   }

      //   this.setData({
      //     discoverParam: {pageSize: 20,currentPage: 1},
      //     secTabList:[],
      //     firTabList:firstLevelTab
      //   })
      // },
      // 选中一级标签
      [events.ui.selectFirTab](e) {
        // console.log(e.currentTarget.dataset.index)
        this.data.selectlist = this.data.selectlist.filter(item => {
          item.select = false;
          return item
        })

        this.setData({
          selectlist: this.data.selectlist
        })
        this.data.selectlist[e.currentTarget.dataset.index].select = true
        // console.log(e.currentTarget.dataset.id)
        this.setData({
          selectlist: this.data.selectlist,
          'discoverParam.communityLabels': [e.currentTarget.dataset.id]
        })
        put(effects.loadCircleList);
        // 根据一级标签id查询二级标签
        // put(effects.loadTabList, {
        //   e
        // });
      },
      // // 选中二级标签
      // [events.ui.selectSecTab](e) {
      //   var id, index, selected, tempIds;

      //   id = e.currentTarget.dataset.id; // 二级标签id
      //   index = e.currentTarget.dataset.index; // 二级标签索引
      //   selected = e.currentTarget.dataset.selected; // 0未选中  1已选中
      //   tempIds = this.data.selectIds; // 把id集合赋值到临时变量方便后面操作
      //   updateIdsArray(tempIds, id, this, 2, index);

      //   this.setData({
      //     'discoverParam.communityLabels': this.data.selectIds
      //   })
      // },
      // // 二级标签弹窗 - 取消
      // [events.ui.cancel_hide_tap](e) {
      //   this.setData({
      //     secTabs: [],
      //     hide_sec: true,
      //   })
      // },
      [events.ui.eStop](e) {
       return false;
      },
      // // 二级标签弹窗 - 确定
      // [events.ui.sure_hide_tap](e) {
      //   this.setData({
      //     secTabs: [],
      //     hide_sec: true,
      //   })
      //   put(effects.loadCircleList);
      // },
      // 搜索
      [events.ui.searchCircle](e) {
        this.setData({
          'discoverParam.key': e.detail.value,
          'discoverParam.communityLabels': [],
          'hide_swiper': true,
        })
        put(effects.loadCircleList);
      },
      // 搜索框获取焦点
      [events.ui.searchFocus](e) {
        this.setData({
          'hide_swiper': ''
        })
      },
      // 失去焦点
      [events.ui.searchBlur](e) {
        this.setData({
          'discoverParam.key': '',
        })
      },
      // 失去焦点
      [events.ui.circleInfo](e) {
        var communityId = e.currentTarget.dataset.id;
        wx.navigateTo({
          url: '../myCircle/myCircle?id=' + communityId
        })
      },
    }
  }

  mapEffect() {
    return {
      [effects.loadTabList]({
        e
      }) {
        var id, index, selected, tempIds;
        if (e != null) {
          id = e.currentTarget.dataset.id; // 二级标签id
          index = e.currentTarget.dataset.index; // 二级标签索引
          selected = e.currentTarget.dataset.selected; // 0未选中  1已选中
          tempIds = this.data.selectIds; // 把id集合赋值到临时变量方便后面操作
          this.setData({
            'tabsParam.parentMarkId': id, // 参数赋值 
            'tabsParam.flag': 2, // 查询2级标签
          })
        }

        this.$api.circle.getCommunityEnumMarks(this.data.tabsParam).then((res) => {
          var errorCode = res.data.errorCode;
          if (errorCode == '0') {
            var list = res.data.result.data; // 标签列表
            if (this.data.tabsParam.flag == 1) {
              // 返回一级标签
              this.setData({
                firTabList: res.data.result.data
              })
              for (var i = 0; i < list.length;i++){
                var tt = 'firTabList[' + i + '].flag'
                this.setData({
                  [tt] : 0 // 一级标签默认不选中标识
                })
              }
            } else {
              // 选中一级，返回二级标签
              this.setData({
                secTabList: res.data.result.data,
                hide_sec: '', // 更新二级标签弹窗显示状态
                hasSecond: true
              })
              // 处理有二级标签的一级标签选中问题
              var e_flag = e.currentTarget.dataset.flag;
              //if(e_flag == 0){
                e_flag = 1 // 选中一级
                var tt = 'firTabList[' + index + '].flag'
                var tt1 = 'firTabList[' + index + '].firSelected'
                this.setData({
                  [tt]: 1, // 一级标签默认不选中标识
                  [tt1]: 1
                })
              //}else{
                // e_flag = 0 // 取消选中一级
                // var tt = 'firTabList[' + index + '].flag'
                // var tt1 = 'firTabList[' + index + '].firSelected'
                // this.setData({
                //   [tt]: 0, // 一级标签默认不选中标识
                //   [tt1]: 0,
                //   secTabList: [], // 二级标签列表置空
                //   hide_sec: true, // 更新二级标签弹窗显示状态
                //   hasSecond: false
                // })
              //}
            }
          } else if (errorCode == '100006') {
            // 无数据
            if (this.data.tabsParam.flag == 2) {
              this.setData({
                secTabList: [], // 二级标签列表置空
                hide_sec: true, // 更新二级标签弹窗显示状态
                hasSecond: false
              })

              updateIdsArray(tempIds, id, this, 1, index);
              if (this.data.selectIds.length > 0) {
                // 没有二级标签的话，根据一级标签获取圈子
                this.setData({
                  'discoverParam.communityLabels': this.data.selectIds,
                  hide_sec:''
                })
              }

              // this.$api.circle.discover(this.data.discoverParam).then((res) => {
              //   var errorCode = res.data.errorCode;
              //   if (errorCode == '0') {
              //     this.setData({
              //       discoverList: res.data.result.learnList
              //     })
              //     // 获取图片全路径
              //     for (var i = 0; i < this.data.discoverList.length; i++) {
              //       var test = 'discoverList[' + i + '].img';
              //       this.setData({
              //         [test]: this.$api.extparam.getFileUrl(this.data.discoverList[i].headPic)
              //       })
              //     }
              //   } else if (errorCode == '100006') {
              //     // 无数据
              //     this.setData({
              //       discoverList: {}
              //     })
              //   } else {
              //     // 网络请求超时，请稍后再试
              //   }
              // });
            }
          } else {
            // 网络请求超时，请稍后再试
          }
        });
      },
      [effects.loadCircleList]() {
        this.$api.circle.discover(this.data.discoverParam).then((res) => {
          var errorCode = res.data.errorCode;
          console.log(res.data)
          if (errorCode == '0') {
            this.setData({
              discoverList : res.data.result.learnList
            })
            // 获取图片全路径
            for (var i = 0; i < this.data.discoverList.length; i++) {
              var test = 'discoverList[' + i + '].img';
              this.setData({
                [test]: this.$api.extparam.getFileUrl(this.data.discoverList[i].headPic)
              })
            }
          } else if (errorCode == '100006') {
            // 无数据
            this.setData({
              discoverList: {}
            })
          } else {
            // 网络请求超时，请稍后再试
          }
        });
      },
    }
  }
}

EApp.instance.register({
  type: moreCirclePage,
  id: 'moreCirclePage',
  config: {
    events,
    effects,
    actions
  }
});

// 更新选中ids数组
function updateIdsArray(array, id, that, flag, index) {
  if (array.indexOf(id) == -1) {
    // 当前选中id不在已选ids数组中才记录

    if (flag == 1) {
      var test = 'firTabList[' + index + '].firSelected';
      that.setData({
        [test]: 1
      })
    }
    if (flag == 2) {
      var test = 'secTabList[' + index + '].secSelected';
      that.setData({
        [test]: 1
      })
    }
    array = array.concat(id);
    that.setData({
      selectIds: array
    })
  } else {
    // 已经存在的id再次选中的时候，要进行删除
    if (flag == 1) {
      var test = 'firTabList[' + index + '].firSelected';
      that.setData({
        [test]: 0
      })
    }
    if (flag == 2) {
      var test = 'secTabList[' + index + '].secSelected';
      that.setData({
        [test]: 0
      })
    }

    for (var i = 0; i < array.length; i++) {
      if (array[i] == id) {
        array.splice(i, 1);
        if (array.length == 0) {
          // 更新选中的ids
          that.setData({
            'discoverParam.communityLabels': null
          })
        } else {
          // 更新选中的ids
          that.setData({
            'discoverParam.communityLabels': array
          })
        }
      }
    }
  }
}
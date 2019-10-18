import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../../eea/index'
import {
  events,
  effects,
  actions
} from './memAdmin.eea'

class memAdminPage extends EPage {
  get data() {
    return {
      tabs: ["参与中", "待审核", "已拒绝"],
      currentTab: 0,
      sex: 1,
      model: {
        communityId:'',   // 学习圈ID
        pageSize:3,       // 每页数量
        currentPage:1,    // 第几页
        queryUserType: 2  // 用户状态类型 默认2，    1 审核 2参与中 3 拒绝 4 淘汰"
      },
      memberList:[],
      userEliminateModel:{ // 淘汰用户
        communityId:'',    // 圈子ID
        id:'',        // 孩子ID
        status:'',         // 用户状态    1：审核   2：参与中   3：拒绝   4：淘汰（从参与中删除）   5：成员自己脱离
        targetUserId:''    // 用户ID
      }
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        console.log(option)
        const that = this;
        let id = option.id;
        this.setData({
          circleId: id
        })
        if (typeof id !== 'undefined') {
          id = parseInt(id);
          this.setData({
            'model.communityId': id,
            'userEliminateModel.communityId':id
          })
          console.log(this.data)
          put(effects.LOAD_CIRCLE_MEM_LIST);
        }
        wx.getSystemInfo({
          success: function(res) {
            that.setData({
              winH: res.windowHeight
            })
          },
        });
      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      // 打卡日历
      [events.ui.bindClockCalendar](e) {
        wx.navigateTo({
          url: '../clockCalendar/clockCalendar?id=' + this.data.model.communityId + "&clockId=" + e.currentTarget.dataset.memberid + "&subid=" + this.data.model
        })
      },
      //切换tab
      [events.ui.changeTab](e) {
        var idx = e.currentTarget.dataset.idx;
        this.setData({
          currentTab: idx
        }) 
        // queryUserType: 2  // 用户状态类型 默认2，    1 审核 2参与中 3 拒绝 4 淘汰"
        if(idx == 0) {
          // 参与中
          this.setData({
            'model.queryUserType':2
          })
        } else if(idx == 1) {
          // 待审核
          this.setData({
            'model.queryUserType': 1
          })
        } else {
          // 已拒绝
          this.setData({
            'model.queryUserType': 3
          })
        }
        this.setData({
          'model.currentPage':1,
          memberList:[]
        })
        put(effects.LOAD_CIRCLE_MEM_LIST);
      },
      // 到底部加载
      [events.ui.PAGEPLUS](e) {
        let currentPage = this.data.model.currentPage + 1;
        this.setData({
          'model.currentPage': currentPage
        })
        put(effects.LOAD_CIRCLE_MEM_LIST);
      },
      // 淘汰    userEliminateModel    childId
      [events.ui.REMOVEMEMBER](e) {
        let memberId = e.target.dataset.memberid;
        let circleid = e.target.dataset.circleid;
        this.setData({
          'userEliminateModel.targetUserId': circleid,
          'userEliminateModel.id': memberId,
          'userEliminateModel.status':4
        })
        put(effects.eliminateUser);
      },
      // 拒绝
      [events.ui.bindRefuseUser](e) {
        let memberId = e.target.dataset.memberid;
        let circleid = e.target.dataset.circleid;
        this.setData({
          'userEliminateModel.targetUserId': circleid,
          'userEliminateModel.id': memberId,
          'userEliminateModel.status': 3
        }) 
        put(effects.eliminateUser);
      },
      // 同意
      [events.ui.bindAgreeUser](e) {
       let memberId = e.target.dataset.memberid;
       let circleid = e.target.dataset.circleid;
       this.setData({
         'userEliminateModel.targetUserId': circleid,
          'userEliminateModel.id': memberId,
          'userEliminateModel.status': 2
        })
        put(effects.eliminateUser); 
      }
    }
  }

  mapEffect({
    put
  }) {
    return {
      [effects.LOAD_CIRCLE_MEM_LIST]() {
        this.$api.circle.getCommunityMembers(this.data.model).then(model => {
          let errorCode = model.data.errorCode;
          if (errorCode == '0') {
            if (this.data.model.currentPage == 1) {
              this.setData({
                memberList: model.data.result.communityMember
              });
            } else {
              this.setData({
                memberList: this.data.memberList.concat(model.data.result.communityMember)
              })
            }
          }
        });
      },
      [effects.eliminateUser]() {
        this.$api.circle.updateCommunityMemberStatus(this.data.userEliminateModel).then(s => {
          if (s.data.errorCode == '0') {
            // 重新加载当前状态下的列表
            this.setData({
              'model.currentPage':1,
              memberList: []
            })
            put(effects.LOAD_CIRCLE_MEM_LIST);
          }
        })
      },
    }
  }
}

EApp.instance.register({
  type: memAdminPage,
  id: 'memAdminPage',
  config: {
    events,
    effects,
    actions
  }
});
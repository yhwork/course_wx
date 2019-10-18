import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../../eea/index'
import {
  events,
  effects,
  actions
} from './clockCalendar.eea'
import moment from '../../../../lib/moment.min.js'

const that = this;

class clockCalendarPage extends EPage {
  get data() {
    return {
      model: {
        querySignInUserId: '', // 查询打卡人
        queryMonth: '', // 查询月数
        queryYear: '', // 查询年份
        querySubjectId: '', // 查询主题ID
        queryCommunityId: '', // 查询圈子ID
      },
      totalModel: {
        querySignInUserId: '', // 查询打卡人
        queryMonth: '', // 查询月数
        queryYear: '', // 查询年份
        querySubjectId: '', // 查询主题ID
        queryCommunityId: '', // 查询圈子ID
      },
      formatDate: null,
      communityInfo: null, // 统计信息,
      subid: '', // 主题id
      communityId: null, // 圈子id
      staticNumInfo: {
        yearSignInTimes: 0, // 总打卡天数
        signInDaysTimes: 0, // 当月打卡天数
        monthKeepTimes: 0, // 当月持续打卡天数
        reSignInDays: 0 ,// 已经补打卡天数
        succeSigninNum:0,
        reSigninNum: 0,
        signinNum:0
      },
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        var date = new Date();
        this.setData({
          'model.queryCommunityId': option.id,
          'model.queryYear': date.getFullYear(),
          'model.queryMonth': date.getMonth() + 1,

          'totalModel.queryCommunityId': option.id,
          'totalModel.queryYear': date.getFullYear(),
          'totalModel.queryMonth': date.getMonth() + 1,
          'subid': option.subid,
          'communityId': option.id
         
        })
        
        console.log(this.data.subid)
        if (typeof option.clockId != 'undefined') {
          this.setData({
            'model.querySignInUserId': option.clockId
          })
        }

        put(effects.getSignInStatisticsByCondition);
        
      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      //接收月份改变
      [events.ui.CALENDAR_MONTH_CHANGED](e) {
        this.setData({
          'model.queryMonth': e.detail.currentMonth,
          'totalModel.queryMonth': e.detail.currentMonth,
        })
        put(effects.getSignInStatisticsByCondition);
      },
      [events.ui.daka](e) {
        wx.navigateTo({
          url: '../addDiary/addDiary?communityId=' + this.data.communityId + '&id=' + this.data.subid,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      }
    }
  }

  mapEffect({put}) {
    return {
      // 获取打卡日期
      [effects.getSignRecordInfo]() {
        this.$api.circle.getSignRecordInfo(this.data.model).then(res => {
          if (res.data.errorCode == '0') {
            const rs = res.data.result
            rs.signRecordList.forEach(
              (item) => {
                item.year = moment(item.signInTime).format('YYYY')
                item.month = moment(item.signInTime).format('M')
                item.day = moment(item.signInTime).format('D')
              }
            )
            rs.communityStartDate=this.data.communityInfo.communityStartDate
            rs.communityEndDate=this.data.communityInfo.communityEndDate
            this.setData({
              diaryInfo: rs
            });
          }
        })
      },
      // 获取打卡统计数据
      [effects.getSignInStatisticsByCondition]() {
        this.$api.circle.getSignInStatisticsByCondition(this.data.totalModel).then(s => {
          {
            if (s.data.errorCode == '0') {
              this.setData({
                communityInfo: s.data.result.communityInfo,
              })
              console.log(s.data.result)
              if (s.data.result.statisticData.length > 0) {
                var test = s.data.result.statisticData;
                if (test != null && test.length > 0) {
                  var totalSignDay = test[0].totalSignInDayTimes; // 总打卡次数
                  var succeSigninNum = test[0].succeSigninNum;//正常打卡
                  var reSigninNum = test[0].reSigninNum;//补打卡
                  var signinNum = test[0].signinNum;//补打卡
                  var monthData = test[0].yearData[0].monthData[0].data; // 当前月份统计
                  var monthSignInTimes = monthData.signInDaysTimes //当月打卡天数
                  var monthKeepTimes = test[0].yearData[0].monthData[0].monthKeepTimes
                  var reSignInDays = monthData.reSignInDays

                  this.setData({ 
                    'staticNumInfo.yearSignInTimes': totalSignDay,
                    'staticNumInfo.signInDaysTimes': monthSignInTimes,
                    'staticNumInfo.monthKeepTimes': monthKeepTimes,
                    'staticNumInfo.reSignInDays': reSignInDays,
                    'staticNumInfo.reSigninNum': reSigninNum,
                    'staticNumInfo.succeSigninNum': succeSigninNum,
                    'staticNumInfo.signinNum': signinNum,
                  })
                }
              } else {
                this.setData({
                  'staticNumInfo.yearSignInTimes': 0,
                  'staticNumInfo.signInDaysTimes': 0,
                  'staticNumInfo.monthKeepTimes': 0,
                  'staticNumInfo.reSignInDays': 0,
                 
                })
              }
              put(effects.getSignRecordInfo);
            }
          }
        })
        console.log(this.data)
      },
    }
  }
}

EApp.instance.register({
  type: clockCalendarPage,
  id: 'clockCalendarPage',
  config: {
    events,
    effects,
    actions
  }
});
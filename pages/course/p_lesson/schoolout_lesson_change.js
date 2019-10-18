import { EApp, EPage, PAGE_LIFE } from '../../../eea/index'
import { events, effects, actions } from './schoolout_lesson_change.eea'
const moment = require('../../../lib/moment.min.js');

class SchooloutLessonChangePage extends EPage {
    
    get data() {
        return { 
            userInfo:{},//当前用户信息
            model:{
              childId:''
            },
            childInfo:{},
            lessonInfo:{},
            showCalendar:false,
            state_datatime:true,
        };
    }
  
    mapPageEvent({ put }) { 
        return {
            [PAGE_LIFE.ON_LOAD](option) {
                //获取用户信息
                put(effects.GET_USER_INFO);
                if(typeof option.childId != 'undefined' && typeof option.lessonId != 'undefined'){
                    const childId = option.childId;
                  	const lessonId = option.lessonId;
                  	const type = option.type;
                    const source = option.source;
                  	this.setData({
                  		'model.childId':childId,
                  		'model.lessonId':lessonId,
                  		'model.type':type,
                      'model.source':source
                  	});
                    if(type==2){
                        wx.setNavigationBarTitle({
                          title: '调课信息'
                        });
                    }else if(type==3){
                        wx.setNavigationBarTitle({
                          title: '补课信息'
                        });
                    }
                }
            },
            [PAGE_LIFE.ON_SHOW](option) {
                put(effects.GET_CHILD);
            }
        }
    }

    mapUIEvent({ put }) {
        return {
        	//上课日期
            [events.ui.CHANGE_BEGINDATE](e) {
              console.log(e)
              var times = e.currentTarget.dataset.times;
              if(times==0){
                // 开始日期
                this.setData({ state_datatime: true });
              }else{
                // 结束日期
                this.setData({ state_datatime: false });
              }
              this.setData({showCalendar: true});
            },
            //上课日期回调
            [events.ui.CALENDAR_DAY_CHANGED](e) {
              console.log(this.data.state_datatime)
              if (this.data.state_datatime==true){
                const currentDate = moment(e.detail.year + ' ' + e.detail.month + ' ' + e.detail.day, 'YYYY-MM-DD').format('YYYY-MM-DD');
                console.log('日期', currentDate)
                this.setData({
                  'lessonInfo.beginDate': currentDate,    //开始时间
                  'lessonInfo.endDate': currentDate,      // 结束时间
                  showCalendar: false
                });
              }else{
                const currentDate = moment(e.detail.year + ' ' + e.detail.month + ' ' + e.detail.day, 'YYYY-MM-DD').format('YYYY-MM-DD');
                console.log('日期', currentDate)
                this.setData({
                  // 'lessonInfo.beginDate': currentDate,    //开始时间
                  'lessonInfo.endDate': currentDate,      // 结束时间
                  showCalendar: false
                });
              }
              put(effects.UPDATE_WEEKDAY);
            },
            //上课开始时间
            [events.ui.CHANGE_BEGINTIME](e) {
              this.setData({ 
              	'lessonInfo.beginTime': e.detail.value,
                'lessonInfo.endTime': moment(e.detail.value,'HH:mm').add('minute',this.data.lessonInfo.duration).format('HH:mm')
              });
            },
            //上课结束时间
            [events.ui.CHANGE_ENDTIME](e) {
              this.setData({ 
				        'lessonInfo.endTime': e.detail.value
              });
            },
            //保存
            [events.ui.SAVE](e) {
              put(effects.SAVE);
            },
        }
    }

    mapEffect({ put }) {
        const api = this.$api;
        const common = this.$common;
        const converter = this.$converter;
        return {
            //用户信息
            [effects.GET_USER_INFO]() {
                api.user.gerUserInfo().then(
                    (res) => {
                        if(res.data.errorCode==0){
                            this.setData({userInfo:res.data.result})    
                        }else{
                            this.$common.showMessage(this,res.data.errorMessage);
                            return ;
                        }
                    }
                );  
            },
        	  [effects.UPDATE_WEEKDAY]() {
                this.setData({ 'lessonInfo.beginWeekDay': converter.getWeekDay(this.data.lessonInfo.beginDate) });
                this.setData({ 'lessonInfo.endWeekDay': converter.getWeekDay(this.data.lessonInfo.endDate) });
            },
            //一个孩子的信息
            [effects.GET_CHILD]() {
                api.child.get(this.data.model).then(
                    (res)=>{
                        this.setData({
                          'childInfo':res.data.result.childList[0],
                          'childInfo.logo':api.extparam.getLogoUrl(res.data.result.childList[0].logo)
                        });
                        put(effects.GET_LESSON_DETAIL);
                    },
                    (rej)=>{}
                )
            },
            //课节信息
            [effects.GET_LESSON_DETAIL]() {
                api.course.getLessonOne(this.data.model).then(
                  (res)=>{
                	const rs = res.data.result;
                    rs.beginDate = moment(rs.startTime).format('YYYY-MM-DD')
                    rs.endDate = moment(rs.endTime).format('YYYY-MM-DD')
                    rs.beginTime = moment(rs.startTime,'YYYY-MM-DD HH:mm').format('HH:mm')
                    rs.endTime = moment(rs.endTime,'YYYY-MM-DD HH:mm').format('HH:mm')
                    this.setData({lessonInfo:rs})
                    put(effects.UPDATE_WEEKDAY);
                  },
                  (rej)=>{}
                )
            },
            //保存
            [effects.SAVE]() {
            	const model = this.data.model
              if(model.childId!==""){
                wx.setStorage({
                  key: 'childId',
                  data: model.childId,
                  success: (res) => {
                    console.log('childId保存成功')
                  },
                  fail: (res)=> {
                    console.log('childId保存失败')
                    wx.setStorageSync('childId', model.childId)
                  },
                  complete: function (res) { },
                })
              }
            	model.startTime = this.data.lessonInfo.beginDate+' '+this.data.lessonInfo.beginTime
            	model.endTime = this.data.lessonInfo.endDate+' '+this.data.lessonInfo.endTime
              //console.log(model);return false;
            	api.course.updateLesson(this.data.model).then(
                (res)=>{
                  if(res.data.errorCode=='0'){
                      // this.$storage.set('childId',model.childId)
                    wx.navigateBack({
                      delta: 1,  // 返回上一级
                    })
                    // wx.reLaunch({
                    //   url: '/pages/course/course?current =' + 3 + "&childId=" + model.childId,
                    //   success: (res)=>{},
                    //   fail: function(res) {},
                    //   complete: function(res) {},
                    // })
                  }else if(res.data.errorCode=='100070'){
                      wx.showModal({
                        title: '警告',
                        content: `该时间段已经安排了课程“${res.data.result[0].NAME}”，请重新选择时间。`,
                        confirmText: '查看',
                        confirmColor: '#f29219',
                        showCancel:true,
                        cancelText: '取消',
                        success(resp) {
                          if(resp.confirm){
                            wx.navigateTo({url:'./schoolout_lesson_detail?lessonId='+res.data.result[0].id+'&childId='+model.childId})
                          }
                          if (resp.cancel) {
                            
                          }
                        }
                      });
                  }else if(res.data.errorCode == '100073' || res.data.errorCode == '100074'){
                      common.showMessage(this,res.data.errorMessage);
                  }
                    
                },
                (rej)=>{
                    
                }
            		
            	)
            }
            
        }
    }
}

EApp.instance.register({
    type: SchooloutLessonChangePage,
    id: 'SchooloutLessonChangePage',
    config: { events, effects, actions }
});

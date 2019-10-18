import { EApp, EPage, PAGE_LIFE } from '../../../eea/index'
import { events, effects, actions } from './schoolout_manage_copy.eea'
const moment = require('../../../lib/moment.min.js');

class SchooloutManageCopyPage extends EPage {
    
    get data() {
        return { 
            userInfo:{},//当前用户信息
          	repDis:false,
            model:{
              childId:''
            },
            childInfo:{},
            courseInfo:{},
            repetitionItems: ['无','每天', '每周', '每两周', '自定义'],
            weekDayItems: [
              { name: '星期一', value: '2', checked: true },
              { name: '星期二', value: '3' },
              { name: '星期三', value: '4' },
              { name: '星期四', value: '5' },
              { name: '星期五', value: '6' },
              { name: '星期六', value: '7' },
              { name: '星期日', value: '1' },
            ],
            remindItems: [
              { name: '不提醒', value: 0 },
              { name: '课前15分钟', value: 15  },
              { name: '课前30分钟', value: 30  },
              { name: '课前1小时', value: 60  },
              { name: '课前2小时', value: 120  },
              { name: '课前3小时', value: 180  },
              { name: '课前1天', value: 1440  }
            ],
            userDefined:false,
            showCalendar:false
        };
    }
  
    mapPageEvent({ put }) { 
        return {
            [PAGE_LIFE.ON_LOAD](option) {
                const childId = option.childId;//链接过来的childId
                const courseId = option.courseId;//课程id
                this.setData({
                	'model.childId':childId,
                	'model.courseId':courseId
                });
                //获取用户信息
                put(effects.GET_USER_INFO);
                put(effects.GET_CHILD);
                put(effects.GET_COURSE_BY_ID);
            },
            [PAGE_LIFE.ON_SHOW](option) {
               
            }
        }
    }

    mapUIEvent({ put }) {
        return {
            //教学机构
            [events.ui.CHANGE_ORGNAME](e) {
                this.setData({ 'courseInfo.orgName': e.detail.value });
            },
            //地点
            [events.ui.SELECT_ADDRESS]() {
                wx.chooseLocation({
                  success: (res) => {
                    const address =  res.address || res.name;
                    this.setData({ 'courseInfo.classAddress': address });

                  }
                });
            },
            //教室
            [events.ui.CHANGE_CLASSROOM](e) {
                this.setData({ 'courseInfo.classRoom': e.detail.value });
            },
            [events.ui.CHANGE_TEACHER](e) {
              this.setData({'courseInfo.teacher': e.detail.value});
            },
            [events.ui.CHANGE_TEL](e) {
              this.setData({'courseInfo.contactTel': e.detail.value});
            },
            //上课日期
            [events.ui.CHANGE_BEGINDATE](e) {
              this.setData({showCalendar: true });
            },
            //上课日期回调
            [events.ui.CALENDAR_DAY_CHANGED](e) {
              const currentDate = moment(e.detail.year+' '+e.detail.month+' '+e.detail.day,'YYYY-MM-DD').format('YYYY-MM-DD');
              this.setData({
                'courseInfo.beginDate':currentDate,
                showCalendar:false
              })
              put(effects.UPDATE_WEEKDAY);
              put(effects.CHANGE_ENDDATE);
            },
            //课程节数
            [events.ui.CHANGE_NUM](e) {
                this.setData({ 'courseInfo.num': e.detail.value });
                if(e.detail.value==1){
                  this.setData({repDis:true,'courseInfo.repetitionIndex':0})
                }else{
                  this.setData({repDis:false,'courseInfo.repetitionIndex':2})
                }
                if(this.$common.isIntNum(e.detail.value)){
                  put(effects.CHANGE_ENDDATE);
                }  
            },
            //课程时长
            [events.ui.CHANGE_DURATION](e) {
              if(this.$common.isIntNum(e.detail.value)==false){
                  this.$common.showMessage(this,'请输入大于0的数字');
                  //this.setData({'courseInfo.duration':0})
                  return false;
              }
              this.setData({ 
                  'courseInfo.duration': e.detail.value,
                  'courseInfo.endClassTime': moment(this.data.courseInfo.startClassTime,'HH:mm').add('minute',e.detail.value).format('HH:mm')
              });
            },
            //开始时间
            [events.ui.CHANGE_TIMEFIRST](e) {
              this.setData({ 
                'courseInfo.startClassTime': e.detail.value,
                'courseInfo.endClassTime': moment(e.detail.value,'HH:mm').add('minute',this.data.courseInfo.duration).format('HH:mm')
               });
            },
           
            //重复
            [events.ui.CHANGE_REPETITION](e) {
              this.setData({
                'courseInfo.repetitionIndex': e.detail.value
              });
              if(e.detail.value==4){
                  this.setData({'userDefined': true});
              }
              if(e.detail.value!=4){
                put(effects.CHANGE_ENDDATE);
              }
              
            },
            //自定义层
            [events.ui.CHANGE_CUSTOM_REPETITION](e) {
              const values = e.detail.value;
              const items = this.data.weekDayItems;
              this.setData({'courseInfo.weekDaysTxt':''})
              items.forEach(item => {
                item.checked = values.findIndex(val => item.value === val) > -1;
                if(item.checked){
                    this.setData({ 'courseInfo.weekDaysTxt' : this.data.courseInfo.weekDaysTxt+','+item.name });
                }
              });
              this.setData({ 'courseInfo.weekDaysTxt': this.data.courseInfo.weekDaysTxt.substr(1) });
              this.setData({ 'courseInfo.weekDays': values.join(',') });
              this.setData({ weekDayItems: items });
            },
            //确定自定义
            [events.ui.CHANGE_DEFINED](e) {
              if(this.$common.isBlank(this.data.courseInfo.weekDays)){
                this.$common.showMessage(this,'请选择星期')
                return
              }
              this.setData({'userDefined': false});
              put(effects.CHANGE_ENDDATE);
            },
            
            //上课提醒
            [events.ui.CHANGE_REMIND](e) {
              this.setData({
                'courseInfo.remindIndex': e.detail.value,
                'courseInfo.remindTxt':this.data.remindItems[e.detail.value].name,
                'courseInfo.remindValue':this.data.remindItems[e.detail.value].value
              });
            },
            //保存
            [events.ui.SAVE]() {
                put(effects.SAVE);
            }
            
        }
    }

    mapEffect({ put }) {
        const api = this.$api;
        const common = this.$common;
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
                this.setData({ 'courseInfo.beginWeekDay': this.$converter.getWeekDay(this.data.courseInfo.beginDate) });
            },
            [effects.CHANGE_ENDDATE]() {
                const model = this.data.courseInfo;
                this.$api.course.getEndDate(model).then(
                    (res)=>{
                      this.setData({
                          'courseInfo.endDate':res.data.result.finishTime,
                          'courseInfo.endWeekDay': this.$converter.getWeekDay(res.data.result.finishTime)
                      });
                    },
                    ()=>{}
                )
            },
            //一个孩子的信息
            [effects.GET_CHILD]() {
                api.child.get(this.data.model).then(
                    (res)=>{
                        this.setData({
                          'childInfo':res.data.result.childList[0],
                          'childInfo.logo':api.extparam.getLogoUrl(res.data.result.childList[0].logo)
                        });
                        if(common.isBlank(this.data.model.childId)){
                            this.setData({'model.childId':res.data.result.childList[0].childId});
                        }
                    },
                    (rej)=>{}
                )
            },
            
            //课程详细信息
            [effects.GET_COURSE_BY_ID]() {
                api.course.getone(this.data.model).then(
                    (res)=>{
                    	const rs = res.data.result;
                        rs.beginDate = moment(rs.issueTime).format('YYYY-MM-DD')
                        rs.endDate = moment(rs.finishTime).format('YYYY-MM-DD')
                        rs.startClassTime = moment(rs.startTime,'HH:mm').format('HH:mm')
                        rs.endClassTime = moment(rs.endTime,'HH:mm').format('HH:mm')
                        rs.beginWeekDay = this.$converter.getWeekDay(rs.beginDate)
                        rs.endWeekDay = this.$converter.getWeekDay(rs.endDate)
                        rs.repetitionIndex = rs.frequency
                        rs.remindValue = rs.notify
                        rs.remindIndex = 0;
                        this.data.remindItems.forEach(function(e,index){
                        	if(e.value==rs.notify){
                        		rs.remindIndex = index
                        	}
                        })
                        rs.weekDaysTxt = '';
                        rs.weekDays = rs.userDefine;
                        if(!common.isBlank(rs.userDefine)){
                            const items = this.data.weekDayItems;
                            items.forEach(item => {
                                item.checked = rs.userDefine.indexOf(item.value) > -1;
                                if(item.checked){
                                    rs.weekDaysTxt += ','+item.name;
                                }
                            });
                            rs.weekDaysTxt = rs.weekDaysTxt.substr(1);
                            this.setData({ weekDayItems: items });
                        }
                        if(rs.num==1){
                          this.setData({ repDis: true });
                        }
                        this.setData({courseInfo:res.data.result})
                    },
                    (rej)=>{}
                )
            },
            //保存
            [effects.SAVE]() {
                const model = this.data.courseInfo;
                if(common.isBlank(model.beginDate)){
                    common.showMessage(this,'请选择开课日期');
                    return false; 
                }
                if(common.isBlank(model.num)){
                   common.showMessage(this,'请填写课程节数');
                   return false; 
                }
                if(!common.isIntNum(model.num)){
                   common.showMessage(this,'请填写大于0的数字');
                   return false; 
                }
                if(common.isBlank(model.startClassTime)){
                   common.showMessage(this,'请选择开始时间');
                   return false; 
                }

                if(common.isBlank(model.duration) || model.duration=='0'){
                   common.showMessage(this,'请填写课程时长');
                   return false; 
                }
                this.$api.course.create(model).then(
                    (res)=>{
                      if(res.data.errorCode=='0'){
                          wx.navigateTo({url:'./schoolout_manage?childId='+model.childId})
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
                                wx.navigateTo({url:'../p_lesson/schoolout_lesson_detail?lessonId='+res.data.result[0].id+'&childId='+model.childId})
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
                );
            }
            
        }
    }
}

EApp.instance.register({
    type: SchooloutManageCopyPage,
    id: 'SchooloutManageCopyPage',
    config: { events, effects, actions }
});
import { EApp, EPage, PAGE_LIFE } from '../../../eea/index'
import { events, effects, actions } from './schoolout_manage_checkwork.eea'
const moment = require('../../../lib/moment.min.js');

class SchooloutManageCheckWorkPage extends EPage {
    
    get data() {
        return { 
            userInfo:{},//当前用户信息
            model:{
              childId:'',
              currentMonth:moment().format('YYYY-MM'),
              courseStatus:''
            },
          childInfo:{},
            courseInfo:{},
            lessonInfo:[],
            lessonSummary:{},
            calendarClass:'calendar_mask'
        };
    }
  
    mapPageEvent({ put }) { 
        return {
            [PAGE_LIFE.ON_LOAD](option) {
                //获取用户信息
                put(effects.GET_USER_INFO);

                const childId = option.childId;//链接过来的childId
                const courseId = option.courseId;//课程id
                this.setData({
                  'model.childId':childId,
                  'model.courseId':courseId
                });
                
            },
            [PAGE_LIFE.ON_SHOW](option) {
                put(effects.GET_CHILD);
                put(effects.GET_COURSE_BY_ID);
                put(effects.GET_CHECKWORK);
            }
        }
    }

    mapUIEvent({ put }) {
        return {
            //接收月份改变
            [events.ui.CALENDAR_MONTH_CHANGED](e) {
                const currentMonth = moment(e.detail.currentYear+' '+e.detail.currentMonth).format('YYYY-MM');
                this.setData({
                    'model.currentMonth':currentMonth
                })
                put(effects.GET_CHECKWORK);
            },
            //切换状态
            [events.ui.CHANGE_SELECT](e) {
                const courseStatus = e.currentTarget.dataset.status;
                this.setData({
                    'model.courseStatus':courseStatus
                })
                put(effects.GET_CHECKWORK);
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
            //一个孩子的信息
            [effects.GET_CHILD]() {
                api.child.get(this.data.model).then(
                    (res)=>{
                        this.setData({
                          'childInfo':res.data.result.childList[0],
                          'childInfo.logo':(res.data.result.childList[0].logo)
                      
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
                      this.setData({courseInfo:res.data.result})
                    },
                    (rej)=>{}
                )
            },
            //课程对应的课节状态信息
            [effects.GET_CHECKWORK]() {
                api.course.monthCheckWork(this.data.model).then(
                    (res)=>{
                        if(res.data.errorCode=='0'){
                            const rs = res.data.result.courseDetails
                            rs.forEach(
                               (item)=>{
                                    item.year = moment(item.date).format('YYYY')
                                    item.month = moment(item.date).format('M')
                                    item.day = moment(item.date).format('D')
                               }     
                            )
                            this.setData({
                                lessonInfo:res.data.result.courseDetails,
                                lessonSummary:res.data.result.courseSummary[0]
                            });
                        }else if(res.data.errorCode=='100006'){
                            this.setData({lessonInfo:[]});
                        }
                    },
                    (rej)=>{}
                )
            }
        }
    }
}

EApp.instance.register({
    type: SchooloutManageCheckWorkPage,
    id: 'SchooloutManageCheckWorkPage',
    config: { events, effects, actions }
});

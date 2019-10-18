import { EApp, EPage, PAGE_LIFE } from '../../../eea/index'
import { events, effects, actions } from './schoolout_lesson_share.eea'
const moment = require('../../../lib/moment.min.js');

class SchooloutLessonSharePage extends EPage {
    
    get data() {
        return { 
            userInfo:{},//当前用户信息
            model:{},
            lessonInfo:{},
            remindItems: [
              { name: '不提醒', value: 0 },
              { name: '课前15分钟', value: 15  },
              { name: '课前30分钟', value: 30  },
              { name: '课前1小时', value: 60  },
              { name: '课前2小时', value: 120  },
              { name: '课前3小时', value: 180  },
              { name: '课前1天', value: 1440  }
            ],
        };
    }
  
    mapPageEvent({ put }) { 
        return {
            [PAGE_LIFE.ON_LOAD](option) {
                let code = option.code;
                this.setData({
                    'model.code':code
                });
            },
            [PAGE_LIFE.ON_SHOW](option) {
                put(effects.GET_SHARE_INFO);
            }
        }
    }

    mapUIEvent({ put }) {
        return {
            //查看位置
            [events.ui.OPEN_LOCATION](e) {
                let longitude = Number(this.data.lessonInfo.longitude);
                let latitude = Number(this.data.lessonInfo.latitude);
                wx.openLocation({
                  latitude: latitude,
                  longitude: longitude
                })
            }
            
        }
    }

    mapEffect({ put }) {
        const api = this.$api;
        const common = this.$common;
        return {
            //课节信息
            [effects.GET_SHARE_INFO]() {
                api.course.getShareInfo(this.data.model).then(
                  (res)=>{
                	const rs = res.data.result;
                    rs.lessonId = this.data.model.lessonId
                    rs.beginDate = moment(rs.startTime).format('YYYY-MM-DD')
                    rs.endDate = moment(rs.endTime).format('YYYY-MM-DD')
                    rs.notifyTxt = ''
                    this.data.remindItems.forEach(function(e){
                        if(e.value==rs.notify){
                            rs.notifyTxt = e.name
                        }
                    })
                    rs.percent = Math.round(rs.attendClass/rs.allClass*100)
                    if(typeof rs.status=='undefined'){
                        rs.status = '';
                    }
                    rs.logo = api.extparam.getLogoUrl(rs.logo)
                    this.setData({lessonInfo:rs})
                  },
                  (rej)=>{}
                )
            }
        }
    }
}

EApp.instance.register({
    type: SchooloutLessonSharePage,
    id: 'SchooloutLessonSharePage',
    config: { events, effects, actions }
});

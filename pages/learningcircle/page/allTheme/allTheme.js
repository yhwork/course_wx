 import {
   EApp,
   EPage,
   PAGE_LIFE
 } from '../../../../eea/index'
 import {
   events,
   effects,
   actions
 } from '../allTheme/allTheme.eea'
 var util = require('../../../../lib/util.js');
 var data = util.formatTime(new Date());
 class allThemePage extends EPage {
   get data() {
     return {
       timeData: data,
       model: {
         communityId: '',
         pageSize: 10,
         currentPage: 1
       }
     };
   }


   mapPageEvent({
     put
   }) {
     return {
       [PAGE_LIFE.ON_LOAD](option) {
         console.log(option)
         this.setData({
           'model.communityId': option.communityId,
           'model.level': option.level,
           'model.type': option.type,
           'model.communityType': option.communityType
         })
         console.log(this.data.model)
         if (option.role == "true") {
           this.setData({
             'model.role': true
           })
         } else {
           this.setData({
             'model.role': false
           })
         }
         put(effects.GET_TODAY_SUBJECT);
         put(effects.LOAD_THEME_INFO);
         //查询补打卡规则
         this.$api.circle.getCommunityRule(this.data.model).then(res => {
           let errorCode = res.data.errorCode;
           if (errorCode == 0) {
             this.setData({
               reSignIn: res.data.result[1].ruleSettingValue
             })
           }
         })
       },
       [PAGE_LIFE.ON_SHOW](option) {
         put(effects.LOAD_THEME_INFO);

       }
     }
   }

   mapUIEvent({
     put
   }) {
     return {
       [events.ui.DEL_THEME](e) {
         console.log("删除")
         const subjectId = e.currentTarget.dataset.subjectid;
         const status = e.currentTarget.dataset.status;
         this.setData({
           'model.subjectId': subjectId,
           'model.status': status
         })
         wx.showModal({
           title: '提示',
           content: '你确定要删除当前主题么？',
           showCancel: true,
           confirmColor: '#f29219',
           success: function(res) {
             if (res.confirm) {

               put(effects.DEL_SUBJECT_STATUS);
             }
           }
         })


         console.log(status)

         console.log(subjectId)

       },
       // 提示
       [events.ui.MARKED](e) {
         wx.showModal({
           title: '提示',
           content: '打卡时间未到',
           showCancel: true,
           confirmColor: '#f29219',
           //  cancelColor: '#007aff',
           success: function(res) {
             if (res.confirm) {}
           }
         })
       },
       // 提示
       [events.ui.MARKED1](e) {
         wx.showModal({
           title: '提示',
           content: '打完上一关解锁',
           showCancel: true,
           confirmColor: '#f29219',
          //  cancelColor: '#007aff',
           success: function(res) {
             if (res.confirm) {}
           }
         })
       },
       [events.ui.PAGEPLUS](e) {
         if (this.data.themeList.length >= this.data.listNum) {
           return
         }
         console.log('刷新')
         let membercurrentPage = this.data.model.currentPage + 1;
         this.setData({
           'model.currentPage': membercurrentPage
         })
         put(effects.LOAD_THEME_INFO, {});
       },
     }
   }

   mapEffect() {
     return {
       [effects.LOAD_THEME_INFO]() {
         // this.$api.circle.getHistorySubjectList(this.data.model).then(res => {        历史主题
         //全部主题
         this.$api.circle.getSubjectList(this.data.model).then(res => {
           console.log(res.data.result.learnList)
           if (res.data.errorCode == 0) {
             if (this.data.model.currentPage == 1) {
               if (res.data.result.learnList != "" && res.data.result.learnList != null && typeof(res.data.result.learnList) != "undefind") {
                 this.setData({
                   themeList: res.data.result.learnList,
                   listNum: res.data.result.count
                 });
               }
             } else {
               if (res.data.result.learnList != "" && res.data.result.learnList != null && typeof(res.data.result.learnList) != "undefind") {
                 this.setData({
                   themeList: this.data.themeList.concat(res.data.result.learnList)
                 })
               }
             }
           }
         });
       },
       //删除
       [effects.DEL_SUBJECT_STATUS]() {
         console.log(this.data.model)
         this.$api.circle.updateSubjectStatus(this.data.model).then(res => {

             if (res.data.errorCode == 0) {
               console.log(res)
               wx.showToast({
                 title: '删除成功',
               })
               // put(effects.LOAD_THEME_INFO);
               console.log(this.data)
               wx.redirectTo({
                 url: './allTheme?communityId=' + this.data.model.communityId + '&type=' + this.data.model.type + '&communityType=' + this.data.model.communityType + '&role=' + this.data.model.role + '&level=' + this.data.model.level

               })
             }

           },
           (rej) => {}
         );
       },
     }
   }
 }

 EApp.instance.register({
   type: allThemePage,
   id: 'allThemePage',
   config: {
     events,
     effects,
     actions
   }
 });
import {EApp,EPage,PAGE_LIFE} from '../../../eea/index'
import {events,effects,actions} from './schoolin_add1.eea'

class SchoolinAdd1Page extends EPage {
  get data() {
    return {
      userInfo:{},
      model: {
        childId: ''
      },
      childInfo: {},
      switched:false
    };
  }

  mapPageEvent({put}) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        //获取用户信息
        put(effects.GET_USER_INFO);
        //option.childId = 1895
        if (typeof option.childId != 'undefined') {
          const childId = option.childId; //链接过来的childId
          this.setData({
            'model.childId': childId
          });
        }
        put(effects.GET_CHILD);
        let courseTable = courseTableF();
        this.setData({courseTable:courseTable})
      },
      [PAGE_LIFE.ON_SHOW]() {
        this.$storage.get('InterNameList').then(
          (res)=>{
            this.setData({InterNameList:res.data})
            if(typeof this.data.courseTable != 'undefined'){
                let InterNameList = this.data.InterNameList;
                InterNameList.forEach(
                  (item,index)=>{
                    if(item.checked==1){
                        let currCourseName = item.courseName
                        let currCourseNameSub = item.courseNameSub
                        let courseTable = this.data.courseTable
                        courseTable.forEach(
                          (item1,index1)=>{
                              item1.forEach(
                                  (item2,index2)=>{
                                    if(index2!=0){
                                      if(item2.courseIndex===index){
                                        item2.courseName = currCourseName;
                                        item2.courseNameSub = currCourseNameSub;
                                      }
                                      if(typeof item2.courseIndex1 != 'undefined'){
                                        if(item2.courseIndex1===index){
                                          item2.courseName1 = currCourseName;
                                          item2.courseNameSub1 = currCourseNameSub;
                                        }
                                      }
                                    }
                                    
                                  }
                              )
                          }
                        )
                        this.setData({courseTable:courseTable})
                    }
                  }
                )
            }
          },
          (rej)=>{}
        )
      }
    }
  }

  mapUIEvent({put}) {
    return {
      [events.ui.CHOOSE_TAG](e) {
        let tagName = e.currentTarget.dataset.name
        let InterNameList = this.data.InterNameList
        let courseTable = this.data.courseTable;
        InterNameList.forEach(
          (item,index)=>{
            if(item.courseName==tagName){
              item.checked=1
            }else{
              item.checked=0
            }
          }
        )
        courseTable.forEach(
          (item,index)=>{
              item.forEach(
                  (item1,index1)=>{
                    if(index1!=0){
                      if(item1.courseName==tagName){
                        item1.courseClass = 'c_select';
                      }else if(item1.courseName!=''){
                        item1.courseClass = 'selected';
                      }
                      if (typeof item1.courseName1 != 'undefined') {
                        if( item1.courseName1==tagName){
                          item1.courseClass1 = 'even_w c_select';
                        }else if(item1.courseName1!=''){
                          item1.courseClass1 = 'selected';
                        }
                      }
                      
                    }
                    
                  }
              )
          }
        )
        this.setData({
          InterNameList:InterNameList,
          courseTable:courseTable
        });
        this.$storage.set('InterNameList', this.data.InterNameList);
      },
      [events.ui.BIND_COURSE](e) {
          if(this.data.switched){
            return;
          }
          let InterNameList = this.data.InterNameList;
          let courseTable = this.data.courseTable;
          let row = e.currentTarget.dataset.row;
          let col = e.currentTarget.dataset.col;
          InterNameList.forEach(
            (item,index)=>{
              if(item.checked==1){
                console.log(row);console.log(col);
                let currCourseName = item.courseName
                let currCourseNameSub = item.courseNameSub
                console.log(currCourseName)
                if(courseTable[row][col].courseClass != 'selected'){
                  if(courseTable[row][col].courseClass == 'c_select'){
                    courseTable[row][col].courseName = '';
                    courseTable[row][col].courseClass = '';
                    courseTable[row][col].courseNameSub = '';
                    courseTable[row][col].courseIndex = '';
                  }else{
                    courseTable[row][col].courseName = currCourseName;
                    courseTable[row][col].courseClass = 'c_select';
                    courseTable[row][col].courseNameSub = currCourseNameSub;
                    courseTable[row][col].courseIndex = index;
                  }
                  
                }
                this.setData({courseTable:courseTable})
              }
            }
          ) 
      },
      [events.ui.BIND_COURSE_DOUBLE](e) {
          if(this.data.switched){
            return;
          }
          let InterNameList = this.data.InterNameList;
          let courseTable = this.data.courseTable;
          let row = e.currentTarget.dataset.row;
          let col = e.currentTarget.dataset.col;
          InterNameList.forEach(
            (item,index)=>{
              if(item.checked==1){
                let currCourseName = item.courseName
                let currCourseNameSub = item.courseNameSub
                console.log(currCourseName)
                if(courseTable[row][col].courseClass1 != 'selected'){
                  if(courseTable[row][col].courseClass1 == 'even_w c_select'){
                    courseTable[row][col].courseName1 = '';
                    courseTable[row][col].courseClass1 = '';
                    courseTable[row][col].courseNameSub1 = '';
                    courseTable[row][col].courseIndex1 = '';
                  }else{
                    courseTable[row][col].courseName1 = currCourseName;
                    courseTable[row][col].courseClass1 = 'even_w c_select';
                    courseTable[row][col].courseNameSub1 = currCourseNameSub;
                    courseTable[row][col].courseIndex1 = index;
                  }
                  
                }
                this.setData({courseTable:courseTable})
              }
            }
          ) 
      },
      [events.ui.ADD_COURSE_CIRCLE](e) {
          if(this.data.switched==false){
            return;
          }
          let courseTable = this.data.courseTable;
          let row = e.currentTarget.dataset.row;
          let col = e.currentTarget.dataset.col;
          if(typeof courseTable[row][col].courseSwitch != 'undefined'){
            courseTable[row][col].courseSwitch = !courseTable[row][col].courseSwitch;
          }else{
            courseTable[row][col].courseSwitch = true;
          }
          courseTable[row][col].courseName1 = '';
          courseTable[row][col].courseClass1 = '';
          courseTable[row][col].courseNameSub1 = '';
          courseTable[row][col].courseIndex1 = '';
          this.setData({courseTable:courseTable})
          console.log(this.data.courseTable)
      },
      [events.ui.BIND_LONG_PRESS](e) {
        let tagName = e.currentTarget.dataset.name
        let InterNameList = this.data.InterNameList
        InterNameList.forEach(
          (item,index)=>{
            if(item.courseName==tagName){
              item.courseDel=true;
            }else{
              item.courseDel=false;
            }
          }
        )
        this.setData({
          InterNameList:InterNameList
        });
        this.$storage.set('InterNameList', this.data.InterNameList);
      },
      [events.ui.ADD_TAG]() {
        wx.navigateTo({url:'./schoolin_tag_add'})
      },
      [events.ui.DEL_TAG](e) {
          let index = e.currentTarget.dataset.index;
          let courseName = e.currentTarget.dataset.coursename;
          let InterNameList = this.data.InterNameList;
          let courseTable = this.data.courseTable;
          let that = this;
          wx.showModal({
              title: '提示',
              content: '您确认要删除该课程吗？',
              showCancel:true,
              confirmColor:'#FF4500',
              success: function(res){
                  if(res.confirm){
                      InterNameList.splice(index,1);
                      courseTable.forEach(
                        (item,index)=>{
                            item.forEach(
                                (item1,index1)=>{
                                  if(index1!=0){
                                    if(item1.courseName==courseName){
                                      item1.courseName = '';
                                      item1.courseClass = '';
                                      item1.courseNameSub = '';
                                      item1.courseIndex = '';
                                    }
                                    if(typeof item1.courseName1 != 'undefined' && item1.courseName1==courseName){
                                        item1.courseName1 = '';
                                        item1.courseClass1 = '';
                                        item1.courseNameSub1 = '';
                                        item1.courseIndex1 = '';
                                    }
                                  }
                                  
                                }
                            )
                        }
                      )
                      that.setData({
                        InterNameList:InterNameList,
                        courseTable:courseTable
                      });
                      that.$storage.set('InterNameList', that.data.InterNameList);
                  }
              }
          })
      },
      [events.ui.EDIT_TAG]() {
          let InterNameList = this.data.InterNameList;
          InterNameList.forEach(
            (item,index)=>{
              if(item.checked==1){
                wx.navigateTo({url:'./schoolin_tag_modify?index='+index})
              }
            }
          )
      },
      [events.ui.BIND_SWITCH](e) {
          this.setData({switched:e.detail.value})
      },
      [events.ui.SAVE_NEXT]() {
        put(effects.SAVE_NEXT);
      }
    }
  }

  mapEffect({put}) {
    const api = this.$api;
    const common = this.$common;
    return {
      //用户信息
      [effects.GET_USER_INFO]() {
          this.$api.user.gerUserInfo().then(
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
      [effects.GET_CHILD]() {
        const model = this.data.model;
        api.child.get(model).then(
          (res) => {
            this.setData({
              'childInfo': res.data.result.childList[0],
              'childInfo.logo': api.extparam.getLogoUrl(res.data.result.childList[0].logo)
            });
            if (common.isBlank(this.data.model.childId)) {
              this.setData({
                'model.childId': res.data.result.childList[0].childId
              });
            }
            this.$storage.set('childInfo', this.data.childInfo);
            put(effects.getChildSchoolName);
            put(effects.getAllInternalCourseName);
          }
        )
      },
      [effects.getChildSchoolName]() {
        const model = this.data.model;
        api.course.getChildSchoolName(model).then(
          (res) => {
            if(res.data.errorCode=='0'){
              this.setData({
                'schoolInfo': res.data.result
              });
              this.$storage.set('schoolInfo', this.data.schoolInfo);
            }
          }
        )
      },
      [effects.getAllInternalCourseName]() {
        api.course.addDefaultCourse({childId:this.data.model.childId}).then(
            (res)=>{
              if(res.data.errorCode=='0'){
                api.course.getAllInternalCourseName({childId:this.data.model.childId}).then(
                  (res) => {
                    if(res.data.errorCode=='0'){
                      let rs = res.data.result.InterNameList;
                      rs.forEach(
                        (item,index)=>{
                          item.courseNameSub = item.courseName.slice(0,1);
                          item.courseDel = false;
                          if(index==0){
                            item.checked=1;
                          }else{
                            item.checked=0;
                          }
                        }
                      )
                      this.setData({
                        'InterClassDetailsId':res.data.result.InterClassDetailsId,
                        'InterNameList': rs
                      });  
                      this.$storage.set('InterNameList', this.data.InterNameList);
                      this.$storage.set('InterClassDetailsId', this.data.InterClassDetailsId);
                    }
                  }
                )
              }
            },
            (rej)=>{}
        )
        
      },
      [effects.SAVE_NEXT]() {
        let courseTable =this.data.courseTable
        let canNext = false;
        courseTable.forEach(
          (item,index)=>{
              item.forEach(
                  (item1,index1)=>{
                    if(index1!=0){
                      if(item1.courseName!=''){
                        canNext = true;
                      }
                    }
                    
                  }
              )
          }
        )
        if(canNext){
          this.$storage.set('courseTable',this.data.courseTable).then(
              wx.navigateTo({
                url: './schoolin_add2'
              })
          )
        }else{
          common.showMessage(this, '请添加校内课程');
          return
        }
        
      }
    }
  }
}

function courseTableF(){
    let empty_course = new Array;
    for (let i = 0; i < 8; i++) {
        empty_course[i] = new Array;
        for(let j=0;j<6;j++){
          if(j==0){
            empty_course[i][j] = i;
          }else{
            empty_course[i][j] = {courseName: '',courseNameSub:'',courseClass: '',courseIndex:''}
          }
          
        }
        
    }
    console.log(empty_course)
    return empty_course;
}

EApp.instance.register({
  type: SchoolinAdd1Page,
  id: 'SchoolinAdd1Page',
  config: {
    events,
    effects,
    actions
  }
});
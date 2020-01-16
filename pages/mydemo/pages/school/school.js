import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../../eea/index'
import {
  events,
  effects,
  actions
} from './school.eea'

class school extends EPage {
  get data() {
    return {
      slideHidden: false,
      model: {
        areaId: 86
      },
      provincename: '请选择',
      cityname: '请选择',
      regionname: '请选择',
      province: [],
      city: [],
      region: [],
      schoolList: [],
      schoolinfo: {},
      inputShowed: false,
      inputVal: "",
      addSchool:true
    };
  }


  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        console.log('值',option)
        if (typeof option.comefrom != 'undefined') {
          this.setData({
            'model.comefrom': option.comefrom
          })
        }
        if (typeof option.childId != 'undefined') {
          this.setData({
            childId: option.childId
          })
        }
      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      [events.ui.inputvalue](e) {
        this.setData({
          'model.schoolName': e.detail.value
        });
      },
      [events.ui.INPUT_TYPING](e) {
        put(effects.SEARCH_SCHOOL);
      },
      //选择学校返回创建孩子页面/教师信息页面
      [events.ui.SET_SCHOOL](e) {
        this.$storage.set('schoolinfo.name', e.currentTarget.dataset.name);
        this.$storage.set('schoolinfo.city', e.currentTarget.dataset.city);
        this.$storage.set('schoolinfo.typecode', e.currentTarget.dataset.typecode);
        this.$storage.set('schoolinfo.schoolid', e.currentTarget.dataset.id);
        console.log(e.currentTarget.dataset.id, this.data.model.comefrom, this.data.childId)
        if (this.data.model.comefrom == 'parent') {
          wx.redirectTo({
            url: '../register/info/p_info'
          });
        } else if (this.data.model.comefrom == 'teacher') {
          wx.navigateBack({
          })
        } else if (this.data.model.comefrom == 'addClass') {
          wx.redirectTo({
            url: '../course/t_add/class/create_class?refresh=no'
          });
        } else if (this.data.model.comefrom == 'modifyChildInfo') {
          wx.redirectTo({
            url: '../mypage/modifyInformation/modifyInformation?id=' + this.data.childId + "&from=area",
          })
        } else if (this.data.model.comefrom == 'personalInfo') {
          wx.redirectTo({
            url: '../personalInfo/personalInfo?comefrom=area',
          })
          // wx.navigateBack({
          // })
          //           wx.redirectTo({
        //   url: `../../../pages/mypage/editMyChild/editMyChild?avatar=${avatar}&childId=${this.data.childId}&manage=${'false'}`
        // })
        } else if (this.data.model.comefrom == 'childMsg') {
          wx.redirectTo({
            url: '../editMyChild/editMyChild?childId=' + this.data.childId + "&from=area" + "&manage=" + 'false',
          })
        } else if (this.data.model.comefrom == 'addChild') {
          wx.redirectTo({
            url: '../../register/info/p_info?childId=' + this.data.childId + "&from=area",
          })
        // 添加校内课程
        } else if (this.data.model.comefrom == 'changeschool') {
          wx.navigateBack({})
        }

      },
      [events.ui.INPUTNAME](e){
        this.setData({
          'inputname': e.detail.value
        })
      },  
      // 添加自定义学校
      
      [events.ui.ADDSCHOOL](){
        if (this.$common.isBlank(this.data.inputname)) {
          this.$common.showMessage(this, '请输入标准的学校名称');
          return false;
        }
        let inputMap = {
          schoolName : this.data.inputname
        }
        this.$api.area.addSchool(inputMap).then( res => {
          console.log(res.data)
          if (res.data.errorCode==0){
            wx.showToast({
              title: '添加成功',
            })
            // this.setData({
            //   addSchool:true
            // })
           
            this.$storage.set('schoolinfo.name', this.data.inputname);
            this.$storage.set('schoolinfo.schoolid', res.data.result.schoolId);
            this.$storage.set('schoolinfo.city', '自定义');
            this.$storage.set('schoolinfo.typecode', 0);
            if (this.data.model.comefrom == 'parent') {
              wx.redirectTo({
                url: '../register/info/p_info'
              });
            } else if (this.data.model.comefrom == 'teacher') {
              wx.navigateBack({
              })
            } else if (this.data.model.comefrom == 'addClass') {
              wx.redirectTo({
                url: '../course/t_add/class/create_class?refresh=no'
              });
            } else if (this.data.model.comefrom == 'modifyChildInfo') {
              wx.redirectTo({
                url: '../mypage/modifyInformation/modifyInformation?id=' + this.data.childId + "&from=area",
              })
            } else if (this.data.model.comefrom == 'personalInfo') {
              wx.redirectTo({
                url: '../personalInfo/personalInfo?comefrom=area',
              })
              // wx.navigateBack({
              // })
            } else if (this.data.model.comefrom == 'childMsg') {
              wx.redirectTo({
                url: '../editMyChild/editMyChild?childId=' + this.data.childId + "&from=area",
              })
            } else if (this.data.model.comefrom == 'addChild') {
              wx.redirectTo({
                url: '../../register/info/p_info?childId=' + this.data.childId + "&from=area",
              })
            } else if (this.data.model.comefrom == 'changeschool') {
              wx.navigateBack({})
            }
          }
        })
      }
    } 
  }

  mapEffect() {
    return {
      // 查找所有学校
      [effects.SEARCH_SCHOOL]() {
        console.log(this.data.model)
        this.$api.area.schoolSearch(this.data.model).then((res) => {
          console.log(res.data)
          if (res.data.errorCode==0){
            this.setData({
              schoolList: res.data.result
            })
          } else if (res.data.errorCode == 100006){
            this.setData({
              schoolList: [],
              'msg':'提示：如果没有找到请自行添加学校',
              addSchool:false,
            })
          }
          
        });
      }
    }
  }
}

EApp.instance.register({
  type: school,
  id: 'school',
  config: {
    events,
    effects,
    actions
  }
});
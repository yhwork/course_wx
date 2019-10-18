import {EApp,EPage,PAGE_LIFE} from '../../eea/index'
import {events, effects,actions} from './area.eea'

class AreaPage extends EPage {
  get data() {
    return {
      slideHidden: false,
      searchHidden: true,
      model: {
        areaId: 86,
        comefrom: 'parent'
      },
      provincename: '请选择',
      cityname: '请选择',
      regionname: '请选择',
      province: [],
      city: [],
      region: [],
      shcool: [],
      schoolinfo: {},
      inputShowed: false,
      inputVal: "",
      childId: ''
    };
  }
  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        console.log(option)
        if (typeof option.comefrom != 'undefined') {
          console.log(this.data.model)
          this.setData({
            'model.comefrom': option.comefrom
          })
        }
        if (typeof option.childId != 'undefined') {
          this.setData({
            childId: option.childId
          })
        }
        console.log(this.data.model)
        put(effects.LOAD_AREA_PROVINCE);
      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      //选择省
      [events.ui.SELECT_PROVINCE](e) {
        this.setData({
          'model.areaId': e.currentTarget.dataset.id,
          provincename: e.currentTarget.dataset.name,
          cityname: '请选择',
          regionname: '请选择',
          region: []
        });
        put(effects.LOAD_AREA_CITY);
      },
      //选择市
      [events.ui.SELECT_CITY](e) {
        this.setData({
          'model.areaId': e.currentTarget.dataset.id,
          cityname: e.currentTarget.dataset.name,
          regionname: '请选择',
          region: []
        });
        put(effects.LOAD_AREA_REGION);
      },
      //选择区
      [events.ui.SELECT_REGION](e) {
        this.setData({
          'model.areaId': e.currentTarget.dataset.id,
          regionname: e.currentTarget.dataset.name
        });
        put(effects.CHANGE_HIDEBOLCK1);
        put(effects.LOAD_SEARCH);
      },

      //点击地区
      [events.ui.SHOW_SELECT](e) {
        put(effects.CHANGE_HIDEBOLCK2);
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
          wx.redirectTo({
            url: '../register/info/t_info'
          });
        } else if (this.data.model.comefrom == 'addClass') {
          wx.navigateTo({
            url: '../course/t_add/class/create_class?refresh=no'
          });
        } else if (this.data.model.comefrom == 'modifyChildInfo') {
          wx.redirectTo({
            url: '../mypage/modifyInformation/modifyInformation?id=' + this.data.childId + "&from=area",
          })
        } else if (this.data.model.comefrom == 'personalInfo') {
          wx.navigateTo({
            url: '../mypage/personalInfo/personalInfo?comefrom=area',
          })
        } else if (this.data.model.comefrom == 'childMsg') {
          wx.redirectTo({
            url: '../mypage/editMyChild/editMyChild?childId=' + this.data.childId + "&from=area",
          })
        } else if (this.data.model.comefrom == 'addSchoolClass') {
          wx.redirectTo({
            url: '../course/p_add/schoolin_add2?comefrom=area',
          })
        }

      },

      [events.ui.SHOW_INPUT](e) {
        this.setData({
          inputShowed: true
        });
      },
      [events.ui.HIDE_INPUT](e) {
        this.setData({
          inputVal: "",
          inputShowed: false
        });
      },
      [events.ui.CLEAR_INPUT](e) {
        this.setData({
          inputVal: ""
        });
      },
      // 搜索
      [events.ui.INPUT_TYPING](e) {
        this.setData({
          'model.schoolName': e.detail.value
        });
        put(effects.SEARCH_SCHOOL);
      }

    }
  }

  mapEffect() {
    return {
      [effects.CHANGE_HIDEBOLCK1]() {
        this.setData({
          slideHidden: true,
          searchHidden: false
        });
      },
      [effects.CHANGE_HIDEBOLCK2]() {
        this.setData({
          slideHidden: false,
          searchHidden: true
        });
      },
      [effects.LOAD_AREA_PROVINCE]() {
        console.log(this.data.model)
        this.$api.area.get(this.data.model).then(res =>
          this.setData({
            province: res.data.result
          })
        );
      },
      [effects.LOAD_AREA_CITY]() {
        this.$api.area.get(this.data.model).then((res) => this.setData({
          city: res.data.result
        }));
      },

      [effects.LOAD_AREA_REGION]() {
        this.$api.area.get(this.data.model).then((res) => this.setData({
          region: res.data.result
        }));
      },
      [effects.LOAD_SEARCH]() {
        this.$api.area.school(this.data.model).then((res) => this.setData({
          shcool: res.data.result
        }));
      },
      // 搜索
      [effects.SEARCH_SCHOOL]() {
        this.$api.area.schoolSearch(this.data.model).then((res) => this.setData({
          shcool: res.data.result
        }));
      }

    }
  }
}

EApp.instance.register({
  type: AreaPage,
  id: 'AreaPage',
  config: {
    events,
    effects,
    actions
  }
});
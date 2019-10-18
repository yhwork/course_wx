import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../eea/index'
import {
  events,
  effects,
  actions
} from './area.eea'

class AreaPage1 extends EPage {
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
      shcool: [],
      schoolinfo: {},
      inputShowed: false,
      inputVal: ""
    };
  }


  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
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
        put(effects.LOAD_SEARCH);
        wx.redirectTo({
          url: '../personalInfo/personalInfo?city=' + this.data.provincename + ' ' + this.data.cityname +
            ' ' + this.data.regionname,
        })
      },

      //点击地区
      [events.ui.SHOW_SELECT](e) {
        put(effects.CHANGE_HIDEBOLCK2);
      },

      //选择学校返回创建孩子页面
      [events.ui.SET_SCHOOL](e) {
        this.$storage.set('schoolinfo.name', e.currentTarget.dataset.name);
        this.$storage.set('schoolinfo.city', e.currentTarget.dataset.city);
        this.$storage.set('schoolinfo.typecode', e.currentTarget.dataset.typecode);
        wx.navigateTo({
          url: '../register/info/p_info'
        });
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
      [effects.LOAD_AREA_PROVINCE]() {
        this.$api.area.get(this.data.model).then((res) => this.setData({
          province: res.data.result
        }));
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
      [effects.SEARCH_SCHOOL]() {
        this.$api.area.schoolSearch(this.data.model).then((res) => this.setData({
          shcool: res.data.result
        }));
      }
    }
  }
}

EApp.instance.register({
  type: AreaPage1,
  id: 'AreaPage1',
  config: {
    events,
    effects,
    actions
  }
});
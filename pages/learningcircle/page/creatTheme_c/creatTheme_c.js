import { EApp, EPage, PAGE_LIFE } from '../../../../eea/index'
import { events, effects, actions } from './creatTheme_c.eea'

class creatTheme_cPage extends EPage {
  get data() {
    return {
      EdateSelect:false,
      SdateSelect:false,
    };
  }


  mapPageEvent({ put }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        let id = 100000;
        if (typeof id !== 'undefined') {
          id = parseInt(id);
          put(effects.LOAD_CIRCLE_INFO, {
            id
          });
        }
      }
    }
  }

  mapUIEvent({ put }) {
    return {
      [events.ui.startDateChange](e) {
        this.setData({
          startDate: e.detail.value,
          SdateSelect:true,
        })
      },
      [events.ui.endDateChange](e) {
        this.setData({
          endDate: e.detail.value,
          EdateSelect: true
        })
      },

      
    }
  }

  mapEffect() {
    return {
      [effects.LOAD_CIRCLE_INFO]({ id }) {
        this.$api.circle.getCommunityInfo(id).then(res => {
          this.setData({
            model: res.data.result
          });
        });
      },
      [effects.SAVE_CHILD]() {
        console.log(1);
        this.$api.child.demo().then(() => wx.navigateBack());
      }
    }
  }
}

EApp.instance.register({
  type: creatTheme_cPage,
  id: 'creatTheme_cPage',
  config: {
    events,
    effects,
    actions
  }
});
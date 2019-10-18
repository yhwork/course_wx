// pages/circle/circleReport/circleReport.js
import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../../eea/index'
import {
  events,
  effects,
  actions
} from './circleReport.eea'

class circleReportPage extends EPage {
  get data() {
    return {
      reason_list: [{
        unSelect: true,
        reason: '诈骗'
      },
      {
        unSelect: true,
        reason: '色情及淫秽'
      },
      {
        unSelect: true,
        reason: '违法犯罪'
      },
      {
        unSelect: true,
        reason: '其他'
      },
      ],
    };
  }


  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        let {
          id
        } = option;
        if (typeof id !== 'undefined') {
          id = parseInt(id);
          put(effects.LOAD_CHILD, {
            id
          });
        }
      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      [events.ui.reasonSelect](e) { //选择原因
        var unselect = e.currentTarget.dataset.unselect;
        var idx = e.currentTarget.dataset.idx;
        var unSelect = "reason_list[" + idx + "].unSelect";
        if (unselect) {
          this.setData({
            [unSelect]: false
          })
        } else {
          this.setData({
            [unSelect]: true
          })
        }

      },
      [events.ui.SAVE]() {
        put(effects.SAVE_CHILD);
      }
    }
  }

  mapEffect() {
    return {
      [effects.LOAD_CHILD]({
        id
      }) {
        this.$api.child.get(id).then(model => {
          this.setData({
            model
          });
        });
      },
      [effects.SAVE_CHILD]() {
        console.log(1);
        this.$api.child.demo().then(() => wx.navigateBack());
        /*const model = this.data.model;
        const { id } = model;
        if (typeof id === 'undefined') {console.log(1);
            this.$api.child.create(model).then(() => wx.navigateBack());
        } else {
            this.$api.child.update(model).then(() => wx.navigateBack());
        }*/
      }
    }
  }
}

EApp.instance.register({
  type: circleReportPage,
  id: 'circleReportPage',
  config: {
    events,
    effects,
    actions
  }
});
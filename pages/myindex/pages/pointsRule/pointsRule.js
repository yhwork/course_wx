import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../eea/index'
import {
  events,
  effects,
  actions
} from './pointsRule.eea'

class pointsRulePage extends EPage {
  get data() {
    return {
      list: null,
      totalIntegral: ''
    };
  }


  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        this.$api.mypage.getAllIntegralRule({}).then(
          (res) => {
            let errorCode = res.data.errorCode;
            if (errorCode == '0') {
              // this.setData({
              //   'list': res.data.result.list,
              //   'totalIntegral': res.data.result.totalIntegral
              // })
              console.log(res.data.result)
            }
          })



      },
      [PAGE_LIFE.ON_SHOW](option) {


      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {

     


    }
  }

  mapEffect() {
    return {
   


    }
  }
}

EApp.instance.register({
  type: pointsRulePage,
  id: 'pointsRulePage',
  config: {
    events,
    effects,
    actions
  }
});
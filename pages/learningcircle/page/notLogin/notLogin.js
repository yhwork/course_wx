import regeneratorRuntime from '../../../../lib/runtime'
import { EApp, EPage, PAGE_LIFE } from '../../../../eea/index'
import { events, effects, actions } from './notLogin.eea'

class notLoginPage extends EPage {
  get data() {
    return {
      currentTab:0,
      contents:[
        {
          tab: "她的创建",
          content:[
            {
              cicle_img: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2382031555,4280916635&fm=27&gp=0.jpg',
              title: '跟我学语文',
              content: '从零基础学英语',
              member: 30,
              clock_num: 50
            },
            {
              cicle_img: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2382031555,4280916635&fm=27&gp=0.jpg',
              title: '跟我学英语',
              content: '从零基础学英语',
              member: 30,
              clock_num: 50
            },
          ]
        },
        {
          tab: "她的收藏",
          content: [
            {
              cicle_img: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2382031555,4280916635&fm=27&gp=0.jpg',
              title: '跟我学英语',
              content: '从零基础学英语',
              member: 30,
              clock_num: 50
            },
            {
              cicle_img: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2382031555,4280916635&fm=27&gp=0.jpg',
              title: '跟我学英语',
              content: '从零基础学英语',
              member: 30,
              clock_num: 50
            },
          ]
        }
      ]
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        // this.setData({
        //   'model.communityId': option.id
        // })

      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      [events.ui.changeTab](e) {
        var idx=e.currentTarget.dataset.idx;
        this.setData({
          currentTab:idx
        })
      },
    }
  }

  mapEffect() {
    return {

    }
  }
}

EApp.instance.register({
  type: notLoginPage,
  id: 'notLoginPage',
  config: {
    events,
    effects,
    actions
  }
});
import regeneratorRuntime from '../../../../lib/runtime'
import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../../eea/index'
import {
  events,
  effects,
  actions
} from './circleList.eea'

const that = this;

class circleListPage extends EPage {
  get data() {
    return {
      // 列表类型 1我创建的学习圈 2精品圈子
      flag: null,
      circleList: null,
      circleListParam: {
        currentPage: 1,
        pageSize: 10
      }
    };
  }


  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        var flag = option.flag;
        this.setData({
          flag: flag
        })
        if(flag == 1){
          wx.setNavigationBarTitle({
            title: '我的圈子'
          })
          put(effects.LOAD_MY_CIRCLE_LIST);
        }
        if (flag == 2) {
          wx.setNavigationBarTitle({
            title: '精选圈子'
          })
          put(effects.LOAD_RECOMMEND_CIRCLE_LIST);
        }
      },
      [PAGE_LIFE.ON_SHOW](){
        if (this.data.flag == 1) {
          wx.setNavigationBarTitle({
            title: '我的圈子'
          })
          put(effects.LOAD_MY_CIRCLE_LIST);
        }
        if (this.data.flag == 2) {
          wx.setNavigationBarTitle({
            title: '精选圈子'
          })
          put(effects.LOAD_RECOMMEND_CIRCLE_LIST);
        }
      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      // 跳转圈子详情
      [events.ui.CIRCLE_INFO](e) {
        var flag = this.data.flag;
        wx.navigateTo({
          url: '../myCircle/myCircle?id=' + e.currentTarget.dataset.id
        })
      },
      // 翻页
      [events.ui.NEXT](e) {
        var flag = this.data.flag;
        this.setData({
          'circleListParam.currentPage': this.data.circleListParam.currentPage + 1
        });
        if (flag == 1) {
          put(effects.LOAD_MY_CIRCLE_LIST);
        }
        if (flag == 2) {
          put(effects.LOAD_RECOMMEND_CIRCLE_LIST);
        }
      },
    }
  }

  mapEffect() {
    return {
      [effects.LOAD_RECOMMEND_CIRCLE_LIST]() {
        this.$api.circle.recommendCommunity(this.data.circleListParam).then((res) => {
          let errorCode = res.data.errorCode;
          if (errorCode == '0') {
            setData(this, res);
          } else if (errorCode == '100006') {
            // 无数据
          } else {
            // 网络请求超时，请稍后再试
          }
        })
      },
      [effects.LOAD_MY_CIRCLE_LIST]() {
        this.$api.circle.getMyCommunityList(this.data.circleListParam).then((res) => {
          let errorCode = res.data.errorCode;
          if (errorCode == '0') {
            setData(this, res);
          } else if (errorCode == '100006') {
            // 无数据
          } else {
            // 网络请求超时，请稍后再试
          }
        });
      },
    }
  }
}

EApp.instance.register({
  type: circleListPage,
  id: 'circleListPage',
  config: {
    events,
    effects,
    actions
  }
});

// 封装数据
function setData(that, res) {
  var currentPage = that.data.circleListParam.currentPage; // 当前页码
  var list = res.data.result.learnList; // 圈子列表
  console.log(list)
  if(currentPage == 1){
    // 第一页
    that.setData({
      'circleList': list
    })
  }else{
    // 大于第一页
    if (that.data.circleList.length < res.data.result.count) {
      that.setData({
        'circleList': that.data.circleList.concat(list)
      })
    }
  }
  
  // 获取图片全路径
  for (var i = 0; i < that.data.circleList.length; i++) {
    var test = 'circleList[' + i + '].img';
    that.setData({
      [test]: that.$api.extparam.getFileUrl(that.data.circleList[i].headPic)
    })
  }
}
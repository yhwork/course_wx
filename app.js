// <<<<<<< Updated upstream
import {
  EApp,
  APP_LIFE
} from './eea/index'
import {
  Api,
  Storage,
  Child,
  Converter,
  Course,
  Image,
  Common
} from './services/index'

class MyApp extends EApp {
  mapAppEvent() {
    return {
      [APP_LIFE.ON_LAUNCH](options) {

        // this.$api.test();
        // wx.getStorage({
        //   key: 'selectChildId',
        //   success: function(res) {
        //     console.log(res)
        //     this.setData({
        //       childId:res.data
        //     })
        //     console.log("初始化小程序  获取 childI都")
        //     console.log(app.globalData.childId)
        //   },
        // })
      },
      // [PAGE_LIFE.ON_LOAD](options) {
      //   // this.$api.test();
      //   wx.getStorage({
      //     key: 'selectChildId',
      //     success: function (res) {
      //       console.log(res)
      //       this.setData({
      //         childId: res.data
      //       })
      //       console.log("初始化小程序  获取 childI都")
      //       console.log(app.globalData.childId)
      //     },
      //   })
      // },

    }
  }
}

const app = new MyApp();
// 配置全局变量
app.globalData = {
  childId: null,
  userId: null
}
// 全局方法
app.remove = function (arr) { //删除数组
  for (var i = 0; i < array.length; i++) {
    if (arr[i]) {
        arr.splice(i, 1);
    }
  }
}


// wx8cc819faddd66ace   正式版
// wx08f68831d02497ce   开发版

// 本地测试班

// app.use(Api, {
//   schema: 'http',
//   host: '192.168.1.105',
//   port: 8080
// }, {
//     client: '{"wap":"wap"}',
//     source: 'wxapp',
//     langCode: 'zh',
//     version: '1.0'
// });


// xdb.iforbao.com prod
// qa.xdb.iforbao.com dev
// 开发版   qa

// app.use(Api, {
//   schema: 'https',
//   host: 'qa.xdb.iforbao.com',
//   port: 80
// }, {
//     client: '{"wap":"wap"}',
//     source: 'wxapp',
//     langCode: 'zh',
//     version: '1.0'
//   });

// 正式版
console.log(app.globalData.childId)
app.use(Api, {
  schema: 'https',
  host: 'xdb.iforbao.com',
  port: 80
}, {
    client: '{"wap":"wap"}',
    source: 'wxapp',
    langCode: 'zh',
    version: '1.0'
  });


app.use(Child);
app.use(Storage);
app.use(Converter);
app.use(Course);
app.use(Image);
app.use(Common);
app.init();
// =======
// >>>>>>> Stashed changes

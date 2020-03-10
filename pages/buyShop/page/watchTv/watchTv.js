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
} from './watchTv.eea'
let tims= null;
class watchTv extends EPage {
  get data() {
    return {
      videoId:'',         // 播放视频的id
      orderNumber:'',     // 订单号
      controls:true,      // 进度条显示
      videoContext:'',    // 视频
      model:'',           // 播放的信息流
      number_time:null,   // 视频播放时间
      ispause:true,        // 暂停图标
      showcnt:true       // 显示控制
    };
  }

  mapPageEvent({ //生命周期方法  
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](options) { //获取参数
        console.log('值', options)
        if (options.hasOwnProperty('productId') && options.hasOwnProperty('orderNumber')){
          put(effects.getHotVideoList, options);    // 获取视频列表

        }else{
          
        }
        // // productId orderNumber
        // let videoId = options.videoId;
        // let orderNumber = options.orderNumber;
        // this.setData({
        //   videoId: videoId,
        //   orderNumber: orderNumber,
        //   controls: true
        // })
        // var time = null;
        // put(effects.getHotVideoDetails);
        // 获取进度
        
        // this.$api.circle.addVideoStar({
        //   orderNumber: this.data.orderNumber,
        //   videoId: this.data.videoId
        // }).then(res => {
        //   console.log('进度时间', res.data)
        // })
        
      },
      [PAGE_LIFE.ON_READY](option) {
        // if (!this.data.playindex) {
        //   this.setData({
        //     playindex: index
        //   })
        //   var videoContext = wx.createVideoContext('video0') //这里对应的视频id
        //   videoContext.pause()
        //   // 开始播放
        //   // videoContext.play()
        // } else {
        //   // 有播放先暂停   其他再执行当前的    

        //   if (this.data.playindex != index) {
        //     var videoContextPrev = wx.createVideoContext('video' + this.data.playindex)  // 获取视频的实例
        //     videoContextPrev.pause()
        //   }
        //   this.setData({
        //     playindex: index
        //   })
        // }
        // this.videoContext = wx.createVideoContext('myVideo')
        let videoContext = wx.createVideoContext('myVideo', this);
        this.setData({
          videoContext,
        });
        
      },
      [PAGE_LIFE.ON_SHOW](option) {

      },
      [PAGE_LIFE.ON_HIDE](e){
        console.log('页面消失')
        put(effects.addVideoTime);    // 记录时间
      },
      [PAGE_LIFE.ON_UNLOAD](){
        console.log('页面销毁');
        put(effects.addVideoTime);   // 记录时间
      }
    }
  }

  mapUIEvent({ //页面事件方法  
    put
  }) {
    return {
      [events.ui.videoTap](){
        // 开始播放
        if (this.data.ispause) { // 是否暂停
          this.setData({
            ispause:false
          })
          this.data.videoContext.play()
        } else {
          this.setData({
            ispause:true
          })
          this.data.videoContext.pause()
        }

        // this.data.videoContext.play()
      },
      // 视频播放
      [events.ui.playvideo](e){
        console.log('开始播放',e)
        this.setData({
          ispause: false
        })
        if (tims) { clearTimeout(tims) }
        tims = setTimeout(() => {
          this.setData({
            showcnt: false
          })
        
          console.log('隐藏按钮')
        }, 3500)
      },
      // 视频暂停
      [events.ui.pause_video](e) {
        console.log('视频暂停了', e);
        this.setData({
          ispause: true
        })
        if (tims) { clearTimeout(tims) }
        tims = setTimeout(() => {
          this.setData({
            showcnt: false
          })
        
          console.log('隐藏按钮')
        }, 3500)
        put(effects.getVideoStar)
      },
      // 视频区域
      [events.ui.btnvideo](e){
        // let videoContext = wx.createVideoContext('myVideo');  // 获取视频实例
        // function debounce(fn, delay) {
        //   console.log('asdasdas')
        //   // 记录上一次的延时器
        //   var timer = null;
        //   return function () {
        //     console.log('asdasdas')
        //     // 清除上一次延时器
        //     clearTimeout(timer)
        //     timer = setTimeout(function () {
        //       fn.apply(this)
        //     }, delay)
        //   }
        // }

        this.setData({
          showcnt: true
        })
        if (tims) { clearTimeout(tims)}
        tims= setTimeout(() => {
          this.setData({
            showcnt: false
          })
         
          console.log('隐藏按钮')
        }, 3500)
   
  

    
        // console.log('视频点击',e)
      },
      // 切换视频播放
      [events.ui.videlistacive](e){
          // 设置播放的 id // 与该产品的订单数
        let videoId = e.currentTarget.dataset.videoid;
        let orderNumber = this.data.orderNumber;
        put(effects.getHotVideoDetails, { videoId, orderNumber });
        // 暂停视频播放
        this.data.videoContext.pause()
        this.setData({
          showcnt:true
        })
      },
      // 监听视频进度
      [events.ui.onTimeUpdate](e){
       
        var time= e.detail.currentTime;    // 间隔阶段时间
        var alltime = e.detail.duration;  // 总时间
        // console.log('视频进度',time);
        if(time <= alltime){
            this.setData({
              number_time: time
            })
        }
      },
      // handleFullScreen
      // [events.ui.handleFullScreen](e) {
      //    let controls = e.detail.fullScreen;
      //    console.log('全屏',controls)
      //    this.setData({
      //     //  controls: !controls
      //       
      //    })
      // },
      [events.ui.endMovie](e) { //视频播放结束回调函数
        put(effects.addUserVideoCount);
      }
    }
  }

  mapEffect( {put} ) { //调接口 方法   存储方法方便调用
    return {
      // 获取视频列表
      [effects.getHotVideoList](obj){
        this.$api.circle.getHotVideoList({
          productId: obj.productId,
          orderNumber: obj.orderNumber
        }).then(async res => {
          if (res.data.errorCode == 0 && res.data.result) {
            let data = res.data.result;
            console.log('视频',data)
            this.setData({
              videoId: data.list[0].id,   // 默认第一天视频的id
              orderNumber: obj.orderNumber,
              videoList: data.list,
            })
            // 获取视频详情
            put(effects.getHotVideoDetails, { videoId: data.list[0].id, orderNumber: obj.orderNumber});
            // this.setData({
            //   title: data.info.title,
            //   subtitle: data.info.subtitle,
            //   lable: Object.values(JSON.parse(data.info.lable)),
            //   conentImg: Object.values(JSON.parse(data.info.imgVideo)),
            //   videoList: data.list,
            //   material: JSON.parse(data.info.material)
            // })

            console.log("videoList", data)
          }
        })
      },
      // 获取视频详情
      [effects.getHotVideoDetails](obj) {
        this.$api.circle.getHotVideoDetails({
          videoId: obj.videoId,
          orderNumber: obj.orderNumber
        }).then((res) => {
          if (res.data.errorCode == 0 && res.data.result) {
            var number_time = res.data.result.playTime;
            this.setData({
              model: res.data.result,
              number_time:parseInt(number_time)
            })
            console.log("video", res.data.result, number_time);
          }
        })
      },
      [effects.addUserVideoCount]() {
        this.$api.circle.addUserVideoCount({
          orderNumber: this.data.orderNumber,
          videoId: this.data.videoId
        }).then((res) => {
        })
      },
      // 存储播放时间
      [effects.addVideoTime](){
        console.log('播放时间',this.data.number_time);
        if (this.data.number_time == '' || this.data.number_time ==0 ){
          this.setData({
            number_time:0
          })
        }
        this.$api.circle.addVideoTime({
          orderNumber: this.data.orderNumber,
          videoId: this.data.videoId,
          time:this.data.number_time
        }).then(res=>{
          console.log('存储成果',res.data)
        })
      },
      // 继续进度播放
      [effects.getVideoStar](){
        console.log('继续播放时间')
        // this.$api.circle.getVideoStar({
        //   orderNumber: this.data.orderNumber,
        //   videoId: this.data.videoId
        // }).then(res => {
        //   console.log('进度时间', res.data)
        // })
       
      }
    }
  }
}

EApp.instance.register({
  type: watchTv,
  id: 'watchTv',
  config: {
    events,
    effects,
    actions
  }
});
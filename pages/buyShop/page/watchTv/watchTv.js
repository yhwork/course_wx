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


class watchTv extends EPage {
  get data() {
    return {
      videoId:'',
      orderNumber:'',
      controls:'',
      videoContext:'',
      model:'',
      number_time:null   // 视频播放
    };
  }

  mapPageEvent({ //生命周期方法  
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](options) { //获取参数
        let videoId = options.videoId;
        let orderNumber = options.orderNumber;
        this.setData({
          videoId: videoId,
          orderNumber: orderNumber,
          controls: true
        })
        var time = null;
        put(effects.getHotVideoDetails);
        // 获取进度
        
        // this.$api.circle.addVideoStar({
        //   orderNumber: this.data.orderNumber,
        //   videoId: this.data.videoId
        // }).then(res => {
        //   console.log('进度时间', res.data)
        // })
        
      },
      [PAGE_LIFE.ON_READY](option) {
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
      // 视频暂停
      [events.ui.pause_video](e){
        console.log('视频暂停了',e);
        // put(effects.addVideoTime)

        put(effects.getVideoStar)
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
      // 获取视频详情
      [effects.getHotVideoDetails]() {
        this.$api.circle.getHotVideoDetails({
          videoId: this.data.videoId,
          orderNumber: this.data.orderNumber
        }).then((res) => {
          if (res.data.errorCode == 0 && res.data.result) {
            var number_time = res.data.result.playTime;
            this.setData({
              model: res.data.result,
              number_time:parseInt(number_time)
            })
            console.log("秒", this.data.number_time);
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
        console.log('咋回事')
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
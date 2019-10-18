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
} from '../videoPlay/videoPlay.eea'
var videoContext = null;

class videoPlayPage extends EPage {
  get data() {
    return {
      show: true,
      notShow: false
    };
  }


  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        wx.hideNavigationBarLoading()
        let audioSrc = option.audioSrc;
        //播放路径
        this.setData({
          src: audioSrc
        });
        put(effects.PLAY);
      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      [events.ui.PLAY_END](e) {
        //当播放结束时跳回原页面
        wx.navigateBack({

        })
      },
      [events.ui.STOP_PLAY](){
        //当点击结束时跳回原页面
        wx.navigateBack({

        })
      }
    }
  }

  mapEffect() {
    return {
      [effects.PLAY]() {
        console.log("播放的上下文是啥")
        videoContext = wx.createVideoContext("myVideo");
        if (videoContext != "" && videoContext != null && typeof (videoContext)!="undefined"){
          videoContext.pause();
        }
        
        console.log("开始播放的上下文是啥")
        console.log(videoContext)
        //视频全屏
        async: videoContext.requestFullScreen({direction:0});
      },
    }
  }
}

EApp.instance.register({
  type: videoPlayPage,
  id: 'videoPlayPage',
  config: {
    events,
    effects,
    actions
  }
});
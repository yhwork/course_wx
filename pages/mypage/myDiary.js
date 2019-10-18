import regeneratorRuntime from '../../lib/runtime'
import {
  EApp,
  EPage,

  PAGE_LIFE
} from '../../eea/index'
import {
  events,
  effects,
  actions
} from './myDiary.eea'

const that = this;
const audioPlay = require("../../lib/audioPlay");
class myDiary extends EPage {
  get data() {
    return {
      selected: true,
      inputMap: {
        currentPage: 1,
        pageSize: 1000
      },
      diaryList: [],
      progress: 0
    };
  }


  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        console.log(option)
        this.setData({
          users: option.userId,
          userImg: option.userImg,
          userName: option.userName,
          idxs: 1000
        })
        put(effects.GETALL_CHILD_LIST)
        put(effects.GETALL_DIARY_LIST)
        this.setData({
          img: this.$api.extparam.getPageImgUrl('boyb'),
        })
      },
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      [events.ui.CHOOSE](e) {
        console.log(e.currentTarget.dataset.id, e.currentTarget.dataset.type)
        this.setData({
          idxs: e.currentTarget.dataset.index
        })
        if (e.currentTarget.dataset.type == '1') {
          
          this.setData({
            'inputMap.childId': e.currentTarget.dataset.id
          })
          console.log(this.data.inputMap)
        } else {
          this.setData({
            inputMap: {
              currentPage: 1,
              pageSize: 1000
            },
          })
        }
        put(effects.GETALL_DIARY_LIST)
      },
      [events.ui.AUDIO_PLAY](e) {
        for(let diary of this.data.diaryList){
          for (let item of diary.contentList){
            if (item.contentType == 3){
              item.play = false
            }
          }
        }
        this.setData({
          diaryList:this.data.diaryList
        })
        if (this.innerAudioContext != null && typeof (this.innerAudioContext != 'undefind')) {
          //播放当前语音时暂停其他语音线程
          this.innerAudioContext.pause();
        }
        console.log(e.currentTarget.dataset)
        let type = e.currentTarget.dataset.type;
        let idx = e.currentTarget.dataset.idx;
        let index = e.currentTarget.dataset.index;
        this.setData({
          idx: idx,
          index: index
        })
        console.log(idx,index)
        let audioId = ''
        if (type == 1) {
          audioId = 'diaryAudio' + idx
        }
        // console.log(audioId)
        this.innerAudioContext = wx.createAudioContext(audioId);
        this.innerAudioContext.play(); //开始播放   
        this.data.diaryList[idx].contentList[index].play = true;
        this.setData({
          diaryList: this.data.diaryList
        })
        console.log(this.data.diaryList[idx].contentList[index])
      },
      [events.ui.AUDIO_UPDATA_PROGRESS](e) {
        let idx = this.data.idx;
        let index = this.data.index;
        var offset = e.detail.currentTime;
        var currentTime = parseInt(e.detail.currentTime);
        var min = "0"+parseInt(currentTime / 60);
        var max = e.detail.duration;
        var lastTime = parseInt(max - offset);
        // console.log(max,offset,lastTime)
        var sec = currentTime % 60;
        if (sec < 10) {
          sec = "0" + sec;
        };
        var starttime = min + ':' + sec;
        var duration = e.detail.duration;
        var offset = parseInt(offset * 100 / duration);
        var that = this;
        this.data.diaryList[idx].contentList[index].audio_duration = starttime;
        this.data.diaryList[idx].contentList[index].offset = offset
        console.log(this.data.diaryList[idx].contentList[index].audio_duration)


        that.setData({
          diaryList: this.data.diaryList,
          // offset: currentTime,
          // starttime: starttime,
          max: max,
          // duration: duration
        })  
      },
      [events.ui.AUDIO_PLAY_END](e) {
        this.innerAudioContext.pause();
        let idx = this.data.idx;
        let index = this.data.index;
        this.data.diaryList[idx].contentList[index].play = false;
        this.data.diaryList[idx].contentList[index].audio_duration = '00:00';
        this.data.diaryList[idx].contentList[index].offset = 0;
        this.setData({
          diaryList: this.data.diaryList,
        })
      },
      [events.ui.AUDIO_STOP](e){
        this.innerAudioContext.pause();
        let idx = this.data.idx;
        let index = this.data.index;
        this.data.diaryList[idx].contentList[index].play = false;
        this.setData({
          diaryList: this.data.diaryList
        })
      },

      [events.ui.diaryMsg](e){
        wx:wx.navigateTo({
          url: '../learningcircle/page/diaryDetail/diaryDetail?id=' + e.currentTarget.dataset.id,
        })
      }











    }
  }

  mapEffect() {
    return {
      // 获取我的日记
      [effects.GETALL_DIARY_LIST]() {
        // console.log(this.data.inputMap)
        this.$api.circle.getMySignRecordList(this.data.inputMap).then(res => {
          console.log(res.data.result)

          this.setData({
            diaryList: res.data.result
          })
        })
      },
      // 获取孩子
      async [effects.GETALL_CHILD_LIST]() {
        this.$api.child.getChildListByCondition({}).then(res => {
          this.setData({
            childList: res.data.result.childList,
            theindex: res.data.result.childList.length
          })
          // console.log(res.data.result.childList)
        })
      }
    }
  }
}

EApp.instance.register({
  type: myDiary,
  id: 'myDiary',
  config: {
    events,
    effects,
    actions
  }
});
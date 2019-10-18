import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../eea/index'
import {
  events,
  effects,
  actions
} from './mine.eea'

const innerAudioContext = null; // 音频对象
class minePage extends EPage {
  get data() {
    return {
      possiblePersonParam: {
        page: 1,
        pageSize: 1000,
      },
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        console.log(option.visitId)
        this.setData({
          visitId: option.visitId,
          'possiblePersonParam.userId': option.visitId
        })
        this.setData({
          users: option.visitId,
          idx: 1000
        })

        this.$api.user.gerUserInfo({}).then( res => {
          console.log(res.data.result.id)
          this.setData({
            myId: res.data.result.id
          })
        })
        
      },
      [PAGE_LIFE.ON_SHOW]() {
        put(effects.ADDVISIT)
        put(effects.Load_MyPage_For_Parent);      
        // put(effects.loadUserInfo)
        put(effects.GETMYCIRCLE)
        
        put(effects.GETALL_DIARY_LIST)
      },
      //加载更多    
     
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      [events.ui.AUDIO_PLAY](e) {
        for (let diary of this.data.diaryList) {
          for (let item of diary.contentList) {
            if (item.contentType == 3) {
              item.play = false
            }
          }
        }
        this.setData({
          diaryList: this.data.diaryList
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
        console.log(idx, index)
        let audioId = ''
        if (type == 1) {
          audioId = 'diaryAudio' + idx
        }
        // console.log(audioId)
        this.innerAudioContext = wx.createAudioContext(audioId);
        this.innerAudioContext.play(); //开始播放   
        console.log(this.innerAudioContext.detail)
 
        this.data.diaryList[idx].contentList[index].play = true;
        this.setData({
          diaryList: this.data.diaryList
        })
        console.log(this.data.diaryList[idx].contentList[index])
      },
      [events.ui.AUDIO_UPDATA_PROGRESS](e) {
        var max = e.detail.duration;
        let idx = this.data.idx;
        let index = this.data.index;
        var offset = e.detail.currentTime;
        var currentTime = parseInt(e.detail.currentTime);
        var min = "0" + parseInt(currentTime / 60);
        console.log(max)
        console.log(e.currentTarget.dataset.len)

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
        // console.log(this.data.diaryList[idx].contentList[index].audio_duration)


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
      [events.ui.AUDIO_STOP](e) {
        this.innerAudioContext.pause();
        let idx = this.data.idx;
        let index = this.data.index;
        this.data.diaryList[idx].contentList[index].play = false;
        this.setData({
          diaryList: this.data.diaryList
        })
      },

      [events.ui.diaryMsg](e) {
        wx: wx.navigateTo({
          url: '../learningcircle/page/diaryDetail/diaryDetail?id=' + e.currentTarget.dataset.id,
        })
      },
      [events.ui.moreVISIT](){
        wx: wx.navigateTo({
          url: '../learningcircle/page/diaryDetail/diaryDetail?id=' + e.currentTarget.dataset.id,
        })
      },
      [events.ui.moreVISIT](){
        wx: wx.navigateTo({
          url: '../mypage/seen/seen?userId=' + this.data.visitId,
        })
      },
      // 头像点击跳转
      [events.ui.bindPhotoJump](e) {
        wx.navigateTo({
          // url: '../personalInfo/personalInfo'
          url: '../mypage/personalInfo/personalInfo'
        })
      },

     
    }
  }

  mapEffect({
    put
  }) {
    return {
      // 添加来访者
      [effects.ADDVISIT]() {
        // console.log(this.data.visitId, )
          let inputMap = {
            toUserId: this.data.visitId
          }
          // console.log(inputMap)
          this.$api.user.addVisitUser(inputMap).then(res => {
            console.log(res)
            put(effects.loadUserInfo)
          })
      },
      [effects.Load_MyPage_For_Parent]() {
        let inputMap = {
          toUserId: this.data.visitId
        }
        this.$api.mypage.loadMyPageForParent(inputMap).then(res => {
          this.setData({
            'fansNum': res.data.result.fansNum, 
            'followNum': res.data.result.followNum,          
            'userInfo': res.data.result.userInfo, 
          });
          console.log(this.data.userInfo)
        });
      },
      // 看过我的人
      [effects.loadUserInfo]() {
        this.$api.user.getVisitUser(this.data.possiblePersonParam).then((res) => {
          
          let errorCode = res.data.errorCode;
          if (errorCode == '0') {
            this.setData({
              seenList: res.data.result
            })
          } 
        });
      },
      // 获取圈子
      [effects.GETMYCIRCLE](){
        let inputMap = {
          currentPage: 1,
          pageSize: 1000,
          toUserId: this.data.visitId,

        }
        this.$api.circle.getMyCommunityList(inputMap).then(res => {
          // console.log(res.data.result)
          if (res.data.result){
            this.setData({
              circleList: res.data.result.learnList
            })
          }
          
          console.log(this.data.circleList)
        })
      },
     
      // 获取我的日记
      [effects.GETALL_DIARY_LIST]() {
        let inputMap = {
          currentPage: 1, 
          pageSize: 1000,
          toUserId:this.data.visitId
        }
        this.$api.circle.getMySignRecordList(inputMap).then(res => {
          // console.log(res.data.result)
          this.setData({
            diaryList: res.data.result
          })
        })
      },


    }
  }
}

EApp.instance.register({
  type: minePage,
  id: 'minePage',
  config: {
    events,
    effects,
    actions
  }
});
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
} from './themeDetail.eea'
const innerAudioContext = null; // 音频对象
const recorderManager = wx.getRecorderManager()
var timer;
var time = 600;

class themeDetailPage extends EPage {
  get data() {
    return {
      countDownTime: 600,
      currentTab: 0,
      iptHide: true,
      replyHide: true,
      isSpeaking: true, //正在说话
      startSpeak: false, //开始录音
      communitySubjectForPage: [],
      subjectSlidlst: [], //进度条
      commentList: {},
      play: false,
      text: '', //评论：文字回复
      replayAudioUrl: '', //评论：语音回复
      complaintFlag: true, //投诉隐藏
      ava: {
        currentPage: 1,
        pageSize: 10,
      }
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        console.log(option)
        this.setData({
          model: option,
        })
        console.log(this.data.model)
        put(effects.GET_SUBJECT_INFO);
      },
      [PAGE_LIFE.ON_SHOW]() {
        this.$storage.get('integral').then(
          (res) => {
            console.log(res.data)
            let integral = res.data
            console.log(integral)
            if (integral == 10) {
              wx.showToast({
                title: '+10积分',
                icon: 'none',
                duration: 1000,
                mask: true
              })
            }
          },
          (rej) => {}
        )
        this.$storage.clear();
      }

    }
  }

  mapUIEvent({
    put
  }) {
    return {
      [events.ui.AUDIO_PLAY](e) {
        //将页面上所有包含语音的数组play值全部换为false
        let communitySubjectForPage = this.data.communitySubjectForPage;
        for (let item of communitySubjectForPage) {
          if (item.contentType == 3) {
            item.play = false;
          }
        };
        this.setData({
          communitySubjectForPage: communitySubjectForPage,
        })
        if (this.innerAudioContext != null && typeof(this.innerAudioContext != 'undefind')) {
          //播放当前语音时暂停其他语音线程
          this.innerAudioContext.pause();
        }
        let idx = e.currentTarget.dataset.idx
        let audioId = '' //获取当前语音实例
        audioId = "diaryAudio" + idx
        this.innerAudioContext = wx.createAudioContext(audioId); // 创建音频实例 TODO实例化应该在赋值src之后才能保证当前实例下能取到总时长
        this.innerAudioContext.play(); //开始播放
        let play = e.currentTarget.dataset.play //获取当前播放状态
        if (!play) {
          this.data.communitySubjectForPage[idx].play = true
          this.setData({
            communitySubjectForPage: this.data.communitySubjectForPage
          })
        } else {
          this.data.communitySubjectForPage[idx].play = false
          this.setData({
            communitySubjectForPage: this.data.communitySubjectForPage
          })
        }
        this.setData({
          sliderId: this.data.communitySubjectForPage[idx].sliderId //存入当前进度条
        })
      },

      [events.ui.AUDIO_STOP](e) {
        this.innerAudioContext.pause(); //暂停
        let idx = e.currentTarget.dataset.idx //获取当前角标判断具体停止播放的语音
        let play = e.currentTarget.dataset.play //修改具体语音播放状态
        if (!play) {
          this.data.communitySubjectForPage[idx].play = true
          this.setData({
            communitySubjectForPage: this.data.communitySubjectForPage
          })
        } else {
          this.data.communitySubjectForPage[idx].play = false
          this.setData({
            communitySubjectForPage: this.data.communitySubjectForPage
          })
        }
      },

      async [events.ui.AUDIO_UPDATA_PROGRESS](e) {
        var that = this;
        var idx = this.data.sliderId; //获取当前进度条
        var duration = e.detail.duration; //总时长
        var offset = e.detail.currentTime; //当前播放时长
        var lastTime = parseInt(duration - offset);
        var min = "0" + parseInt(lastTime / 60);
        var max = parseInt(e.detail.duration);
        var sec = lastTime % 60;
        if (sec < 10) {
          sec = "0" + sec;
        };
        that.data.subjectSlidlst[idx].offset = offset;
        that.data.subjectSlidlst[idx].max = max;
        that.data.subjectSlidlst[idx].audio_duration = min + ':' + sec /* 00:00 */ ;
        that.setData({
          subjectSlidlst: that.data.subjectSlidlst
        })
      },

      [events.ui.AUDIO_PLAY_END](e) {
        var that = this;
        var idx = this.data.sliderId; //获取当前进度条
        //获取音频状态
        let myidx = that.data.subjectSlidlst[idx].id
        that.data.communitySubjectForPage[myidx].play = false
        that.data.subjectSlidlst[idx].offset = 0;
        that.data.subjectSlidlst[idx].audio_duration = '00:00';
        that.setData({
          subjectSlidlst: that.data.subjectSlidlst,
          communitySubjectForPage: that.data.communitySubjectForPage,
        })
      },
    }
  }

  mapEffect({
    put
  }) {
    return {
      [effects.GET_SUBJECT_INFO]() {
        console.log("调用接口执行了")

        this.$api.circle.getSubjectInfo(this.data.model).then((res) => {

          let errorCode = res.data.errorCode;
          console.log(res.data.result)
          if (errorCode == 0) {
            this.setData({
              communityHeadImg: res.data.result.picture,
              communityName: res.data.result.title,
              startDate: res.data.result.signinStartDate,
              endDate: res.data.result.signinEndDate,
              SdateSelect: true,
              EdateSelect: true,
              title: res.data.result.title
            });
            if (res.data.result.contentList != null) {
              if (res.data.result.contentList.length != 0) {
                this.setData({
                  communitySubjectForPage: res.data.result.contentList,
                  subjectSlidlst: res.data.result.audio,
                })
              }
            }
            console.log(res.data.result)
            this.setData({
              info: res.data.result
            })
          }
        });
      }

    }
  }
}

EApp.instance.register({
  type: themeDetailPage,
  id: 'themeDetailPage',
  config: {
    events,
    effects,
    actions
  }
});
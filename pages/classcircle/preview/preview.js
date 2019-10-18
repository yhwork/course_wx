// classPage
import regeneratorRuntime from '../../../lib/runtime'
import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../eea/index'
import {
  events,
  effects,
  actions
} from './preview.eea'
class previewPage extends EPage {
  get data() {
    return {
      workId: '',
      playvideo: true,
      idx:'',
      workInfor:[],
      receiptType: [{
        type: '同意/不同意',
        id: 1,
      }, {
        type: '已阅',
        id: 2,
      }, {
        type: '参加/不参加',
        id: 3,
      }, {
        type: '信息回执',
        id: 4,
      }],
      playvideo: true,
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        console.log(option)
        if (option.type==1){
          this.setData({
            userId: option.userId,          
          })
          wx.setNavigationBarTitle({
            title: '班级作业预览',
          })
        }else if(option.type == 0){
          wx.setNavigationBarTitle({
            title: '班级通知预览',
          })
        } else if (option.type == 2) {
          wx.setNavigationBarTitle({
            title: '班级相册预览',
          })
        }
        this.setData({
          type: option.type,
          classId: option.classId
        })
        put(effects.GETWORKMSG)

      },
      [PAGE_LIFE.ON_SHOW](option) {
        let that = this
        wx.getSystemInfo({
          success: function (res) {
            let width = res.screenWidth * 2 - 160
            that.setData({
              'width': width / 2,
              'widths': res.screenWidth,
              'heights': res.screenHeight,
            })
            console.log(that.data.width)
          },
        })
      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      // 播放视频
      [events.ui.PLAYVIDEO](e) {
        console.log(e)
        let src = e.currentTarget.dataset.src
        this.setData({
          playvideo: false,
          'videoSrc': src
        })
      },
      [events.ui.overVIDEO](e) {
        console.log(e)
        this.setData({
          playvideo: true,
          'videoSrc': ''
        })
      },
      [events.ui.close_video](){
        this.setData({
          playvideo: true,
          videoSrc: ''
        })
      },
      // 预览图片
      [events.ui.PREVIEWIMAGE](e) {
        let src = e.currentTarget.dataset.src;
        var srclist = []
        console.log(this.data.workInfor.contentList)
        for (let item of this.data.workInfor.contentList) {
          if (item.contentType == 2) {
            srclist.push(item.content)
          }
        }
        console.log(srclist)
        wx.previewImage({
          current: src,
          urls: srclist,
        })

      },
      [events.ui.AUDIO_PLAY](e) {
        console.log(e)
        var aindex = e.target.dataset.idx
        console.log(aindex)
        this.setData({
          aindex: aindex
        })
        this.data.workInfor.contentList[aindex].play = true;
        this.setData({
          workInfor: this.data.workInfor
        })
        console.log(this.data.workInfor.contentList[aindex])
        let audioSrc = 'subjectAudio'

        this.innerAudioContext = wx.createAudioContext(audioSrc); // 创建音频实例 TODO实例化应该在赋值src之后才能保证当前实例下能取到总时长
        console.log(this.innerAudioContext)
        this.innerAudioContext.play();
      },
      [events.ui.AUDIO_PLAY_END]() {
        var aindex = this.data.aindex
        this.data.workInfor.contentList[aindex].play = false;
        this.setData({
          workInfor: this.data.workInfor
        })
      },
      [events.ui.AUDIO_UPDATA_PROGRESS](e) {
        var aindex = this.data.aindex
        let duration = e.detail.duration
        console.log(duration)
        let currentTime = e.detail.currentTime
        console.log(e.detail)
        var lastTime = Math.abs(parseInt(duration - currentTime));
        var sec = lastTime % 60;
        var min = "0" + parseInt(lastTime / 60);
        if (sec < 10) {
          sec = "0" + sec;
        };
        this.data.workInfor.contentList[aindex].audio_duration = min + ':' + sec
        this.setData({
          workInfor: this.data.workInfor
        })
      },
      [events.ui.AUDIO_STOP]() {
        var aindex = this.data.aindex
        this.data.workInfor.contentList[aindex].play = false;
        this.setData({
          workInfor: this.data.workInfor
        })
        this.innerAudioContext.pause();
      },
      // 发布
      [events.ui.SUBMIT]() {
        if(this.data.type==0){
          put(effects.addClassNotify)
        } else if (this.data.type == 1){
          put(effects.createHOMEWORK)
        }else if(this.data.type == 2){
          put(effects.create_ClassDynamic)
        }
       
      },
      [events.ui.CANCEL_CHOOSE_RECEIPT](){
        wx.redirectTo({
          url: '../classMsg/classMsg?classId=' + this.data.classId,
        })
      }
    }
  }

  mapEffect({
    put
  }) {
    return {
      [effects.GETWORKMSG]() {
        let that = this
        this.$storage.get('previewMsg').then( res => {
          that.setData({
            workInfor:res.data
          })
          console.log(this.data.workInfor)
          put(effects.getCLASSLIST)

        })
        this.$storage.get('submitMsg').then(res => {
          that.setData({
            model: res.data
          })
        })
      },
      [effects.getCLASSLIST]() {
        let inputMap = {
          teacherId: this.data.userId
        }
        this.$api.class.getClassList(inputMap).then((res) => {
          console.log(res.data.result)
          if (res.data.errorCode == '0') {
            this.setData({
              'classList': res.data.result,
            })
            console.log(this.data.classList)
            let calssid = this.data.workInfor.classIds.split(',')
            console.log(calssid)
            let classname = []
            this.data.classList.forEach( item => {
              calssid.forEach( item1 => {
                if (item1 == item.classId){
                  console.log(item.classId)
                  classname.push(item)
                }
              })
            })
            this.setData({
              'classname': classname
            })
            console.log(this.data.classname)
          } else if (res.data.errorCode == 100006) {
           
          }
        });
      },
      // 发布通知
      [effects.addClassNotify]() {
        let inputMap = this.data.model
        console.log(inputMap)
        this.$api.class.addClassNotify(inputMap).then(res => {
          console.log(res.data)
          if (res.data.errorCode == 0) {
            if (res.data.result.integral != 0) {
              wx.showToast({
                title: '+' + res.data.result.integral + '积分',
                icon: 'none',
                duration: 1000,
                mask: true
              })
            }
            wx.setStorageSync('idx', this.data.type)
            wx.navigateBack({
              delta: 3
            })
          }
        })
      },
      // 发布作业
      [effects.createHOMEWORK]() {
        let inputMap = this.data.model
        console.log(inputMap)
        // return;
        this.$api.class.addClassWork(inputMap).then(res => {
          // console.log(res.data)
          if (res.data.errorCode == 0) {
            if (res.data.result.integral != 0) {
              wx.showToast({
                title: '+' + res.data.result.integral + '积分',
                icon: 'none',
                duration: 1000,
                mask: true
              })
            }
            wx.setStorageSync('idx', this.data.type)
            wx.navigateBack({
              delta:2
            })
          } else {
            this.$common.showMessage(this, '添加班级作业失败')
          }
        })
      },
      // 发布班级动态
      [effects.create_ClassDynamic]() {
        let inputMap = this.data.model
        this.$api.class.addClassDynamic(inputMap).then(res => {
          console.log(res.data)
          if (res.data.errorCode == 0) {
            if (res.data.result.integral != 0) {
              wx.showToast({
                title: '+' + res.data.result.integral + '积分',
                icon: 'none',
                duration: 1000,
                mask: true
              })
            }
            wx.setStorageSync('idx', this.data.type)
            wx.navigateBack({ delta: 2})
          } else {
            this.$common.showMessage(this, '添加班级相册失败')
          }
        })
      },
    }
  }
}

EApp.instance.register({
  type: previewPage,
  id: 'previewPage',
  config: {
    events,
    effects,
    actions
  }
});
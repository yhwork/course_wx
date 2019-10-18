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
} from './workMsg.eea'

const innerAudioContext = null; // 音频对象
const base64 = require('../../../lib/base64')
const recorderManager = wx.getRecorderManager()
var timer;
var time = 600;

class workMsg extends EPage {
  get data() {
    return {
      workId: '',
      isok:true,
      playvideo: true,
      iptHide: true,
      isSpeaking: true,
      DELvoice: true,
      audioUrl: '',
      contentSize: '',
      commentFocus: false,
      receiptList: [
        [{
          type: '同意',
          num: 0,
          id: 1,
        }, {
          type: '不同意',
          num: 0,
          id: 0,
        }, {
          type: '未回执',
          num: 0
        }],
        [{
          type: '已阅',
          num: 0,
          id: 1,
        }, {
          type: '未阅',
          num: 0,
          id: 0,
        }, {
          type: '未回执',
          num: 0
        }],
        [{
          type: '参加',
          num: 0,
          id: 1,
        }, {
          type: '不参加',
          num: 0,
          id: 0,
        }, {
          type: '未回执',
          num: 0
        }],
        [{
          type: '信息回执',
          num: 0
        }, {
          type: '未回执',
          num: 0
        }]
      ],
      bindindex: 0,
      showchild: true,
      ischildsubmitwork: 0
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        console.log('消息详情页', option)
        var state_id = option.state_id
        let inputMap = {    
          isok: true,
          id: option.state_id
        }
        if ( state_id != undefined) {
          // console.log("update", state_id != undefined, state_id != '')
          this.$api.class.updateClassUnreadMessageInfo(inputMap).then(res => {
            // console.log("update",res)
          })
        }
        this.setData({
          workId: option.id,
          type: option.type, //是那种类型（作业、通知……）
          img: this.$api.extparam.getPageImgUrl('boyb'),
          classId: option.classId,
          'role': option.role,
          state_id: option.state_id
        })
        put(effects.USERINFO)
        this.setData({
          'mbwidth': wx.getSystemInfoSync().windowWidth,
          'mbheight': wx.getSystemInfoSync().windowHeight
        })
        if (this.data.type == 1) {
          wx.setNavigationBarTitle({
            title: '班级作业详情',
          })
          this.setData({
            ischildsubmitwork: 1
          })
        } else if (this.data.type == 0) {
          wx.setNavigationBarTitle({
            title: '班级通知详情',
          })
        } else if (this.data.type == 2) {
          this.setData({
            ischildsubmitwork: 1
          })
          wx.setNavigationBarTitle({
            title: '班级相册详情',
          })
        }
        wx.getSystemInfo({
          success: function(res) {
            // console.log(res.system.split(' ')[0])
          },
        })
        this.setData({
          'first': this.$api.extparam.getPageImgUrl('first'),
          'second': this.$api.extparam.getPageImgUrl('second'),
          'third': this.$api.extparam.getPageImgUrl('third'),
        })
      },
      [PAGE_LIFE.ON_SHOW](option) {
        let that = this
        isok: true,
        wx.getSystemInfo({
          success: function(res) {
            let width = res.screenWidth * 2 - 145
            that.setData({
              'width': width / 2,
              'widths': res.screenWidth,
              'heights': res.screenHeight,
              isok: true,
            })
          },
        })
        if (that.data.role == 0) {
          wx.getStorage({
            key: 'childId',
            success: function(res) {
              // console.log(res)
              that.setData({
                'childId': res.data
              })
              if (that.data.type == 1) {
                put(effects.GETWORKMSG)
              }
              if (that.data.type == 0) {
                put(effects.GET_NOTIFY)
              }
              if (that.data.type == 2) {
                put(effects.GET_DYNAMIC)
              }
            },
          })
        } else {
          if (that.data.type == 1) {
            put(effects.GETWORKMSG)
          }
          if (that.data.type == 0) {
            put(effects.GET_NOTIFY)
          }
          if (that.data.type == 2) {
            put(effects.GET_DYNAMIC)
          }
        }
        wx.removeStorageSync('previewMsg')
        wx.removeStorageSync('submitMsg')
      },
      [PAGE_LIFE.ON_PULL_DOWN_REFRESH](option) {
        if (this.data.type == 0) {
          put(effects.GET_NOTIFY)
        } else if (this.data.type == 1) {
          put(effects.GETWORKMSG)
        } else if (this.data.type == 2) {
          // 动态
        }
        setTimeout(function() {
          wx.stopPullDownRefresh();
          wx: wx.hideLoading();
        }, 1000)
      },
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      // 播放视频
      [events.ui.PLAYVIDEO](e) {
        let src = e.currentTarget.dataset.src
        this.setData({
          playvideo: false,
          'videoSrc': src
        })
      },
      [events.ui.overVIDEO](e) {
        this.setData({
          playvideo: true,
          'videoSrc': '',
          text: '',
          replayAudioUrl: ''
        })
      },
      [events.ui.close_video]() {
        this.setData({
          playvideo: true,
          videoSrc: ''
        })
      },

      // 预览图片
      [events.ui.PREVIEWIMAGE](e) {
        let src = e.currentTarget.dataset.src;
        this.setData({
          'clicktype': e.currentTarget.dataset.clicktype
        })
        var contentList = []
        if (e.currentTarget.dataset.clicktype == 1) {
          contentList = this.data.workInfor.contentList
        } else if (e.currentTarget.dataset.clicktype == 2) {
          var workindex = e.currentTarget.dataset.workindex
          var idx = e.currentTarget.dataset.idx
          contentList = this.data.childWorkList[workindex].contentList
        }
        var srclist = []
        for (let item of contentList) {
          if (item.contentType == 2) {
            
            srclist.push(item.content.replace('!test', ''))
          }
        }
        
        var srcs = src.replace('!test','');
        console.log('预览图片你的地址', srcs, srclist)
        wx.previewImage({
          current: srcs,
          urls: srclist,
        })
      },

      [events.ui.AUDIO_PLAY](e) {
        // console.log(e.currentTarget.dataset)
        if (this.data.type != 2) {
          this.data.workInfor.contentList.forEach(item => {
            if (item.contentType == 3) {
              item.play = false
            }
          })
          this.setData({
            workInfor: this.data.workInfor,
          })
        }
        // console.log(this.data.childWorkList)
        this.data.childWorkList.forEach(list => {
          list.contentList.forEach(item => {
            if (item.contentType == 3) {
              item.play = false
            }
          })
          if (list.workCommentList) {
            list.workCommentList.forEach(item => {
              if (item.audioUrl) {
                item.play = 'false'
              }
            })
          }

        })
        if (this.innerAudioContext != null && typeof(this.innerAudioContext != 'undefind')) {
          //播放当前语音时暂停其他语音线程
          this.innerAudioContext.pause();
        }
        this.setData({
          childWorkList: this.data.childWorkList
        })
        var idx = e.currentTarget.dataset.idx
        this.setData({
          'clicktype': e.currentTarget.dataset.clicktype
        })
        // console.log(e.currentTarget.dataset.clicktype)
        this.setData({
          idx: idx
        })
        // console.log(this.data)
        if (e.currentTarget.dataset.clicktype == 1) {
          this.data.workInfor.contentList[idx].play = true;
          this.setData({
            workInfor: this.data.workInfor
          })
          // console.log(this.data.workInfor.contentList[idx])
          var audioSrc = 'subjectAudio'
        } else if (e.currentTarget.dataset.clicktype == 2) {
          var workindex = e.currentTarget.dataset.workindex
          this.setData({
            'workindex': workindex,
          })
          var audioSrc = workindex + 'workAudio' + idx
          this.data.childWorkList[workindex].contentList[idx].play = true;
          this.setData({
            childWorkList: this.data.childWorkList
          })
        } else if (e.currentTarget.dataset.clicktype == 3) {
          var workindex = e.currentTarget.dataset.workindex
          this.setData({
            'workindex': workindex,
          })
          var audioSrc = workindex + 'subjectAudio' + idx
          this.data.childWorkList[workindex].workCommentList[idx].play = 'true';
          this.setData({
            childWorkList: this.data.childWorkList
          })
        }
        this.innerAudioContext = wx.createAudioContext(audioSrc); // 创建音频实例 TODO实例化应该在赋值src之后才能保证当前实例下能取到总时长
        // console.log(this.innerAudioContext)
        this.innerAudioContext.play();
      },
      [events.ui.AUDIO_PLAY_END]() {
        var clicktype = this.data.clicktype
        var idx = this.data.idx
        var workindex = this.data.workindex
        if (clicktype == 1) {
          this.data.workInfor.contentList[idx].play = false;
          this.setData({
            workInfor: this.data.workInfor
          })
        } else if (clicktype == 2) {
          this.data.childWorkList[workindex].contentList[idx].play = false;
          this.setData({
            childWorkList: this.data.childWorkList
          })
        } else if (clicktype == 3) {
          this.data.childWorkList[workindex].workCommentList[idx].play = 'false';
          this.setData({
            childWorkList: this.data.childWorkList
          })
        }
      },
      [events.ui.AUDIO_UPDATA_PROGRESS](e) {
        var clicktype = this.data.clicktype
        var idx = this.data.idx
        var workindex = this.data.workindex
        let duration = e.detail.duration
        // console.log(duration)
        let currentTime = e.detail.currentTime
        // console.log(e.detail)
        var lastTime = Math.abs(parseInt(duration - currentTime));
        var sec = lastTime % 60;
        var min = "0" + parseInt(lastTime / 60);
        if (sec < 10) {
          sec = "0" + sec;
        };
        if (clicktype == 1) {
          this.data.workInfor.contentList[idx].audio_duration = min + ':' + sec
          this.setData({
            workInfor: this.data.workInfor
          })
        } else if (clicktype == 2) {
          this.data.childWorkList[workindex].contentList[idx].audio_duration = min + ':' + sec;
          this.setData({
            childWorkList: this.data.childWorkList
          })
        } else if (clicktype == 3) {
          this.data.childWorkList[workindex].workCommentList[idx].audio_duration = min + ':' + sec;
          this.setData({
            childWorkList: this.data.childWorkList
          })
        }
      },
      [events.ui.AUDIO_STOP]() {
        var clicktype = this.data.clicktype
        var idx = this.data.idx
        var workindex = this.data.workindex

        if (clicktype == 1) {
          this.data.workInfor.contentList[idx].play = false;
          this.setData({
            workInfor: this.data.workInfor
          })
        } else if (clicktype == 2) {
          this.data.childWorkList[workindex].contentList[idx].play = false;
          this.setData({
            childWorkList: this.data.childWorkList
          })
        } else if (clicktype == 3) {
          this.data.childWorkList[workindex].workCommentList[idx].play = 'false';
          this.setData({
            childWorkList: this.data.childWorkList
          })
        }
        this.innerAudioContext.pause();
      },
      // 作业内容回复
      [events.ui.SUBMITWORK](e) {
        // console.log(e)
        this.setData({
          'formId': e.detail.formId
        })
        put(effects.ADDFOEMID)
        wx.navigateTo({
          url: '../addPeport/addPeport?workId=' + this.data.workId + '&type=' + this.data.type + '&role=' + this.data.role,
        })
      },
      // 评论
      [events.ui.ADDCOMMENT](e) {
        // console.log(e.currentTarget.dataset)
        this.setData({
          iptHide: false,
          'commenttype': e.currentTarget.dataset.commenttype,
          commentFocus: true,
          text: ''
        })
        if (this.data.type == 2) {
          this.setData({
            classDynamicId: e.currentTarget.dataset.id,
          })
        } else {
          this.setData({
            childWorkId: e.currentTarget.dataset.childworkid,
          })
        }
      },
      // 回复
      [events.ui.ADDREPLY](e) {
        // console.log(e.currentTarget.dataset)
        this.setData({
          iptHide: false,
          'commenttype': e.currentTarget.dataset.commenttype,
          commentFocus: true,
          text: '',
          toRole: e.currentTarget.dataset.role,
        })
        this.setData({
          'toUserId': e.currentTarget.dataset.touserid,
        })
        if (e.currentTarget.dataset.commenttype == 1) {
          if (this.data.type == 1) {
            this.setData({
              childWorkCommentId: e.currentTarget.dataset.childworkcommentid,
            })
          } else if (this.data.type == 2) {
            this.setData({
              classDynamicCommentId: e.currentTarget.dataset.childworkcommentid,
            })
          }
        } else {
          if (this.data.type == 1) {
            this.setData({
              childWorkCommentId: e.currentTarget.dataset.childworkcommentid,
              'replyId': e.currentTarget.dataset.replyid,
            })
          } else if (this.data.type == 2) {
            this.setData({
              classDynamicCommentId: e.currentTarget.dataset.childworkcommentid,
              'replyId': e.currentTarget.dataset.replyid,
            })
          }
        }
      },
      //隐藏评论，回复，语音等框
      [events.ui.hedeReply](e) {
        // console.log("影藏弹层");
        let type = e.currentTarget.dataset.type;
        if (type == 1) {
          this.setData({
            iptHide: true
          })
        } else if (type == 2) {
          this.setData({
            replyHide: true
          })
        } else {
          this.setData({
            isSpeaking: true
          })
        }
      },
      [events.ui.GETFOCUS](e) {
        // console.log('GETFOCUS')
        let type = e.currentTarget.dataset.type;
        this.setData({
          commentFocus: true
        })
      },
      [events.ui.TURNBACK](e) {
        //删除已经录好的语音
        // console.log('删除录音')
        this.setData({
          audioUrl: "",
          iptHide: true,
          isSpeaking: true,
          DELvoice: true
        })
      },
      async [events.ui.SEND_MESSAGE](e) {
        // console.log('------------')
        let type = this.data.replayType
        let _this = this;
        this.setData({
          iptHide: true,
          isSpeaking: true,
          DELvoice: true
        })
        if (this.data.text == "" || this.data.text == null || typeof(this.data.text) == "undefind") {
          if (this.data.replayAudioUrl == "" || this.data.replayAudioUrl == null || typeof(this.data.replayAudioUrl) == "undefind") {
            this.$common.showMessage(this, '内容不能为空');
            return
          }
        } else {
          if (this.data.text == "" || this.data.text == null || typeof(this.data.text) == "undefind") {
            this.$common.showMessage(this, '内容不能为空');
            return
          }
        }
        // console.log(this.data)
        if (this.data.commenttype == 0) {
          put(effects.SENDcomment)
        } else {
          put(effects.SENDreplay)
        }
      },
      [events.ui.START_TEXT](e) {
        // console.log(e.detail.value)
        this.setData({
          text: e.detail.value
        })
      },
      // 打开录音
      [events.ui.SET_AUDIO](e) {
        wx.setKeepScreenOn({
          keepScreenOn: true,
        })
        //调用dom  1 圈主介绍  2 圈子介绍
        let type = e.currentTarget.dataset.type;
        // console.log('录音------------', this.data.isSpeaking)
        this.setData({
          // DELvoice:false,
          isSpeaking: false,
          text: ""
        })
        // console.log(this.data.isSpeaking)
      },
      //录音开始 
      [events.ui.START_AUDIO](e) {
        wx.setKeepScreenOn({
          keepScreenOn: true,
        })
        const recorderConfig = {
          duration: 600000,
          sampleRate: 44100,
          numberOfChannels: 1,
          encodeBitRate: 192000,
          format: 'mp3',
          frameSize: 50
        }
        //开始录音
        recorderManager.start(recorderConfig)
        recorderManager.onStart(() => {
          // console.log('开始录音')
        });
        recorderManager.onError((res) => {
          // console.log(res);
        })
        this.setData({
          startSpeak: true
        })

        let that = this;
        if (this.data.startSpeak) {
          timer = setInterval(function() {
            time--;
            that.setData({
              countDownTime: time,
              contentSize: 600 - time
            })
            if (that.data.countDownTime <= 0) {
              clearInterval(timer)
              that.setData({
                startSpeak: false,
                isSpeaking: true
              })
            }
          }, 1000)
        }
      },
      //录音结束
      [events.ui.STOP_AUDIO](e) {
        //调用dom  1 圈主介绍  2 圈子介绍
        let replayType = this.data.replayType;
        recorderManager.stop();
        recorderManager.onStop((res) => {
          clearInterval(timer);
          this.setData({
            countDownTime: 600,
          })
          time = 600;
          this.$api.upload.upload(res.tempFilePath).then(res => {
            // console.log(res.key)
            this.setData({
              replayAudioUrl: this.$api.extparam.getVedioUrl(res.key),
            })
            this.setData({
              DELvoice: false,
            })
          });
          this.setData({
            isSpeaking: true,
            startSpeak: false,
            countDownTime: 600
          })
          if (replayType == 1) {
            this.setData({
              replyHide: false
            })
          } else {
            this.setData({
              iptHide: false
            })
          }
        })
      },
      // 家长删除孩子的作业
      [events.ui.CHILD_DEL](e) {
        let inputMap = {
          id: e.currentTarget.dataset.id
        }
        wx.showModal({
          title: '提示',
          content: '确定删除作业吗？',
          confirmColor: '#f29219',
          success: res => {
            if (res.confirm) {
              put(effects.CHILD_DEL_WORK, {
                inputMap
              })
            }
          }
        })

      },
      // 家长删除孩子的评论
      [events.ui.CHILD_DEL_COMMENT_REPLAY](e) {
        let inputMap = {
          id: e.currentTarget.dataset.id,
          flag: e.currentTarget.dataset.flag,
        }
        // console.log(inputMap)
        wx.showModal({
          title: '提示',
          content: '确定删除评论吗？',
          confirmColor: '#f29219',
          success: res => {
            if (res.confirm) {
              put(effects.CHILD_DEL_COMMENT_REPLAY_WORK, {
                inputMap
              })
            }
          }
        })

      },
      // 作业点赞
      [events.ui.ADDLIKE](e) {
        var inputMap = {}
        if (this.data.type == 1) {
          if (this.data.userinfo.role == 0) {
            inputMap = {
              childWorkId: e.currentTarget.dataset.childworkid,
              childId: this.data.childId
            }
          } else {
            inputMap = {
              childWorkId: e.currentTarget.dataset.childworkid,
            }
          }
          this.$api.class.addChildWorkLike(inputMap).then(res => {
            // console.log(res.data)
            if (res.data.errorCode == 0) {
              put(effects.GETWORKMSG)
              if (res.data.result.integral != 0) {
                wx.showToast({
                  title: '+' + res.data.result.integral + '积分',
                  icon: 'none',
                  duration: 1000,
                  mask: true
                })
              }
            }
          })
        } else if (this.data.type == 2) {
          if (this.data.userinfo.role == 0) {
            inputMap = {
              classDynamicId: e.currentTarget.dataset.id,
              childId: this.data.childId
            }
          } else {
            inputMap = {
              classDynamicId: e.currentTarget.dataset.id,
            }
          }
          this.$api.class.addClassDynamicLike(inputMap).then(res => {
            // console.log(res.data)
            if (res.data.errorCode == 0) {
              put(effects.GET_DYNAMIC)
            }
          })
        }
      },
      // 选择回执
      [events.ui.CHOOSE_RECEIPT](e) {
        // console.log(e.detail.value)
        this.setData({
          'choosereceipt': e.detail.value
        })
        // console.log(this.data.choosereceipt)
      },
      [events.ui.SUBMIT_RECEIPT](e) {
        this.setData({
          'formId': e.detail.formId
        })
        put(effects.ADDFOEMID)
        // console.log(this.data.choosereceipt)
        if (typeof this.data.choosereceipt == 'undefined') {
          this.$common.showMessage(this, '请选择回执')
          return
        }
        wx.showModal({
          title: '提示',
          content: '回执提交后不能修改，是否确认？',
          confirmColor: '#f29219',
          success: res => {
            if (res.confirm) {
              put(effects.RECEIPTSUBMIT)
            }
          }
        })

      },
      // 信息回执
      [events.ui.GO_MSG_RECEIPT](e) {
        this.setData({
          'formId': e.detail.formId
        })
        put(effects.ADDFOEMID)
        wx.navigateTo({
          url: '../addPeport/addPeport?workId=' + this.data.workId + '&type=' + this.data.type + '&role=' + this.data.userinfo.role,
        })
      },
      // 点击切换
      [events.ui.CLICKTAB](e) {
        if (this.data.type == 0) {
          var list = this.data.workInfor.receipt
          var nav = 'workInfor.receipt[' + e.currentTarget.dataset.bindindex + '].clicktab'
        } else if (this.data.type == 1) {
          var list = this.data.workInfor.workinfo
          var nav = 'workInfor.workinfo[' + e.currentTarget.dataset.bindindex + '].clicktab'
        }
        list.forEach(item => {
          item.clicktab = false
        })
        this.setData({
          workInfor: this.data.workInfor,
          [nav]: true,
          bindindex: e.currentTarget.dataset.bindindex,
        })
        // console.log(this.data.bindindex)
        if (this.data.type == 0 && this.data.workInfor.receiptType != 4) {
          // 通知
          if (this.data.bindindex == 0) {
            this.setData({
              submitList: this.data.notifyReply
            })
          } else if (this.data.bindindex == 1) {
            this.setData({
              submitList: this.data.notifyReplyByNo
            })
          } else {
            this.setData({
              submitList: this.data.noNotifyReplyChildList
            })
          }
        } else { //作业或信息回执
          if (this.data.bindindex == 0) {
            this.setData({
              submitList: []
            })
          } else if (this.data.bindindex == 1) {
            if (this.data.type == 1) {
              this.setData({
                submitList: this.data.noWorkChildList
              })
            } else {
              this.setData({
                submitList: this.data.noNotifyReplyChildList
              })
            }
          }
        }
        // console.log(this.data.submitList)
      },
      [events.ui.ESTOP](e) {
        this.setData({
          showchild: true,
        })
        // console.log('------------')
      },
      [events.ui.showchildinfo](e) {
        let id = e.currentTarget.dataset.childid
        let forList = []
        if (this.data.type == 1 || this.data.type == 0 && this.data.workInfor.receiptType == 4) {
          if (this.data.bindindex == 0) {
            forList = this.data.childWorkList
          } else {
            forList = this.data.submitList
          }
        } else if (this.data.type == 0 && this.data.workInfor.receiptType != 4) {
          forList = this.data.submitList
        }
        forList.forEach(item => {
          if (item.childId == id) {
            this.setData({
              'showchildmag': item,
              'showchild': false
            })
          }
        })
      }
    }
  }

  mapEffect({
    put
  }) {
    return {

      [effects.USERINFO]() {
        this.$api.user.gerUserInfo({}).then(res => {
          this.setData({
            userinfo: res.data.result,
          })
          if (this.data.userinfo.role == 0) {
            if (this.data.type == 0) {

            } else if (this.data.type == 1) {

            }
          }
          // console.log(this.data.userinfo)
        })
      },
      // 通知详情
      [effects.GET_NOTIFY]() {
        if (this.data.role == 0) {
          put(effects.SEENOTITY)
          var inputMap = {
            classNotifyId: this.data.workId,
            childId: this.data.childId
          }
        } else {
          var inputMap = {
            classNotifyId: this.data.workId
          }
        }
        this.$api.class.getNotifyDetails(inputMap).then(res => {
          // console.log(res.data.result)
          if (!res.data.result) {
            wx.showModal({
              title: '提示',
              content: '该内容已经被创建者删除',
              confirmColor: '#f29219',
              success: res => {
                wx.switchTab({
                  url: '../../class/class',
                })
              }
            })
          }
          if (res.data.errorCode == 0) {
            if (res.data.result.notifyDetails.receiptType && res.data.result.notifyDetails.receiptType != 0) {
              let receipt = res.data.result.notifyDetails.receiptType - 1
              res.data.result.notifyDetails.receipt = this.data.receiptList[receipt]
            }
            res.data.result.notifyDetails.addTime = res.data.result.notifyDetails.addTime.split(' ')[0]
            this.setData({
              workInfor: res.data.result.notifyDetails,
              notifyReply: res.data.result.notifyReply,
            })
            if (this.data.role == 1) {
              this.setData({
                submitList: this.data.notifyReply,
                'noNotifyReplyChildList': res.data.result.noNotifyReplyChildList,
              })
              if (this.data.workInfor.receiptType != 4) {
                this.setData({
                  'notifyReplyByNo': res.data.result.notifyReplyByNo
                })
              }
            }
            if (this.data.userinfo.role == 0 && this.data.workInfor.isReply == "true") {
              let replytype = 'notifyReply[0].replyType'
              if (this.data.notifyReply[0].replyType == 0) {
                this.setData({
                  [replytype]: 1
                })
              } else if (this.data.notifyReply[0].replyType == 1) {
                this.setData({
                  [replytype]: 0
                })
              }
              // console.log(this.data.notifyReply)
            }
            if (this.data.workInfor.receiptType == 4) {
              this.setData({
                childWorkList: res.data.result.notifyReply,
              })
            }
            if (res.data.result.notifyDetails.receiptType != 0) {
              let totalNum = this.data.workInfor.totalNum
              let yesNum = this.data.workInfor.yesNum
              let noNum = this.data.workInfor.noNum
              let emptyNum = this.data.workInfor.emptyNum
              this.data.workInfor.receipt[0].num = yesNum + '/' + totalNum
              if (this.data.workInfor.receiptType != 4) {
                this.data.workInfor.receipt[1].num = noNum + '/' + totalNum
                this.data.workInfor.receipt[2].num = emptyNum + '/' + totalNum
                this.data.workInfor.receipt[2].clicktab = false;
              } else {
                this.data.workInfor.receipt[1].num = emptyNum + '/' + totalNum
              }
              this.data.workInfor.receipt[0].clicktab = true;
              this.data.workInfor.receipt[1].clicktab = false;
              this.setData({
                workInfor: this.data.workInfor,
                notifyReply: this.data.notifyReply
              })
              // console.log(this.data.workInfor)
            }
          }
        })
      },
      // 作业详情
      [effects.GETWORKMSG]() {
        if (this.data.role == 0) {
          var inputMap = {
            classMaterialWorkId: this.data.workId,
            childId: this.data.childId
          }
          put(effects.SEEWORK)
        } else {
          var inputMap = {
            classMaterialWorkId: this.data.workId,
          }
        }
        this.$api.class.getClassWorkDetails(inputMap).then(res => {
          // console.log(res.data)
          if (!res.data.result) {
            wx.showModal({
              title: '提示',
              content: '该内容已经被创建者删除',
              confirmColor: '#f29219',
              success: res => {
                wx.switchTab({
                  url: '../../class/class',
                })
              }
            })
          }
          if (res.data.errorCode == 0) {
            res.data.result.workInfor.noworkNum = res.data.result.workInfor.totalNum - res.data.result.workInfor.workNum
            this.setData({
              workInfor: res.data.result.workInfor,
              childWorkList: res.data.result.childWorkList,
            })
            if (this.data.role == 1) {
              this.setData({
                noWorkChildList: res.data.result.noWorkChildList
              })
            }
            this.data.childWorkList.forEach(onework => {
              // if (onework.workCommentList.length > 0) {
              //   onework.workCommentList.forEach(item => {
              //     item.addTime = item.addTime.split(' ')[0]
              //   })
              // }
              if (onework.workLikeList.length > 0) {
                onework.workLikeList.forEach(item => {
                  item.like = item.addTime.split(' ')[0]
                })
              }
            })
            this.data.workInfor.workinfo = [{
              type: '已提交',
              num: this.data.workInfor.workNum + '/' + this.data.workInfor.totalNum,
              clicktab: true,
            }, {
              type: '未提交',
              num: this.data.workInfor.noworkNum + '/' + this.data.workInfor.totalNum,
              clicktab: false,
            }]
            this.setData({
              workInfor: this.data.workInfor,
              childWorkList: this.data.childWorkList
            })
          }
        })
      },
      // 相册详情
      [effects.GET_DYNAMIC]() {
        // console.log(this.data.type)
        if (this.data.role == 0) {
          var inputMap = {
            classDynamicId: this.data.workId,
            childId: this.data.childId
          }
          put(effects.SEEWORK)
        } else {
          var inputMap = {
            classDynamicId: this.data.workId,
          }
        }
        this.$api.class.getClassDynamicDetails(inputMap).then(res => {
          // console.log(res.data.result)
          if (res.data.errorCode == 0) {
            let workLikeList = res.data.result.dynamicInfor.dynamicLike
            res.data.result.dynamicInfor.workLikeList = workLikeList
            let workCommentList = res.data.result.dynamicInfor.dynamicComment
            res.data.result.dynamicInfor.workCommentList = workCommentList
            this.setData({
              childWorkList: [res.data.result.dynamicInfor],
            })
          }
        })
      },
      // 评论
      [effects.SENDcomment]() {
        let contentSize = ''
        if (this.data.contentSize) {
          let miao = 0;
          let fen = 0;
          if (this.data.contentSize < 60) {
            miao = this.data.contentSize
            fen = 0
          } else {
            miao = Math.abs(this.data.contentSize - 60)
            fen = Math.floor(this.data.contentSize / 60)
          }
          if (fen < 10) {
            fen = '0' + fen
          }
          if (miao < 10) {
            miao = '0' + miao
          }
          contentSize = fen + ':' + miao
        }
        let input = {}
        if (this.data.type == 1) { //作业
          input = {
            childWorkId: this.data.childWorkId,
            classId: this.data.classId,
            audioUrl: this.data.replayAudioUrl,
            content: this.data.text,
            childId: this.data.childId,
            contentSize: contentSize
          }
          this.$api.class.addChildWorkComment(input).then(res => {
            // console.log(res)
            if (res.data.errorCode == 0) {
              put(effects.GETWORKMSG)
            }

            this.setData({
              text: '',
              replayAudioUrl: ''
            })
          })
        } else if (this.data.type == 2) { //相册评论
          if (this.data.userinfo.role == 0) {
            input = {
              classDynamicId: this.data.classDynamicId,
              classId: this.data.classId,
              audioUrl: this.data.replayAudioUrl,
              content: this.data.text,
              childId: this.data.childId,
              contentSize: contentSize
            }
          } else {
            input = {
              classDynamicId: this.data.classDynamicId,
              classId: this.data.classId,
              audioUrl: this.data.replayAudioUrl,
              content: this.data.text,
              contentSize: contentSize
            }
          }
          this.$api.class.addClassDynamicComment(input).then(res => {
            if (res.data.errorCode == 0) {
              if (this.data.type != 2) {
                if (res.data.result.integral != 0) {
                  wx.showToast({
                    title: '+' + res.data.result.integral + '积分',
                    icon: 'none',
                    duration: 1000,
                    mask: true
                  })
                }
              }

              put(effects.GET_DYNAMIC)
            }
            this.setData({
              text: '',
              replayAudioUrl: ''
            })
          })
        }

        // console.log(input)
        // return

      },
      [effects.SENDreplay]() {
        let contentSize = ''
        if (this.data.contentSize) {
          let miao = 0;
          let fen = 0;
          if (this.data.contentSize < 60) {
            miao = this.data.contentSize
            fen = 0
          } else {
            miao = Math.abs(this.data.contentSize - 60)
            fen = Math.floor(this.data.contentSize / 60)
          }
          if (fen < 10) {
            fen = '0' + fen
          }
          if (miao < 10) {
            miao = '0' + miao
          }
          contentSize = fen + ':' + miao
        }
        if (this.data.type == 1) {
          if (this.data.userinfo.role == 0) {
            var input = {
              replyType: this.data.commenttype,
              toUserId: this.data.toUserId,
              audioUrl: this.data.replayAudioUrl,
              content: this.data.text,
              childId: this.data.childId,
              contentSize: contentSize,
              childWorkCommentId: this.data.childWorkCommentId,
              replyId: this.data.replyId,
              toRole: this.data.toRole
            }
          } else {
            var input = {
              replyType: this.data.commenttype,
              toUserId: this.data.toUserId,
              audioUrl: this.data.replayAudioUrl,
              content: this.data.text,
              contentSize: contentSize,
              childWorkCommentId: this.data.childWorkCommentId,
              replyId: this.data.replyId,
              toRole: this.data.toRole
            }
          }
          // return
          this.$api.class.addChildWorkCommentReply(input).then(res => {
            // console.log(res.data)
            if (res.data.errorCode == 0) {
              put(effects.GETWORKMSG)
            }
            this.setData({
              text: '',
              replayAudioUrl: ''
            })
          })
        } else if (this.data.type == 2) {
          if (this.data.userinfo.role == 0) {
            var input = {
              replyType: this.data.commenttype,
              toUserId: this.data.toUserId,
              audioUrl: this.data.replayAudioUrl,
              content: this.data.text,
              childId: this.data.childId,
              contentSize: contentSize,
              classDynamicCommentId: this.data.classDynamicCommentId,
              replyId: this.data.replyId,
              toRole: this.data.toRole
            }
          } else {
            var input = {
              replyType: this.data.commenttype,
              toUserId: this.data.toUserId,
              audioUrl: this.data.replayAudioUrl,
              content: this.data.text,
              contentSize: contentSize,
              classDynamicCommentId: this.data.classDynamicCommentId,
              replyId: this.data.replyId,
              toRole: this.data.toRole
            }
          }

          // console.log(input)
          // return
          this.$api.class.addClassDynamicCommentReply(input).then(res => {
            // console.log(res.data)
            if (res.data.errorCode == 0) {
              put(effects.GET_DYNAMIC)
            }
            this.setData({
              text: '',
              replayAudioUrl: ''
            })
          })
        }
      },
      //家长删除作业
      [effects.CHILD_DEL_WORK](data) {
        this.$api.class.deleteChildClassWork(data).then(res => {
          // console.log(res.data)
          if (res.data.errorCode == 0) {
            put(effects.GETWORKMSG)
          }
        })
      },
      //删除作业\相册下的评论
      [effects.CHILD_DEL_COMMENT_REPLAY_WORK](data) {
        if (this.data.type == 1) {
          this.$api.class.deleteChildWorkCommentOrReply(data).then(res => {
            // console.log(res.data)
            if (res.data.errorCode == 0) {
              put(effects.GETWORKMSG)
            }
          })
        } else if (this.data.type == 2) {
          this.$api.class.deleteDynamicCommentOrReply(data).then(res => {
            // console.log(res.data)
            if (res.data.errorCode == 0) {
              put(effects.GET_DYNAMIC)
            }
          })
        }

      },
      // 家长提交回执
      [effects.RECEIPTSUBMIT]() {
        let inputMap = {
          childId: this.data.childId,
          classNotifyId: this.data.workId,
          receiptType: this.data.choosereceipt,
          contents: []
        }
        // console.log(inputMap)
        this.$api.class.addClassNotifyReply(inputMap).then(res => {
          // console.log(res.data)
          if (res.data.errorCode == 0) {
            // put(effects.GET_NOTIFY)
            wx.navigateBack({})
          }
        })
      },
      // 浏览作业的人数
      [effects.SEEWORK]() {
        let inputMap = {
          classMaterialWorkId: this.data.workId,
          childId: this.data.childId
        }
        this.$api.class.addClassWorkLookLog(inputMap).then(res => {})
      },
      // 浏览通知的人数
      [effects.SEENOTITY]() {
        let inputMap = {
          classNotifyId: this.data.workId,
          childId: this.data.childId
        }
        this.$api.class.addClassNotifyLookLog(inputMap).then(res => {})
      },
      
      [effects.ADDFOEMID]() {
        let map = {
          ids: this.data.formId
        }
        // console.log(map)
        this.$api.user.addUserForm(map).then(res => {
          // console.log('保存formId')
        })
      }
    }
  }
}

EApp.instance.register({
  type: workMsg,
  id: 'workMsg',
  config: {
    events,
    effects,
    actions
  }
});
// classPage 1
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
} from './addPeport.eea'


const base64 = require('../../../lib/base64')
const recorderManager = wx.getRecorderManager()
const innerAudioContext = null; // 音频对象
const Array = require('../../../lib/Array')


var time = 600;
var timer;
class addPeport extends EPage {
  get data() {
    return {
      mask:false,
      s_repliys:false,
      receiptType: [{
        type: '同意/不同意',
        id: 0,
        checked: false
      }, {
        type: '已阅',
        id: 1,
        checked: false
      }, {
        type: '参加/不参加',
        id: 2,
        checked: false
      }, {
        // img:'../../../assets/img/editor.png',
        type: '信息回执',
        id: 3,
        checked: false,
      }],
      peportType: [{
          id: '0',
          value: '班级通知',
        },
        {
          id: '1',
          value: '班级作业',
          checked: 'true'
        },
        // {
        //   id: '2',
        //   value: '学习资料'
        // },
        // {
        //   id: '3',
        //   value: '班级动态'
        // }
      ],
      textContent: [],
      model: {
        remind: 1,
        classIds: '',
        title: '',
        contents: []
      },
      previewMsg: {
        remind: 1,
        classIds: '',
        title: '',
        contentList: []
      },
      imgNum: 9,
      imgList: [],
      imgContent: [],
      audioNum: 1,
      audioList: [],
      audioContent: [],
      isSpeaking: true,
      startSpeak: false,
      videoNum: 1,
      videoList: [],
      videoContent: [],
      notify: true,
      errormsg: '',
      errorshow: false,
      classbox: '',
      videoSrc: '',
      type: 1,
      playvideo: true,
      ischildsubmitwork: 0,
      isok:true,
      isRemind:[{
        id: 1,
        value: '是',
        checked:true
      },{
        id:0,
        value:'否',
      }],
      
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        console.log('值',option)
        if (option.role == 0) { //家长发布作业  通知信息  等
          this.setData({
            isok:false,
            workId: option.workId,
            type: option.type,
            role: option.role
          })
          let that = this
          wx.getStorage({
            key: 'childId',
            success: function(res) {
              that.setData({
                childId: res.data
              })
              if (that.data.type == 0) {
                console.log('1111111111111111111111111')
                put(effects.GET_NOTIFY)
              }
              if (that.data.type == 1) {
                put(effects.GETWORKMSG)
              }
            },
          })
          if (this.data.type == 0) {
            this.setData({
              'pla': '请输入文字回执',
              img: this.$api.extparam.getPageImgUrl('boyb'),
            })
            wx.setNavigationBarTitle({
              title: '班级通知回执',
            })
          } else {
            this.setData({
              'pla': '说说今天的感想和收获吧……'
            })
            wx.setNavigationBarTitle({
              title: '班级作业回复',
            })
          }
          console.log(this.data.type)
        } else {

          this.setData({
            userId: option.userId,
            classId: option.classId,
            'model.classIds': option.classId,
            'previewMsg.classIds': option.classId,
            role: option.role,
            type: option.type //发布的类型
          })

          if (option.type == 0) {
            wx.setNavigationBarTitle({
              title: '班级通知发布',
            })
            this.setData({
              'notify': false
            })
          } else {
            this.setData({
              'notify': true
            })
            if (this.data.type == 1) {
              wx.setNavigationBarTitle({
                title: '班级作业发布',
              })
            } else if (this.data.type == 2) {
              wx.setNavigationBarTitle({
                title: '班级相册发布',
              })
            }
          }
        }
        let phone = wx.getSystemInfoSync().platform
        if (phone == 'ios') {
          this.setData({
            'isios': true
          })
        } else {
          this.setData({
            'isios': false
          })
        }
      },
      [PAGE_LIFE.ON_SHOW](option) {
        if (this.data.role == 1) {
          put(effects.getCLASSLIST)
        }
        let that = this
        put(effects.USERINFO)
        wx.getSystemInfo({
          success: function(res) {
            that.setData({
              'widths': res.screenWidth,
              'heights': res.screenHeight,
            })
          },
        })
      },
      [PAGE_LIFE.ON_SHARE_APP_MESSAGE](e) {

      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      // 选择哪一个
      [events.ui.CHOOSETYPE](e) {
        console.log(e.detail.value)
        let typelist = parseInt(e.detail.value) + parseInt(1)
        this.setData({
          'model.receiptType': typelist,
          'previewMsg.receiptType': typelist
        })
        console.log('表单数据', this.data.model, this.data.previewMsg)
        this.$storage.set('previewMsg', this.data.previewMsg)
        this.$storage.set('submitMsg', this.data.model)
      },
      // 添加
      [events.ui.ADDRECEIPT](e) {
        if (!this.data.model.receiptType || !this.data.previewMsg.receiptType) {
          this.$common.showMessage(this, '请选择回执方式')
          return;
        }
        // console.log(e.detail.target.dataset.type)
        let type = e.detail.target.dataset.type
        console.log('在哪个班级发的', this.data.classId)
        if (type == 1) {   // 通知预览
          wx.navigateTo({
            url: '../preview/preview?type=' + this.data.type + '&classId=' + this.data.classId,
          })
        } else {    // 发布
          put(effects.addClassNotify)
        }

      },

      [events.ui.SETTITLE](e) {
        this.setData({
          'model.title': e.detail.value,
          'previewMsg.title': e.detail.value
        })
      },
      [events.ui.addClass](){
        wx.navigateTo({
          url: '/pages/classcircle/schoolType/schoolType',
        })
      },
      [events.ui.SETTEXT](e) {
        console.log(this.data)
        let theText = e.detail.value.trim()
        console.log(this.data.model.contents)
        if (this.data.model.contents.length > 0) {
          for (let index in this.data.model.contents) {
            if (this.data.model.contents[index].contentType == 1) {
              this.data.model.contents.splice(index, 1)
            }
          }
        }
        console.log(theText)
        // if (typeof(theText) != 'undefined' && theText != '') {
        let pretext = theText;
        // 有待
        let text = {
          contentType: 1,
          content: base64.base64_encode(theText),
        }
        let previewtext = {
          contentType: 1,
          content: pretext,
        }
        this.setData({

          'contentText': text,
          'previewtext': previewtext,
          'model.contents': this.data.model.contents.concat(text),
          'previewMsg.contentList': this.data.previewMsg.contentList.concat(previewtext),
        })
        // }
      },
      // 选择发布类型
      [events.ui.radioChange](e) {
        let type = e.detail.value
        this.setData({
          type: type
        })
        if (type == 0) {
          this.setData({
            'notify': false
          })
        } else {
          this.setData({
            'notify': true
          })
        }
        console.log(this.data.type)
      },
      // 图片上传
      [events.ui.CHANGE_AVATAR]() {
        let imgNum = this.data.imgNum
        wx.showActionSheet({
          itemList: ['拍照', '从手机相册选择'],
          itemColor:"#f29219",
          success: (res) => {
            if (res.cancel) {
              return;
            }
            var sourceType = [];
            if (res.tapIndex === 0) {
              sourceType.push('camera');
            }
            if (res.tapIndex === 1) {
              sourceType.push('album');
            }
            wx.chooseImage({
              sourceType: sourceType,
              count: imgNum,
              sizeType: ['original'],
              success: (resp) => {
                wx.showLoading({
                  title: '图片上传中...',
                })
                for (let item of resp.tempFilePaths) {
                  this.$api.upload.upload(item).then(res => {
                    console.log(res.key)
                    let imgs = this.$api.extparam.getFileUrl(res.key).split('!')[0] + "!org";
                    this.setData({
                      imgContent: this.data.imgContent.concat([{
                        contentType: 2,
                        content: base64.base64_encode(this.$api.extparam.getFileUrl(res.key))
                      }]),
                      imgList: this.data.imgList.concat([{
                        contentType: 2,
                        content: imgs
                      }]),
                      imgNum: this.data.imgNum - 1
                    })
                    console.log("可上传的图片数" + this.data.imgNum)
                    console.log(this.data.imgContent)
                    wx.stopPullDownRefresh();
                    wx: wx.hideLoading();
                  });

                }
                // setTimeout(function() {
                //   wx.stopPullDownRefresh();
                //   wx: wx.hideLoading();
                // }, 1500)
              }
            })
          }
        });
      },
      [events.ui.close_video]() {
        this.setData({
          playvideo: true,
          videoSrc: ''
        })
      },
      [events.ui.SET_AUDIO]() {
        this.setData({
          isSpeaking: false
        })
      },
      [events.ui.START_AUDIO]() {
        this.setData({
          startSpeak: true
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
        recorderManager.onStart(() => {});
        //错误回调
        recorderManager.onError((res) => {
          console.log(res);
        })
        let that = this;
        let len = 0;
        if (this.data.startSpeak) {
          timer = setInterval(function() {
            time--;
            len++;
            // let len = ((600 - time) / 60).toFixed(2)
            that.setData({
              'countDownTime': time,
              'audiolength': len
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
      [events.ui.STOP_AUDIO]() {
        this.setData({
          startSpeak: false
        })
        recorderManager.stop();
        recorderManager.onStop((res) => {
          clearInterval(timer);
          let miao = 0;
          let fen = 0;
          if (this.data.audiolength < 60) {
            miao = this.data.audiolength
            fen = 0
          } else {
            miao = Math.abs(this.data.audiolength - 60)
            fen = Math.floor(this.data.audiolength / 60)
          }
          if (fen < 10) {
            fen = '0' + fen
          }
          if (miao < 10) {
            miao = '0' + miao
          }

          console.log(fen, miao)
          this.setData({
            countDownTime: 600,
            audiolength: 0,
            'contentSize': fen + ':' + miao
          })
          console.log(this.data.contentSize)
          time = 600;
          // 把这个时间存到数据库里
          console.log(res.tempFilePath)
          this.$api.upload.upload(res.tempFilePath).then(res => {

            this.setData({
              audioNum: this.data.audioNum - 1,
              audioList: this.data.audioList.concat([{
                contentType: 3,
                content: this.$api.extparam.getVedioUrl(res.key),
                play: false,
                contentSize: this.data.contentSize
              }]),
              audioContent: this.data.audioList.concat([{
                contentType: 3,
                content: base64.base64_encode(this.$api.extparam.getVedioUrl(res.key)),
                play: false,
                contentSize: this.data.contentSize
              }]),

            })
            // //定义圈主详情语音进度条,使用数组角标作为ID
            // let communityIntroduceId = this.data.communitySubjectForPage.length - 1;
            // this.setData({
            //   subjectSlidlst: {
            //     id: communityIntroduceId,
            //     offset: 0
            //   }
            // })
            console.log(this.data.audioList)
          });
          clearInterval(timer)
          this.setData({
            isSpeaking: true,
            startSpeak: false,
            countDownTime: 600,
          })
        })
      },
      [events.ui.AUDIO_PLAY](e) {
        console.log(e.target.dataset.clicktype)

        if (this.data.type == 0 && this.data.userinfo.role == 0) {
          this.data.workInfor.contentList.forEach(item => {
            if (item.contentType == 3) {
              item.play = false
            }
          })
          this.setData({
            workInfor: this.data.workInfor
          })
        }
        if (this.data.audioList.length > 0) {
          this.data.audioList[0].play = false;
        }
        if (this.innerAudioContext != null && typeof(this.innerAudioContext != 'undefind')) {
          //播放当前语音时暂停其他语音线程
          this.innerAudioContext.pause();
        }
        this.setData({
          audioList: this.data.audioList
        })
        let clicktype = e.target.dataset.clicktype
        if (e.target.dataset.clicktype == 2) {
          this.data.audioList[0].play = true;
          this.setData({
            audioList: this.data.audioList
          })
          console.log(this.data.audioList[0].content)
          this.innerAudioContext = wx.createAudioContext('subjectAudio1');
        } else {
          this.data.workInfor.contentList.forEach(item => {
            if (item.contentType == 3) {
              item.play = true
            }
          })
          this.setData({
            workInfor: this.data.workInfor
          })
          console.log(this.data.workInfor.contentList)
          this.innerAudioContext = wx.createAudioContext('subjectAudio');
        }
        this.innerAudioContext.play();
      },
      [events.ui.AUDIO_PLAY_END](e) {
        console.log(e.currentTarget.dataset.clicktype)
        let clicktype = e.target.dataset.clicktype
        if (e.target.dataset.clicktype == 2) {
          this.data.audioList[0].play = false;
          this.setData({
            audioList: this.data.audioList
          })
        } else {
          this.data.workInfor.contentList.forEach(item => {
            if (item.contentType == 3) {
              item.play = false
            }
          })
          this.setData({
            workInfor: this.data.workInfor
          })
        }

      },
      [events.ui.AUDIO_UPDATA_PROGRESS](e) {
        console.log(e.currentTarget.dataset.clicktype)
        let clicktype = e.currentTarget.dataset.clicktype
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
        if (clicktype == 2) {
          this.data.audioList[0].audio_duration = min + ':' + sec
          this.setData({
            audioList: this.data.audioList
          })
        } else {
          this.data.workInfor.contentList.forEach(item => {
            if (item.contentType == 3) {
              item.audio_duration = min + ':' + sec
            }
          })
          this.setData({
            workInfor: this.data.workInfor
          })
        }

      },
      [events.ui.AUDIO_STOP](e) {
        let clicktype = e.target.dataset.clicktype
        if (clicktype == 2) {
          this.data.audioList[0].play = false;
          this.setData({
            audioList: this.data.audioList
          })
        } else {
          this.data.workInfor.contentList.forEach(item => {
            if (item.contentType == 3) {
              item.play = false;
            }
          })
          this.setData({
            workInfor: this.data.workInfor
          })
        }
        this.innerAudioContext.pause();
      },
      [events.ui.SET_VIDEO]() {
        let videonum = this.data.videoNum;
        wx.showActionSheet({
          itemList: ['录像（1分钟）', '从手机相册选择（3分钟）'],
          success: (res) => {
            console.log(res)
            if (res.cancel) {
              return;
            }
            var sourceType = [];
            if (res.tapIndex === 0) {
              sourceType.push('camera');
            }
            if (res.tapIndex === 1) {
              sourceType.push('album');
            }
            wx.chooseVideo({
              sourceType: sourceType,
              maxDuration: 60,
              success: (resp) => {
                console.log(resp.tempFilePath)
                this.$api.upload.upload(resp.tempFilePath).then(res => {
                  this.setData({
                    videoContent: this.data.videoContent.concat([{
                      contentType: 4,
                      content: base64.base64_encode(this.$api.extparam.getVedioUrl(res.key))
                    }]),
                    videoList: this.data.videoList.concat([{
                      contentType: 4,
                      content: this.$api.extparam.getVedioUrl(res.key)
                    }]),
                    videoNum: this.data.videoNum - 1,
                  })
                  console.log(this.data.videoList)
                });
              }
            })
          }
        });
      },
      // 删除
      [events.ui.DELs](e) {
        let index = e.currentTarget.dataset.index
        let type = e.currentTarget.dataset.type
        console.log(index, type)
        if (type == 2) { //图片
          let list = this.data.imgContent
          let list2 = this.data.imgList
          this.setData({
            imgContent: Array.remove(list, index),
            imgList: Array.remove(list2, index),
            imgNum: this.data.imgNum + 1
          })
          console.log(this.data.imgContent, this.data.imgList)
        } else if (type == 3) {
          this.setData({
            audioNum: 1,
            audioList: [],
            audioContent: [],
          })
        } else if (type == 4) {
          this.setData({
            videoNum: 1,
            videoList: [],
            videoContent: []
          })
        }
      },

      [events.ui.cancel]() {
        this.setData({
          isSpeaking: true
        })
      },
      // 选择班级
      [events.ui.CHOOSECLASS](e) {
        var arrs=[];
        var classbox = e.detail.value
        console.log('班级id',classbox);
        this.setData({
          classId:classbox
        })
        //
        wx.setStorage({
          key: 'myclassid',
          data: classbox
        })

        console.log(e.detail.value.indexOf(this.data.classId))
        if (e.detail.value.indexOf(this.data.classId) == -1) {
          arrs.push(this.data.classId)
        }

        classbox = classbox.join(',')
        this.setData({
          classbox: classbox,
          'model.classIds': classbox,
          'previewMsg.classIds': classbox
        })
        // console.log(this.data.classbox)
        
      },
      // 提醒
      [events.ui.isRemindChange](e){
        let isremind = e.detail.value
        this.setData({
          'model.remind': isremind,
          'previewMsg.remind': isremind
        })
      },
      // 创建/预览
      [events.ui.SETHOMEWORK](e) {
        let buttype = e.detail.target.dataset.buttype

        if (this.data.userinfo.role == 1) {
          this.setData({
            'model.contents': []
          })
          if (this.data.contentText) {
            this.setData({
              'model.contents': this.data.model.contents.concat(this.data.contentText),
            })
          }
        }
        this.setData({
          'model.contents': this.data.model.contents.concat(this.data.imgContent),
        })
        this.setData({
          'model.contents': this.data.model.contents.concat(this.data.audioContent),
        })
        this.setData({
          'model.contents': this.data.model.contents.concat(this.data.videoContent),
        })
        if (this.data.userinfo.role == 1) {
          if (!this.data.classbox) {
           return this.$common.showMessage(this, '请选择班级');
            this.setData({
              'model.classIds': this.data.classId
            })
          }
          console.log(this.data.model)
          if (!this.data.model.title&&this.data.type!=2) {
            this.$common.showMessage(this, '标题不能为空');
            return false;
          }
          console.log(this.data.model.contents)
          var result = this.data.model.contents.some(item => {
            if (item.contentType == 1 && item.content != null && item.content != '') {
              return true
            }
          })
          console.log('发布之前数据',this.data.model)
          if (buttype == 2) { // 发布
            if (this.data.type == 0) {
              console.log('通知')
            } else if (this.data.type == 1) {
              put(effects.createHOMEWORK)
              console.log('作业')
            } else if (this.data.type == 2) {
              console.log('相册')
              put(effects.create_ClassDynamic)
            } else if (this.data.type == 3) {
              console.log('资料')
            }
          } else { //预览
            let that = this
            // let list = []
            // that.data.previewMsg.contentList.forEach(item => {
            //   if (item.contentType == 1) {
            //     list.push(item)
            //   }
            // })
            // that.data.previewMsg.contentList = list
            // this.setData({
            //   previewMsg: that.data.previewMsg
            // })
            this.setData({
              'previewMsg.contentList': []
            })
            this.setData({
              'previewMsg.contentList': that.data.previewMsg.contentList.concat(this.data.previewtext),
            })
            that.setData({
              'previewMsg.contentList': that.data.previewMsg.contentList.concat(that.data.imgList),
            })
            that.setData({
              'previewMsg.contentList': that.data.previewMsg.contentList.concat(that.data.audioList),
            })
            that.setData({
              'previewMsg.contentList': that.data.previewMsg.contentList.concat(that.data.videoList),
            })
            console.log(that.data.previewMsg)
            that.$storage.set('previewMsg', that.data.previewMsg)
            that.$storage.set('submitMsg', that.data.model)
            console.log('发布类型',this.data.type,'去哪',buttype)
            if (buttype == 1) {

              wx.navigateTo({
                url: '../preview/preview?type=' + this.data.type + '&userId=' + this.data.userId + '&classId=' + this.data.classId,
              })
            } else if (buttype == 3) {
              // 打开弹框
              this.setData({
                s_repliys:true,
                mask:true
              })
              // wx.navigateTo({
              //   url: '../receiptType/receiptType?type=' + this.data.type + '&classId=' + this.data.classId + '&userId=' + this.data.userId,
              // })
            }

          }
        } else {
          // 家长发表
          console.log(this.data.model)
          if (this.data.type == 0) {
            //信息回执       
            put(effects.RECEIPTSUBMIT)
          } else if (this.data.type == 1) {
            // 作业      
            put(effects.addwork)
          } else if (this.data.type == 2) {

          } else if (this.data.type == 3) {
            // 动态
          }

        }
      },
      // 预览图片
      [events.ui.PREVIEWIMAGE](e) {
        let src = e.currentTarget.dataset.src;

        let contentList = this.data.workInfor.contentList
        let srclist = []

        for (let item of contentList) {
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
      // 取消选择回执方式
      [events.ui.CANCEL_CHOOSE_RECEIPT]() {
        wx.navigateBack({})
      },
      // 播放视频
      [events.ui.PLAYVIDEO](e) {
        console.log(e)
        let src = e.currentTarget.dataset.src
        this.setData({
          playvideo: false,
          'videoSrc': src,
        })
      },
      [events.ui.overVIDEO](e) {
        console.log(e)
        this.setData({
          playvideo: true,
          'videoSrc': '',
        })
      },
    }
  }

  mapEffect({
    put
  }) {
    return {
      [effects.GETMSG]() {
        let that = this
        this.$storage.get('previewMsg').then(res => {
          that.setData({
            'previewMsg': res.data
          })
          this.data.previewMsg.receiptType = 0
          this.setData({
            previewMsg: this.data.previewMsg
          })
        })
        this.$storage.get('submitMsg').then(res => {
          that.setData({
            'model': res.data
          })
          this.data.model.receiptType = 0
          this.setData({
            model: this.data.model
          })
        })
      },
      // 发布
      [effects.addClassNotify]() {
        let inputMap = this.data.model
        console.log(inputMap)
        this.$api.class.addClassNotify(inputMap).then(res => {
          if (this.data.type)
          console.log(res.data)
          if (res.data.errorCode == 0) {
            // wx.setStorageSync('idx', this.data.type)
            // wx.navigateBack({
            //   delta: 2
            // })
            // 返回班级信息列表
            wx.showToast({
              title: '发布成功',
              icon: 'success',
              image: '',
              duration: 1500,
              mask: true,
              success: (res) => {
                wx.redirectTo({
                  url: '/pages/classcircle/classMsg/classMsg?classId=' + this.data.classId + '&role=' + 1 + '&idx=' + this.data.type,
                })
              },
              fail:  (res)=> { 
                wx.navigateBack({
                  delta: 1,
                })
              },
              complete: function (res) { },
            })
          }
        })
      },
      [effects.USERINFO]() {
        this.$api.user.gerUserInfo({}).then(res => {
          this.setData({
            userinfo: res.data.result,
          })
          console.log(this.data.userinfo)
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
              'haveClass': true
            })
          } else if (res.data.errorCode == 100006) {
            // 没有班级
            this.setData({
              'haveClass': false
            })
          }
        });
      },
      // 班级作业
      [effects.createHOMEWORK]() {
        let inputMap = this.data.model
        wx.getStorage({
          key: 'myclassid',
          success: (res)=>{
            classId:res.data
          },
        })
        // console.log(inputMap)
        this.$api.class.addClassWork(inputMap).then(res => {
          // console.log(res.data)
          if (res.data.errorCode == 0) {
            // 跳转
            // wx.navigateBack({
            //   delta: 1
            // })
            wx.redirectTo({
              url: '../classMsg/classMsg?classId=' + this.data.classId + '&role=' + 1 + '&idx='+this.data.type,
            })
          
            // put(effects.RECEIPTSUBMIT)
            wx.setStorageSync('idx', this.data.type)
          } else {
            this.$common.showMessage(this, '添加班级作业失败')
          }
        })
      },
      // 发布班级相册
      [effects.create_ClassDynamic]() {
        let inputMap = this.data.model
        delete inputMap.remind 
        console.log(inputMap)
        this.$api.class.addClassDynamic(inputMap).then(res => {
          console.log(res.data)
          if (res.data.errorCode == 0) {
            wx.setStorageSync('idx', this.data.type)
            
            wx.redirectTo({
              url: '../classMsg/classMsg?classId=' + this.data.classId + '&role=' + 1 + '&idx=' + this.data.type,
            })
          } else {
            this.$common.showMessage(this, '添加班级动态失败')
          }
        })
      },
      // 家长添加作业
      [effects.addwork]() {
        console.log('回复', this.data.model.contents) 
        // if (this.data.model.contents.length < 1) {
        //   this.$common.showMessage(this, '内容不能为空');
        //   return false;
        // }
        let inputMap = {
          classMaterialWorkId: this.data.workId,
          childId: this.data.childId,
          contents: this.data.model.contents
        }
        console.log(inputMap)
        this.$api.class.addChildClassWork(inputMap).then(res => {
          console.log(res.data)
          
          if (res.data.errorCode == 0) {
            wx.showToast({
              title: '评论成功',
              icon: 'success',
              image: '',
              duration: 1500,
              mask: true,
              success: (res)=> {
                wx.navigateBack({
                  delta: 1,
                })
               },
              fail: function (res) { },
              complete: function (res) { },
            })
            


          }
        })
      },
      // 家长提交回执
      [effects.RECEIPTSUBMIT]() {
        if (this.data.model.contents.length == 0) {
          this.$common.showMessage(this, '信息回执不能为空');
          return false;
        }
        let inputMap = {
          childId: this.data.childId,
          classNotifyId: this.data.workId,
          receiptType: 1,
          contents: this.data.model.contents
        }
        console.log(inputMap)
        // return
        this.$api.class.addClassNotifyReply(inputMap).then(res => {
          console.log(res.data)
          if (res.data.errorCode == 0) {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      },
      // 通知详情
      [effects.GET_NOTIFY]() {
        if (this.data.role == 0) {
          var inputMap = {
            classNotifyId: this.data.workId,
            childId: this.data.childId
          }
        }
        this.$api.class.getNotifyDetails(inputMap).then(res => {
          console.log(res.data.result)
          if (res.data.errorCode == 0) {
            res.data.result.notifyDetails.addTime = res.data.result.notifyDetails.addTime.split(' ')[0]
            this.setData({
              workInfor: res.data.result.notifyDetails,
              notifyReply: res.data.result.notifyReply
            })
            console.log(this.data.workInfor)
            this.setData({
              childWorkList: res.data.result.notifyReply,
            })
          }
        })
      },
      // 作业详情
      [effects.GETWORKMSG]() {
        var inputMap = {
          classMaterialWorkId: this.data.workId,
          childId: this.data.childId
        }

        this.$api.class.getClassWorkDetails(inputMap).then(res => {
          console.log(res.data.result)
          if (res.data.errorCode == 0) {
            this.setData({
              workInfor: res.data.result.workInfor,
            })
          }

        })
      }
    }
  }
}

EApp.instance.register({
  type: addPeport,
  id: 'addPeport',
  config: {
    events,
    effects,
    actions
  }
});
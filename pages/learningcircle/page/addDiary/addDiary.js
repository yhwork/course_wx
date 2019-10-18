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
} from './addDiary.eea'

const base64 = require('../../../../lib/base64')
const Array = require('../../../../lib/Array')
const recorderManager = wx.getRecorderManager()
const innerAudioContext = null; // 音频对象
var time = 600;
var timer;

class addDiaryPage extends EPage {
  get data() {
    return {
      countDownTime: 600,
      limis: ["公开 其他成员可以看", "仅圈主和自己可见", "私密 仅自己可见"],
      maskHide: true,
      mapHide: true,
      selectContent: "请选择",
      communitySubject: [], //日记详情
      communitySubjectForPage: [], //填充页面日记详情，避免base64识别失败
      show: false,
      subjectImg: [],
      videooSrc: "",
      videooSrcIdx: null,
      owner_focus: false,
      isSpeaking: true,
      startSpeak: false,
      model: {
        subjectId: '', // 打卡主题ID
        childId: '', // 孩子
        contents: '' // 打卡内容
      },
      introduceTextNm: 0, //圈主文本数
      introducecontentImgNm: 0, //圈主图片数
      introducecontentAudioNm: 0, //圈主语音数
      introducecontentVideoNm: 0, //圈主视频数
      subjectSlidlstId: 0,
      subjectSlidlst: [], //进度条
      toast3Hidden: true,
      modalHidden: true,
      currentS: 0,
      selectContent: "公开 其他成员可以看",
      imgNm: 9,
      subjectImgList: [],
      FIREST: false
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        this.setData({
          model: {
            subjectId: option.id, //打卡主题ID
            communityId: option.communityId, //圈子id
            communityType: option.communityType
          }
        })

        console.log(this.data.model)
      },
      [PAGE_LIFE.ON_SHOW](option) {



      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      [events.ui.SAVE_CIRCLEOWNER_DETAIL](e) {
        console.log(this.data.communitySubjectForPage)
        if (this.data.communitySubjectForPage.length > 0) {
          for (let i = 0; i < this.data.communitySubjectForPage.length; i++) {
            if (this.data.communitySubjectForPage[i].contentType == 1) {
              this.data.communitySubjectForPage.splice(i, 1)
            }
          }
        }
        let theText = e.detail.value.trim()
        if (typeof(theText) != 'undefined' && theText != '') {

          let text = {
            contentType: 1,
            content: theText
          }
          this.setData({
            communitySubjectForPage: this.data.communitySubjectForPage.concat(text),
          })
          console.log(this.data.communitySubjectForPage)
        } else {
          this.setData({
            toast2Hidden: false
          });
          let _this = this;
          setTimeout(function() {
            _this.setData({
              toast2Hidden: true
            });
          }, 2000);
        }
      },
      //报错弹框隐藏
      [events.ui.modalChange]() {
        this.setData({
          modalHidden: true
        })
      },

      // 图片
      [events.ui.CHANGE_AVATAR](e) {
        let introducecontentImgNm = parseInt(this.data.introducecontentImgNm);
        let _this = this;
        if (introducecontentImgNm >= 9) {
          this.setData({
            toast3Hidden: false,
            errorMessage: "图片数量不能大于9"
          });
          let _this = this;
          setTimeout(function() {
            _this.setData({
              toast3Hidden: true
            });
          }, 2000);
          return;
        };
        let imgNm = this.data.imgNm;
        wx.showActionSheet({
          itemList: ['拍照', '从手机相册选择'],
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
              count: imgNm,
              success: (resp) => {
                wx: wx.showLoading({
                  title: '图片上传中...',
                })
                for (let item of resp.tempFilePaths) {
                  this.$api.upload.upload(item).then(res => {
                    // console.log(res)
                    this.setData({
                      communitySubject: this.data.communitySubject.concat([{
                        contentType: 2,
                        content: base64.base64_encode(this.$api.extparam.getFileUrl(res.key))
                      }]),
                      communitySubjectForPage: this.data.communitySubjectForPage.concat([{
                        contentType: 2,
                        content: this.$api.extparam.getFileUrl(res.key),
                      }]),
                      introducecontentImgNm: parseInt(this.data.introducecontentImgNm) + 1,
                    })
                    let imgContent = this.$api.extparam.getFileUrl(res.key).split('!')[0] + "!org";
                    this.setData({
                      subjectImg: this.data.subjectImg.concat([{
                        content: this.$api.extparam.getFileUrl(res.key),
                        id: this.data.communitySubjectForPage.length - 1
                      }]),
                      subjectImgList: this.data.subjectImgList.concat([imgContent])
                    })
                    let imgFlagNm = 9 - parseInt(_this.data.introducecontentImgNm);
                    if (imgFlagNm <= 9) {
                      _this.setData({
                        imgNm: imgFlagNm,
                      })
                    }
                    console.log("可上传的图片数" + this.data.imgNm)
                    console.log(this.data.communitySubjectForPage)
                  });

                }
                setTimeout(function() {
                  wx.stopPullDownRefresh();
                  wx: wx.hideLoading();
                }, 1500)
              }
            })
          }
        });
      },

      [events.ui.DEL](e) {
        console.log("开始删除")
        console.log(this.data.subjectSlidlst)
        const idx = e.currentTarget.dataset.idx;
        const array = this.data.communitySubject;
        const arrayj = this.data.communitySubjectForPage;
        const contentType = e.currentTarget.dataset.contenttype;
        // console.log(this.data.communitySubject,this.data.communitySubjectForPage)
        if (contentType == 2) {
          const innerIdx = e.currentTarget.dataset.inneridx
          //图片数量减少
          this.setData({
            introducecontentImgNm: this.data.introducecontentImgNm - 1,
            subjectImg: Array.remove(this.data.subjectImg, innerIdx),
          })
          // console.log( innerIdx)
          this.setData({
            imgNm: 9 - parseInt(this.data.introducecontentImgNm),
          })
          // console.log(this.data.imgNm, this.data.introducecontentImgNm)
          // console.log(array, arrayj)
        } else if (contentType == 3) {
          //音频
          this.setData({
            introducecontentAudioNm: this.data.introducecontentAudioNm - 1
          })
        } else {
          //视频
          this.setData({
            introducecontentVideoNm: this.data.introducecontentVideoNm - 1,
            videooSrc: "",
            videooSrcIdx: null
          })
        }
        // console.log(idx)
        this.setData({
          communitySubject: Array.remove(array, idx),
          communitySubjectForPage: Array.remove(arrayj, idx),
        })
        console.log("______________________________________________________________________________________________________")
        console.log(this.data.communitySubjectForPage)
        console.log(this.data.subjectSlidlst)
      },

      // 视频
      [events.ui.SET_VIDEO](e) {
        //调用dom  1 圈主介绍  2 圈子介绍
        //判断圈主介绍视频数量,大于3时不让上传
        let introducecontentVideoNm = parseInt(this.data.introducecontentVideoNm);
        if (introducecontentVideoNm >= 3) {
          this.setData({
            toast3Hidden: false,
            errorMessage: "视频数量不能超过3条"
          });
          let _this = this;
          setTimeout(function() {
            _this.setData({
              toast3Hidden: true
            });
          }, 2000);
          return;
        };
        wx.showActionSheet({
          itemList: ['录像', '从手机相册选择'],
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
            wx.chooseVideo({
              sourceType: sourceType,
              maxDuration: 60,
              success: (resp) => {
                this.$api.upload.upload(resp.tempFilePath).then(res => {
                  this.setData({
                    communitySubject: this.data.communitySubject.concat([{
                      contentType: 4,
                      content: base64.base64_encode(this.$api.extparam.getVedioUrl(res.key))
                    }]),
                    communitySubjectForPage: this.data.communitySubjectForPage.concat([{
                      contentType: 4,
                      content: this.$api.extparam.getVedioUrl(res.key)
                    }]),
                    introducecontentVideoNm: parseInt(this.data.introducecontentVideoNm) + 1,
                  })
                  this.setData({
                    videooSrc: this.$api.extparam.getVedioUrl(res.key),
                    videooSrcIdx: this.data.videooSrcIdx - 1
                  })
                  console.log(this.data.communitySubjectForPage)
                });
              }
            })
          }
        });
      },
      // 语音
      [events.ui.SET_AUDIO](e) {
        //调用dom  1 圈主介绍  2 圈子介绍
        //判断圈主介绍语音数量,大于3时不让上传
        let introducecontentAudioNm = parseInt(this.data.introducecontentAudioNm);
        if (introducecontentAudioNm >= 3) {
          this.setData({
            toast3Hidden: false,
            errorMessage: "音频数量不能超过3条"
          });
          let _this = this;
          setTimeout(function() {
            _this.setData({
              toast3Hidden: true
            });
          }, 2000);
          return;
        };
        this.setData({
          isSpeaking: false
        })
      },
      //开启录音按钮
      [events.ui.SET_AUDIO](e) {
        //调用dom  1 圈主介绍  2 圈子介绍
        //判断圈主介绍语音数量,大于3时不让上传
        // let introducecontentAudioNm = parseInt(this.data.introducecontentAudioNm);
        // if (introducecontentAudioNm >= 3) {
        //   this.setData({
        //     toast3Hidden: false
        //   });
        //   let _this = this;
        //   setTimeout(function () {
        //     _this.setData({
        //       toast3Hidden: true
        //     });
        //   }, 2000);
        //   return;
        // };
        this.setData({
          isSpeaking: false
        })
      },

      //开始录音
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
        recorderManager.onStart(() => {});
        //错误回调
        recorderManager.onError((res) => {
          console.log(res);
        })
        this.setData({
          startSpeak: true
        })

        let that = this;
        let len = 0;
        if (this.data.startSpeak) {
          timer = setInterval(function() {
            time--;
            len++;
            // let len = ((600 - time) / 60).toFixed(2)
            that.setData({
              countDownTime: time,
              audiolength: len
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
        recorderManager.stop();
        recorderManager.onStop((res) => {
          clearInterval(timer);
          // console.log(this.data.audiolength - 60)
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
          this.$api.upload.upload(res.tempFilePath).then(res => {
            this.setData({
              communitySubjectForPage: this.data.communitySubjectForPage.concat([{
                contentType: 3,
                content: this.$api.extparam.getVedioUrl(res.key),
                play: false,
                sliderId: parseInt(this.data.subjectSlidlstId),
                subjectSlidlstId: parseInt(this.data.subjectSlidlstId) + 1,
                contentSize: this.data.contentSize
              }]),
              introducecontentAudioNm: parseInt(this.data.introducecontentAudioNm) + 1
            })
            //定义圈主详情语音进度条,使用数组角标作为ID
            let communityIntroduceId = this.data.communitySubjectForPage.length - 1;
            this.setData({
              subjectSlidlst: {
                id: communityIntroduceId,
                offset: 0
              }
            })
            console.log(this.data.communitySubjectForPage)
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
        //将页面上所有包含语音的数组play值全部换为false
        let communitySubjectForPage = this.data.communitySubjectForPage;
        if (typeof(communitySubjectForPage) != "undefined" && communitySubjectForPage.length > 0) {
          for (let item of communitySubjectForPage) {
            if (item.contentType == 3) {
              item.play = false;
            }
          }
        }
        this.setData({
          communitySubjectForPage: communitySubjectForPage
        })
        if (this.innerAudioContext != null && typeof(this.innerAudioContext != 'undefind')) {
          //播放当前语音时暂停其他语音线程
          this.innerAudioContext.pause();
        }
        let idx = e.currentTarget.dataset.idx
        this.setData({
          playid: idx
        })
        let audioId = "subjectAudio" + idx //获取当前语音实例
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
        this.setData({
          time: duration
        })
        var offset = e.detail.currentTime; //当前播放时长
        var lastTime = parseInt(duration - offset);
        var min = "0" + parseInt(lastTime / 60);
        var max = parseInt(e.detail.duration);
        var sec = lastTime % 60;
        console.log(idx)
        if (sec < 10) {
          sec = "0" + sec;
        };
        that.data.subjectSlidlst.offset = offset;
        that.data.subjectSlidlst.max = max;
        that.data.subjectSlidlst.audio_duration = min + ':' + sec /* 00:00 */ ;
        that.setData({
          subjectSlidlst: that.data.subjectSlidlst
        })
      },

      [events.ui.AUDIO_PLAY_END](e) {
        var that = this;
        var idx = this.data.sliderId; //获取当前进度条
        console.log(idx)
        //获取音频状态
        let myidx = that.data.subjectSlidlst.id
        // console.log(myidx)
        console.log(this.data.communitySubjectForPage[this.data.playid].play)
        that.data.communitySubjectForPage[this.data.playid].play = false
        that.data.subjectSlidlst.offset = 0;
        that.data.subjectSlidlst.audio_duration = '00:00';
        that.setData({
          subjectSlidlst: that.data.subjectSlidlst,
          communitySubjectForPage: that.data.communitySubjectForPage,
        })
      },



      //图片预览
      [events.ui.PREVIEWIMAGE](e) {
        let src = e.currentTarget.dataset.src;
        let srcList = e.currentTarget.dataset.imglist;
        wx.previewImage({
          current: src,
          urls: srcList,
        })
      },
      //阻止遮罩层下滚动页面
      [events.ui.eStop](e) {
        return false;

      },
      //显示遮罩层
      [events.ui.showMask](e) {
        this.setData({
          maskHide: false
        })
      },
      // 隐藏录音弹窗
      [events.ui.hedeReply]() {
        this.setData({
          isSpeaking: true
        })
      },
      [events.ui.cancel]() {
        this.setData({
          isSpeaking: true
        })
      },

      //显示地图
      [events.ui.showMap](e) {
        var that = this;
        this.setData({
          mapHide: false
        })
        wx.chooseLocation({
          success: function(res) {
            // success
            console.log(res, "location")
            that.setData({
              hasLocation: true,
              location: {
                longitude: res.longitude,
                latitude: res.latitude
              },
              mapHide: true,
              detail_info: res.address,
              wd: res.latitude,
              jd: res.longitude
            })
          },
          fail: function() {
            console.log('拒绝授权')
          },
          complete: function() {
            // complete
          }
        })
      },

      [events.ui.changeLi](e) {
        var idx = e.currentTarget.dataset.idx;
        var content = e.currentTarget.dataset.content;
        console.log(content)
        this.setData({
          currentS: idx,
          maskHide: true,
          selectContent: content
        })
        console.log(this.data.selectContent)
      },

      [events.ui.SAVE_DIARY_INFO](e) {
        //检查是否有文本
        let communitySubjectForPage = this.data.communitySubjectForPage;
        var result = communitySubjectForPage.some(item => {
          if (item.contentType == 1 && item.content != null && item.content != '') {
            return true
          }
        })
        if (!result) { // 如果不存在
          this.setData({
            errorMsg: "日记文本内容不能为空",
            modalHidden: false
          })
          return;
        }
        this.setData({
          param: {
            communityId: this.data.model.communityId,
            subjectId: this.data.model.subjectId,
            contents: base64.array_base64_encode(communitySubjectForPage),
            location: this.data.detail_info,
            privilege: parseInt(this.data.currentS) + 1
          }
        });
        console.log(this.data.param)
        put(effects.CREAT_DIARY)
      }
    }
  }

  mapEffect() {
    return {
      // 查询当前用户信息
      [effects.LOAD_IS_BIND_PHONE]() {
        this.$api.circle.getUserIsBindingPhone({}).then((res) => {
          let errorCode = res.data.errorCode;
          if (errorCode == '0') {
            var isBindingPhone = res.data.result.isBindingPhone; // 1绑定 0未绑定
            if (isBindingPhone != 1) {
              wx: wx.redirectTo({
                url: '../../../class/class',
                success: function(res) {},
                fail: function(res) {},
                complete: function(res) {},
              })
            }
          }
        });
      },
      [effects.CREAT_DIARY]() {
        this.$api.circle.subjectSignIn(this.data.param).then(res => {
          let integral = res.data.result.integral;
          console.log(res.data.result.integral)
          this.$storage.set('integral', res.data.result.integral)
          let errorCode = res.data.errorCode;
          console.log(res.data)
          if (errorCode == 0) {
            // wx.redirectTo({ url: '../ themeDetail / themedetail?id=' + this.data.model.communityId + '&communityType' + this.data.model.contentType})
            // wx.redirectTo({ url: '../../../circle/myCircle?id=' + this.data.model.communityId })
            this.$storage.set('integral', res.data.result.integral).then(
              (res) => { wx.navigateBack({
                
              }); },
              (rej) => { }
            );
            // wx.navigateBack({
              // url: '../../../circle/myCircle?id=' + this.data.model.communityId
            // })
          } else {

            //打卡失败
            let errorMessage = res.data.errorMessage;
            this.setData({
              toast3Hidden: false,
              errorMessage: errorMessage,
              communitySubjectForPage: base64.array_base64_decode(this.data.communitySubjectForPage),
            })
            let _this = this;
            setTimeout(function() {
              _this.setData({
                toast3Hidden: true
              });
            }, 2000);
          }
        });
      }
    }
  }
}

EApp.instance.register({
  type: addDiaryPage,
  id: 'addDiaryPage',
  config: {
    events,
    effects,
    actions
  }
});
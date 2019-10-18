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
} from './diaryDetail.eea'
const innerAudioContext = null; // 音频对象
const base64 = require('../../../../lib/base64')
const recorderManager = wx.getRecorderManager()
var timer;
var time = 600;

class diaryDetailPage extends EPage {
  get data() {
    return {
      selected: true,
      countDownTime: 600,
      currentTab: 0,
      iptHide: true,
      replyHide: true,
      isSpeaking: true, //正在说话
      startSpeak: false, //开始录音
      communityDiaryForPage: [],
      diarySlidlst: [], //进度条
      commentList: {}, //评论
      play: false,
      text: "", //评论：文字回复
      replayAudioUrl: "", //评论：语音回复
      complaintFlag: true, //投诉隐藏
      ava: {
        currentPage: 1,
        pageSize: 1000,
      },
      invitHide: true,
      shareCavansOptions: {
        id: 'share_canvas',
        width: 0,
        height: 0
      },
      voiceFlag: true, //语音回复显示，先隐藏掉
      errorFlag: true,
      show: true,
      videooSrc: "",
      subjectImg: [],
      subjectImgList: [],
      FIREST: false,
    };
  }

  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        wx.hideShareMenu()
        const {
          shareCavansOptions
        } = this.data;
        shareCavansOptions.width = wx.getSystemInfoSync().screenWidth;
        shareCavansOptions.height = shareCavansOptions.width * 5 / 4;
        this.setData({
          shareCavansOptions
        });

        this.setData({
          model: option,
          'ava.signInId': option.id
        })
        put(effects.GET_SIGNIN_INFO);
        put(effects.GET_COMMENT_INFO);
        put(effects.LOAD_AVA);
        put(effects.LOAD_USERINFO); // 获取当前用户信息

      },
      [PAGE_LIFE.ON_SHARE_APP_MESSAGE](e) {
        this.setData({
          invitHide: true
        })
        const {
          from
        } = e;
        const {
          shareInfo,
          userInfo
        } = this.data;
        if (from === 'button') {
          console.log(shareInfo.shortCode)
          return {
            title: `${shareInfo.nickName}分享了Ta在学习圈“${shareInfo.communityName}”的学习日记，点击查看为Ta加油`,
            path: `/pages/course/courseList/courseList?action=share&code=${shareInfo.shortCode}`,
            imageUrl: `${shareInfo.imageUrl}`,
            success: (res) => {
              this.$common.showToast('分享成功', 'success')
            }
          }
        }
      },
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      [events.ui.eStop](e) {
        return false;
      },
      [events.ui.showComment](e) {
        let replayType = e.currentTarget.dataset.type
        this.setData({
          iptHide: false,
          commentFocus: true,
          text: "",
          replayType: replayType,
          replayAudioUrl: ""
        })
      },
      [events.ui.hideComment](e) {
        this.setData({
          iptHide: true
        })
      },

      // 点击回复

      //取消

      [events.ui.showReply](e) {
        let replayType = e.currentTarget.dataset.type
        let replayId = e.currentTarget.dataset.replayid
        let commentId = e.currentTarget.dataset.commentid
        console.log("我执行了哦~显示弹层");
        this.setData({
          replyHide: false,
          replayName: e.currentTarget.dataset.replayname,
          replayFocus: true,
          text: "",
          replayType: replayType,
          replayId: replayId,
          commentId: commentId
        })
        console.log(this.data)
      },
      [events.ui.hedeReply](e) {
        console.log("我执行了哦~影藏弹层");
        let type = e.currentTarget.dataset.type;
        if (type == 1) {
          this.setData({
            iptHide: true
          })
          console.log(1)

        } else if (type == 2) {
          this.setData({
            replyHide: true
          })
        } else if (type == 4) {
          //取消录音
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
              this.setData({
                replayAudioUrl: this.$api.extparam.getVedioUrl(res.key),
              })
              this.setData({
                voiceFlag: false,
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
          this.setData({
            isSpeaking: true
          })
        } else {
          this.setData({
            isSpeaking: true
          })

        }

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
      // 语音
      [events.ui.AUDIO_PLAY](e) {
        //将页面上所有包含语音的数组play值全部换为false
        let communityDiaryForPage = this.data.communityDiaryForPage;
        if (typeof(communityDiaryForPage) != "undefined" && communityDiaryForPage.length > 0) {
          for (let item of communityDiaryForPage) {
            if (item.contentType == 3) {
              item.play = false;
            }
          };
        }
        let commentList = this.data.commentList;
        if (typeof(commentList.data) != "undefined" && commentList.data.length > 0) {
          for (let item of commentList.data) {
            item.play = false;
            if (item.replyList != null && typeof(item.replyList.list) != "undefined" && item.replyList.list.length > 0) {
              for (let innerItem of item.replyList.list) {
                console.log("内部循环的数据结构————————————————————————————————————————————————————")
                console.log(innerItem)
                innerItem.play = false
              }
            }
          }
        }
        this.setData({
          communityDiaryForPage: communityDiaryForPage,
          commentList: commentList
        })
        console.log("查看播放后的PLAY")
        console.log(this.data.commentList)
        if (this.innerAudioContext != null && typeof(this.innerAudioContext != 'undefind')) {
          //播放当前语音时暂停其他语音线程
          this.innerAudioContext.pause();
        }
        let type = e.currentTarget.dataset.type;
        let idx = e.currentTarget.dataset.idx
        let audioId = '' //获取当前语音实例
        if (type == 1) {
          audioId = "diaryAudio" + idx
        } else {
          if (type == 2) {
            audioId = "commentAudio" + idx
          } else {
            audioId = idx + "replayAudio" + e.currentTarget.dataset.inneridx
          }

        }
        this.innerAudioContext = wx.createAudioContext(audioId); // 创建音频实例 TODO实例化应该在赋值src之后才能保证当前实例下能取到总时长
        this.innerAudioContext.play(); //开始播放
        if (type == 1) {
          let play = e.currentTarget.dataset.play //获取当前播放状态
          if (!play) {
            this.data.communityDiaryForPage[idx].play = true
            this.setData({
              communityDiaryForPage: this.data.communityDiaryForPage
            })
          } else {
            this.data.communityDiaryForPage[idx].play = false
            this.setData({
              communityDiaryForPage: this.data.communityDiaryForPage
            })
          }
          this.setData({
            sliderId: this.data.communityDiaryForPage[idx].sliderId //存入当前进度条
          })
        } else if (type == 2) {
          this.data.commentList.data[idx].play = true;
          this.setData({
            commentList: this.data.commentList
          })
          //存储播放状态
          this.setData({
            commentAudio: {
              idx: idx
            }
          })
        } else {
          this.data.commentList.data[idx].replyList.list[e.currentTarget.dataset.inneridx].play = true;
          this.setData({
            commentList: this.data.commentList
          })
          this.setData({
            replayAudio: {
              idx: idx,
              inneridx: e.currentTarget.dataset.inneridx
            }
          })
        }
        this.setData({
          playType: type
        })
      },

      [events.ui.AUDIO_STOP](e) {
        this.innerAudioContext.pause(); //暂停
        let idx = e.currentTarget.dataset.idx //获取当前角标判断具体停止播放的语音
        let play = e.currentTarget.dataset.play //修改具体语音播放状态
        let type = e.currentTarget.dataset.type;
        if (type == 1) {
          if (!play) {
            this.data.communityDiaryForPage[idx].play = true
            this.setData({
              communityDiaryForPage: this.data.communityDiaryForPage
            })
          } else {
            this.data.communityDiaryForPage[idx].play = false
            this.setData({
              communityDiaryForPage: this.data.communityDiaryForPage
            })
          }
        } else if (type == 2) {
          this.data.commentList.data[idx].play = false;
          this.setData({
            commentList: this.data.commentList
          })
        } else {
          this.data.commentList.data[idx].replyList.list[e.currentTarget.dataset.inneridx].play = false;
          this.setData({
            commentList: this.data.commentList
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
        var playType = that.data.playType;
        if (sec < 10) {
          sec = "0" + sec;
        };
        if (playType == 1) {
          console.log(1)
          that.data.diarySlidlst[idx].offset = offset;
          that.data.diarySlidlst[idx].max = max;
          that.data.diarySlidlst[idx].audio_duration = min + ':' + sec /* 00:00 */ ;
          that.setData({
            diarySlidlst: that.data.diarySlidlst
          })
        } else if (playType == 2) {
          let commentAudioidx = that.data.commentAudio.idx;
          that.data.commentList.data[commentAudioidx].audio_duration = min + ':' + sec /* 00:00 */ ;
          that.setData({
            commentList: that.data.commentList
          })
        } else {
          let replayAudioidx = that.data.replayAudio.idx;
          let replayAudioinneridx = that.data.replayAudio.inneridx;
          that.data.commentList.data[replayAudioidx].replyList.list[replayAudioinneridx].audio_duration = min + ':' + sec /* 00:00 */ ;
          that.setData({
            commentList: that.data.commentList
          })
        }
      },

      [events.ui.AUDIO_PLAY_END](e) {
        var that = this;
        var idx = this.data.sliderId; //获取当前进度条
        var playType = that.data.playType;
        if (playType == 1) {
          //获取音频状态
          let myidx = that.data.diarySlidlst[idx].id
          that.data.communityDiaryForPage[myidx].play = false
          that.data.diarySlidlst[idx].offset = 0;
          that.data.diarySlidlst[idx].audio_duration = '00:00';
          that.setData({
            diarySlidlst: that.data.diarySlidlst,
            communityDiaryForPage: that.data.communityDiaryForPage,
          })
        } else if (playType == 2) {
          let commentAudioidx = that.data.commentAudio.idx;
          this.data.commentList.data[commentAudioidx].play = false;
          that.data.commentList.data[commentAudioidx].audio_duration = '00:00';
          that.setData({
            commentList: that.data.commentList
          })
        } else {
          let replayAudioidx = that.data.replayAudio.idx;
          let replayAudioinneridx = that.data.replayAudio.inneridx;
          that.data.commentList.data[replayAudioidx].replyList.list[replayAudioinneridx].audio_duration = '00:00';
          that.data.commentList.data[replayAudioidx].replyList.list[replayAudioinneridx].play = false;
          that.setData({
            commentList: that.data.commentList
          })
        }
      },

      [events.ui.SET_AUDIO](e) {
        //调用dom  1 圈主介绍  2 圈子介绍
        let type = e.currentTarget.dataset.type;
        this.setData({
          isSpeaking: false,
          text: ""
        })
      },

      [events.ui.START_TEXT](e) {
        console.log('这是评论')
        this.setData({
          replayAudioUrl: "",
          text: e.detail.value,
          voiceFlag: true
        })
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
        recorderManager.onStart(() => {});
        //错误回调
        recorderManager.onError((res) => {
          console.log(res);
        })
        this.setData({
          startSpeak: true
        })

        let that = this;
        if (this.data.startSpeak) {
          timer = setInterval(function() {
            time--;
            that.setData({
              countDownTime: time
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
            this.setData({
              replayAudioUrl: this.$api.extparam.getVedioUrl(res.key),
            })
            this.setData({
              voiceFlag: false,
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



      //发表评论
      async [events.ui.SEND_MESSAGE](e) {
        console.log(this.data.replayType)

        let type = this.data.replayType
        let _this = this;
        console.log(this.data.text)
        console.log(this.data.text == "")
        if (this.data.text == "" || this.data.text == null || typeof(this.data.text) == "undefind") {
          //文本为空时判断语音是否为空
          console.log("111111111111111111111111111")
          console.log(2222222222222222222222)
          if (this.data.replayAudioUrl == "" || this.data.replayAudioUrl == null || typeof(this.data.replayAudioUrl) == "undefind") {
            this.setData({
              errorFlag: false,
              errorMessage: "语音/文字不能为空"
            })
            setTimeout(function() {
              _this.setData({
                errorFlag: true
              });
            }, 2000);
            return;
          }
        } else {
          if (this.data.text == "" || this.data.text == null || typeof(this.data.text) == "undefind") {
            this.setData({
              errorFlag: false,
              errorMessage: "语音/文字不能为空"
            })
            setTimeout(function() {
              _this.setData({
                errorFlag: true
              });
            }, 2000);
            return;
          }
        }
        this.setData({
          param: {
            signInId: this.data.model.id,
            content: this.data.text,
            audioUrl: this.data.replayAudioUrl,
            replyType: this.data.replayType,
            toUserId: this.data.replayId
          },
          voiceFlag: true
        });
        if (type == 2) {
          console.log("评论执行了")
          //新添评论
          put(effects.ADD_COMMENT)
          console.log(this.data.param)
        } else {
          console.log("回复执行了")
          //回复评论
          this.setData({
            'param.commentId': this.data.commentId
          })
          console.log(this.data.param);
          put(effects.ADD_COMMENT_REPLY)
        }
      },


      [events.ui.MORE](e) {
        let complaintFlag = e.currentTarget.dataset.type;
        console.log(complaintFlag)
        this.setData({
          complaintFlag: !complaintFlag
        })
      },
      [events.ui.SIGNLIKE](e) {
        let targetUserId = e.currentTarget.dataset.targetuserid;
        let isFollow = e.currentTarget.dataset.like;
        if (isFollow == 0) {
          this.data.diaryInfo.isFollow = 1
        } else {
          this.data.diaryInfo.isFollow = 0
        }
        this.setData({
          diaryInfo: this.data.diaryInfo,
          attentionModel: {
            targetUserId: targetUserId
          }
        })
        put(effects.UPDATE_FANS_STATUS)
      },
      [events.ui.ZAN](e) {
        let like = e.currentTarget.dataset.like;
        let signId = e.currentTarget.dataset.id;
        this.setData({
          zan: {
            signInId: signId
          }
        })
        if (like == 0) {
          this.data.diaryInfo.isLike = 1;
          this.setData({
            diaryInfo: this.data.diaryInfo
          })
          put(effects.ADD_LIKE)
        } else {
          // this.data.diaryInfo.isLike = 0;
          // this.setData({
          //   diaryInfo: this.data.diaryInfo
          // })
          // put(effects.DEL_LIKE)
        }
      },
      [events.ui.TURNBACK](e) {
        //删除已经录好的语音
        this.setData({
          audioUrl: "",
          voiceFlag: true
        })
      },
      // 隐藏分享弹层
      [events.ui.HIDE_INVIT](e) {
        this.setData({
          invitHide: true
        })
        console.log(2)

      },


      [events.ui.GETFOCUS](e) {
        let type = e.currentTarget.dataset.type;
        this.setData({
          audioUrl: "",
          voiceFlag: true
        })
        if (type == 1) {
          this.setData({
            commentFocus: true
          })
        } else {
          this.setData({
            replayFocus: true
          })
        }
      },
      // 显示分享弹层
      [events.ui.showShareWin](e) {
        let shareInfo = this.data.diaryInfo;
        console.log(shareInfo)
        const param = {};
        param.dataType = 5;
        param.data = {
          'signinId': shareInfo.signInId
        };
        this.$api.user.shareInfoRecord(param).then(
          (res) => {
            if (res.data.errorCode == '0') {
              const param1 = {};
              param1.dataType = 0;
              param1.data = {
                'signinId': shareInfo.signInId,
                'target': 'sign',
                'shortCode': res.data.result.shortCode
              };
              this.$api.user.shareInfoRecord(param1).then(
                (res) => {
                  shareInfo.shortCode = res.data.result.shortCode;
                  let _this = this
                  wx.downloadFile({
                    url: shareInfo.logo,
                    success: function(res) {
                      // 下载成功后拿到图片的路径，然后开始绘制
                      shareInfo.signInUserLogo = res.tempFilePath;
                      // console.log(res)
                      _this.$image.generateShareCourse(_this.data.shareCavansOptions, shareInfo, 'diray').then(imageUrl => {
                        shareInfo.imageUrl = imageUrl;
                        _this.setData({
                          invitHide: false,
                          shareInfo
                        });
                      });
                    },
                  });
                }
              )
            } else {
              this.$common.showMessage(this, res.data.errorMessage);
              return;
            }
          }
        )
      },
      // [events.ui.showShareWin](e) {
      //   let shareindex = e.currentTarget.dataset.shareindex
      //   console.log(shareindex)
      //   let shareInfo = this.data.communitySigninListForPage[shareindex];
      //   // console.log(shareInfo)
      //   this.setData({
      //     shareInfo: shareInfo
      //   })
      //   const param = {};
      //   param.dataType = 5;
      //   param.data = {
      //     'signinId': shareInfo.signInId
      //   };
      //   this.$api.user.shareInfoRecord(param).then(
      //     (res) => {
      //       if (res.data.errorCode == '0') {
      //         const param1 = {};
      //         param1.dataType = 0;
      //         param1.data = {
      //           'signinId': shareInfo.signInId,
      //           'target': 'sign',
      //           'shortCode': res.data.result.shortCode
      //         };
      //         this.$api.user.shareInfoRecord(param1).then(
      //           (res) => {
      //             shareInfo.shortCode = res.data.result.shortCode;

      //             let _this = this
      //             wx.downloadFile({
      //               url: shareInfo.signInUserLogo,
      //               success: function (res) {
      //                 // 下载成功后拿到图片的路径，然后开始绘制
      //                 shareInfo.signInUserLogo = res.tempFilePath;
      //                 // console.log(res)
      //                 _this.$image.generateShareCourse(_this.data.shareCavansOptions, shareInfo, 'diray').then(imageUrl => {
      //                   shareInfo.imageUrl = imageUrl;
      //                   _this.setData({
      //                     invitHide: false,
      //                     shareInfo
      //                   });
      //                 });
      //               },
      //             });
      //           }
      //         )
      //       } else {
      //         this.$common.showMessage(this, res.data.errorMessage);
      //         return;
      //       }
      //     })
      // },
    }
  }

  mapEffect({
    put
  }) {
    return {
      // 查询当前用户信息
      [effects.LOAD_USERINFO]() {
        this.$api.circle.getCurrentUserInfo({}).then((res) => {
          let errorCode = res.data.errorCode;
          if (errorCode == '0') {
            this.setData({
              "userInfo": res.data.result
            })
            console.log(this.data.userInfo)
          }
        });
      },
      [effects.UPDATE_FANS_STATUS]() {
        console.log(this.data.attentionModel)
        this.$api.circle.updateCommunityFansStatus(this.data.attentionModel).then((res) => {
          let errorCode = res.data.errorCode;
          if (errorCode == '0') {
            var status = res.data.result.status;
            showSuccToast(status);
          } else if (errorCode == '100006') {
            // 无数据
          } else {
            // 网络请求超时，请稍后再试
          }
        });
      },
      [effects.GET_SIGNIN_INFO]() {
        let inputMap = {
          signInId: this.data.model.id
        }
        // console.log(inputMap)
        let _this = this;
        // console.log(inputMap)
        // console.log(this.data.model.id)
        this.$api.circle.getSignInInfo(inputMap).then(res => {
          let errorCode = res.data.errorCode
          if (errorCode == 0) {
            let rs = res.data.result;
            rs.subjectSignStart = rs.subjectStartDate
            rs.subjectSignEnd = rs.subjectEndDate
            this.setData({
              communityDiaryForPage: res.data.result.contentList,
              diarySlidlst: res.data.result.audio,
              diaryInfo: res.data.result,
              'ava.signInId': res.data.result.signInId
            })
            for (let item of res.data.result.contentList) {
              if (item.contentType == 2) {
                let imgContent = item.content.split('!')[0] + "!org";
                _this.setData({
                  subjectImgList: _this.data.subjectImgList.concat([imgContent]),
                  subjectImg: _this.data.subjectImg.concat([{
                    content: item.content
                  }]),
                })
              } else if (item.contentType == 4) {
                _this.setData({
                  videooSrc: item.content
                })
              }
            }
          } else {
            //没有数据
          }

        })
      },
      //获取评论
      [effects.GET_COMMENT_INFO](e) {
        let inputMap = {
          signInId: this.data.model.id,
          pageSize: 10,
          currentPage: 1
        }
        console.log(inputMap)
        this.$api.circle.getSignInCommentList(inputMap).then(res => {
          let errorCode = res.data.errorCode;
          if (errorCode == 0) {
            this.setData({
              commentList: {
                data: res.data.result.list
              },
              totalRecords: res.data.result.totalNum
            })
            console.log('传进来的数据_________________________________________________________________________')
            console.log(this.data.commentList)
          } else {
            //没有评论
            this.setData({
              commentList: [],
            })
          }
        })
      },
      [effects.ADD_COMMENT]() {
        console.log(this.data.param)
        this.$api.circle.addSignInComment(this.data.param).then(res => {
          let integral = res.data.result.integral;
          if (integral == 1) {
            wx.showToast({
              title: '+1积分',
              icon: 'none',
              duration: 1000,
              mask: true
            })
          }
          let errorCode = res.data.errorCode;
          if (errorCode == 0) {
            put(effects.GET_COMMENT_INFO);
          }
        })
      },

      [effects.ADD_COMMENT_REPLY]() {

        this.$api.circle.addSignInCommentReply(this.data.param).then(res => {
          let errorCode = res.data.errorCode;
          if (errorCode == 0) {
            put(effects.GET_COMMENT_INFO);
          }
        })
      },
      //赞
      [effects.LOAD_AVA]() {
        console.log(this.data.ava)
        this.$api.circle.getSignInLike(this.data.ava).then(res => {
          let errorCode = res.data.errorCode;
          if (errorCode == 0) {
            if (this.data.ava.currentPage == 1) {
              this.setData({
                avatarList: res.data.result.data
              })
            } else {
              avatarList: this.data.avatarList.concat(res.data.result.data)
            }
          } else if (errorCode == 100006) {
            //返回值为空
            this.setData({
              avatarList: []
            })
          }
        })
      },
      [effects.ADD_LIKE]() {
        console.log(this.data.zan)
        this.$api.circle.addSignInLike(this.data.zan).then((res) => {
          let errorCode = res.data.errorCode;
          if (errorCode == '0') {
            put(effects.LOAD_AVA);
          } else {
            // 网络请求超时，请稍后再试
          }
        });
      },
      // [effects.DEL_LIKE]() {
      //   this.$api.circle.deleteSignInLike(this.data.zan).then((res) => {
      //     let errorCode = res.data.errorCode;
      //     if (errorCode == '0') {
      //       put(effects.LOAD_AVA);
      //     } else {
      //       // 网络请求超时，请稍后再试
      //     }
      //   });
      // },
    }
  }
}

EApp.instance.register({
  type: diaryDetailPage,
  id: 'diaryDetailPage',
  config: {
    events,
    effects,
    actions
  }
});
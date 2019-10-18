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
} from './circleEditor.eea'
const base64 = require('../../../../lib/base64')
const Array = require('../../../../lib/Array')
const recorderManager = wx.getRecorderManager()
const innerAudioContext = null; // 音频对象

var time = 600;
var timer;
class circleEditorPage extends EPage {
  get data() {
    return {
      userInfo: {},
      arr: [{
        rr: "44",
        introHide: 0
      }],
      annHide: true,
      countDownTime: 600,
      toast2Hidden: true, //文本为空
      toast3Hidden: true, //数量限制
      communityContent: [], //圈子详情
      communityIntroduce: [], //圈主介绍
      communityContentForPage: [], //填充页面圈子详情，避免base64识别失败
      communityIntroduceForPage: [], //填充页面圈主介绍，避免base64识别失败
      compile: false,
      compileList: true,
      detailHidden: false,
      detailHiddenList: true,
      isSpeaking: true, //正在说话
      startSpeak: false, //开始录音
      owner_focus: false, //圈主文本获取焦点
      circle_focus: false, //圈子文本获取焦点
      audio_stop: false,
      audio_start: true,
      play: false, //播放中
      contentTextNm: 0, //圈子文本数
      contentImgNm: 0, //圈子图片数
      contentAudioNm: 0, //圈子语音数
      contentVideoNm: 0, //圈子视频数
      introduceTextNm: 0, //圈主文本数
      introducecontentImgNm: 0, //圈主图片数
      introducecontentAudioNm: 0, //圈主语音数
      introducecontentVideoNm: 0, //圈主视频数
      contentSlidlst: [], //圈子语音进度条
      introduceSlidlst: [], //圈主语音进度条
      contentSlidlstId: 0, //圈子语音进度条ID
      introduceSlidlstId: 0, //圈主语音进度条ID
      labelHide: true, //标签选择框隐藏
      hasSecondMark: 1, // 1:没有二级标签
      markDatas: '', // 一级标签数据集
      secondMarkDatas: '', // 二级标签数据集
      selectMarkIdArray: [], // 选中标签Id数组
      wechatNm: '填写微信号，让成员找到你',
      announcement: '请输入圈子公告',
      selectMarkNameData: [], // 选中标签名称数据传输数组
      currentClickMarkId: '', // 当前点击的标签ID
      communityMark: [], //选择的标签ID 接口调用
      // model: {
      //   markNamelist: ''
      // }
      isnew: true,
      issharetype: 0,
      shareCavansOptions: {
        id: 'share_canvas',
        width: 0,
        height: 0
      },

    };

  }


  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        let {
          avatar
        } = option
        if (avatar) {
          this.$api.upload.upload(avatar).then(res => {
            this.setData({
              communityHeadImg: this.$api.extparam.getFileUrl(res.key)
            });
          });
        }
        console.log(option)
        this.setData({
          communityId: option.id,
        })
        if (option.Jump == 'Jump') {
          this.setData({
            Jump: option.Jump,
          })
        }
        if (option.isnew == 'new') {
          this.setData({
            isnew: false,
            issharetype: 1
          })
        } else {
          this.setData({
            isnew: true
          })
        }
        let id = option.id;
        if (typeof id !== 'undefined') {
          this.setData({
            communityId: parseInt(id)
          })
          put(effects.LOAD_USERINFO);
          put(effects.LOAD_CIRCLE_INFO, {
            id
          });
          let firstLevelMarkData = null;
          this.$api.circle.getCommunityEnumMarks({}).then(s => {
            firstLevelMarkData = s.data.result.data;
            for (let i = 0; i < firstLevelMarkData.length; i++) {
              firstLevelMarkData[i].firstMark = '';
              firstLevelMarkData[i].secondMrk = '';
              firstLevelMarkData[i].dispalySecondMark = true;
            }
            this.setData({
              markDatas: firstLevelMarkData
            })
          })
          console.log(this.data)
          put(effects.GETSHAREINFO)
        }
        const imageUrl = this.$api.extparam.getPageImgUrl('newcircle')
        this.setData({
          img: imageUrl
        })
        const {
          shareCavansOptions
        } = this.data;
        shareCavansOptions.width = wx.getSystemInfoSync().screenWidth;
        shareCavansOptions.height = shareCavansOptions.width * 5 / 4;
        this.setData({
          shareCavansOptions
        });
      },
      [PAGE_LIFE.ON_SHOW]() {
        //获取缓存
        this.$storage.get('communityMark').then(
          (res) => {
            console.log(res)
            this.setData({
              communityMark: res.data
            })
            console.log(this.data.communityMark)
            // this.setData({
            //   'model.communityMark': this.data.communityMark.join(',')
            // })
            console.log(this.data.model)
            wx.removeStorageSync('communityMark')
          },
          (rej) => {}
        )
        this.$storage.get('markNamelist').then(
          (res) => {
            console.log(res)
            this.setData({
              markNamelist: res.data
            })
            console.log(this.data.communityMark)
            // this.setData({
            //   'model.markNamelist': this.data.markNamelist.join(',')
            // })
            console.log(this.data.model)
            wx.removeStorageSync('markNamelist')
          },
          (rej) => {}
        )
      },
      [PAGE_LIFE.ON_SHARE_APP_MESSAGE](e) {
        const {
          communityId
        } = this.data
        this.setData({
          isnew: true
        })
        const {
          from
        } = e;
        console.log(this.data)
        const {
          communityName,
          userInfo,
          shareCodeUni,
          imageUrl
        } = this.data;
        if (from === 'button') {
          console.log(shareCodeUni, imageUrl)
          return {
            title: `别问我为何进步这么快，加入学习圈，您也可以`,
            path: `/pages/course/courseList/courseList?action=share&code=${shareCodeUni}`,
            imageUrl: `${imageUrl}`,
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
      [events.ui.delShare]() {
        this.setData({
          isnew: true
        })
      },
      // 头图修改
      [events.ui.bindPhotoChange](e) {
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
              count: 1,
              success: (resp) => {
                console.log(resp.tempFilePaths[0])
                wx.redirectTo({
                  url: '../../../../upload/upload?src=' + resp.tempFilePaths[0] + '&type=subject&communityId=' + this.data.communityId
                })


                // this.$api.upload.upload(resp.tempFilePaths[0]).then(res => {
                //   this.setData({ 'pageModel.logo': this.$api.extparam.getFileUrl(res.key) });
                //   this.setData({ 'modifyModel.logo': this.$api.extparam.getFileUrl(res.key) });
                //   console.log(this.data)
                // });
              }
            })
          }
        });
      },
      // 清楚标签
      [events.ui.clearLabelTap](e) {
        //firstLevelMarkData = [];
        secondLevelMarkData = [];
        nameArray = [];
        idArray = [];
        const markDataRecord = this.data.markDatas;
        for (let i = 0; i < markDataRecord.length; i++) {
          markDataRecord[i].firstMark = '';
          markDataRecord[i].secondMark = '';
          markDataRecord[i].dispalySecondMark = true;
        }
        firstLevelMarkData = markDataRecord;

        this.setData({
          markDatas: markDataRecord,
          secondMarkDatas: '',
          selectMarkIdArray: [],
          selectMarkNameArray: '请选择(最多三个)',
          selectMarkNameData: [],
          currentClickMarkId: ''
        })
      },
      [events.ui.hedeReply](e) {
        // console.log("我执行了哦~影藏弹层");
        let type = e.currentTarget.dataset.type;
        if (type == 1) {
          this.setData({
            iptHide: true
          })
          // console.log(1)

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
      [events.ui.CHANGE_CIRCLE_NAME](e) { //圈子名称
        this.setData({
          communityName: e.detail.value
        })
        // console.log(this.data.communityName)

      },
      [events.ui.personCompile](e) {
        if (this.data.Jump) {
          wx.redirectTo({
            url: '../CircleIntroduction/CircleIntroduction?id=' + this.data.communityId + '&Jump=' + this.data.Jump,
          })
        } else {
          wx.redirectTo({
            url: '../CircleIntroduction/CircleIntroduction?id=' + this.data.communityId,
          })
        }
        // wx.redirectTo({
        //   url: '../CircleIntroduction/CircleIntroduction?id=' + this.data.communityId,
        // })
      },
      [events.ui.detailHiddenL](e) {
        if (this.data.Jump) {
          wx.redirectTo({
            url: '../MainIntroduction/MainIntroduction?id=' + this.data.communityId + '&Jump=' + this.data.Jump,
          })
        } else {
          wx.redirectTo({
            url: '../MainIntroduction/MainIntroduction?id=' + this.data.communityId,
          })
        }

      },
      [events.ui.SET_TEXT](e) {
        //调用dom  1 圈主介绍  2 圈子介绍
        let type = e.currentTarget.dataset.type;
        if (type == 1) {

          //判断圈主介绍文本数量,大于5时不让上传
          let introduceTextNm = parseInt(this.data.introduceTextNm);

          // console.log(introduceTextNm)
          if (introduceTextNm >= 5) {
            this.setData({
              toast3Hidden: false,
            });
            let _this = this;
            setTimeout(function() {
              _this.setData({
                toast3Hidden: true,
              });
            }, 2000);
            return;
          }

          //圈主介绍
          this.setData({
            communityIntroduceForPage: this.data.communityIntroduceForPage.concat([{
              contentType: 1,
              content: null,
              introHide: 0
            }]),
            communityIntroduce: this.data.communityIntroduce.concat([{
              contentType: 1,
              content: null,
              introHide: 0
            }]),
            introduceTextNm: parseInt(this.data.introduceTextNm) + 1
          })
        } else {

          //判断圈子介绍文本数量,大于3时不让上传
          let contentTextNm = parseInt(this.data.contentTextNm);
          if (contentTextNm >= 5) {
            this.setData({
              toast3Hidden: false
            });
            let _this = this;
            setTimeout(function() {
              _this.setData({
                toast3Hidden: true,
              });
            }, 2000);
            return;
          }

          //圈子详情
          this.setData({
            communityContentForPage: this.data.communityContentForPage.concat([{
              contentType: 1,
              content: null,
              introHide: 0
            }]),
            communityContent: this.data.communityContent.concat([{
              contentType: 1,
              content: null,
              introHide: 0
            }]),
            contentTextNm: parseInt(this.data.contentTextNm) + 1
          })
        }
      },

      // [events.ui.GET_CIRCLE_DETAIL](e) {
      //   let type = e.currentTarget.dataset.type;
      //   if (type == 1) {
      //     this.setData({
      //       contentDetail: e.detail.value
      //     });
      //   } else {
      //     this.setData({
      //       circleDetail: e.detail.value
      //     });
      //   }
      // },
      [events.ui.showText](e) {
        let type = e.currentTarget.dataset.type;
        let idx = e.currentTarget.dataset.idx;
        if (type == 1) {
          this.data.communityIntroduceForPage[idx].introHide = 0;
          this.setData({
            communityIntroduceForPage: this.data.communityIntroduceForPage
          })
        } else if (type == 2) {
          this.data.communityContentForPage[idx].introHide = 0;
          this.setData({
            communityContentForPage: this.data.communityContentForPage
          })
        }

      },

      [events.ui.SAVE_CIRCLEOWNER_DETAIL](e) {

        let type = e.currentTarget.dataset.type;
        if (typeof(e.detail.value) != 'undefined' && e.detail.value != '') {
          let idx = e.currentTarget.dataset.idx
          if (type == '1') {
            this.data.communityIntroduce[idx].content = base64.base64_encode(e.detail.value);
            this.data.communityIntroduceForPage[idx].content = e.detail.value
            this.data.communityIntroduceForPage[idx].introHide = 1
            this.setData({
              communityIntroduce: this.data.communityIntroduce,
              communityIntroduceForPage: this.data.communityIntroduceForPage
            })
          } else {
            this.data.communityContent[idx].content = base64.base64_encode(e.detail.value);
            this.data.communityContentForPage[idx].content = e.detail.value
            this.data.communityContentForPage[idx].introHide = 1
            this.setData({
              communityContent: this.data.communityContent,
              communityContentForPage: this.data.communityContentForPage,
              contentTextNm: parseInt(this.data.contentTextNm) + 1,
            })
          }
          // console.log(this.data.communityContentForPage)
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

      [events.ui.SET_VIDEO](e) {
        //调用dom  1 圈主介绍  2 圈子介绍
        let type = e.currentTarget.dataset.type;
        if (type == 1) {
          //判断圈主介绍视频数量,大于3时不让上传
          let introducecontentVideoNm = parseInt(this.data.introducecontentVideoNm);
          if (introducecontentVideoNm >= 3) {
            this.setData({
              toast3Hidden: false
            });
            let _this = this;
            setTimeout(function() {
              _this.setData({
                toast3Hidden: true
              });
            }, 2000);
            return;
          }
        };
        if (type == 2) {
          //判断圈子介绍视频数量,大于3时不让上传
          let contentVideoNm = parseInt(this.data.contentVideoNm);
          if (contentVideoNm >= 3) {
            this.setData({
              toast3Hidden: false
            });
            let _this = this;
            setTimeout(function() {
              _this.setData({
                toast3Hidden: true
              });
            }, 2000);
            return;
          }
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
                  if (type == '1') {
                    this.setData({
                      communityIntroduce: this.data.communityIntroduce.concat([{
                        contentType: 4,
                        content: base64.base64_encode(this.$api.extparam.getVedioUrl(res.key))
                      }]),
                      communityIntroduceForPage: this.data.communityIntroduceForPage.concat([{
                        contentType: 4,
                        content: this.$api.extparam.getVedioUrl(res.key)
                      }]),
                      introducecontentVideoNm: parseInt(this.data.introducecontentVideoNm) + 1
                    })
                  } else {
                    this.setData({
                      communityContent: this.data.communityContent.concat([{
                        contentType: 4,
                        content: base64.base64_encode(this.$api.extparam.getVedioUrl(res.key))
                      }]),
                      communityContentForPage: this.data.communityContentForPage.concat([{
                        contentType: 4,
                        content: this.$api.extparam.getVedioUrl(res.key)
                      }]),
                      contentVideoNm: parseInt(this.data.contentVideoNm) + 1
                    })
                  }
                });
              }
            })
          }
        });
      },

      [events.ui.SET_AUDIO](e) {
        //调用dom  1 圈主介绍  2 圈子介绍
        let type = e.currentTarget.dataset.type;
        if (type == 1) {
          //判断圈主介绍语音数量,大于3时不让上传
          let introducecontentAudioNm = parseInt(this.data.introducecontentAudioNm);
          if (introducecontentAudioNm >= 3) {
            this.setData({
              toast3Hidden: false
            });
            let _this = this;
            setTimeout(function() {
              _this.setData({
                toast3Hidden: true
              });
            }, 2000);
            return;
          }
        };
        if (type == 2) {
          //判断圈子介绍语音数量,大于1时不让上传
          let contentAudioNm = parseInt(this.data.contentAudioNm);
          if (contentAudioNm >= 3) {
            this.setData({
              toast3Hidden: false
            });
            let _this = this;
            setTimeout(function() {
              _this.setData({
                toast3Hidden: true
              });
            }, 2000);
            return;
          }
        };
        this.setData({
          audio_type: type,
          isSpeaking: false
        })
      },

      [events.ui.START_AUDIO](e) {
        wx.setKeepScreenOn({
          keepScreenOn: true,
        }) //不锁屏
        let that = this;
        this.setData({
          startSpeak: true
        })
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
          // console.log(res);
        })
      },

      [events.ui.STOP_AUDIO](e) {
        //调用dom  1 圈主介绍  2 圈子介绍
        let type = this.data.audio_type;
        recorderManager.stop();
        recorderManager.onStop((res) => {
          clearInterval(timer);
          this.setData({
            countDownTime: 600,
          })
          time = 600;
          this.$api.upload.upload(res.tempFilePath).then(res => {
            if (type == '1') {
              let introduceSlidlstId = this.data.introduceSlidlstId
              this.setData({
                communityIntroduce: this.data.communityIntroduce.concat([{
                  contentType: 3,
                  content: base64.base64_encode(this.$api.extparam.getVedioUrl(res.key)),
                  play: false,
                  sliderId: parseInt(introduceSlidlstId)
                }]),
                communityIntroduceForPage: this.data.communityIntroduceForPage.concat([{
                  contentType: 3,
                  content: this.$api.extparam.getVedioUrl(res.key),
                  play: false,
                  sliderId: parseInt(introduceSlidlstId)
                }]),
                introducecontentAudioNm: parseInt(this.data.introducecontentAudioNm) + 1,
                introduceSlidlstId: parseInt(this.data.introduceSlidlstId) + 1
              })
              //定义圈主详情语音进度条,使用数组角标作为ID
              let communityIntroduceId = this.data.communityIntroduceForPage.length - 1;
              this.setData({
                introduceSlidlst: this.data.introduceSlidlst.concat([{
                  id: communityIntroduceId,
                  offset: 0
                }])
              })
              // console.log(this.data.communityIntroduceForPage)
              // console.log(this.data.introduceSlidlst)
            } else {
              let contentSlidlstId = this.data.contentSlidlstId
              this.setData({
                communityContent: this.data.communityContent.concat([{
                  contentType: 3,
                  content: base64.base64_encode(this.$api.extparam.getVedioUrl(res.key)),
                  play: false,
                  sliderId: parseInt(contentSlidlstId)
                }]),
                communityContentForPage: this.data.communityContentForPage.concat([{
                  contentType: 3,
                  content: this.$api.extparam.getVedioUrl(res.key),
                  play: false,
                  sliderId: parseInt(contentSlidlstId)
                }]),
                contentAudioNm: parseInt(this.data.contentAudioNm) + 1,
                contentSlidlstId: parseInt(this.data.contentSlidlstId) + 1
              })
              //定义圈子详情语音进度条,使用数组角标作为ID
              let communityContentId = this.data.communityContentForPage.length - 1;
              this.setData({
                contentSlidlst: this.data.contentSlidlst.concat([{
                  id: communityContentId,
                  offset: 0
                }])
              })
            }
          });
          this.setData({
            isSpeaking: true,
            startSpeak: false,
            countDownTime: 600
          })
        })
      },

      [events.ui.AUDIO_PLAY](e) {
        //将页面上所有包含语音的数组play值全部换为false
        let communityContentForPage = this.data.communityContentForPage;
        for (let item of communityContentForPage) {
          if (item.contentType == 3) {
            item.play = false;
          }
        }
        let communityIntroduceForPage = this.data.communityIntroduceForPage;
        for (let item of communityIntroduceForPage) {
          if (item.contentType == 3) {
            item.play = false;
          }
        }
        this.setData({
          communityContentForPage: communityContentForPage,
          communityIntroduceForPage: communityIntroduceForPage,
        })
        if (this.innerAudioContext != null && typeof(this.innerAudioContext != 'undefind')) {
          //播放当前语音时暂停其他语音线程
          this.innerAudioContext.pause();
        }
        let idx = e.currentTarget.dataset.idx
        let audioId = "" //获取当前语音实例
        let type = e.currentTarget.dataset.type //获取当前播放类型 1 圈主  2圈子详情
        if (type == 1) {
          audioId = "introduceAudio" + idx
        } else {
          audioId = "contentAudio" + idx
        }
        this.innerAudioContext = wx.createAudioContext(audioId); // 创建音频实例 TODO实例化应该在赋值src之后才能保证当前实例下能取到总时长
        this.innerAudioContext.play(); //开始播放
        let play = e.currentTarget.dataset.play //获取当前播放状态
        if (type == 1) {
          if (!play) {
            this.data.communityIntroduceForPage[idx].play = true
            this.setData({
              communityIntroduceForPage: this.data.communityIntroduceForPage
            })
          } else {
            this.data.communityIntroduceForPage[idx].play = false
            this.setData({
              communityIntroduceForPage: this.data.communityIntroduceForPage
            })
          }
          //修改圈主当前语音播放状态
          this.setData({
            currentStopBtn: idx,
            playtype: type,
            sliderId: this.data.communityIntroduceForPage[idx].sliderId //存入当前进度条
          })
        } else {
          if (!play) {
            this.data.communityContentForPage[idx].play = true
            this.setData({
              communityContentForPage: this.data.communityContentForPage
            })
          } else {
            this.data.communityContentForPage[idx].play = false
            this.setData({
              communityContentForPage: this.data.communityContentForPage
            })
          }
          this.setData({
            playtype: type,
            currentStopBtn2: idx,
            sliderId: this.data.communityContentForPage[idx].sliderId //存入当前进度条
          })
        }
      },
      // 音频 - 暂停
      [events.ui.AUDIO_STOP](e) {
        let type = e.currentTarget.dataset.type //获取当前播放类型 1 圈主  2圈子详情
        this.innerAudioContext.pause(); //暂停
        let idx = e.currentTarget.dataset.idx //获取当前角标判断具体停止播放的语音
        let play = e.currentTarget.dataset.play //修改具体语音播放状态
        if (type == 1) {
          if (!play) {
            this.data.communityIntroduceForPage[idx].play = true
            this.setData({
              communityIntroduceForPage: this.data.communityIntroduceForPage
            })
          } else {
            this.data.communityIntroduceForPage[idx].play = false
            this.setData({
              communityIntroduceForPage: this.data.communityIntroduceForPage
            })
          }
          //修改圈主当前语音播放状态
          this.setData({
            currentStopBtn: idx
          })
        } else {
          if (!play) {
            this.data.communityContentForPage[idx].play = true
            this.setData({
              communityContentForPage: this.data.communityContentForPage
            })
          } else {
            this.data.communityContentForPage[idx].play = false
            this.setData({
              communityContentForPage: this.data.communityContentForPage
            })
          }
          this.setData({
            currentStopBtn2: idx
          })
        }
      },
      // // 音频 - 拖动进度条
      // async [events.ui.AUDIO_SLIDER_CHANGE](e) {
      //   var idx = this.data.sliderId; //获取当前进度条
      //   console.log("打印中：+++++++")
      //   console.log(e.target.dataset)
      //   console.log("打印完毕：+++++++")
      //   var playtype = this.data.playtype; //获取当前播放者类型 1 圈主 2圈子
      //   var offset = parseInt(e.detail.value);
      //   if (playtype == 1) {
      //     this.data.introduceSlidlst[idx].offset = offset;
      //     this.setData({
      //       introduceSlidlst: this.data.introduceSlidlst
      //     })
      //   } else {
      //     this.data.contentSlidlst[idx].offset = offset;
      //     this.setData({
      //       contentSlidlst: this.data.contentSlidlst
      //     })
      //   }
      // this.innerAudioContext.seek(offset);
      // },
      // 音频 - 更新进度条
      async [events.ui.AUDIO_UPDATA_PROGRESS](e) {
        var that = this;
        var idx = this.data.sliderId; //获取当前进度条
        var playtype = this.data.playtype; //获取当前播放者类型 1 圈主 2圈子
        var duration = e.detail.duration; //总时长
        var offset = e.detail.currentTime; //当前播放时长
        var lastTime = parseInt(duration - offset);
        var min = "0" + parseInt(lastTime / 60);
        var max = parseInt(e.detail.duration);
        var sec = lastTime % 60;
        if (sec < 10) {
          sec = "0" + sec;
        };
        if (playtype == 1) {
          that.data.introduceSlidlst[idx].offset = offset;
          that.data.introduceSlidlst[idx].max = max;
          that.data.introduceSlidlst[idx].audio_duration = min + ':' + sec /* 00:00 */ ;
          that.setData({
            introduceSlidlst: that.data.introduceSlidlst
          })
        } else {
          that.data.contentSlidlst[idx].offset = offset;
          that.data.contentSlidlst[idx].max = max;
          that.data.contentSlidlst[idx].audio_duration = min + ':' + sec /* 00:00 */ ;
          that.setData({
            contentSlidlst: that.data.contentSlidlst
          })
        }
      },

      [events.ui.AUDIO_PLAY_END](e) {
        var that = this;
        var idx = this.data.sliderId; //获取当前进度条
        console.log(idx)
        var playtype = this.data.playtype; //获取当前播放者类型 1 圈主 2圈子
        if (playtype == 1) {
          //获取音频状态
          let myidx = that.data.introduceSlidlst[idx].id
          that.data.communityIntroduceForPage[myidx].play = false
          that.data.introduceSlidlst[idx].offset = 0;
          that.data.introduceSlidlst[idx].audio_duration = '00:00';
          that.setData({
            introduceSlidlst: that.data.introduceSlidlst,
            communityIntroduceForPage: that.data.communityIntroduceForPage,
            currentStopBtn: myidx
          })
        } else {
          let myidx = that.data.contentSlidlst[idx].id
          that.data.communityContentForPage[myidx].play = false
          that.data.contentSlidlst[idx].offset = 0;
          that.data.introduceSlidlst[idx].contentSlidlst = '00:00';
          that.data.contentSlidlst[idx].play = false;
          that.setData({
            contentSlidlst: that.data.contentSlidlst,
            communityContentForPage: that.data.communityContentForPage,
            currentStopBtn2: myidx
          })
        }
      },

      [events.ui.UPPER](e) {
        // console.log("开始上移")
        const array = e.currentTarget.dataset.array;
        const idx = e.currentTarget.dataset.idx;
        const arrayj = e.currentTarget.dataset.arrayj;
        let type = e.currentTarget.dataset.type;
        if (type == 1) {
          this.setData({
            communityIntroduce: Array.upIndex(arrayj, idx),
            communityIntroduceForPage: Array.upIndex(array, idx)
          })
          // console.log(this.data.communityIntroduceForPage);
        } else {
          this.setData({
            communityContent: Array.upIndex(arrayj, idx),
            communityContentForPage: Array.upIndex(array, idx)
          })
        }
      },

      [events.ui.DOWN](e) {
        // console.log("开始下移")
        const array = e.currentTarget.dataset.array;
        const idx = e.currentTarget.dataset.idx;
        const arrayj = e.currentTarget.dataset.arrayj;
        let type = e.currentTarget.dataset.type;
        if (type == 1) {
          this.setData({
            communityIntroduce: Array.downIndex(arrayj, idx),
            communityIntroduceForPage: Array.downIndex.upIndex(array, idx)
          })
          // console.log(this.data.communityIntroduceForPage);
        } else {
          this.setData({
            communityContent: Array.downIndex(arrayj, idx),
            communityContentForPage: Array.downIndex(array, idx)
          })
        }
      },

      [events.ui.DEL](e) {
        // console.log("开始删除")
        const idx = e.currentTarget.dataset.idx;
        const array = e.currentTarget.dataset.array;
        const arrayj = e.currentTarget.dataset.arrayj;
        let type = e.currentTarget.dataset.type;
        let infotype = e.currentTarget.dataset.infotype;
        if (type == 1) {
          this.setData({
            communityIntroduce: Array.remove(arrayj, idx),
            communityIntroduceForPage: Array.remove(array, idx),
          })
          if (infotype == 1) {
            this.setData({
              introduceTextNm: this.data.introduceTextNm - 1
            })
          } else if (infotype == 2) {
            this.setData({
              introducecontentImgNm: this.data.introducecontentImgNm - 1
            })
          } else if (infotype == 3) {
            this.setData({
              introducecontentAudioNm: this.data.introducecontentAudioNm - 1
            })
          } else {
            this.setData({
              introducecontentVideoNm: this.data.introducecontentVideoNm - 1
            })
          }
        } else {
          this.setData({
            communityContent: Array.remove(arrayj, idx),
            communityContentForPage: Array.remove(array, idx),
          })
          if (infotype == 1) {
            this.setData({
              contentTextNm: this.data.contentTextNm - 1
            })
          } else if (infotype == 2) {
            this.setData({
              contentImgNm: this.data.contentImgNm - 1
            })
          } else if (infotype == 3) {
            this.setData({
              contentAudioNm: this.data.contentAudioNm - 1
            })
          } else {
            this.setData({
              contentVideoNm: this.data.contentVideoNm - 1
            })
          }
        }
      },

      //显示标签遮罩层
      // [events.ui.showLabel](e) {
      //   this.setData({
      //     labelHide: false
      //   })
      // },
      [events.ui.showLabel](e) {
        console.log(1)
        wx.navigateTo({
          url: '../CircleType/CircleType',
        })
      },
      //关闭标签遮罩层
      [events.ui.closeLabel](e) {
        this.setData({
          labelHide: true,
          selectMarkIdArray: []
        })
      },

      // 保存选中标签并关闭遮罩层 
      [events.ui.saveMarksAndCloseLabel](e) {
        this.setData({
          labelHide: true,
          // communityMark: (this.data.selectMarkIdArray).join(','),
          selectMarkNameArray: this.data.selectMarkNameData,
          markNamelist: selectMarkNameArray
        })
        // console.log(this.data.communityMark)
      },

      // 点击一级标签时间、   TODO
      [events.ui.firstLevelMark](e) {
        let firstMarkIds = e.currentTarget.dataset.markindex;

        if (firstLevelMarkData[firstMarkIds].firstMark == '' && this.data.markDatas[firstMarkIds].isParent != 1) {
          firstLevelMarkData[firstMarkIds].firstMark = 'la_select';
          if (idArray.length < 3) {
            nameArray.push(this.data.markDatas[firstMarkIds].markName);
            idArray.push(this.data.markDatas[firstMarkIds].markId);
            this.setData({
              selectMarkNameData: nameArray,
              selectMarkIdArray: idArray
            })
          }

          this.setData({
            markDatas: firstLevelMarkData
          })
        }
        if (this.data.markDatas[firstMarkIds].isParent == 1) {
          // 是父元素 获取二级标签
          this.setData({
            currentClickMarkId: this.data.markDatas[firstMarkIds].markId
          })
          const param = {
            parentMarkId: this.data.currentClickMarkId
          };
          this.$api.circle.getCommunityEnumMarks(param).then(res => {
            if (res.data.errorCode == '0' && res.data.result.data.length > 0) {
              // 有二级标签  secondMark
              firstLevelMarkData[firstMarkIds].secondMark = 'la_active';
              firstLevelMarkData[firstMarkIds].firstMark = '';
              // 二级标签显示出来
              firstLevelMarkData[firstMarkIds].dispalySecondMark = '';
              // 给二级标签赋值   secondMarkDatas
              secondLevelMarkData = res.data.result.data;
              for (let i = 0; i < secondLevelMarkData.length; i++) {
                secondLevelMarkData[i].hasClick = '';
              }

              this.setData({
                secondMarkDatas: secondLevelMarkData,
                markDatas: firstLevelMarkData
              })
            } else {
              if (firstLevelMarkData[firstMarkIds].firstMark == '') {
                firstLevelMarkData[firstMarkIds].firstMark = 'la_select';

                if (idArray.length < 3) {
                  nameArray.push(this.data.markDatas[firstMarkIds].markName);
                  idArray.push(this.data.markDatas[firstMarkIds].markId);
                  this.setData({
                    selectMarkNameData: nameArray,
                    selectMarkIdArray: idArray
                  })
                }

                this.setData({
                  markDatas: firstLevelMarkData
                })
              }
              this.setData({
                secondMarkDatas: ''
              })
            }
          })
        }
      },

      [events.ui.secondLevelMarkBind](e) {
        secondLevelMarkData[e.currentTarget.dataset.secondmarkindex].hasClick = 'sec_select';
        this.setData({
          secondMarkDatas: secondLevelMarkData,
        })
        if (idArray.length < 3) {
          nameArray.push(this.data.secondMarkDatas[e.currentTarget.dataset.secondmarkindex].markName);
          idArray.push(this.data.secondMarkDatas[e.currentTarget.dataset.secondmarkindex].markId);

          this.setData({
            selectMarkNameData: nameArray,
            selectMarkIdArray: idArray
          })
        }
      },

      [events.ui.CIRCLEOWNER_WECHAT](e) {
        this.setData({
          wechatNm: e.detail.value
        })
      },

      [events.ui.CIRCLE_ANNOUNCEMENT](e) {
        this.setData({
          announcement: e.detail.value,
        })
        // console.log(this.data.announcement)
      },
      [events.ui.showAnn](e) {
        this.setData({
          annHide: false
        })
        // console.log(this.data.annHide)
      },
      [events.ui.hideAnn](e) {
        this.setData({
          annHide: true
        })
        // console.log(this.data.annHide)
      },

      [events.ui.SAVE_INFO](e) {
        let communityContentForPage = this.data.communityContentForPage;
        for (let i = 0; i < communityContentForPage.length; i++) {
          if (communityContentForPage[i].contentType == 1 && communityContentForPage[i].content == null) {
            Array.remove(communityContentForPage, i);
            if (communityContentForPage.length > 0) {
              communityContentForPage.length--
            } else {
              return;
            }
          }
        }
        let communityIntroduceForPage = this.data.communityIntroduceForPage;
        for (let i = 0; i < communityIntroduceForPage.length; i++) {
          if (communityIntroduceForPage[i].contentType == 1 && communityIntroduceForPage[i].content == null) {
            Array.remove(communityIntroduceForPage, i);
            if (communityIntroduceForPage.length > 0) {
              communityIntroduceForPage.length--
            } else {
              return;
            }
          }
        }
        console.log(typeof this.data.communityMark)
        if (typeof this.data.communityMark != 'string') {
          var communityMark = this.data.communityMark.join(',')
        } else {
          var communityMark = this.data.communityMark
        }

        this.setData({
          model: {
            communityId: this.data.communityId,
            communityHeadImg: this.data.communityHeadImg,
            communityName: this.data.communityName,
            communityMark: communityMark,
            communityWechatId: this.data.wechatNm,
            communityNotice: this.data.announcement,
            communityContent: base64.array_base64_encode(this.data.communityContentForPage),
            communityIntroduce: base64.array_base64_encode(this.data.communityIntroduceForPage),

          }
        })
        console.log(this.data.model)
        // wx.redirectTo({
        //   url: '../circleEditor/circleEditor?id=' + this.data.model.communityId
        // })
        put(effects.SAVE_NEW_CIRCLE_INFO);
      },
    }
  }

  mapEffect() {
    return {
      [effects.LOAD_USERINFO]() {
        this.$api.circle.getCurrentUserInfo({}).then((res) => {
          // console.log(res.data.result)
          let errorCode = res.data.errorCode;
          if (errorCode == '0') {
            this.setData({
              "userInfo": res.data.result
            })
          }
        });
      },
      [effects.LOAD_CIRCLE_INFO]({
        id
      }) {
        this.$api.circle.getCommunityInfo(id).then(res => {
          // console.log(res.data)
          let errorCode = res.data.errorCode;
          // console.log(errorCode)
          if (errorCode == 0) {
            this.setData({
              communitySignInCount: res.data.result.communitySignInCount,
              communityUserCount: res.data.result.communityUserCount,
              communityHeadImg: res.data.result.communityHeadImg,
              communityName: res.data.result.communityName,
              markNamelist: res.data.result.marks == null ? '请选择(最多三个)' : res.data.result.marks.split(';')[0],
              communityMark: res.data.result.marks == null ? null : res.data.result.marks.split(';')[1],
              communityIntroduceForPage: res.data.result.communityIntroduce,
              wechatNm: res.data.result.weChat,
              announcement: res.data.result.communityNotice,
              communityContentForPage: res.data.result.communityContent,
              contentSlidlst: res.data.result.contentProcessBar,
              introduceSlidlst: res.data.result.introduceProcessBar,
            });


            if (res.data.result.communityIntroduce != null) {
              for (let item of res.data.result.communityIntroduce) {
                item.introHide = 1;
                // console.log(item)
                // console.log(this.data.communityIntroduceForPage)
                if (item.contentType == 1) {
                  this.setData({
                    introduceTextNm: this.data.introduceTextNm + 1
                  })
                } else if (item.contentType == 2) {
                  this.setData({
                    introducecontentImgNm: this.data.introducecontentImgNm + 1
                  })
                } else if (item.contentType == 3) {
                  this.setData({
                    introducecontentAudioNm: this.data.introducecontentAudioNm + 1
                  })
                } else {
                  this.setData({
                    introducecontentVideoNm: this.data.introducecontentVideoNm + 1
                  })
                }
                this.setData({
                  communityIntroduceForPage: res.data.result.communityIntroduce,
                });
                // console.log(this.data.communityIntroduceForPage)
              }
            }
            if (res.data.result.communityContent != null) {
              for (let item of res.data.result.communityContent) {
                item.introHide = 1;
                if (item.contentType == 1) {
                  this.setData({
                    contentTextNm: this.data.contentTextNm + 1
                  })
                } else if (item.contentType == 2) {

                  this.setData({
                    contentImgNm: this.data.contentImgNm + 1
                  })
                } else if (item.contentType == 3) {
                  this.setData({
                    contentAudioNm: this.data.contentAudioNm + 1
                  })
                } else {
                  this.setData({
                    contentVideoNm: this.data.contentVideoNm + 1
                  })
                }
                this.setData({
                  communityContentForPage: res.data.result.communityContent,
                });
              }
            }
            if (this.data.communityContentForPage.length > 0) {
              this.setData({
                communityContent: base64.array_base64_encode(res.data.result.communityContent)
              })
            }
            if (this.data.communityIntroduceForPage.length > 0) {
              this.setData({
                communityIntroduce: base64.array_base64_encode(res.data.result.communityIntroduce)
              })
            }

          } else if (errorCode == 100006) {
            //暂无数据
          }
        });
      },
     
      async [effects.GETSHAREINFO]() {
        const model = this.data
        console.log(model)
        const param = {};
        param.dataType = 4;
        param.data = {
          'communityId': model.communityId
        };
        this.$api.user.shareInfoRecord(param).then(
          (res) => {
            if (res.data.errorCode == '0') {
              const param1 = {};
              param1.dataType = 4;
              param1.data = {
                'communityId': model.communityId,
                'target': 'community',
                'shortCode': res.data.result.shortCode
              };
              this.$api.user.shareInfoRecord(param1).then(
                (res) => {
                  this.setData({
                    'shareCodeUni': res.data.result.shortCode
                  })
                  let shareInfo = {
                    communityName: model.communityName,
                    partIn: model.communityUserCount,
                    signNum: model.communitySignInCount,
                    communityHeadImg: model.communityHeadImg
                  }


                  let _this = this
                  wx.downloadFile({
                    url: model.communityHeadImg,
                    success: function (res) {
                      // 下载成功后拿到图片的路径，然后开始绘制
                      shareInfo.communityHeadImg = res.tempFilePath;
                      console.log(res.tempFilePath)
                      _this.$image.generateShareCourse(_this.data.shareCavansOptions, shareInfo, 'sign').then(res => {
                        _this.setData({
                          invitHide: false,
                          imageUrl: res
                        });
                        console.log(_this.data.shareCodeUni, _this.data.imageUrl)
                      });
                    },
                  });
                })
            }})
      },


      [effects.SAVE_NEW_CIRCLE_INFO]() {
        console.log(this.data.model)
        this.$api.circle.updateCommunity(this.data.model).then((res) => {
          console.log(this.data.isnew)
          if (this.data.Jump) {
            wx.redirectTo({
              url: '../myCircle/myCircle?id=' + this.data.model.communityId
            })
            console.log(1)
          } else {
            wx.navigateBack({
              url: '../myCircle/myCircle?id=' + this.data.model.communityId
            })
            console.log(2)
          }



        });
      }
    }
  }
}

EApp.instance.register({
  type: circleEditorPage,
  id: 'circleEditorPage',
  config: {
    events,
    effects,
    actions
  }
});
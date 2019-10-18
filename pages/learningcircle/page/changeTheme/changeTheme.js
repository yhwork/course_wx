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
} from '../changeTheme/changeTheme.eea'
const recorderManager = wx.getRecorderManager()
const base64 = require('../../../../lib/base64')
const Array = require('../../../../lib/Array')
var util = require('../../../../lib/util.js');
var tim = util.formatTime(new Date());
var time = 600;
var timer;
class changeThemePage extends EPage {
  get data() {
    return {
      clockerHide: true,
      countDownTime: 600,
      EdateSelect: false,
      SdateSelect: false,
      owner_focus: false,
      startSpeak: false,
      isSpeaking: true,
      introduceTextNm: 0, //圈主文本数
      introducecontentImgNm: 0, //圈主图片数
      introducecontentAudioNm: 0, //圈主语音数
      introducecontentVideoNm: 0, //圈主视频数
      subjectSlidlst: [], //进度条
      communitySubject: [], //日记详情
      communitySubjectForPage: [], //填充页面日记详情，避免base64识别失败
      subjectSlidlstId: 0,
      toast3Hidden: true,
      title: '请输入主题',
      startDate: tim, // 开始日期
      endDate: tim, // 结束日期
      maxSigninEndDate: ''

    };
  }


  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        console.log(option)
        if (option.type) {
          this.setData({
            model: option,
            'model.contentStatus': 1,
            'model.communityType': option.type,
            'model.communityId': option.id
          })
        }
        put(effects.QUERY_SUBJECT_INFO)
        console.log(option)
        if (this.data.model.type == 2) {
          this.setData({
            'model.level': parseInt(this.data.model.level) + 1
          })
        }
        if (this.data.model.subjectId == 0) {
          wx.setNavigationBarTitle({
            title: '创建主题'
          })
        } else {
          put(effects.GET_SUBJECT_INFO)
        }
        this.setData({
          subject_default: this.$api.extparam.getPageImgUrl('subject_default')
        })
        // put(effects.LOAD_CIRCLE_INFO, {
        //   id
        // });
        console.log(this.data)
      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      [events.ui.startDateChange](e) {
        console.log(this.data)
        if (this.data.maxSigninEndDate < e.detail.value) {
          this.setData({
            startDate: e.detail.value,
            // endDate:(e.detail.value, 'HH:mm').add('date', 1),
            SdateSelect: true,
          })
        } else {
          wx.showModal({
            title: '提示!',
            content: '该时间段已有主题',
            confirmColor: '#f29219',
            // cancelColor: '#007aff',
            confirmText: '确认',
            cancelText: '取消',
            success: function(res) {}
          })
        }
        console.log(this.data.startDate)
      },
      [events.ui.endDateChange](e) {
        // this.setData({
        //   endDate: e.detail.value,
        //   EdateSelect: true
        // })
        if (this.data.maxSigninEndDate < e.detail.value) {
          this.setData({
            endDate: e.detail.value,
            EdateSelect: true
          })
        } else {
          wx.showModal({
            title: '提示!',
            content: '该时间段已有主题',
            confirmColor: '#f29219',
            // cancelColor: '#007aff',
            confirmText: '确认',
            cancelText: '取消',
            success: function(res) {

            }
          })
        }
        console.log(this.data.endDate)
      },

      [events.ui.CHANGE_CIRCLE_NAME](e) {
        this.setData({
          communityName: e.detail.value
        })
      },

      // 文本
      [events.ui.SET_TEXT](e) {
        //移除所有其它焦点
        let communitySubjectForPage = this.data.communitySubjectForPage;
        if (typeof(communitySubjectForPage) != "undefined" && communitySubjectForPage.length > 0) {
          for (let item of communitySubjectForPage) {
            if (item.contentType == 1) {
              item.focus = false
            }
          }
        }
        //新建一个输入框
        this.setData({
          communitySubjectForPage: this.data.communitySubjectForPage.concat([{
            contentType: 1,
            content: null,
            focus: true
          }])
        })
      },
      // //文本
      [events.ui.GET_CIRCLE_DETAIL](e) {
        let type = e.currentTarget.dataset.type;
        console.log("文本内容——————————————————————————————————————————————")
        console.log(e.detail.value)
        this.setData({
          contentDetail: e.detail.value
        });
      },
      //文本保存
      [events.ui.SAVE_CIRCLEOWNER_DETAIL](e) {
        //判断圈主介绍文本数量,大于5时不让上传
        let introduceTextNm = parseInt(this.data.introduceTextNm);
        if (introduceTextNm >= 5) {
          this.setData({
            toast3Hidden: false,
            errorMessage: "文本数量不能超过5条"
          });
          let _this = this;
          setTimeout(function() {
            _this.setData({
              toast3Hidden: true
            });
          }, 2000);
          return;
        };
        if (typeof(e.detail.value) != 'undefined' && e.detail.value != '') {
          let idx = e.currentTarget.dataset.idx;
          this.data.communitySubjectForPage[idx].content = e.detail.value;
          this.data.communitySubjectForPage[idx].focus = false;
          this.setData({
            communitySubjectForPage: this.data.communitySubjectForPage,
            introduceTextNm: parseInt(this.data.introduceTextNm) + 1
          })
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

      // 图片
      [events.ui.CHANGE_AVATAR](e) {
        let type = e.currentTarget.dataset.type;
        //判断圈主介绍图片数量,大于5时不让上传
        let introducecontentImgNm = parseInt(this.data.introducecontentImgNm);
        if (introducecontentImgNm >= 5) {
          this.setData({
            toast3Hidden: false,
            errorMessage: "图片数量不能大于5"
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
                this.$api.upload.upload(resp.tempFilePaths[0]).then(res => {
                  if (type == 1) {
                    this.setData({
                      communitySubjectForPage: this.data.communitySubjectForPage.concat([{
                        contentType: 2,
                        content: this.$api.extparam.getFileUrl(res.key)
                      }]),
                      introducecontentImgNm: parseInt(this.data.introducecontentImgNm) + 1
                    })
                  } else {
                    this.setData({
                      communityHeadImg: this.$api.extparam.getFileUrl(res.key)
                    });
                  }

                });
              }
            })
          }
        });
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
                    communitySubjectForPage: this.data.communitySubjectForPage.concat([{
                      contentType: 4,
                      content: this.$api.extparam.getVedioUrl(res.key)
                    }]),
                    introducecontentVideoNm: parseInt(this.data.introducecontentVideoNm) + 1
                  })
                });
              }
            })
          }
        });
      },

      //开启录音按钮
      [events.ui.SET_AUDIO](e) {
        //调用dom  1 圈主介绍  2 圈子介绍
        //判断圈主介绍语音数量,大于3时不让上传
        let introducecontentAudioNm = parseInt(this.data.introducecontentAudioNm);
        if (introducecontentAudioNm >= 3) {
          this.setData({
            toast3Hidden: false,
            errorMessage: "录音数量不能超过3条"
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
        recorderManager.onError((res) => {})
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
      //公众号文章
      [events.ui.add_public](e) {
        wx.showModal({
          title: '提示',
          content: '该功能正在开发中，敬请期待！',
          showCancel: true,
          confirmColor: '#FF4500',
          success: function(res) {
            if (res.confirm) {

            }
          }
        })
      },

      //录音结束
      [events.ui.STOP_AUDIO](e) {
        //调用dom  1 圈主介绍  2 圈子介绍
        recorderManager.stop();
        recorderManager.onStop((res) => {
          clearInterval(timer);
          this.setData({
            countDownTime: 600,
          })
          time = 600;
          this.$api.upload.upload(res.tempFilePath).then(res => {
            this.setData({
              communitySubjectForPage: this.data.communitySubjectForPage.concat([{
                contentType: 3,
                content: this.$api.extparam.getVedioUrl(res.key),
                play: false,
                sliderId: parseInt(this.data.subjectSlidlstId),
                subjectSlidlstId: this.data.subjectSlidlstId + 1
              }]),
              introducecontentAudioNm: parseInt(this.data.introducecontentAudioNm) + 1
            })
            //定义圈主详情语音进度条,使用数组角标作为ID
            let communityIntroduceId = this.data.communitySubjectForPage.length - 1;
            this.setData({
              subjectSlidlst: this.data.subjectSlidlst.concat([{
                id: communityIntroduceId,
                offset: 0
              }])
            })
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

      [events.ui.UPPER](e) {
        const array = e.currentTarget.dataset.array;
        const idx = e.currentTarget.dataset.idx;
        const arrayj = e.currentTarget.dataset.arrayj;
        let type = e.currentTarget.dataset.type;
        this.setData({
          communitySubject: Array.upIndex(arrayj, idx),
          communitySubjectForPage: Array.upIndex(array, idx)
        })
      },

      [events.ui.DOWN](e) {
        const array = e.currentTarget.dataset.array;
        const idx = e.currentTarget.dataset.idx;
        const arrayj = e.currentTarget.dataset.arrayj;
        this.setData({
          communitySubject: Array.downIndex(arrayj, idx),
          communitySubjectForPage: Array.downIndex(array, idx)
        })
      },

      [events.ui.DEL](e) {
        const idx = e.currentTarget.dataset.idx;
        const array = e.currentTarget.dataset.array;
        const arrayj = e.currentTarget.dataset.arrayj;
        const contentType = e.currentTarget.dataset.contenttype;
        if (contentType == 1) {
          //文本数量减少1
          this.setData({
            introduceTextNm: this.data.introduceTextNm - 1
          })
        } else if (contentType == 2) {
          //图片数量减少
          this.setData({
            introducecontentImgNm: this.data.introducecontentImgNm - 1
          })
        } else if (contentType == 3) {
          //音频
          this.setData({
            introducecontentAudioNm: this.data.introducecontentAudioNm - 1
          })
        } else {
          //视频
          this.setData({
            introducecontentVideoNm: this.data.introducecontentVideoNm - 1
          })
        }
        this.setData({
          communitySubject: Array.remove(arrayj, idx),
          communitySubjectForPage: Array.remove(array, idx),
        })
      },

      [events.ui.SAVE_INFO](E) {
        this.setData({
          errorMessage: ""
        })
        if (this.data.communityHeadImg == '' || this.data.communityHeadImg == null || typeof(this.data.communityHeadImg) == "undefined") {
          //错误提示之主题头图不能为空
          this.setData({
            communityHeadImg: this.data.subject_default
          })
          /*let _this = this;
          this.setData({
            toast3Hidden: false,
            errorMessage: "主题头像不能为空"
          })
          setTimeout(function () {
            _this.setData({
              toast3Hidden: true
            });
          }, 2000);
          return;*/
        }
        if (this.data.communityName == '' || this.data.communityName == null || typeof(this.data.communityName) == "undefined") {
          //标题不能为空
          let _this = this;
          this.setData({
            toast3Hidden: false,
            errorMessage: "主题标题不能为空"
          })
          setTimeout(function() {
            _this.setData({
              toast3Hidden: true
            });
          }, 2000);
          return;
        }

        //将空文本去掉
        let communitySubjectForPage = this.data.communitySubjectForPage;
        for (let i = 0; i < communitySubjectForPage.length; i++) {
          if (communitySubjectForPage[i].contentType == 1 && communitySubjectForPage[i].content == null) {
            Array.remove(communitySubjectForPage, i);
            communitySubjectForPage.length--
          }
        }
        console.log(this.data)
        this.setData({
          param: {
            picture: this.data.communityHeadImg,
            title: this.data.communityName,
            contents: base64.array_base64_encode(communitySubjectForPage),
            communityId: this.data.model.id,
            signinStartDate: this.data.startDate,
            signinEndDate: this.data.endDate,
            communityType: this.data.model.communityType
          }
        })
        console.log(this.data.model)
        console.log(this.data.param)
        if (this.data.model.type !== "null") {
          // 普通关卡
          if (this.data.model.subjectId == 0) {
            //调用新建接口
            if (this.data.model.type == 1) {
              if (this.data.startDate < this.data.maxSigninEndDate || this.data.endDate < this.data.maxSigninEndDate) {
                //标题不能为空
                let _this = this;
                this.setData({
                  toast3Hidden: false,
                  errorMessage: "重新选择时间"
                })
                setTimeout(function() {
                  _this.setData({
                    toast3Hidden: true
                  });
                }, 2000);
                return;
              }
            }


            console.log("调用新建接")
            put(effects.SAVE_NEW_SUBJECT_INFO)
          } else {
            //调用更新接口
            console.log("调用更新接口")
            this.setData({
              'param.subjectId': this.data.model.subjectId
            })
            put(effects.CHANGE_SUBJECT_INFO)
          }
          // this.setData({
          //   'param. communityType': this.data.model.type,
          // })
        }
        // else{
        //   wx.navigateTo({
        //     url: '../SubjectType/SubjectType?communityId=' + this.data.param.communityId + '&picture=' + this.data.param.picture + '&signinEndDate=' + this.data.param.signinEndDate + '&signinStartDate=' + this.data.param.signinStartDate + '&title=' + this.data.param.title
        //   })
        // }
        // console.log(this.data.param)
      },

    }
  }

  mapEffect() {
    return {
      [effects.CHANGE_SUBJECT_INFO]() {
        let _this = this;
        //调用接口时
        console.log(this.data.param)
        this.$api.circle.updateSubject(this.data.param).then((res) => {
          let errorCode = res.data.errorCode;
          if (errorCode == 0) {


            wx.navigateBack({})
          } else {
            //保存主题失败
            let errorMessage = res.data.errorMessage;
            this.setData({
              toast3Hidden: true,
              errorMessage: errorMessage
            })
            setTimeout(function() {
              _this.setData({
                toast3Hidden: true
              });
            }, 2000);
          }
        });
      },
      [effects.QUERY_SUBJECT_INFO]() {
        this.$api.circle.readyCreateSubject(this.data.model).then((res) => {
          let errorCode = res.data.errorCode;
          console.log(res.data.result)
          if (errorCode == 0) {
            this.setData({
              maxSigninEndDate: res.data.result.maxSigninEndDate
            })
          }
        });

      },
      [effects.SAVE_NEW_SUBJECT_INFO]() {
        let _this = this;
        //调用接口时
        console.log(this.data.param)
        console.log("重新建立")
        this.$api.circle.createSubject(this.data.param).then((res) => {
          let errorCode = res.data.errorCode;
          if (errorCode == 0) {
            wx.navigateBack({})
          } else {
            //保存主题失败
            let errorMessage = res.data.errorMessage;
            _this.setData({
              toast3Hidden: false,
              errorMessage: errorMessage
            })
            setTimeout(function() {
              _this.setData({
                toast3Hidden: true
              });
            }, 2000);
            return
          }
        });
      },
      [effects.GET_SUBJECT_INFO]() {
        this.$api.circle.getSubjectInfo(this.data.model).then((res) => {
          let errorCode = res.data.errorCode;


          if (errorCode == 0) {
            this.setData({
              communityHeadImg: res.data.result.picture,
              communityName: res.data.result.title,
              startDate: res.data.result.signinStartDate,
              endDate: res.data.result.signinEndDate,
              SdateSelect: true,
              EdateSelect: true,
              title: res.data.result.title,
              level: res.data.result.level
            });
            if (res.data.result.contentList != null) {
              this.setData({
                communitySubjectForPage: res.data.result.contentList,
                subjectSlidlst: res.data.result.audio,
              })
              for (let item of res.data.result.contentList) {
                if (item.contentType == 1) {
                  this.setData({
                    introduceTextNm: parseInt(this.data.introduceTextNm) + 1
                  })
                }
                if (item.contentType == 2) {
                  this.setData({
                    introducecontentImgNm: parseInt(this.data.introducecontentImgNm) + 1
                  })
                }
                if (item.contentType == 3) {
                  this.setData({
                    introducecontentAudioNm: parseInt(this.data.introducecontentAudioNm) + 1
                  })
                }
                if (item.contentType == 4) {
                  introducecontentVideoNm: parseInt(this.data.introducecontentVideoNm) + 1
                }
              }
            }
          }
        });
      }
    }
  }
}

EApp.instance.register({
  type: changeThemePage,
  id: 'changeThemePage',
  config: {
    events,
    effects,
    actions
  }
});
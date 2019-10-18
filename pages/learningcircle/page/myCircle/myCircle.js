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
} from './myCircle.eea'
const Array = require('../../../../lib/Array')
const COMMENT = require('../../../circle/circle.js')
var communityId;
var that = this;
var sharePath;
const innerAudioContext = null; // 音频对象
const audioPlay = require("../../../../lib/audioPlay");
const base64 = require('../../../../lib/base64')
const recorderManager = wx.getRecorderManager()
var timer;
var time = 600;
class myCirclePage extends EPage {
  get data() {
    return {
      // videoHidden: true,
      integral: '',
      userInfo: {},
      childList: {},
      circleAttentionModel: {},
      hasShowCircleOwnerAttention: '', // 是否隐藏圈主关注
      circleOwnerAttentionNum: 0, // 没有关注
      commentList: [], //评论
      avatarList: [], //赞
      modalHidden: true,
      invitHide: true,
      flag: true, //投诉显示
      nav_tab: ["圈子日记", "圈子成员"],
      currentTab: 0,
      communityIntroduceForPage: [],
      communitySubjectForPage: [],
      introduceSlidlst: [],
      subjectSlidlst: [],
      members: [],
      communitySigninListForPage: [],
      pageSize: 10,
      membercurrentPage: 1,
      memberList: [],
      communitySigninPage: 1,
      role: {
        member: false, //上级页面带参 圈主：加载所有功能
        master: false, //成员： 显示+打卡
        tourist: false //游客： 加入圈子
      },
      clockerHihe: true,
      subjectId: "",
      choseFlag: true,
      show: true,
      FIREST: true,
      shareCavansOptions: {
        id: 'share_canvas',
        width: 0,
        height: 0
      },

      shareType: 1,
      iptHide: true, //评论
      shareHide: true, //分享
      replyHide: true, //回复
      isSpeaking: true, //隐藏正在说话
      voiceFlag: true, //语音回复显示，先隐藏掉
      delHide: true,
      isShare: 0, //加入圈子选择分享方式
      playid: ''
    };
  }


  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        let id = option.id;
        if (typeof id !== 'undefined') {
          id = parseInt(id);
          this.communityId = id
          this.setData({
            today: {
              communityId: id
            }
          })
          put(effects.LOAD_CIRCLE_MEM, {});
          put(effects.LOAD_SING_RECORD_ALLLIST, {});
          put(effects.GET_TODAY_SUBJECT, {});
          put(effects.GENERAGE_CODE);
          put(effects.LOAD_USERINFO);
          let systemTime = getNowTime();
          this.setData({
            systemTime: systemTime
          })
        }


        let self = this;
        wx.getSystemInfo({
          success: function(res) {
            let scrollH = res.windowHeight;
            self.setData({
              scrollH: scrollH
            });
          }
        })

        const {
          shareCavansOptions
        } = this.data;
        shareCavansOptions.width = wx.getSystemInfoSync().screenWidth;
        shareCavansOptions.height = shareCavansOptions.width * 5 / 4;
        this.setData({
          shareCavansOptions
        });
        this.setData({
          img: this.$api.extparam.getPageImgUrl('boyb'),
        })
      },
      [PAGE_LIFE.ON_SHOW](option) {
        console.log(option)
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
        wx.hideShareMenu();
        let id = this.data.today.communityId
        put(effects.LOAD_CIRCLE_INFO, {
          id
        });
        put(effects.LOAD_CIRCLE_MEM, {});
        put(effects.LOAD_SING_RECORD_ALLLIST, {});
        put(effects.GET_TODAY_SUBJECT, {});
        put(effects.GENERAGE_CODE);
        put(effects.LOAD_USERINFO);
        let systemTime = getNowTime();
        this.setData({
          systemTime: systemTime
        })
        put(effects.LOAD_IS_BIND_PHONE);
      },
      [PAGE_LIFE.ON_SHARE_APP_MESSAGE](e) {
        const model = this.data.model
        const {
          from
        } = e;
        this.setData({
          shareHide: true
        })
        const {
          userInfo,
          shareCodeUni,
          imageUrl,
        } = this.data

        if (from === 'button') {
          console.log(imageUrl)
          if (this.data.isShare == 0) {
            return {
              title: '别问我为何进步这么快，加入学习圈，您也可以',
              path: `/pages/course/courseList/courseList?action=share&code=${shareCodeUni}`,
              imageUrl: `${imageUrl}`,
              success: (res) => {
                this.$common.showToast('分享成功', 'success')
                console.log(2)
              }
            }
          }
          if (this.data.isShare == 1) {
            return {
              title: '别问我为何进步这么快，加入学习圈，您也可以',
              path: `/pages/course/course?action=share&code=${shareCodeUni}`,
              imageUrl: `${imageUrl}`,
              success: (res) => {
                this.$common.showToast('分享成功', 'success')
                console.log('---------------')
              },
              fail: res => {

              }
            }
          }
        }
      },
      [PAGE_LIFE.ON_REACH_BOTTOM](option) {
        let communitySigninPage = this.data.communitySigninPage + 1;
        this.setData({
          communitySigninPage: communitySigninPage
        })
        put(effects.LOAD_SING_RECORD_ALLLIST);
      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      [events.ui.PLAY_START](e) {
        this.setData({
          playid: e.currentTarget.dataset.outindex
        })
        console.log(this.data.playid)
        this.videoContext = wx.createVideoContext('myVideo')
        this.videoContext.play()
      },
      // 点赞
      [events.ui.ALLZAN](e) {
        let like = e.currentTarget.dataset.like;
        let signId = e.currentTarget.dataset.id;
        // console.log(e.currentTarget.dataset);
        if (like == 0) {
          this.data.communitySigninListForPage[e.currentTarget.dataset.idx].likeNum += 1; //点赞数
          this.data.communitySigninListForPage[e.currentTarget.dataset.idx].isLike = 1
          this.setData({
            communitySigninListForPage: this.data.communitySigninListForPage,
            zan: {
              signInId: signId,
              zanIndex: e.currentTarget.dataset.idx
            },
            // commentsId: e.currentTarget.dataset.idx
          })
          console.log(this.data.zan.signInId)
          put(effects.ADD_ALL_LIKE)
        }
      },
      [events.ui.DIARY_PLAY_AUDIO](e) {
        let _this = this;
        audioPlay.PLAY_AUDIO(_this, e);
      },
      [events.ui.DIARY_PLAY_AUDIO_END](e) {
        let _this = this;
        audioPlay.PLAY_AUDIO_END(_this, e);
      },
      [events.ui.DIARY_AUDIO_UPDATA_PROGRESS](e) {
        let _this = this;
        audioPlay.AUDIO_UPDATA_PROGRESS(_this, e);
      },
      [events.ui.DIARY_STOP_AUDIO](e) {
        let _this = this;
        audioPlay.STOP_AUDIO(_this, e);
      },
      // // 播放视频：
      // [events.ui.playVideo](e) {
      //   this.setData({
      //     videoHidden: false
      //   })
      //   var videoContext = wx.createVideoContext('myvideo', this);
      //   videoContext.play();
      //   console.log(videoContext)
      //   videoContext.requestFullScreen(); //执行全屏方法
      // },  
      [events.ui.EDITOR]() {
        console.log(this.data.model)

        if (this.data.model.isOwner == 1) {
          wx.navigateTo({
            url: '../circleEditor/circleEditor?id=' + this.data.model.communityId
          })
        } else {
          wx.navigateTo({
            url: '../CircleDetails/CircleDetails?id=' + this.data.model.communityId
          })
        }

      },
      //创建主题
      // [events.ui.CreateThemes]() {
      //   console.log(this.data.model.communityId)
      //   wx.navigateTo({
      //     url: '../../ pages / learningcircle / page / changeTheme / changeTheme ? id =' +  this.data.model.communityId + '& type=' +  this.data.model.communityType+'& subjectId='+0+' & level='+this.data.model.level+'&change='+0
      //   })
      // },
      //日记列表
      // [events.ui.SIGNINPAGEPLUS]() {
      //   let communitySigninPage = this.data.communitySigninPage + 1;
      //   this.setData({
      //     communitySigninPage: communitySigninPage
      //   })
      //   put(effects.LOAD_SING_RECORD_ALLLIST)
      // },
      //图片预览
      // [events.ui.PREVIEWIMAGE](e) {
      //   let src = e.currentTarget.dataset.src;
      //   let srcList = e.currentTarget.dataset.imglist;
      //   if (!e.currentTarget.dataset.logo) {
      //     let index = e.currentTarget.dataset.index;
      //     wx.previewImage({
      //       current: srcList[index],
      //       urls: srcList,
      //     })
      //   } else {
      //     let imgArr = [];
      //     let communityHeadImg = this.data.model.communityHeadImg
      //     imgArr.push(communityHeadImg)
      //     wx.previewImage({
      //       current: src,
      //       urls: imgArr,
      //     })
      //   }
      // },
      //跳转详情页

      // 关注圈主
      [events.ui.bindCircleOwnerAttention](e) {
        put(effects.circleOwnerAttention);
      },
      [events.ui.CHANGE_TAB](e) { //切换tab
        var idx = e.currentTarget.dataset.idx;
        this.setData({
          currentTab: idx
        })
      },
      [events.ui.SHOW_HIDE_C](e) { //显示隐藏投诉
        var shORhi = e.currentTarget.dataset.shorhi;
        var idx = e.currentTarget.dataset.idx;
        var toast_hide = 'diarys[' + idx + '].toast_hide';
        if (shORhi) {
          this.setData({
            [toast_hide]: false
          })
        } else {
          this.setData({
            [toast_hide]: true
          })
        }
      },

      // [events.ui.PAGEPLUS](e) {
      //   let membercurrentPage = this.data.membercurrentPage + 1;
      //   this.setData({
      //     membercurrentPage: membercurrentPage
      //   })
      //   put(effects.LOAD_CIRCLE_MEM, {});
      // },
      [events.ui.ESTOP](e) {
        return false
      },
      [events.ui.SHOW_INVIT](e) {
        this.setData({
          invitHide: false
        })
      },
      [events.ui.HIDE_INVIT](e) {
        this.setData({
          invitHide: true
        })
      },

      [events.ui.SIGNLIKE](e) {
        console.log(e)
        let targetUserId = e.currentTarget.dataset.targetuserid;
        let isFollow = e.currentTarget.dataset.like;
        let idx = e.currentTarget.dataset.idx;
        let list = this.data.communitySigninListForPage;
        for (let item of list) {
          if (item.signInUserId == targetUserId) {
            if (isFollow == 0) {
              item.isFollow = 1
            } else {
              item.isFollow = 0
            }
          }
        };
        this.setData({
          communitySigninListForPage: list,
          attentionModel: {
            targetUserId: targetUserId
          }
        })
        put(effects.UPDATE_FANS_STATUS)
      },

      [events.ui.MORE](e) {
        let flag = e.currentTarget.dataset.flag
        let idx = e.currentTarget.dataset.idx
        this.data.communitySigninListForPage[idx].flag = !flag
        this.setData({
          communitySigninListForPage: this.data.communitySigninListForPage
        })
        put(COMMENT.ceshi)
      },
      [events.ui.REPORT_SIGN](e) {
        wx.navigateTo({
          url: '../complain/complain?signInId=' + e.currentTarget.dataset.signid
        })
      },
      [events.ui.ZAN](e) {
        let like = e.currentTarget.dataset.like;
        let signId = e.currentTarget.dataset.id;
        if (like == 0) {
          this.data.communitySigninListForPage[e.currentTarget.dataset.idx].likeNum += 1;
          this.data.communitySigninListForPage[e.currentTarget.dataset.idx].isLike = 1
          this.setData({
            communitySigninListForPage: this.data.communitySigninListForPage,
            zan: {
              signInId: signId
            }
          })
          put(effects.ADD_LIKE)
        } else {
          this.data.communitySigninListForPage[e.currentTarget.dataset.idx].likeNum -= 1;
          this.data.communitySigninListForPage[e.currentTarget.dataset.idx].isLike = 0
          this.setData({
            communitySigninListForPage: this.data.communitySigninListForPage,
            zan: {
              signInId: signId
            }
          })
          put(effects.DEL_LIKE)
        }
      },
      //报错弹框隐藏
      [events.ui.modalChange]() {
        this.setData({
          modalHidden: true
        })
      },
      [events.ui.showClocker](e) {
        if (this.data.isValid == 'false') {
          wx.showModal({
            title: '提示',
            content: '圈子已过期',
          })
          return;
        }
        console.log(this.data.childrenDatas)
        if (this.data.childrenDatas == '' || this.data.childrenDatas.length == 0) {
          wx.showModal({
            title: '提示',
            content: '您还没有孩子哦~',
          })
          return;
        }
        this.setData({
          clockerHihe: false
        })
      },
      // 取消分享
      [events.ui.modalCandel]() {
        this.setData({
          shareHide: true
        })
      },
      [events.ui.exitCircle](e) {
        console.log(e.currentTarget.dataset)
        let _this = this
        wx: wx.showModal({
          title: '提示',
          content: '确定退出圈子？',
          confirmColor:'#f29219',
          success: function(res) {
            let inputMap = {
              communityId: _this.data.model.communityId,
              status: 5,
              targetUserId: e.currentTarget.dataset.id,
              id: e.currentTarget.dataset.communityuserid
            }
            _this.$api.circle.updateCommunityMemberStatus(inputMap).then(res => {
              // console.log(res.data.result)
              if (res.data.errorCode == '0') {
                wx: wx.navigateBack({
                  delta: 1,
                })
              }
            })
          },
        })

      },

      // 打卡者
      [events.ui.closeClocker](e) {
        console.log(e)
        if (e.currentTarget.dataset.childid) {
          console.log(e.currentTarget.dataset.childid)
        }
        const currentIndex = e.currentTarget.dataset.index;
        let childrenDatas = this.data.childrenDatas;
        if (childrenDatas !== '') {
          this.setData({
            clockerS: true
          })
        }
        this.setData({
          //关闭标签遮罩层
          clockerHihe: true
        })
        //选择完标签直接发申请
        if (e.currentTarget.dataset.childid) {
          let childId = e.currentTarget.dataset.childid;
          if (childId == null || typeof(childId) == 'undefined') {
            this.setData({
              modalHidden: false,
              errorMsg: "您还未选择打卡者，请选择打卡者后申请"
            });
            return;
          } else {
            this.setData({
              joinParam: {
                childId: childId,
                communityId: this.communityId
              }
            })
          }
        } else {
          this.setData({
            joinParam: {
              communityId: this.communityId
            }
          })
        }
        console.log(this.data.joinParam)
        this.setData({
          shareHide: false,
          isShare: 1
        })
        put(effects.JOIN)
      },

      [events.ui.complainCircle]() {
        console.log(this.communityId)
        wx: wx.navigateTo({
          url: '../complain/complain?communityId=' + this.communityId + '&type=circle',
        })
      },
      [events.ui.RESTART](e) {
        this.setData({
          clockerHihe: true
        });
      },
      [events.ui.SAVE]() {},
      [events.ui.getPhoneNumber](e) {
        if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
          return;
        } else {
          this.setData({
            'model.iv': e.detail.iv,
            'model.encryptedData': e.detail.encryptedData
          })
          put(effects.updateUserPhoneByWX);
        }
      },
      // 显示分享弹层
      // [events.ui.showShareWin](e) {
      //   this.setData({
      //     shareType: 0
      //   })
      //   console.log(e.currentTarget.dataset.shareindex)
      //   let shareindex = e.currentTarget.dataset.shareindex
      //   console.log(shareindex)

      //   let shareInfo = this.data.communitySigninListForPage[shareindex];
      //   this.setData({
      //     shareInfo: shareInfo
      //   })
      //   console.log(shareInfo)
      //   const param = {};
      //   param.dataType = 5;
      //   console.log(shareInfo.signInId)
      //   param.data = {
      //     'signinId': shareInfo.signInId
      //   };
      //   this.$api.user.shareInfoRecord(param).then(
      //     (res) => {
      //       console.log(res)
      //       if (res.data.errorCode == '0') {

      //         const param1 = {};
      //         param1.dataType = 0;
      //         param1.data = {
      //           'signinId': shareInfo.signInId,
      //           'target': 'sign',
      //           'shortCode': res.data.result.shortCode
      //         };
      //         console.log(res)
      //         this.$api.user.shareInfoRecord(param1).then(
      //           (res) => {
      //             console.log(res)
      //             shareInfo.shortCode = res.data.result.shortCode;
      //             console.log(this.data.shareCavansOptions, shareInfo)
      //             this.$image.generateShareCourse(this.data.shareCavansOptions, shareInfo, 'sign').then(imageUrl => {
      //               console.log(res)
      //               shareInfo.imageUrl = imageUrl;
      //               this.setData({
      //                 invitHide: false,
      //                 shareInfo
      //               });
      //             });
      //           }
      //         )
      //       } else {
      //         this.$common.showMessage(this, res.data.errorMessage);
      //         return;
      //       }
      //     }
      //   )
      // },


      [events.ui.GOTO_ADDDIARY](e) {
        wx.navigateTo({
          url: '../addDiary/addDiary?id=' + this.data.subjectId + '&communityId=' + this.data.model.communityId
        })
      },
      // 删除评论
      [events.ui.DEL_REPLY](e) {
        // console.log(this.data.isdel)
        if (this.data.isdel) {
          let inputMap = {
            id: this.data.delid
          }
          console.log(inputMap)
          this.$api.circle.deleteSignCommentReply(inputMap).then((res) => {
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 1000
            })
            this.setData({
              delHide: true
            })
            put(effects.LOAD_SING_RECORD_ALLLIST);
          })
        } else {
          let inputMap = {
            commentId: this.data.commentId
          }
          console.log(inputMap)
          this.$api.circle.deleteSignInComment(inputMap).then((res) => {
            console.log(res)
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 1000
            })
            this.setData({
              delHide: true
            })
            put(effects.LOAD_SING_RECORD_ALLLIST);
          })
        }

      },
      [events.ui.NODEL_REPLY](e) {
        this.setData({
          delHide: true
        })
      },
      // 删除日记
      [events.ui.DEL_DIARY](e) {
        console.log(e.currentTarget.dataset);
        let _this = this;
        wx.showModal({
          title: '提示',
          content: '确认删除该条日记？',
          success(res) {
            if (res.confirm) {
              let inputMap = {
                signInId: e.currentTarget.dataset.signid
              }
              _this.$api.circle.deleteSignIn(inputMap).then((res) => {
                console.log(res)
                let errorCode = res.data.errorCode;
                if (errorCode == 0) {
                  // put(effects.LOAD_SING_RECORD_ALLLIST)
                  let num = e.currentTarget.dataset.indexs
                  _this.data.communitySigninListForPage.splice(num, 1)
                  _this.setData({
                    communitySigninListForPage: _this.data.communitySigninListForPage,
                  })
                }
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })

      },
      [events.ui.AUDIO_PLAY](e) {
        //将页面上所有包含语音的数组play值全部换为false
        let index = e.currentTarget.dataset.index;
        this.setData({
          audioIndex: e.currentTarget.dataset.index
        })
        // let communityDiaryForPage = this.data.communitySigninListForPage[index].communitySigninForPage;
        let communityDiaryForPage = this.data.communitySigninListForPage;
        console.log(communityDiaryForPage)
        if (typeof(communityDiaryForPage) != "undefined" && communityDiaryForPage.length > 0) {
          for (let item of communityDiaryForPage) {
            console.log(item.communitySigninForPage[0].contentType)
            if (item.communitySigninForPage[0].contentType == 3) {
              item.communitySigninForPage[0].play = false;
            }
            if (item.commentList != null) {
              let commentList = item.commentList;
              console.log(item.commentList)
              if (typeof(commentList) != "undefined" && commentList.length > 0) {
                for (let item of commentList) {
                  item.play = false;
                  if (item.replyList != null && typeof(item.replyList.list) != "undefined" && item.replyList.list.length > 0) {
                    console.log(item.replyList)
                    for (let innerItem of item.replyList.list) {
                      console.log(innerItem)
                      innerItem.play = false
                    }
                  }
                }
              }
            }
          };
          this.setData({
            communitySigninListForPage: communityDiaryForPage,
          })
        }
        let commentList = this.data.communitySigninListForPage[index].commentList;
        this.setData({
          commentList: commentList
        })
        console.log("查看播放后的PLAY")
        // console.log(this.data.commentList)
        if (this.innerAudioContext != null && typeof(this.innerAudioContext != 'undefind')) {
          //播放当前语音时暂停其他语音线程
          this.innerAudioContext.pause();
          // console.log('!!!!!!!!!!!!!!!!!!!!!!!!!')
        }
        let type = e.currentTarget.dataset.type;
        let idx = e.currentTarget.dataset.idx
        let audioId = '' //获取当前语音实例   
        // console.log(type, idx)
        if (type == 1) {
          console.log(e.currentTarget.dataset.inneridx)
          console.log(type)
          audioId = index + "replay" + idx + "Audio" + e.currentTarget.dataset.inneridx
        } else if (type == 2) {
          // console.log(type)
          audioId = index + "commentAudio" + idx
        }
        console.log(audioId)
        this.innerAudioContext = wx.createAudioContext(audioId); // 创建音频实例 TODO实例化应该在赋值src之后才能保证当前实例下能取到总时长
        this.innerAudioContext.play(); //开始播放
        if (type == 1) {
          console.log(this.data.communitySigninListForPage[index].commentList[idx].replyList.list[e.currentTarget.dataset.inneridx])

          this.data.communitySigninListForPage[index].commentList[idx].replyList.list[e.currentTarget.dataset.inneridx].play = true;
          this.data.commentList[idx].replyList.list[e.currentTarget.dataset.inneridx].play = true;
          console.log('222222222222222222')
          this.setData({
            communitySigninListForPage: this.data.communitySigninListForPage,
            commentList: this.data.commentList
          })
          this.setData({
            replayAudio: {
              idx: idx,
              inneridx: e.currentTarget.dataset.inneridx
            }
          })
        } else if (type == 2) {
          // console.log('11111111111111111111111111')
          this.data.communitySigninListForPage[index].commentList[idx].play = true;
          this.data.commentList[idx].play = true;
          this.setData({
            communitySigninListForPage: this.data.communitySigninListForPage,
            commentList: this.data.commentList
          })
          //存储播放状态
          this.setData({
            commentAudio: {
              idx: idx
            }
          })
        }
        this.setData({
          playType: type
        })
        console.log(this.data.playType)
      },

      // 语音结束
      [events.ui.AUDIO_STOP](e) {
        this.innerAudioContext.pause(); //暂停
        let idx = e.currentTarget.dataset.idx //获取当前角标判断具体停止播放的语音
        let play = e.currentTarget.dataset.play //修改具体语音播放状态

        let type = e.currentTarget.dataset.type;
        var index = e.currentTarget.dataset.index
        console.log(index)
        if (type == 1) {
          this.data.commentList[idx].replyList.list[e.currentTarget.dataset.inneridx].play = false;
          this.data.communitySigninListForPage[index].commentList[idx].replyList.list[e.currentTarget.dataset.inneridx].play = false;
          this.setData({
            communitySigninListForPage: this.data.communitySigninListForPage,
            commentList: this.data.commentList
          })

        } else if (type == 2) {
          this.data.commentList[idx].play = false;
          this.data.communitySigninListForPage[index].commentList[idx].play = false;
          this.setData({
            communitySigninListForPage: this.data.communitySigninListForPage,
            commentList: this.data.commentList
          })
        }
      },
      // 语音播放进度
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
        if (playType == 2) {
          let commentAudioidx = that.data.commentAudio.idx;
          that.data.commentList[commentAudioidx].audio_duration = min + ':' + sec /* 00:00 */ ;
          that.data.communitySigninListForPage[this.data.audioIndex].commentList[commentAudioidx].audio_duration = min + ':' + sec /* 00:00 */ ;
          that.setData({
            communitySigninListForPage: this.data.communitySigninListForPage,
            commentList: that.data.commentList
          })
        } else if (playType == 1) {
          let replayAudioidx = that.data.replayAudio.idx;
          let replayAudioinneridx = that.data.replayAudio.inneridx;

          that.data.commentList[replayAudioidx].replyList.list[replayAudioinneridx].audio_duration = min + ':' + sec /* 00:00 */ ;
          that.data.communitySigninListForPage[this.data.audioIndex].commentList[replayAudioidx].replyList.list[replayAudioinneridx].audio_duration = min + ':' + sec /* 00:00 */ ;
          that.setData({
            communitySigninListForPage: this.data.communitySigninListForPage,
            commentList: that.data.commentList
          })
        }
      },

      [events.ui.AUDIO_PLAY_END](e) {
        var that = this;
        var idx = this.data.sliderId; //获取当前进度条
        //获取音频状态
        var playType = that.data.playType;
        if (playType == 1) {
          let replayAudioidx = that.data.replayAudio.idx;
          let replayAudioinneridx = that.data.replayAudio.inneridx;
          that.data.commentList[replayAudioidx].replyList.list[replayAudioinneridx].play = false;
          that.data.communitySigninListForPage[this.data.audioIndex].commentList[replayAudioidx].replyList.list[replayAudioinneridx].play = false;
          that.data.commentList[replayAudioidx].replyList.list[replayAudioinneridx].audio_duration = '00:00';
          that.data.communitySigninListForPage[this.data.audioIndex].commentList[replayAudioidx].replyList.list[replayAudioinneridx].audio_duration = '00:00';

          that.setData({
            communitySigninListForPage: that.data.communitySigninListForPage,
            commentList: that.data.commentList
          })

        } else if (playType == 2) {
          let commentAudioidx = that.data.commentAudio.idx;
          this.data.commentList[commentAudioidx].play = false;
          that.data.communitySigninListForPage[this.data.audioIndex].commentList[commentAudioidx].play = false;
          that.data.commentList[commentAudioidx].audio_duration = '00:00';
          that.data.communitySigninListForPage[this.data.audioIndex].commentList[commentAudioidx].audio_duration = '00:00';
          that.setData({
            communitySigninListForPage: that.data.communitySigninListForPage,
            commentList: that.data.commentList
          })
        }
      },
      //评论显示评论框
      [events.ui.showReply](e) {
        console.log(this.data.communitySigninListForPage)
        console.log(e.currentTarget.dataset)
        let isdel = parseInt(e.currentTarget.dataset.isdel)
        let replayId = e.currentTarget.dataset.replayid
        console.log(replayId)
        let isreply = parseInt(e.currentTarget.dataset.replytype)
        let commentId = e.currentTarget.dataset.commentid
        let replayType = e.currentTarget.dataset.type
        console.log(replayType)
        this.setData({
          isreply: isreply, //判断是评论的回复0，还是回复的回复1或2
          replayName: e.currentTarget.dataset.replayname,
          text: "",
          commentId: commentId, //评论的ID
          replayId: replayId, //回复某人的id
          replayType: replayType, //判断是评论还是回复    
          'model.id': e.currentTarget.dataset.signinid,
          'model.index': e.currentTarget.dataset.index,
          // model: {
          //   id: e.currentTarget.dataset.signinid, //日记id
          //   index: e.currentTarget.dataset.index //评论的回复的id
          // }
        })
        console.log(this.data.isreply)
        if (isdel) {
          if (replayId != this.data.userInfo.id) {
            this.setData({
              replayFocus: true,
              replyHide: false,
              delHide: true,
            })

          } else {
            this.setData({
              delHide: false,
              isdel: 1,
              delid: e.currentTarget.dataset.delid
            })
            console.log(this.data.delid)
          }
        } else {
          console.log(replayId, this.data.userInfo.id)
          if (replayId != this.data.userInfo.id) {
            this.setData({
              replayFocus: true,
              replyHide: false,
              delHide: true,
            })
          } else {
            this.setData({
              delHide: false
            })
          }
        }
      },
      //隐藏评论，回复，语音等框
      [events.ui.hedeReply](e) {
        console.log("影藏弹层");
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
        console.log('GETFOCUS')
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
      // 点击icon评论
      [events.ui.showComment](e) {
        let replayType = e.currentTarget.dataset.type
        console.log(e.currentTarget.dataset)
        this.setData({
          iptHide: false,
          commentFocus: true,
          text: "",
          replayType: replayType,
          replayAudioUrl: "",
          'model.id': e.currentTarget.dataset.signinid,
          'model.index': e.currentTarget.dataset.index,
          // model: {
          //   id: e.currentTarget.dataset.signinid,
          //   index: e.currentTarget.dataset.index
          // }
        })
      },
      // 打开录音
      [events.ui.SET_AUDIO](e) {
        wx.setKeepScreenOn({
          keepScreenOn: true,
        })
        //调用dom  1 圈主介绍  2 圈子介绍
        let type = e.currentTarget.dataset.type;
        console.log('录音------------', this.data.isSpeaking)
        this.setData({
          isSpeaking: false,
          text: ""
        })
        console.log(this.data.isSpeaking)
      },
      [events.ui.TURNBACK](e) {
        //删除已经录好的语音
        console.log('删除录音')
        this.setData({
          audioUrl: "",
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
        recorderManager.onStart(() => {
          console.log('开始录音')
        });
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
            console.log(res)
            this.setData({
              replayAudioUrl: this.$api.extparam.getVedioUrl(res.key),
            })
            console.log(this.$api.extparam.getVedioUrl(res))
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
      [events.ui.START_TEXT](e) {
        console.log(e.detail.value)
        console.log('这是评论')
        this.setData({
          replayAudioUrl: "",
          text: e.detail.value,
          voiceFlag: true
        })
      },

      //发表回复
      async [events.ui.SEND_MESSAGE](e) {
        let type = this.data.replayType
        console.log(type)
        let _this = this;
        if (this.data.text == "" || this.data.text == null || typeof(this.data.text) == "undefind") {
          //文本为空时判断语音是否为空
          console.log("000000000000000000000000000000000")
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
          },
          voiceFlag: true
        });
        console.log(this.data.param)
        if (type == 2) {
          console.log("评论执行了")
          //新添评论
          put(effects.ADD_COMMENT)
        } else {
          console.log("回复执行了")
          if (this.data.isreply == 0) {
            this.setData({
              'param.replyType': 1
            })
            console.log(this.data.isreply)
          } else {
            this.setData({
              'param.replyType': 2,
              // 'param.replyId': this.data.delid
            })
          }
          //回复评论
          this.setData({
            'param.commentId': this.data.commentId,
            'param.toUserId': this.data.replayId
          })
          console.log(this.data.param)
          put(effects.ADD_COMMENT_REPLY)
        }
      },
    }
  }

  mapEffect({
    put
  }) {
    return {
      // 点赞%%%%%%%%%%%%%%
      [effects.ADD_ALL_LIKE]() {
        let _this = this;
        console.log(this.data.zan)
        this.$api.circle.addSignInLike(this.data.zan).then((res) => {
          // console.log(res)
          // 点赞积分
          let integral = res.data.result.integral;
          if (integral != 0) {
            wx.showToast({
              title: '+1积分',
              icon: 'none',
              duration: 1000,
              mask: true
            })
          }
          let errorCode = res.data.errorCode;
          if (errorCode == '0') {
            // put(effects.LOAD_AVA)
            let ava = {
              signInId: this.data.zan.signInId,
              currentPage: 1,
              pageSize: 1000
            }
            this.$api.circle.getSignInLike(ava).then(res => {
              let errorCode = res.data.errorCode;
              if (errorCode == 0) {
                if (ava.currentPage == 1) {
                  let avatarList = `communitySigninListForPage.[${this.data.zan.zanIndex}].avatarList`;
                  this.setData({
                    [avatarList]: res.data.result.data
                  })
                } else {
                  // avatarList: this.data.avatarList.concat(res.data.result.data)
                }
              } else if (errorCode == 100006) {
                //返回值为空
                this.setData({
                  // avatarList: []
                })
              }
            })
          } else {
            // 网络请求超时，请稍后再试
          }
        });
      },

      // 评论
      [effects.ADD_COMMENT]() {
        console.log(this.data.param)
        let _this = this;
        this.$api.circle.addSignInComment(this.data.param).then(res => {
          console.log(res)
          let integral = res.data.result.integral;
          if (integral != 0) {
            if (integral == 1) {
              wx.showToast({
                title: '+1积分',
                icon: 'none',
                duration: 1000,
                mask: true
              })
            }
          } else {
            console.log(integral)
          }

          let errorCode = res.data.errorCode;
          if (errorCode == 0) {
            let inputMap = {
              signInId: _this.data.model.id,
              pageSize: 10,
              currentPage: 1
            }
            console.log(inputMap)
            _this.$api.circle.getSignInCommentList(inputMap).then(res => {
              let errorCode = res.data.errorCode;
              console.log(_this.data.model.index)
              let item = _this.data.model.index
              let commentList = `communitySigninListForPage.[${item}].commentList`
              if (errorCode == 0) {
                _this.setData({
                  [commentList]: res.data.result.list,
                  totalRecords: res.data.result.totalNum
                })
              } else {
                //没有评论
                this.setData({

                })
              }
            })
          }
        })
      },
      // 回复
      [effects.ADD_COMMENT_REPLY]() {
        let _this = this;
        console.log('执行1？')
        this.$api.circle.addSignInCommentReply(this.data.param).then(res => {
          let errorCode = res.data.errorCode;
          if (errorCode == 0) {
            let inputMap = {
              signInId: _this.data.model.id,
              pageSize: 10,
              currentPage: 1
            }
            console.log(inputMap)
            _this.$api.circle.getSignInCommentList(inputMap).then(res => {
              let errorCode = res.data.errorCode;
              console.log(_this.data.model.index)
              let item = _this.data.model.index
              let commentList = `communitySigninListForPage.[${item}].commentList`
              if (errorCode == 0) {
                _this.setData({
                  [commentList]: res.data.result.list,
                  totalRecords: res.data.result.totalNum
                })
              } else {
                //没有评论
                this.setData({

                })
              }
            })
          }
        })
      },

      // 总日记
      [effects.LOAD_SING_RECORD_ALLLIST]() { // isFollow 0 未关注 1已关注 3自己（不显示）
        // 1 文本, 2 图片, 3 音频, 4 视频, 5 公众号文章
        let parameter = {
          communityId: this.communityId,
          pageSize: this.data.pageSize,
          currentPage: this.data.communitySigninPage,
        }
        let _this = this
        let promise = new Promise((resolve, reject) => {
          _this.$api.circle.getSignRecordList(parameter).then((res) => {
            // console.log('刷新页面')
            let errorCode = res.data.errorCode;
            if (errorCode == '0') {
              let list = [];
              for (let item of res.data.result) {
                let aList = [];
                let bList = [];
                let videooSrc = "";

                for (let innerItem of item.contentList) {
                  if (innerItem.contentType == 2) {
                    let imgContent = innerItem.content.split('!')[0] + "!org";
                    aList = aList.concat([{
                      content: innerItem.content
                    }])
                    bList = bList.concat([imgContent])
                  } else if (innerItem.contentType == 4) {
                    videooSrc = innerItem.content
                  }
                }
                let communitySigninList = [{
                  communitySigninForPage: item.contentList,
                  signinSlidlst: item.audio,
                  signInNickName: item.signInNickName,
                  signInUserId: item.signInUserId,
                  signInUserLogo: item.signInUserLogo,
                  signInUserGender: item.signInUserGender,
                  headPic: item.headPic,
                  isLike: item.isLike,
                  likeNum: item.likeNum,
                  relpyNum: item.relpyNum,
                  title: item.subjectTitle,
                  signTime: item.signinTime,
                  userSignNum: item.userSignNum,
                  signInId: item.signInId,
                  shareNum: item.shareNum,
                  isFollow: item.isFollow,
                  flag: true,
                  subjectImg: aList,
                  subjectImgList: bList,
                  videooSrc: videooSrc,
                  subjectSignStart: item.subjectSignStart,
                  subjectSignEnd: item.subjectSignEnd,
                  communityName: item.communityName,
                  partIn: item.partIn,
                  signNum: item.signNum,
                  communityId: item.communityId,
                  circleLogo: item.headPic,
                  commentList: null, //评论
                  avatarList: null, //点赞
                  role: item.role
                }]
                list = list.concat(communitySigninList)

              }
              if (_this.data.communitySigninPage == 1) {
                _this.setData({
                  communitySigninListForPage: list
                })
              } else {
                _this.setData({
                  communitySigninListForPage: _this.data.communitySigninListForPage.concat(list)
                })
              }
              _this.setData({
                hasMore: true
              })
              // console.log(_this.data.communitySigninListForPage);


            } else if (errorCode == '100006') {
              _this.setData({
                hasMore: false
              })
            } else {
              // 网络请求超时，请稍后再试
              _this.setData({
                hasMore: false
              })
            }
            _this.setData({
              communitySigninListForPage: _this.data.communitySigninListForPage
            })
            resolve(_this.data.communitySigninListForPage)
          });
        })

        promise.then((res) => {
          // console.log(res)
          for (let item in res) {
            //点赞数据
            let ava = {
              signInId: res[item].signInId,
              currentPage: 1,
              pageSize: 1000
            }
            // console.log(ava)
            this.$api.circle.getSignInLike(ava).then(res => {
              let errorCode = res.data.errorCode;
              if (errorCode == 0) {
                if (ava.currentPage == 1) {
                  // console.log(res)
                  let avatarList = `communitySigninListForPage.[${item}].avatarList`;
                  this.setData({
                    [avatarList]: res.data.result.data
                  })
                } else {
                  // avatarList: this.data.avatarList.concat(res.data.result.data)
                }
              } else if (errorCode == 100006) {
                //返回值为空
                this.setData({

                })
              }
            })
            // 评论数据
            let inputMap = {
              signInId: res[item].signInId,
              pageSize: 10,
              currentPage: 1
            }
            this.$api.circle.getSignInCommentList(inputMap).then(res => {
              let errorCode = res.data.errorCode;
              if (errorCode == 0) {
                // console.log(res)
                let commentList = `communitySigninListForPage.[${item}].commentList`;
                this.setData({
                  [commentList]: res.data.result.list
                })
              } else {
                this.setData({
                  // commentList: [],
                })
              }
            })
          }
        })
      },
      // 查询当前用户信息
      [effects.LOAD_USERINFO]() {
        this.$api.circle.getCurrentUserInfo({}).then((res) => {
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
        let _this = this
        this.$api.circle.getCommunityInfo(id).then(model => {
          let errorCode = model.data.errorCode;
          if (errorCode == 0) {
            console.log(model.data.result)
            this.setData({
              'circleAttentionModel.targetUserId': model.data.result.masterUserId,
              isValid: model.data.result.isValid
            })

            if (model.data.result.isFollow == 3) {
              // 自己 隐藏
              this.setData({
                hasShowCircleOwnerAttention: true
              })
            } else if (model.data.result.isFollow == 1) {
              // 已关注
              this.setData({
                circleOwnerAttentionNum: 1
              })
            } else {
              // 未关注
              this.setData({
                circleOwnerAttentionNum: 0
              })
            }
            let isOwner = model.data.result.isOwner;
            if (isOwner == 1) {
              this.setData({
                'role.master': true
              })
              wx.setNavigationBarTitle({
                title: '我创建的学习圈'
              })
            } else {
              let isJoined = model.data.result.isJoined;
              if (isJoined == 1) {
                this.setData({
                  'role.member': true
                })
                wx.setNavigationBarTitle({
                  title: '我加入的学习圈'
                })
              } else {
                this.setData({
                  'role.tourist': true
                })
                wx.setNavigationBarTitle({
                  title: '未加入的学习圈'
                })
                console.log(this.data)
                if (this.data.role.tourist == true) {
                  this.$api.circle.getCurrentUserInfo({}).then((res) => {
                    let errorCode = res.data.errorCode;
                    if (errorCode == '0') {
                      let userInfo = res.data.result;
                      if(this.data.userInfo.role == 0){
                        this.$api.child.get().then(s => {
                          // TODO 由于有些老师没有孩子，所以要有非空判断
                          if (s.data.errorCode = '0') {
                            this.setData({
                              childrenDatas: s.data.result.childList.concat([{
                                childId: '',
                                childName: '本人',
                                logo: userInfo.logo,
                                userRole: userInfo.role
                              }])
                            });
                            if (userInfo.role == 1) {
                              this.setData({
                                choseFlag: false
                              })
                            }
                          }
                        })
                      }else{
                        this.setData({
                          childrenDatas: [{
                            childId: '',
                            childName: '本人',
                            logo: userInfo.logo,
                            userRole: userInfo.role
                          }]
                        });
                      }
                      
                    }
                  });
                }
              }
            }
            this.setData({
              model: model.data.result,
              communityIntroduceForPage: model.data.result.communityIntroduce,
              introduceSlidlst: model.data.result.introduceProcessBar,
              communityContentForPage: model.data.result.communityContent,
              contentSlidlst: model.data.result.contentProcessBar,
              //圈子隐私类型
              cicleType: model.data.result.communityPrivilege,
            });
            put(effects.GETSHAREINFO)

          }
        });
      },
      [effects.GETSHAREINFO]() {
        const model = this.data.model
        const param = {};
        param.dataType = 4;
        param.data = {
          'communityId': model.communityId
        };
        this.$api.user.shareInfoRecord(param).then(
          (res) => {
            console.log(res.data)
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
                    communityHeadImg: ''
                  }
                  let _this = this
                  wx.downloadFile({
                    url: model.communityHeadImg,
                    success: function(res) {
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
            } else {
              this.$common.showMessage(this, res.data.errorMessage);
              return;
            }
          })
      },
      [effects.LOAD_CIRCLE_MEM]() {
        let parameter = {
          communityId: this.communityId,
          pageSize: 1000,
          currentPage: 1,
        }
        this.setData({
          memberList: []
        })
        this.$api.circle.getCommunityMembers(parameter).then(res => {
          let errorCode = res.data.errorCode;
          if (errorCode == '0') {
            if (parameter.currentPage == 1) {
              this.setData({
                memberList: res.data.result.communityMember
              });
            } else {
              this.setData({
                memberList: this.data.memberList.concat(res.data.result.communityMember),
              })
            }
          }
        });
      },

      [effects.GET_TODAY_SUBJECT]() {
        this.$api.circle.getTodaySubject(this.data.today).then(res => {
          let errorCode = res.data.errorCode;
          if (errorCode == '0') {
            if (typeof(res.data.result.contentList) != "undefined") {
              this.setData({
                communitySubjectForPage: res.data.result.contentList
              })
            }
            if (typeof(res.data.result.audio) != "undefined") {
              this.setData({
                subjectSlidlst: res.data.result.audio
              })
            }
            this.setData({
              subjectId: res.data.result.subjectId,
              subjT: res.data.result.title,
              subjImg: res.data.result.picture,
              todayLevel: res.data.result.level,
              showLevel: true,
              canSingin: res.data.result.canSignin
            })
          } else {
            //没有数据
            this.setData({
              showLevel: false
            })
          }

        });
      },
      [effects.UPDATE_FANS_STATUS]() {
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
      [effects.ADD_LIKE]() {
        this.$api.circle.addSignInLike(this.data.zan).then((res) => {
          let errorCode = res.data.errorCode;
          if (errorCode == '0') {

          } else {
            // 网络请求超时，请稍后再试
          }
        });
      },
      // [effects.DEL_LIKE]() {
      //   this.$api.circle.deleteSignInLike(this.data.zan).then((res) => {
      //     let errorCode = res.data.errorCode;
      //     if (errorCode == '0') {

      //     } else {
      //       // 网络请求超时，请稍后再试
      //     }
      //   });
      // },
      [effects.JOIN]() {
        this.$api.circle.applyJoinCommunity(this.data.joinParam).then((res) => {
          let errorCode = res.data.errorCode;
          if (errorCode == 0) {
            put(effects.LOAD_SING_RECORD_ALLLIST)
            let id = this.data.today.communityId
            put(effects.LOAD_CIRCLE_INFO, {
              id
            });
            put(effects.LOAD_CIRCLE_MEM)
          }
        })
      },
      [effects.circleOwnerAttention]() {
        this.$api.circle.updateCommunityFansStatus(this.data.circleAttentionModel).then(s => {
          if (s.data.errorCode == '0') {
            if (this.data.circleOwnerAttentionNum == 0) {
              this.setData({
                circleOwnerAttentionNum: 1
              })
            } else {
              this.setData({
                circleOwnerAttentionNum: 0
              })
            }
          }
        })
      },
      // 查询当前用户信息 
      [effects.LOAD_IS_BIND_PHONE]() {
        this.$api.circle.getUserIsBindingPhone({}).then((res) => {
          let errorCode = res.data.errorCode;
          if (errorCode == '0') {
            var isBindingPhone = res.data.result.isBindingPhone; // 1绑定 0未绑定
            if (isBindingPhone != 1) {
              this.setData({
                needBindPhone: '1'
              })
            } else {
              this.setData({
                needBindPhone: '0'
              })
            }
          }
        });
      },
      [effects.updateUserPhoneByWX]() {
        const model = this.data.model
        let subjectId = this.data.subjectId;
        let communityId = this.data.model.communityId;
        this.$api.user.updateUserPhoneByWX(model).then(
          (res) => {
            if (res.data.errorCode == '0') {
              this.$common.showToast('绑定成功', 'success');
              setTimeout(
                function() {
                  wx.navigateTo({
                    url: './addDiary/addDiary?id=' + subjectId + '&communityId=' + communityId
                  })
                }, 1000
              )
            }
          },
          (rej) => {}
        )
      },
    }
  }
}

EApp.instance.register({
  type: myCirclePage,
  id: 'myCirclePage',
  config: {
    events,
    effects,
    actions
  }
});

// 关注成功
function showSuccToast(msg) {
  wx.showToast({
    title: msg, //标题
    icon: 'success', //图标，支持"success"、"loading"
    duration: 1500, //提示的延迟时间，单位毫秒，默认：1500
    mask: false, //是否显示透明蒙层，防止触摸穿透，默认：false
  })
}

function getNowTime() {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let systemTime = year + "年" + month + "月" + day + "日";
  return systemTime;
}
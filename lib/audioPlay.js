//音频播放
function PLAY_AUDIO(_this, e) {
  console.log(_this)
  //将页面上所有包含语音的数组play值全部换为false
  let communitySubjectForPage = _this.data.communitySubjectForPage;
  let communityContentForPage = _this.data.communityContentForPage;
  let communityIntroduceForPage = _this.data.communityIntroduceForPage;
  let communitySigninListForPage = _this.data.communitySigninListForPage;
  if (typeof(communityContentForPage) != "undefined" && communityContentForPage.length > 0) {
    for (let item of communityContentForPage) {
      if (item.contentType == 3) {
        item.play = false;
      } 
    }
    _this.setData({
      communityContentForPage: communityContentForPage
    })
  }
  if (typeof(communitySubjectForPage) != "undefined" && communitySubjectForPage.length > 0) {
    for (let item of communitySubjectForPage) {
      if (item.contentType == 3) {
        item.play = false;
      }
    }
    _this.setData({
      communitySubjectForPage: communitySubjectForPage
    })
  }
  if (typeof(communitySubjectForPage) != "undefined" && communitySubjectForPage.length > 0) {
    for (let item of communityIntroduceForPage) {
      if (item.contentType == 3) {
        item.play = false;
      }
    }
    _this.setData({
      communitySubjectForPage: communitySubjectForPage
    })
  }
  if (typeof(communitySigninListForPage) != "undefined" && communitySigninListForPage.length > 0) {
    // for (let outitem of communitySigninListForPage) {
    //   if (typeof (outitem.communitySigninForPage) != "undefined" && outitem.communitySigninForPage.length > 0) {
    //     for (let inneritem of outitem.communitySigninForPage) {
    //       if (inneritem.contentType == 3) {
    //         inneritem.play = false;
    //       }
    //     }
    //   }
    // }
    for (let item of communitySigninListForPage) {
      if (item.communitySigninForPage[0].contentType == 3) {
        item.communitySigninForPage[0].play = false;
      }
      if (item.commentList != null) {
        let commentList = item.commentList;
        // console.log(item.commentList)
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



    _this.setData({
      communitySigninListForPage: communitySigninListForPage
    })
  }
  if (_this.innerAudioContext != null && typeof(_this.innerAudioContext != 'undefind')) {
    //播放当前语音时暂停其他语音线程
    _this.innerAudioContext.pause();
  }
  let idx = e.currentTarget.dataset.idx;

  let audioId = "" //获取当前语音实例
  let type = e.currentTarget.dataset.type //获取当前播放类型 1 圈主  2圈子详情
  if (type == 1) {
    audioId = "introduceAudio" + idx
  } else if (type == 2) {
    audioId = "subjectAudio" + idx
  } else if (type == 3) {
    let outidx = e.currentTarget.dataset.outidx;
    audioId = outidx + "signinAudio" + idx
  } else {
    audioId = "contentAudio" + idx;
  }
  _this.innerAudioContext = wx.createAudioContext(audioId); // 创建音频实例 TODO实例化应该在赋值src之后才能保证当前实例下能取到总时长
  _this.innerAudioContext.play(); //开始播放
  let play = e.currentTarget.dataset.play //获取当前播放状态
  if (type == 1) {
    if (!play) {
      _this.data.communityIntroduceForPage[idx].play = true
      _this.setData({
        communityIntroduceForPage: _this.data.communityIntroduceForPage
      })
    } else {
      _this.data.communityIntroduceForPage[idx].play = false
      _this.setData({
        communityIntroduceForPage: _this.data.communityIntroduceForPage
      })
    }
    //修改圈主当前语音播放状态
    _this.setData({
      playtype: type,
      sliderId: _this.data.communityIntroduceForPage[idx].sliderId //存入当前进度条
    })
  } else if (type == 2) {
    if (!play) {
      _this.data.communitySubjectForPage[idx].play = true
      _this.setData({
        communitySubjectForPage: _this.data.communitySubjectForPage
      })
    } else {
      _this.data.communitySubjectForPage[idx].play = false
      _this.setData({
        communitySubjectForPage: _this.data.communitySubjectForPage
      })
    }
    _this.setData({
      playtype: type,
      sliderId: _this.data.communitySubjectForPage[idx].sliderId //存入当前进度条
    })
  } else if (type == 3) {
    //日记语音
    let outidx = e.currentTarget.dataset.outidx;
    if (!play) {
      _this.data.communitySigninListForPage[outidx].communitySigninForPage[idx].play = true
      _this.setData({
        communitySigninListForPage: _this.data.communitySigninListForPage
      })
    } else {
      _this.data.communitySigninListForPage[outidx].communitySigninForPage[idx].play = false
      _this.setData({
        communitySigninListForPage: _this.data.communitySigninListForPage
      })
    }
    _this.setData({
      playtype: type,
      communitySigninListId: outidx,
      sliderId: _this.data.communitySigninListForPage[outidx].communitySigninForPage[idx].sliderId //存入当前进度条
    })
  } else {
    if (!play) {
      _this.data.communityContentForPage[idx].play = true
      _this.setData({
        communityContentForPage: _this.data.communityContentForPage
      })
    } else {
      _this.data.communityContentForPage[idx].play = false
      _this.setData({
        communityContentForPage: _this.data.communityContentForPage
      })
    }
    //修改圈主当前语音播放状态
    _this.setData({
      playtype: type,
      sliderId: _this.data.communityContentForPage[idx].sliderId //存入当前进度条
    })
  }
};

//音频暂停
function STOP_AUDIO(_this, e) {
  let type = e.currentTarget.dataset.type //获取当前播放类型 1 圈主  2圈子详情
  console.log(type)
  _this.innerAudioContext.pause(); //暂停
  let idx = e.currentTarget.dataset.idx //获取当前角标判断具体停止播放的语音
  let play = e.currentTarget.dataset.play //修改具体语音播放状态
  if (type == 1) {
    if (!play) {
      _this.data.communityIntroduceForPage[idx].play = true
      _this.setData({
        communityIntroduceForPage: _this.data.communityIntroduceForPage
      })
    } else {
      _this.data.communityIntroduceForPage[idx].play = false
      _this.setData({
        communityIntroduceForPage: _this.data.communityIntroduceForPage
      })
    }
  } else if (type == 2) {
    if (!play) {
      _this.data.communitySubjectForPage[idx].play = true
      _this.setData({
        communitySubjectForPage: _this.data.communitySubjectForPage
      })
    } else {
      _this.data.communitySubjectForPage[idx].play = false
      _this.setData({
        communitySubjectForPage: _this.data.communitySubjectForPage
      })
    }
  } else if (type == 3) {
    //日记语音
    let outidx = e.currentTarget.dataset.outidx;
    if (!play) {
      _this.data.communitySigninListForPage[outidx].communitySigninForPage[idx].play = true
      _this.setData({
        communitySigninListForPage: _this.data.communitySigninListForPage
      })
    } else {
      _this.data.communitySigninListForPage[outidx].communitySigninForPage[idx].play = false
      _this.setData({
        communitySigninListForPage: _this.data.communitySigninListForPage
      })
    }
  } else {
    if (!play) {
      _this.data.communityContentForPage[idx].play = true
      _this.setData({
        communityContentForPage: _this.data.communityContentForPage
      })
    } else {
      _this.data.communityContentForPage[idx].play = false
      _this.setData({
        communityContentForPage: _this.data.communityContentForPage
      })
    }
  }
}

//音频进度条
function AUDIO_UPDATA_PROGRESS(_this, e) {
  var that = _this;
  var idx = _this.data.sliderId; //获取当前进度条
  var playtype = _this.data.playtype; //获取当前播放者类型 1 圈主 2圈子
  var duration = e.detail.duration; //总时长
  var offset = e.detail.currentTime; //当前播放时长
  var lastTime = Math.abs(parseInt(duration - offset));
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
  } else if (playtype == 2) {
    that.data.subjectSlidlst[idx].offset = offset;
    that.data.subjectSlidlst[idx].max = max;
    that.data.subjectSlidlst[idx].audio_duration = min + ':' + sec /* 00:00 */ ;
    that.setData({
      subjectSlidlst: that.data.subjectSlidlst
    })
  } else if (playtype == 3) {
    //日记语音
    let outidx = _this.data.communitySigninListId;
    that.data.communitySigninListForPage[outidx].signinSlidlst[idx].offset = offset;
    that.data.communitySigninListForPage[outidx].signinSlidlst[idx].max = max;
    that.data.communitySigninListForPage[outidx].signinSlidlst[idx].audio_duration = min + ':' + sec /* 00:00 */ ;
    that.setData({
      communitySigninListForPage: that.data.communitySigninListForPage
    })
  } else {
    that.data.contentSlidlst[idx].offset = offset;
    that.data.contentSlidlst[idx].max = max;
    that.data.contentSlidlst[idx].audio_duration = min + ':' + sec /* 00:00 */ ;
    that.setData({
      contentSlidlst: that.data.contentSlidlst
    })
  }
};

function PLAY_AUDIO_END(_this, e) {
  var that = _this;
  var idx = _this.data.sliderId; //获取当前进度条
  var playtype = _this.data.playtype; //获取当前播放者类型 1 圈主 2圈子
  if (playtype == 1) {
    //获取音频状态
    let myidx = that.data.introduceSlidlst[idx].id
    that.data.communityIntroduceForPage[myidx].play = false
    that.data.introduceSlidlst[idx].offset = 0;
    that.data.introduceSlidlst[idx].audio_duration = '00:00';
    that.setData({
      introduceSlidlst: that.data.introduceSlidlst,
      communityIntroduceForPage: that.data.communityIntroduceForPage,
    })
  } else if (playtype == 2) {
    let myidx = that.data.subjectSlidlst[idx].id
    that.data.communitySubjectForPage[myidx].play = false
    that.data.subjectSlidlst[idx].offset = 0;
    that.data.subjectSlidlst[idx].audio_duration = '00:00';
    that.setData({
      subjectSlidlst: that.data.subjectSlidlst,
      communitySubjectForPage: that.data.communitySubjectForPage,
    })
  } else if (playtype == 3) {
    //日记语音
    let outidx = _this.data.communitySigninListId;
    let myidx = that.data.communitySigninListForPage[outidx].signinSlidlst[idx].id
    that.data.communitySigninListForPage[outidx].communitySigninForPage[myidx].play = false
    that.data.communitySigninListForPage[outidx].signinSlidlst[idx].offset = 0;
    that.data.communitySigninListForPage[outidx].signinSlidlst[idx].audio_duration = '00:00';
    that.setData({
      communitySigninListForPage: that.data.communitySigninListForPage
    })
  } else {
    //获取音频状态
    let myidx = that.data.contentSlidlst[idx].id
    that.data.communityContentForPage[myidx].play = false
    that.data.contentSlidlst[idx].offset = 0;
    that.data.contentSlidlst[idx].audio_duration = '00:00';
    that.setData({
      contentSlidlst: that.data.contentSlidlst,
      communityContentForPage: that.data.communityContentForPage,
    })
  }
}
module.exports = {
  PLAY_AUDIO: PLAY_AUDIO,
  STOP_AUDIO: STOP_AUDIO,
  AUDIO_UPDATA_PROGRESS: AUDIO_UPDATA_PROGRESS,
  PLAY_AUDIO_END: PLAY_AUDIO_END
}
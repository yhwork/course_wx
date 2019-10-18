const events = {
  ui: {
    eStop: null,
    hideComment: null,
    showComment: null,
    showReply: null,
    hedeReply: null,
    AUDIO_PLAY: null, // 音频 - 播放
    AUDIO_STOP: null, // 音频 - 播放
    // AUDIO_SLIDER_CHANGE: null, // 音频 - 拖动进度条
    AUDIO_UPDATA_PROGRESS: null, // 音频 - 更新进度条
    AUDIO_PLAY_END: null, //音频 -播放完毕
    SET_AUDIO: null,//开始录音
    START_TEXT: null,//记录评论
    SEND_MESSAGE: null,//发表评论
    START_AUDIO: null,
    STOP_AUDIO: null,
    MORE: null,//投诉的显示与隐藏
    SIGNLIKE: null,
    ZAN: null,
    showShareWin: null,
    HIDE_INVIT: null,
    TURNBACK: null,
    GETFOCUS: null,
    PREVIEWIMAGE: null
  }
}

const effects = {
  GET_SIGNIN_INFO: null,
  GET_COMMENT_INFO: null,
  ADD_COMMENT: null,
  ADD_COMMENT_REPLY: null,
  UPDATE_FANS_STATUS: null,
  ADD_LIKE: null,
  DEL_LIKE: null,
  LOAD_AVA: null,
  PAGEPLUS: null,
  LOAD_USERINFO: null
}

const actions = {}

export {
  events,
  effects,
  actions
}
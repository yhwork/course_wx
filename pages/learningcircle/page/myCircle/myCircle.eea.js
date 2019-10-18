const events = {
  ui: {
    SHOW_HIDE_C: null,
    CHANGE_TAB: null,
    PAGEPLUS: null,
    PLAY_AUDIO: null,
    STOP_PLAY_AUDIO: null,
    PLAY_AUDIO: null, // 音频 - 播放
    STOP_AUDIO: null, // 音频 - 播放
    // AUDIO_SLIDER_CHANGE: null, // 音频 - 拖动进度条
    AUDIO_UPDATA_PROGRESS: null, // 音频 - 更新进度条
    PLAY_AUDIO_END: null, //音频 -播放完毕
    ESTOP: null, //遮罩层下阻止页面滚动
    SHOW_INVIT: null, //显示邀请
    HIDE_INVIT: null, //因藏邀请
    showShareWin:null,
    SIGNINPAGEPLUS: null, //日记刷新
    SIGNLIKE:null,//日记关注
    REPORT_SIGN:null,//举报
    MORE:null,
    ZAN:null,
    showClocker:null,
    closeClocker:null,
    modalChange:null,
    JOIN_CIRCLE:null,
    bindCircleOwnerAttention:null,
    playVideo:null,
    RESTART:null,
    PREVIEWIMAGE:null,
    getPhoneNumber:null,
    GOTO_ADDDIARY:null,
    EDITOR: null,
    CreateThemes: null,
    ALLZAN:null,
    showComment:null,
    SEND_MESSAGE:null,
    AUDIO_PLAY_END:null,
    AUDIO_PLAY:null,
    START_TEXT:null,
    showReply: null,
    hedeReply: null,
    GETFOCUS: null,
    ESTOP: null,
    SET_AUDIO: null,
    START_AUDIO: null,//开始录音
    STOP_AUDIO: null,
    TURNBACK: null,
    PLAY_AUDIO: null,
    DEL_DIARY: null,
    AUDIO_STOP:null,
    DIARY_PLAY_AUDIO:null,
    DIARY_PLAY_AUDIO_END:null,
    DIARY_AUDIO_UPDATA_PROGRESS:null,
    DIARY_STOP_AUDIO:null,
    DEL_REPLY:null,
    NODEL_REPLY:null,
    modalCandel:null,
    complainCircle:null,//投诉圈子
    exitCircle: null,
    PLAY_START:null
  }
}

const effects = {
  circleOwnerAttention:null,
  LOAD_CIRCLE_INFO: null,
  LOAD_CIRCLE_MEM: null,
  LOAD_SING_RECORD_ALLLIST: null,
  SAVE_CHILD: null,
  GET_TODAY_SUBJECT: null,
  UPDATE_FANS_STATUS:null,
  ADD_LIKE:null,
  DEL_LIKE:null,
  JOIN:null,
  LOAD_IS_BIND_PHONE:null,
  GENERAGE_CODE:null,
  LOAD_USERINFO:null,
  updateUserPhoneByWX:null,



  GET_COMMENT_INFO:null,
  LOAD_AVA:null,
  DEL_ALL_LIKE:null,
  ADD_ALL_LIKE:null,
  ADD_COMMENT:null,
  ADD_COMMENT_REPLY:null,
  GETSHAREINFO:null
}

const actions = {}

export {
  events,
  effects,
  actions
}
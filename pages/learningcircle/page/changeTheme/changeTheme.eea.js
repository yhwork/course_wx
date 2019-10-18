const events = {
  ui: {
    startDateChange: null,
    endDateChange: null,
    SET_TEXT: null,
    CHANGE_AVATAR: null,
    SET_AUDIO: null,
    SET_VIDEO: null,
    UPPER: null,
    DOWN: null,
    DEL: null,
    AUDIO_PLAY: null, // 音频 - 播放
    AUDIO_STOP: null, // 音频 - 播放
    // AUDIO_SLIDER_CHANGE: null, // 音频 - 拖动进度条
    AUDIO_UPDATA_PROGRESS: null, // 音频 - 更新进度条
    AUDIO_PLAY_END: null, //音频 -播放完毕
    SAVE_CIRCLEOWNER_DETAIL:null,
    GET_CIRCLE_DETAIL :null,
    CHANGE_CIRCLE_NAME:null,
    START_AUDIO:null,
    STOP_AUDIO:null,
    add_public:null,
    SAVE_INFO:null
  }
}

const effects = {
  LOAD_CIRCLE_INFO: null,
  SAVE_NEW_SUBJECT_INFO: null,
  GET_SUBJECT_INFO:null,
  CHANGE_SUBJECT_INFO:null,
  QUERY_SUBJECT_INFO:null
}

const actions = {
}

export { events, effects, actions }
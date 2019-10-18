const events = {
  ui: {
    eStop: null,
    changeLi: null,
    showMask: null,
    showMap: null,
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
    ESTOP: null,//遮罩层下阻止页面滚动
    SHOW_INVIT: null,//显示邀请
    HIDE_INVIT: null,//因藏邀请
    SIGNINPAGEPLUS: null, //日记刷新
    GET_CIRCLE_DETAIL: null,
    SAVE_CIRCLEOWNER_DETAIL: null,
    START_AUDIO: null,
    STOP_AUDIO: null,
    SAVE_DIARY_INFO: null,
    modalChange: null,
    PREVIEWIMAGE: null,
    hedeReply: null,
    cancel: null
  }
}

const effects = {
  CREAT_DIARY: null,
  LOAD_IS_BIND_PHONE: null
}

const actions = {
}

export { events, effects, actions }
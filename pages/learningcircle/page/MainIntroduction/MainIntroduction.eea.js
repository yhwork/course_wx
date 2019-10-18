const events = {
  ui: {
    CHANGE_CIRCLE_NAME: null,
    CHANGE_AVATAR: null,
    GET_CIRCLEO_DETAIL: null,
    SET_VIDEO: null,
    START_AUDIO: null,
    STOP_AUDIO: null,
    SAVE_INFOR: null,
    MultiPickerChange: null,
    MultiPickerColumnChange: null,
    SAVE_CIRCLEOWNER_DETAIL: null,
    PLAY_AUDIO: null,
    SET_AUDIO: null,
    SET_TEXT: null,
    GET_CIRCLE_DETAIL: null,
    STOP_PLAY_AUDIO: null,
    UPPER: null,
    DOWN: null,
    DEL: null,
    AUDIO_PLAY: null, // 音频 - 播放
    AUDIO_STOP: null, // 音频 - 播放
    // AUDIO_SLIDER_CHANGE: null, // 音频 - 拖动进度条
    AUDIO_UPDATA_PROGRESS: null, // 音频 - 更新进度条
    AUDIO_PLAY_END: null, //音频 - 播放结束
    showLabel: null,
    closeLabel: null,
    saveMarksAndCloseLabel: null,
    firstLevelMark: null,
    secondLevelMarkBind: null,
    SAVE_INFO: null,
    CIRCLE_ANNOUNCEMENT: null,
    clearLabelTap: null,
    showAnn: null,
    hideAnn: null,
    showText: null,
    hedeReply: null,
    personCompile: null,
    detailHiddenL: null,
    delShare: null
  }
}

const effects = {
  LOAD_CIRCLE_INFO: null,
  SAVE_NEW_CIRCLE_INFO: null,
  LOAD_USERINFO: null,
  GENERAGE_CODE: null
}

const actions = {
}

export { events, effects, actions }
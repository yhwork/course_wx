export const events = { //事件
  ui: {
    cans: null,
    endMovie:null,
    beginPlay:null,
    play:null,
    controlVideo: null,
    saveImg:null,
    fullScreen:null,
    onTimeUpdate:null,   // 视频进度
    pause_video:null,    // 视频暂停
    handleFullScreen: null,
    timeupdate:null,
    videlistacive:null, // 点击播放视频
    playvideo:null,     // 开始播放
    btnvideo:null,      // 点击视频区域
    videoTap:null,      // 点击开始
  }
}

export const effects = { //写接口名称
  getHotVideoDetails: null,//去观看视频
  addUserVideoCount:null,//视频次数
  addVideoTime:null,    // 视频播放进度
  getVideoStar:null,   // 启动播放位置
  getHotVideoList:null  // 获取视频列表
}


export const actions = { //
  MAP_LESSON_DATA: null,
}
export const APP_LIFE = {
  ON_LAUNCH: 'onLaunch', //! 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
  ON_SHOW: 'onShow', //! 当小程序启动，或从后台进入前台显示，会触发 onShow
  ON_HIDE: 'onHide', //! 当小程序从前台进入后台，会触发 onHide
  ON_ERROR: 'onError', //! 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
}
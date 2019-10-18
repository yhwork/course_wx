



// import regeneratorRuntime from '../../../../lib/runtime'
import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../../eea/index'
import {
  events,
  effects,
  actions
} from './courseDetail.eea'
const base64 = require('../../../../lib/base64')
const Array = require('../../../../lib/Array')
const recorderManager = wx.getRecorderManager()
const innerAudioContext = null; // 音频对象
var nameArray = [];
var idArray = [];
var firstLevelMarkData = []; // 一级标签数据传输
var secondLevelMarkData = []; // 二级标签数据传输
var time = 600;
var timer;
class courseDetail extends EPage {
  get data() {
    return {
      userInfo: {},
      arr: [{
        rr: "44",
        introHide: 0
      }],
      annHide: true,
      countDownTime: 600,
      toast2Hidden: true, //文本为空
      toast3Hidden: true, //数量限制
      communityContent: [], //圈子详情
      communityIntroduce: [], //圈主介绍
      communityContentForPage: [], //填充页面圈子详情，避免base64识别失败
      communityIntroduceForPage: [], //填充页面圈主介绍，避免base64识别失败
      compile: false,
      compileList: true,
      detailHidden: false,
      detailHiddenList: true,
      isSpeaking: true, //正在说话
      startSpeak: false, //开始录音
      owner_focus: false, //圈主文本获取焦点
      circle_focus: false, //圈子文本获取焦点
      audio_stop: false,
      audio_start: true,
      play: false, //播放中
      contentTextNm: 0, //圈子文本数
      contentImgNm: 0, //圈子图片数
      contentAudioNm: 0, //圈子语音数
      contentVideoNm: 0, //圈子视频数
      introduceTextNm: 0, //圈主文本数
      introducecontentImgNm: 0, //圈主图片数
      introducecontentAudioNm: 0, //圈主语音数
      introducecontentVideoNm: 0, //圈主视频数
      contentSlidlst: [], //圈子语音进度条
      introduceSlidlst: [], //圈主语音进度条
      contentSlidlstId: 0, //圈子语音进度条ID
      introduceSlidlstId: 0, //圈主语音进度条ID
      labelHide: true, //标签选择框隐藏
      hasSecondMark: 1, // 1:没有二级标签
      markDatas: '', // 一级标签数据集
      secondMarkDatas: '', // 二级标签数据集
      selectMarkIdArray: [], // 选中标签Id数组
      markNamelist: '请选择(最多三个)',
      selectMarkNameArray: '请选择(最多三个)', // 选中标签名称数组 
      wechatNm: '填写微信号，让成员找到你',
      announcement: '请输入圈子公告',
      selectMarkNameData: [], // 选中标签名称数据传输数组
      currentClickMarkId: '', // 当前点击的标签ID
      communityMark: [], //选择的标签ID 接口调用
      // model: {
      //   markNamelist: ''
      // }
      isnew: true,
      issharetype: 0
    };

  }


  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) { //生命周期函数调用方法
        put(effects.getuserinfo)
       },
    }


  }

  mapUIEvent({  //事件方法
    put
  }) {
    return {}
  }

  mapEffect({ //公用方法
    put
  }) 
    {
     return {
       [effects.getuserinfo](){
        this.$api.circle.getCurrentUserInfo({}).then((res) => {
          console.log(res)


         });
       }
     }
    }
   
}

EApp.instance.register({
  type: courseDetail,
  id: 'courseDetail',
  config: {
    events,
    effects,
    actions
  }
});
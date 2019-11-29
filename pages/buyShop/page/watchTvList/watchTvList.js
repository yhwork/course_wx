import regeneratorRuntime from '../../../../lib/runtime'
// 引入
import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../../eea/index'
import {
  events,
  effects,
  actions
} from './watchTvList.eea'


function GetSlideAngle(dx, dy) {
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

function GetSlideDrection(startX, startY, endX, endY) {
  var dy = endY - startY;

  var dx = endX - startX;

  var result = 0;

  //如果滑动距离太短

  if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
    return result;
  }

  var angle = GetSlideAngle(dx, dy);
  // var angle = (Math.atan2(dx, dy) * 180) / Math.PI

  if (angle >= -45 && angle < 45) {
    result = 4;
  } else if (angle >= 45 && angle < 135) {
    result = 1;
  } else if (angle >= -135 && angle < -45) {
    result = 2;
  } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
    result = 3;
  }

  return result;
}

class watchTvList extends EPage {
  get data() {
    return {
      productId: "",
      title: "",
      subtitle: "",
      lable: "",
      conentImg: "",
      videoArr: "",
      orderNumber: "",
      videoId: "",
      videocount: "",
      isvideo: "",
      videoIndex: "",
      autoplay: false,
      controls: true,
      video: true,
      play: false,
      left: false,
      fullScreen: false,
      isPlay: false,
      isshow: true,
      isAllscreen: true, //未全屏
      lastnum: "",
      textShow: false,
      material:'',
      videoImgList:'',

    };
  }

  mapPageEvent({ //生命周期方法  
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](options) { //获取参数
        let productId = options.productId
        this.setData({
          productId: productId,
          orderNumber: options.orderNumber
        })
        // 调用方法
        put(effects.getHotVideoList)
        put(effects.getUserVideoImgList)
      },
      [PAGE_LIFE.ON_READY](option) {
        // this.videoContext = wx.createVideoContext('myVideo')
        let videoContext = wx.createVideoContext('item-head-video', this);
        this.setData({
          videoContext,
        });

      },
      [PAGE_LIFE.ON_SHOW](option) {

      },
    }
  }

  mapUIEvent({ //页面事件方法  
    put
  }) {
    return {
      // 去观看
      [events.ui.goWatch] (e){
        console.log(e)
        let id = e.currentTarget.dataset.id
        let orderNumber = this.data.orderNumber
        wx.navigateTo({
          url: `../watchTv/watchTv?videoId=${id}&orderNumber=${orderNumber}`
        })
      },
      // 视频播放结束
      [events.ui.endMovie](e) { //视频播放结束回调函数
        console.log('end', e)
        this.setData({
          videoId: e.currentTarget.dataset.videoid
        })
        put(effects.addUserVideoCount)
        put(effects.getHotVideoDetails) //控制视频次数 实时更新
      },
      // 保存图片
      [events.ui.saveImg](e) {

        let imgpath = e.currentTarget.dataset.path
        wx.previewImage({
          current: imgpath, // 当前显示图片的http链接
          urls: [imgpath], // 需要预览的图片http链接列表
          success(res){
              console.log('预览成功')
          }
        })
        console.log(imgpath);
        // wx.downloadFile({
        //   url: imgpath,
        //   success: function(res) {
        //     var imageFilePath = res.tempFilePath;
        //     wx.showModal({
        //       title: '提示',
        //       content: '是否保存图片？',
        //       success(res) {
        //         if (res.confirm) {
        //           wx.saveImageToPhotosAlbum({
        //             filePath: imageFilePath,
        //             success(res) {
        //               wx.showToast({
        //                 title: '保存成功',
        //                 icon: 'success'
        //               })
        //             }
        //           })
        //         } else if (res.cancel) {
        //           wx.showToast({
        //             title: '保存失败',
        //             icon: 'none'
        //           })
        //         }
        //       }
        //     })

        // wx.downloadFile({
        //   url: e.currentTarget.dataset.path,
        //   success: function(res) {
        //     var imageFilePath = res.tempFilePath;
        //     wx.showModal({
        //       title: '提示',
        //       content: '是否保存图片？',
        //       success(res) {
        //         if (res.confirm) {
        //           wx.saveImageToPhotosAlbum({
        //             filePath: imageFilePath,
        //             success(res) {
        //               wx.showToast({
        //                 title: '保存成功',
        //                 icon: 'success'
        //               })
        //             }
        //           })
        //         } else if (res.cancel) {
        //           wx.showToast({
        //             title: '保存失败',
        //             icon: 'none'
        //           })
        //         }
        //       }
        //     })


        //   },

        // })


      },
      // 检测视频播放
      [events.ui.controlVideo](e) { //控制视频播放
        let index = e.currentTarget.dataset.index
        index = String(index)
        this.setData({
          videoIndex: index,
          isvideo: e.currentTarget.dataset.isvideo,
          videoId: e.currentTarget.dataset.videoId,
          videocount: e.currentTarget.dataset.videocount,
          // play: e.currentTarget.dataset.play
        })
        var prevV = wx.createVideoContext(this.data.videoIndex); //点击当前video
        if (this.data.isvideo || this.data.isPlay) { //如果视频次数 没超过三次 可以点击播放视频
          if (this.data.play) { //如果暂停按钮显示
            prevV.pause() //暂停播放
            // this.data.videoArr[index].videoplay=false

            var that = this;
            this.data.videoArr[index].videoplay = !this.data.videoArr[index].videoplay
            that.setData({
              videoArr: that.data.videoArr
            })
            this.setData({
              play: false, //暂停按钮隐藏
              autoplay: true
            })
          } else { //暂停按钮未显示
            prevV.play() //播放
            this.setData({
              play: true, //暂停按钮显示
              autoplay: true
            })
            // this.data.videoArr[index].videoplay = true
            var that = this;
            this.data.videoArr[index].videoplay = !this.data.videoArr[index].videoplay
            that.setData({
              videoArr: that.data.videoArr
            })
          }
        } else { //如果视频播放次数超过三次  视频连接取消 视频不存在
          // this.data.videocount=""
          this.setData({
            videocount: ""
          })
        }
        put(effects.getHotVideoDetails)
      },
      [events.ui.fullScreen](e) { //全屏 退出全屏
        let index = e.currentTarget.dataset.index
        index = String(index)
        this.setData({
          videoIndex: index
        })
        
        var prevV = wx.createVideoContext(this.data.videoIndex);
        if (this.data.isAllscreen) { //如果全屏
          prevV.requestFullScreen()
          this.setData({
            isAllscreen: false
          })
        } else {
          prevV.exitFullScreen()
          this.setData({
            isAllscreen: true
          })
        }
      },
    }
  }

  mapEffect() { //调接口 方法   存储方法方便调用
    return {
      // 获取图片方法的api
      [effects.getUserVideoImgList](){
        this.$api.circle.getUserVideoImgList({
          productId: this.data.productId,
          orderNumber: this.data.orderNumber
        }).then((res)=>{
           console.log('请求结果',res.data);
          if (res.data.errorCode == 0 && res.data.result) {
            let data = res.data.result;
            let info = data.info;
            let videoImgList = JSON.parse(info.material);
            
            this.setData({
              videoImgList:videoImgList
            })
            console.log(this.data.videoImgList)
          }else{

          }
        })
      },
      // 获取视频列表
      [effects.getHotVideoList]() {
        this.$api.circle.getHotVideoList({
          productId: this.data.productId,
          orderNumber: this.data.orderNumber
        }).then( res =>{
          if (res.data.errorCode == 0 && res.data.result) {
            let data = res.data.result;
            let list = data.list;
            let info = data.info;
            let newlable = JSON.parse(info.lable)
            let lablearr = Object.values(newlable)
            let newimg = JSON.parse(info.imgVideo)
            let imgarr = Object.values(newimg)

            this.setData({
              title: info.title,
              subtitle: info.subtitle,
              lable: lablearr,
              conentImg: imgarr,
              videoList:list,
              material: JSON.parse(info.material)
            });
            console.log("videoList", list)
          }
        })
      },
      // 获取视频详情
      [effects.getHotVideoDetails]() {
        this.$api.circle.getHotVideoDetails({
          productId: this.data.productId,
          orderNumber: this.data.orderNumber
        }).then((res) => {
          console.log("res", res)
          if (res.data.errorCode == 0 && res.data.result) {
            let video = res.data.result.hotVideoDetails
            let videoShow = res.data.result.userVideoInfo
            let videoShowArr = Object.values(videoShow)
            let img = video.imgVideo
            let newimg = JSON.parse(img)
            let imgarr = Object.values(newimg)
            let lable = video.lable
            let newlable = JSON.parse(lable)
            let lablearr = Object.values(newlable)
            let content = video.content
            let newcontent = JSON.parse(content) //json串转成js对象
            this.setData({
              title: video.title,
              subtitle: video.subtitle,
              lable: lablearr,
              conentImg: imgarr,
            })
            console.log('newcontent', newcontent)
            // console.log('videoShowArr', videoShowArr)
            newcontent.forEach((item, index) => {
              if (item.video_content == undefined) {
                item.video_state = false
              } else {
                item.video_state = true
              }
              // item.video_id = videoShowArr[index].videoId 
              item.isvideo = videoShowArr[index].isvideo
              // item.textShow=false
            })

            newcontent.forEach((item, index) => { //根本isvideo判断视频能否播放
              if (item.isvideo == "false") { //如果视频不能播放
                this.setData({
                  isPlay: false //不能播放(连续点击视频的时候，不是页面跳转进行播放)
                })
                item.video_content = null //链接地址取消
                wx.showToast({
                  title: '视频次数用完',
                  duration: 2000
                })
              } else { //视频能播放
                this.setData({
                  isPlay: true //不能播放(连续点击视频)
                })
              }
            })

            this.setData({
              videoArr: newcontent
            })
            // console.log("videoArr", this.data.videoArr)
          }
        })

      },
      // 增加视频数量
      [effects.addUserVideoCount]() {
        this.$api.circle.addUserVideoCount({
          orderNumber: this.data.orderNumber,
          videoId: this.data.videoId
        }).then((res) => {
          // put(effects.getHotVideoDetails)
        })
      }
    }
  }
}

EApp.instance.register({
  type: watchTvList,
  id: 'watchTvList',
  config: {
    events,
    effects,
    actions
  }
});
import WeCropper from './we-cropper.js'
import GlobalConfig from './index.js'

const globalConfig = new GlobalConfig()

globalConfig.init()


const globalData = {
  config: globalConfig 
}
const config = globalData.config
const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 50

Page({
  data: {
    cropperOpt: {
      id: 'cropper',
      targetId: 'targetCropper',
      pixelRatio: device.pixelRatio,
      width,
      height,
      scale: 2.5,
      zoom: 8,

      boundStyle: {
        color: config.getThemeColor(),
        mask: 'rgba(0,0,0,0.6)',
        lineWidth: 1
      }
    }
  },
  onLoad(option) {
    console.log(this.data)
    this.setData({
      type: option.type,
    })
    if (this.data.type == 'child') {
      this.setData({
        childId: option.childId,
        communityId: option.communityId,
        cropperOpt: {
          id: 'cropper',
          targetId: 'targetCropper',
          pixelRatio: device.pixelRatio,
          width,
          height,
          scale: 2.5,
          zoom: 8,
          cut: {
            x: (width - 300) / 2,
            y: (height - 300) / 2,
            width: 300,
            height: 300,
          },
          boundStyle: {
            color: config.getThemeColor(),
            mask: 'rgba(0,0,0,0.6)',
            lineWidth: 1
          }
        }
      })
    } else if (this.data.type == 'addchild'){
      this.setData({
        childId: option.childId,
        communityId: option.communityId,
        cropperOpt: {
          id: 'cropper',
          targetId: 'targetCropper',
          pixelRatio: device.pixelRatio,
          width,
          height,
          scale: 2.5,
          zoom: 8,
          cut: {
            x: (width - 300) / 2,
            y: (height - 300) / 2,
            width: 300,
            height: 300,
          },
          boundStyle: {
            color: config.getThemeColor(),
            mask: 'rgba(0,0,0,0.6)',
            lineWidth: 1
          }
        }
      })
    } else if (this.data.type == 'subject') {
      this.setData({
        communityId: option.communityId,
        cropperOpt: {
          id: 'cropper',
          targetId: 'targetCropper',
          pixelRatio: device.pixelRatio,
          width,
          height,
          scale: 2.5,
          zoom: 8,
          cut: {
            x: (width - 300) / 2,
            y: (height - 300) / 2,
            width: 300,
            height: 200
          },
          boundStyle: {
            color: config.getThemeColor(),
            mask: 'rgba(0,0,0,0.6)',
            lineWidth: 1
          }
        }
      })
    } else if (this.data.type == 'joinclass') {
      this.setData({
        classId: option.classId,
        cropperOpt: {
          id: 'cropper',
          targetId: 'targetCropper',
          pixelRatio: device.pixelRatio,
          width,
          height,
          scale: 2.5,
          zoom: 8,
          cut: {
            x: (width - 300) / 2,
            y: (height - 300) / 2,
            width: 300,
            height: 300
          },
          boundStyle: {
            color: config.getThemeColor(),
            mask: 'rgba(0,0,0,0.6)',
            lineWidth: 1
          }
        }
      })
    } else if (this.data.type == 'classlogo') {
      this.setData({
        classId: option.classId,
        cropperOpt: {
          id: 'cropper',
          targetId: 'targetCropper',
          pixelRatio: device.pixelRatio,
          width,
          height,
          scale: 2.5,
          zoom: 8,
          cut: {
            x: (width - 300) / 2,
            y: (height - 300) / 2,
            width: 300,
            height: 300
          },
          boundStyle: {
            color: config.getThemeColor(),
            mask: 'rgba(0,0,0,0.6)',
            lineWidth: 1
          }
        }
      })
    } else {
      this.setData({
        communityId: option.communityId,
        cropperOpt: {
          id: 'cropper',
          targetId: 'targetCropper',
          pixelRatio: device.pixelRatio,
          width,
          height,
          scale: 2.5,
          zoom: 8,
          cut: {
            x: (width - 300) / 2,
            y: (height - 300) / 2,
            width: 300,
            height: 300
          },
          boundStyle: {
            color: config.getThemeColor(),
            mask: 'rgba(0,0,0,0.6)',
            lineWidth: 1
          }
        }
      })
    }

    const {
      cropperOpt
    } = this.data

    cropperOpt.boundStyle.color = config.getThemeColor()
    this.setData({
      cropperOpt
    })

    if (option.src) {
      cropperOpt.src = option.src
      this.cropper = new WeCropper(cropperOpt)
        .on('ready', (ctx) => {
          console.log(`wecropper is ready for work!`)
        })
        .on('beforeImageLoad', (ctx) => {
          console.log(`before picture loaded, i can do something`)
          console.log(`current canvas context:`, ctx)
          wx.showToast({
            title: '上传中',
            icon: 'loading',
            duration: 20000
          })
        })
        .on('imageLoad', (ctx) => {
          console.log(`picture loaded`)
          console.log(`current canvas context:`, ctx)
          wx.hideToast()
        })
        .on('beforeDraw', (ctx, instance) => {
          console.log(`before canvas draw,i can do something`)
          console.log(`current canvas context:`, ctx)
        })
    }

    if (option.classId) {
      this.setData({
        classId: option.classId
      })
    }
  },
  touchStart(e) {
    this.cropper.touchStart(e)
  },
  touchMove(e) {
    this.cropper.touchMove(e)
  },
  touchEnd(e) {
    this.cropper.touchEnd(e)
  },
  getCropperImage() {
    this.cropper.getCropperImage((avatar) => {
      if (avatar) {
        //  获取到裁剪后的图片
        console.log('用户类型', this.data.type)
        if (this.data.type == 'user') {
          wx.redirectTo({
            url: `../../../pages/mypage/personalInfo/personalInfo?avatar=${avatar}`
          })
        } else if (this.data.type == 'child') {
          // 家长进入    传 manage 为false设置
          wx.redirectTo({
            url: `../../../pages/mypage/editMyChild/editMyChild?avatar=${avatar}&childId=${this.data.childId}&manage=${'false'}`
          })
        } else if (this.data.type == 'subject') {
          wx.redirectTo({
            url: `../../../pages/learningcircle/page/circleEditor/circleEditor?avatar=${avatar}&id=${this.data.communityId}`
          })
        } else if (this.data.type == 'joinclass') {
          wx.setStorageSync('joinImg', avatar)
          wx.navigateBack({
          })
        } else if (this.data.type == 'classlogo') {
          wx.redirectTo({
            url: `../../../pages/classcircle/reviseClass/reviseClass?classlogo=${avatar}&classId=${this.data.classId}&type=logo`
          })
        } else if (this.data.type == 'addchild'){
          wx.redirectTo({
            url: `/pages/register/info/p_info?avatar=${avatar}&childId=${this.data.childId}&manage=${'false'}`,
          })
        }

      } else {
        console.log('获取图片失败，请稍后重试')
      }
    })
  },
  uploadTap() {
    const self = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]
        //  获取裁剪图片资源后，给data添加src属性及其值

        self.cropper.pushOrign(src)
      }
    })
  },

})
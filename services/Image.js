const __defaults = {};

class Image {
  constructor(options) {
    this._options = Object.assign({}, __defaults, options);
  }
// promise封装
  generateShareCourse({
    id,
    width,
    height
  }, shareInfo, source) {
    return new Promise((resolve, reject) => {
      let ctx = wx.createCanvasContext(id);

      if (source == 'course') {
        const name = shareInfo.name;
        let imageUrl = shareInfo.imageUrl;
        console.log('2', imageUrl)
        const period = shareInfo.beginDate + '~' + shareInfo.endDate;
        const institution = shareInfo.orgName;
        const week = shareInfo.frequencyDesc;
        const time = shareInfo.beginTime + '~' + shareInfo.endTime;
        const address = shareInfo.classAddress;

        const font_size = 18;
        const padding = {
          top: 10,
          bottom: 20,
          left: 15,
          right: 15
        };
        const line_height = 32;

        ctx.setFillStyle('white');
        ctx.fillRect(0, 0, width, height);

        ctx.setFillStyle('black');
        ctx.setFontSize(font_size);
        ctx.fillText(name, padding.left, padding.top + font_size);

        ctx.setTextAlign('right');
        ctx.fillText(period, width - padding.right, padding.top + font_size);

        ctx.setTextAlign('left');
        ctx.fillText(institution, padding.left, padding.top + font_size + line_height);

        ctx.setTextAlign('right');
        ctx.fillText(`${week} ${time}`, width - padding.right, padding.top + font_size + line_height);

        ctx.setTextAlign('left');
        ctx.setFillStyle('#619FFF')
        ctx.fillText(address, padding.left, padding.top + font_size + line_height * 2);

        ctx.drawImage(imageUrl, 0, padding.top + font_size + line_height * 3, width, width * 250 / 600)
      } else if (source == 'lesson') {
        // let saveurl = 'https://iforbao-prod.oss-cn-hangzhou.aliyuncs.com/public/assets/img/share_internalcourse.jpg';
        // wx.downloadFile({
        //   url: 'https://iforbao-prod.oss-cn-hangzhou.aliyuncs.com/public/assets/img/share_internalcourse.jpg',
        //   success: (res) => {
        //     saveurl = res.tempFilePath;
        //   }
        // })
        let imageUrl = shareInfo.imageUrl;
        console.log('2', imageUrl)
        const name = shareInfo.name;
        const period = shareInfo.timeForClass;
        const institution = shareInfo.orgName;
        const address = shareInfo.classAddress;
        const font_size = 18;
        const padding = {
          top: 15,
          bottom: 20,
          left: 15,
          right: 15
        };
        const line_height = 30;

        ctx.setFillStyle('white');
        ctx.fillRect(0, 0, width, height);

        ctx.setFillStyle('black');
        ctx.setFontSize(font_size);
        ctx.fillText(name, padding.left, padding.top + font_size);

        ctx.setTextAlign('left');
        ctx.fillText(period, padding.left, padding.top + font_size + line_height);

        // ctx.setTextAlign('right');
        // ctx.fillText(institution, width - padding.right, padding.top + font_size + line_height);

        ctx.setTextAlign('left');
        ctx.setFillStyle('#619FFF')
        ctx.fillText(institution, padding.left, padding.top + font_size + line_height * 2);

        ctx.drawImage(imageUrl, 0, padding.top + font_size + line_height * 3, width, width * 250 / 600)

        ctx.save();
      } else if (source == 'sign') {
        console.log(shareInfo)
        const img = shareInfo.communityHeadImg
        console.log(img)
        const communityName = shareInfo.communityName; // 圈子名称
        const partIn = shareInfo.partIn; // 圈子成员数量
        const signNum = shareInfo.signNum; // 打卡次数 

        const font_size = 18;
        const font_size1 = 28;
        const padding = {
          top: 15,
          bottom: 20,
          left: 15,
          right: 15
        };
        const line_height = 40;

        ctx.drawImage(img, 0, padding.top, width, width * 300 / 600)

        ctx.setFillStyle('black');
        ctx.setFontSize('26');
        ctx.fillText(communityName, 0, padding.top * 2 + font_size1 + width * 300 / 600);

        ctx.setFillStyle('#888');
        ctx.setFontSize(font_size);
        ctx.fillText(partIn + '人参与', 0, padding.top * 2 + line_height + font_size1 + width * 300 / 600);

        ctx.setTextAlign('left');
        ctx.fillText(signNum + '次打卡', ctx.measureText(partIn + '人参与').width + padding.left * 2, padding.top * 2 + line_height + font_size1 + width * 300 / 600);
      } else if (source == 'child') {
        console.log('小孩分享内容',shareInfo)
        const name = shareInfo.name;
        const font_size = 18;
        const padding = {
          top: 15,
          bottom: 20,
          left: 15,
          right: 15
        };
        const line_height = 30;

        ctx.setFillStyle('white');
        ctx.fillRect(0, 0, width, height);

        ctx.setFillStyle('black');
        ctx.setFontSize(font_size);
        ctx.fillText('昵称', padding.left, padding.top + font_size);

        ctx.setTextAlign('right');
        ctx.fillText(name, width - padding.right, padding.top + font_size);
        // 分享图片  小孩分享
        ctx.drawImage( 0, padding.top + font_size + line_height * 2, width, width * 250 / 600)
      } else if (source == 'diray') {
        const img = shareInfo.signInUserLogo
        console.log(img)
        const padding = {
          top: 15,
          bottom: 20,
          left: 15,
          right: 15
        };
        const line_height = 30;
        const font_size = 18;
        ctx.drawImage('/assets/img/diary.jpg', 0, 0, width, width * 4 / 5);

        //开始路径画圆,剪切处理
        ctx.save();
        ctx.beginPath();
        ctx.arc(width / 2, width * 2 / 5.05, width * 0.49 / 2, 0, Math.PI * 2);
        ctx.clip(); //剪切路径
        ctx.drawImage(img, width / 4.5, width / 8, width * 0.55, width * 0.55);
        ctx.restore();

      } else if (source == 'internalClass') {
        let imageUrl = shareInfo.imageUrl;
        console.log('2', imageUrl)
        let courseName = '';
        if (shareInfo.courseName.split(',').length > 3) {
          courseName = shareInfo.courseName.split(',')[0] + "," + shareInfo.courseName.split(',')[1] + "," + shareInfo.courseName.split(',')[2] + '……'
        } else {
          courseName = shareInfo.courseName;
        }

        const schoolName = shareInfo.schoolName;
        const className = shareInfo.className;

        const font_size = 18;
        const padding = {
          top: 10,
          bottom: 20,
          left: 15,
          right: 15
        };
        const line_height = 32;

        ctx.setFillStyle('white');
        ctx.fillRect(0, 0, width, height);

        ctx.setFillStyle('black');
        ctx.setFontSize(font_size);
        ctx.setTextAlign('left');
        ctx.fillText('学校：' + schoolName, padding.left, padding.top + font_size);
        ctx.setTextAlign('left');
        ctx.fillText('课程：' + courseName, padding.left, padding.top + font_size + line_height);
        ctx.setTextAlign('left');
        ctx.fillText('班级：' + className, padding.left, padding.top + font_size + line_height * 2);

        ctx.drawImage(imageUrl, 0, padding.top + font_size + line_height * 3, width, width * 250 / 600)
      } else if (source == 'createinternalClass') {
        console.log(shareInfo)
        let courseName = '';
        if (shareInfo.courseName.split(',').length > 3) {
          courseName = shareInfo.courseName.split(',')[0] + "," + shareInfo.courseName.split(',')[1] + "," + shareInfo.courseName.split(',')[2] + '……'
        } else {
          courseName = shareInfo.courseName;
        }

        const schoolName = shareInfo.schoolName;
        const className = shareInfo.className;

        const font_size = 18;
        const padding = {
          top: 10,
          bottom: 20,
          left: 15,
          right: 15
        };
        const line_height = 32;

        ctx.setFillStyle('white');
        ctx.fillRect(0, 0, width, height);

        ctx.setFillStyle('black');
        ctx.setFontSize(font_size);
        ctx.setTextAlign('left');
        ctx.fillText('学校：' + schoolName, padding.left, padding.top + font_size);
        ctx.setTextAlign('left');
        ctx.fillText('班级：' + className, padding.left, padding.top + font_size + line_height);
        ctx.setTextAlign('left');
        ctx.fillText('课程：' + courseName, padding.left, padding.top + font_size + line_height * 2);

        ctx.drawImage('/assets/img/share_internalcourse.jpg', 0, padding.top + font_size + line_height * 3, width, width * 250 / 600)
      } else if (source == 'class') {
        // console.log(shareInfo)
        const className = shareInfo.className;
        const schoolName = shareInfo.schoolName;
        const teacherName = shareInfo.teacherName;
        const shareimg = shareInfo.shareimg
        const font_size = 18;
        const padding = {
          top: 10,
          bottom: 20,
          left: 15,
          right: 15
        };
        const line_height = 32;

        ctx.setFillStyle('white');
        ctx.fillRect(0, 0, width, height);

        ctx.setFillStyle('black');
        ctx.setFontSize(font_size);
        ctx.setTextAlign('left');
        ctx.fillText('老师：' + teacherName, padding.left, padding.top + font_size);
        ctx.setTextAlign('left');
        ctx.fillText('班级：' + className, padding.left, padding.top + font_size + line_height);
        ctx.setTextAlign('left');
        ctx.fillText('学校：' + schoolName, padding.left, padding.top + font_size + line_height * 2);

        ctx.drawImage(shareimg, 0, padding.top + font_size + line_height * 3, width, width * 250 / 600)
      } else if (source == 'reviseclass') {
        console.log(shareInfo)
        const shareimg = shareInfo.shareimg
        const classlogo = shareInfo.classLogo
        const className = shareInfo.className;
        const schoolName = shareInfo.schoolName;
        const teacherName = shareInfo.teacherName;
        const font_size = 18;
        const padding = {
          top: 10,
          bottom: 20,
          left: 15,
          right: 15
        };
        const line_height = 32;


        ctx.drawImage(shareimg, 0, padding.top + font_size + line_height * 3, width, width * 250 / 600)

        //开始路径画圆,剪切处理
        ctx.save();
        ctx.beginPath();
        ctx.arc(width / 25 + width * 0.33 / 2, height / 2 - width / 4 + width * 0.33 / 2, width * 0.33 / 2, 0, Math.PI * 2);
        ctx.clip(); //剪切路径
        ctx.drawImage(classlogo, width / 25, height / 2 - width / 4, width * 0.33, width * 0.33);
        ctx.restore();

        ctx.setFillStyle('white');
        // ctx.fillRect(0, 0, width, height);
        console.log(height, width)
        ctx.setFillStyle('black');
        ctx.setFontSize(font_size);
        ctx.setTextAlign('left');
        ctx.fillText('创建者：' + teacherName + '老师', padding.left, padding.top + font_size);
        ctx.setTextAlign('left');
        ctx.fillText('班级：' + className, padding.left, padding.top + font_size + line_height);
        ctx.setTextAlign('left');
        ctx.fillText('学校：' + schoolName, padding.left, padding.top + font_size + line_height * 2);
      }


      ctx.draw(false, function() {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width,
          height,
          destWidth: width,
          destHeight: height,
          canvasId: id,
          success: function(res) {
            console.log('生成图片保存', res)
            ctx.clearRect(0, 0, width, height);
            ctx.draw();
            resolve(res.tempFilePath);
          }
        })
      });
    });
  }
}

export default {
  install(app, options) {
    app.plugin('image', new Image(options));
  }
}
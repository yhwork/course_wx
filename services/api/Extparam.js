const __extparams = {
  client: '{"wap":"wap"}',
  source: 'wxapp',
  langCode: 'zh',
  version: '1.0'
};

// 开发版
const __paramsOther = {
  uploadUrl: 'https://qa.oss.iforbao.com',
  downloadUrl: 'https://qa.oss.iforbao.com',
  defaultStyle: 'test'
}

// // 正式版
// const __paramsOther = {
//   uploadUrl: 'https://oss.iforbao.com',
//   downloadUrl: 'https://oss.iforbao.com',
//   defaultStyle: 'test'
// }



const __pageImgUrl = {
  creatclass: __paramsOther.downloadUrl + '/public/assets/img/creatclass.png!org',
  head: __paramsOther.downloadUrl + '/public/assets/img/head.jpg!org',
  my_11: __paramsOther.downloadUrl + '/public/assets/img/my_11.png!org',
  subject_default: __paramsOther.downloadUrl + '/public/default/subject_default.png!org',
  xinxi: __paramsOther.downloadUrl + '/public/assets/img/xinxi.png!org',
  creatbanner: __paramsOther.downloadUrl + '/public/assets/img/creatbanner.png!org',
  set_tearch: __paramsOther.downloadUrl + '/public/assets/img/set_tearch.png!org',
  newcircle: __paramsOther.downloadUrl + '/public/assets/img/newcircle.jpg!org',
  newcourse: __paramsOther.downloadUrl + '/public/assets/img/newcourse.jpg!org',
  set_class: __paramsOther.downloadUrl + '/public/assets/img/set_class.png!org',
  girlb: __paramsOther.downloadUrl + '/public/assets/img/girlb.png!org',
  boyb: __paramsOther.downloadUrl + '/public/assets/img/boyb.png!org',
  teacher_img: __paramsOther.downloadUrl + '/public/assets/img/teacher-img.png!org',
  home_img: __paramsOther.downloadUrl + '/public/assets/img/home-img.png!org',
  shareclass: __paramsOther.downloadUrl + '/public/assets/img/shareclass.jpg!org',
  createclass: __paramsOther.downloadUrl + '/public/assets/img/createclass.jpg!org',
  diary: __paramsOther.downloadUrl + '/public/assets/img/diary.jpg!org',
  inviteimg: __paramsOther.downloadUrl + '/public/assets/img/inviteimg.jpg!org',
  first: __paramsOther.downloadUrl + '/public/assets/img/first.png!org',
  second: __paramsOther.downloadUrl + '/public/assets/img/second.png!org',
  third: __paramsOther.downloadUrl + '/public/assets/img/third.png!org',
  timg2: __paramsOther.downloadUrl + '/store/1/timg2.jpg!org'
}

class Extparam {
  constructor(options) {
    this._options = Object.assign({}, __extparams, options);
  }

  getParams(params) {
    return Object.assign({}, this._options, params);
  }

  getParamsOther() {
    return __paramsOther;
  }

  getFileUrl(filename) {
    return this.getFileUrlThumb(filename, __paramsOther.defaultStyle);
  }

  getFileUrlThumb(filename, style) {
    if (!filename || filename == '') {
      return __paramsOther.downloadUrl + '/public/default/notfound.png';
    }
    if (filename.indexOf("http://") != -1 || filename.indexOf("https://") != -1) {
      return filename
    }
    return __paramsOther.downloadUrl + '/' + filename + '!' + style;

  }

  getLogoUrl(filename) {
    return this.getLogoUrlThumb(filename, __paramsOther.defaultStyle);
  }
  getLogoUrlThumb(filename, style) {
    if (!filename || filename == '') {
      return "/assets/img/gexing.png";
    } else {
      return this.getFileUrlThumb(filename, style);
    }


  }
  getVedioUrl(filename) {
    if (filename == '') {
      return;
    }
    return __paramsOther.downloadUrl + '/' + filename;
  }

  //调取远程图片路径（页面一些元素图片）
  getPageImgUrl(name) {
    return __pageImgUrl[name]
  }


}

export default Extparam
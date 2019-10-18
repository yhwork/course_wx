class Common {
    //提示信息
    showMessage(that,data){
        that.setData({
            showTopTips: true,
            message:data
        });
        setTimeout(function(){
            that.setData({
                showTopTips: false
            }); 
        }, 3000);
    } 

    //是否为空
    isBlank(str){
        if (Object.prototype.toString.call(str) ==='[object Undefined]'){//空
            return true
        } else if (
            Object.prototype.toString.call(str) === '[object String]' || 
            Object.prototype.toString.call(str) === '[object Array]') { //字条串或数组
            return str.length==0?true:false
        } else if (Object.prototype.toString.call(str) === '[object Object]') {
            return JSON.stringify(str)=='{}'?true:false
        } else if(Object.prototype.toString.call(str) === '[object Number]'){
            return false
        }else{
            return true
        }
    }
    //是否是手机
    checkMobile(str) {  
        var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;  
        if (!myreg.test(str)) {
            return false;  
        } else {  
            return true;  
        }  
    }
    //正整数
    isIntNum(val){
        var re = /^[1-9]\d*$/;
        if(re.test(val)){
            return true;
        }else{
            return false;
        }
    }
    //判断是否同意授权，没有同意跳转到注册页面
    checkAuth(url){
        url = url || '../register/register';
        wx.getSetting({
            success(res) {
                if (!res.authSetting['scope.userInfo']) {
                    wx.redirectTo({url:url})
                }
            }
        })
    }
    checkAuth1 () {
        return new Promise((resolve, reject) => {
            wx.getSetting({
                success: resp => resolve(resp),
                fail: resp => reject(resp)
            });
        });
    }
    showModalError(str){
       wx.showModal({
          title: '警告',
          content: str,
          //confirmText: '确定',
          confirmColor: '#f29219',
          showCancel:false,
          cancelText: '确定',
          success(resp) {
            if (resp.cancel) {
              
            }
          }
        });
    }

    showToast(title,icon){
        wx.showToast({
            title:title,
            icon:icon,
            mask:true
        })
    }

        

}

export default {
    install(app, options) {
        app.plugin('common', new Common(options));
    }
}
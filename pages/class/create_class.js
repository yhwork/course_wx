import { EApp, EPage, PAGE_LIFE } from '../../../../eea/index'
import { events, effects, actions } from './create_class.eea'

class CreateClassPage extends EPage {
    get data() {
        return { 
            model:{
                courseType:1
            },
            courseTypes: [
              {name: '校内班级', value: '1', checked: true},
              {name: '校外班级', value: '2'},
            ],
            userInfo:{}
        };
    }
  
 
    mapPageEvent({ put }) {
        return {
            [PAGE_LIFE.ON_LOAD](option) {
              this.setData({ creatbanner: this.$api.extparam.getPageImgUrl('creatbanner') });
                const comeFrom = option.comeFrom;
                this.setData({comeFrom:comeFrom})
                //获取用户信息
                put(effects.GET_USER_INFO);
            },
            [PAGE_LIFE.ON_SHOW](option) {
                
            }
        }
    }

    mapUIEvent({ put }) {
        return {
            //更换头像
            [events.ui.CHANGE_AVATAR]() {
                wx.showActionSheet({
                    itemList: ['拍照', '从手机相册选择'],
                    success: (res) => {
                        if (res.cancel) { return; }
                        var sourceType = [];
                        if (res.tapIndex === 0) { sourceType.push('camera'); }
                        if (res.tapIndex === 1) { sourceType.push('album'); }
                        wx.chooseImage({
                            sourceType: sourceType,
                            count: 1,
                            success: (resp) => {
                                this.$api.upload.upload(resp.tempFilePaths[0]).then(res => {
                                    this.setData({ 'model.logourl': this.$api.extparam.getLogoUrl(res.key) });
                                    this.setData({ 'model.logo': res.key });
                                });
                            }
                        })
                    }
                });
            },
            //选择校内外 
            [events.ui.CHANGE_COURSETYPE](e) {
              this.setData({
                'model.courseType': e.detail.value
              })
              if (e.detail.value==2) {
                this.$storage.set('workOrganizationName',this.data.model.workOrganizationName).then(
                    (res)=>{
                        this.setData({'model.workOrganizationName':''})
                    }
                )
              }else if(e.detail.value==1){
                this.$storage.get('workOrganizationName').then(
                    (res)=>{
                        this.setData({'model.workOrganizationName':res.workOrganizationName})
                    }
                )
              }
            },
            //学校
            [events.ui.CHANGE_SCHOOLNAME](e) {
              this.setData({
                'model.workOrganizationName': e.detail.value
              })
            },
            //姓名
            [events.ui.CHANGE_NAME](e) {
              this.setData({
                'model.name': e.detail.value
              })
            },
            
            //班级
            [events.ui.CHANGE_CLASSNAME](e) {
                this.setData({ 'model.className': e.detail.value });
            },
            
            //保存
            [events.ui.SAVE]() {
                put(effects.SAVE);
            }
        }
    }

    mapEffect() {
        return {
            //用户信息
            [effects.GET_USER_INFO]() {
                this.$api.user.gerUserInfo().then(
                    (res) => {
                        if(res.data.errorCode==0){
                            this.setData({
                                userInfo:res.data.result,
                                'model.name':res.data.result.name,
                                'model.courseType':res.data.result.teacherProp,
                                'model.teacherProp':res.data.result.teacherProp,
                                'model.workOrganizationName':res.data.result.workOrganizationName
                            })
                        }else{
                            this.$common.showMessage(this,res.data.errorMessage);
                            return ;
                        }
                    }
                );  
            },
            [effects.SAVE]() {
                const model = this.data.model;
                if(this.$common.isBlank(model.workOrganizationName)){
                    if(model.courseType==1){
                        this.$common.showMessage(this,'请选择学校');
                    }else if(model.courseType==2){
                        this.$common.showMessage(this,'请输入机构名称');
                    }
                    return false; 
                }
                if(this.$common.isBlank(model.name)){
                    this.$common.showMessage(this,'请输入姓名'); 
                }
                if(this.$common.isBlank(model.className)){
                    this.$common.showMessage(this,'请输入班级名称');
                    return false; 
                }
                this.$api.class.validClass(model).then(
                    (res) => {
                        if(res.data.errorCode==0){
                            this.$api.class.create(model).then(
                                (res) => {
                                    if(this.$common.isBlank(this.data.comeFrom)){
                                        if(model.courseType==1){
                                            //校内
                                            this.$common.showMessage(this,'校内课程添加敬请期待');
                                            return     
                                        }else{
                                            //校外
                                            wx.navigateTo({url:'../../p_add/schoolout_add1?classId='+res.data.result.id})
                                        }
                                    }else{
                                        wx.navigateBack()
                                    }
                                    
                                }
                            );
                        }else{
                            this.$common.showMessage(this,res.data.errorMessage);
                            return ; 
                        }
                    }
                );  
            }
        }
    }
}

EApp.instance.register({
    type: CreateClassPage,
    id: 'CreateClassPage',
    config: { events, effects, actions }
});
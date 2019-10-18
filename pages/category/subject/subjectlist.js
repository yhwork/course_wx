import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../eea/index'
import {
  events,
  effects,
  actions
} from './subjectlist.eea'

class subjectlist extends EPage {
  get data() {
    return {

    };
  }


  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      [events.ui.ADDNAME](e) {
        console.log(e)
        this.setData({
          'name': e.detail.value
        })
      },
      [events.ui.ADDSUBJECT](){
        if (this.$common.isBlank(this.data.name)){
          this.$common.showMessage(this, '请选择年级');
          return false;
        }
        console.log('--')
        put(effects.ADDSUBJECT)
      }
    }
  }

  mapEffect() {
    return {
      [effects.ADDSUBJECT]() {
        this.$api.category.addTeachingSub({ name: this.data.name}).then((res) => {
          console.log(res.data.result)
          this.$storage.set('subjectinfo', { "id": res.data.result.teacherSubjectId, "name": res.data.result.name });
          if(res.data.errorCode==0){
            wx.navigateBack({
              
            })
          }
        });
      }
    }
  }
}

EApp.instance.register({
  type: subjectlist,
  id: 'subjectlist',
  config: {
    events,
    effects,
    actions
  }
});
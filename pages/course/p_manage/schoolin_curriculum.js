import {
  EApp,
  EPage,
  PAGE_LIFE
} from '../../../eea/index'
import {
  events,
  effects,
  actions
} from './schoolin_curriculum.eea'

class schoolinCurriculumPage extends EPage {
  get data() {
    return {
      model: {
        childId: '',
        name: '',
        orgName: '',
        classAddress: '',
        classRoom: '',
        teacher: '',
        contactTel: ''
      },
      tables: [
        ['', '周一', '周二', '周三', '周四', '周五'],
        ['1', '内容2', '内容3', '内容4', '内容5', '内容6'],
        ['2', '内容2', '内容3', '内容4', '内容5', '内容6'],
        ['3', '内容2', '内容3', '内容4', '内容5', '内容6'],
        ['4', '内容2', '内容3', '内容4', '内容5', '内容6'],
        ['5', '内容2', '内容3', '内容4', '内容5', '内容6'],
        ['6', '内容2', '内容3', '内容4', '内容5', '内容6'],
        ['7', '内容2', '内容3', '内容4', '内容5', '内容6'],
        ['8', '内容2', '内容3', '内容4', '内容5', '内容6'],
      ]
    };
  }


  mapPageEvent({
    put
  }) {
    return {
      [PAGE_LIFE.ON_LOAD](option) {
        console.log(option)
        put(effects.GET_USER_INFO, {
          option
        });

        if (typeof option.childId != 'undefined') {
          const childId = option.childId; //链接过来的childId
          this.setData({
            'model.childId': childId
          });
        }
      },
      [PAGE_LIFE.ON_SHOW](option) {
        if (this.$storage.getSync('courseInfo')) {
          // console.log(this.$storage.getSync('courseInfo'))
        }
        this.setData({
          courseInfo: this.$storage.getSync('courseInfo'),
          childInfo: this.$storage.getSync('childInfo'),
          userInfo: this.$storage.getSync('userInfo')
        });
        // this.setData({ model: this.$storage.getSync('model') });
        put(effects.UPDATE_WEEKDAY);

      }
    }
  }

  mapUIEvent({
    put
  }) {
    return {
      [events.ui.openModal](e) {
        let id = e.currentTarget.dataset.id;
        console.log(id)
        this.setData({
          titles: this.data.tables[0],
          cols: this.data.tables[id],
          id: id,
          show: true
        });
      },
      [events.ui.dataChange](e) {
        let cols = this.data.cols;
        cols[e.target.dataset.id] = e.detail.value;
        console.log(cols);
        this.setData({
          cols: cols
        });
      },
      [events.ui.editModel](e) {
        let tables = this.data.tables;
        tables[this.data.id] = this.data.cols;

        this.setData({
          tables: tables,
          show: false
        });
      },
      [events.ui.closeModel](e) {
        this.setData({
          show: false
        });
      },
      // 跳转下一步
      [events.ui.ADDCLASS](e) {
        wx: wx.navigateTo({
          url: '../p_add/schoolin_add2',
        })
      }
    }
  }

  mapEffect() {
    return {
      //用户信息
      [effects.GET_USER_INFO]({
        option
      }) {
        this.$api.user.gerUserInfo().then(
          (res) => {
            console.log(res.data.result)
            if (res.data.errorCode == 0) {
              this.setData({
                userInfo: res.data.result
              })
              this.$storage.set('userInfo', res.data.result);
              if (this.data.userInfo.role == '0') {
                // put(effects.GET_CHILD);
              }
              if (typeof option.classId != 'undefined') {
                const classId = option.classId;
                this.setData({
                  'model.classId': classId
                });
                // put(effects.GET_CLASS_INFO);
              }
            } else {
              this.$common.showMessage(this, res.data.errorMessage);
              return;
            }
          }
        );
      },
    }
  }
}

EApp.instance.register({
  type: schoolinCurriculumPage,
  id: 'schoolinCurriculumPage',
  config: {
    events,
    effects,
    actions
  }
});
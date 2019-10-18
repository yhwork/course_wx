import { EApp, EPage, PAGE_LIFE } from '../../eea/index'
import { events, effects, actions } from './mobilevalid.eea'

class MobilevalidPage extends EPage {
    get data() {
        return {
          
        };
    }

    mapPageEvent({ put, dispatch }) {
        return {
            [PAGE_LIFE.ON_LOAD](option) {
             
            },
            [PAGE_LIFE.ON_SHOW]() {

            }
        }
    }

    mapUIEvent({ put }) {
        return {

        }
    }

    mapEffect({ put }) {
    	const api = this.$api;
        return {
            
            
        }
    }

    mapAction({ }) {
        return {
        }
    }
}

EApp.instance.register({
    type: MobilevalidPage,
    id: 'MobilevalidPage',
    config: { events, effects, actions }
});
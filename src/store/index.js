import Vue from 'vue';
import Vuex from 'vuex';
import state from './state';
import mutations from './mutations';
import actions from './actions';

import book from './modules/book';
import user from './modules/user';

Vue.use(Vuex);

export default new Vuex.Store({state: {
  ...state,
  ...user.state,
  ...book.state,
},
mutations: {
    ...mutations,
    ...user.mutations,
    ...book.mutations,
  },
  actions,
});

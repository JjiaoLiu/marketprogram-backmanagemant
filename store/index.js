import {getCookieFromServer} from "../util";
import Cookies from 'js-cookie'

export const state = () => ({
  auth: null,
  roles: ''
});

export const mutations = {
  setData(state, payload) {
    state[payload.key] = payload.value
  },
};
export const actions = {
  async nuxtServerInit({commit, dispatch}, {req}) {
    let auth = null;
    if (req && req.headers.cookie && getCookieFromServer('access_token', req.headers.cookie) !== undefined) {
      auth = getCookieFromServer('access_token', req.headers.cookie);
    }
    if (auth) {
      commit('setData', {
        key: 'auth',
        value: auth
      });
      await dispatch('check_token');
    }
  },
  async login({commit}, form) {
    return await this.$axios.post('/oauth/token', form).then(res => {
      if(res.access_token){
        Cookies.set('access_token', res.access_token);
        commit('setData', {
          key: 'auth',
          value: res.access_token,
        });
        this.$axios.setToken(res.access_token, 'Bearer');
      }else{
        console.log('error',res)
      }
    });
  },
  async logout({commit}) {
    commit('setData', {
      key: 'auth',
      value: ''
    });
    Cookies.remove('access_token');
    Cookies.remove('userName');
  },
  async check_token({state}) {
    return await this.$axios.get('/oauth/check_token?token=' + state.auth);
  }
};

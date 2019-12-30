import {getCookieFromServer} from "../util";
import Cookie from 'js-cookie'

export default function ({$axios, redirect, req}) {
  $axios.interceptors.request.use(config => {
    if (config.url === '/oauth/token') {
      return config;
    }
    let token;
    if (process.server && req && req.headers.cookie && getCookieFromServer('access_token', req.headers.cookie) !== undefined) { //check_auth
      token = getCookieFromServer('access_token', req.headers.cookie);
      config.headers.common['Authorization'] = 'Bearer ' + token;
      return config;
    }
    if (process.client && Cookie.get('access_token') !== undefined) {
      config.headers.common['Authorization'] = 'Bearer ' + Cookie.get('access_token');
      return config;
    }
    return Promise.reject(req);
  }, function (error) {
    console.log(error)
  });
  $axios.interceptors.response.use(function (response) {
    if (response.data && (response.status === 403 || response.status === 401)) {
      console.log('请求重定向');
      redirect("/login");
    } else if (response.status === 200) {
      if (response.config.url.includes('/oauth/')) {
        return response.data;
      }
      if (response.data.code === 0 && response.data.data) {
        return response.data.data;
      }
    } else {
      return Promise.reject(response);
    }
    return response;
  }, function (error) {
    console.log(error)
  });
}

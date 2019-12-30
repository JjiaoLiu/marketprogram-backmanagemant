export default ({app}) => {
  app.router.beforeEach((to, from, next) => {
    if (to.name === 'login') {
      return next()
    }
    if (!app.store.state.auth) {
      return next({name: 'login'})
    }
    app.$axios.get('/merch/admin/roles').then(res => {
      app.store.commit('setData', {key: 'roles', value: res});
      if (to.name === 'index-permit') {//这个请求判断刨除系统管理情况
        if (res === '管理员') {
          return next()
        }
        return next(false)
      }
      return next()
    });
  });
}

import Cookie from 'js-cookie'

export default ({store, redirect}) => {
  const {auth} = store.state || Cookie.get('access_token');
  if (process.server) {
    if (!auth) {
      console.log('server，路由重定向')
      redirect('/login')
    }
  }
  if (process.client) {
    if (!Cookie.get('access_token')) {
      console.log('client，路由重定向')
      redirect('/login')
    }
  }
}

export default function ({ store, redirect, isDev }) {
  const user = store.getters.user;
  // not logged in => redirect to '/login'
  if (user) {
    isDev && console.log('👩‍💻', user)
  } else {
    isDev && console.log('⚠ 無登入資訊，重新導向登入畫面 ... ')
    return redirect("/login");
  }
}

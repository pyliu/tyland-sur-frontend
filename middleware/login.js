export default function ({ store, redirect, isDev }) {
  // not logged in => redirect to '/login'
  if (store.getters.loggedIn) {
    isDev && console.log('👩‍💻', sotre.getters.user)
  } else {
    isDev && console.log('⚠ 無登入資訊，重新導向登入畫面 ... ')
    return redirect("/login");
  }
}

export default function ({ store, redirect }) {
  const user = store.getters.user;
  // not logged in => redirect to '/login'
  if (user === false) {
    return redirect("/login");
  }
}

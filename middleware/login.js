export default function ({ store, redirect }) {
  const user = store.getters.user;
  console.log('👩‍💻', user)
  // not logged in => redirect to '/login'
  if (!user) {
    return redirect("/login");
  }
}

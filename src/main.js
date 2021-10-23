import { createApp } from "vue";
import router from './router'
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/packages/theme-chalk/src/index.scss";
import "./index.css";

const app = createApp(App).use(router).use(ElementPlus).mount("#app");

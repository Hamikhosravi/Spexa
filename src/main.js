import {createApp} from 'vue';
import App from './App.vue';
// import * as Utils from "./utils/index";
import router from './router'
import {store} from './store'
import { Quasar } from "quasar";
import quasarUserOptions from './quasar-user-options';
import Loading from "./components/Loading";
import createDirectory from "./components/CreateDirectory";
import deleteDirectory from "./components/DeleteDirectory";
import newTokenRequest from "./Mixins/newTokenRequest";
import "./styles/general.css";

let baseUrl = "";
const mode = "development";
if (mode === "development") {
    baseUrl = "https://spexa.tk/";
} else if (mode === "production") {
    baseUrl = "https://spexa.tk/";
}

const app = createApp(App);
app.component('Loading',Loading);
app.component("CreateDirectory", createDirectory);
app.component("DeleteDirectory", deleteDirectory);
app.mixin(newTokenRequest);
app.use(Quasar, quasarUserOptions);
app.use(router);
app.use(store);
// app.config.globalProperties.$utils = Utils;
app.config.globalProperties.$baseUrl = baseUrl;
app.provide("baseUrl", baseUrl);
app.mount('#app');

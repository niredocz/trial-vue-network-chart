import { createApp } from "vue";
import "./style.css";
import router from "./router";
import App from "./App.vue";
// ts-ignore
// import { Timeline } from 'vue-visjs'
import { Timeline, Network } from 'vue3-visjs'
import VNetworkGraph from "v-network-graph";
import "v-network-graph/lib/style.css";

const app = createApp(App);

app.use(VNetworkGraph);
app.component('timeline', Timeline);
app.component('network', Network);
app.use(router);

app.mount("#app");

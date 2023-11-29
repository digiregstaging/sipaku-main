import { createApp } from "vue";
import VueTippy from "vue-tippy";
import App from "./App.vue";
import router from "./router";

import "./styles.scss";
import "splitpanes/dist/splitpanes.css";
import "tippy.js/dist/tippy.css";
import "animate.css";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS

createApp(App).use(router).use(VueTippy).mount("#app");

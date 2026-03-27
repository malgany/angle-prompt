import { App } from "./app/app.js";
import { AppConfig } from "./config/app-config.js";

const app = new App(AppConfig);
app.init();

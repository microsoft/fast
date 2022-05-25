import { installWindowOnGlobal } from "./dom-shim.js";
import { createWindow } from "./foundation-dom-shim.js";

installWindowOnGlobal(createWindow());

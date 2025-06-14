import { createWindow, installWindowOnGlobal } from "./dom-shim.js";

installWindowOnGlobal(createWindow());

import { enableDebug } from "./debug.js";
import { DOM } from "./dom.js";
import { DOMPolicy } from "./dom-policy.js";

enableDebug();

export * from "./index.js";

DOM.setPolicy(DOMPolicy.create());

import { DOMPolicy } from "./dom-policy.js";
import { DOM } from "./dom.js";

export * from "./index.js";

DOM.setPolicy(DOMPolicy.create());

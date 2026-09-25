import { DOM } from "@microsoft/fast-element";
import { DOMPolicy } from "@microsoft/fast-element/dom-policy.js";

export * from "@microsoft/fast-element";
export * from "./index.js";

DOM.setPolicy(DOMPolicy.create());

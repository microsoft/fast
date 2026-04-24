import { FASTElement } from "@microsoft/fast-element";
import { customElement } from "@microsoft/fast-element/fast-element.js";
import { Router, type RouterElement } from "./router.js";

/**
 * @beta
 */
@customElement("fast-router")
export class FASTRouter extends (Router.from(FASTElement) as {
    new (): FASTElement & RouterElement;
}) {}

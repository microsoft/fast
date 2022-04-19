import { customElement, FASTElement } from "@microsoft/fast-element";
import { Router, RouterElement } from "./router.js";

/**
 * @alpha
 */
@customElement("fast-router")
export class FASTRouter extends (Router.from(FASTElement) as {
    new (): FASTElement & RouterElement;
}) {}

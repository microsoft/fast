import { customElement, FASTElement } from "@microsoft/fast-element";
import { Router, RouterElement } from "./router";

@customElement("fast-router")
export class FASTRouter extends (Router.from(FASTElement) as {
    new (): FASTElement & RouterElement;
}) {}

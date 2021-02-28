import { customElement, FASTElement } from "@microsoft/fast-element";
import { Router } from "./router";

@customElement("fast-router")
export class FASTRouter extends Router.from(FASTElement) {}

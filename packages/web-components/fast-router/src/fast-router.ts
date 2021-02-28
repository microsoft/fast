import { customElement, FASTElement } from "@microsoft/fast-element";
import { Router } from "./router";
import { RouterConfiguration } from "./configuration";

@customElement("fast-router")
export class FASTRouter extends FASTElement {
    public readonly $router!: Router;

    public get config(): RouterConfiguration {
        return this.$router.config!;
    }

    public set config(value: RouterConfiguration) {
        this.$router.config = value;
    }

    constructor() {
        super();
        Router.getOrCreateFor(this);
    }

    connectedCallback() {
        super.connectedCallback();
        this.$router.connect();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.$router.disconnect();
    }
}

import { FastElement } from "@microsoft/fast-element";

export class Tab extends FastElement {
    protected proxy = document.createElement("input");

    constructor() {
        super();

        this.proxy.setAttribute("type", "button");
    }
}

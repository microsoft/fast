import { FASTElement } from "@microsoft/fast-element";

export class Tab extends FASTElement {
    protected proxy = document.createElement("input");

    constructor() {
        super();

        this.proxy.setAttribute("type", "button");
    }
}

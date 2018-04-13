import { PolymerElement } from "../../node_modules/@polymer/polymer/polymer-element.js";

export default class PolymerHeading extends PolymerElement {
    private class: string;

    constructor() {
        super();

        this.class = "";
    }

    static get is(): string {
        return "polymer-heading";
    }

    static get template(): string {
        const style: string = `<style></style>`;
        const element: string = `<h2 class="[[class]]"><slot></slot></h2>`;
        return style + element;
    }

    static get properties(): any {
        return {
            class: String
        };
    }
}

customElements.define(PolymerHeading.is, PolymerHeading);

export default class FancyButton extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: "open" });
        const wrapper = document.createElement("button");
        const defaultSlot = document.createElement("slot");
        wrapper.appendChild(defaultSlot);

        shadow.appendChild(wrapper);
    }
}

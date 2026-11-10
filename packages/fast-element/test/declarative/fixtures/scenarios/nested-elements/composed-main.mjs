import { attr } from "@microsoft/fast-element/attr.js";
import { FASTElement } from "@microsoft/fast-element/fast-element.js";
import { enableHydration, markers_v2 } from "@microsoft/fast-element/hydration.js";
import { observable } from "@microsoft/fast-element/observable.js";
import { template as childTemplate } from "./composed-child.template.js";
import { template as parentTemplate } from "./composed-parent.template.js";

const state = JSON.parse(document.querySelector("#state").textContent);

class ComposedParent extends FASTElement {
    constructor() {
        super();
        this.heading = state.heading;
        this.message = state.message;
        this.items = state.items;
        this.show = state.show;
    }
}
for (const name of ["heading", "message", "items", "show"]) {
    observable(ComposedParent.prototype, name);
}

class ComposedChild extends FASTElement {
    constructor() {
        super();
        this.message = "";
        this.items = [];
        this.clicks = 0;
    }

    increment() {
        this.clicks++;
    }
}
attr(ComposedChild.prototype, "message");
observable(ComposedChild.prototype, "items");
observable(ComposedChild.prototype, "clicks");

window.startHydration = async markersV2 => {
    const hydration = enableHydration(markersV2 ? { markers: markers_v2 } : undefined);
    await ComposedParent.define({
        name: "composed-parent",
        template: parentTemplate,
        shadowOptions: { mode: "open", delegatesFocus: true },
    });
    await ComposedChild.define({
        name: "composed-child",
        template: childTemplate,
    });
    await hydration.whenHydrated();
};

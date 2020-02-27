import { ElementView } from "./view";
import { Controller } from "./controller";
import { CustomElementDefinition } from "./custom-element";
import { ShadowDOMStyles } from "./styles";

export interface ElementProjector {
    readonly host: HTMLElement;
    project(view: ElementView, controller: Controller): void;
}

export class ShadowDOMProjector implements ElementProjector {
    public readonly shadowRoot: ShadowRoot;

    constructor(public readonly host: HTMLElement, definition: CustomElementDefinition) {
        this.shadowRoot = host.attachShadow(definition.shadowOptions!);
    }

    public project(view: ElementView, controller: Controller) {
        view.appendTo(this.shadowRoot);

        const styles = controller.get(ShadowDOMStyles);
        if (styles !== null) {
            styles.applyTo(this.shadowRoot);
        }
    }
}

export class HostProjector implements ElementProjector {
    constructor(public readonly host: HTMLElement) {}

    public project(view: ElementView, controller: Controller) {
        view.appendTo(this.host);
    }
}

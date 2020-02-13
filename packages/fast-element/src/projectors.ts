import { IElementView } from "./view";
import { Controller } from "./controller";
import { CustomElementDefinition } from "./custom-element";
import { IShadowDOMStyles } from "./styles";

export interface IElementProjector {
    readonly host: HTMLElement;
    project(view: IElementView, controller: Controller): void;
}

export class ShadowDOMProjector implements IElementProjector {
    public readonly shadowRoot: ShadowRoot;

    constructor(public readonly host: HTMLElement, definition: CustomElementDefinition) {
        this.shadowRoot = host.attachShadow(definition.shadowOptions!);
    }

    public project(view: IElementView, controller: Controller) {
        view.appendTo(this.shadowRoot);

        const styles = controller.get(IShadowDOMStyles);
        if (styles !== null) {
            styles.applyTo(this.shadowRoot);
        }
    }
}

export class HostProjector implements IElementProjector {
    constructor(public readonly host: HTMLElement) {}

    public project(view: IElementView, controller: Controller) {
        view.appendTo(this.host);
    }
}

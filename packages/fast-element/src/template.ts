import { TemplateCompiler } from "./template-compiler";
import { TargetedInstruction } from "./instructions";
import { HTMLView, ElementView, SyntheticView, View } from "./view";
import { DOM } from "./dom";
import { Behavior } from "./behaviors/behavior";
import { Getter, AccessScopeExpression } from "./expression";
import { Directive } from "./directives/directive";
import { BindingDirective } from "./directives/bind";

export interface Template {
    create(): View;
}

export interface ElementViewTemplate extends Template {
    create(): ElementView;
}

export interface SyntheticViewTemplate extends Template {
    create(): SyntheticView;
}

export class HTMLTemplate extends Directive
    implements ElementViewTemplate, SyntheticViewTemplate {
    public behavior = HTMLTemplateBehavior;

    constructor(
        private templateElement: HTMLTemplateElement,
        private instructions: TargetedInstruction[]
    ) {
        super();

        const fragment = templateElement.content;

        if (DOM.isMarker(fragment.firstChild!)) {
            fragment.insertBefore(DOM.createLocation(), fragment.firstChild);
        }
    }

    public create() {
        const fragment = this.templateElement.content.cloneNode(true) as DocumentFragment;
        const targets = fragment.querySelectorAll(".fm");
        const instructions = this.instructions;
        const behaviors: Behavior[] = [];

        for (let i = 0, ii = targets.length; i < ii; ++i) {
            instructions[i].hydrate(targets[i], behaviors);
        }

        return new HTMLView(fragment, behaviors);
    }

    public createPlaceholder(instructionIndex: number) {
        return DOM.createLocationPlaceholder(instructionIndex);
    }
}

export class HTMLTemplateBehavior implements Behavior {
    private location: Node;
    private view: SyntheticView;

    constructor(directive: SyntheticViewTemplate, marker: HTMLElement) {
        this.location = DOM.convertMarkerToLocation(marker);
        this.view = directive.create();
        this.view.insertBefore(this.location);
    }

    bind(source: unknown) {
        this.view.bind(source);
    }

    unbind() {
        this.view.unbind();
    }
}

export interface CaptureType<T> {}
type TemplateValue<T> = Getter<T> | string | number | Directive | CaptureType<T>;

export function html<T = any>(
    strings: TemplateStringsArray,
    ...values: TemplateValue<T>[]
) {
    const directives: Directive[] = [];
    let html = "";

    for (let i = 0, ii = strings.length - 1; i < ii; ++i) {
        html += strings[i];
        let value = values[i];

        if (typeof value === "function") {
            value = new BindingDirective(new AccessScopeExpression(value as Getter));
        }

        if (value instanceof Directive) {
            html += value.createPlaceholder(i);
            directives.push(value);
        } else {
            html += value;
        }
    }

    html += strings[strings.length - 1];

    return TemplateCompiler.instance.compile(html, directives);
}

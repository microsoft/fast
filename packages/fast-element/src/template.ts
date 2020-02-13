import { TemplateCompiler } from "./template-compiler";
import { ITargetedInstruction } from "./instructions";
import { HTMLView, IElementView, ISyntheticView } from "./view";
import { DOM } from "./dom";
import { IBehavior } from "./behaviors/behavior";
import { Getter, AccessScopeExpression } from "./expression";
import { Directive } from "./directives/directive";
import { BindingDirective } from "./directives/bind";

export interface ITemplate {
    create(synthetic: false): IElementView | null;
    create(synthetic: true): ISyntheticView;
}

export class HTMLTemplate extends Directive implements ITemplate {
    public behavior = HTMLTemplateBehavior;

    constructor(
        private templateElement: HTMLTemplateElement,
        private instructions: ITargetedInstruction[]
    ) {
        super();
    }

    public create(synthetic: boolean) {
        const fragment = this.templateElement.content.cloneNode(true) as DocumentFragment;
        const targets = fragment.querySelectorAll(".fm");
        const behaviors: IBehavior[] = [];

        for (let i = 0, ii = targets.length; i < ii; ++i) {
            this.instructions[i].hydrate(targets[i], behaviors);
        }

        return new HTMLView(fragment, behaviors, synthetic);
    }

    public createPlaceholder(instructionIndex: number) {
        return DOM.createLocationPlaceholder(instructionIndex);
    }
}

export class HTMLTemplateBehavior implements IBehavior {
    private location: Node;
    private view: ISyntheticView;

    constructor(directive: ITemplate, marker: HTMLElement) {
        this.location = DOM.convertMarkerToLocation(marker);
        this.view = directive.create(true);
        this.view.insertBefore(this.location);
    }

    bind(source: unknown) {
        this.view.bind(source);
    }

    unbind() {
        this.view.unbind();
    }
}

export const noopTemplate: ITemplate = {
    create() {
        return null as any;
    },
};

export interface ICaptureType<T> {}
type TemplateValue<T> = Getter<T> | string | number | Directive | ICaptureType<T>;

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

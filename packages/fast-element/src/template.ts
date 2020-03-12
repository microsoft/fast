import { TemplateCompiler } from "./template-compiler";
import { HTMLView, ElementView, SyntheticView, View } from "./view";
import { DOM } from "./dom";
import { Behavior, BehaviorFactory } from "./directives/behavior";
import { Expression } from "./interfaces";
import { Directive } from "./directives/directive";
import { BindingDirective } from "./directives/binding";

export interface ElementViewTemplate {
    create(host: Element): ElementView;
}

export interface SyntheticViewTemplate {
    create(): SyntheticView;
}

export class HTMLTemplate extends Directive
    implements ElementViewTemplate, SyntheticViewTemplate {
    constructor(
        private templateElement: HTMLTemplateElement,
        private viewBehaviorFactories: BehaviorFactory[],
        private hostBehaviorFactory: BehaviorFactory | null = null
    ) {
        super();

        const fragment = templateElement.content;

        if (DOM.isMarker(fragment.firstChild!)) {
            fragment.insertBefore(DOM.createLocation(), fragment.firstChild);
        }
    }

    public create(host?: Element) {
        const fragment = this.templateElement.content.cloneNode(true) as DocumentFragment;
        const targets = fragment.querySelectorAll(".fm");
        const viewBehaviorFactories = this.viewBehaviorFactories;
        const hostBehaviorFactories = this.hostBehaviorFactory;
        const hasHostBehaviors = host !== void 0 && hostBehaviorFactories !== null;
        const behaviorCount = hasHostBehaviors
            ? viewBehaviorFactories.length + 1
            : viewBehaviorFactories.length;
        const behaviors = new Array<Behavior>(behaviorCount);

        for (let i = 0, ii = targets.length; i < ii; ++i) {
            behaviors[i] = viewBehaviorFactories[i].createBehavior(targets[i]);
        }

        if (hasHostBehaviors) {
            behaviors[behaviorCount - 1] = hostBehaviorFactories!.createBehavior(host);
        }

        return new HTMLView(fragment, behaviors);
    }

    public createPlaceholder(index: number) {
        return DOM.createBlockPlaceholder(index);
    }

    public createBehavior(target: any) {
        return new HTMLTemplateBehavior(this, target);
    }
}

export class HTMLTemplateBehavior implements Behavior {
    private location: Node;
    private view: SyntheticView;

    constructor(template: SyntheticViewTemplate, marker: HTMLElement) {
        this.location = DOM.convertMarkerToLocation(marker);
        this.view = template.create();
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
type TemplateValue<T> = Expression<T> | string | number | Directive | CaptureType<T>;

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
            value = new BindingDirective(value as Expression);
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

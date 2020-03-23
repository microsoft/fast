import { compileTemplate } from "./template-compiler";
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
    public createPlaceholder = DOM.createBlockPlaceholder;
    private behaviorCount: number;
    private hasHostBehaviors: boolean;
    private fragment: DocumentFragment;
    private targetOffset = 0;
    constructor(
        { content: fragment }: HTMLTemplateElement,
        private viewBehaviorFactories: BehaviorFactory[],
        private hostBehaviorFactories: BehaviorFactory[]
    ) {
        super();

        this.fragment = fragment;
        this.behaviorCount =
            this.viewBehaviorFactories.length + this.hostBehaviorFactories.length;
        this.hasHostBehaviors = this.hostBehaviorFactories.length > 0;

        if (DOM.isMarker(fragment.firstChild!)) {
            // If the first node in a fragment is a marker, that means it's an unstable first node,
            // because something like a when, repeat, etc. could add nodes before the marker.
            // To mitigate this, we insert a stable first node. However, if we insert a node,
            // that will alter the result of the TreeWalker. So, we also need to offset the target index.
            fragment.insertBefore(document.createComment(""), fragment.firstChild);
            this.targetOffset = -1;
        }
    }

    public create(host?: Element) {
        const fragment = this.fragment.cloneNode(true) as DocumentFragment;
        const viewFactories = this.viewBehaviorFactories;
        const behaviors = new Array<Behavior>(this.behaviorCount);
        const walker = document.createTreeWalker(
            fragment,
            133, // element, text, comment
            null,
            false
        );

        let behaviorIndex = 0;
        let targetIndex = this.targetOffset;
        let node = walker.nextNode();

        for (let ii = viewFactories.length; behaviorIndex < ii; ++behaviorIndex) {
            const factory = viewFactories[behaviorIndex];
            const factoryIndex = factory.targetIndex;

            while (node !== null) {
                if (targetIndex === factoryIndex) {
                    behaviors[behaviorIndex] = factory.createBehavior(node);
                    break;
                } else {
                    node = walker.nextNode();
                    targetIndex++;
                }
            }
        }

        if (this.hasHostBehaviors) {
            const hostFactories = this.hostBehaviorFactories;

            for (let i = 0, ii = hostFactories.length; i < ii; ++i, ++behaviorIndex) {
                behaviors[behaviorIndex] = hostFactories[i].createBehavior(host);
            }
        }

        return new HTMLView(fragment, behaviors);
    }

    public createBehavior(target: any) {
        return new HTMLTemplateBehavior(this, target);
    }
}

export class HTMLTemplateBehavior implements Behavior {
    private view: SyntheticView;

    constructor(template: SyntheticViewTemplate, location: HTMLElement) {
        this.view = template.create();
        this.view.insertBefore(location);
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

    return compileTemplate(html, directives);
}

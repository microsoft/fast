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
    constructor(
        private templateElement: HTMLTemplateElement,
        private viewBehaviorFactories: BehaviorFactory[],
        private hostBehaviorFactories: BehaviorFactory[]
    ) {
        super();
        this.behaviorCount =
            this.viewBehaviorFactories.length + this.hostBehaviorFactories.length;
        this.hasHostBehaviors = this.hostBehaviorFactories.length > 0;
    }

    public create(host?: Element) {
        const fragment = this.templateElement.content.cloneNode(true) as DocumentFragment;
        const viewFactories = this.viewBehaviorFactories;
        const behaviors = new Array<Behavior>(this.behaviorCount);
        const walker = document.createTreeWalker(
            fragment,
            133, // element, text, comment
            null,
            false
        );

        let targetIndex = 0;
        let behaviorIndex = 0;
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

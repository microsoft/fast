import { compileTemplate } from "./template-compiler";
import { ElementView, HTMLView, SyntheticView } from "./view";
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

export class HTMLTemplateBehavior implements Behavior {
    private view: SyntheticView;

    constructor(template: SyntheticViewTemplate, location: HTMLElement) {
        this.view = template.create();
        this.view.insertBefore(location);
    }

    bind(source: unknown): void {
        this.view.bind(source);
    }

    unbind(): void {
        this.view.unbind();
    }
}

export class ViewTemplate extends Directive
    implements ElementViewTemplate, SyntheticViewTemplate {
    public createPlaceholder: (index: number) => string = DOM.createBlockPlaceholder;
    private behaviorCount: number = 0;
    private hasHostBehaviors: boolean = false;
    private fragment: DocumentFragment | null = null;
    private targetOffset: number = 0;
    private viewBehaviorFactories: BehaviorFactory[] | null = null;
    private hostBehaviorFactories: BehaviorFactory[] | null = null;

    constructor(
        private html: string | HTMLTemplateElement,
        private directives: Directive[]
    ) {
        super();
    }

    public create(host?: Element): HTMLView {
        if (this.fragment === null) {
            let template: HTMLTemplateElement;
            const html = this.html;

            if (typeof html === "string") {
                template = document.createElement("template");
                template.innerHTML = DOM.createHTML(html);

                const fec = template.content.firstElementChild;

                if (fec !== null && fec.tagName === "TEMPLATE") {
                    template = fec as HTMLTemplateElement;
                }
            } else {
                template = html;
            }

            const result = compileTemplate(template, this.directives);

            this.fragment = result.fragment;
            this.viewBehaviorFactories = result.viewBehaviorFactories;
            this.hostBehaviorFactories = result.hostBehaviorFactories;
            this.targetOffset = result.targetOffset;
            this.behaviorCount =
                this.viewBehaviorFactories.length + this.hostBehaviorFactories.length;
            this.hasHostBehaviors = this.hostBehaviorFactories.length > 0;
        }

        const fragment = this.fragment.cloneNode(true) as DocumentFragment;
        const viewFactories = this.viewBehaviorFactories!;
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
            const hostFactories = this.hostBehaviorFactories!;

            for (let i = 0, ii = hostFactories.length; i < ii; ++i, ++behaviorIndex) {
                behaviors[behaviorIndex] = hostFactories[i].createBehavior(host);
            }
        }

        return new HTMLView(fragment, behaviors);
    }

    public createBehavior(target: any): HTMLTemplateBehavior {
        return new HTMLTemplateBehavior(this, target);
    }
}

// Much thanks to LitHTML for working this out!
export const lastAttributeNameRegex =
    // eslint-disable-next-line no-control-regex
    /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface CaptureType<T> {}
type TemplateValue<T> = Expression<T> | string | number | Directive | CaptureType<T>;

export function html<T = any>(
    strings: TemplateStringsArray,
    ...values: TemplateValue<T>[]
): ViewTemplate {
    const directives: Directive[] = [];
    let html = "";

    for (let i = 0, ii = strings.length - 1; i < ii; ++i) {
        const currentString = strings[i];
        let value = values[i];

        html += currentString;

        if (typeof value === "function") {
            value = new BindingDirective(value as Expression);

            const match = lastAttributeNameRegex.exec(currentString);
            if (match !== null) {
                (value as BindingDirective).targetName = match[2];
            }
        }

        if (value instanceof Directive) {
            html += value.createPlaceholder(i);
            directives.push(value);
        } else {
            html += value;
        }
    }

    html += strings[strings.length - 1];

    return new ViewTemplate(html, directives);
}

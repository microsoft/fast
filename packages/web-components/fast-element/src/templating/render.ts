import { FASTElementDefinition } from "../components/fast-definitions.js";
import type { FASTElement } from "../components/fast-element.js";
import { Constructable, isFunction, isString } from "../interfaces.js";
import type { Behavior } from "../observation/behavior.js";
import type { Subscriber } from "../observation/notifier.js";
import {
    Binding,
    BindingObserver,
    ExecutionContext,
    Observable,
} from "../observation/observable.js";
import type {
    AddViewBehaviorFactory,
    HTMLDirective,
    ViewBehaviorTargets,
} from "./html-directive.js";
import { Markup } from "./markup.js";
import {
    CaptureType,
    html,
    SyntheticViewTemplate,
    TemplateValue,
    ViewTemplate,
} from "./template.js";

export interface ContentView {
    /**
     * Binds a view's behaviors to its binding source.
     * @param source - The binding source for the view's binding behaviors.
     * @param context - The execution context to run the view within.
     */
    bind(source: any, context: ExecutionContext): void;

    /**
     * Unbinds a view's behaviors from its binding source and context.
     */
    unbind(): void;

    /**
     * Inserts the view's DOM nodes before the referenced node.
     * @param node - The node to insert the view's DOM before.
     */
    insertBefore(node: Node): void;

    /**
     * Removes the view's DOM nodes.
     * The nodes are not disposed and the view can later be re-inserted.
     */
    remove(): void;
}

export interface ContentTemplate {
    /**
     * Creates a simple content view instance.
     */
    create(): ContentView;
}

export class RenderBehavior<TSource = any> implements Behavior, Subscriber {
    private source: TSource | null = null;
    private view: ContentView | null = null;
    private template!: ContentTemplate;
    private templateBindingObserver: BindingObserver<TSource, ContentTemplate>;
    private data: any | null = null;
    private dataBindingObserver: BindingObserver<TSource, any[]>;
    private originalContext: ExecutionContext | undefined = void 0;
    private childContext: ExecutionContext | undefined = void 0;

    public constructor(
        private location: Node,
        private dataBinding: Binding<TSource, any[]>,
        private templateBinding: Binding<TSource, ContentTemplate>
    ) {
        this.dataBindingObserver = Observable.binding(dataBinding, this, true);

        this.templateBindingObserver = Observable.binding(templateBinding, this, true);
    }

    public bind(source: TSource, context: ExecutionContext): void {
        this.source = source;
        this.originalContext = context;
        this.childContext = context.createChildContext(source);
        this.data = this.dataBindingObserver.observe(source, this.originalContext);
        this.template = this.templateBindingObserver.observe(
            source,
            this.originalContext
        );

        this.refreshView();
    }

    public unbind(): void {
        this.source = null;
        this.data = null;

        if (this.view !== null) {
            this.view.unbind();
        }

        this.dataBindingObserver.dispose();
        this.templateBindingObserver.dispose();
    }

    /** @internal */
    public handleChange(source: any): void {
        if (source === this.dataBinding) {
            this.data = this.dataBindingObserver.observe(
                this.source!,
                this.originalContext!
            );

            this.refreshView();
        } else if (source === this.templateBinding) {
            this.template = this.templateBindingObserver.observe(
                this.source!,
                this.originalContext!
            );

            this.refreshView();
        }
    }

    private refreshView() {
        if (this.view !== null) {
            this.view.remove();
            this.view.unbind();
        }

        this.view = this.template.create();
        this.view.bind(this.data, this.childContext!);
        this.view.insertBefore(this.location);
    }
}

export class RenderDirective<TSource = any> implements HTMLDirective {
    public id: string;
    public nodeId: string;

    public constructor(
        private dataBinding: Binding,
        private templateBinding: Binding<TSource, ContentTemplate>
    ) {}

    public createHTML(add: AddViewBehaviorFactory): string {
        return Markup.comment(add(this));
    }

    public createBehavior(targets: ViewBehaviorTargets): RenderBehavior<TSource> {
        return new RenderBehavior<TSource>(
            targets[this.nodeId],
            this.dataBinding,
            this.templateBinding
        );
    }
}

export interface RenderInstruction {
    brand: symbol;
    type: Constructable;
    template: ContentTemplate;
    name: string;
}

const typeToInstructionLookup = new Map<
    Constructable,
    Record<string, RenderInstruction>
>();
const defaultViewName = "default-view";
const nullTemplate = html`
    &nbsp;
`;

function definitionToTemplate(def: RenderInstruction | undefined) {
    if (def === void 0) {
        return nullTemplate;
    }

    return def.template;
}

export function render<TSource = any, TItem = any>(
    binding?: Binding<TSource, TItem>,
    templateOrTemplateBindingOrViewName?:
        | ContentTemplate
        | string
        | Binding<TSource, ContentTemplate | string>
): CaptureType<TSource> {
    const dataBinding = binding ?? (((source: TSource) => source) as Binding<TSource>);
    let templateBinding;

    if (templateOrTemplateBindingOrViewName === void 0) {
        templateBinding = (s: any, c: ExecutionContext) =>
            definitionToTemplate(RenderInstruction.getForInstance(dataBinding(s, c)));
    } else if (isFunction(templateOrTemplateBindingOrViewName)) {
        templateBinding = (s: any, c: ExecutionContext) => {
            let result = templateOrTemplateBindingOrViewName(s, c);

            if (isString(result)) {
                result = definitionToTemplate(
                    RenderInstruction.getForInstance(dataBinding(s, c), result)
                );
            }

            return result;
        };
    } else if (isString(templateOrTemplateBindingOrViewName)) {
        templateBinding = (s: any, c: ExecutionContext) =>
            definitionToTemplate(
                RenderInstruction.getForInstance(
                    dataBinding(s, c),
                    templateOrTemplateBindingOrViewName
                )
            );
    } else {
        templateBinding = (s: any, c: ExecutionContext) =>
            templateOrTemplateBindingOrViewName;
    }

    return new RenderDirective<TSource>(dataBinding, templateBinding);
}

export type CommonRenderOptions = {
    type: Constructable;
    name?: string;
};

export type TemplateRenderOptions = CommonRenderOptions & {
    template: ContentTemplate;
};

export type ElementRenderOptions<TSource = any, TParent = any> = CommonRenderOptions & {
    element: Constructable<FASTElement>;
    attributes?: Record<string, string | TemplateValue<TSource, TParent>>;
    content?: string | SyntheticViewTemplate;
};

export type RenderOptions = TemplateRenderOptions | ElementRenderOptions;

function isElementRenderOptions(object: any): object is ElementRenderOptions {
    return !!object.element;
}

const brand = Symbol("RenderInstruction");
/* eslint @typescript-eslint/naming-convention: "off"*/
const defaultAttributes = { ":model": x => x };

export const RenderInstruction = Object.freeze({
    instanceOf(object: any): object is RenderInstruction {
        return object && object.brand === brand;
    },
    create(options: RenderOptions): RenderInstruction {
        const name = options.name ?? defaultViewName;
        let template: ContentTemplate;

        if (isElementRenderOptions(options)) {
            const def = FASTElementDefinition.getByType(options.element);

            if (def) {
                template = RenderInstruction.createElementTemplate(
                    def.name,
                    options.attributes ?? defaultAttributes,
                    options.content
                );
            } else {
                throw new Error("Invalid element for model rendering.");
            }
        } else {
            template = options.template;
        }

        return {
            brand,
            type: options.type,
            name,
            template,
        };
    },
    createElementTemplate<TSource = any, TParent = any>(
        tagName: string,
        attributes?: Record<string, string | TemplateValue<TSource, TParent>>,
        content?: string | ContentTemplate
    ): ViewTemplate<TSource, TParent> {
        const markup = [`<${tagName}`];
        const values: Array<TemplateValue<TSource, TParent>> = [];

        if (attributes) {
            const attrNames = Object.getOwnPropertyNames(attributes);

            for (let i = 0, ii = attrNames.length; i < ii; ++i) {
                const name = attrNames[i];

                if (i === 0) {
                    markup[0] = `${markup[0]} ${name}="`;
                } else {
                    markup.push(`" ${name}="`);
                }

                values.push(attributes[name]);
            }
        }

        if (content && isFunction((content as any).create)) {
            markup.push(`">`);
            values.push(content);
            markup.push(`</${tagName}>`);
        } else {
            markup.push(`">${content ?? ""}</${tagName}>`);
        }

        return html((markup as any) as TemplateStringsArray, ...values);
    },
    register(optionsOrInstruction: RenderOptions | RenderInstruction): RenderInstruction {
        let lookup = typeToInstructionLookup.get(optionsOrInstruction.type);
        if (lookup === void 0) {
            typeToInstructionLookup.set(
                optionsOrInstruction.type,
                (lookup = Object.create(null) as {})
            );
        }

        const instruction = RenderInstruction.instanceOf(optionsOrInstruction)
            ? optionsOrInstruction
            : RenderInstruction.create(optionsOrInstruction);

        return (lookup[instruction.name] = instruction);
    },
    getByType(type: Constructable, name?: string): RenderInstruction | undefined {
        const entries = typeToInstructionLookup.get(type);

        if (entries === void 0) {
            return void 0;
        }

        return entries[name ?? defaultViewName];
    },
    getForInstance(object: any, name?: string): RenderInstruction | undefined {
        if (object) {
            return RenderInstruction.getByType(object.constructor, name);
        }

        return void 0;
    },
});

export function renderWith(options: Omit<ElementRenderOptions, "type">): ClassDecorator;
export function renderWith(options: Omit<TemplateRenderOptions, "type">): ClassDecorator;
export function renderWith(
    element: Constructable<FASTElement>,
    name?: string
): ClassDecorator;
export function renderWith(template: ContentTemplate, name?: string): ClassDecorator;
export function renderWith(value: any, name?: string) {
    return function (type: Constructable) {
        if (isFunction(value)) {
            RenderInstruction.register({ type, element: value, name });
        } else if (isFunction(value.create)) {
            RenderInstruction.register({ type, template: value, name });
        } else {
            RenderInstruction.register({ type, ...value });
        }
    };
}

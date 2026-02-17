import { FASTElementDefinition } from "../components/fast-definitions.js";
import type { FASTElement } from "../components/fast-element.js";
import type { DOMPolicy } from "../dom.js";
import { Constructable, isFunction, isString } from "../interfaces.js";
import { Binding, BindingDirective } from "../binding/binding.js";
import type { Subscriber } from "../observation/notifier.js";
import type {
    ExecutionContext,
    Expression,
    ExpressionObserver,
} from "../observation/observable.js";
import { oneTime } from "../binding/one-time.js";
import { oneWay } from "../binding/one-way.js";
import { normalizeBinding } from "../binding/normalize.js";
import type { ContentTemplate, ContentView } from "./html-binding-directive.js";
import {
    AddViewBehaviorFactory,
    HTMLDirective,
    ViewBehavior,
    ViewBehaviorFactory,
    ViewController,
} from "./html-directive.js";
import { Markup } from "./markup.js";
import {
    CaptureType,
    html,
    SyntheticViewTemplate,
    TemplateValue,
    ViewTemplate,
} from "./template.js";

type ComposableView = ContentView & {
    isComposed?: boolean;
    needsBindOnly?: boolean;
    $fastTemplate?: ContentTemplate;
};

/**
 * A Behavior that enables advanced rendering.
 * @public
 */
export class RenderBehavior<TSource = any> implements ViewBehavior, Subscriber {
    private location: Node | null = null;
    private controller: ViewController | null = null;
    private view: ComposableView | null = null;
    private template!: ContentTemplate;
    private templateBindingObserver: ExpressionObserver<TSource, ContentTemplate>;
    private data: any | null = null;
    private dataBindingObserver: ExpressionObserver<TSource, any[]>;

    /**
     * Creates an instance of RenderBehavior.
     * @param directive - The render directive that created this behavior.
     */
    public constructor(private directive: RenderDirective) {
        this.dataBindingObserver = directive.dataBinding.createObserver(this, directive);
        this.templateBindingObserver = directive.templateBinding.createObserver(
            this,
            directive
        );
    }

    /**
     * Bind this behavior.
     * @param controller - The view controller that manages the lifecycle of this behavior.
     */
    public bind(controller: ViewController): void {
        this.location = controller.targets[this.directive.targetNodeId];
        this.controller = controller;
        this.data = this.dataBindingObserver.bind(controller);
        this.template = this.templateBindingObserver.bind(controller);
        controller.onUnbind(this);
        this.refreshView();
    }

    /**
     * Unbinds this behavior.
     * @param controller - The view controller that manages the lifecycle of this behavior.
     */
    public unbind(controller: ViewController): void {
        const view = this.view;

        if (view !== null && view.isComposed) {
            view.unbind();
            view.needsBindOnly = true;
        }
    }

    /** @internal */
    public handleChange(source: any, observer: ExpressionObserver): void {
        if (observer === this.dataBindingObserver) {
            this.data = this.dataBindingObserver.bind(this.controller!);
        }

        if (
            this.directive.templateBindingDependsOnData ||
            observer === this.templateBindingObserver
        ) {
            this.template = this.templateBindingObserver.bind(this.controller!);
        }

        this.refreshView();
    }

    private refreshView() {
        let view = this.view;
        const template = this.template;

        if (view === null) {
            this.view = view = template.create();
            this.view.context.parent = this.controller!.source;
            this.view.context.parentContext = this.controller!.context;
        } else {
            // If there is a previous view, but it wasn't created
            // from the same template as the new value, then we
            // need to remove the old view if it's still in the DOM
            // and create a new view from the template.
            if (view.$fastTemplate !== template) {
                if (view.isComposed) {
                    view.remove();
                    view.unbind();
                }

                this.view = view = template.create();
                this.view.context.parent = this.controller!.source;
                this.view.context.parentContext = this.controller!.context;
            }
        }

        // It's possible that the value is the same as the previous template
        // and that there's actually no need to compose it.
        if (!view.isComposed) {
            view.isComposed = true;
            view.bind(this.data);
            view.insertBefore(this.location!);
            view.$fastTemplate = template;
        } else if (view.needsBindOnly) {
            view.needsBindOnly = false;
            view.bind(this.data);
        }
    }
}

/**
 * A Directive that enables use of the RenderBehavior.
 * @public
 */
export class RenderDirective<TSource = any>
    implements HTMLDirective, ViewBehaviorFactory, BindingDirective
{
    /**
     * The structural id of the DOM node to which the created behavior will apply.
     */ BindingDirective;
    public targetNodeId: string;

    /**
     * Creates an instance of RenderDirective.
     * @param dataBinding - A binding expression that returns the data to render.
     * @param templateBinding - A binding expression that returns the template to use to render the data.
     */
    public constructor(
        public readonly dataBinding: Binding<TSource>,
        public readonly templateBinding: Binding<TSource, ContentTemplate>,
        public readonly templateBindingDependsOnData: boolean
    ) {}

    /**
     * Creates HTML to be used within a template.
     * @param add - Can be used to add  behavior factories to a template.
     */
    public createHTML(add: AddViewBehaviorFactory): string {
        return Markup.comment(add(this));
    }

    /**
     * Creates a behavior.
     * @param targets - The targets available for behaviors to be attached to.
     */
    public createBehavior(): RenderBehavior<TSource> {
        return new RenderBehavior<TSource>(this);
    }
}

HTMLDirective.define(RenderDirective);

/**
 * Provides instructions for how to render a type.
 * @public
 */
export interface RenderInstruction {
    /**
     * Identifies this as a RenderInstruction.
     */
    brand: symbol;
    /**
     * The type this instruction is associated with.
     */
    type: Constructable;
    /**
     * The template to use when rendering.
     */
    template: ContentTemplate;
    /**
     * A name that can be used to identify the instruction.
     */
    name: string;
}

/**
 * Render options that are common to all configurations.
 * @public
 */
export type CommonRenderOptions = {
    /**
     * The type this instruction is associated with.
     */
    type: Constructable;
    /**
     * A name that can be used to identify the instruction.
     */
    name?: string;
};

/**
 * Render options used to specify a template.
 * @public
 */
export type TemplateRenderOptions = CommonRenderOptions & {
    /**
     * The template to use when rendering.
     */
    template: ContentTemplate;
};

/**
 * Render options that are common to all element render instructions.
 * @public
 */
export type BaseElementRenderOptions<
    TSource = any,
    TParent = any
> = CommonRenderOptions & {
    /**
     * Attributes to use when creating the element template.
     * @remarks
     * This API should be used with caution. When providing attributes, if not done properly,
     * you can open up the application to XSS attacks. When using this API, provide a strong
     * DOMPolicy that can properly sanitize and also be sure to manually sanitize attribute
     * values particularly if they can come from user input.
     */
    attributes?: Record<string, string | TemplateValue<TSource, TParent>>;

    /**
     * Content to use when creating the element template.
     * @remarks
     * This API should be used with caution. When providing content, if not done properly,
     * you can open up the application to XSS attacks. When using this API, provide a strong
     * DOMPolicy that can properly sanitize and also be sure to manually sanitize content
     * particularly if it can come from user input. Prefer passing a template
     * created by the the html tag helper rather than passing a raw string, as that will
     * enable the JS runtime to help secure the static strings.
     */
    content?: string | SyntheticViewTemplate;

    /**
     * The DOMPolicy to create the render instruction with.
     */
    policy?: DOMPolicy;
};

/**
 * Render options for directly creating an element with {@link RenderInstruction.createElementTemplate}
 * @public
 */
export type ElementCreateOptions<TSource = any, TParent = any> = Omit<
    BaseElementRenderOptions,
    "type" | "name"
> & {
    /**
     * Directives to use when creating the element template. These directives are applied directly to the specified tag.
     *
     * @remarks
     * Directives supported by this API are: `ref`, `children`, `slotted`, or any custom `HTMLDirective` that can be used on a HTML tag.
     */
    directives?: TemplateValue<TSource, TParent>[];
};

/**
 * Render options used to specify an element.
 * @public
 */
export type ElementConstructorRenderOptions<
    TSource = any,
    TParent = any
> = BaseElementRenderOptions<TSource, TParent> & {
    /**
     * The element to use when rendering.
     */
    element: Constructable<FASTElement>;
};

/**
 * Render options use to specify an element by tag name.
 * @public
 */
export type TagNameRenderOptions<TSource = any, TParent = any> = BaseElementRenderOptions<
    TSource,
    TParent
> & {
    /**
     * The tag name to use when rendering.
     */
    tagName: string;
};

type ElementRenderOptions<TSource = any, TParent = any> =
    | TagNameRenderOptions<TSource, TParent>
    | ElementConstructorRenderOptions<TSource, TParent>;

function isElementRenderOptions(object: any): object is ElementRenderOptions {
    return !!object.element || !!object.tagName;
}

const typeToInstructionLookup = new Map<
    Constructable,
    Record<string, RenderInstruction>
>();

/* eslint @typescript-eslint/naming-convention: "off"*/
const defaultAttributes = { ":model": x => x };
const brand = Symbol("RenderInstruction");
const defaultViewName = "default-view";
const nullTemplate = html`
    &nbsp;
`;

function instructionToTemplate(def: RenderInstruction | undefined) {
    if (def === void 0) {
        return nullTemplate;
    }

    return def.template;
}

function createElementTemplate<TSource = any, TParent = any>(
    tagName: string,
    options?: ElementCreateOptions
): ViewTemplate<TSource, TParent> {
    const markup: Array<string> = [];
    const values: Array<TemplateValue<TSource, TParent>> = [];
    const { attributes, directives, content, policy } = options ?? {};

    markup.push(`<${tagName}`);
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

        markup.push(`"`);
    }

    if (directives) {
        markup[markup.length - 1] += " ";

        for (let i = 0, ii = directives.length; i < ii; ++i) {
            const directive = directives[i];

            markup.push(i > 0 ? "" : " ");

            values.push(directive);
        }
    }

    markup[markup.length - 1] += ">";

    if (content && isFunction((content as any).create)) {
        values.push(content);
        markup.push(`</${tagName}>`);
    } else {
        const lastIndex = markup.length - 1;
        markup[lastIndex] = `${markup[lastIndex]}${content ?? ""}</${tagName}>`;
    }

    return ViewTemplate.create(markup, values, policy);
}

function create(options: TagNameRenderOptions): RenderInstruction;
function create(options: ElementConstructorRenderOptions): RenderInstruction;
function create(options: TemplateRenderOptions): RenderInstruction;
function create(options: any): RenderInstruction {
    const name = options.name ?? defaultViewName;
    let template: ContentTemplate;

    if (isElementRenderOptions(options)) {
        let tagName = (options as TagNameRenderOptions).tagName;

        if (!tagName) {
            const def = FASTElementDefinition.getByType(
                (options as ElementConstructorRenderOptions).element
            );

            if (def) {
                tagName = def.name;
            } else {
                throw new Error("Invalid element for model rendering.");
            }
        }

        if (!options.attributes) {
            options.attributes = defaultAttributes;
        }

        template = createElementTemplate(tagName, options);
    } else {
        template = options.template;
    }

    return {
        brand,
        type: options.type,
        name,
        template,
    };
}

function instanceOf(object: any): object is RenderInstruction {
    return object && object.brand === brand;
}

function register(options: TagNameRenderOptions): RenderInstruction;
function register(options: ElementConstructorRenderOptions): RenderInstruction;
function register(options: TemplateRenderOptions): RenderInstruction;
function register(instruction: RenderInstruction): RenderInstruction;
function register(optionsOrInstruction: any): RenderInstruction {
    let lookup = typeToInstructionLookup.get(optionsOrInstruction.type);
    if (lookup === void 0) {
        typeToInstructionLookup.set(
            optionsOrInstruction.type,
            (lookup = Object.create(null) as {})
        );
    }

    const instruction = instanceOf(optionsOrInstruction)
        ? optionsOrInstruction
        : create(optionsOrInstruction);

    return (lookup[instruction.name] = instruction);
}

function getByType(type: Constructable, name?: string): RenderInstruction | undefined {
    const entries = typeToInstructionLookup.get(type);

    if (entries === void 0) {
        return void 0;
    }

    return entries[name ?? defaultViewName];
}

function getForInstance(object: any, name?: string): RenderInstruction | undefined {
    if (object) {
        return getByType(object.constructor, name);
    }

    return void 0;
}

/**
 * Provides APIs for creating and interacting with render instructions.
 * @public
 */
export const RenderInstruction = Object.freeze({
    /**
     * Checks whether the provided object is a RenderInstruction.
     * @param object - The object to check.
     * @returns true if the object is a RenderInstruction; false otherwise
     */
    instanceOf,

    /**
     * Creates a RenderInstruction for a set of options.
     * @param options - The options to use when creating the RenderInstruction.
     * @remarks
     * This API should be used with caution. When providing attributes or content,
     * if not done properly, you can open up the application to XSS attacks. When using this API,
     * provide a strong DOMPolicy that can properly sanitize and also be sure to manually sanitize
     * content and attribute values particularly if they can come from user input.
     */
    create,

    /**
     * Creates a template based on a tag name.
     * @param tagName - The tag name to use when creating the template.
     * @param attributes - The attributes to apply to the element.
     * @param content - The content to insert into the element.
     * @param policy - The DOMPolicy to create the template with.
     * @returns A template based on the provided specifications.
     * @remarks
     * This API should be used with caution. When providing attributes or content,
     * if not done properly, you can open up the application to XSS attacks. When using this API,
     * provide a strong DOMPolicy that can properly sanitize and also be sure to manually sanitize
     * content and attribute values particularly if they can come from user input.
     */
    createElementTemplate,

    /**
     * Creates and registers an instruction.
     * @param options The options to use when creating the RenderInstruction.
     * @remarks
     * A previously created RenderInstruction can also be registered.
     */
    register,

    /**
     * Finds a previously registered RenderInstruction by type and optionally by name.
     * @param type - The type to retrieve the RenderInstruction for.
     * @param name - An optional name used in differentiating between multiple registered instructions.
     * @returns The located RenderInstruction that matches the criteria or undefined if none is found.
     */
    getByType,

    /**
     * Finds a previously registered RenderInstruction for the instance's type and optionally by name.
     * @param object - The instance to retrieve the RenderInstruction for.
     * @param name - An optional name used in differentiating between multiple registered instructions.
     * @returns The located RenderInstruction that matches the criteria or undefined if none is found.
     */
    getForInstance,
});

/**
 * Decorates a type with render instruction metadata.
 * @param options - The options used in creating the RenderInstruction.
 * @public
 */
export function renderWith(options: Omit<TagNameRenderOptions, "type">): ClassDecorator;
/**
 * Decorates a type with render instruction metadata.
 * @param options - The options used in creating the RenderInstruction.
 * @public
 */
export function renderWith(
    options: Omit<ElementConstructorRenderOptions, "type">
): ClassDecorator;
/**
 * Decorates a type with render instruction metadata.
 * @param options - The options used in creating the RenderInstruction.
 * @public
 */
export function renderWith(options: Omit<TemplateRenderOptions, "type">): ClassDecorator;
/**
 * Decorates a type with render instruction metadata.
 * @param element - The element to use to render the decorated class.
 * @param name - An optional name to differentiate the render instruction.
 * @public
 */
export function renderWith(
    element: Constructable<FASTElement>,
    name?: string
): ClassDecorator;
/**
 * Decorates a type with render instruction metadata.
 * @param template - The template to use to render the decorated class.
 * @param name - An optional name to differentiate the render instruction.
 * @public
 */
export function renderWith(template: ContentTemplate, name?: string): ClassDecorator;
export function renderWith(value: any, name?: string) {
    return function (type: Constructable) {
        if (isFunction(value)) {
            register({ type, element: value, name });
        } else if (isFunction(value.create)) {
            register({ type, template: value, name });
        } else {
            register({ type, ...value });
        }
    };
}

/**
 * @internal
 */
export class NodeTemplate implements ContentTemplate, ContentView {
    constructor(public readonly node: Node) {
        (node as any).$fastTemplate = this;
    }

    get context(): ExecutionContext<any> {
        // HACK
        return this as any;
    }

    bind(source: any): void {}

    unbind(): void {}

    insertBefore(refNode: Node): void {
        refNode.parentNode!.insertBefore(this.node, refNode);
    }

    remove(): void {
        this.node.parentNode!.removeChild(this.node);
    }

    create(): ContentView {
        return this;
    }
}

/**
 * Creates a RenderDirective for use in advanced rendering scenarios.
 * @param value - The binding expression that returns the data to be rendered. The expression
 * can also return a Node to render directly.
 * @param template - A template to render the data with
 * or a string to indicate which RenderInstruction to use when looking up a RenderInstruction.
 * Expressions can also be provided to dynamically determine either the template or the name.
 * @returns A RenderDirective suitable for use in a template.
 * @remarks
 * If no binding is provided, then a default binding that returns the source is created.
 * If no template is provided, then a binding is created that will use registered
 * RenderInstructions to determine the view.
 * If the template binding returns a string, then it will be used to look up a
 * RenderInstruction to determine the view.
 * @public
 */
export function render<TSource = any, TItem = any, TParent = any>(
    value?: Expression<TSource, TItem> | Binding<TSource, TItem> | {},
    template?:
        | ContentTemplate
        | string
        | Expression<TSource, ContentTemplate | string | Node, TParent>
        | Binding<TSource, ContentTemplate | string | Node, TParent>
): CaptureType<TSource, TParent> {
    let dataBinding: Binding<TSource>;

    if (value === void 0) {
        dataBinding = oneTime((source: TSource) => source);
    } else {
        dataBinding = normalizeBinding(value);
    }

    let templateBinding: Binding<TSource, ContentTemplate>;
    let templateBindingDependsOnData = false;

    if (template === void 0) {
        templateBindingDependsOnData = true;
        templateBinding = oneTime((s: any, c: ExecutionContext) => {
            const data = dataBinding.evaluate(s, c);

            if (data instanceof Node) {
                return (data as any).$fastTemplate ?? new NodeTemplate(data);
            }

            return instructionToTemplate(getForInstance(data));
        });
    } else if (isFunction(template)) {
        templateBinding = oneWay(
            (s: any, c: ExecutionContext) => {
                let result = template(s, c);

                if (isString(result)) {
                    result = instructionToTemplate(
                        getForInstance(dataBinding.evaluate(s, c), result)
                    );
                } else if (result instanceof Node) {
                    result = (result as any).$fastTemplate ?? new NodeTemplate(result);
                }

                return result;
            },
            void 0,
            true
        );
    } else if (isString(template)) {
        templateBindingDependsOnData = true;
        templateBinding = oneTime((s: any, c: ExecutionContext) => {
            const data = dataBinding.evaluate(s, c);

            if (data instanceof Node) {
                return (data as any).$fastTemplate ?? new NodeTemplate(data);
            }

            return instructionToTemplate(getForInstance(data, template));
        });
    } else if (template instanceof Binding) {
        const evaluateTemplate = template.evaluate;

        template.evaluate = (s: any, c: ExecutionContext) => {
            let result = evaluateTemplate(s, c);

            if (isString(result)) {
                result = instructionToTemplate(
                    getForInstance(dataBinding.evaluate(s, c), result)
                );
            } else if (result instanceof Node) {
                result = (result as any).$fastTemplate ?? new NodeTemplate(result);
            }

            return result;
        };

        templateBinding = template as any;
    } else {
        templateBinding = oneTime((s: any, c: ExecutionContext) => template);
    }

    return new RenderDirective<TSource>(
        dataBinding,
        templateBinding,
        templateBindingDependsOnData
    );
}

import { isFunction, isString, Message } from "../interfaces.js";
import type { ExecutionContext } from "../observation/observable.js";
import { FAST } from "../platform.js";
import { DOM, DOMPolicy } from "../dom.js";
import type { Binding } from "../binding/binding.js";
import { oneTime } from "../binding/one-time.js";
import { nextId, Parser } from "./markup.js";
import { HTMLBindingDirective } from "./html-binding-directive.js";
import {
    Aspected,
    CompiledViewBehaviorFactory,
    HTMLDirective,
    ViewBehaviorFactory,
} from "./html-directive.js";
import type { HTMLTemplateCompilationResult as TemplateCompilationResult } from "./template.js";
import { HTMLView } from "./view.js";

const targetIdFrom = (parentId: string, nodeIndex: number): string =>
    `${parentId}.${nodeIndex}`;
const descriptorCache: PropertyDescriptorMap = {};

interface NextNode {
    index: number;
    node: ChildNode | null;
}

// used to prevent creating lots of objects just to track node and index while compiling
const next: NextNode = {
    index: 0,
    node: null as ChildNode | null,
};

function tryWarn(name: string) {
    if (!name.startsWith("fast-")) {
        FAST.warn(Message.hostBindingWithoutHost, { name });
    }
}

const warningHost = new Proxy(document.createElement("div"), {
    get(target, property: string) {
        tryWarn(property);
        const value = Reflect.get(target, property);
        return isFunction(value) ? value.bind(target) : value;
    },

    set(target, property: string, value) {
        tryWarn(property);
        return Reflect.set(target, property, value);
    },
});

class CompilationContext<TSource = any, TParent = any>
    implements TemplateCompilationResult<TSource, TParent>
{
    private proto: any = null;
    private nodeIds = new Set<string>();
    private descriptors: PropertyDescriptorMap = {};
    public readonly factories: CompiledViewBehaviorFactory[] = [];

    constructor(
        public readonly fragment: DocumentFragment,
        public readonly directives: Record<string, ViewBehaviorFactory>,
        public readonly policy: DOMPolicy
    ) {}

    public addFactory(
        factory: CompiledViewBehaviorFactory,
        parentId: string,
        nodeId: string,
        targetIndex: number,
        tagName: string | null
    ): void {
        if (!this.nodeIds.has(nodeId)) {
            this.nodeIds.add(nodeId);
            this.addTargetDescriptor(parentId, nodeId, targetIndex);
        }

        factory.id = factory.id ?? nextId();
        factory.targetNodeId = nodeId;
        factory.targetTagName = tagName;
        factory.policy = factory.policy ?? this.policy;

        this.factories.push(factory);
    }

    public freeze(): TemplateCompilationResult<TSource, TParent> {
        this.proto = Object.create(null, this.descriptors);
        return this;
    }

    private addTargetDescriptor(
        parentId: string,
        targetId: string,
        targetIndex: number
    ): void {
        const descriptors = this.descriptors;

        if (
            targetId === "r" || // root
            targetId === "h" || // host
            descriptors[targetId]
        ) {
            return;
        }

        if (!descriptors[parentId]) {
            const index = parentId.lastIndexOf(".");
            const grandparentId = parentId.substring(0, index);
            const childIndex = parseInt(parentId.substring(index + 1));
            this.addTargetDescriptor(grandparentId, parentId, childIndex);
        }

        let descriptor = descriptorCache[targetId];

        if (!descriptor) {
            const field = `_${targetId}`;

            descriptorCache[targetId] = descriptor = {
                get() {
                    return (
                        this[field] ??
                        (this[field] = this[parentId].childNodes[targetIndex])
                    );
                },
            };
        }

        descriptors[targetId] = descriptor;
    }

    public createView(hostBindingTarget?: Element): HTMLView<TSource, TParent> {
        const fragment = this.fragment.cloneNode(true) as DocumentFragment;
        const targets = Object.create(this.proto);

        targets.r = fragment;
        targets.h = hostBindingTarget ?? warningHost;

        for (const id of this.nodeIds) {
            targets[id]; // trigger locator
        }

        return new HTMLView(fragment, this.factories, targets);
    }
}

function compileAttributes(
    context: CompilationContext,
    parentId: string,
    node: HTMLElement,
    nodeId: string,
    nodeIndex: number,
    includeBasicValues: boolean = false
): void {
    const attributes = node.attributes;
    const directives = context.directives;

    for (let i = 0, ii = attributes.length; i < ii; ++i) {
        const attr = attributes[i];
        const attrValue = attr.value;
        const parseResult = Parser.parse(attrValue, directives);
        let result: ViewBehaviorFactory | null = null;

        if (parseResult === null) {
            if (includeBasicValues) {
                result = new HTMLBindingDirective(
                    oneTime(() => attrValue, context.policy)
                );
                HTMLDirective.assignAspect(result as any as Aspected, attr.name);
            }
        } else {
            /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
            result = Compiler.aggregate(parseResult, context.policy);
        }

        if (result !== null) {
            node.removeAttributeNode(attr);
            i--;
            ii--;
            context.addFactory(
                result as CompiledViewBehaviorFactory,
                parentId,
                nodeId,
                nodeIndex,
                node.tagName
            );
        }
    }
}

function compileContent(
    context: CompilationContext,
    node: Text,
    parentId,
    nodeId,
    nodeIndex
): NextNode {
    const parseResult = Parser.parse(node.textContent!, context.directives);
    if (parseResult === null) {
        next.node = node.nextSibling;
        next.index = nodeIndex + 1;
        return next;
    }

    let currentNode: Text;
    let lastNode = (currentNode = node);

    for (let i = 0, ii = parseResult.length; i < ii; ++i) {
        const currentPart = parseResult[i];

        if (i !== 0) {
            nodeIndex++;
            nodeId = targetIdFrom(parentId, nodeIndex);
            currentNode = lastNode.parentNode!.insertBefore(
                document.createTextNode(""),
                lastNode.nextSibling
            );
        }

        if (isString(currentPart)) {
            currentNode.textContent = currentPart;
        } else {
            currentNode.textContent = " ";
            HTMLDirective.assignAspect(currentPart as any as Aspected);
            context.addFactory(
                currentPart as CompiledViewBehaviorFactory,
                parentId,
                nodeId,
                nodeIndex,
                null
            );
        }

        lastNode = currentNode;
    }

    next.index = nodeIndex + 1;
    next.node = lastNode.nextSibling;
    return next;
}

function compileChildren(
    context: CompilationContext,
    parent: Node,
    parentId: string
): void {
    let nodeIndex = 0;
    let childNode = parent.firstChild;

    while (childNode) {
        /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
        const result = compileNode(context, parentId, childNode, nodeIndex);
        childNode = result.node;
        nodeIndex = result.index;
    }
}

function compileNode(
    context: CompilationContext,
    parentId: string,
    node: Node,
    nodeIndex: number
): NextNode {
    const nodeId = targetIdFrom(parentId, nodeIndex);

    switch (node.nodeType) {
        case 1: // element node
            compileAttributes(context, parentId, node as HTMLElement, nodeId, nodeIndex);
            compileChildren(context, node, nodeId);
            break;
        case 3: // text node
            return compileContent(context, node as Text, parentId, nodeId, nodeIndex);
        case 8: // comment
            const parts = Parser.parse((node as Comment).data, context.directives);
            if (parts !== null) {
                context.addFactory(
                    /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
                    Compiler.aggregate(parts) as CompiledViewBehaviorFactory,
                    parentId,
                    nodeId,
                    nodeIndex,
                    null
                );
            }
            break;
    }

    next.index = nodeIndex + 1;
    next.node = node.nextSibling;
    return next;
}

function isMarker(node: Node, directives: Record<string, ViewBehaviorFactory>): boolean {
    return (
        node &&
        node.nodeType == 8 &&
        Parser.parse((node as Comment).data, directives) !== null
    );
}

/**
 * A function capable of compiling a template from the preprocessed form produced
 * by the html template function into a result that can instantiate views.
 * @public
 */
export type CompilationStrategy = (
    /**
     * The preprocessed HTML string or template to compile.
     */
    html: string | HTMLTemplateElement,

    /**
     * The behavior factories used within the html that is being compiled.
     */
    factories: Record<string, ViewBehaviorFactory>,

    /**
     * The security policy to compile the html with.
     */
    policy: DOMPolicy
) => TemplateCompilationResult;

const templateTag = "TEMPLATE";

/**
 * Common APIs related to compilation.
 * @public
 */
export const Compiler = {
    /**
     * Compiles a template and associated directives into a compilation
     * result which can be used to create views.
     * @param html - The html string or template element to compile.
     * @param factories - The behavior factories referenced by the template.
     * @param policy - The security policy to compile the html with.
     * @remarks
     * The template that is provided for compilation is altered in-place
     * and cannot be compiled again. If the original template must be preserved,
     * it is recommended that you clone the original and pass the clone to this API.
     * @public
     */
    compile<TSource = any, TParent = any>(
        html: string | HTMLTemplateElement,
        factories: Record<string, ViewBehaviorFactory>,
        policy: DOMPolicy = DOM.policy
    ): TemplateCompilationResult<TSource, TParent> {
        let template: HTMLTemplateElement;

        if (isString(html)) {
            template = document.createElement(templateTag) as HTMLTemplateElement;
            template.innerHTML = policy.createHTML(html);

            const fec = template.content.firstElementChild;

            if (fec !== null && fec.tagName === templateTag) {
                template = fec as HTMLTemplateElement;
            }
        } else {
            template = html;
        }

        if (!template.content.firstChild && !template.content.lastChild) {
            template.content.appendChild(document.createComment(""));
        }

        // https://bugs.chromium.org/p/chromium/issues/detail?id=1111864
        const fragment = document.adoptNode(template.content);

        const context = new CompilationContext<TSource, TParent>(
            fragment,
            factories,
            policy
        );
        compileAttributes(context, "", template, /* host */ "h", 0, true);

        if (
            // If the first node in a fragment is a marker, that means it's an unstable first node,
            // because something like a when, repeat, etc. could add nodes before the marker.
            // To mitigate this, we insert a stable first node. However, if we insert a node,
            // that will alter the result of the TreeWalker. So, we also need to offset the target index.
            isMarker(fragment.firstChild!, factories) ||
            // Or if there is only one node and a directive, it means the template's content
            // is *only* the directive. In that case, HTMLView.dispose() misses any nodes inserted by
            // the directive. Inserting a new node ensures proper disposal of nodes added by the directive.
            (fragment.childNodes.length === 1 && Object.keys(factories).length > 0)
        ) {
            fragment.insertBefore(document.createComment(""), fragment.firstChild);
        }

        compileChildren(context, fragment, /* root */ "r");
        next.node = null; // prevent leaks
        return context.freeze();
    },

    /**
     * Sets the default compilation strategy that will be used by the ViewTemplate whenever
     * it needs to compile a view preprocessed with the html template function.
     * @param strategy - The compilation strategy to use when compiling templates.
     */
    setDefaultStrategy(strategy: CompilationStrategy): void {
        this.compile = strategy;
    },

    /**
     * Aggregates an array of strings and directives into a single directive.
     * @param parts - A heterogeneous array of static strings interspersed with
     * directives.
     * @param policy - The security policy to use with the aggregated bindings.
     * @returns A single inline directive that aggregates the behavior of all the parts.
     */
    aggregate(
        parts: (string | ViewBehaviorFactory)[],
        policy: DOMPolicy = DOM.policy
    ): ViewBehaviorFactory {
        if (parts.length === 1) {
            return parts[0] as ViewBehaviorFactory;
        }

        let sourceAspect!: string;
        let binding!: Binding;
        let isVolatile: boolean | undefined = false;
        let bindingPolicy: DOMPolicy | undefined = void 0;
        const partCount = parts.length;

        const finalParts = parts.map((x: string | ViewBehaviorFactory) => {
            if (isString(x)) {
                return (): string => x;
            }

            sourceAspect = (x as any as Aspected).sourceAspect || sourceAspect;
            binding = (x as any as Aspected).dataBinding || binding;
            isVolatile = isVolatile || (x as any as Aspected).dataBinding!.isVolatile;
            bindingPolicy = bindingPolicy || (x as any as Aspected).dataBinding!.policy;
            return (x as any as Aspected).dataBinding!.evaluate;
        });

        const expression = (scope: unknown, context: ExecutionContext): string => {
            let output = "";

            for (let i = 0; i < partCount; ++i) {
                output += finalParts[i](scope, context);
            }

            return output;
        };

        binding.evaluate = expression;
        binding.isVolatile = isVolatile;
        binding.policy = bindingPolicy ?? policy;
        const directive = new HTMLBindingDirective(binding);
        HTMLDirective.assignAspect(directive, sourceAspect!);
        return directive;
    },
};

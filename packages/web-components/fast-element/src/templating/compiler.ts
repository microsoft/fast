import type { ViewBehaviorTargets } from "./html-directive";
import { _interpolationEnd, _interpolationStart, DOM } from "../dom";
import type { Binding, ExecutionContext } from "../observation/observable";
import { bind, HTMLBindingDirective } from "./binding";
import type { HTMLDirective, ViewBehaviorFactory } from "./html-directive";
import { oneTime } from "..";

type InlineDirective = HTMLDirective & {
    targetName?: string;
    binding: Binding;
    targetAtContent(): void;
};

const targetIdFrom = (parentId: string, nodeIndex: number) => `${parentId}.${nodeIndex}`;
const descriptorCache: PropertyDescriptorMap = {};

// used to prevent creating lots of objects just to track node and index while compiling
const next = {
    index: 0,
    node: null as ChildNode | null,
};

/**
 * The result of compiling a template and its directives.
 * @public
 */
export interface HTMLTemplateCompilationResult {
    /**
     * A cloneable DocumentFragment representing the compiled HTML.
     */
    readonly fragment: DocumentFragment;

    /**
     * The behaviors that should be applied to the template's HTML.
     */
    readonly factories: ReadonlyArray<ViewBehaviorFactory>;

    /**
     * Creates a behavior target lookup object.
     * @param host - The host element.
     * @param root - The root element.
     * @returns A lookup object for behavior targets.
     */
    createTargets(root: Node, host?: Node): ViewBehaviorTargets;
}

class CompilationContext implements HTMLTemplateCompilationResult {
    private proto: any = null;
    private targetIds = new Set<string>();
    private descriptors: PropertyDescriptorMap = {};
    public readonly factories: ViewBehaviorFactory[] = [];

    constructor(
        public readonly fragment: DocumentFragment,
        public readonly directives: ReadonlyArray<HTMLDirective>
    ) {}

    public addFactory(
        factory: ViewBehaviorFactory,
        parentId: string,
        targetId: string,
        targetIndex: number
    ): void {
        if (!this.targetIds.has(targetId)) {
            this.targetIds.add(targetId);
            this.addTargetDescriptor(parentId, targetId, targetIndex);
        }

        factory.targetId = targetId;
        this.factories.push(factory);
    }

    public captureContentBinding(
        directive: HTMLBindingDirective,
        parentId: string,
        targetId: string,
        targetIndex: number
    ): void {
        directive.targetAtContent();
        this.addFactory(directive, parentId, targetId, targetIndex);
    }

    public freeze(): HTMLTemplateCompilationResult {
        this.proto = Object.create(null, this.descriptors);
        return this;
    }

    public createTargets(root: Node, host?: Node): ViewBehaviorTargets {
        const targets = Object.create(this.proto);
        targets.r = root;
        targets.h = host ?? root;

        for (const id of this.targetIds) {
            targets[id]; // trigger locator
        }

        return targets;
    }

    private addTargetDescriptor(parentId: string, targetId: string, targetIndex: number) {
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
            const grandparentId = parentId.substr(0, index);
            const childIndex = parseInt(parentId.substr(index + 1));
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
}

function createAggregateBinding(
    parts: (string | InlineDirective)[]
): HTMLBindingDirective {
    if (parts.length === 1) {
        return (parts[0] as any) as HTMLBindingDirective;
    }

    let targetName: string | undefined;
    const partCount = parts.length;
    const finalParts = parts.map((x: string | InlineDirective) => {
        if (typeof x === "string") {
            return (): string => x;
        }

        targetName = x.targetName || targetName;
        return x.binding;
    });

    const binding = (scope: unknown, context: ExecutionContext): string => {
        let output = "";

        for (let i = 0; i < partCount; ++i) {
            output += finalParts[i](scope, context);
        }

        return output;
    };

    const directive = bind(binding) as HTMLBindingDirective;
    directive.targetName = targetName;
    return directive;
}

const interpolationEndLength = _interpolationEnd.length;

function parseContent(
    context: CompilationContext,
    value: string
): (string | InlineDirective)[] | null {
    const valueParts = value.split(_interpolationStart);

    if (valueParts.length === 1) {
        return null;
    }

    const bindingParts: any[] = [];

    for (let i = 0, ii = valueParts.length; i < ii; ++i) {
        const current = valueParts[i];
        const index = current.indexOf(_interpolationEnd);
        let literal;

        if (index === -1) {
            literal = current;
        } else {
            const directiveIndex = parseInt(current.substring(0, index));
            bindingParts.push(context.directives[directiveIndex]);
            literal = current.substring(index + interpolationEndLength);
        }

        if (literal !== "") {
            bindingParts.push(literal);
        }
    }

    return bindingParts;
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

    for (let i = 0, ii = attributes.length; i < ii; ++i) {
        const attr = attributes[i];
        const attrValue = attr.value;
        const parseResult = parseContent(context, attrValue);
        let result: HTMLBindingDirective | null = null;

        if (parseResult === null) {
            if (includeBasicValues) {
                result = bind(() => attrValue, oneTime) as HTMLBindingDirective;
                result.targetName = attr.name;
            }
        } else {
            result = createAggregateBinding(parseResult);
        }

        if (result !== null) {
            node.removeAttributeNode(attr);
            i--;
            ii--;
            context.addFactory(result, parentId, nodeId, nodeIndex);
        }
    }
}

function compileContent(
    context: CompilationContext,
    node: Text,
    parentId,
    nodeId,
    nodeIndex
) {
    const parseResult = parseContent(context, node.textContent!);
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

        if (typeof currentPart === "string") {
            currentNode.textContent = currentPart;
        } else {
            currentNode.textContent = " ";
            context.captureContentBinding(
                currentPart as HTMLBindingDirective,
                parentId,
                nodeId,
                nodeIndex
            );
        }

        lastNode = currentNode;
    }

    next.index = nodeIndex + 1;
    next.node = lastNode.nextSibling;
    return next;
}

function compileChildren(context: CompilationContext, parent: Node, parentId: string) {
    let nodeIndex = 0;
    let childNode = parent.firstChild;

    while (childNode) {
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
) {
    const nodeId = targetIdFrom(parentId, nodeIndex);

    switch (node.nodeType) {
        case 1: // element node
            compileAttributes(context, parentId, node as HTMLElement, nodeId, nodeIndex);
            compileChildren(context, node, nodeId);
            break;
        case 3: // text node
            return compileContent(context, node as Text, parentId, nodeId, nodeIndex);
        case 8: // comment
            if (DOM.isMarker(node)) {
                context.addFactory(
                    context.directives[DOM.extractDirectiveIndexFromMarker(node)],
                    parentId,
                    nodeId,
                    nodeIndex
                );
            }
            break;
    }

    next.index = nodeIndex + 1;
    next.node = node.nextSibling;
    return next;
}

/**
 * Compiles a template and associated directives into a raw compilation
 * result which include a cloneable DocumentFragment and factories capable
 * of attaching runtime behavior to nodes within the fragment.
 * @param template - The template to compile.
 * @param directives - The directives referenced by the template.
 * @remarks
 * The template that is provided for compilation is altered in-place
 * and cannot be compiled again. If the original template must be preserved,
 * it is recommended that you clone the original and pass the clone to this API.
 * @public
 */
export function compileTemplate(
    template: HTMLTemplateElement,
    directives: ReadonlyArray<HTMLDirective>
): HTMLTemplateCompilationResult {
    // https://bugs.chromium.org/p/chromium/issues/detail?id=1111864
    const fragment = document.adoptNode(template.content);
    const context = new CompilationContext(fragment, directives);
    compileAttributes(context, "", template, /* host */ "h", 0, true);

    if (
        // If the first node in a fragment is a marker, that means it's an unstable first node,
        // because something like a when, repeat, etc. could add nodes before the marker.
        // To mitigate this, we insert a stable first node. However, if we insert a node,
        // that will alter the result of the TreeWalker. So, we also need to offset the target index.
        DOM.isMarker(fragment.firstChild!) ||
        // Or if there is only one node, it means the template's content
        // is *only* the directive. In that case, HTMLView.dispose() misses any nodes inserted by
        // the directive. Inserting a new node ensures proper disposal of nodes added by the directive.
        fragment.childNodes.length === 1
    ) {
        fragment.insertBefore(document.createComment(""), fragment.firstChild);
    }

    compileChildren(context, fragment, /* root */ "r");
    next.node = null; // prevent leaks
    return context.freeze();
}

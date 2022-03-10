import { isString } from "../interfaces.js";
import { DOM } from "../dom.js";
import { Markup, Parser } from "./markup.js";
import { bind, oneTime } from "./binding.js";
import type {
    AspectedHTMLDirective,
    HTMLDirective,
    ViewBehaviorFactory,
} from "./html-directive.js";
import type { HTMLTemplateCompilationResult } from "./template.js";
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

    public freeze(): HTMLTemplateCompilationResult {
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

    public createView(hostBindingTarget?: Element): HTMLView {
        const fragment = this.fragment.cloneNode(true) as DocumentFragment;
        const targets = Object.create(this.proto);

        targets.r = fragment;
        targets.h = hostBindingTarget ?? fragment;

        for (const id of this.targetIds) {
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
        let result: HTMLDirective | null = null;

        if (parseResult === null) {
            if (includeBasicValues) {
                result = bind(() => attrValue, oneTime) as AspectedHTMLDirective;
                (result as AspectedHTMLDirective).setAspect(attr.name);
            }
        } else {
            result = Parser.aggregate(parseResult);
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
            context.addFactory(currentPart, parentId, nodeId, nodeIndex);
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
                context.addFactory(Parser.aggregate(parts), parentId, nodeId, nodeIndex);
            }
            break;
    }

    next.index = nodeIndex + 1;
    next.node = node.nextSibling;
    return next;
}

function isMarker(node: Node, directives: ReadonlyArray<HTMLDirective>): boolean {
    return (
        node &&
        node.nodeType == 8 &&
        Parser.parse((node as Comment).data, directives) !== null
    );
}

/**
 * Compiles a template and associated directives into a compilation
 * result which can be used to create views.
 * @param html - The html string or template element to compile.
 * @param directives - The directives referenced by the template.
 * @remarks
 * The template that is provided for compilation is altered in-place
 * and cannot be compiled again. If the original template must be preserved,
 * it is recommended that you clone the original and pass the clone to this API.
 * @public
 */
export function compileTemplate(
    html: string | HTMLTemplateElement,
    directives: ReadonlyArray<HTMLDirective>
): HTMLTemplateCompilationResult {
    let template: HTMLTemplateElement;

    if (isString(html)) {
        template = document.createElement("template");
        template.innerHTML = DOM.createHTML(html);

        const fec = template.content.firstElementChild;

        if (fec !== null && fec.tagName === "TEMPLATE") {
            template = fec as HTMLTemplateElement;
        }
    } else {
        template = html;
    }

    // https://bugs.chromium.org/p/chromium/issues/detail?id=1111864
    const fragment = document.adoptNode(template.content);
    const context = new CompilationContext(fragment, directives);
    compileAttributes(context, "", template, /* host */ "h", 0, true);

    if (
        // If the first node in a fragment is a marker, that means it's an unstable first node,
        // because something like a when, repeat, etc. could add nodes before the marker.
        // To mitigate this, we insert a stable first node. However, if we insert a node,
        // that will alter the result of the TreeWalker. So, we also need to offset the target index.
        isMarker(fragment.firstChild!, directives) ||
        // Or if there is only one node and a directive, it means the template's content
        // is *only* the directive. In that case, HTMLView.dispose() misses any nodes inserted by
        // the directive. Inserting a new node ensures proper disposal of nodes added by the directive.
        (fragment.childNodes.length === 1 && directives.length)
    ) {
        fragment.insertBefore(document.createComment(""), fragment.firstChild);
    }

    compileChildren(context, fragment, /* root */ "r");
    next.node = null; // prevent leaks
    return context.freeze();
}

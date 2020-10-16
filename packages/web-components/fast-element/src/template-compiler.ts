import { BehaviorFactory } from "./directives/behavior";
import { BindingDirective } from "./directives/binding";
import { Directive } from "./directives/directive";
import { _interpolationEnd, _interpolationStart, DOM } from "./dom";
import { Binding, ExecutionContext } from "./observation/observable";

type InlineDirective = Directive & {
    targetName?: string;
    binding: Binding;
    targetAtContent(): void;
};

class CompilationContext {
    public targetIndex!: number;
    public behaviorFactories!: BehaviorFactory[];
    public directives: ReadonlyArray<Directive>;

    public addFactory(factory: BehaviorFactory): void {
        factory.targetIndex = this.targetIndex;
        this.behaviorFactories.push(factory);
    }

    public captureContentBinding(directive: BindingDirective): void {
        directive.targetAtContent();
        this.addFactory(directive);
    }

    public reset(): void {
        this.behaviorFactories = [];
        this.targetIndex = -1;
    }

    public release(): void {
        sharedContext = this;
    }

    public static borrow(directives: ReadonlyArray<Directive>): CompilationContext {
        const shareable = sharedContext || new CompilationContext();
        shareable.directives = directives;
        shareable.reset();
        sharedContext = null;
        return shareable;
    }
}

let sharedContext: CompilationContext | null = null;

function createAggregateBinding(parts: (string | InlineDirective)[]): BindingDirective {
    if (parts.length === 1) {
        return parts[0] as BindingDirective;
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

    const directive = new BindingDirective(binding);
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
    node: HTMLElement,
    includeBasicValues: boolean = false
): void {
    const attributes = node.attributes;

    for (let i = 0, ii = attributes.length; i < ii; ++i) {
        const attr = attributes[i];
        const attrValue = attr.value;
        const parseResult = parseContent(context, attrValue);
        let result: BindingDirective | null = null;

        if (parseResult === null) {
            if (includeBasicValues) {
                result = new BindingDirective(() => attrValue);
                result.targetName = attr.name;
            }
        } else {
            result = createAggregateBinding(parseResult);
        }

        if (result !== null) {
            node.removeAttributeNode(attr);
            i--;
            ii--;
            context.addFactory(result);
        }
    }
}

function compileContent(
    context: CompilationContext,
    node: Text,
    walker: TreeWalker
): void {
    const parseResult = parseContent(context, node.textContent!);

    if (parseResult !== null) {
        let lastNode = node;
        for (let i = 0, ii = parseResult.length; i < ii; ++i) {
            const currentPart = parseResult[i];
            const currentNode =
                i === 0
                    ? node
                    : lastNode.parentNode!.insertBefore(
                          document.createTextNode(""),
                          lastNode.nextSibling
                      );

            if (typeof currentPart === "string") {
                currentNode.textContent = currentPart;
            } else {
                currentNode.textContent = " ";
                context.captureContentBinding(currentPart as BindingDirective);
            }

            lastNode = currentNode;
            context.targetIndex++;

            if (currentNode !== node) {
                walker.nextNode();
            }
        }

        context.targetIndex--;
    }
}

/**
 * The result of compiling a template and its directives.
 * @beta
 */
export interface CompilationResult {
    /**
     * A cloneable DocumentFragment representing the compiled HTML.
     */
    fragment: DocumentFragment;
    /**
     * The behaviors that should be applied to the template's HTML.
     */
    viewBehaviorFactories: BehaviorFactory[];
    /**
     * The behaviors that should be applied to the host element that
     * the template is rendered into.
     */
    hostBehaviorFactories: BehaviorFactory[];
    /**
     * An index offset to apply to BehaviorFactory target indexes when
     * matching factories to targets.
     */
    targetOffset: number;
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
    directives: ReadonlyArray<Directive>
): CompilationResult {
    const fragment = template.content;
    // https://bugs.chromium.org/p/chromium/issues/detail?id=1111864
    document.adoptNode(fragment);

    const context = CompilationContext.borrow(directives);
    compileAttributes(context, template, true);
    const hostBehaviorFactories = context.behaviorFactories;
    context.reset();

    const walker = DOM.createTemplateWalker(fragment);

    let node: Node | null;

    while ((node = walker.nextNode())) {
        context.targetIndex++;

        switch (node.nodeType) {
            case 1: // element node
                compileAttributes(context, node as HTMLElement);
                break;
            case 3: // text node
                compileContent(context, node as Text, walker);
                break;
            case 8: // comment
                if (DOM.isMarker(node)) {
                    context.addFactory(
                        directives[DOM.extractDirectiveIndexFromMarker(node)]
                    );
                }
        }
    }

    let targetOffset = 0;

    if (DOM.isMarker(fragment.firstChild!)) {
        // If the first node in a fragment is a marker, that means it's an unstable first node,
        // because something like a when, repeat, etc. could add nodes before the marker.
        // To mitigate this, we insert a stable first node. However, if we insert a node,
        // that will alter the result of the TreeWalker. So, we also need to offset the target index.
        fragment.insertBefore(document.createComment(""), fragment.firstChild);
        targetOffset = -1;
    }

    const viewBehaviorFactories = context.behaviorFactories;
    context.release();

    return {
        fragment,
        viewBehaviorFactories,
        hostBehaviorFactories,
        targetOffset,
    };
}

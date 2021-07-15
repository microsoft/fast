import type { HTMLDirective, NodeBehaviorFactory } from "./html-directive";
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
    viewBehaviorFactories: NodeBehaviorFactory[];
    /**
     * The behaviors that should be applied to the host element that
     * the template is rendered into.
     */
    hostBehaviorFactories: NodeBehaviorFactory[];
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
export declare function compileTemplate(
    template: HTMLTemplateElement,
    directives: ReadonlyArray<HTMLDirective>
): CompilationResult;

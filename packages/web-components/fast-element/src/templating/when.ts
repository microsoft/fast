import { isFunction } from "../interfaces.js";
import type { ExecutionContext, Expression } from "../observation/observable.js";
import type { CaptureType, SyntheticViewTemplate } from "./template.js";

/**
 * A directive that enables basic conditional rendering in a template.
 * @param condition - The condition to test for rendering.
 * @param templateOrTemplateBinding - The template or a binding that gets
 * the template to render when the condition is true.
 * @public
 */
export function when<TSource = any, TReturn = any, TParent = any>(
    condition: Expression<TSource, TReturn, TParent> | boolean,
    templateOrTemplateBinding:
        | SyntheticViewTemplate<TSource, TParent>
        | Expression<TSource, SyntheticViewTemplate<TSource, TParent>, TParent>
): CaptureType<TSource, TParent> {
    const dataBinding = isFunction(condition) ? condition : () => condition;

    const templateBinding = isFunction(templateOrTemplateBinding)
        ? templateOrTemplateBinding
        : (): SyntheticViewTemplate => templateOrTemplateBinding;

    return (source: TSource, context: ExecutionContext): SyntheticViewTemplate | null =>
        dataBinding(source, context) ? templateBinding(source, context) : null;
}

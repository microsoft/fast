import { isFunction } from "../interfaces.js";
import type { Binding, ExecutionContext } from "../observation/observable.js";
import type { CaptureType, SyntheticViewTemplate } from "./template.js";

/**
 * A directive that enables basic conditional rendering in a template.
 * @param condition - The condition to test for rendering.
 * @param templateOrTemplateBinding - The template or a binding that gets
 * the template to render when the condition is true.
 * @public
 */
export function when<TSource = any, TReturn = any>(
    condition: Binding<TSource, TReturn> | boolean,
    templateOrTemplateBinding:
        | SyntheticViewTemplate
        | Binding<TSource, SyntheticViewTemplate>
): CaptureType<TSource> {
    const dataBinding = isFunction(condition) ? condition : () => condition;

    const templateBinding = isFunction(templateOrTemplateBinding)
        ? templateOrTemplateBinding
        : (): SyntheticViewTemplate => templateOrTemplateBinding;

    return (source: TSource, context: ExecutionContext): SyntheticViewTemplate | null =>
        dataBinding(source, context) ? templateBinding(source, context) : null;
}

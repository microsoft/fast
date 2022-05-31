import { isFunction } from "../interfaces.js";
import type { Binding, ExecutionContext } from "../observation/observable.js";
import type { CaptureType, SyntheticViewTemplate } from "./template.js";

/**
 * A directive that enables basic conditional rendering in a template.
 * @param binding - The condition to test for rendering.
 * @param templateOrTemplateBinding - The template or a binding that gets
 * the template to render when the condition is true.
 * @public
 */
export function when<TSource = any, TReturn = any>(
    binding: Binding<TSource, TReturn>,
    templateOrTemplateBinding:
        | SyntheticViewTemplate
        | Binding<TSource, SyntheticViewTemplate>
): CaptureType<TSource> {
    const getTemplate = isFunction(templateOrTemplateBinding)
        ? templateOrTemplateBinding
        : (): SyntheticViewTemplate => templateOrTemplateBinding;

    return (source: TSource, context: ExecutionContext): SyntheticViewTemplate | null =>
        binding(source, context) ? getTemplate(source, context) : null;
}

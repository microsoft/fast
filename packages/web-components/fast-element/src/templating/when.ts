import { isFunction } from "../interfaces.js";
import type { Binding, ExecutionContext } from "../observation/observable.js";
import type { CaptureType, SyntheticViewTemplate } from "./template.js";

const noTemplate: () => null = () => null;
function normalizeBinding<TSource>(
    value: SyntheticViewTemplate | Binding<TSource, SyntheticViewTemplate> | undefined
): (() => null) | Binding<TSource, SyntheticViewTemplate> {
    return value === undefined ? noTemplate : isFunction(value) ? value : () => value;
}

/**
 * A directive that enables basic conditional rendering in a template.
 * @param binding - The condition to test for rendering.
 * @param templateOrTemplateBinding - The template or a binding that gets
 * the template to render when the condition is true.
 * @param elseTemplateOrTemplateBinding - Optional template or binding that that
 * gets the template to render when the conditional is false.
 * @public
 */
export function when<TSource = any, TReturn = any>(
    binding: Binding<TSource, TReturn>,
    templateOrTemplateBinding:
        | SyntheticViewTemplate
        | Binding<TSource, SyntheticViewTemplate>,
    elseTemplateOrTemplateBinding?:
        | SyntheticViewTemplate
        | Binding<TSource, SyntheticViewTemplate>
): CaptureType<TSource> {
    const dataBinding = isFunction(binding) ? binding : () => binding;
    const templateBinding = normalizeBinding(templateOrTemplateBinding);
    const elseBinding = normalizeBinding(elseTemplateOrTemplateBinding);

    return (source: TSource, context: ExecutionContext): SyntheticViewTemplate | null =>
        dataBinding(source, context)
            ? templateBinding(source, context)
            : elseBinding(source, context);
}

import { isFunction } from "../interfaces.js";
import type { ExecutionContext, Expression } from "../observation/observable.js";
import type { CaptureType, SyntheticViewTemplate } from "./template.js";

const noTemplate = () => null;
function normalizeBinding<TSource>(
    value: SyntheticViewTemplate | Expression<TSource, SyntheticViewTemplate> | undefined
) {
    return value === undefined ? noTemplate : isFunction(value) ? value : () => value;
}
/**
 * A directive that enables basic conditional rendering in a template.
 * @param condition - The condition to test for rendering.
 * @param templateOrTemplateBinding - The template or a binding that gets
 * the template to render when the condition is true.
 * @param elseTemplateOrTemplateBinding - Optional template or binding that that
 * gets the template to render when the conditional is false.
 * @public
 */
export function when<TSource = any, TReturn = any, TParent = any>(
    condition: Expression<TSource, TReturn, TParent> | boolean,
    templateOrTemplateBinding:
        | SyntheticViewTemplate<TSource, TParent>
        | Expression<TSource, SyntheticViewTemplate<TSource, TParent>, TParent>,
    elseTemplateOrTemplateBinding?:
        | SyntheticViewTemplate<TSource, TParent>
        | Expression<TSource, SyntheticViewTemplate<TSource, TParent>, TParent>
): CaptureType<TSource, TParent> {
    const dataBinding = isFunction(condition) ? condition : () => condition;
    const templateBinding = normalizeBinding(templateOrTemplateBinding);
    const elseBinding = normalizeBinding(elseTemplateOrTemplateBinding);

    return (source: TSource, context: ExecutionContext): SyntheticViewTemplate | null =>
        dataBinding(source, context)
            ? templateBinding(source, context)
            : elseBinding(source, context);
}

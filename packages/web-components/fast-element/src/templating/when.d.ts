import type { Binding } from "../observation/observable";
import type { CaptureType, SyntheticViewTemplate } from "./template";
/**
 * A directive that enables basic conditional rendering in a template.
 * @param binding - The condition to test for rendering.
 * @param templateOrTemplateBinding - The template or a binding that gets
 * the template to render when the condition is true.
 * @public
 */
export declare function when<TSource = any, TReturn = any>(
    binding: Binding<TSource, TReturn>,
    templateOrTemplateBinding:
        | SyntheticViewTemplate
        | Binding<TSource, SyntheticViewTemplate>
): CaptureType<TSource>;

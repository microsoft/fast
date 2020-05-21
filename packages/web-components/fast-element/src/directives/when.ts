import { CaptureType, SyntheticViewTemplate } from "../template";
import { ExecutionContext, Expression } from "../observation/observable";

/**
 * A directive that enables basic conditional rendering in a template.
 * @param condition The condition to test for rendering.
 * @param templateOrTemplateExpression The template or an expression that gets
 * the template to render when the condition is true.
 */
export function when<T = any, K = any>(
    condition: Expression<T, K>,
    templateOrTemplateExpression:
        | SyntheticViewTemplate
        | Expression<T, SyntheticViewTemplate>
): CaptureType<T> {
    let getTemplate: Expression<T, SyntheticViewTemplate>;

    if (typeof templateOrTemplateExpression === "function") {
        getTemplate = templateOrTemplateExpression;
    } else {
        getTemplate = (): SyntheticViewTemplate => templateOrTemplateExpression;
    }

    return (source: any, context: ExecutionContext): SyntheticViewTemplate | null => {
        if (condition(source, context)) {
            return getTemplate(source, context);
        }

        return null;
    };
}

import type {
    ContentTemplate,
    HydratableContentTemplate,
} from "../templating/html-binding-directive.js";
import type { ViewController } from "../templating/html-directive.js";
import type { HydratableViewController } from "../templating/hydration-view.js";
import type {
    ElementViewTemplate,
    HydratableElementViewTemplate,
    HydratableSyntheticViewTemplate,
    SyntheticViewTemplate,
} from "../templating/template.js";

export { HydrationMarkup } from "../hydration/markers.js";

/**
 * @internal
 */
export const Hydratable = Symbol.for("fe-hydration");

/**
 * Tests if a template or ViewController is hydratable.
 *
 * @beta
 */
export function isHydratable(view: ViewController): view is HydratableViewController;
/** @beta */
export function isHydratable<TSource = any, TParent = any>(
    template: SyntheticViewTemplate<TSource, TParent>,
): template is HydratableSyntheticViewTemplate<TSource, TParent>;
/** @beta */
export function isHydratable<TSource = any, TParent = any>(
    template: ElementViewTemplate<TSource, TParent>,
): template is HydratableElementViewTemplate<TSource, TParent>;
/** @beta */
export function isHydratable(
    template: ContentTemplate,
): template is HydratableContentTemplate;
/** @beta */
export function isHydratable(value: any): any {
    return value[Hydratable] === Hydratable;
}

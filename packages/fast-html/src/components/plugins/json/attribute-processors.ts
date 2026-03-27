import { children, elements, ref, slotted } from "@microsoft/fast-element";
import { makeAccessor, makeBooleanAccessor, makeEventHandler } from "./expression-utils.js";
import type { AttributeValue } from "./types.js";

/**
 * Appends the HTML and binding values for a single attribute onto the
 * in-progress `strings` / `values` arrays.
 *
 * The `attrName` key controls how each attribute type is serialised:
 * - `"static"` → literal `attrName="value"`.
 * - `"bound"` → `attrName="{{expression}}"` style attribute binding.
 * - `"property"` → `:attrName="{{expression}}"` property binding.
 * - `"boolean"` → `?attrName="{{expression}}"` boolean attribute binding.
 * - `"event"` → `@attrName="{handler(arg)}"` event binding.
 * - `"ref"` / `"slotted"` / `"children"` → FAST attribute directive placeholder.
 *
 * @param attrName - The attribute key from the `attributes` map.
 * @param attrVal  - The attribute value descriptor.
 * @param strings  - Accumulating strings array (mutated in place).
 * @param values   - Accumulating values array (mutated in place).
 * @param context  - Current repeat loop variable, or `null` outside a repeat.
 * @public
 */
export function processAttributeValue(
    attrName: string,
    attrVal: AttributeValue,
    strings: string[],
    values: any[],
    context: string | null
): void {
    switch (attrVal.type) {
        case "static":
            strings[strings.length - 1] += ` ${attrName}="${attrVal.value}"`;
            break;

        case "bound":
            strings[strings.length - 1] += ` ${attrName}="`;
            values.push(makeAccessor(attrVal.expression, context));
            strings.push(`"`);
            break;

        case "property":
            strings[strings.length - 1] += ` :${attrName}="`;
            values.push(makeAccessor(attrVal.expression, context));
            strings.push(`"`);
            break;

        case "boolean":
            strings[strings.length - 1] += ` ?${attrName}="`;
            values.push(makeBooleanAccessor(attrVal.expression, context));
            strings.push(`"`);
            break;

        case "event":
            strings[strings.length - 1] += ` @${attrName}="`;
            values.push(
                makeEventHandler(attrVal.handler, attrVal.argument ?? "", context)
            );
            strings.push(`"`);
            break;

        case "ref":
            strings[strings.length - 1] += ` `;
            values.push(ref(attrVal.property));
            strings.push(``);
            break;

        case "slotted": {
            strings[strings.length - 1] += ` `;
            const slottedOptions: any = { property: attrVal.property };
            if (attrVal.filter) {
                const selector = attrVal.filter.selectors?.join(", ");
                slottedOptions.filter = elements(selector || undefined);
            }
            values.push(slotted(slottedOptions));
            strings.push(``);
            break;
        }

        case "children":
            strings[strings.length - 1] += ` `;
            values.push(children(attrVal.property));
            strings.push(``);
            break;
    }
}

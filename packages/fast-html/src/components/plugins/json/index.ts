/**
 * @packageDocumentation
 *
 * The `json` plugin for {@link ViewTemplateConverter}.
 *
 * Converts a {@link ViewTemplateJSON} object — conforming to `view-template-schema.json` —
 * into a FAST {@link ViewTemplate}.
 *
 * ## Quick start
 *
 * ```ts
 * import { ViewTemplateConverter } from "@microsoft/fast-html";
 * import { json } from "@microsoft/fast-html/plugins/json.js";
 * import type { ViewTemplateJSON } from "@microsoft/fast-html/plugins/json.js";
 *
 * const input: ViewTemplateJSON = {
 *     nodes: [
 *         {
 *             type: "element",
 *             tagName: "span",
 *             children: [{ type: "binding", expression: "greeting" }],
 *         },
 *     ],
 * };
 *
 * const template = new ViewTemplateConverter(json).create(input);
 * ```
 *
 * See `src/view-template-schema.json` for the full JSON schema and
 * `src/fixtures/json/` for usage examples covering binding, events,
 * when, repeat, ref, slotted, and more.
 */

import type { TemplateConverterPlugin, TemplateConverterResult } from "../../converter.js";
import { processNodes } from "./node-processors.js";
import type { ViewTemplateJSON } from "./types.js";

// ─── Public re-exports ───────────────────────────────────────────────────────
// All types are re-exported so consumers can import everything from one path.

export type {
    AttributeValue,
    BindingNode,
    BooleanAttributeValue,
    BoundAttributeValue,
    ChildrenDirectiveValue,
    ElementNode,
    EventAttributeValue,
    PropertyAttributeValue,
    RefDirectiveValue,
    RepeatNode,
    SlottedDirectiveValue,
    StaticAttributeValue,
    TemplateNode,
    TextNode,
    UnescapedHtmlNode,
    ViewTemplateJSON,
    WhenNode,
} from "./types.js";

// ─── Plugin ──────────────────────────────────────────────────────────────────

/**
 * A {@link TemplateConverterPlugin} that converts a {@link ViewTemplateJSON}
 * object into a FAST `ViewTemplate`.
 *
 * Pass this plugin to {@link ViewTemplateConverter} to enable JSON-based
 * template definitions.
 *
 * @example
 * ```ts
 * import { ViewTemplateConverter } from "@microsoft/fast-html";
 * import { json } from "@microsoft/fast-html/plugins/json.js";
 *
 * const template = new ViewTemplateConverter(json).create({
 *     nodes: [{ type: "binding", expression: "greeting" }],
 * });
 * ```
 *
 * @public
 */
export const json: TemplateConverterPlugin<ViewTemplateJSON> = {
    convert(input: ViewTemplateJSON): TemplateConverterResult {
        const strings: string[] = [""];
        const values: any[] = [];
        processNodes(input.nodes, strings, values, null);
        return { strings, values };
    },
};

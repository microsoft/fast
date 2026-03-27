import { ViewTemplate } from "@microsoft/fast-element";

/**
 * The result produced by a {@link TemplateConverterPlugin}.
 * Contains the strings and values arrays consumed by {@link ViewTemplate.create}.
 * @public
 */
export interface TemplateConverterResult {
    /** Static string fragments that appear between binding values. */
    strings: string[];
    /** Binding values, directives, and other dynamic template parts. */
    values: any[];
}

/**
 * A plugin that converts an input of type `TInput` into a
 * {@link TemplateConverterResult} understood by {@link ViewTemplateConverter}.
 *
 * Implement this interface to teach `ViewTemplateConverter` how to handle
 * new input formats (JSON, YAML, an AST, etc.).
 *
 * @example
 * ```ts
 * const myPlugin: TemplateConverterPlugin<MyInput> = {
 *     convert(input) {
 *         const strings = ["<span>", "</span>"];
 *         const values = [(x: any) => x.greeting];
 *         return { strings, values };
 *     },
 * };
 * ```
 *
 * @public
 */
export interface TemplateConverterPlugin<TInput> {
    /**
     * Converts the input into {@link TemplateConverterResult} —
     * the `strings` and `values` required by {@link ViewTemplate.create}.
     */
    convert(input: TInput): TemplateConverterResult;
}

/**
 * Converts structured input into a {@link ViewTemplate} using a provided
 * {@link TemplateConverterPlugin}.
 *
 * The converter itself is format-agnostic: all input-specific logic lives
 * in the plugin. The built-in {@link json} plugin supports JSON input that
 * conforms to `view-template-schema.json`.
 *
 * @example Using the built-in json plugin
 * ```ts
 * import { ViewTemplateConverter } from "@microsoft/fast-html";
 * import { json } from "@microsoft/fast-html/plugins/json.js";
 *
 * const template = new ViewTemplateConverter(json).create({
 *     nodes: [
 *         {
 *             type: "element",
 *             tagName: "span",
 *             children: [{ type: "binding", expression: "greeting" }],
 *         },
 *     ],
 * });
 * ```
 *
 * @example Writing and using a custom plugin
 * ```ts
 * import { ViewTemplateConverter, type TemplateConverterPlugin } from "@microsoft/fast-html";
 *
 * interface MyInput { html: string }
 *
 * const myPlugin: TemplateConverterPlugin<MyInput> = {
 *     convert({ html }) {
 *         return { strings: [html], values: [] };
 *     },
 * };
 *
 * const template = new ViewTemplateConverter(myPlugin).create({ html: "<p>Hello</p>" });
 * ```
 *
 * @public
 */
export class ViewTemplateConverter<TInput, TSource = any> {
    constructor(private readonly plugin: TemplateConverterPlugin<TInput>) {}

    /**
     * Converts `input` using the configured plugin and returns a {@link ViewTemplate}.
     * @param input - The template description in whatever format the plugin accepts.
     */
    public create(input: TInput): ViewTemplate<TSource> {
        const { strings, values } = this.plugin.convert(input);
        return ViewTemplate.create(strings, values);
    }
}

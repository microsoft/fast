import { repeat, ViewTemplate, when } from "@microsoft/fast-element";
import { processAttributeValue } from "./attribute-processors.js";
import { makeAccessor, makeBooleanAccessor } from "./expression-utils.js";
import type {
    BindingNode,
    ElementNode,
    RepeatNode,
    TemplateNode,
    UnescapedHtmlNode,
    WhenNode,
} from "./types.js";

/** HTML tags that must not have a closing tag. */
const voidElements = new Set([
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
]);

/**
 * Builds a child {@link ViewTemplate} from a list of nodes.
 * Used internally by `processWhen` and `processRepeat`.
 */
function buildChildTemplate(
    nodes: TemplateNode[],
    context: string | null
): ViewTemplate {
    const strings: string[] = [""];
    const values: any[] = [];
    processNodes(nodes, strings, values, context);
    return ViewTemplate.create(strings, values);
}

/**
 * Appends a content binding (`{{expression}}`) to the in-progress template arrays.
 *
 * @param node    - The binding node to process.
 * @param strings - Accumulating strings array (mutated in place).
 * @param values  - Accumulating values array (mutated in place).
 * @param context - Current repeat loop variable, or `null` outside a repeat.
 */
function processBinding(
    node: BindingNode,
    strings: string[],
    values: any[],
    context: string | null
): void {
    values.push(makeAccessor(node.expression, context));
    strings.push("");
}

/**
 * Appends an unescaped HTML binding (`{{{expression}}}`) wrapped in a `<div :innerHTML>`.
 *
 * @param node    - The unescaped-html node to process.
 * @param strings - Accumulating strings array (mutated in place).
 * @param values  - Accumulating values array (mutated in place).
 * @param context - Current repeat loop variable, or `null` outside a repeat.
 */
function processUnescapedHtml(
    node: UnescapedHtmlNode,
    strings: string[],
    values: any[],
    context: string | null
): void {
    strings[strings.length - 1] += `<div :innerHTML="`;
    values.push(makeAccessor(node.expression, context));
    strings.push(`"></div>`);
}

/**
 * Appends an HTML element (opening tag, attributes, children, closing tag) to
 * the in-progress template arrays.
 *
 * @param node    - The element node to process.
 * @param strings - Accumulating strings array (mutated in place).
 * @param values  - Accumulating values array (mutated in place).
 * @param context - Current repeat loop variable, or `null` outside a repeat.
 */
function processElement(
    node: ElementNode,
    strings: string[],
    values: any[],
    context: string | null
): void {
    const tag = node.tagName;
    strings[strings.length - 1] += `<${tag}`;

    for (const [attrName, attrVal] of Object.entries(node.attributes ?? {})) {
        processAttributeValue(attrName, attrVal, strings, values, context);
    }

    strings[strings.length - 1] += `>`;

    if (!voidElements.has(tag)) {
        processNodes(node.children ?? [], strings, values, context);
        strings[strings.length - 1] += `</${tag}>`;
    }
}

/**
 * Appends a `when` directive to the in-progress template arrays.
 *
 * @param node    - The when node to process.
 * @param strings - Accumulating strings array (mutated in place).
 * @param values  - Accumulating values array (mutated in place).
 * @param context - Current repeat loop variable, or `null` outside a repeat.
 */
function processWhen(
    node: WhenNode,
    strings: string[],
    values: any[],
    context: string | null
): void {
    const condition = makeBooleanAccessor(node.expression, context);
    const childTemplate = buildChildTemplate(node.children, context);
    values.push(when(condition, childTemplate));
    strings.push("");
}

/**
 * Appends a `repeat` directive to the in-progress template arrays.
 *
 * @param node    - The repeat node to process.
 * @param strings - Accumulating strings array (mutated in place).
 * @param values  - Accumulating values array (mutated in place).
 * @param context - Current repeat loop variable, or `null` outside a repeat.
 */
function processRepeat(
    node: RepeatNode,
    strings: string[],
    values: any[],
    context: string | null
): void {
    const listAccessor = makeAccessor(node.list, context);
    const childTemplate = buildChildTemplate(node.children, node.item);
    values.push(repeat((x: any, c: any) => listAccessor(x, c), childTemplate));
    strings.push("");
}

/**
 * Dispatches a single template node to the appropriate processor, appending
 * its HTML and binding values to the in-progress `strings` / `values` arrays.
 *
 * @param node    - The template node to process.
 * @param strings - Accumulating strings array (mutated in place).
 * @param values  - Accumulating values array (mutated in place).
 * @param context - Current repeat loop variable, or `null` outside a repeat.
 * @public
 */
export function processNode(
    node: TemplateNode,
    strings: string[],
    values: any[],
    context: string | null
): void {
    switch (node.type) {
        case "text":
            strings[strings.length - 1] += node.value;
            break;
        case "binding":
            processBinding(node, strings, values, context);
            break;
        case "unescaped-html":
            processUnescapedHtml(node, strings, values, context);
            break;
        case "element":
            processElement(node, strings, values, context);
            break;
        case "when":
            processWhen(node, strings, values, context);
            break;
        case "repeat":
            processRepeat(node, strings, values, context);
            break;
    }
}

/**
 * Processes an array of template nodes in order, accumulating HTML string
 * fragments and binding values ready for {@link ViewTemplate.create}.
 *
 * @param nodes   - The template nodes to process.
 * @param strings - Accumulating strings array (mutated in place). Must start with `[""]`.
 * @param values  - Accumulating values array (mutated in place). Must start empty `[]`.
 * @param context - Current repeat loop variable, or `null` outside a repeat.
 * @public
 */
export function processNodes(
    nodes: TemplateNode[],
    strings: string[],
    values: any[],
    context: string | null
): void {
    for (const node of nodes) {
        processNode(node, strings, values, context);
    }
}

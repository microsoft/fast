/**
 * This code is largely a fork of lit's rendering implementation: https://github.com/lit/lit/blob/main/packages/labs/ssr/src/lib/render-lit-html.ts
 * with changes as necessary to render FAST components. A big thank you to those who contributed to lit's code above.
 */
import { ViewTemplate } from "@microsoft/fast-element";
import { DefaultTreeNode, DefaultTreeParentNode, parseFragment } from "parse5";
import { Op } from "./op-codes.js";

const opCache: Map<ViewTemplate, Op[]> = new Map();

interface Visitor {
    visit?: (node: DefaultTreeNode) => void;
    leave?: (node: DefaultTreeNode) => void;
}

/**
 * Traverses a tree of nodes depth-first, invoking callbacks from visitor for each node as it goes.
 * @param node - the node to traverse
 * @param visitor - callbacks to be invoked during node traversal
 */
function traverse(node: DefaultTreeNode | DefaultTreeParentNode, visitor: Visitor) {
    if (visitor.visit) {
        visitor.visit(node);
    }
    if ("childNodes" in node) {
        const { childNodes } = node;
        for (const child of childNodes) {
            traverse(child, visitor);
        }
    }

    if (visitor.leave) {
        visitor.leave(node);
    }
}

/**
 * Parses a template into a set of operation instructions
 * @param template - The template to parse
 */
export function parseTemplateToOpCodes(template: ViewTemplate): Op[] {
    let ops: Op[] | undefined = opCache.get(template);
    if (ops !== undefined) {
        return ops;
    }

    const { html } = template;

    if (typeof html !== "string") {
        throw new Error(
            "@microsoft/fast-ssr does not support rendering a ViewTemplate with an HTMLTemplateElement html source."
        );
    }

    ops = [];
    const ast = parseFragment(html, { sourceCodeLocationInfo: true });

    if (!("nodeName" in ast)) {
        // I'm not sure when exactly this is encountered but the type system seems to say it's possible.
        throw new Error(`Error parsing template:\n${template}`);
    }

    return ops;
}

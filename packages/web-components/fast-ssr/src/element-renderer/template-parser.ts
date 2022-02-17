import { ViewTemplate } from "@microsoft/fast-element";
import { parseFragment } from "parse5";
import { Op } from "./op-codes.js";

const opCache: Map<ViewTemplate, Op[]> = new Map();

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

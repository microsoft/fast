import { ViewTemplate } from "@microsoft/fast-element";
import { Op } from "./op-codes.js";

const opCache: Map<ViewTemplate, Op[]> = new Map();

/**
 * Parses a template into a set of operation instructions
 * @param template - The template to parse
 */
export function parseTemplateToOpCodes(template: ViewTemplate): Op[] {
    if (opCache.has(template)) {
        return opCache.get(template)!;
    }

    const ops: Op[] = [];

    return ops;
}

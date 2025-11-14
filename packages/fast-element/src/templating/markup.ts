import type { ViewBehaviorFactory } from "./html-directive.js";

const marker = `fast-${Math.random().toString(36).substring(2, 8)}`;
const interpolationStart = `${marker}{`;
const interpolationEnd = `}${marker}`;
const interpolationEndLength = interpolationEnd.length;

let id = 0;

/** @internal */
export const nextId = (): string => `${marker}-${++id}`;

/**
 * Common APIs related to markup generation.
 * @public
 */
export const Markup = Object.freeze({
    /**
     * Creates a placeholder string suitable for marking out a location *within*
     * an attribute value or HTML content.
     * @param index - The directive index to create the placeholder for.
     * @remarks
     * Used internally by binding directives.
     */
    interpolation: (id: string) => `${interpolationStart}${id}${interpolationEnd}`,

    /**
     * Creates a placeholder that manifests itself as an attribute on an
     * element.
     * @param attributeName - The name of the custom attribute.
     * @param index - The directive index to create the placeholder for.
     * @remarks
     * Used internally by attribute directives such as `ref`, `slotted`, and `children`.
     */
    attribute: (id: string) =>
        `${nextId()}="${interpolationStart}${id}${interpolationEnd}"`,

    /**
     * Creates a placeholder that manifests itself as a marker within the DOM structure.
     * @param index - The directive index to create the placeholder for.
     * @remarks
     * Used internally by structural directives such as `repeat`.
     */
    comment: (id: string) => `<!--${interpolationStart}${id}${interpolationEnd}-->`,
});

/**
 * Common APIs related to content parsing.
 * @public
 */
export const Parser = Object.freeze({
    /**
     * Parses text content or HTML attribute content, separating out the static strings
     * from the directives.
     * @param value - The content or attribute string to parse.
     * @param factories - A list of directives to search for in the string.
     * @returns A heterogeneous array of static strings interspersed with
     * directives or null if no directives are found in the string.
     */
    parse(
        value: string,
        factories: Record<string, ViewBehaviorFactory>
    ): (string | ViewBehaviorFactory)[] | null {
        const parts = value.split(interpolationStart);

        if (parts.length === 1) {
            return null;
        }

        const result: (string | ViewBehaviorFactory)[] = [];

        for (let i = 0, ii = parts.length; i < ii; ++i) {
            const current = parts[i];
            const index = current.indexOf(interpolationEnd);
            let literal: string | ViewBehaviorFactory;

            if (index === -1) {
                literal = current;
            } else {
                const factoryId = current.substring(0, index);
                result.push(factories[factoryId]);
                literal = current.substring(index + interpolationEndLength);
            }

            if (literal !== "") {
                result.push(literal);
            }
        }

        return result;
    },
});

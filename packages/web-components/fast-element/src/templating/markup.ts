import { isString } from "../interfaces.js";
import type { ExecutionContext } from "../observation/observable.js";
import { bind } from "./binding.js";
import type { HTMLDirective, InlinableHTMLDirective } from "./html-directive.js";

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
    interpolation(index: number): string {
        return `${interpolationStart}${index}${interpolationEnd}`;
    },

    /**
     * Creates a placeholder that manifests itself as an attribute on an
     * element.
     * @param attributeName - The name of the custom attribute.
     * @param index - The directive index to create the placeholder for.
     * @remarks
     * Used internally by attribute directives such as `ref`, `slotted`, and `children`.
     */
    attribute(index: number): string {
        return `${nextId()}="${this.interpolation(index)}"`;
    },

    /**
     * Creates a placeholder that manifests itself as a marker within the DOM structure.
     * @param index - The directive index to create the placeholder for.
     * @remarks
     * Used internally by structural directives such as `repeat`.
     */
    comment(index: number): string {
        return `<!--${interpolationStart}${index}${interpolationEnd}-->`;
    },
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
     * @param directives - A list of directives to search for in the string.
     * @returns A heterogeneous array of static strings interspersed with
     * directives or null if no directives are found in the string.
     */
    parse(
        value: string,
        directives: readonly HTMLDirective[]
    ): (string | HTMLDirective)[] | null {
        const parts = value.split(interpolationStart);

        if (parts.length === 1) {
            return null;
        }

        const result: (string | HTMLDirective)[] = [];

        for (let i = 0, ii = parts.length; i < ii; ++i) {
            const current = parts[i];
            const index = current.indexOf(interpolationEnd);
            let literal: string | HTMLDirective;

            if (index === -1) {
                literal = current;
            } else {
                const directiveIndex = parseInt(current.substring(0, index));
                result.push(directives[directiveIndex]);
                literal = current.substring(index + interpolationEndLength);
            }

            if (literal !== "") {
                result.push(literal);
            }
        }

        return result;
    },

    /**
     * Aggregates an array of strings and directives into a single directive.
     * @param parts - A heterogeneous array of static strings interspersed with
     * directives.
     * @returns A single inline directive that aggregates the behavior of all the parts.
     */
    aggregate(parts: (string | HTMLDirective)[]): InlinableHTMLDirective {
        if (parts.length === 1) {
            return parts[0] as InlinableHTMLDirective;
        }

        let aspect: string | undefined;
        const partCount = parts.length;
        const finalParts = parts.map((x: string | InlinableHTMLDirective) => {
            if (isString(x)) {
                return (): string => x;
            }

            aspect = x.rawAspect || aspect;
            return x.binding;
        });

        const binding = (scope: unknown, context: ExecutionContext): string => {
            let output = "";

            for (let i = 0; i < partCount; ++i) {
                output += finalParts[i](scope, context);
            }

            return output;
        };

        const directive = bind(binding) as InlinableHTMLDirective;
        directive.setAspect(aspect!);
        return directive;
    },
});

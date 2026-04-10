export function renderTemplate(rawTemplate: string, styles: string): string {
    const template = rawTemplate.replace(
        "{{styles}}",
        `<link rel="stylesheet" href="${styles}">`,
    );

    if (template === rawTemplate && styles) {
        return template.replace(
            /(<template[^>]*>)/i,
            match => `${match}<link rel="stylesheet" href="${styles}">`,
        );
    }

    return template;
}

function processDsdTemplate(
    dsd: string,
    templateValues: Record<string, unknown> = {},
): string {
    let processed = dsd.replace(
        /(\s?)(\??)([a-zA-Z0-9-]+)="{{([a-zA-Z0-9]+)}}"/g,
        (match, space, isBoolean, attrName, varName) => {
            const value = templateValues[varName];

            if (value === undefined) {
                return "";
            }

            if (isBoolean === "?") {
                return value ? `${space}${attrName}` : "";
            }

            return `${space}${attrName}="${value}"`;
        },
    );

    processed = processed.replace(/{{([a-zA-Z0-9]+)}}/g, (match, varName) => {
        const value = templateValues[varName];
        return value !== undefined ? String(value) : "";
    });

    return processed;
}

export function renderFixture(
    queryObj: Record<string, string> = {},
    dsdTemplate?: string,
    styles?: string,
    templateData?: Record<string, unknown>,
    childTemplates?: Record<string, string>,
) {
    let fixture = "";
    if ("html" in queryObj) {
        fixture = String(queryObj.html);
    } else if (queryObj.tagName) {
        const tagName = String(queryObj.tagName);
        let attributes: Record<string, unknown> = {};
        if (queryObj.attributes) {
            try {
                attributes =
                    typeof queryObj.attributes === "string"
                        ? JSON.parse(queryObj.attributes)
                        : queryObj.attributes;
            } catch {
                // fallback: ignore attributes if not valid JSON
            }
        }
        const innerHTML = queryObj.innerHTML ? String(queryObj.innerHTML) : "";
        const attributesString = Object.entries(attributes)
            .map(([key, value]) =>
                value === true ? key : `${key}="${String(value).replace(/"/g, "")}"`,
            )
            .join(" ");

        let processedDsd = "";

        if (dsdTemplate) {
            const normalizedAttributes: Record<string, unknown> = {};
            for (const [key, value] of Object.entries(attributes)) {
                normalizedAttributes[key] = value;
                const stripped = key.replace(/-/g, "");
                if (stripped !== key) {
                    normalizedAttributes[stripped] = value;
                }
            }
            const templateValues = {
                ...normalizedAttributes,
                ...templateData,
            };

            processedDsd = processDsdTemplate(dsdTemplate, templateValues);

            if (styles) {
                processedDsd = renderTemplate(processedDsd, styles);
            }
        }

        // Inject DSD into child custom elements in the innerHTML
        // before assembling the fixture, so the root element (which
        // already has its own DSD from dsdTemplate) isn't matched.
        let processedInnerHTML = innerHTML.trim();
        if (childTemplates) {
            processedInnerHTML = injectChildTemplates(processedInnerHTML, childTemplates);
        }

        fixture = `<${tagName}${
            attributesString ? ` ${attributesString}` : ""
        }>${processedDsd}${processedInnerHTML}</${tagName}>`;
    }

    if (childTemplates && "html" in queryObj) {
        fixture = injectChildTemplates(fixture, childTemplates);
    }

    return fixture;
}

/**
 * Inject DSD templates into custom elements found in an HTML string.
 */
function injectChildTemplates(
    html: string,
    childTemplates: Record<string, string>,
): string {
    for (const [childTagName, childDsd] of Object.entries(childTemplates)) {
        // Use (?=[\s>/]) so hyphenated custom element names like
        // "my-radio" don't match "my-radio-group".
        html = html.replace(
            new RegExp(`(<${childTagName}(?=[\\s>/])[^>]*>)`, "g"),
            (match, openingTag: string) => {
                const childAttrs: Record<string, unknown> = {};
                const attrRegex = /([a-zA-Z0-9-]+)="([^"]*)"/g;
                for (const attrMatch of openingTag.matchAll(attrRegex)) {
                    childAttrs[attrMatch[1]] = attrMatch[2];
                }

                return `${openingTag}${processDsdTemplate(childDsd, childAttrs)}`;
            },
        );
    }
    return html;
}

export function renderPreloadLinks(styles: string[], tokensThemeUrl?: string): string {
    return [
        tokensThemeUrl ? `<link rel="stylesheet" href="${tokensThemeUrl}">` : false,
        ...styles.map(style => `<link rel="preload" href="${style}" as="style">`),
    ]
        .filter(Boolean)
        .join("\n");
}

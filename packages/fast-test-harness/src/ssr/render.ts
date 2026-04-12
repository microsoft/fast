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
    // Uses scanning instead of regex to avoid O(n²) backtracking on untrusted input
    let result = "";
    let lastIndex = 0;

    for (;;) {
        const open = dsd.indexOf("{{", lastIndex);
        if (open === -1) {
            break;
        }

        const close = dsd.indexOf("}}", open + 2);
        if (close === -1) {
            break;
        }

        const varName = dsd.slice(open + 2, close);
        const afterClose = close + 2;

        // Skip non-identifier placeholders.
        if (!/^[a-zA-Z0-9]+$/.test(varName)) {
            result += dsd.slice(lastIndex, afterClose);
            lastIndex = afterClose;
            continue;
        }

        const value = templateValues[varName];

        // Detect attribute binding by scanning backwards for =['"]?
        let pos = open;
        let quote = "";

        // Optional opening quote before {{
        if (pos > 0 && (dsd[pos - 1] === '"' || dsd[pos - 1] === "'")) {
            quote = dsd[pos - 1];
            pos--;
        }

        // Check for matching closing quote after }}
        let endPos = afterClose;
        if (quote) {
            if (endPos < dsd.length && dsd[endPos] === quote) {
                endPos++;
            } else {
                // No matching close quote — reset and treat as text.
                quote = "";
                pos = open;
            }
        }

        if (pos > 0 && dsd[pos - 1] === "=") {
            pos--; // skip =

            // Scan backwards for the attribute name.
            const nameEnd = pos;
            while (pos > 0 && !/[\s>"'{}=?]/.test(dsd[pos - 1])) {
                pos--;
            }
            const attrName = dsd.slice(pos, nameEnd);

            if (attrName.length > 0) {
                // Check for ? (boolean attribute) prefix.
                let isBoolean = false;
                if (pos > 0 && dsd[pos - 1] === "?") {
                    isBoolean = true;
                    pos--;
                }

                // Capture one leading whitespace character.
                let spaceChar = "";
                if (pos > 0 && /\s/.test(dsd[pos - 1])) {
                    pos--;
                    spaceChar = dsd[pos];
                }

                // Emit everything before this attribute binding.
                result += dsd.slice(lastIndex, pos);

                if (value === undefined) {
                    // Remove attribute entirely.
                } else if (isBoolean) {
                    if (value) {
                        result += spaceChar + attrName;
                    }
                } else {
                    result += `${spaceChar}${attrName}=${quote}${value}${quote}`;
                }

                lastIndex = endPos;
                continue;
            }
        }

        // Standalone {{varName}} in text content.
        result += dsd.slice(lastIndex, open);
        result += value !== undefined ? String(value) : "";
        lastIndex = afterClose;
    }

    result += dsd.slice(lastIndex);
    return result;
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

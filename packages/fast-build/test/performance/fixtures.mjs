import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const corpus = JSON.parse(
    readFileSync(
        new URL(
            "../../../../crates/microsoft-fast-build/benches/fixtures/corpus.json",
            import.meta.url,
        ),
        "utf8",
    ),
);

export const cases = [
    "url_sink_siblings",
    "repeat_custom_elements",
    "plain_bound_elements",
    "many_definitions",
    "large_state_overlay",
    "large_state_no_overlay",
];

function replaceIndex(value, index) {
    if (typeof value === "string") {
        return value.replaceAll("{i}", String(index));
    }
    if (Array.isArray(value)) {
        return value.map(item => replaceIndex(item, index));
    }
    if (value !== null && typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value).map(([key, item]) => [key, replaceIndex(item, index)]),
        );
    }
    return value;
}

export function fixture(caseName, count, payload = 1, rootKeys = 0) {
    const templates = {};
    const state = { label: corpus.item.label };
    const siblings = key =>
        Array.from({ length: count }, (_, i) =>
            corpus[key].replaceAll("{i}", String(i)),
        ).join("");
    let entry;
    switch (caseName) {
        case "url_sink_siblings":
            templates["bench-url-item"] = corpus.urlTemplate;
            entry = siblings("urlEntry");
            break;
        case "repeat_custom_elements":
        case "plain_bound_elements":
            state.items = Array.from({ length: count }, (_, i) =>
                replaceIndex(corpus.item, i),
            );
            if (caseName === "repeat_custom_elements") {
                templates["bench-repeat"] = corpus.repeatTemplate;
                templates["bench-item"] = corpus.itemTemplate;
                entry = corpus.repeatEntry;
            } else {
                templates["bench-plain"] = corpus.plainTemplate;
                entry = corpus.plainEntry;
            }
            break;
        case "many_definitions":
            for (let i = 0; i < count; ++i) {
                templates[`bench-definition-${i}`] =
                    corpus.definitionTemplate.repeat(payload);
            }
            entry = siblings("definitionEntry");
            break;
        case "large_state_overlay":
        case "large_state_no_overlay":
            for (let i = 0; i < rootKeys; ++i) {
                state[`key${i}`] = { nested: ["one", "two", "three"] };
            }
            templates["bench-overlay"] = corpus.overlayTemplate;
            entry = siblings(
                caseName === "large_state_overlay" ? "overlayEntry" : "overlayBareEntry",
            );
            break;
        default:
            throw new Error(`Unknown performance case: ${caseName}`);
    }
    return { entry, templates, state };
}

export function outputStats(html) {
    return {
        outputBytes: Buffer.byteLength(html),
        sha256: createHash("sha256").update(html).digest("hex"),
        hosts: (html.match(/<bench-[\w-]+(?:\s|>)/g) ?? []).length,
        bindings: (html.match(/<!--(?:fe:b|fe-b\$\$start\$\$)/g) ?? []).length,
        repeats: (html.match(/<!--(?:fe:r|fe-repeat\$\$start\$\$)/g) ?? []).length,
        attributeMarkers: (html.match(/\sdata-fe(?:=|-[bc]-)/g) ?? []).length,
    };
}

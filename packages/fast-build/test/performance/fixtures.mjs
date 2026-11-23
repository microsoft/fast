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

export function componentScopeFixture(count, properties, grouped = false) {
    if (grouped) {
        const attributes = Array.from(
            { length: properties },
            (_, index) => ` data-item${index}="{{row.detail}}"`,
        ).join("");
        return {
            entry: "<dataset-root></dataset-root>",
            templates: {
                "dataset-card": `<article>{{dataset.item0}}/{{dataset.item${properties - 1}}}</article>`,
                "dataset-root":
                    '<f-repeat value="{{row in rows}}">' +
                    `<dataset-card${attributes}></dataset-card></f-repeat>`,
            },
            state: {
                rows: Array.from({ length: count }, (_, id) => ({
                    detail: `Detail ${id}`,
                })),
            },
        };
    }
    const names = ["id", "label", "url", ":active"];
    const values = ["row.id", "row.label", "row.url", "row.active"];
    const attributes = Array.from(
        { length: properties },
        (_, index) =>
            ` ${names[index] ?? `:extra${index}`}="{{${values[index] ?? "row.detail"}}}"`,
    ).join("");
    return {
        entry: "<repeat-root></repeat-root>",
        templates: {
            "repeat-card":
                "<style>:host { display: block; }</style>" +
                '<article data-id="{{id}}" ?data-active="{{active}}">' +
                '<a href="{{url}}">{{label}}</a><slot></slot></article>',
            "repeat-root":
                '<f-repeat value="{{row in rows}}">' +
                `<repeat-card${attributes}>{{row.detail}}</repeat-card></f-repeat>`,
        },
        state: {
            id: 0,
            label: "Root",
            url: "#root",
            active: true,
            rows: Array.from({ length: count }, (_, id) => ({
                id,
                label: `Row ${id}`,
                url: `#row-${id}`,
                active: id % 2 === 0,
                detail: `Detail ${id}`,
            })),
        },
    };
}

export function componentPropertyPrefixFixture(count, properties, source = "global") {
    const rowScoped = source === "row";
    const prefix = rowScoped ? "row" : "theme";
    const alias = source === "alias-fallback" ? "theme.palette.color0" : "row";
    const attributes = Array.from(
        { length: properties },
        (_, index) => ` :color${index}="{{${prefix}.palette.color${index}}}"`,
    ).join("");
    const body = Array.from(
        { length: properties },
        (_, index) => `{{color${index}}}`,
    ).join("/");
    const theme = {
        palette: Object.fromEntries(
            Array.from({ length: properties }, (_, index) => [
                `color${index}`,
                `Color ${index}`,
            ]),
        ),
    };
    return {
        entry: "<prefix-root></prefix-root>",
        templates: {
            "prefix-card": `<article>${body}</article>`,
            "prefix-root":
                `<f-repeat value="{{${alias} in rows}}">` +
                `<prefix-card${attributes}></prefix-card></f-repeat>`,
        },
        state: {
            rows: Array.from({ length: count }, () =>
                rowScoped ? theme : source === "alias-fallback" ? "Alias color" : true,
            ),
            theme,
        },
    };
}

export function stateValidationFixture(count, shape = "nested") {
    let unused;
    switch (shape) {
        case "nested":
        case "duplicate":
            unused = Array.from({ length: count }, (_, id) => ({
                id,
                label: `Row ${id}`,
                detail: {
                    active: id % 2 === 0,
                    url: `#row-${id}`,
                    extra: { text: "value", rank: id },
                },
                tags: ["alpha", "beta", "gamma"],
            }));
            break;
        case "wide":
            unused = Object.fromEntries(
                Array.from({ length: count }, (_, id) => [`key${id}`, [id, true, null]]),
            );
            break;
        case "scalars":
            unused = Array.from({ length: count }, (_, id) => id);
            break;
        default:
            throw new Error(`Unknown state shape: ${shape}`);
    }
    const state = { label: "<&\"'cafe", unused };
    return {
        entry: "<state-root></state-root>",
        templates: { "state-root": "<p>{{label}}</p>" },
        state,
        ...(shape === "duplicate"
            ? {
                  stateJson:
                      '{"\\u006cabel":"discarded",' + JSON.stringify(state).slice(1),
              }
            : {}),
    };
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

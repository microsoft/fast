import { expect, test } from "@playwright/test";
import {
    type AttributeDataBindingBehaviorConfig,
    type ContentDataBindingBehaviorConfig,
    getNextBehavior,
    type TemplateDirectiveBehaviorConfig,
    transformInnerHTML,
} from "./utilities.js";

test.describe("declarative comment parsing", () => {
    test("discovers comments once when transforming multiple bindings", () => {
        for (const comment of ["", "<!-- {{{ignored}}} -->"]) {
            for (const count of [1, 16]) {
                const source = comment + "{{title}}{{{value}}}".repeat(count);
                const includes = String.prototype.includes;
                let discoveries = 0;
                let result: string;
                try {
                    String.prototype.includes = function (search, position) {
                        if (search === "<!--") discoveries++;
                        return includes.call(this, search, position);
                    };
                    result = transformInnerHTML(source);
                } finally {
                    String.prototype.includes = includes;
                }
                expect(result).toBe(
                    comment + '{{title}}<div :innerHTML="{{value}}"></div>'.repeat(count),
                );
                expect(discoveries).toBe(1);
            }
        }
    });

    test("shares comment discovery across parser bindings and nested directives", async ({
        page,
    }) => {
        await page.goto("/");
        const results = await page.evaluate(
            async ({ parserURL, schemaURL }) => {
                const { TemplateParser } = await import(parserURL);
                const { Schema } = await import(schemaURL);
                return ["", "<!-- {{ignored}} -->"].flatMap(comment =>
                    [1, 16].map(count => {
                        const note = comment ? "<!--" : "note";
                        const binding = `<span title="{{title}}" data-note="${note}">{{value}}</span>`;
                        const whenComment = comment
                            ? "<!-- </f-when> {{ignored}} -->"
                            : "";
                        const repeatComment = comment
                            ? "<!-- </f-repeat> {{ignored}} -->"
                            : "";
                        const nested =
                            `<f-when value="{{visible}}">${whenComment}` +
                            `<f-repeat value="{{item in items}}">${repeatComment}` +
                            "{{item.name}}</f-repeat></f-when>";
                        const source =
                            comment + binding.repeat(count) + nested + "{{after}}";
                        const schema = new Schema("comment-scan-test");
                        const includes = String.prototype.includes;
                        let discoveries = 0;
                        let parsed;
                        try {
                            String.prototype.includes = function (search, position) {
                                if (search === "<!--") discoveries++;
                                return includes.call(this, search, position);
                            };
                            parsed = new TemplateParser().parse(source, schema);
                        } finally {
                            String.prototype.includes = includes;
                        }
                        return {
                            discoveries,
                            values: parsed.values.length,
                            expectedValues: count * 2 + 2,
                            literal: parsed.strings.join(""),
                            expectedLiteral:
                                comment +
                                `<span title="" data-note="${note}"></span>`.repeat(
                                    count,
                                ),
                            after: parsed.values.at(-1)({ after: "live" }, {}),
                            hasIgnored: schema.schemaMap.has("ignored"),
                        };
                    }),
                );
            },
            {
                parserURL: `/@fs${new URL("./template-parser.ts", import.meta.url).pathname}`,
                schemaURL: `/@fs${new URL("../components/schema.ts", import.meta.url).pathname}`,
            },
        );
        for (const result of results) {
            expect(result.discoveries).toBe(1);
            expect(result.values).toBe(result.expectedValues);
            expect(result.literal).toBe(result.expectedLiteral);
            expect(result.after).toBe("live");
            expect(result.hasIgnored).toBe(false);
        }
    });

    test("skips comment bindings and directives without changing their source", () => {
        const comment =
            '<!-- {{ignored}} {{{html}}} <f-when value="{{show}}">ignored</f-when> -->';
        const source = `${comment}<p>{{value}}</p>`;
        const result = getNextBehavior(source) as ContentDataBindingBehaviorConfig;
        expect(result.openingStartIndex).toBe(source.indexOf("{{value}}"));
        expect(result.bindingType).toBe("default");
        expect(transformInnerHTML(source)).toBe(source);
        expect(getNextBehavior(comment)).toBeNull();
    });

    test("does not treat quoted comment openers as HTML comments", () => {
        for (const quote of ['"', "'"]) {
            const source = `<div title=${quote}<!-- {{title}}${quote}>{{value}}</div><!-- {{ignored}} -->{{after}}`;
            const title = getNextBehavior(source) as AttributeDataBindingBehaviorConfig;
            expect(title.openingStartIndex).toBe(source.indexOf("{{title}}"));
            const value = getNextBehavior(
                source,
                title.closingEndIndex,
            ) as ContentDataBindingBehaviorConfig;
            expect(value.openingStartIndex).toBe(source.indexOf("{{value}}"));
            const after = getNextBehavior(
                source,
                value.closingEndIndex,
            ) as ContentDataBindingBehaviorConfig;
            expect(after.openingStartIndex).toBe(source.indexOf("{{after}}"));
        }
    });

    test("only skips actual comments and treats unclosed comments as literal", () => {
        const source = "<!not-a-comment>{{value}}";
        expect(
            (getNextBehavior(source) as ContentDataBindingBehaviorConfig)
                .openingStartIndex,
        ).toBe(source.indexOf("{{value}}"));
        expect(getNextBehavior("<!-- {{ignored}}")).toBeNull();
        expect(transformInnerHTML("<!-- {{{ignored}}}")).toBe("<!-- {{{ignored}}}");
    });

    test("preserves authored comments inside nested directives", () => {
        const body =
            '<!-- </f-when> {{ignored}} --><f-repeat value="{{item in items}}"><!-- </f-repeat> {{ignored}} -->{{item.name}}</f-repeat>';
        const source = `<!-- {{ignored}} --><f-when value="{{visible}}">${body}</f-when>`;
        const when = getNextBehavior(source) as TemplateDirectiveBehaviorConfig;
        expect(when.value).toBe("visible");
        expect(source.slice(when.openingTagEndIndex, when.closingTagStartIndex)).toBe(
            body,
        );
        const repeat = getNextBehavior(body) as TemplateDirectiveBehaviorConfig;
        expect(repeat.value).toBe("item in items");
        expect(body.slice(repeat.openingTagEndIndex, repeat.closingTagStartIndex)).toBe(
            "<!-- </f-repeat> {{ignored}} -->{{item.name}}",
        );
        expect(transformInnerHTML(source)).toBe(source);
    });

    test("preserves comment markers in quoted directive and event expressions", () => {
        const directive = `<f-when value="{{label === '<!--'}}">{{value}}</f-when>`;
        expect(
            (getNextBehavior(directive) as TemplateDirectiveBehaviorConfig).value,
        ).toBe("label === '<!--'");
        const event = `<button @click="{handle('<!--', '-->')}"></button>`;
        const binding = getNextBehavior(event) as AttributeDataBindingBehaviorConfig;
        expect(event.slice(binding.openingEndIndex, binding.closingStartIndex)).toBe(
            "handle('<!--', '-->')",
        );
        expect(transformInnerHTML(event)).toBe(event);
    });

    test("preserves comment and quoted-attribute context after earlier bindings", () => {
        const source =
            '<div title="{{title}}" data-note="<!--">{{{first}}}{{{second}}}</div><!-- {{{ignored}}} -->{{{last}}}';
        expect(transformInnerHTML(source)).toBe(
            '<div title="{{title}}" data-note="<!--"><div :innerHTML="{{first}}"></div><div :innerHTML="{{second}}"></div></div><!-- {{{ignored}}} --><div :innerHTML="{{last}}"></div>',
        );
    });
});

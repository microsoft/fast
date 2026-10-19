import { expect, test } from "@playwright/test";
import {
    type AttributeDataBindingBehaviorConfig,
    type ContentDataBindingBehaviorConfig,
    getNextBehavior,
    type TemplateDirectiveBehaviorConfig,
    transformInnerHTML,
} from "./utilities.js";

test.describe("declarative comment parsing", () => {
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
            '<div title="{{title}}" data-note="<!--">{{{value}}}</div><!-- {{{ignored}}} -->';
        expect(transformInnerHTML(source)).toBe(
            '<div title="{{title}}" data-note="<!--"><div :innerHTML="{{value}}"></div></div><!-- {{{ignored}}} -->',
        );
    });
});

import { ConstructableStyleSheetRenderer } from "./constructable-stylesheet-renderer";
import { jss } from "./jss";

class MockRule {
    constructor(readonly rule: string) {
        // noop
    }

    public toString(): string {
        return this.rule;
    }
}

describe("Constructable Stylesheet Renderer", (): void => {

    const options: any = {
        meta: "MyButton",
        index: -1001
    };

    beforeEach(() => {
        CSSStyleSheet.prototype.replaceSync = jest.fn((content: string): void => { /* noop */ });

        ConstructableStyleSheetRenderer.reset();
    });

    describe("Attach stylesheet, Detach stylesheet, Ordered stylesheets", (): void => {
        test("Attach a stylesheet", (): void => {

            const renderer: ConstructableStyleSheetRenderer = new ConstructableStyleSheetRenderer(jss.createStyleSheet({}, options));
            renderer.attach();

            const count: number = document.adoptedStyleSheets.length;

            expect(count).toBe(1);
        });

        test("Detach a stylesheet", (): void => {

            const renderer: ConstructableStyleSheetRenderer = new ConstructableStyleSheetRenderer(jss.createStyleSheet({}, options));
            renderer.attach();

            const attchedCount: number = document.adoptedStyleSheets.length;

            renderer.detach();

            const DetachedCount: number = document.adoptedStyleSheets.length;

            expect(attchedCount).toBe(1);
            expect(DetachedCount).toBe(0);
        });

        test("Stylesheets are added in the correct order", (): void => {

            const renderer1: ConstructableStyleSheetRenderer = new ConstructableStyleSheetRenderer(jss.createStyleSheet({}, { meta: "MyButton1", index: -1001 }));
            renderer1.attach();

            let count: number = document.adoptedStyleSheets.length;

            const renderer2: ConstructableStyleSheetRenderer = new ConstructableStyleSheetRenderer(jss.createStyleSheet({}, { meta: "MyButton2", index: -1002 }));
            renderer2.attach();

            count = document.adoptedStyleSheets.length;

            const renderer3: ConstructableStyleSheetRenderer = new ConstructableStyleSheetRenderer(jss.createStyleSheet({}, { meta: "MyButton1-1", index: -1001 }));
            renderer3.attach();

            count = document.adoptedStyleSheets.length;

            expect(count).toBe(3);

            expect(document.adoptedStyleSheets[0].index).toBe(-1002);
            expect(document.adoptedStyleSheets[1].index).toBe(-1001);
            expect(document.adoptedStyleSheets[2].index).toBe(-1001);

            expect(document.adoptedStyleSheets[0].meta).toBe("MyButton2");
            expect(document.adoptedStyleSheets[1].meta).toBe("MyButton1");
            expect(document.adoptedStyleSheets[2].meta).toBe("MyButton1-1");
        });
    });

    describe("Update Stylesheet", (): void => {
        test("CssRule: get property", (): void => {

            const renderer: ConstructableStyleSheetRenderer = new ConstructableStyleSheetRenderer(jss.createStyleSheet({}, options));
            const sheet: any = new CSSStyleSheet();
            sheet.insertRule("button-1 { color: blue }", 0);
            const value: string = renderer.getPropertyValue(sheet.cssRules[0], "color");

            expect(value).toBe("blue");
        });

        test("CssRule: set property", (): void => {

            const renderer: ConstructableStyleSheetRenderer = new ConstructableStyleSheetRenderer(jss.createStyleSheet({}, options));
            const sheet: any = new CSSStyleSheet();
            sheet.insertRule("button-1 { color: blue }", 0);
            const cssRule: any = sheet.cssRules[0];
            const result: boolean = renderer.setProperty(cssRule, "color", "red");

            expect(result).toBe(true);
            expect(cssRule.style.color).toBe("red");
        });

        test("CssRule: set property by array", (): void => {

            const renderer: ConstructableStyleSheetRenderer = new ConstructableStyleSheetRenderer(jss.createStyleSheet({}, options));

            const sheet: any = new CSSStyleSheet();
            sheet.insertRule("button-1 { color: blue }", 0);

            const cssRule: any = sheet.cssRules[0];
            const result: boolean = renderer.setProperty(cssRule, "padding", ["12px", "10px", "5px", "1px", "!important"]);

            expect(result).toBe(true);
            expect(cssRule.style.padding).toBe("12px, 10px, 5px, 1px");
        });

        test("CssRule: remove property", (): void => {

            const renderer: ConstructableStyleSheetRenderer = new ConstructableStyleSheetRenderer(jss.createStyleSheet({}, options));

            const sheet: any = new CSSStyleSheet();
            sheet.insertRule("button-1 { color: blue }", 0);
            const cssRule: any = sheet.cssRules[0];

            renderer.removeProperty(cssRule, "color");
            const value: string = renderer.getPropertyValue(cssRule, "color");
            expect(value).toBe("");
        });

        test("CssRule: set selector", (): void => {

            const renderer: ConstructableStyleSheetRenderer = new ConstructableStyleSheetRenderer(jss.createStyleSheet({}, options));

            const sheet: any = new CSSStyleSheet();
            sheet.insertRule("button-1 { color: blue }", 0);

            const cssRule: any = sheet.cssRules[0];
            const result: boolean = renderer.setSelector(cssRule, "button-2");

            expect(result).toBe(true);
            expect(cssRule.selectorText).toBe("button-2");
        });

        test("CssRule: get key for CSSStyleRule", (): void => {

            const renderer: ConstructableStyleSheetRenderer = new ConstructableStyleSheetRenderer(jss.createStyleSheet({}, options));

            const sheet: any = new CSSStyleSheet();
            sheet.insertRule("button-1 { color: blue }", 0);

            const key: string = renderer.getKey(sheet.cssRules[0]);
            expect(key).toBe("button-1");
        });

        test("CssRule: get key for CSSKeyframesRule", (): void => {

            const renderer: ConstructableStyleSheetRenderer = new ConstructableStyleSheetRenderer(jss.createStyleSheet({}, options));

            const sheet: any = new CSSStyleSheet();
            sheet.insertRule("@keyframes button-1 { from {top: 0px;} to {top: 200px;} }", 0);

            const key: string = renderer.getKey(sheet.cssRules[0]);
            expect(key).toBe("@keyframes button-1");
        });

        test("Rules: get all rules", (): void => {

            const renderer: ConstructableStyleSheetRenderer = new ConstructableStyleSheetRenderer(jss.createStyleSheet({}, options));
            let allRules: any = renderer.getRules();

            expect(allRules).toBe(undefined);

            const sheet: any = new CSSStyleSheet();
            sheet.insertRule("button-1 { color: blue }", 0);
            renderer.attach(sheet);

            allRules = renderer.getRules();

            expect(allRules.length).toBe(1);
        });

        test("Rules: delete existing rule", (): void => {

            const renderer: ConstructableStyleSheetRenderer = new ConstructableStyleSheetRenderer(jss.createStyleSheet({}, options));
            const sheet: any = new CSSStyleSheet();
            sheet.insertRule("button-1 { color: blue }", 0);
            renderer.attach(sheet);

            const result: boolean = renderer.deleteRule(sheet.cssRules[0]);

            expect(result).toBe(true);
            expect(sheet.cssRules.length).toBe(0);
        });

        test("Rules: delete non existing rule", (): void => {

            const renderer: ConstructableStyleSheetRenderer = new ConstructableStyleSheetRenderer(jss.createStyleSheet({}, options));

            const sheet: any = new CSSStyleSheet();
            sheet.insertRule("button-1 { color: blue }", 0);

            renderer.attach(sheet);

            const sheet2: any = new CSSStyleSheet();
            sheet2.insertRule("button-2 { color: blue }", 0);

            const result: boolean = renderer.deleteRule(sheet2.cssRules[0]);

            expect(result).toBe(false);
            expect(sheet.cssRules.length).toBe(1);
        });

        test("Rules: insert empty rule", (): void => {

            const renderer: ConstructableStyleSheetRenderer = new ConstructableStyleSheetRenderer(jss.createStyleSheet({}, options));
            const sheet: any = new CSSStyleSheet();
            renderer.attach(sheet);

            const rule: any = new MockRule("");
            const result: any = renderer.insertRule(rule);

            expect(result).toBe(false);
            expect(sheet.cssRules.length).toBe(0);
        });

        test("Rules: insert rule", (): void => {

            const renderer: ConstructableStyleSheetRenderer = new ConstructableStyleSheetRenderer(jss.createStyleSheet({}, options));
            const sheet: any = new CSSStyleSheet();
            renderer.attach(sheet);

            const rule: any = new MockRule("button-1 { color: blue }");
            renderer.insertRule(rule);

            expect(sheet.cssRules.length).toBe(1);
        });

        test("Rules: replace rule", (): void => {

            const renderer: ConstructableStyleSheetRenderer = new ConstructableStyleSheetRenderer(jss.createStyleSheet({}, options));
            const sheet: any = new CSSStyleSheet();
            sheet.insertRule("button-1 { color: blue }", 0);
            renderer.attach(sheet);

            expect(sheet.cssRules[0].selectorText).toBe("button-1");

            const rule: any = new MockRule("button-2 { color: red }");
            renderer.replaceRule(sheet.cssRules[0], rule);

            expect(sheet.cssRules[0].selectorText).toBe("button-2");
        });
    });
});

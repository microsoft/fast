import * as MarkdownIt from "markdown-it";
import FASTMarkdownIt from "./index";

const md: any = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    xhtmlOut: true
});

md.use(FASTMarkdownIt);

const newlineRegex: RegExp = /\r\n|\n/g;

describe("Convert markdown to HTML", function(): void {

    test("should convert a link to a hyperlink with a blank target", function(): void {
        const markdown: string = "https://test.com";
        expect(md.render(markdown).replace(newlineRegex, "")).toBe(
            /* tslint:disable-next-line */
            "<Typography tag=\"p\" typeLevel={2}><Hypertext text=\"https://test.com\" href=\"https://test.com\" target=\"_blank\">https://test.com</Hypertext></Typography>"
        );
    });

    test("should convert a (c) to a copywrite symbol", function(): void {
        const markdown: string = "(c)";
        expect(md.render(markdown).replace(newlineRegex, "")).toBe(
            "<Typography tag=\"p\" typeLevel={2}>©</Typography>"
        );
    });

    test("should allow HTML to be in markdown", function(): void {
        const markdown: string = "<a href=\"#\">hello world</a>";
        expect(md.render(markdown).replace(newlineRegex, "")).toBe(
            `<Typography tag=\"p\" typeLevel={2}><a href="#">hello world</a></Typography>`
        );
    });

    test("should convert a markdown link to a FAST MSFT hypertext", function(): void {
        const markdown: string = "[Test](/test)";
        expect(md.render(markdown).replace(newlineRegex, "")).toBe(
            "<Typography tag=\"p\" typeLevel={2}><Hypertext text=\"Test\" href=\"/test\">Test</Hypertext></Typography>"
        );
    });

    test("should convert a markdown unordered bullet list to a list", function(): void {
        const markdown: string = "* list item";
        expect(md.render(markdown).replace(newlineRegex, "")).toBe(
            "<ul><li><Typography tag=\"p\" typeLevel={2}>list item</Typography></li></ul>"
        );
    });

    test("should convert a markdown ordered list to a list", function(): void {
        const markdown: string = "1. list item";
        expect(md.render(markdown).replace(newlineRegex, "")).toBe(
            "<ol><li><Typography tag=\"p\" typeLevel={2}>list item</Typography></li></ol>"
        );
    });

    test("should convert a markdown heading to a FAST MSFT heading", function(): void {
        const markdown: string = "# Hello world";
        expect(md.render(markdown).replace(newlineRegex, "")).toBe(
            "<Heading id=\"hello-world\" tag=\"h1\" typeLevel={3}>Hello world</Heading>"
        );
    });

    test("should convert any code snippets into a PrismCode react component", function(): void {
        const markdown: string = "```\n{}\n```";
        expect(md.render(markdown).replace(newlineRegex, "")).toBe(
            `<pre><code>{\"{}\\n\"}</code></pre>`
        );
    });

    test("should convert any code snippets with a language specified into a PrismCode react component", function(): void {
        const markdown: string = "```jsx\n{}\n```";
        expect(md.render(markdown).replace(newlineRegex, "")).toBe(
            `<pre className="language-jsx"><code>{\"{}\\n\"}</code></pre>`
        );
    });

    test("should convert any inline text with {, }, < and > into their HTML codes", function(): void {
        const markdown: string = "some text with { and } and < and >";
        expect(md.render(markdown).replace(newlineRegex, "")).toBe(
            `<Typography tag=\"p\" typeLevel={2}>some text with &#123; and &#125; and &#60; and &#62;</Typography>`
        );
    });

    test("should convert dividers", function(): void {
        const markdown: string = "---";
        expect(md.render(markdown).replace(newlineRegex, "")).toBe(
            "<Divider />"
        );
    });
});

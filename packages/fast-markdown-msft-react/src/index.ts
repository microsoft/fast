import CreateRule from "./rule";
import { MarkdownIt } from "markdown-it";
import { TypeLevel } from "@microsoft/fast-components-react-base";
import { HeadingLevel, HeadingTag } from "@microsoft/fast-components-react-msft";

enum ComponentType {
    heading = "heading",
    hyperlink = "hyperlink",
    list = "list",
    paragraph = "paragraph"
}

export interface ITokens<T> extends Array<T> {
    [idx: number]: T;
}

export interface IToken {
    children: ITokens<IToken>;
    tag: string;
    content: string;
    info: string;
    type: string;
    attrs: string[][];
    attrPush: (attributes: string[]) => void;
}

class FastMarkdownIt {
    constructor(md: MarkdownIt) {
        md.core.ruler.push("fast", (new CreateRule(md) as any));
        md.renderer.rules.paragraph_open = function(): string {
            return `<Typography typeLevel={${TypeLevel._7}}>`;
        };
        md.renderer.rules.heading_open = function(tokens: ITokens<IToken>, idx: number): string {
            const id: string = tokens[idx + 1].children[0].content.toLowerCase().replace(/\s/g, "-").replace(/[^a-z\-]/g, "");
            /*tslint:disable-next-line */
            return `<Heading id="${id}" tag="${HeadingTag[(tokens[idx].tag)]}" level={${HeadingLevel["_" + (parseInt(tokens[idx].tag.charAt(1), 10) + 2).toString()]}}>`;
        };
        md.renderer.rules.text = (tokens: ITokens<IToken>, idx: number): string => {
            return this.replaceSpecialCharacters(tokens[idx].content);
        };
        md.renderer.rules.fence = function(tokens: ITokens<IToken>, idx: number): string {
            let codeSnippet: string = `<pre${tokens[idx].info ? ` className="language-${tokens[idx].info}"` : ""}><code>`;
            codeSnippet += `{${JSON.stringify(tokens[idx].content, null, 2)}}`;
            codeSnippet += `</code></pre>`;

            return codeSnippet;
        };
    }

    /**
     * Due to special characters such as {, }, < and > being interpreted by React
     * as meaningful characters, these are replaced with the HTML code versions
     */
    private replaceSpecialCharacters = (content: string): string => {
        return content.replace(/{/g, "&#123;").replace(/}/g, "&#125;").replace(/</g, "&#60;").replace(/>/g, "&#62;");
    }
}

function plugin(md: MarkdownIt): void {
    const fastMarkdownIt: FastMarkdownIt = new FastMarkdownIt(md);
}

export default plugin;

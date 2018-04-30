import CreateRule from "./rule";
import { MarkdownIt } from "markdown-it";

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
            return `<Typography tag="p" typeLevel={2}>`;
        };
        md.renderer.rules.heading_open = function(tokens: ITokens<IToken>, idx: number): string {
            const id: string = tokens[idx + 1].children[0].content.toLowerCase().replace(/\s/g, "-").replace(/[^a-z\-]/g, "");
            return `<Heading id="${id}" tag="${tokens[idx].tag}" typeLevel={${parseInt(tokens[idx].tag.charAt(1), 10) + 2}}>`;
        };
        md.renderer.rules.text = (tokens: ITokens<IToken>, idx: number): string => {
            return this.replaceSpecialCharacters(tokens[idx].content);
        };
        md.renderer.rules.fence = function(tokens: ITokens<IToken>, idx: number): string {
            let codeSnippet: string = `<PrismCode${tokens[idx].info ? ` className="language-${tokens[idx].info}"` : ""}>`;
            codeSnippet += `{${JSON.stringify(tokens[idx].content, null, 2)}}`;
            codeSnippet += `</PrismCode>`;

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

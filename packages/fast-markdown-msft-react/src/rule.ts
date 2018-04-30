import {
    IToken,
    ITokens
} from "./index";
import { MarkdownIt } from "markdown-it";

export interface IState {
    tokens: IToken[];
    Token: (type: string, tag?: string, idx?: number) => void;
}

export default class CreateRule {

    constructor(md: MarkdownIt) {
        return (this.replace as any);
    }

    public replace = (state: IState): void => {
        this.renderComponents(state);
    }

    /**
     * Renders custom JSX components in place of HTML
     * generated from the markdown-it package
     */
    private renderComponents = (state: IState): void => {

        for (let i: number = 0, tokenLength: number = state.tokens.length; i < tokenLength; i++) {

            if (state.tokens[i].children) {
                this.renderComponents({Token: state.Token, tokens: state.tokens[i].children});
            }

            switch (state.tokens[i].type) {
                case "link_open":
                    const linkToken: IToken = new state.Token(state.tokens[i].type, "Hypertext", 1);

                    linkToken.attrPush(["text", state.tokens[i + 1].content || ""]);
                    linkToken.attrPush(["href", state.tokens[i].attrs[0][1]]);

                    if (state.tokens[i].attrs[0][1].substr(0, 4) === "http") {
                        linkToken.attrPush(["target", "_blank"]);
                    }

                    state.tokens[i] = linkToken;
                    break;
                case "link_close":
                    state.tokens[i] = new state.Token(state.tokens[i].type, "Hypertext", -1);
                    break;
                case "paragraph_close":
                    state.tokens[i] = new state.Token(state.tokens[i].type, "Typography", -1);
                    break;
                case "heading_close":
                    state.tokens[i] = new state.Token(state.tokens[i].type, "Heading", -1);
                    break;
                case "hr":
                    state.tokens[i] = new state.Token(state.tokens[i].type, "Divider", 0);
                    break;
            }
        }
    }
}

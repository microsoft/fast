import {
    css,
    customElement,
    FASTElement,
    html,
    observable,
    repeat,
    when,
} from "@microsoft/fast-element";
import SubtractIcon from "../../assets/subtract.svg";
import { UIDesignTokenValue } from "../../ui-controller";
import { DesignTokenField } from "../design-token-field";

DesignTokenField;

const template = html<DesignTokensForm>`
    <ul>
        ${repeat(
            x => x.designTokens,
            html<UIDesignTokenValue, DesignTokensForm>`
                <li>
                    <td-design-token-field
                        :designToken=${x => x.definition}
                        :value=${x => x.value}
                        @change="${(x, c) =>
                            c.parent.changeHandler(x, c.event as CustomEvent)}"
                    ></td-design-token-field>
                    <plugin-button
                        appearance="stealth"
                        aria-label="Remove design token"
                        title="Remove design token"
                        @click="${(x, c) => c.parent.detachHandler(x)}"
                    >
                        ${SubtractIcon}
                    </plugin-button>
                    ${when(
                        x => x.multipleValues,
                        html<UIDesignTokenValue>`
                            <span class="values">${x => x.multipleValues}</span>
                        `
                    )}
                </li>
            `
        )}
    </ul>
`;

const styles = css`
    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: flex;
        justify-content: space-between;
        padding: 4px 0;
        gap: 8px;
    }
`;

@customElement({
    name: "td-design-tokens-form",
    template,
    styles,
})
export class DesignTokensForm extends FASTElement {
    @observable
    designTokens: UIDesignTokenValue[] = [];

    changeHandler(token: UIDesignTokenValue, e: CustomEvent) {
        token.value = e.detail;
        this.$emit("tokenChange", token);
    }

    detachHandler(token: UIDesignTokenValue) {
        // Remove the item from the list
        let detachIndex: number = -1;
        this.designTokens.find((curToken, index) => {
            detachIndex = index;
            return curToken === token;
        });
        this.designTokens.splice(detachIndex, 1);

        this.$emit("detach", token.definition);
    }
}

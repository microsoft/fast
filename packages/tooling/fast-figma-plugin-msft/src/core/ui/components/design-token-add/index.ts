import {
    css,
    customElement,
    ExecutionContext,
    FASTElement,
    html,
    observable,
    ref,
    repeat,
    when,
} from "@microsoft/fast-element";
import CheckmarkIcon from "../../assets/checkmark.svg";
import { DesignTokenDefinition } from "../../design-token-registry";
import { DesignTokenField } from "../design-token-field";

DesignTokenField;

const template = html<DesignTokenAdd>`
    <select @change="${(x, c) => x.selectHandler(c)}">
        <option disabled selected>Add design token override...</option>
        ${repeat(
            x => x.designTokens,
            html<DesignTokenDefinition, DesignTokenAdd>`
                <option value="${x => x.id}">
                    ${x => x.name} (${x => x.groupTitle})
                </option>
            `
        )}
    </select>
    ${when(
        x => x.selectedDesignToken,
        html<DesignTokenAdd>`
            <div class="add-form">
                <td-design-token-field
                    :designToken=${x => x.selectedDesignToken}
                    ${ref("field")}
                ></td-design-token-field>
                <plugin-button
                    appearance="stealth"
                    aria-label="Add"
                    title="Add"
                    @click="${(x, c) => x.addHandler()}"
                >
                    ${CheckmarkIcon}
                </plugin-button>
            </div>
        `
    )}
`;

const styles = css`
    select {
        height: 32px;
        width: 100%;
    }

    .add-form {
        display: flex;
        gap: 8px;
        padding: 4px 0;
    }
`;

@customElement({
    name: "td-design-token-add",
    template,
    styles,
})
export class DesignTokenAdd extends FASTElement {
    @observable
    designTokens: DesignTokenDefinition<any>[] = [];

    @observable
    selectedDesignToken?: DesignTokenDefinition;

    field: DesignTokenField;

    selectHandler(c: ExecutionContext) {
        const selectedTokenId = (c.event.target as HTMLSelectElement).value;

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.selectedDesignToken = this.designTokens.find(
            token => token.id === selectedTokenId
        )!;
    }

    addHandler() {
        this.$emit("add", {
            definition: this.selectedDesignToken,
            value: this.field.value,
        });

        this.selectedDesignToken = undefined;
    }
}

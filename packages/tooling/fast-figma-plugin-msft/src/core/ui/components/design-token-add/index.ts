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
        <option selected value="-">Add design token override...</option>
        ${repeat(
            x => x.designTokens,
            html<DesignTokenDefinition, DesignTokenAdd>`
                <option value="${x => x.id}">
                    ${x => x.name} (${x => x.groupTitle})
                </option>
            `
        )}
    </select>
    <div class="add-form" ?hidden="${x => !x.selectedDesignToken}">
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
    ${when(
        x => x.showMessageTemporary,
        html<DesignTokenAdd>`
            <p>
                Design token added. Please select another layer then come back to this to
                modify.
            </p>
            <p>This will be fixed asap.</p>
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

    .add-form[hidden] {
        display: none;
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

    selectedDesignTokenIndex: number;

    field: DesignTokenField;

    @observable
    showMessageTemporary: boolean;

    designTokensChanged() {
        this.showMessageTemporary = false;
    }

    selectHandler(c: ExecutionContext) {
        const selectedTokenId = (c.event.target as HTMLSelectElement).value;

        if (selectedTokenId !== "-") {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.selectedDesignToken = this.designTokens.find((token, index) => {
                this.selectedDesignTokenIndex = index;
                return token.id === selectedTokenId;
            })!;
            if (this.field) {
                this.field.value = undefined;
            }
        }
    }

    addHandler() {
        if (this.field.value) {
            // Remove the item from the list
            this.designTokens.splice(this.selectedDesignTokenIndex, 1);

            this.$emit("add", {
                definition: this.selectedDesignToken,
                value: this.field.value,
            });

            this.field.value = undefined;
            this.selectedDesignToken = undefined;

            // Hack until rebuilt in web components to show a message to refresh selection.
            this.showMessageTemporary = true;
        }
    }
}

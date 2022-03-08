import { StandardLuminance } from "@fluentui/web-components";
import { ColorRGBA64, parseColorHexRGB } from "@microsoft/fast-colors";
import {
    css,
    customElement,
    ExecutionContext,
    FASTElement,
    html,
    observable,
} from "@microsoft/fast-element";
import { DesignTokenDefinition, FormControlId } from "../../design-token-registry";

const defaultTokenTemplate = html<DesignTokenField>`
    <input
        value="${x => x.value}"
        @change="${(x, c) => {
            x.updateValue((c.event.target as HTMLInputElement).value);
        }}"
    />
`;

const colorInputChangeHandler = (x: DesignTokenField, c: ExecutionContext) => {
    const hex: string = (c.event.target as HTMLInputElement).value;
    const parsed = parseColorHexRGB(hex);
    if (parsed instanceof ColorRGBA64) {
        x.updateValue(hex);
    }
};

const tokenTemplatesByType = {
    color: html<DesignTokenField>`
        <input
            type="color"
            id="${x => x.designToken?.id}"
            value="${x => x.value}"
            @change="${colorInputChangeHandler}"
        />
        <input
            type="text"
            id="${x => x.designToken?.id}Hex"
            class="hex"
            value="${x => x.value}"
            @change="${colorInputChangeHandler}"
        />
    `,
    luminance: html<DesignTokenField>`
        <select
            @change="${(x, c) => {
                x.updateValue((c.event.target as HTMLSelectElement).value);
            }}"
        >
            <option></option>
            <option
                value="${StandardLuminance.LightMode}"
                ?selected="${x =>
                    Number.parseFloat(x.value) === StandardLuminance.LightMode}"
            >
                Light mode
            </option>
            <option
                value="${StandardLuminance.DarkMode}"
                ?selected="${x =>
                    Number.parseFloat(x.value) === StandardLuminance.DarkMode}"
            >
                Dark mode
            </option>
        </select>
    `,
};

const template = html<DesignTokenField>`
    <label>
        <span>${x => x.designToken?.name}</span>
        ${x => x.selectTemplate()}
    </label>
`;

const styles = css`
    :host {
        display: flex;
        flex-grow: 1;
    }

    label {
        display: inline-flex;
        align-items: center;
        flex-grow: 1;
        gap: 8px;
    }

    span {
        flex-grow: 1;
    }

    input,
    select {
        height: 32px;
    }

    select {
        width: 120px;
    }

    input.hex {
        width: 80px;
    }
`;

@customElement({
    name: "td-design-token-field",
    template,
    styles,
})
export class DesignTokenField extends FASTElement {
    @observable
    designToken?: DesignTokenDefinition;

    @observable
    value?: any;

    updateValue(value: any) {
        this.value = value;
        this.$emit("change", this.value);
    }

    selectTemplate() {
        if (this.designToken) {
            if (this.designToken.formControlId === FormControlId.color) {
                return tokenTemplatesByType["color"];
            } else if (this.designToken.id === "baseLayerLuminance") {
                return tokenTemplatesByType["luminance"];
            }
        }
        return defaultTokenTemplate;
    }
}

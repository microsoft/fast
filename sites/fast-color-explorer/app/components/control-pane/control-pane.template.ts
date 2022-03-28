import { Checkbox, RadioGroup, Select } from "@microsoft/fast-components";
import { ColorPicker } from "@microsoft/fast-tooling/dist/dts/web-components/color-picker/color-picker";
import { html, repeat } from "@microsoft/fast-element";
import { ComponentTypes, DesignSystem } from "../../app";
import { ControlPane } from "./control-pane";

function titleCase(str: string): string {
    return str
        .split("")
        .reduce((accumulated: string, value: string, index: number): string => {
            return accumulated.concat(index === 0 ? value.toUpperCase() : value);
        }, "");
}

export const controlPaneTemplate = html<ControlPane>`
    <template>
        <p class="title">Settings</p>
        <fast-select
            name="designSystem"
            @change="${(x, c) => {
                x.updateFormValue("designSystem", (c.event.target as Select).value);
            }}"
        >
            ${repeat(
                x => Object.keys(DesignSystem),
                html<string>`
                    <fast-option
                        value="${x => x}"
                        ?checked="${(x, c) => c.parent.designSystem === x}"
                    >
                        ${x => DesignSystem[x]}
                    </fast-radio>
                `
            )}
        </fast-select>
        <fast-radio-group
            name="componentType"
            orientation="vertical"
            @change="${(x, c) => {
                x.updateFormValue("componentType", (c.event.target as RadioGroup).value);
            }}"
        >
            <label slot="label">Component type</label>
            ${repeat(
                x => Object.keys(ComponentTypes),
                html<string>`
                    <fast-radio
                        value="${x => x}"
                        ?checked="${(x, c) => c.parent.componentType === x}"
                    >
                        ${x => titleCase(x)}
                    </fast-radio>
                `
            )}
        </fast-radio-group>
        <div>
            <label>Neutral base color</label>
            <fast-tooling-color-picker
                value="${x => x.neutralColor}"
                @change="${(x, c) => {
                    x.updateFormValue(
                        "neutralColor",
                        (c.event.target as ColorPicker).value
                    );
                }}"
            ></fast-tooling-color-picker>
        </div>
        <fast-checkbox
            checked="${x => x.showOnlyLayerBackgrounds}"
            @change="${(x, c) => {
                x.updateFormValue(
                    "showOnlyLayerBackgrounds",
                    (c.event.target as Checkbox).checked
                );
            }}"
        >
            Show layer backgrounds only
        </fast-checkbox>
        <div>
            <label>Accent base color</label>
            <fast-tooling-color-picker
                value="${x => x.accentColor}"
                @change="${(x, c) => {
                    x.updateFormValue(
                        "accentColor",
                        (c.event.target as ColorPicker).value
                    );
                }}"
            ></fast-tooling-color-picker>
        </div>
    </template>
`;

import { ElementViewTemplate, html, repeat } from "@microsoft/fast-element";
import { ComponentType } from "../../component-type.js";
import { ControlPane } from "./control-pane.js";

function titleCase(str: string): string {
    return str
        .split("")
        .reduce((accumulated: string, value: string, index: number): string => {
            return accumulated.concat(index === 0 ? value.toUpperCase() : value);
        }, "");
}

export function controlPaneTemplate<T extends ControlPane>(): ElementViewTemplate<T> {
    return html<T>`
        <p class="title">Settings</p>
        <div class="radio-group">
            <label>Component type</label>
            ${repeat(
                x => Object.keys(ComponentType),
                html<string, T>`
                    <label>
                        <input
                            type="radio"
                            name="componentType"
                            value="${x => x}"
                            ?checked="${(x, c) => c.parent.componentType === x}"
                            @change="${(x, c) => {
                                c.parent.updateFormValue(
                                    "componentType",
                                    c.eventTarget<HTMLInputElement>().value
                                );
                            }}"
                        />
                        <span>${x => titleCase(x)}</span>
                    </label>
                `
            )}
        </div>
        <div>
            <label>Neutral base color</label>
            <input
                type="color"
                value="${x => x.neutralColor}"
                @change="${(x, c) => {
                    x.updateFormValue(
                        "neutralColor",
                        c.eventTarget<HTMLInputElement>().value
                    );
                }}"
            />
        </div>
        <label>
            <input
                type="checkbox"
                checked="${x => x.showOnlyLayerBackgrounds}"
                @change="${(x, c) => {
                    x.updateFormValue(
                        "showOnlyLayerBackgrounds",
                        c.eventTarget<HTMLInputElement>().checked
                    );
                }}"
            />
            <span>Show layer backgrounds only</span>
        </label>
        <div>
            <label>Accent base color</label>
            <input
                type="color"
                value="${x => x.accentColor}"
                @change="${(x, c) => {
                    x.updateFormValue(
                        "accentColor",
                        c.eventTarget<HTMLInputElement>().value
                    );
                }}"
            />
        </div>
    `;
}

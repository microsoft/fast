import { parseColorHexRGB } from "@microsoft/fast-colors";
import {
    attr,
    css,
    customElement,
    DOM,
    FASTElement,
    html,
    Updates,
    ViewTemplate,
    when,
} from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import {
    accentFillActive,
    accentFillFocus,
    accentFillHover,
    accentFillRest,
    accentForegroundActive,
    accentForegroundFocus,
    accentForegroundHover,
    accentForegroundRest,
    fillColor,
    focusStrokeInner,
    focusStrokeOuter,
    foregroundOnAccentActive,
    foregroundOnAccentFocus,
    foregroundOnAccentHover,
    foregroundOnAccentRest,
    neutralFillActive,
    neutralFillFocus,
    neutralFillHover,
    neutralFillInputActive,
    neutralFillInputFocus,
    neutralFillInputHover,
    neutralFillInputRest,
    neutralFillRest,
    neutralFillStealthActive,
    neutralFillStealthFocus,
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralFillStrongActive,
    neutralFillStrongHover,
    neutralFillStrongRest,
    neutralForegroundActive,
    neutralForegroundFocus,
    neutralForegroundHint,
    neutralForegroundHover,
    neutralForegroundRest,
    neutralStrokeActive,
    neutralStrokeDividerRest,
    neutralStrokeFocus,
    neutralStrokeHover,
    neutralStrokeRest,
    neutralStrokeStrongActive,
    neutralStrokeStrongFocus,
    neutralStrokeStrongHover,
    neutralStrokeStrongRest,
    SwatchRGB,
} from "@microsoft/adaptive-ui";
import { ComponentType } from "../component-type.js";
import "./adaptive-component.js";
import "./swatch.js";

const backplateComponents = html<ColorBlock>`
    <template>
        <div class="example">
            <app-adaptive-component
                :fillRest="${x => accentFillRest}"
                :fillHover="${x => accentFillHover}"
                :fillActive="${x => accentFillActive}"
                :fillFocus="${x => accentFillFocus}"
                :foregroundRest="${x => foregroundOnAccentRest}"
                :foregroundHover="${x => foregroundOnAccentHover}"
                :foregroundActive="${x => foregroundOnAccentActive}"
                :foregroundFocus="${x => foregroundOnAccentFocus}"
            >
                Accent button
            </app-adaptive-component>
        </div>
        <app-swatch
            type="fill"
            recipe-name="accentFillRest"
            :fillRecipe="${x => accentFillRest}"
            :foregroundRecipe="${x => foregroundOnAccentRest}"
        ></app-swatch>
        <app-swatch
            type="fill"
            recipe-name="accentFillHover"
            :fillRecipe="${x => accentFillHover}"
            :foregroundRecipe="${x => foregroundOnAccentRest}"
        ></app-swatch>
        <app-swatch
            type="fill"
            recipe-name="accentFillActive"
            :fillRecipe="${x => accentFillActive}"
            :foregroundRecipe="${x => foregroundOnAccentRest}"
        ></app-swatch>
        <app-swatch
            type="foreground"
            recipe-name="foregroundOnAccent"
            :fillRecipe="${x => accentFillRest}"
            :foregroundRecipe="${x => foregroundOnAccentRest}"
        ></app-swatch>
        <app-swatch
            type="outline"
            recipe-name="focusStrokeInner"
            :fillRecipe="${x => focusStrokeOuter}"
            :foregroundRecipe="${x => focusStrokeInner}"
            :outlineRecipe="${x => focusStrokeInner}"
        ></app-swatch>
        <app-swatch
            type="outline"
            recipe-name="focusStrokeOuter"
            :fillRecipe="${x => fillColor}"
            :foregroundRecipe="${x => focusStrokeOuter}"
            :outlineRecipe="${x => focusStrokeOuter}"
        ></app-swatch>

        <div class="example">
            <app-adaptive-component
                :fillRest="${x => neutralFillRest}"
                :fillHover="${x => neutralFillHover}"
                :fillActive="${x => neutralFillActive}"
                :fillFocus="${x => neutralFillFocus}"
                :foregroundRest="${x => neutralForegroundRest}"
            >
                Neutral button
            </app-adaptive-component>
        </div>
        <app-swatch
            type="fill"
            recipe-name="neutralFillRest"
            :foregroundRecipe="${x => neutralForegroundRest}"
            :fillRecipe="${x => neutralFillRest}"
        ></app-swatch>
        <app-swatch
            type="fill"
            recipe-name="neutralFillHover"
            :foregroundRecipe="${x => neutralForegroundRest}"
            :fillRecipe="${x => neutralFillHover}"
        ></app-swatch>
        <app-swatch
            type="fill"
            recipe-name="neutralFillActive"
            :foregroundRecipe="${x => neutralForegroundRest}"
            :fillRecipe="${x => neutralFillActive}"
        ></app-swatch>
        <app-swatch
            type="foreground"
            recipe-name="neutralForegroundRest"
            :fillRecipe="${x => fillColor}"
            :foregroundRecipe="${x => neutralForegroundRest}"
        ></app-swatch>
        <app-swatch
            type="outline"
            recipe-name="focusStrokeOuter"
            :fillRecipe="${x => fillColor}"
            :foregroundRecipe="${x => focusStrokeOuter}"
            :outlineRecipe="${x => focusStrokeOuter}"
        ></app-swatch>

        <div class="example">
            <app-adaptive-component
                :fillRest="${x => fillColor}"
                :strokeRest="${x => neutralStrokeRest}"
                :strokeHover="${x => neutralStrokeHover}"
                :strokeActive="${x => neutralStrokeActive}"
                :strokeFocus="${x => neutralStrokeFocus}"
                :foregroundRest="${x => neutralForegroundRest}"
            >
                Outline button
            </app-adaptive-component>
        </div>
        <app-swatch
            type="outline"
            recipe-name="neutralStrokeRest"
            :foregroundRecipe="${x => neutralForegroundRest}"
            :fillRecipe="${x => fillColor}"
            :outlineRecipe="${x => neutralStrokeRest}"
        ></app-swatch>
        <app-swatch
            type="outline"
            recipe-name="neutralStrokeHover"
            :foregroundRecipe="${x => neutralForegroundRest}"
            :fillRecipe="${x => fillColor}"
            :outlineRecipe="${x => neutralStrokeHover}"
        ></app-swatch>
        <app-swatch
            type="outline"
            recipe-name="neutralStrokeActive"
            :foregroundRecipe="${x => neutralForegroundRest}"
            :fillRecipe="${x => fillColor}"
            :outlineRecipe="${x => neutralStrokeActive}"
        ></app-swatch>
        <app-swatch
            type="foreground"
            recipe-name="neutralForegroundRest"
            :fillRecipe="${x => fillColor}"
            :foregroundRecipe="${x => neutralForegroundRest}"
        ></app-swatch>
        <app-swatch
            type="outline"
            recipe-name="focusStrokeOuter"
            :fillRecipe="${x => fillColor}"
            :foregroundRecipe="${x => focusStrokeOuter}"
            :outlineRecipe="${x => focusStrokeOuter}"
        ></app-swatch>

        <div class="example">
            <app-adaptive-component
                :fillRest="${x => neutralFillStealthRest}"
                :fillHover="${x => neutralFillStealthHover}"
                :fillActive="${x => neutralFillStealthActive}"
                :fillFocus="${x => neutralFillStealthFocus}"
                :foregroundRest="${x => neutralForegroundRest}"
            >
                Stealth button
            </app-adaptive-component>
        </div>
        <app-swatch
            type="fill"
            recipe-name="neutralFillStealthRest"
            :foregroundRecipe="${x => neutralForegroundRest}"
            :fillRecipe="${x => neutralFillStealthRest}"
        ></app-swatch>
        <app-swatch
            type="fill"
            recipe-name="neutralFillStealthHover"
            :foregroundRecipe="${x => neutralForegroundRest}"
            :fillRecipe="${x => neutralFillStealthHover}"
        ></app-swatch>
        <app-swatch
            type="fill"
            recipe-name="neutralFillStealthActive"
            :foregroundRecipe="${x => neutralForegroundRest}"
            :fillRecipe="${x => neutralFillStealthActive}"
        ></app-swatch>
        <app-swatch
            type="foreground"
            recipe-name="neutralForegroundRest"
            :fillRecipe="${x => fillColor}"
            :foregroundRecipe="${x => neutralForegroundRest}"
        ></app-swatch>
        <app-swatch
            type="outline"
            recipe-name="focusStrokeOuter"
            :fillRecipe="${x => fillColor}"
            :foregroundRecipe="${x => focusStrokeOuter}"
            :outlineRecipe="${x => focusStrokeOuter}"
        ></app-swatch>
    </template>
`;

const textComponents = html<ColorBlock>`
    <template>
        <div class="example">
            <app-adaptive-component
                :foregroundRest="${x => neutralForegroundRest}"
                :foregroundHover="${x => neutralForegroundHover}"
                :foregroundActive="${x => neutralForegroundActive}"
                :foregroundFocus="${x => neutralForegroundFocus}"
            >
                Neutral
            </app-adaptive-component>
        </div>
        <app-swatch
            type="foreground"
            recipe-name="neutralForegroundRest"
            :fillRecipe="${x => fillColor}"
            :foregroundRecipe="${x => neutralForegroundRest}"
        ></app-swatch>
        <app-swatch
            type="foreground"
            recipe-name="neutralForegroundHover"
            :fillRecipe="${x => fillColor}"
            :foregroundRecipe="${x => neutralForegroundHover}"
        ></app-swatch>
        <app-swatch
            type="foreground"
            recipe-name="neutralForegroundActive"
            :fillRecipe="${x => fillColor}"
            :foregroundRecipe="${x => neutralForegroundActive}"
        ></app-swatch>

        <div class="example">
            <app-adaptive-component :foregroundRest="${x => neutralForegroundHint}">
                Hint
            </app-adaptive-component>
        </div>
        <app-swatch
            type="foreground"
            recipe-name="neutralForegroundHint"
            :fillRecipe="${x => fillColor}"
            :foregroundRecipe="${x => neutralForegroundHint}"
        ></app-swatch>

        <div class="example">
            <app-adaptive-component
                :foregroundRest="${x => accentForegroundRest}"
                :foregroundHover="${x => accentForegroundHover}"
                :foregroundActive="${x => accentForegroundActive}"
                :foregroundFocus="${x => accentForegroundFocus}"
            >
                Accent
            </app-adaptive-component>
        </div>
        <app-swatch
            type="foreground"
            recipe-name="accentForegroundRest"
            :fillRecipe="${x => fillColor}"
            :foregroundRecipe="${x => accentForegroundRest}"
        ></app-swatch>
        <app-swatch
            type="foreground"
            recipe-name="accentForegroundHover"
            :fillRecipe="${x => fillColor}"
            :foregroundRecipe="${x => accentForegroundHover}"
        ></app-swatch>
        <app-swatch
            type="foreground"
            recipe-name="accentForegroundActive"
            :fillRecipe="${x => fillColor}"
            :foregroundRecipe="${x => accentForegroundActive}"
        ></app-swatch>
        <app-swatch
            type="outline"
            recipe-name="focusStrokeOuter"
            :fillRecipe="${x => fillColor}"
            :foregroundRecipe="${x => focusStrokeOuter}"
            :outlineRecipe="${x => focusStrokeOuter}"
        ></app-swatch>
    </template>
`;

const formComponents = html<ColorBlock>`
    <template>
        <div class="example">
            <app-adaptive-component
                :fillRest="${x => neutralFillInputRest}"
                :fillHover="${x => neutralFillInputHover}"
                :fillActive="${x => neutralFillInputActive}"
                :fillFocus="${x => neutralFillInputFocus}"
                :foregroundRest="${x => neutralForegroundRest}"
                :strokeRest="${x => neutralStrokeRest}"
                :strokeHover="${x => neutralStrokeHover}"
                :strokeActive="${x => neutralStrokeActive}"
                :strokeFocus="${x => neutralStrokeFocus}"
            >
                Text field
            </app-adaptive-component>
        </div>
        <app-swatch
            type="fill"
            recipe-name="neutralFillInputRest"
            :fillRecipe="${x => neutralFillInputRest}"
            :foregroundRecipe="${x => neutralForegroundRest}"
        ></app-swatch>
        <app-swatch
            type="foreground"
            recipe-name="neutralForegroundHint"
            :fillRecipe="${x => neutralFillInputRest}"
            :foregroundRecipe="${x => neutralForegroundHint}"
        ></app-swatch>
        <app-swatch
            type="foreground"
            recipe-name="neutralForegroundRest"
            :fillRecipe="${x => neutralFillInputRest}"
            :foregroundRecipe="${x => neutralForegroundRest}"
        ></app-swatch>
        <app-swatch
            type="outline"
            recipe-name="neutralStrokeRest"
            :fillRecipe="${x => fillColor}"
            :foregroundRecipe="${x => neutralForegroundRest}"
            :outlineRecipe="${x => neutralStrokeRest}"
        ></app-swatch>
        <app-swatch
            type="outline"
            recipe-name="neutralStrokeHover"
            :fillRecipe="${x => fillColor}"
            :foregroundRecipe="${x => neutralForegroundRest}"
            :outlineRecipe="${x => neutralStrokeHover}"
        ></app-swatch>
        <app-swatch
            type="outline"
            recipe-name="focusStrokeOuter"
            :fillRecipe="${x => fillColor}"
            :foregroundRecipe="${x => focusStrokeOuter}"
            :outlineRecipe="${x => focusStrokeOuter}"
        ></app-swatch>

        <div class="example">
            <app-adaptive-component
                :fillRest="${x => neutralFillInputRest}"
                :fillHover="${x => neutralFillInputHover}"
                :fillActive="${x => neutralFillInputActive}"
                :fillFocus="${x => neutralFillInputFocus}"
                :foregroundRest="${x => neutralForegroundRest}"
                :strokeRest="${x => neutralStrokeStrongRest}"
                :strokeHover="${x => neutralStrokeStrongHover}"
                :strokeActive="${x => neutralStrokeStrongActive}"
                :strokeFocus="${x => neutralStrokeStrongFocus}"
            >
                Checkbox
            </app-adaptive-component>
        </div>
        <app-swatch
            type="fill"
            recipe-name="neutralFillInputRest"
            :fillRecipe="${x => neutralFillInputRest}"
            :foregroundRecipe="${x => neutralForegroundRest}"
        ></app-swatch>
        <app-swatch
            type="fill"
            recipe-name="neutralFillStrongRest"
            :fillRecipe="${x => neutralFillStrongRest}"
            :foregroundRecipe="${x => neutralForegroundRest}"
        ></app-swatch>
        <app-swatch
            type="fill"
            recipe-name="neutralFillStrongHover"
            :fillRecipe="${x => neutralFillStrongHover}"
            :foregroundRecipe="${x => neutralForegroundRest}"
        ></app-swatch>
        <app-swatch
            type="fill"
            recipe-name="neutralFillStrongActive"
            :fillRecipe="${x => neutralFillStrongActive}"
            :foregroundRecipe="${x => neutralForegroundRest}"
        ></app-swatch>
        <app-swatch
            type="foreground"
            recipe-name="neutralForegroundRest"
            :fillRecipe="${x => neutralFillInputRest}"
            :foregroundRecipe="${x => neutralForegroundRest}"
        ></app-swatch>
        <app-swatch
            type="outline"
            recipe-name="focusStrokeOuter"
            :fillRecipe="${x => fillColor}"
            :foregroundRecipe="${x => focusStrokeOuter}"
            :outlineRecipe="${x => focusStrokeOuter}"
        ></app-swatch>

        <div class="example">
            <app-adaptive-component :strokeRest="${x => neutralStrokeDividerRest}">
                Divider
            </app-adaptive-component>
        </div>
        <app-swatch
            type="outline"
            recipe-name="neutralStrokeDividerRest"
            :fillRecipe="${x => fillColor}"
            :foregroundRecipe="${x => neutralForegroundRest}"
            :outlineRecipe="${x => neutralStrokeDividerRest}"
        ></app-swatch>
    </template>
`;

const template = html<ColorBlock>`
    <p class="title">
        SWATCH ${x => x.index} - ${x => x.color.toUpperCase()}
        ${when(
            x => x.layerName,
            html`
                <p>
                    <code>Layer: ${x => x.layerName}</code>
                </p>
            `
        )}
    </p>

    <div class="content">${x => x.componentTypeTemplate()}</div>
`;

const styles = css`
    ${display("flex")} :host {
        flex-direction: column;
        flex-grow: 1;
        align-items: stretch;
        text-align: center;
        position: relative;
        transition: opacity 0.1s linear;
        height: 100%;
        min-height: 100%;
        background-color: ${fillColor};
        color: ${neutralForegroundRest};
    }

    .title {
        margin: 16px auto 4px;
        font-weight: 600;
        height: 34px;
        color: ${neutralForegroundHint};
    }

    .title code {
        font-weight: normal;
    }

    .content {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 48px 36px;
    }

    .example {
        height: 60px;
        display: flex;
        align-items: center;
        margin-top: 24px;
    }

    .divider {
        width: 150px;
    }
`;

@customElement({
    name: "app-color-block",
    template,
    styles,
})
export class ColorBlock extends FASTElement {
    @attr index: number;

    @attr component: ComponentType;

    @attr color: string;
    private colorChanged(): void {
        Updates.enqueue(() => this.updateColor());
    }

    @attr({ attribute: "layer-name" })
    layerName: string;

    componentTypeTemplate(): ViewTemplate<ColorBlock, any> {
        switch (this.component) {
            case ComponentType.backplate:
                return backplateComponents;
            case ComponentType.text:
                return textComponents;
            case ComponentType.form:
                return formComponents;
        }
    }

    private updateColor(): void {
        if (this.color && this.$fastController.isConnected) {
            const color = parseColorHexRGB(this.color)!;
            fillColor.setValueFor(this, SwatchRGB.from(color));
        }
    }
}

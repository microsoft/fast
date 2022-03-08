import {
    accentFillActive,
    accentFillHover,
    accentFillRest,
    accentForegroundActive,
    accentForegroundHover,
    accentForegroundRest,
    fillColor,
    focusStrokeInner,
    focusStrokeOuter,
    foregroundOnAccentRest,
    neutralFillActive,
    neutralFillHover,
    neutralFillInputRest,
    neutralFillRest,
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralFillStrongActive,
    neutralFillStrongHover,
    neutralFillStrongRest,
    neutralForegroundHint,
    neutralForegroundRest,
    neutralStrokeActive,
    neutralStrokeDividerRest,
    neutralStrokeHover,
    neutralStrokeRest,
} from "@microsoft/fast-components";
import {
    attr,
    css,
    customElement,
    FASTElement,
    html,
    when,
} from "@microsoft/fast-element";
import { ComponentTypes } from "../state";
import { AppSwatch } from "./swatch";

AppSwatch;

const backplateComponents = html<AppColorBlock>`
    <template>
        <div class="example">
            <fast-button appearance="accent">Accent</fast-button>
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
            <fast-button>Neutral</fast-button>
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
            <fast-button appearance="outline">Outline</fast-button>
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
            <fast-button appearance="stealth">Stealth</fast-button>
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

const textComponents = html<AppColorBlock>`
    <template>
        <div class="example">
            <p>Neutral</p>
        </div>
        <app-swatch
            type="foreground"
            recipe-name="neutralForegroundRest"
            :fillRecipe="${x => fillColor}"
            :foregroundRecipe="${x => neutralForegroundRest}"
        ></app-swatch>

        <div class="example">
            <p class="hint_text">Hint</p>
        </div>
        <app-swatch
            type="foreground"
            recipe-name="neutralForegroundHint"
            :fillRecipe="${x => fillColor}"
            :foregroundRecipe="${x => neutralForegroundHint}"
        ></app-swatch>

        <div class="example">
            <fast-anchor href="#" appearance="hypertext">Accent</fast-anchor>
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

const formComponents = html<AppColorBlock>`
    <template>
        <div class="example">
            <fast-text-field placeholder="jerry@microsoft.com"></fast-text-field>
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
            <fast-checkbox>Checkbox</fast-checkbox>
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
            <fast-divider class="divider"></fast-divider>
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

const template = html<AppColorBlock>`
    <fast-design-system-provider
        class="color-block"
        fill-color="${x => x.color}"
        id="${x => x.color.toUpperCase().replace("#", "")}"
    >
        <p class="title">
            SWATCH ${x => x.index} - ${x => x.color.toUpperCase()}
            ${when(
                x => x.layerName,
                html`
                    <p>
                        <code>${x => x.layerName}</code>
                    </p>
                `
            )}
        </p>

        <div class="content">
            ${when(x => x.component === ComponentTypes.backplate, backplateComponents)}
            ${when(x => x.component === ComponentTypes.text, textComponents)}
            ${when(x => x.component === ComponentTypes.form, formComponents)}
        </div>
    </fast-design-system-provider>
`;

const styles = css`
    :host {
        min-height: 100%;
    }

    .color-block {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        align-items: stretch;
        text-align: center;
        color: ${neutralForegroundRest};
        position: relative;
        transition: opacity 0.1s linear;
        height: 100%;
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

    .hint_text {
        color: ${neutralForegroundHint};
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
export class AppColorBlock extends FASTElement {
    @attr index: number;

    @attr component: ComponentTypes;

    @attr color: string;

    @attr({ attribute: "layer-name" }) layerName?: string;
}

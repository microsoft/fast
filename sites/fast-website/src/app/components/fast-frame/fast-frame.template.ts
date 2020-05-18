import { StandardLuminance } from "@microsoft/fast-components-styles-msft";
import { html, repeat } from "@microsoft/fast-element";
import ContextIcon from "svg/icon-context.svg";
import ContrastIcon from "svg/icon-contrast.svg";
import DownloadIcon from "svg/icon-download.svg";
import PaletteIcon from "svg/icon-palette.svg";
import PlayIcon from "svg/icon-play.svg";
import ScreenIcon from "svg/icon-screen.svg";
import ShareIcon from "svg/icon-share.svg";
import SwatchesIcon from "svg/icon-swatches.svg";
import { FastFrame } from "./fast-frame";

export const FastFrameTemplate = html<FastFrame>`
    <template>
        <div class="wrapper">
            <fast-tabs orientation="vertical" id="myTab" activeId="TabTwo">
                <fast-tab id="TabOne" title="Mode">${ContrastIcon}</fast-tab>
                <fast-tab id="TabTwo" title="Color">${PaletteIcon}</fast-tab>
                <fast-tab id="TabThree" title="Styles">${SwatchesIcon}</fast-tab>
                <fast-tab id="TabFour" title="Density">${ScreenIcon}</fast-tab>
                <fast-tab-panel id="TabPanelOne">
                    <fast-switch
                        checked="${x => x.darkMode}"
                        @change="${(x, c) => x.themeChange(c.event as MouseEvent)}"
                    >
                        Dark Mode
                    </fast-switch>
                </fast-tab-panel>
                <fast-tab-panel id="TabPanelTwo">
                    <div class="content">
                        <h1>FAST FRAME COLORS</h1>
                        <h2>Pre-existing color you can customize.</h2>
                        <p>
                            Ultrices nibh nunc vestibulum fames. At lacus nunc lacus eget
                            neque.
                        </p>
                        <fast-radio-group
                            name="background color"
                            value="${x => x.previewBackgroundPalette[0]}"
                            @change="${(x, c) =>
                                x.backgroundChangeHandler(c.event as MouseEvent)}"
                        >
                            <label slot="label">Background color</label>
                            ${repeat(
                                x => x.previewBackgroundPalette,

                                html<string>`
                                    <site-color-swatch
                                        value="${x => x}"
                                        background-color="${x => x}"
                                        checked="${(x, c) =>
                                            x === c.parent.previewBackgroundPalette[0]}"
                                    ></site-color-swatch>
                                `
                            )}
                        </fast-radio-group>
                        <fast-radio-group
                            value="${x => x.previewAccentPalette[0]}"
                            name="accent color"
                            @change="${(x, c) =>
                                x.accentChangeHandler(c.event as MouseEvent)}"
                        >
                            <label slot="label">Accent color</label>
                            ${repeat(
                                (x, c) => x.previewAccentPalette,
                                html<string>`
                                    <site-color-swatch
                                        value="${x => x}"
                                        background-color="${x => x}"
                                        checked="${(x, c) =>
                                            x === c.parent.previewAccentPalette[0]}"
                                    ></site-color-swatch>
                                `
                            )}
                        </fast-radio-group>
                    </div>
                </fast-tab-panel>
                <fast-tab-panel id="TabPanelThree">
                    Tab three content. This is for testing.
                </fast-tab-panel>
                <fast-tab-panel id="TabPanelFour">
                    Tab four content. This is for testing.
                </fast-tab-panel>
            </fast-tabs>
            <fast-design-system-provider
                class="preview"
                base-layer-luminance="${x =>
                    x.darkMode
                        ? StandardLuminance.DarkMode
                        : StandardLuminance.LightMode}"
                background-color="${x => x.backgroundColor}"
                accent-base-color="${x => x.accentColor}"
                :accentPalette=${x => x.accentPalette}
            >
                <fast-card>
                    <div class="image-container">
                        <fast-badge fill="primary" color="primary" class="badge">
                            Badge
                        </fast-badge>
                    </div>
                    <div class="text-container">
                        <h3>Card Options</h3>
                        <p>
                            At purus lectus quis habitant commodo, cras. Aliquam malesuada
                            velit a tortor. Felis orci tellus netus risus et ultricies
                            augue aliquet. Suscipit mattis mus amet nibh...
                        </p>
                        <fast-divider></fast-divider>
                        <div class="sample-control">
                            <span class="sample-control-icon"></span>
                            <span class="sample-control-text">Label</span>
                            <div class="sample-control-actions">
                                <fast-button appearance="stealth"
                                    >${ShareIcon}</fast-button
                                >
                                <fast-button appearance="stealth"
                                    >${ContextIcon}</fast-button
                                >
                            </div>
                        </div>
                    </div>
                </fast-card>
                <div class="preview-controls">
                    <fast-progress></fast-progress>
                    <fast-menu>
                        <fast-menu-item role="menuitem">Menu item 1</fast-menu-item>
                        <fast-menu-item role="menuitem">Menu item 2</fast-menu-item>
                        <fast-menu-item role="menuitem">Menu item 3</fast-menu-item>
                        <hr />
                        <fast-menu-item role="menuitem">Menu item 4</fast-menu-item>
                    </fast-menu>
                    <div class="control-container">
                        <div class="control-container-column">
                            <fast-radio>Radio 1</fast-radio>
                            <fast-radio>Radio 2</fast-radio>
                        </div>
                        <div class="control-container-grid">
                            <fast-switch></fast-switch>
                            <p>Toggle</p>
                            <fast-checkbox class="checkbox"></fast-checkbox>
                            <p class="checkbox-label">Checkbox</p>
                        </div>
                    </div>
                    <fast-text-field placeholder="Text field"></fast-text-field>
                    <div class="control-container-2">
                        <fast-flipper aria-hidden="false"></fast-flipper>
                        <fast-flipper disabled></fast-flipper>
                        <fast-slider></fast-slider>
                    </div>
                    <div class="control-container">
                        <fast-button appearance="accent">
                            Button
                            <span slot="end">${DownloadIcon}</span>
                        </fast-button>
                        <fast-button appearance="neutral">
                            Button
                            <span slot="end">${PlayIcon}</span>
                        </fast-button>
                    </div>
                </div>
            </fast-design-system-provider>
        </div>
    </template>
`;

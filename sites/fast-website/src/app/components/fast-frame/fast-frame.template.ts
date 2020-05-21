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
import { ColorHSL, hslToRGB } from "@microsoft/fast-colors";

export const FastFrameTemplate = html<FastFrame>`
    <template>
        <div class="wrapper">
            <fast-tabs orientation="vertical" id="myTab" activeId="TabTwo">
                <fast-tab id="contrast-tab" title="Mode">${ContrastIcon}</fast-tab>
                <fast-tab id="palette-tab" title="Color">${PaletteIcon}</fast-tab>
                <fast-tab id="swatches-tab" title="Styles">${SwatchesIcon}</fast-tab>
                <fast-tab id="density-tab" title="Density">${ScreenIcon}</fast-tab>
                <fast-tab-panel id="contrast-tab-panel">
                    <div class="content">
                        <h1><span class="content-heading-highlight">Fast Frame</span> Dark Mode</h4>
                        <h2>Pre-built for both light and dark modes</h2>
                        <p>
                            Sem viverra fringilla at magna turpis in. Nullam adipiscing fusce auctor semper arcu felis. Purus et enim feugiat arcu. Lectus neque sem est ridiculus tempus urna.
                        </p>
                        <div class="content-control-container" >
                            <label for="dark-mode-switch">Dark mode</label>
                            <fast-switch
                                id="dark-mode-switch"
                                checked="${x => x.darkMode}"
                                @change="${(x, c) =>
                                    x.themeChange(c.event as MouseEvent)}"
                            >
                                <span slot="checked-message">On</span>
                                <span slot="unchecked-message">Off</span>
                            </fast-switch>
                        </div>
                    </div>
                </fast-tab-panel>
                <fast-tab-panel id="palette-tab-panel">
                    <div class="content">
                        <h1><span class="content-heading-highlight">Fast Frame</span> Colors</h4>
                        <h2>Pre-existing color you can customize</h2>
                        <p>
                            Ultrices nibh nunc vestibulum fames. At lacus nunc lacus eget
                            neque.
                        </p>
                        <div class="content-control-container" >
                            <label for="background-color-pickers">Background color</label>
                            <fast-radio-group
                                name="background-color-pickers"
                                value="${x => x.previewBackgroundPalette[0]}"
                                @change="${(x, c) =>
                                    x.backgroundChangeHandler(c.event as MouseEvent)}"
                            >
                                ${repeat(
                                    x => x.previewBackgroundPalette,

                                    html<string>`
                                        <site-color-swatch
                                            value="${x => x}"
                                            background-color="${x => x}"
                                            checked="${(x, c) =>
                                                x ===
                                                c.parent.previewBackgroundPalette[0]}"
                                        ></site-color-swatch>
                                    `
                                )}
                            </fast-radio-group>
                            <label for="accent-color-pickers">Accent color</label>
                            <fast-radio-group
                                name="accent-color-pickers"
                                value="${x => x.previewAccentPalette[0]}"
                                @change="${(x, c) =>
                                    x.accentChangeHandler(c.event as MouseEvent)}"
                            >
                                ${repeat(
                                    x => x.previewAccentPalette,

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
                            <label for="hue-slider">Hue</label>
                            <fast-slider
                                id="hue-slider"
                                min="0"
                                max="359"
                                step="1"
                                value="${x => x.hue}"
                                @change="${(x, c) =>
                                    x.hueChangeHandler(c.event as MouseEvent)}"
                            >
                                <div slot="track" class="hue-slider-track"></div>
                            </fast-slider>
                            <label for="saturation-slider">Saturation</label>
                            <fast-slider
                                id="saturation-slider"
                                min="0"
                                max="1"
                                step="0.05"
                                value="${x => x.saturation}"
                                @change="${(x, c) =>
                                    x.saturationChangeHandler(c.event as MouseEvent)}"
                            >
                                <div slot="track" class="saturation-slider-track" style="background-image: linear-gradient(to right, ${x =>
                                    hslToRGB(
                                        new ColorHSL(x.hue, 0, x.lightness)
                                    ).toStringHexRGB()}, ${x =>
    hslToRGB(new ColorHSL(x.hue, 1, x.lightness)).toStringHexRGB()});"></div>
                            </fast-slider>
                        </div>
                    </div>
                </fast-tab-panel>
                <fast-tab-panel id="swatches-tab-panel">
                    <div class="content">
                        <h1><span class="content-heading-highlight">Fast Frame</span> Styles</h4>
                        <h2>Adjust style settings on the fly</h2>
                        <p>
                            Ultrices nibh nunc vestibulum fames. At lacus nunc lacus eget neque.
                        </p>
                        <div class="content-control-container-2">
                            <label for="border-radius-slider">Border radius</label>
                            <fast-slider
                                id="border-radius-slider"
                                min="0"
                                max="12"
                                step="1"
                                value="3"
                                @change="${(x, c) =>
                                    x.borderRadiusChangeHandler(c.event as MouseEvent)}"
                            >
                                <fast-slider-label
                                    hide-mark
                                    position="0"
                                >
                                    0
                                </fast-slider-label>            
                                <fast-slider-label
                                    hide-mark
                                    position="12"
                                >
                                    12PX
                                </fast-slider-label>
                            </fast-slider>
                            <label for="outline-width-slider">Outline width</label>
                            <fast-slider
                                id="outline-width-slider"
                                min="0"
                                max="6"
                                step="1"
                                value="1"
                                @change="${(x, c) =>
                                    x.outlineWidthChangeHandler(c.event as MouseEvent)}"
                            >
                                <fast-slider-label
                                    hide-mark
                                    position="0"
                                >
                                    0
                                </fast-slider-label>            
                                <fast-slider-label
                                    hide-mark
                                    position="6"
                                >
                                    6PX
                                </fast-slider-label>
                            </fast-slider>
                        </div>
                    </div>
                </fast-tab-panel>
                <fast-tab-panel id="density-tab-panel">
                    <div class="content">
                        <h1><span class="content-heading-highlight">Fast Frame</span> Density</h4>
                        <h2>Quickly change and modify your layout</h2>
                        <p>
                            Ultrices nibh nunc vestibulum fames. At lacus nunc lacus eget neque.
                        </p>
                        <div class="content-control-container-2">
                            <label for="density-slider">Density</label>
                            <fast-slider
                                id="density-slider"
                                min="-3"
                                max="3"
                                step="1"
                                value="0"
                                @change="${(x, c) =>
                                    x.densityChangeHandler(c.event as MouseEvent)}"
                            >
                                <fast-slider-label
                                    hide-mark
                                    position="-3"
                                >
                                    -3
                                </fast-slider-label>            
                                <fast-slider-label
                                    hide-mark
                                    position="3"
                                >
                                    3
                                </fast-slider-label>
                            </fast-slider>
                            <label for="base-height-multiplier-slider">Base height multiplier</label>
                            <fast-slider
                                id="base-height-multiplier-slider"
                                min="5"
                                max="15"
                                step="1"
                                value="10"
                                @change="${(x, c) =>
                                    x.baseHeightMultiplierChangeHandler(
                                        c.event as MouseEvent
                                    )}"
                            >
                                <fast-slider-label
                                    hide-mark
                                    position="0"
                                >
                                    5PX
                                </fast-slider-label>            
                                <fast-slider-label
                                    hide-mark
                                    position="15"
                                >
                                    15PX
                                </fast-slider-label>
                            </fast-slider>
                            <label for="base-horizontal-spacing-multiplier-slider">Base horizontal<br/> spacing multiplier</label>
                            <fast-slider
                                id="base-horizontal-spacing-multiplier-slider"
                                min="0"
                                max="6"
                                step="1"
                                value="3"
                                @change="${(x, c) =>
                                    x.baseHorizontalSpacingMultiplierChangeHandler(
                                        c.event as MouseEvent
                                    )}"
                            >
                                <fast-slider-label
                                    hide-mark
                                    position="0"
                                >
                                    0
                                </fast-slider-label>            
                                <fast-slider-label
                                    hide-mark
                                    position="6"
                                >
                                    6PX
                                </fast-slider-label>
                            </fast-slider>
                        </div>
                    </div>
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
                density="${x => x.density}"
                corner-radius="${x => x.borderRadius}"
                outline-width="${x => x.outlineWidth}"
                base-height-multiplier="${x => x.baseHeightMultiplier}"
                base-horizontal-spacing-multiplier="${x =>
                    x.baseHorizontalSpacingMultiplier}"
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
                            <span slot="start">${DownloadIcon}</span>
                        </fast-button>
                        <fast-button appearance="neutral">
                            Button
                            <span slot="start">${PlayIcon}</span>
                        </fast-button>
                    </div>
                </div>
            </fast-design-system-provider>
        </div>
    </template>
`;

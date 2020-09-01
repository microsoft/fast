import { html, repeat } from "@microsoft/fast-element";
import ContextIcon from "svg/icon-context.svg";
import ContrastIcon from "svg/icon-contrast.svg";
import DownloadIcon from "svg/icon-download.svg";
import PaletteIcon from "svg/icon-palette.svg";
import PlayIcon from "svg/icon-play.svg";
import SwatchesIcon from "svg/icon-swatches.svg";
import { FastFrame } from "./fast-frame";
import { ColorHSL, hslToRGB } from "@microsoft/fast-colors";

export const FastFrameTemplate = html<FastFrame>`
    <template>
        <div class="wrapper">
            <fast-tabs orientation="vertical" id="myTab" activeId="TabTwo">
                <fast-tab id="contrast-tab" title="Dark Mode">${ContrastIcon}</fast-tab>
                <fast-tab id="palette-tab" title="Color">${PaletteIcon}</fast-tab>
                <fast-tab id="style-tab" title="Styles">${SwatchesIcon}</fast-tab>
                <fast-tab-panel
                    id="contrast-tab-panel"
                    class="${x => (x.expanded ? "tab-panel-expanded" : "")}"
                >
                    <div class="content">
                        <fast-badge class="content-badge">
                            Fast Frame
                            <span class="content-badge-highlight">Dark Mode</span>
                        </fast-badge>
                        <h3 class="heading">Pre-built for both light and dark modes</h3>
                        <p>
                            Switching between dark and light mode is as easy as changing
                            the background color of the design system.
                        </p>
                        <div class="content-control-container">
                            <label for="dark-mode-switch">Dark mode</label>
                            <fast-switch
                                id="dark-mode-switch"
                                :checked="${x => x.darkMode}"
                                @change="${(x, c) =>
                                    x.modeChange(c.event as CustomEvent)}"
                            >
                                <span slot="checked-message">On</span>
                                <span slot="unchecked-message">Off</span>
                            </fast-switch>
                        </div>
                    </div>
                </fast-tab-panel>
                <fast-tab-panel
                    id="palette-tab-panel"
                    class="${x => (x.expanded ? "tab-panel-expanded" : "")}"
                >
                    <div class="content">
                        <fast-badge class="content-badge">
                            Fast Frame
                            <span class="content-badge-highlight">Colors</span>
                        </fast-badge>
                        <h3 class="heading">Pre-existing color you can customize</h3>
                        <p>
                            Color is applied by using color recipes which require two
                            color palettes, neutral and accent, applied to the design
                            system. These palettes are customizable which allows for a
                            wide range of styles.
                        </p>
                        <div class="content-control-container">
                            <label for="neutral-color-pickers">Neutral color</label>
                            <fast-radio-group
                                class="swatches"
                                name="neutral-color-pickers"
                                value="${x => x.previewNeutralPalette[0]}"
                                @change="${(x, c) =>
                                    x.neutralChangeHandler(c.event as CustomEvent)}"
                            >
                                ${repeat(
                                    x => x.previewNeutralPalette,

                                    html<string>`
                                        <site-color-swatch
                                            tabindex="0"
                                            aria-label="neutral color ${x => x}"
                                            value="${x => x}"
                                            background-color="${x => x}"
                                            checked="${(x, c) =>
                                                x === c.parent.previewNeutralPalette[0]}"
                                        ></site-color-swatch>
                                    `
                                )}
                            </fast-radio-group>
                            <label for="accent-color-pickers">Accent color</label>
                            <fast-radio-group
                                class="swatches"
                                name="accent-color-pickers"
                                value="${x => x.previewAccentPalette[0]}"
                                @change="${(x, c) =>
                                    x.accentChangeHandler(c.event as CustomEvent)}"
                            >
                                ${repeat(
                                    x => x.previewAccentPalette,

                                    html<string>`
                                        <site-color-swatch
                                            tabindex="0"
                                            aria-label="accent color ${x => x}"
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
                                    x.hueChangeHandler(c.event as CustomEvent)}"
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
                                    x.saturationChangeHandler(c.event as CustomEvent)}"
                            >
                                <div
                                    slot="track"
                                    class="saturation-slider-track"
                                    style="background-image: linear-gradient(to right, ${x =>
                                        hslToRGB(
                                            new ColorHSL(x.hue, 0, x.lightness)
                                        ).toStringHexRGB()}, ${x =>
                                        hslToRGB(
                                            new ColorHSL(x.hue, 1, x.lightness)
                                        ).toStringHexRGB()});"
                                ></div>
                            </fast-slider>
                        </div>
                    </div>
                </fast-tab-panel>
                <fast-tab-panel
                    id="style-tab-panel"
                    class="${x => (x.expanded ? "tab-panel-expanded" : "")}"
                >
                    <div class="content">
                        <fast-badge class="content-badge">
                            Fast Frame
                            <span class="content-badge-highlight">Styles</span>
                        </fast-badge>
                        <h3 class="heading">Adjust style settings on the fly</h3>
                        <p>
                            Update design system values for border radius, outline width,
                            or density.
                        </p>
                        <div class="content-control-container-2">
                            <label for="border-radius-slider">Border radius</label>
                            <fast-slider
                                id="border-radius-slider"
                                min="0"
                                max="20"
                                step="1"
                                value="3"
                                @change="${(x, c) =>
                                    x.borderRadiusChangeHandler(c.event as CustomEvent)}"
                            >
                                <fast-slider-label hide-mark position="0">
                                    0
                                </fast-slider-label>
                                <fast-slider-label hide-mark position="20">
                                    20PX
                                </fast-slider-label>
                            </fast-slider>
                            <label for="outline-width-slider">Outline width</label>
                            <fast-slider
                                id="outline-width-slider"
                                min="1"
                                max="4"
                                step="1"
                                value="1"
                                @change="${(x, c) =>
                                    x.outlineWidthChangeHandler(c.event as CustomEvent)}"
                            >
                                <fast-slider-label hide-mark position="1">
                                    1PX
                                </fast-slider-label>
                                <fast-slider-label hide-mark position="6">
                                    4PX
                                </fast-slider-label>
                            </fast-slider>
                            <label for="density-slider">Density</label>
                            <fast-slider
                                id="density-slider"
                                min="-3"
                                max="3"
                                step="1"
                                value="0"
                                @change="${(x, c) =>
                                    x.densityChangeHandler(c.event as CustomEvent)}"
                            >
                                <fast-slider-label hide-mark position="-3">
                                    -3
                                </fast-slider-label>
                                <fast-slider-label hide-mark position="3">
                                    3
                                </fast-slider-label>
                            </fast-slider>
                        </div>
                    </div>
                </fast-tab-panel>
            </fast-tabs>
            <fast-design-system-provider
                use-defaults
                class="${x => (x.expanded ? "preview preview-expanded" : "preview")}"
                base-layer-luminance="${x => x.baseLayerLuminance}"
                background-color="${x => x.backgroundColor}"
                accent-base-color="${x => x.accentColor}"
                density="${x => x.density}"
                corner-radius="${x => x.borderRadius}"
                outline-width="${x => x.outlineWidth}"
                :accentPalette=${x =>
                    Array.isArray(x.accentPalette) ? x.accentPalette : null}
                :neutralPalette=${x =>
                    Array.isArray(x.neutralPalette) ? x.neutralPalette : null}
            >
                <fast-design-system-provider
                    density="0"
                    class="responsive-expand-flipper"
                    base-height-multiplier="10"
                    base-horizontal-spacing-multiplier="3"
                >
                    <fast-flipper
                        direction="${x => (x.expanded ? "next" : "previous")}"
                        aria-expanded="${x => x.expanded}"
                        aria-hidden="false"
                        @keypress="${(x, c) =>
                            x.handleExpandKeypress(c.event as KeyboardEvent)}"
                        @click="${(x, c) =>
                            x.handleExpandKeypress(c.event as KeyboardEvent)}"
                    ></fast-flipper>
                </fast-design-system-provider>
                <fast-card>
                    <div class="image-container">
                        <fast-badge fill="primary" color="primary" class="badge">
                            Badge
                        </fast-badge>
                    </div>
                    <div class="text-container">
                        <h3>Example card</h3>
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
                                <fast-button
                                    appearance="stealth"
                                    aria-label="Example 'more' button"
                                >
                                    ${ContextIcon}
                                </fast-button>
                            </div>
                        </div>
                    </div>
                </fast-card>
                <div class="preview-controls">
                    <fast-progress aria-label="Example progress bar"></fast-progress>
                    <fast-menu
                        tabindex="${x => x.setTabIndex()}"
                        aria-label="Example menu"
                    >
                        <fast-menu-item role="menuitem" aria-label="Example menu item">
                            Menu item 1
                        </fast-menu-item>
                        <fast-menu-item role="menuitem" aria-label="Example menu item">
                            Menu item 2
                        </fast-menu-item>
                        <fast-menu-item role="menuitem" aria-label="Example menu item">
                            Menu item 3
                        </fast-menu-item>
                        <fast-divider></fast-divider>
                        <fast-menu-item role="menuitem" aria-label="Example menu item">
                            Menu item 4
                        </fast-menu-item>
                    </fast-menu>
                    <div class="control-container">
                        <fast-radio-group
                            class="example-radios"
                            name="example radio group"
                            orientation="vertical"
                        >
                            <fast-radio aria-label="Example radio 1">Radio 1</fast-radio>
                            <fast-radio aria-label="Example radio 2">Radio 2</fast-radio>
                        </fast-radio-group>
                        <div class="control-container-grid">
                            <fast-switch
                                tabindex="${x => x.setTabIndex()}"
                                aria-label="Example toggle"
                            ></fast-switch>
                            <p>Toggle</p>
                            <fast-checkbox
                                tabindex="${x => x.setTabIndex()}"
                                class="checkbox"
                                aria-label="Example checkbox"
                            ></fast-checkbox>
                            <p class="checkbox-label">Checkbox</p>
                        </div>
                    </div>
                    <fast-text-field
                        placeholder="Text field"
                        tabindex="${x => x.setTabIndex()}"
                        aria-label="Example text field"
                    ></fast-text-field>
                    <div class="control-container-2">
                        <fast-slider
                            tabindex="${x => x.setTabIndex()}"
                            aria-label="Example slider"
                        ></fast-slider>
                        <fast-flipper></fast-flipper>
                        <fast-flipper disabled></fast-flipper>
                    </div>
                    <div class="control-container">
                        <fast-button
                            appearance="accent"
                            aria-label="Example 'download' button"
                            tabindex="${x => x.setTabIndex()}"
                        >
                            Button
                            <span slot="start">${DownloadIcon}</span>
                        </fast-button>
                        <fast-button
                            appearance="neutral"
                            aria-label="Example 'play' button"
                            tabindex="${x => x.setTabIndex()}"
                        >
                            Button
                            <span slot="start">${PlayIcon}</span>
                        </fast-button>
                    </div>
                </div>
            </fast-design-system-provider>
        </div>
    </template>
`;

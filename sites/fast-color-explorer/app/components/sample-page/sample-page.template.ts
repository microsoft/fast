import { html, ViewTemplate } from "@microsoft/fast-element";
import MoreIcon from "@fluentui/svg-icons/icons/more_horizontal_20_regular.svg";
import DownloadIcon from "@fluentui/svg-icons/icons/arrow_download_20_regular.svg";
import PlayIcon from "@fluentui/svg-icons/icons/play_20_regular.svg";
import { SamplePage } from "./sample-page";

export const samplePageTemplate: (
    context: any,
    definition: any
) => ViewTemplate<SamplePage> = (context: any, definition: any) => html`
    <template>
        <fast-card>
            <div class="image-container">
                <fast-badge fill="primary" color="primary" class="badge">
                    Badge
                </fast-badge>
            </div>
            <div class="text-container">
                <h3>Example card</h3>
                <p>
                    At purus lectus quis habitant commodo, cras. Aliquam malesuada velit a
                    tortor. Felis orci tellus netus risus et ultricies augue aliquet.
                    Suscipit mattis mus amet nibh...
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
                            ${MoreIcon}
                        </fast-button>
                    </div>
                </div>
            </div>
        </fast-card>
        <div class="preview-controls">
            <fast-progress aria-label="Example progress bar"></fast-progress>
            <fast-menu aria-label="Example menu">
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
                    <fast-switch aria-label="Example toggle">Toggle</fast-switch>
                    <fast-checkbox class="checkbox" aria-label="Example checkbox">
                        Checkbox
                    </fast-checkbox>
                </div>
            </div>
            <fast-text-field
                placeholder="Text field"
                aria-label="Example text field"
            ></fast-text-field>
            <div class="control-container-2">
                <fast-slider aria-label="Example slider"></fast-slider>
                <fast-flipper></fast-flipper>
                <fast-flipper disabled></fast-flipper>
            </div>
            <div class="control-container">
                <fast-button appearance="accent" aria-label="Example 'download' button">
                    Button
                    <span slot="start">${DownloadIcon}</span>
                </fast-button>
                <fast-button appearance="neutral" aria-label="Example 'play' button">
                    Button
                    <span slot="start">${PlayIcon}</span>
                </fast-button>
            </div>
        </div>
    </template>
`;

/** @jsx h */ /* Note: Set the JSX pragma to the wrapped version of createElement */

import React from "react";
import { FASTButton } from "@microsoft/fast-components";
import { downChevron, upChevron } from "@microsoft/site-utilities";
import h from "@microsoft/site-utilities/dist/web-components/pragma";

/**
 * Ensure tree-shaking doesn't remove these components from the bundle
 */
FASTButton;

export function renderDevToolToggle(selected: boolean, onToggleCallback: () => void) {
    return (
        <fast-button
            events={{
                click: (e: React.ChangeEvent) => {
                    onToggleCallback();
                },
            }}
            class={"dev-tools-trigger"}
        >
            {selected ? downChevron() : upChevron()}
        </fast-button>
    );
    /*
<ActionToggle
                                appearance={ActionToggleAppearance.stealth}
                                selectedLabel={"Development tools expanded"}
                                selectedGlyph={downChevron}
                                unselectedLabel={"Development tools collapsed"}
                                unselectedGlyph={upChevron}
                                selected={this.state.devToolsVisible}
                                onToggle={this.handleDevToolsToggle}
                                style={{
                                    position: "absolute",
                                    top: "12px",
                                    right: 0,
                                    backgroundColor: "var(--container-background)",
                                }}
                            />
    */
}

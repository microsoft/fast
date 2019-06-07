import React from "react";
import { addons, types, RouteOptions, MatchOptions } from "@storybook/addons";
import { API, Consumer } from "@storybook/api";
import { Global, Theme } from "@storybook/theming";
import { ADDON_ID, PANEL_ID, ADDON_EVENT } from "./constants";
import { RenderOptions } from "@storybook/api/dist/modules/addons";
import {
    DesignSystemDefaults,
    DesignSystem,
} from "@microsoft/fast-components-styles-msft";
import { designSystemManager } from "./index";

interface DesignSystemPanelProps {
    api: API;
    active: boolean;
}

class DesignSystemPanel extends React.Component<DesignSystemPanelProps, {}> {
    public render() {
        const designSystem: DesignSystem = designSystemManager.get();

        return (
            <React.Fragment>
                <Global
                    styles={(theme: Theme) => ({
                        [`#storybook-preview-background`]: {
                            background: `${designSystem.backgroundColor}`,
                        },
                    })}
                />
                {this.props.active ? this.renderForm(designSystem) : null}
            </React.Fragment>
        );
        return;
    }

    private renderForm(designSystem: DesignSystem): JSX.Element {
        return (
            <div style={{ padding: "12px" }}>
                <label>
                    Background-color&nbsp;
                    <input
                        type="color"
                        onChange={this.handleColorChange}
                        defaultValue={designSystem.backgroundColor}
                    />
                </label>
            </div>
        );
    }

    private handleColorChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        designSystemManager.update({ backgroundColor: e.target.value });
        this.props.api.emit(ADDON_EVENT);
        this.forceUpdate();
    };
}

addons.register(
    ADDON_ID,
    (api: API): void => {
        addons.add(PANEL_ID, {
            title: "FAST DesignSystem",
            type: types.PANEL,
            route: (options: RouteOptions): string => `info/${options.storyId}`,
            match: (options: MatchOptions): boolean => options.viewMode === "info",
            render: (options: RenderOptions) => (
                <DesignSystemPanel key={options.key} api={api} active={options.active} />
            ),
        });
    }
);

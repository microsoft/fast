import React from "react";
import { addons, types, RouteOptions, MatchOptions } from "@storybook/addons";
import { API, Consumer } from "@storybook/api";
import { Global, Theme } from "@storybook/theming";
import { STORY_CHANGED } from "@storybook/core-events";
import { ADDON_ID, PANEL_ID, ADDON_EVENT } from "./constants";
import { RenderOptions } from "@storybook/api/dist/modules/addons";
import {
    DesignSystemDefaults,
    DesignSystem,
} from "@microsoft/fast-components-styles-msft";
import designSystemManager from "./design-system";
import { parseToInputTypes } from "./design-system-parser";
import { merge } from "lodash-es";

interface DesignSystemPanelProps {
    api: API;
    active: boolean;
}

enum ColorModes {
    light = "light",
    dark = "dark",
}

interface DesignSystemPanelState {
    colorMode: ColorModes;
    designSystem: DesignSystem;
}

class DesignSystemPanel extends React.Component<
    DesignSystemPanelProps,
    DesignSystemPanelState
> {
    constructor(props: DesignSystemPanelProps) {
        super(props);

        this.state = {
            colorMode: ColorModes.light,
            designSystem: DesignSystemDefaults,
        };
    }

    public render() {
        return (
            <React.Fragment>
                <Global
                    styles={(theme: Theme) => ({
                        [`#storybook-preview-background`]: {
                            background: `${this.state.designSystem.backgroundColor}`,
                        },
                    })}
                />
                {this.props.active ? this.renderForm() : null}
            </React.Fragment>
        );
    }

    private renderForm(): JSX.Element {
        return (
            <div style={{ padding: "12px" }}>
                <div>
                    <label>
                        Background-color&nbsp;
                        <input
                            type="color"
                            onChange={this.createChangeHandler(this.handleColorChange)}
                            defaultValue={this.state.designSystem.backgroundColor}
                        />
                    </label>
                </div>

                <fieldset>
                    <legend>Mode</legend>
                    <label>
                        light&nbsp;
                        <input
                            type="radio"
                            name="colorMode"
                            value={ColorModes.light}
                            defaultChecked={this.state.colorMode === ColorModes.light}
                        />
                    </label>
                    <label>
                        dark&nbsp;
                        <input
                            type="radio"
                            name="colorMode"
                            value={ColorModes.dark}
                            defaultChecked={this.state.colorMode === ColorModes.dark}
                        />
                    </label>
                </fieldset>
                <fieldset>
                    <legend>Document direction</legend>
                    <label>
                        ltr&nbsp;
                        <input
                            type="radio"
                            name="direction"
                            value="ltr"
                            defaultChecked={this.state.designSystem.direction === "ltr"}
                            onChange={this.createChangeHandler(
                                this.handleDirectionChange
                            )}
                        />
                    </label>
                    <label>
                        rtl&nbsp;
                        <input
                            type="radio"
                            name="direction"
                            value="rtl"
                            defaultChecked={this.state.designSystem.direction === "rtl"}
                            onChange={this.createChangeHandler(
                                this.handleDirectionChange
                            )}
                        />
                    </label>
                </fieldset>
            </div>
        );
    }

    public componentDidMount(): void {
        // Doesn't seem to get called initially
        this.props.api.on(STORY_CHANGED, () => {
            console.log("on story called from register!");

            this.props.api.emit(ADDON_EVENT, this.state.designSystem);
        });
    }

    private createChangeHandler<T>(fn: (e: T) => Partial<DesignSystem>): (e: T) => void {
        return (e: T): void => {
            const event: T = e;
            const updates: Partial<DesignSystem> = fn(event);

            this.setState(
                {
                    designSystem: merge({}, this.state.designSystem, updates),
                },
                () => {
                    this.props.api.emit(ADDON_EVENT, this.state.designSystem);
                }
            );
        };
    }

    private handleColorChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): Partial<DesignSystem> => {
        return { backgroundColor: e.target.value };
    };

    private handleDirectionChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): Partial<DesignSystem> => {
        return { direction: e.target.value as any };
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

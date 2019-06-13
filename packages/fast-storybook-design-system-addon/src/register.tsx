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
import designSystemManager from "./design-system";

designSystemManager.set(DesignSystemDefaults); // TODO not sure why this code is executed before "setup" but it is

interface DesignSystemPanelProps {
    api: API;
    active: boolean;
}

class DesignSystemPanel extends React.Component<DesignSystemPanelProps, {}> {
    public componentDidMount() {
        window.setTimeout(() => {
            this.setIframeDirection((designSystemManager.get() as any).direction);
        }, 400); // This is hacky - not sure why it doesn't just work immediately
    }

    public render() {
        const designSystem: any = designSystemManager.get();

        return (
            <React.Fragment>
                <Global
                    styles={(theme: Theme) => ({
                        [`#storybook-preview-background`]: {
                            background: `${designSystem.backgroundColor}`,
                        },
                    })}
                />
                {this.props.active ? this.renderForm(designSystem as any) : null}
            </React.Fragment>
        );
        return;
    }

    private renderForm(designSystem: DesignSystem): JSX.Element {
        return (
            <div style={{ padding: "12px" }}>
                <div>
                    <label>
                        Background-color&nbsp;
                        <input
                            type="color"
                            onChange={this.createChangeHandler(this.handleColorChange)}
                            defaultValue={designSystem.backgroundColor}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        ltr&nbsp;
                        <input
                            type="radio"
                            name="direction"
                            value="ltr"
                            defaultChecked={designSystem.direction === "ltr"}
                            onChange={this.createChangeHandler(
                                this.handleDirectioinChange
                            )}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        rtl&nbsp;
                        <input
                            type="radio"
                            name="direction"
                            value="rtl"
                            defaultChecked={designSystem.direction === "rtl"}
                            onChange={this.createChangeHandler(
                                this.handleDirectioinChange
                            )}
                        />
                    </label>
                </div>
            </div>
        );
    }

    private createChangeHandler<T>(fn: (e: T) => void): (e: T) => void {
        return (e: T): void => {
            const event: T = e;
            fn(event);

            this.props.api.emit(ADDON_EVENT);
            this.forceUpdate();
        };
    }

    private handleColorChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        designSystemManager.update({ backgroundColor: e.target.value });
    };

    private handleDirectioinChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        designSystemManager.update({ direction: e.target.value as any });

        this.setIframeDirection(e.target.value);
    };

    /**
     * Set the dir attribute of the parent iframe
     */
    private setIframeDirection(direction: string): void {
        const frame: HTMLIFrameElement = document.getElementById(
            "storybook-preview-iframe"
        ) as HTMLIFrameElement;
        frame.contentDocument
            .getElementsByTagName("html")[0]
            .setAttribute("dir", direction);
    }
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

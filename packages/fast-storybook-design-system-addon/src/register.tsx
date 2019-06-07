import React from "react";
import { addons, types, RouteOptions, MatchOptions } from "@storybook/addons";
import { API } from "@storybook/api";
import { ADDON_ID, PANEL_ID } from "./constants";
import { RenderOptions } from "@storybook/api/dist/modules/addons";

interface DesignSystemPanelProps {
    api: API;
    active: boolean;
}

class DesignSystemPanel extends React.Component<DesignSystemPanelProps, {}> {
    render() {
        return <h1>Hello world</h1>;
    }

    componentDidMount() {
        const api = this.props.api;

        api.on("designSystem/doSomeAction", () => {
            alert("did somthing");
        });
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
                <DesignSystemPanel api={api} active={options.active} />
            ),
        });
    }
);

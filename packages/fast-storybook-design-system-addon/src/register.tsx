import { addons, MatchOptions, RouteOptions, types } from "@storybook/addons";
import { API } from "@storybook/api";
import { RenderOptions } from "@storybook/api/dist/modules/addons";
import React from "react";
import { ADDON_ID, PANEL_ID } from "./constants";
import { DesignSystemPanel } from "./panel";

/* eslint-disable react/display-name */
addons.register(ADDON_ID, (api: API): void => {
    addons.add(PANEL_ID, {
        title: "FAST DesignSystem",
        type: types.PANEL,
        route: (options: RouteOptions): string => `info/${options.storyId}`,
        match: (options: MatchOptions): boolean => options.viewMode === "info",
        render: (options: RenderOptions): JSX.Element => (
            <DesignSystemPanel key={options.key} api={api} active={options.active} />
        ),
    });
});
/* eslint-enable react/display-name */

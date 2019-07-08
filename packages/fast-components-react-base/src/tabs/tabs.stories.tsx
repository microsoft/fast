import { storiesOf } from "@storybook/react";
import React, { useState } from "react";
import Tabs from "./";
import { uniqueId } from "lodash-es";
import { Orientation } from "@microsoft/fast-web-utilities";

function renderTab(tabTitle: string): (className?: string) => React.ReactNode {
    return (className?: string): React.ReactNode => (
        <div className={className}>{tabTitle}</div>
    );
}

function renderTabContent(tabContent: string): (className?: string) => React.ReactNode {
    return (className?: string): React.ReactNode => (
        <div className={className}>{tabContent}</div>
    );
}

storiesOf("Tabs", module)
    .add("Default", () => (
        <Tabs
            label="A set of example text content"
            items={[
                {
                    tab: renderTab("Tab one"),
                    content: renderTabContent("Tab one content"),
                    id: uniqueId(),
                },
                {
                    tab: renderTab("Tab two"),
                    content: renderTabContent("Tab two content"),
                    id: uniqueId(),
                },
                {
                    tab: renderTab("Tab three"),
                    content: renderTabContent("Tab three content"),
                    id: uniqueId(),
                },
            ]}
        />
    ))
    .add("With children", () => (
        <Tabs
            label="A set of example text content"
            items={[
                {
                    tab: renderTab("Tab one"),
                    content: renderTabContent("Tab one content"),
                    id: uniqueId(),
                },
                {
                    tab: renderTab("Tab two"),
                    content: renderTabContent("Tab two content"),
                    id: uniqueId(),
                },
                {
                    tab: renderTab("Tab three"),
                    content: renderTabContent("Tab three content"),
                    id: uniqueId(),
                },
            ]}
        >
            Child content
        </Tabs>
    ))
    .add("vertical", () => (
        <Tabs
            label="A set of example text content"
            items={[
                {
                    tab: renderTab("Tab one"),
                    content: renderTabContent("Tab one content"),
                    id: uniqueId(),
                },
                {
                    tab: renderTab("Tab two"),
                    content: renderTabContent("Tab two content"),
                    id: uniqueId(),
                },
                {
                    tab: renderTab("Tab three"),
                    content: renderTabContent("Tab three content"),
                    id: uniqueId(),
                },
            ]}
            orientation={Orientation.vertical}
        />
    ));

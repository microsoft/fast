import * as React from "react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
import Tabs, {
    ITabsHandledProps,
    ITabsManagedClasses,
    ITabsUnhandledProps,
    Tab,
    TabItem,
    TabPanel
} from "./tabs";
import schema from "./tabs.schema.json";
import Documentation from "./.tmp/documentation";

function getTabItem(index: number): JSX.Element {
    return (
        <TabItem slot="tab-item" id={`tab0${index}`}>
            <Tab slot="tab">
                tab {index}
            </Tab>
            <TabPanel slot="tab-panel">
                tab {index} content
            </TabPanel>
        </TabItem>
    );
}

const detailChildren: JSX.Element[] = [
    getTabItem(1),
    getTabItem(2),
    getTabItem(3)
];

const exampleChildren1: JSX.Element[] = [
    (
        <TabItem slot="tab-item" id="tab01">
            <Tab slot="tab">
                tab 1 - missing panel
            </Tab>
        </TabItem>
    ),
    getTabItem(2),
    getTabItem(3),
    getTabItem(4)
];

const exampleChildren2: JSX.Element[] = [
    getTabItem(1),
    (
        <TabItem slot="tab-item" id="tab02">
            <TabPanel slot="tab-panel">
                tab 2 missing tab
            </TabPanel>
        </TabItem>
    ),
    getTabItem(3)
];

const exampleChildren3: JSX.Element[] = [];

const exampleChildren4: JSX.Element[] = [
    (
        <TabItem slot="tab-item" id="tab03" />
    )
];

const managedClasses: ITabsManagedClasses = {
    managedClasses: {
        tab: "tab-class",
        tab__active: "tab__active-class",
        tab_item: "tab_item-class",
        tab_list: "tab_list-class",
        tab_panel: "tab_panel-class",
        tabs: "tabs-class"
    }
};

const examples: ISnapshotTestSuite<ITabsHandledProps & ITabsManagedClasses> = {
    name: "Tabs",
    component: Tabs,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        ...managedClasses,
        children: detailChildren,
    },
    data: [
        {
            ...managedClasses,
            activeId: "tab04",
            children: exampleChildren1
        },
        {
            ...managedClasses,
            activeId: "tab03",
            children: exampleChildren2
        },
        {
            ...managedClasses,
            children: exampleChildren3
        },
        {
            ...managedClasses,
            children: exampleChildren4
        }
    ]
};

export default examples;

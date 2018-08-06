import * as React from "react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import {
    IManagedClasses,
    ITabClassNameContract,
    ITabPanelClassNameContract,
    ITabsClassNameContract
} from "@microsoft/fast-components-class-name-contracts-base";
import Tabs, {
    ITabsHandledProps,
    ITabsManagedClasses,
    ITabsUnhandledProps,
    Tab,
    TabItem,
    TabPanel,
    TabSlot
} from "./tabs";
import schema from "./tabs.schema.json";
import Documentation from "./.tmp/documentation";
import { Orientation } from "./tabs.props";

const tabsManagedClasses: ITabsClassNameContract = {
    tab_item: "tab_item-class",
    tab_list: "tab_list-class",
    tabs: "tabs-class"
};

const tabManagedClasses: ITabClassNameContract = {
    tab: "tab-class",
    tab__active: "tab__active-class"
};

const tabPanelManagedClasses: ITabPanelClassNameContract = {
    tab_panel: "tab_panel-class",
    tab_panel__hidden: "tab_panel__hidden-class"
};

function getTabItem(index: number): JSX.Element {
    return (
        <TabItem slot={TabSlot.tabItem} id={`tab0${index}`}>
            <Tab slot={TabSlot.tab} managedClasses={tabManagedClasses}>
                tab one
            </Tab>
            <TabPanel slot={TabSlot.tabPanel} managedClasses={tabPanelManagedClasses}>
                tab one content
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
        <TabItem slot={TabSlot.tabItem} id="tab01">
            <Tab slot={TabSlot.tab} managedClasses={tabManagedClasses}>
                tab one - missing panel
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
        <TabItem slot={TabSlot.tabItem} id="tab02">
            <TabPanel slot={TabSlot.tabPanel} managedClasses={tabPanelManagedClasses}>
                tab two missing tab
            </TabPanel>
        </TabItem>
    ),
    getTabItem(3)
];

const exampleChildren3: JSX.Element[] = [];

const exampleChildren4: JSX.Element[] = [
    (
        <TabItem slot={TabSlot.tabItem} id="tab03" />
    )
];

const examples: ISnapshotTestSuite<ITabsHandledProps & ITabsManagedClasses> = {
    name: "Tabs",
    component: Tabs,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        managedClasses: tabsManagedClasses,
        label: "A set of example text content",
        children: detailChildren,
    },
    data: [
        {
            managedClasses: tabsManagedClasses,
            activeId: "tab04",
            label: "A set of example text content",
            orientation: Orientation.horizontal,
            children: exampleChildren1
        },
        {
            managedClasses: tabsManagedClasses,
            activeId: "tab03",
            label: "A set of example text content",
            orientation: Orientation.vertical,
            children: exampleChildren2
        },
        {
            managedClasses: tabsManagedClasses,
            label: "A set of example text content",
            children: exampleChildren3
        },
        {
            managedClasses: tabsManagedClasses,
            label: "A set of example text content",
            children: exampleChildren4
        }
    ]
};

export default examples;

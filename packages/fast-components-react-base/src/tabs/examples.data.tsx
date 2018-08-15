import * as React from "react";
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
    TabsSlot
} from "./index";
import schema from "./tabs.schema.json";
import Documentation from "./.tmp/documentation";
import { Orientation } from "@microsoft/fast-web-utilities";
import { IComponentFactoryExample } from "@microsoft/fast-development-site-react";

const tabsManagedClasses: ITabsClassNameContract = {
    tabs_tabItems: "tab_items-class",
    tabs_tabList: "tab_list-class",
    tabs: "tabs-class"
};

const tabManagedClasses: ITabClassNameContract = {
    tab: "tab-class",
    tab__active: "tab__active-class"
};

const tabPanelManagedClasses: ITabPanelClassNameContract = {
    tabPanel: "tab_panel-class",
    tabPanel__hidden: "tab_panel__hidden-class"
};

/**
 * Example tab elements 1
 */
function getTabElementOne(): JSX.Element {
    return (
        <Tab slot={TabsSlot.tab} managedClasses={tabManagedClasses}>
            tab one
        </Tab>
    );
}

function getTabPanelOne(): JSX.Element {
    return (
        <TabPanel slot={TabsSlot.tabPanel} managedClasses={tabPanelManagedClasses}>
            tab one content
        </TabPanel>
    );
}

function getTabItemOne(): JSX.Element {
    return (
        <TabItem slot={TabsSlot.tabItem} id={`tab01`}>
            {getTabElementOne()}
            {getTabPanelOne()}
        </TabItem>
    );
}

/**
 * Example tab elements 2
 */
function getTabElementTwo(): JSX.Element {
    return (
        <Tab slot={TabsSlot.tab} managedClasses={tabManagedClasses}>
            tab two
        </Tab>
    );
}

function getTabPanelTwo(): JSX.Element {
    return (
        <TabPanel slot={TabsSlot.tabPanel} managedClasses={tabPanelManagedClasses}>
            tab two content
        </TabPanel>
    );
}

function getTabItemTwo(): JSX.Element {
    return (
        <TabItem slot={TabsSlot.tabItem} id={`tab02`}>
            {getTabElementTwo()}
            {getTabPanelTwo()}
        </TabItem>
    );
}

/**
 * Example tab elements 3
 */
function getTabElementThree(): JSX.Element {
    return (
        <Tab slot={TabsSlot.tab} managedClasses={tabManagedClasses}>
            tab three
        </Tab>
    );
}

function getTabPanelThree(): JSX.Element {
    return (
        <TabPanel slot={TabsSlot.tabPanel} managedClasses={tabPanelManagedClasses}>
            tab three content
        </TabPanel>
    );
}

function getTabItemThree(): JSX.Element {
    return (
        <TabItem slot={TabsSlot.tabItem} id={`tab03`}>
            {getTabElementThree()}
            {getTabPanelThree()}
        </TabItem>
    );
}

/**
 * Example tab elements 4
 */
function getTabElementFour(): JSX.Element {
    return (
        <Tab slot={TabsSlot.tab} managedClasses={tabManagedClasses}>
            tab four
        </Tab>
    );
}

function getTabPanelFour(): JSX.Element {
    return (
        <TabPanel slot={TabsSlot.tabPanel} managedClasses={tabPanelManagedClasses}>
            tab four content
        </TabPanel>
    );
}

function getTabItemFour(): JSX.Element {
    return (
        <TabItem slot={TabsSlot.tabItem} id={`tab04`}>
            {getTabElementFour()}
            {getTabPanelFour()}
        </TabItem>
    );
}

const detailChildren: JSX.Element[] = [
    getTabItemOne(),
    getTabItemTwo(),
    getTabItemThree()
];

const exampleChildren1: JSX.Element[] = [
    (
        <TabItem slot={TabsSlot.tabItem} id="tab01">
            <Tab slot={TabsSlot.tab} managedClasses={tabManagedClasses}>
                tab one - missing panel
            </Tab>
        </TabItem>
    ),
    getTabItemTwo(),
    getTabItemThree(),
    getTabItemFour()
];

const exampleChildren2: JSX.Element[] = [
    getTabItemOne(),
    (
        <TabItem slot={TabsSlot.tabItem} id="tab02">
            <TabPanel slot={TabsSlot.tabPanel} managedClasses={tabPanelManagedClasses}>
                tab two missing tab
            </TabPanel>
        </TabItem>
    ),
    getTabItemThree()
];

const exampleChildren3: JSX.Element[] = [];

const exampleChildren4: JSX.Element[] = [
    (
        <TabItem slot={TabsSlot.tabItem} id="tab03" />
    )
];

const examples: IComponentFactoryExample<ITabsHandledProps & ITabsManagedClasses> = {
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

import * as React from "react";
import {
    TabClassNameContract,
    TabPanelClassNameContract,
    TabsClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";
import Tabs, {
    Tab,
    TabItemProps,
    TabManagedClasses,
    TabPanel,
    TabPanelManagedClasses,
    TabsHandledProps,
    TabsItem,
    TabsManagedClasses,
    TabsSlot,
    TabsUnhandledProps,
} from "./index";
import schema from "./tabs.schema.json";
import tabItemSchema from "./tab-item.schema.json";
import tabPanelSchema from "./tab-panel.schema.json";
import tabSchema from "./tab.schema.json";
import Documentation from "./.tmp/documentation";
import { Orientation } from "@microsoft/fast-web-utilities";
import { ComponentFactoryExample } from "@microsoft/fast-development-site-react";

const tabsManagedClasses: TabsManagedClasses = {
    managedClasses: {
        tabs_tabPanels: "tab_items-class",
        tabs_tabList: "tab_list-class",
        tabs: "tabs-class",
        tabs_tabContent: "tabs_tab_content-class",
        tabs_tabPanelContent: "tabs_tabPanel_content-class",
        tab: "tab-class",
        tab__active: "tab__active-class",
        tabPanel: "tab_panel-class",
        tabPanel__hidden: "tab_panel__hidden-class",
    },
};

/**
 * @Deprecated 3.4.0
 */
function getTabElementOne(): any {
    return {
        id: tabSchema.id,
        props: {
            slot: TabsSlot.tab,
            children: "tab one",
        },
    };
}

/**
 * @Deprecated 3.4.0
 */
function getTabPanelOne(): any {
    return {
        id: tabPanelSchema.id,
        props: {
            slot: TabsSlot.tabPanel,
            children: "tab one content",
        },
    };
}

/**
 * @Deprecated 3.4.0
 */
function getTabItemOne(): any {
    return {
        id: tabItemSchema.id,
        props: {
            slot: TabsSlot.tabItem,
            id: "tab01",
            children: [getTabElementOne(), getTabPanelOne()],
        },
    };
}

/**
 * @Deprecated 3.4.0
 */
function getTabElementTwo(): any {
    return {
        id: tabSchema.id,
        props: {
            slot: TabsSlot.tab,
            children: "tab two",
        },
    };
}

/**
 * @Deprecated 3.4.0
 */
function getTabPanelTwo(): any {
    return {
        id: tabPanelSchema.id,
        props: {
            slot: TabsSlot.tabPanel,
            children: "tab two content",
        },
    };
}

/**
 * @Deprecated 3.4.0
 */
function getTabItemTwo(): any {
    return {
        id: tabItemSchema.id,
        props: {
            slot: TabsSlot.tabItem,
            id: "tab02",
            children: [getTabElementTwo(), getTabPanelTwo()],
        },
    };
}

/**
 * @Deprecated 3.4.0
 */
function getTabElementThree(): any {
    return {
        id: tabSchema.id,
        props: {
            slot: TabsSlot.tab,
            children: "tab three",
        },
    };
}

/**
 * @Deprecated 3.4.0
 */
function getTabPanelThree(): any {
    return {
        id: tabPanelSchema.id,
        props: {
            slot: TabsSlot.tabPanel,
            children: "tab three content",
        },
    };
}

/**
 * @Deprecated 3.4.0
 */
function getTabItemThree(): any {
    return {
        id: tabItemSchema.id,
        props: {
            slot: TabsSlot.tabItem,
            id: "tab03",
            children: [getTabElementThree(), getTabPanelThree()],
        },
    };
}

/**
 * @Deprecated 3.4.0
 */
function getTabElementFour(): any {
    return {
        id: tabSchema.id,
        props: {
            slot: TabsSlot.tab,
            children: "tab four",
        },
    };
}

/**
 * @Deprecated 3.4.0
 */
function getTabPanelFour(): any {
    return {
        id: tabPanelSchema.id,
        props: {
            slot: TabsSlot.tabPanel,
            children: "tab four content",
        },
    };
}

/**
 * @Deprecated 3.4.0
 */
function getTabItemFour(): any {
    return {
        id: tabItemSchema.id,
        props: {
            slot: TabsSlot.tabItem,
            id: "tab04",
            children: [getTabElementFour(), getTabPanelFour()],
        },
    };
}

/**
 * @Deprecated 3.4.0
 */
const detailChildren: any[] = [getTabItemOne(), getTabItemTwo(), getTabItemThree()];

/**
 * @Deprecated 3.4.0
 */
const exampleChildren1: any[] = [
    {
        id: tabItemSchema.id,
        props: {
            slot: TabsSlot.tabItem,
            id: "tab01",
            children: {
                id: tabSchema.id,
                props: {
                    slot: TabsSlot.tab,
                    children: "tab one - missing panel",
                },
            },
        },
    },
    getTabItemTwo(),
    getTabItemThree(),
    getTabItemFour(),
];

/**
 * @Deprecated 3.4.0
 */
const exampleChildren2: JSX.Element[] = [
    getTabItemOne(),
    {
        id: tabItemSchema.id,
        props: {
            slot: TabsSlot.tabItem,
            id: "tab02",
            children: {
                id: tabPanelSchema.id,
                props: {
                    slot: TabsSlot.tabPanel,
                    children: "tab two missing tab",
                },
            },
        },
    },
    getTabItemThree(),
];

/**
 * @Deprecated 3.4.0
 */
const exampleChildren3: JSX.Element[] = [];

/**
 * @Deprecated 3.4.0
 */
const exampleChildren4: any[] = [
    {
        id: tabItemSchema.id,
        props: {
            slot: TabsSlot.tabItem,
            id: "tab03",
        },
    },
];

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

const tabsItem1: TabsItem = {
    tab: renderTab("tab one"),
    content: renderTabContent("tab one content"),
    id: "tab01",
};

const tabsItem2: TabsItem = {
    tab: renderTab("tab two"),
    content: renderTabContent("tab two content"),
    id: "tab02",
};

const tabsItem3: TabsItem = {
    tab: renderTab("tab three"),
    content: renderTabContent("tab three content"),
    id: "tab03",
};

const tabsItem4: TabsItem = {
    tab: renderTab("tab four"),
    content: renderTabContent("tab four content"),
    id: "tab04",
};

const detailTabItem: TabsItem[] = [tabsItem1, tabsItem2, tabsItem3];

const exampleTabItem1: TabsItem[] = [
    {
        tab: renderTab(""),
        content: renderTabContent(""),
        id: "tab01",
    },
    tabsItem2,
    tabsItem3,
    tabsItem4,
];

const examples: ComponentFactoryExample<TabsHandledProps> = {
    name: "Tabs",
    component: Tabs,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        ...tabsManagedClasses,
        label: "A set of example text content",
        activeId: "tab03",
        items: detailTabItem,
        children: ["child 1", "child 2"],
    },
    data: [
        {
            ...tabsManagedClasses,
            label: "A set of example text content",
            items: detailTabItem,
            children: ["child 1", "child 2"],
        },
        {
            ...tabsManagedClasses,
            label: "A set of example text content",
            orientation: Orientation.horizontal,
            items: exampleTabItem1,
        },
        {
            /**
             * @Deprecated 3.4.0
             */
            ...tabsManagedClasses,
            activeId: "tab04",
            label: "A set of example text content",
            orientation: Orientation.horizontal,
            children: exampleChildren1,
        },
        {
            /**
             * @Deprecated 3.4.0
             */
            ...tabsManagedClasses,
            activeId: "tab03",
            label: "A set of example text content",
            orientation: Orientation.vertical,
            children: exampleChildren2,
        },
        {
            /**
             * @Deprecated 3.4.0
             */
            ...tabsManagedClasses,
            label: "A set of example text content",
            children: exampleChildren3,
        },
        {
            /**
             * @Deprecated 3.4.0
             */
            ...tabsManagedClasses,
            label: "A set of example text content",
            children: exampleChildren4,
        },
    ],
};

export default examples;

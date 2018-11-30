import * as React from "react";
import {
    TabClassNameContract,
    TabPanelClassNameContract,
    TabsClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";
import Tabs, {
    Tab,
    TabItemData,
    TabItem,
    TabManagedClasses,
    TabPanel,
    TabPanelManagedClasses,
    TabsHandledProps,
    TabsManagedClasses,
    TabsSlot,
    TabConfig,
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
    },
};

const tabManagedClasses: TabManagedClasses = {
    managedClasses: {
        tab: "tab-class",
        tab__active: "tab__active-class",
    },
};

const tabPanelManagedClasses: TabPanelManagedClasses = {
    managedClasses: {
        tabPanel: "tab_panel-class",
        tabPanel__hidden: "tab_panel__hidden-class",
    },
};

/**
 * Example tab elements 1
 */
function getTabElementOne(): any {
    return {
        id: tabSchema.id,
        props: {
            slot: TabsSlot.tab,
            ...tabManagedClasses,
            children: "tab one",
        },
    };
}

function getTabPanelOne(): any {
    return {
        id: tabPanelSchema.id,
        props: {
            slot: TabsSlot.tabPanel,
            ...tabPanelManagedClasses,
            children: "tab one content",
        },
    };
}

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
 * Example tab elements 2
 */
function getTabElementTwo(): any {
    return {
        id: tabSchema.id,
        props: {
            slot: TabsSlot.tab,
            ...tabManagedClasses,
            children: "tab two",
        },
    };
}

function getTabPanelTwo(): any {
    return {
        id: tabPanelSchema.id,
        props: {
            slot: TabsSlot.tabPanel,
            ...tabPanelManagedClasses,
            children: "tab two content",
        },
    };
}

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
 * Example tab elements 3
 */
function getTabElementThree(): any {
    return {
        id: tabSchema.id,
        props: {
            slot: TabsSlot.tab,
            ...tabManagedClasses,
            children: "tab three",
        },
    };
}

function getTabPanelThree(): any {
    return {
        id: tabPanelSchema.id,
        props: {
            slot: TabsSlot.tabPanel,
            ...tabPanelManagedClasses,
            children: "tab three content",
        },
    };
}

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
 * Example tab elements 4
 */
function getTabElementFour(): any {
    return {
        id: tabSchema.id,
        props: {
            slot: TabsSlot.tab,
            ...tabManagedClasses,
            children: "tab four",
        },
    };
}

function getTabPanelFour(): any {
    return {
        id: tabPanelSchema.id,
        props: {
            slot: TabsSlot.tabPanel,
            ...tabPanelManagedClasses,
            children: "tab four content",
        },
    };
}

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

const detailChildren: any[] = [getTabItemOne(), getTabItemTwo(), getTabItemThree()];

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
                    ...tabManagedClasses,
                    children: "tab one - missing panel",
                },
            },
        },
    },
    getTabItemTwo(),
    getTabItemThree(),
    getTabItemFour(),
];

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
                    ...tabPanelManagedClasses,
                    children: "tab two missing tab",
                },
            },
        },
    },
    getTabItemThree(),
];

const exampleChildren3: JSX.Element[] = [];

const exampleChildren4: any[] = [
    {
        id: tabItemSchema.id,
        props: {
            slot: TabsSlot.tabItem,
            id: "tab03",
        },
    },
];

function renderTab(tabTitle: string): () => React.ReactNode {
    return (className?: string): React.ReactNode => <div>{tabTitle}</div>;
}

function renderTabContent(tabContent: string): () => React.ReactNode {
    return (className?: string): React.ReactNode => <div>{tabContent}</div>;
}

const tabData: TabItemData[] = [
    {
        tab: renderTab("Tab One"),
        content: renderTabContent("Tab One Content"),
        id: "tab01",
    },
    {
        tab: renderTab("Tab Two"),
        content: renderTabContent("Tab Two Content"),
        id: "tab02",
    },
    {
        tab: renderTab("Tab Three"),
        content: renderTabContent("Tab Three Content"),
        id: "tab03",
    },
];

const examples: ComponentFactoryExample<TabsHandledProps> = {
    name: "Tabs",
    component: Tabs,
    schema: schema as any,
    documentation: <Documentation />,
    detailData: {
        ...tabsManagedClasses,
        label: "A set of example text content",
        tabItemData: tabData,
        activeId: "tab01",
    },
    data: [
        {
            ...tabsManagedClasses,
            activeId: "tab04",
            label: "A set of example text content",
            orientation: Orientation.horizontal,
            children: exampleChildren1,
        },
        {
            ...tabsManagedClasses,
            activeId: "tab03",
            label: "A set of example text content",
            orientation: Orientation.vertical,
            children: exampleChildren2,
        },
        {
            ...tabsManagedClasses,
            label: "A set of example text content",
            children: exampleChildren3,
        },
        {
            ...tabsManagedClasses,
            label: "A set of example text content",
            children: exampleChildren4,
        },
    ],
};

export default examples;

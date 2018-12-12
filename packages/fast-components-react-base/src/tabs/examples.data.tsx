import * as React from "react";
import {
    TabClassNameContract,
    TabPanelClassNameContract,
    TabsClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";
import Tabs, {
    Item,
    Tab,
    TabConfig,
    TabItemProps,
    TabManagedClasses,
    TabPanel,
    TabPanelManagedClasses,
    TabsHandledProps,
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

const tabItem1: Item = {
    tab: renderTab("tab one"),
    content: renderTabContent("tab one content"),
    id: "tab01",
};

const tabItem2: Item = {
    tab: renderTab("tab two"),
    content: renderTabContent("tab two content"),
    id: "tab02",
};

const tabItem3: Item = {
    tab: renderTab("tab three"),
    content: renderTabContent("tab three content"),
    id: "tab03",
};

const tabItem4: Item = {
    tab: renderTab("tab four"),
    content: renderTabContent("tab four content"),
    id: "tab04",
};

const detailTabItem: Item[] = [tabItem1, tabItem2, tabItem3];

const exampleTabItem1: Item[] = [
    {
        tab: renderTab(""),
        content: renderTabContent(""),
        id: "tab01",
    },
    tabItem2,
    tabItem3,
    tabItem4,
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

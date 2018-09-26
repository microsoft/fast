import * as React from "react";
import {
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
import tabItemSchema from "./tab-item.schema.json";
import tabPanelSchema from "./tab-panel.schema.json";
import tabSchema from "./tab.schema.json";
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
function getTabElementOne(): any {
    return {
        id: tabSchema.id,
        props: {
            slot: TabsSlot.tab,
            managedClasses: tabManagedClasses,
            children: "tab one"
        }
    };
}

function getTabPanelOne(): any {
    return {
        id: tabPanelSchema.id,
        props: {
            slot: TabsSlot.tabPanel,
            managedClasses: tabPanelManagedClasses,
            children: "tab one content"
        }
    };
}

function getTabItemOne(): any {
    return {
        id: tabItemSchema.id,
        props: {
            slot: TabsSlot.tabItem,
            id: "tab01",
            children: [
                getTabElementOne(),
                getTabPanelOne()
            ]
        }
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
            managedClasses: tabManagedClasses,
            children: "tab two"
        }
    };
}

function getTabPanelTwo(): any {
    return {
        id: tabPanelSchema.id,
        props: {
            slot: TabsSlot.tabPanel,
            managedClasses: tabPanelManagedClasses,
            children: "tab two content"
        }
    };
}

function getTabItemTwo(): any {
    return {
        id: tabItemSchema.id,
        props: {
            slot: TabsSlot.tabItem,
            id: "tab02",
            children: [
                getTabElementTwo(),
                getTabPanelTwo()
            ]
        }
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
            managedClasses: tabManagedClasses,
            children: "tab three"
        }
    };
}

function getTabPanelThree(): any {
    return {
        id: tabPanelSchema.id,
        props: {
            slot: TabsSlot.tabPanel,
            managedClasses: tabPanelManagedClasses,
            children: "tab three content"
        }
    };
}

function getTabItemThree(): any {
    return {
        id: tabItemSchema.id,
        props: {
            slot: TabsSlot.tabItem,
            id: "tab03",
            children: [
                getTabElementThree(),
                getTabPanelThree()
            ]
        }
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
            managedClasses: tabManagedClasses,
            children: "tab four"
        }
    };
}

function getTabPanelFour(): any {
    return {
        id: tabPanelSchema.id,
        props: {
            slot: TabsSlot.tabPanel,
            managedClasses: tabPanelManagedClasses,
            children: "tab four content"
        }
    };
}

function getTabItemFour(): any {
    return {
        id: tabItemSchema.id,
        props: {
            slot: TabsSlot.tabItem,
            id: "tab04",
            children: [
                getTabElementFour(),
                getTabPanelFour()
            ]
        }
    };
}

const detailChildren: any[] = [
    getTabItemOne(),
    getTabItemTwo(),
    getTabItemThree()
];

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
                    managedClasses: tabManagedClasses,
                    children: "tab one - missing panel"
                }
            }
        }
    },
    getTabItemTwo(),
    getTabItemThree(),
    getTabItemFour()
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
                    managedClasses: tabPanelManagedClasses,
                    children: "tab two missing tab"
                }
            }
        }
    },
    getTabItemThree()
];

const exampleChildren3: JSX.Element[] = [];

const exampleChildren4: any[] = [
    {
        id: tabItemSchema.id,
        props: {
            slot: TabsSlot.tabItem,
            id: "tab03"
        }
    }
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

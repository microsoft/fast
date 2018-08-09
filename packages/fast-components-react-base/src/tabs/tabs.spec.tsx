import * as React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { KeyCodes } from "@microsoft/fast-web-utilities";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import {
    ITabClassNameContract,
    ITabPanelClassNameContract,
    ITabsClassNameContract
} from "@microsoft/fast-components-class-name-contracts-base";
import {
    ITabsHandledProps,
    ITabsManagedClasses,
    ITabsUnhandledProps,
    Tab,
    TabItem,
    TabPanel,
    TabsProps,
    TabsSlot
} from "./index";

export enum CustomTabsSlot {
    tab = "customTab",
    tabItem = "customTabItem",
    tabPanel = "customTabPanel"
}

/*
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

describe("tabs snapshot", (): void => {
    generateSnapshots(examples);
});

describe("tabs", (): void => {
    const Component: React.ComponentClass<ITabsHandledProps & ITabsManagedClasses> = examples.component;
    const tabsManagedClasses: ITabsClassNameContract = {
            tabs: "tabs-class",
            tabs_tabList: "tab_list-class",
    };

    const tabPanelManagedClasses: ITabPanelClassNameContract = {
        tabPanel: "tab_panel-class",
        tabPanel__hidden: "tab_panel__hidden-class"
    };

    const tabManagedClasses: ITabClassNameContract = {
        tab: "tab-class",
        tab__active: "tab__active-class"
    };

    const children: JSX.Element[] = [
        (
            <TabItem key={1} slot={TabsSlot.tabItem} id="tab01">
                <Tab slot={TabsSlot.tab} managedClasses={tabManagedClasses}>
                    tab 1
                </Tab>
                <TabPanel slot={TabsSlot.tabPanel} managedClasses={tabPanelManagedClasses}>
                    tab 1 content
                </TabPanel>
            </TabItem>
        ),
        (
            <TabItem key={2} slot={TabsSlot.tabItem} id="tab02">
                <Tab slot={TabsSlot.tab} managedClasses={tabManagedClasses}>
                    tab 2
                </Tab>
                <TabPanel slot={TabsSlot.tabPanel} managedClasses={tabPanelManagedClasses}>
                    tab 2 content
                </TabPanel>
            </TabItem>
        ),
        (
            <TabItem key={3} slot={TabsSlot.tabItem} id="tab03">
                <Tab slot={TabsSlot.tab} managedClasses={tabManagedClasses}>
                    tab 3
                </Tab>
                <TabPanel slot={TabsSlot.tabPanel} managedClasses={tabPanelManagedClasses}>
                    tab 3 content
                </TabPanel>
            </TabItem>
        )
    ];
    const childrenMissingIds: JSX.Element[] = [
        (
            <TabItem key={1} slot={TabsSlot.tabItem} id={null}>
                <Tab slot={TabsSlot.tab} managedClasses={tabManagedClasses}>
                    tab 1
                </Tab>
                <TabPanel slot={TabsSlot.tabPanel} managedClasses={tabPanelManagedClasses}>
                    tab 1 content
                </TabPanel>
            </TabItem>
        ),
        (
            <TabItem key={2} slot={TabsSlot.tabItem} id={null}>
                <Tab slot={TabsSlot.tab} managedClasses={tabManagedClasses}>
                    tab 2
                </Tab>
                <TabPanel slot={TabsSlot.tabPanel} managedClasses={tabPanelManagedClasses}>
                    tab 2 content
                </TabPanel>
            </TabItem>
        )
    ];
    const childrenWithCustomSlots: JSX.Element[] = [
        (
            <TabItem key={1} slot={CustomTabsSlot.tabItem} id="tab01">
                <Tab slot={CustomTabsSlot.tab} managedClasses={tabManagedClasses}>
                    tab 1
                </Tab>
                <TabPanel slot={CustomTabsSlot.tabPanel} managedClasses={tabPanelManagedClasses}>
                    tab 1 content
                </TabPanel>
            </TabItem>
        ),
        (
            <TabItem key={2} slot={CustomTabsSlot.tabItem} id="tab02">
                <Tab slot={CustomTabsSlot.tab} managedClasses={tabManagedClasses}>
                    tab 2
                </Tab>
                <TabPanel slot={CustomTabsSlot.tabPanel} managedClasses={tabPanelManagedClasses}>
                    tab 2 content
                </TabPanel>
            </TabItem>
        ),
        (
            <TabItem key={3} slot={CustomTabsSlot.tabItem} id="tab03">
                <Tab slot={CustomTabsSlot.tab} managedClasses={tabManagedClasses}>
                    tab 3
                </Tab>
                <TabPanel slot={CustomTabsSlot.tabPanel} managedClasses={tabPanelManagedClasses}>
                    tab 3 content
                </TabPanel>
            </TabItem>
        )
    ];

    test("should return an object that includes all valid props which are not enumerated as handledProps", () => {
        const handledProps: ITabsHandledProps & ITabsManagedClasses = {
            managedClasses: tabsManagedClasses,
            children,
            label: "items"
        };
        const unhandledProps: ITabsUnhandledProps = {
            "aria-hidden": true
        };
        const props: TabsProps = {...handledProps, ...unhandledProps};

        const rendered: any = shallow(
            <Component {...props} />
        );

        expect(rendered.prop("aria-hidden")).not.toBe(undefined);
        expect(rendered.prop("aria-hidden")).toEqual(true);
    });

    test("should correctly handle children", () => {
        const renderedWithChildren: any = shallow(
            <Component managedClasses={tabsManagedClasses} label={"items"}>
                {children}
            </Component>
        );

        expect(renderedWithChildren.prop("children")).not.toBe(undefined);
        expect(renderedWithChildren.find("Tab").length).toEqual(3);
    });

    test("should generate an ID if none has been provided", () => {
        const renderedWithChildren: any = shallow(
            <Component managedClasses={tabsManagedClasses} label={"items"}>
                {childrenMissingIds}
            </Component>
        );

        expect(renderedWithChildren.prop("children")).not.toBe(undefined);
    });

    test("should correctly handle children when given custom slots", () => {
        const renderedWithChildren: any = shallow(
            <Component
                managedClasses={tabsManagedClasses}
                label={"items"}
                tabSlot={"customTab"}
                tabItemSlot={"customTabItem"}
                tabPanelSlot={"customTabPanel"}
            >
                {childrenWithCustomSlots}
            </Component>
        );

        expect(renderedWithChildren.prop("children")).not.toBe(undefined);
    });

    test("should allow a user to control the component from a callback", () => {
        const onUpdate: any = jest.fn();
        const rendered: any = mount(
            <Component
                managedClasses={tabsManagedClasses}
                onUpdateTab={onUpdate}
                children={children}
                activeId={"tab01"}
                label={"items"}
            />
        );

        const tab1: any = rendered.find("Tab").at(0);
        const tab2: any = rendered.find("Tab").at(1);

        expect(rendered.find("Tab").at(0).prop("tabIndex")).toEqual(0);
        expect(rendered.find("Tab").at(1).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("Tab").at(2).prop("tabIndex")).toEqual(-1);

        tab2.simulate("click", { currentTarget: { getAttribute: (): string => "tab02" }});

        expect(onUpdate).toBeCalledWith("tab02");

        expect(rendered.find("Tab").at(0).prop("tabIndex")).toEqual(0);
        expect(rendered.find("Tab").at(1).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("Tab").at(2).prop("tabIndex")).toEqual(-1);

        tab1.simulate("keydown", {keyCode: KeyCodes.arrowLeft});

        expect(onUpdate).toBeCalledWith("tab03");

        expect(rendered.find("Tab").at(0).prop("tabIndex")).toEqual(0);
        expect(rendered.find("Tab").at(1).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("Tab").at(2).prop("tabIndex")).toEqual(-1);

        tab1.simulate("keydown", {keyCode: KeyCodes.arrowUp});

        expect(onUpdate).toBeCalledWith("tab03");

        expect(rendered.find("Tab").at(0).prop("tabIndex")).toEqual(0);
        expect(rendered.find("Tab").at(1).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("Tab").at(2).prop("tabIndex")).toEqual(-1);

        tab1.simulate("keydown", {keyCode: KeyCodes.arrowRight});

        expect(onUpdate).toBeCalledWith("tab02");

        expect(rendered.find("Tab").at(0).prop("tabIndex")).toEqual(0);
        expect(rendered.find("Tab").at(1).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("Tab").at(2).prop("tabIndex")).toEqual(-1);

        tab1.simulate("keydown", {keyCode: KeyCodes.arrowDown});

        expect(onUpdate).toBeCalledWith("tab02");

        expect(rendered.find("Tab").at(0).prop("tabIndex")).toEqual(0);
        expect(rendered.find("Tab").at(1).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("Tab").at(2).prop("tabIndex")).toEqual(-1);

        tab1.simulate("keydown", {keyCode: KeyCodes.home});

        expect(onUpdate).toBeCalledWith("tab01");

        expect(rendered.find("Tab").at(0).prop("tabIndex")).toEqual(0);
        expect(rendered.find("Tab").at(1).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("Tab").at(2).prop("tabIndex")).toEqual(-1);

        tab1.simulate("keydown", {keyCode: KeyCodes.end});

        expect(onUpdate).toBeCalledWith("tab03");

        expect(rendered.find("Tab").at(0).prop("tabIndex")).toEqual(0);
        expect(rendered.find("Tab").at(1).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("Tab").at(2).prop("tabIndex")).toEqual(-1);

        rendered.setProps({ activeId: "tab02" });

        expect(rendered.find("Tab").at(0).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("Tab").at(1).prop("tabIndex")).toEqual(0);
        expect(rendered.find("Tab").at(2).prop("tabIndex")).toEqual(-1);
    });

    test("should not use the callback if it is not a function", () => {
        const rendered: any = shallow(
            <Component
                managedClasses={tabsManagedClasses}
                onUpdateTab={("test") as any}
                activeId={"tab01"}
                label={"items"}
            >
                {children}
            </Component>
        );

        rendered.find("Tab").at(0).simulate("keydown", {keyCode: KeyCodes.end});
        rendered.find("Tab").at(0).simulate("keydown", {keyCode: KeyCodes.home});
        rendered.find("Tab").at(0).simulate("keydown", {keyCode: KeyCodes.arrowLeft});
        rendered.find("Tab").at(0).simulate("keydown", {keyCode: KeyCodes.arrowRight});
        rendered.find("Tab").at(0).simulate("click", { currentTarget: { getAttribute: (): string => "tab02" }});
    });

    test("should allow an uncontrolled state where when navigation is available through click or keyboard action", () => {
        const rendered: any = mount(
            <Component managedClasses={tabsManagedClasses} children={children}  label={"items"} />
        );

        const tab1: any = rendered.find("Tab").at(0);
        const tab2: any = rendered.find("Tab").at(1);
        const tab3: any = rendered.find("Tab").at(2);

        expect(rendered.find("Tab").at(0).prop("tabIndex")).toEqual(0);
        expect(rendered.find("Tab").at(1).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("Tab").at(2).prop("tabIndex")).toEqual(-1);

        tab1.simulate("keydown", {keyCode: KeyCodes.arrowLeft});

        expect(rendered.find("Tab").at(0).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("Tab").at(1).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("Tab").at(2).prop("tabIndex")).toEqual(0);

        tab3.simulate("keydown", {keyCode: KeyCodes.arrowUp});

        expect(rendered.find("Tab").at(0).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("Tab").at(1).prop("tabIndex")).toEqual(0);
        expect(rendered.find("Tab").at(2).prop("tabIndex")).toEqual(-1);

        tab2.simulate("keydown", {keyCode: KeyCodes.arrowLeft});

        expect(rendered.find("Tab").at(0).prop("tabIndex")).toEqual(0);
        expect(rendered.find("Tab").at(1).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("Tab").at(2).prop("tabIndex")).toEqual(-1);

        tab1.simulate("keydown", {keyCode: KeyCodes.arrowRight});

        expect(rendered.find("Tab").at(0).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("Tab").at(1).prop("tabIndex")).toEqual(0);
        expect(rendered.find("Tab").at(2).prop("tabIndex")).toEqual(-1);

        tab2.simulate("keydown", {keyCode: KeyCodes.arrowDown});

        expect(rendered.find("Tab").at(0).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("Tab").at(1).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("Tab").at(2).prop("tabIndex")).toEqual(0);

        tab3.simulate("keydown", {keyCode: KeyCodes.arrowRight});

        expect(rendered.find("Tab").at(0).prop("tabIndex")).toEqual(0);
        expect(rendered.find("Tab").at(1).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("Tab").at(2).prop("tabIndex")).toEqual(-1);

        tab1.simulate("keydown", {keyCode: KeyCodes.end});

        expect(rendered.find("Tab").at(0).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("Tab").at(1).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("Tab").at(2).prop("tabIndex")).toEqual(0);

        tab1.simulate("keydown", {keyCode: KeyCodes.home});

        expect(rendered.find("Tab").at(0).prop("tabIndex")).toEqual(0);
        expect(rendered.find("Tab").at(1).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("Tab").at(2).prop("tabIndex")).toEqual(-1);

        tab2.simulate("click", { currentTarget: { getAttribute: (): string => "tab02" }});

        expect(rendered.find("Tab").at(0).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("Tab").at(1).prop("tabIndex")).toEqual(0);
        expect(rendered.find("Tab").at(2).prop("tabIndex")).toEqual(-1);
    });
});

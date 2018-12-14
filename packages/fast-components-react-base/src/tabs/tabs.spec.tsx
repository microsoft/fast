import React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { KeyCodes, Orientation } from "@microsoft/fast-web-utilities";
import { noop } from "lodash-es";
import {
    TabClassNameContract,
    TabPanelClassNameContract,
    TabsClassNameContract,
} from "@microsoft/fast-components-class-name-contracts-base";
import Tabs, {
    Tab,
    TabItem,
    TabPanel,
    TabsHandledProps,
    TabsManagedClasses,
    TabsProps,
    TabsSlot,
    TabsUnhandledProps,
} from "./index";

export enum CustomTabsSlot {
    tab = "customTab",
    tabItem = "customTabItem",
    tabPanel = "customTabPanel",
}

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("tabs", (): void => {
    const tabsManagedClasses: TabsClassNameContract = {
        tabs: "tabs-class",
        tabs_tabList: "tab_list-class",
    };

    const tabPanelManagedClasses: TabPanelClassNameContract = {
        tabPanel: "tab_panel-class",
        tabPanel__hidden: "tab_panel__hidden-class",
    };

    const tabManagedClasses: TabClassNameContract = {
        tab: "tab-class",
        tab__active: "tab__active-class",
    };

    const id0: string = "tab01";
    const id1: string = "tab02";
    const id2: string = "tab03";

    const children: JSX.Element[] = [
        <TabItem key={1} slot={TabsSlot.tabItem} id={id0}>
            <Tab slot={TabsSlot.tab} managedClasses={tabManagedClasses}>
                tab 1
            </Tab>
            <TabPanel slot={TabsSlot.tabPanel} managedClasses={tabPanelManagedClasses}>
                tab 1 content
            </TabPanel>
        </TabItem>,
        <TabItem key={2} slot={TabsSlot.tabItem} id={id1}>
            <Tab slot={TabsSlot.tab} managedClasses={tabManagedClasses}>
                tab 2
            </Tab>
            <TabPanel slot={TabsSlot.tabPanel} managedClasses={tabPanelManagedClasses}>
                tab 2 content
            </TabPanel>
        </TabItem>,
        <TabItem key={3} slot={TabsSlot.tabItem} id={id2}>
            <Tab slot={TabsSlot.tab} managedClasses={tabManagedClasses}>
                tab 3
            </Tab>
            <TabPanel slot={TabsSlot.tabPanel} managedClasses={tabPanelManagedClasses}>
                tab 3 content
            </TabPanel>
        </TabItem>,
    ];
    const childrenMissingIds: JSX.Element[] = [
        <TabItem key={1} slot={TabsSlot.tabItem} id={null}>
            <Tab slot={TabsSlot.tab} managedClasses={tabManagedClasses}>
                tab 1
            </Tab>
            <TabPanel slot={TabsSlot.tabPanel} managedClasses={tabPanelManagedClasses}>
                tab 1 content
            </TabPanel>
        </TabItem>,
        <TabItem key={2} slot={TabsSlot.tabItem} id={null}>
            <Tab slot={TabsSlot.tab} managedClasses={tabManagedClasses}>
                tab 2
            </Tab>
            <TabPanel slot={TabsSlot.tabPanel} managedClasses={tabPanelManagedClasses}>
                tab 2 content
            </TabPanel>
        </TabItem>,
    ];
    const childrenWithCustomSlots: JSX.Element[] = [
        <TabItem key={1} slot={CustomTabsSlot.tabItem} id={id0}>
            <Tab slot={CustomTabsSlot.tab} managedClasses={tabManagedClasses}>
                tab 1
            </Tab>
            <TabPanel
                slot={CustomTabsSlot.tabPanel}
                managedClasses={tabPanelManagedClasses}
            >
                tab 1 content
            </TabPanel>
        </TabItem>,
        <TabItem key={2} slot={CustomTabsSlot.tabItem} id={id1}>
            <Tab slot={CustomTabsSlot.tab} managedClasses={tabManagedClasses}>
                tab 2
            </Tab>
            <TabPanel
                slot={CustomTabsSlot.tabPanel}
                managedClasses={tabPanelManagedClasses}
            >
                tab 2 content
            </TabPanel>
        </TabItem>,
        <TabItem key={3} slot={CustomTabsSlot.tabItem} id={id2}>
            <Tab slot={CustomTabsSlot.tab} managedClasses={tabManagedClasses}>
                tab 3
            </Tab>
            <TabPanel
                slot={CustomTabsSlot.tabPanel}
                managedClasses={tabPanelManagedClasses}
            >
                tab 3 content
            </TabPanel>
        </TabItem>,
    ];

    test("should have a displayName that matches the component name", () => {
        expect((Tabs as any).name).toBe(Tabs.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<Tabs label="label" />);
        }).not.toThrow();
    });

    test("should have the role tablist on the element containing the tab elements", () => {
        const renderedWithChildren: any = shallow(
            <Tabs managedClasses={tabsManagedClasses} label={"items"}>
                {children}
            </Tabs>
        );

        expect(renderedWithChildren.find('[role="tablist"]')).toHaveLength(1);
    });

    test("should have the role tab on the tab element", () => {
        const renderedWithChildren: any = mount(
            <Tabs managedClasses={tabsManagedClasses} label={"items"}>
                {children}
            </Tabs>
        );

        expect(renderedWithChildren.find('[role="tab"]')).toHaveLength(3);
    });

    test("should have the role tabpanel on the tab panel", () => {
        const renderedWithChildren: any = mount(
            <Tabs managedClasses={tabsManagedClasses} label={"items"}>
                {children}
            </Tabs>
        );

        expect(renderedWithChildren.find('[role="tabpanel"]')).toHaveLength(3);
    });

    test("should have an aria-label if the label prop is passed", () => {
        const testLabel: string = "test label";
        const renderedWithChildren: any = mount(
            <Tabs managedClasses={tabsManagedClasses} label={testLabel}>
                {children}
            </Tabs>
        );

        expect(renderedWithChildren.find("[aria-label]").props()["aria-label"]).toBe(
            testLabel
        );
    });

    test("should have an aria-orientation if the orientation prop is passed", () => {
        const renderedWithChildren: any = mount(
            <Tabs managedClasses={tabsManagedClasses} label={"items"}>
                {children}
            </Tabs>
        );
        const renderedWithChildrenHorizontal: any = mount(
            <Tabs
                managedClasses={tabsManagedClasses}
                label={"items"}
                orientation={Orientation.horizontal}
            >
                {children}
            </Tabs>
        );
        const renderedWithChildrenVertical: any = mount(
            <Tabs
                managedClasses={tabsManagedClasses}
                label={"items"}
                orientation={Orientation.vertical}
            >
                {children}
            </Tabs>
        );

        expect(renderedWithChildren.find("[aria-orientation]")).toHaveLength(0);
        expect(
            renderedWithChildrenHorizontal.find("[aria-orientation]").props()[
                "aria-orientation"
            ]
        ).toBe(Orientation.horizontal);
        expect(
            renderedWithChildrenVertical.find("[aria-orientation]").props()[
                "aria-orientation"
            ]
        ).toBe(Orientation.vertical);
    });

    test("should use an id prop passed to a TabItem as aria-controls on the Tab and aria-labelledby on the TabPanel", () => {
        const renderedWithChildren: any = mount(
            <Tabs managedClasses={tabsManagedClasses} label={"items"}>
                {children}
            </Tabs>
        );

        expect(renderedWithChildren.find("Tab").get(0).props["aria-controls"]).toBe(id0);
        expect(
            renderedWithChildren.find("TabPanel").get(0).props["aria-labelledby"]
        ).toBe(id0);
        expect(renderedWithChildren.find("Tab").get(1).props["aria-controls"]).toBe(id1);
        expect(
            renderedWithChildren.find("TabPanel").get(1).props["aria-labelledby"]
        ).toBe(id1);
        expect(renderedWithChildren.find("Tab").get(2).props["aria-controls"]).toBe(id2);
        expect(
            renderedWithChildren.find("TabPanel").get(2).props["aria-labelledby"]
        ).toBe(id2);
    });

    test("should return an object that includes all valid props which are not enumerated as handledProps", () => {
        const handledProps: TabsHandledProps & TabsManagedClasses = {
            managedClasses: tabsManagedClasses,
            children,
            label: "items",
        };
        const unhandledProps: TabsUnhandledProps = {
            "aria-hidden": true,
        };
        const props: TabsProps = { ...handledProps, ...unhandledProps };

        const rendered: any = shallow(<Tabs {...props} />);

        expect(rendered.prop("aria-hidden")).not.toBe(undefined);
        expect(rendered.prop("aria-hidden")).toEqual(true);
    });

    test("should correctly handle children", () => {
        const renderedWithChildren: any = shallow(
            <Tabs managedClasses={tabsManagedClasses} label={"items"}>
                {children}
            </Tabs>
        );

        expect(renderedWithChildren.prop("children")).not.toBe(undefined);
        expect(renderedWithChildren.find("Tab").length).toEqual(3);
    });

    test("should generate an ID if none has been provided", () => {
        const renderedWithChildren: any = shallow(
            <Tabs managedClasses={tabsManagedClasses} label={"items"}>
                {childrenMissingIds}
            </Tabs>
        );

        expect(renderedWithChildren.prop("children")).not.toBe(undefined);
    });

    test("should correctly handle children when given custom slots", () => {
        const renderedWithChildren: any = shallow(
            <Tabs
                managedClasses={tabsManagedClasses}
                label={"items"}
                tabSlot={"customTab"}
                tabItemSlot={"customTabItem"}
                tabPanelSlot={"customTabPanel"}
            >
                {childrenWithCustomSlots}
            </Tabs>
        );

        expect(renderedWithChildren.prop("children")).not.toBe(undefined);
    });

    test("should allow a user to control the component from a callback", () => {
        const onUpdate: any = jest.fn();
        const rendered: any = mount(
            <Tabs
                managedClasses={tabsManagedClasses}
                onUpdate={onUpdate}
                children={children}
                activeId={id0}
                label={"items"}
            />
        );

        const tab1: any = rendered.find("Tab").at(0);
        const tab2: any = rendered.find("Tab").at(1);

        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("tabIndex")
        ).toEqual(0);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("active")
        ).toBe(true);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("active")
        ).toBe(false);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("active")
        ).toBe(false);

        tab2.simulate("click", {
            currentTarget: { getAttribute: (): string => id1 },
        });

        expect(onUpdate).toBeCalledWith(id1);

        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("tabIndex")
        ).toEqual(0);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("active")
        ).toBe(true);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("active")
        ).toBe(false);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("active")
        ).toBe(false);

        tab1.simulate("keydown", { keyCode: KeyCodes.arrowLeft });

        expect(onUpdate).toBeCalledWith(id2);

        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("tabIndex")
        ).toEqual(0);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("active")
        ).toBe(true);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("active")
        ).toBe(false);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("active")
        ).toBe(false);

        tab1.simulate("keydown", { keyCode: KeyCodes.arrowUp });

        expect(onUpdate).toBeCalledWith(id2);

        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("tabIndex")
        ).toEqual(0);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("active")
        ).toBe(true);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("active")
        ).toBe(false);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("active")
        ).toBe(false);

        tab1.simulate("keydown", { keyCode: KeyCodes.arrowRight });

        expect(onUpdate).toBeCalledWith(id1);

        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("tabIndex")
        ).toEqual(0);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("active")
        ).toBe(true);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("active")
        ).toBe(false);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("active")
        ).toBe(false);

        tab1.simulate("keydown", { keyCode: KeyCodes.arrowDown });

        expect(onUpdate).toBeCalledWith(id1);

        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("tabIndex")
        ).toEqual(0);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("active")
        ).toBe(true);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("active")
        ).toBe(false);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("active")
        ).toBe(false);

        tab1.simulate("keydown", { keyCode: KeyCodes.home });

        expect(onUpdate).toBeCalledWith(id0);

        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("tabIndex")
        ).toEqual(0);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("active")
        ).toBe(true);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("active")
        ).toBe(false);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("active")
        ).toBe(false);

        tab1.simulate("keydown", { keyCode: KeyCodes.end });

        expect(onUpdate).toBeCalledWith(id2);

        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("tabIndex")
        ).toEqual(0);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("active")
        ).toBe(true);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("active")
        ).toBe(false);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("active")
        ).toBe(false);

        rendered.setProps({ activeId: id1 });

        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("tabIndex")
        ).toEqual(0);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("active")
        ).toBe(false);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("active")
        ).toBe(true);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("active")
        ).toBe(false);
    });

    test("should not use the callback if it is not a function", () => {
        const rendered: any = shallow(
            <Tabs
                managedClasses={tabsManagedClasses}
                onUpdate={noop}
                activeId={id0}
                label={"items"}
            >
                {children}
            </Tabs>
        );

        rendered
            .find("Tab")
            .at(0)
            .simulate("keydown", { keyCode: KeyCodes.end });
        rendered
            .find("Tab")
            .at(0)
            .simulate("keydown", { keyCode: KeyCodes.home });
        rendered
            .find("Tab")
            .at(0)
            .simulate("keydown", { keyCode: KeyCodes.arrowLeft });
        rendered
            .find("Tab")
            .at(0)
            .simulate("keydown", { keyCode: KeyCodes.arrowRight });
        rendered
            .find("Tab")
            .at(0)
            .simulate("click", {
                currentTarget: { getAttribute: (): string => id1 },
            });
    });

    test("should allow an uncontrolled state where when navigation is available through click or keyboard action", () => {
        const rendered: any = mount(
            <Tabs
                managedClasses={tabsManagedClasses}
                children={children}
                label={"items"}
            />
        );

        const tab1: any = rendered.find("Tab").at(0);
        const tab2: any = rendered.find("Tab").at(1);
        const tab3: any = rendered.find("Tab").at(2);

        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("tabIndex")
        ).toEqual(0);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("active")
        ).toBe(true);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("active")
        ).toBe(false);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("active")
        ).toBe(false);

        tab1.simulate("keydown", { keyCode: KeyCodes.arrowLeft });

        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("tabIndex")
        ).toEqual(0);
        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("active")
        ).toBe(false);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("active")
        ).toBe(false);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("active")
        ).toBe(true);

        tab3.simulate("keydown", { keyCode: KeyCodes.arrowUp });

        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("tabIndex")
        ).toEqual(0);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("active")
        ).toBe(false);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("active")
        ).toBe(true);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("active")
        ).toBe(false);

        tab2.simulate("keydown", { keyCode: KeyCodes.arrowLeft });

        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("tabIndex")
        ).toEqual(0);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("active")
        ).toBe(true);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("active")
        ).toBe(false);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("active")
        ).toBe(false);

        tab1.simulate("keydown", { keyCode: KeyCodes.arrowRight });

        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("tabIndex")
        ).toEqual(0);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("active")
        ).toBe(false);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("active")
        ).toBe(true);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("active")
        ).toBe(false);

        tab2.simulate("keydown", { keyCode: KeyCodes.arrowDown });

        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("tabIndex")
        ).toEqual(0);
        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("active")
        ).toBe(false);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("active")
        ).toBe(false);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("active")
        ).toBe(true);

        tab3.simulate("keydown", { keyCode: KeyCodes.arrowRight });

        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("tabIndex")
        ).toEqual(0);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("active")
        ).toBe(true);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("active")
        ).toBe(false);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("active")
        ).toBe(false);

        tab1.simulate("keydown", { keyCode: KeyCodes.end });

        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("tabIndex")
        ).toEqual(0);
        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("active")
        ).toBe(false);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("active")
        ).toBe(false);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("active")
        ).toBe(true);

        tab1.simulate("keydown", { keyCode: KeyCodes.home });

        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("tabIndex")
        ).toEqual(0);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("active")
        ).toBe(true);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("active")
        ).toBe(false);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("active")
        ).toBe(false);

        tab2.simulate("click", {
            currentTarget: { getAttribute: (): string => id1 },
        });

        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("tabIndex")
        ).toEqual(0);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("tabIndex")
        ).toEqual(-1);
        expect(
            rendered
                .find("Tab")
                .at(0)
                .prop("active")
        ).toBe(false);
        expect(
            rendered
                .find("Tab")
                .at(1)
                .prop("active")
        ).toBe(true);
        expect(
            rendered
                .find("Tab")
                .at(2)
                .prop("active")
        ).toBe(false);
    });
});

describe("Tab", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect((Tab as any).name).toBe(Tab.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<Tab slot={TabsSlot.tab} />);
            shallow(<Tab slot={TabsSlot.tab} selected={true} />);
        }).not.toThrow();
    });
});

describe("TabItem", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect((TabItem as any).name).toBe(TabItem.displayName);
    });
});

describe("TabPanel", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect((TabPanel as any).name).toBe(TabPanel.displayName);
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<TabPanel slot={TabsSlot.tabPanel} />);
            shallow(<TabPanel slot={TabsSlot.tabPanel} aria-hidden={true} />);
        }).not.toThrow();
    });
});

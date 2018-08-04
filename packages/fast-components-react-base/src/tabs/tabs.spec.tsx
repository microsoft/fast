import * as React from "react";
import * as ShallowRenderer from "react-test-renderer/shallow";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { KeyCodes } from "@microsoft/fast-web-utilities";
import examples from "./examples.data";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import {
    ITabsHandledProps,
    ITabsManagedClasses,
    ITabsUnhandledProps,
    Tab,
    TabItem,
    TabPanel,
    TabSlot,
    TabsProps
} from "./tabs";

/*
 * Configure Enzyme
 */
configure({adapter: new Adapter()});

describe("tabs snapshot", (): void => {
    generateSnapshots(examples);
});

describe("tabs", (): void => {
    const Component: React.ComponentClass<ITabsHandledProps & ITabsManagedClasses> = examples.component;
    const managedClasses: ITabsManagedClasses = {
        managedClasses: {
            tab: "tab-class",
            tabs: "tabs-class",
            tab__active: "tab__active-class",
            tab_panel: "tab_panel-class",
            tab_list: "tab_list-class",
            tab_item: "tab_item-class"
        }
    };
    const children: JSX.Element[] = [
        (
            <TabItem key={1} slot={TabSlot.tabItem} id="tab01">
                <Tab slot={TabSlot.tab}>
                    tab 1
                </Tab>
                <TabPanel slot={TabSlot.tabPanel}>
                    tab 1 content
                </TabPanel>
            </TabItem>
        ),
        (
            <TabItem key={2} slot={TabSlot.tabItem} id="tab02">
                <Tab slot={TabSlot.tab}>
                    tab 2
                </Tab>
                <TabPanel slot={TabSlot.tabPanel}>
                    tab 2 content
                </TabPanel>
            </TabItem>
        ),
        (
            <TabItem key={3} slot={TabSlot.tabItem} id="tab03">
                <Tab slot={TabSlot.tab}>
                    tab 3
                </Tab>
                <TabPanel slot={TabSlot.tabPanel}>
                    tab 3 content
                </TabPanel>
            </TabItem>
        )
    ];
    const childrenMissingIds: JSX.Element[] = [
        (
            <TabItem key={1} slot={TabSlot.tabItem} id={null}>
                <Tab slot={TabSlot.tab}>
                    tab 1
                </Tab>
                <TabPanel slot={TabSlot.tabPanel}>
                    tab 1 content
                </TabPanel>
            </TabItem>
        ),
        (
            <TabItem key={2} slot={TabSlot.tabItem} id={null}>
                <Tab slot={TabSlot.tab}>
                    tab 2
                </Tab>
                <TabPanel slot={TabSlot.tabPanel}>
                    tab 2 content
                </TabPanel>
            </TabItem>
        )
    ];

    test("should return an object that includes all valid props which are not enumerated as handledProps", () => {
        const handledProps: ITabsHandledProps & ITabsManagedClasses = {
            ...managedClasses,
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
            <Component managedClasses={managedClasses.managedClasses} label={"items"}>
                {children}
            </Component>
        );
        const renderedWithoutChildren: any = shallow(
            <Component managedClasses={managedClasses.managedClasses} label={"items"} />
        );

        expect(renderedWithChildren.prop("children")).not.toBe(undefined);
        expect(renderedWithChildren.find(".tab-class").length).toEqual(3);
        expect(renderedWithoutChildren.prop("children")).toBe(undefined);
    });

    test("should generate an ID if none has been provided", () => {
        const renderedWithChildren: any = shallow(
            <Component managedClasses={managedClasses.managedClasses} label={"items"}>
                {childrenMissingIds}
            </Component>
        );

        expect(renderedWithChildren.prop("children")).not.toBe(undefined);
    });

    test("should allow a user to control the component from a callback", () => {
        const onUpdate: any = jest.fn();
        const rendered: any = shallow(
            <Component
                managedClasses={managedClasses.managedClasses}
                onUpdateTab={onUpdate}
                children={children}
                activeId={"tab01"}
                label={"items"}
            />
        );

        const tab1: any = rendered.find("button").at(0);
        const tab2: any = rendered.find("button").at(1);

        expect(rendered.find("button").at(0).prop("tabIndex")).toEqual(0);
        expect(rendered.find("button").at(1).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("button").at(2).prop("tabIndex")).toEqual(-1);

        tab2.simulate("click", { currentTarget: { getAttribute: (): string => "tab02" }});

        expect(onUpdate).toBeCalledWith("tab02");

        expect(rendered.find("button").at(0).prop("tabIndex")).toEqual(0);
        expect(rendered.find("button").at(1).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("button").at(2).prop("tabIndex")).toEqual(-1);

        tab1.simulate("keydown", {keyCode: KeyCodes.arrowLeft});

        expect(onUpdate).toBeCalledWith("tab03");

        expect(rendered.find("button").at(0).prop("tabIndex")).toEqual(0);
        expect(rendered.find("button").at(1).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("button").at(2).prop("tabIndex")).toEqual(-1);

        tab1.simulate("keydown", {keyCode: KeyCodes.arrowUp});

        expect(onUpdate).toBeCalledWith("tab03");

        expect(rendered.find("button").at(0).prop("tabIndex")).toEqual(0);
        expect(rendered.find("button").at(1).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("button").at(2).prop("tabIndex")).toEqual(-1);

        tab1.simulate("keydown", {keyCode: KeyCodes.arrowRight});

        expect(onUpdate).toBeCalledWith("tab02");

        expect(rendered.find("button").at(0).prop("tabIndex")).toEqual(0);
        expect(rendered.find("button").at(1).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("button").at(2).prop("tabIndex")).toEqual(-1);

        tab1.simulate("keydown", {keyCode: KeyCodes.arrowDown});

        expect(onUpdate).toBeCalledWith("tab02");

        expect(rendered.find("button").at(0).prop("tabIndex")).toEqual(0);
        expect(rendered.find("button").at(1).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("button").at(2).prop("tabIndex")).toEqual(-1);

        tab1.simulate("keydown", {keyCode: KeyCodes.home});

        expect(onUpdate).toBeCalledWith("tab01");

        expect(rendered.find("button").at(0).prop("tabIndex")).toEqual(0);
        expect(rendered.find("button").at(1).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("button").at(2).prop("tabIndex")).toEqual(-1);

        tab1.simulate("keydown", {keyCode: KeyCodes.end});

        expect(onUpdate).toBeCalledWith("tab03");

        expect(rendered.find("button").at(0).prop("tabIndex")).toEqual(0);
        expect(rendered.find("button").at(1).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("button").at(2).prop("tabIndex")).toEqual(-1);

        rendered.setProps({ activeId: "tab02" });

        expect(rendered.find("button").at(0).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("button").at(1).prop("tabIndex")).toEqual(0);
        expect(rendered.find("button").at(2).prop("tabIndex")).toEqual(-1);
    });

    test("should not use the callback if it is not a function", () => {
        const rendered: any = shallow(
            <Component
                managedClasses={managedClasses.managedClasses}
                onUpdateTab={("test") as any}
                activeId={"tab01"}
                label={"items"}
            >
                {children}
            </Component>
        );

        rendered.find("button").at(0).simulate("keydown", {keyCode: KeyCodes.end});
        rendered.find("button").at(0).simulate("keydown", {keyCode: KeyCodes.home});
        rendered.find("button").at(0).simulate("keydown", {keyCode: KeyCodes.arrowLeft});
        rendered.find("button").at(0).simulate("keydown", {keyCode: KeyCodes.arrowRight});
        rendered.find("button").at(0).simulate("click", { currentTarget: { getAttribute: (): string => "tab02" }});
    }

    test("should allow an uncontrolled state where when navigation is available through click or keyboard action", () => {
        const rendered: any = mount(
            <Component managedClasses={managedClasses.managedClasses} children={children}  label={"items"} />
        );

        const tab1: any = rendered.find("button").at(0);
        const tab2: any = rendered.find("button").at(1);
        const tab3: any = rendered.find("button").at(2);

        expect(rendered.find("button").at(0).prop("tabIndex")).toEqual(0);
        expect(rendered.find("button").at(1).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("button").at(2).prop("tabIndex")).toEqual(-1);

        tab1.simulate("keydown", {keyCode: KeyCodes.arrowLeft});

        expect(rendered.find("button").at(0).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("button").at(1).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("button").at(2).prop("tabIndex")).toEqual(0);

        tab3.simulate("keydown", {keyCode: KeyCodes.arrowUp});

        expect(rendered.find("button").at(0).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("button").at(1).prop("tabIndex")).toEqual(0);
        expect(rendered.find("button").at(2).prop("tabIndex")).toEqual(-1);

        tab2.simulate("keydown", {keyCode: KeyCodes.arrowLeft});

        expect(rendered.find("button").at(0).prop("tabIndex")).toEqual(0);
        expect(rendered.find("button").at(1).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("button").at(2).prop("tabIndex")).toEqual(-1);

        tab1.simulate("keydown", {keyCode: KeyCodes.arrowRight});

        expect(rendered.find("button").at(0).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("button").at(1).prop("tabIndex")).toEqual(0);
        expect(rendered.find("button").at(2).prop("tabIndex")).toEqual(-1);

        tab2.simulate("keydown", {keyCode: KeyCodes.arrowDown});

        expect(rendered.find("button").at(0).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("button").at(1).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("button").at(2).prop("tabIndex")).toEqual(0);

        tab3.simulate("keydown", {keyCode: KeyCodes.arrowRight});

        expect(rendered.find("button").at(0).prop("tabIndex")).toEqual(0);
        expect(rendered.find("button").at(1).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("button").at(2).prop("tabIndex")).toEqual(-1);

        tab1.simulate("keydown", {keyCode: KeyCodes.end});

        expect(rendered.find("button").at(0).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("button").at(1).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("button").at(2).prop("tabIndex")).toEqual(0);

        tab1.simulate("keydown", {keyCode: KeyCodes.home});

        expect(rendered.find("button").at(0).prop("tabIndex")).toEqual(0);
        expect(rendered.find("button").at(1).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("button").at(2).prop("tabIndex")).toEqual(-1);

        tab2.simulate("click", { currentTarget: { getAttribute: (): string => "tab02" }});

        expect(rendered.find("button").at(0).prop("tabIndex")).toEqual(-1);
        expect(rendered.find("button").at(1).prop("tabIndex")).toEqual(0);
        expect(rendered.find("button").at(2).prop("tabIndex")).toEqual(-1);
    });
});

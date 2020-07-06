import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { Orientation } from "@microsoft/fast-web-utilities";
import { ConstructibleResizeObserver, DisplayNamePrefix } from "../utilities";
import StackPanel, {
    StackPanelClassNameContract,
    StackPanelUnhandledProps,
} from "./stack-panel";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const managedClasses: StackPanelClassNameContract = {
    stackPanel: "stackPanel",
    stackPanel__scrollable: "stackPanel__scrollable",
    stackPanel_items: "stackPanel_itemContainer",
};

const itemSpans: number[] = [120, 180, 240, 120, 640, 200, 220, 170, 160, 240, 110, 270];

const sampleStackPanelItems: JSX.Element[] = [
    "item1",
    "item2",
    "item3",
    "item4",
    "item5",
    "item6",
    "item7",
    "item8",
    "item9",
    "item10",
    "item11",
    "item12",
].map(
    (src: string, index: number): JSX.Element => {
        return (
            <div
                key={index}
                style={{
                    padding: "0px",
                    width: "100px",
                    height: "100px",
                }}
            >
                {src}
            </div>
        );
    }
);

/* tslint:disable:no-string-literal */
describe("stack panel", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect(`${DisplayNamePrefix}${(StackPanel as any).name}`).toBe(
            StackPanel.displayName
        );
    });
    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<StackPanel />);
        }).not.toThrow();
    });
    test("should implement unhandledProps", (): void => {
        const unhandledProps: StackPanelUnhandledProps = {
            "aria-label": "label",
        };
        const rendered: any = shallow(<StackPanel {...unhandledProps} />);
        expect(rendered.first().prop("aria-label")).toEqual("label");
    });

    test("getViewportSpan returns expected value when orientation is vertical", (): void => {
        const rendered: any = mount(
            <StackPanel orientation={Orientation.vertical}>item</StackPanel>
        );

        rendered.first().instance().rootElement.current = {
            clientHeight: 100,
            clientWidth: 200,
        };
        expect(rendered.first().instance()["getViewportSpan"]()).toBe(100);
    });

    test("getViewportSpan returns expected value when orientation is horizontal", (): void => {
        const rendered: any = mount(
            <StackPanel orientation={Orientation.horizontal}>item</StackPanel>
        );

        rendered.first().instance().rootElement.current = {
            clientHeight: 100,
            clientWidth: 200,
        };
        expect(rendered.first().instance()["getViewportSpan"]()).toBe(200);
    });

    test("getScrollIntoViewPosition returns expected values", (): void => {
        const rendered: any = mount(
            <StackPanel itemSpan={itemSpans}>{sampleStackPanelItems}</StackPanel>
        );

        rendered.first().instance().viewportSpan = 200;
        expect(rendered.first().instance()["getScrollIntoViewPosition"](0)).toBe(0);
        expect(rendered.first().instance()["getScrollIntoViewPosition"](4)).toBe(660);
        expect(rendered.first().instance()["getScrollIntoViewPosition"](11)).toBe(2400);
    });

    test("getMaxScrollDistance returns value corresponding to height of items and viewport", (): void => {
        const rendered: any = mount(
            <StackPanel itemSpan={itemSpans}>{sampleStackPanelItems}</StackPanel>
        );

        rendered.first().instance().viewportSpan = 200;
        expect(rendered.first().instance()["getMaxScrollDistance"]()).toBe(2470);
    });

    test("getMaxScrollDistance returns 0 when there are no items", (): void => {
        const rendered: any = mount(<StackPanel />);

        rendered.first().instance().viewportSpan = 200;
        expect(rendered.first().instance()["getMaxScrollDistance"]()).toBe(0);
    });

    test("should create a resize observer if it is available", (): void => {
        const ActualObserver: ConstructibleResizeObserver = ((window as unknown) as WindowWithResizeObserver)
            .ResizeObserver;
        const construct: jest.Mock<any, any> = jest.fn();
        // Mock the resize observer
        class MockObserver {
            public observe: jest.Mock<any, any> = jest.fn();
            public unobserve: jest.Mock<any, any> = jest.fn();
            public disconnect: jest.Mock<any, any> = jest.fn();
            constructor() {
                construct();
            }
        }
        ((window as unknown) as WindowWithResizeObserver).ResizeObserver = MockObserver;

        // Render the component
        mount(<StackPanel>{sampleStackPanelItems}</StackPanel>);

        expect(construct).toBeCalledTimes(1);
        // Replace the window to it's original state
        ((window as unknown) as WindowWithResizeObserver).ResizeObserver = ActualObserver;
    });

    test("should disconnect the resize observer when unmounted", (): void => {
        const ActualObserver: ConstructibleResizeObserver = ((window as unknown) as WindowWithResizeObserver)
            .ResizeObserver;
        const disconnect: jest.Mock<any, any> = jest.fn();
        // Mock the resize observer
        // tslint:disable-next-line:max-classes-per-file
        class MockObserver {
            public observe: jest.Mock<any, any> = jest.fn();
            public unobserve: jest.Mock<any, any> = jest.fn();
            public disconnect: jest.Mock<any, any> = disconnect;
        }
        ((window as unknown) as WindowWithResizeObserver).ResizeObserver = MockObserver;

        const rendered: any = mount(<StackPanel>{sampleStackPanelItems}</StackPanel>);
        // Unmount the component to trigger lifecycle methods
        rendered.unmount();

        expect(disconnect).toBeCalledTimes(1);
        // Replace the window to it's original state
        ((window as unknown) as WindowWithResizeObserver).ResizeObserver = ActualObserver;
    });

    test("getDirection should return direction value when the ltr prop is passed", (): void => {
        const rendered: any = mount(
            <StackPanel dir="ltr" orientation={Orientation.horizontal}>
                {sampleStackPanelItems}
            </StackPanel>
        );
        expect(rendered.instance()["getDirection"]()).toEqual("ltr");
    });

    test("getDirection should return direction value when the rtl prop is passed", (): void => {
        const rendered: any = mount(
            <StackPanel dir="rtl" orientation={Orientation.horizontal}>
                {sampleStackPanelItems}
            </StackPanel>
        );
        expect(rendered.instance()["getDirection"]()).toEqual("rtl");
    });

    test("getDirection should return direction ltr when current ref is invalid", (): void => {
        const rendered: any = mount(
            <StackPanel dir="rtl" orientation={Orientation.horizontal}>
                {sampleStackPanelItems}
            </StackPanel>
        );
        rendered.instance().rootElement.current = null;
        expect(rendered.instance()["getDirection"]()).toEqual("ltr");
    });

    test("setting and getting scroll position returns expected scroll values in ltr", (): void => {
        const rendered: any = mount(
            <StackPanel dir="ltr">{sampleStackPanelItems}</StackPanel>
        );
        expect(rendered.instance()["getScrollPosition"]()).toEqual(0);
        rendered.instance()["setScrollPosition"](100);
        expect(rendered.instance()["getScrollPosition"]()).toEqual(100);
    });

    test("setting and getting scroll position works in rtl", (): void => {
        const rendered: any = mount(
            <StackPanel dir="rtl">{sampleStackPanelItems}</StackPanel>
        );
        expect(rendered.instance()["getScrollPosition"]()).toEqual(0);
        rendered.instance()["setScrollPosition"](100);
        expect(rendered.instance()["getScrollPosition"]()).toEqual(100);
    });

    test("getScrollIntoViewPosition returns 0 when there are no children", (): void => {
        const rendered: any = mount(<StackPanel />);
        expect(rendered.instance()["getScrollIntoViewPosition"](0)).toEqual(0);
    });

    test("Root classname is applied", () => {
        const rendered: any = mount(
            <StackPanel managedClasses={managedClasses}>
                {sampleStackPanelItems}
            </StackPanel>
        );
        expect(rendered.instance().rootElement.current.className).toContain(
            managedClasses.stackPanel
        );
    });

    test("Item container classname is applied", () => {
        const rendered: any = mount(
            <StackPanel managedClasses={managedClasses}>
                {sampleStackPanelItems}
            </StackPanel>
        );
        expect(rendered.instance().itemContainerElement.current.className).toContain(
            managedClasses.stackPanel_items
        );
    });

    test("isScrollable classname not applied when component does not need to scroll", () => {
        const rendered: any = mount(<StackPanel managedClasses={managedClasses} />);
        expect(rendered.instance().rootElement.current.className).not.toContain(
            managedClasses.stackPanel__scrollable
        );
    });

    test("too short an itemspan list does not throw", (): void => {
        const rendered: any = mount(<StackPanel itemSpan={[]} />);

        expect(() => {
            rendered.setProps({
                children: sampleStackPanelItems,
            });
        }).not.toThrow();
    });
});

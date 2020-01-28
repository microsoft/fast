import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import Button from "../button";
import { ConstructibleResizeObserver, DisplayNamePrefix } from "../utilities";
import StackPanel, {
    StackPanelClassNameContract,
    StackPanelUnhandledProps,
} from "./stack-panel";
import { ItemSpanOverride } from "./stack-panel.props";
import { Orientation } from "@microsoft/fast-web-utilities";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const managedClasses: StackPanelClassNameContract = {
    stackPanel: "stackPanel",
    stackPanel__scrolling: "stackPanel__scrolling",
    stackPanel_items: "stackPanel_itemContainer",
};

const itemSpans: ItemSpanOverride = {
    0: 120,
    1: 180,
    2: 240,
    3: 120,
    4: 640,
    5: 200,
    6: 220,
    7: 170,
    8: 160,
    9: 240,
    10: 110,
    11: 270,
};

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

    test("getViewportSpan returns correct value when orientation is vertical", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        const rendered: any = mount(
            <StackPanel orientation={Orientation.vertical}>item</StackPanel>
        );

        rendered.first().instance().rootElement.current = {
            clientHeight: 100,
            clientWidth: 200,
        };
        expect(
            rendered
                .first()
                .instance()
                ["getViewportSpan"]()
        ).toBe(100);
    });

    test("getViewportSpan returns correct value when orientation is horizontal", (): void => {
        const rendered: any = mount(
            <StackPanel orientation={Orientation.horizontal}>item</StackPanel>
        );

        rendered.first().instance().rootElement.current = {
            clientHeight: 100,
            clientWidth: 200,
        };
        expect(
            rendered
                .first()
                .instance()
                ["getViewportSpan"]()
        ).toBe(200);
    });
    test("getScrollIntoViewPosition returns correct value", (): void => {
        const rendered: any = mount(
            <StackPanel itemSpanOverrides={itemSpans}>{sampleStackPanelItems}</StackPanel>
        );

        rendered.first().instance().viewPortSpan = 200;
        expect(
            rendered
                .first()
                .instance()
                ["getScrollIntoViewPosition"](0)
        ).toBe(0);
        expect(
            rendered
                .first()
                .instance()
                ["getScrollIntoViewPosition"](4)
        ).toBe(660);
        expect(
            rendered
                .first()
                .instance()
                ["getScrollIntoViewPosition"](11)
        ).toBe(2400);
    });

    test("getMaxScrollDistance returns correct value", (): void => {
        const rendered: any = mount(
            <StackPanel itemSpanOverrides={itemSpans}>{sampleStackPanelItems}</StackPanel>
        );

        rendered.first().instance().viewPortSpan = 200;
        expect(
            rendered
                .first()
                .instance()
                ["getMaxScrollDistance"]()
        ).toBe(2470);
    });

    test("getMaxScrollDistance returns 0 when there are no items", (): void => {
        const rendered: any = mount(<StackPanel />);

        rendered.first().instance().viewPortSpan = 200;
        expect(
            rendered
                .first()
                .instance()
                ["getMaxScrollDistance"]()
        ).toBe(0);
    });

    test("should create a resize observer if it is available", (): void => {
        const ActualObserver: ConstructibleResizeObserver = (window as WindowWithResizeObserver)
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
        (window as WindowWithResizeObserver).ResizeObserver = MockObserver;

        // Render the component
        const rendered: any = mount(<StackPanel>{sampleStackPanelItems}</StackPanel>);

        expect(construct).toBeCalledTimes(1);
        // Replace the window to it's original state
        (window as WindowWithResizeObserver).ResizeObserver = ActualObserver;
    });

    test("should disconnect the resize observer when unmounted", (): void => {
        const ActualObserver: ConstructibleResizeObserver = (window as WindowWithResizeObserver)
            .ResizeObserver;
        const disconnect: jest.Mock<any, any> = jest.fn();
        // Mock the resize observer
        // tslint:disable-next-line:max-classes-per-file
        class MockObserver {
            public observe: jest.Mock<any, any> = jest.fn();
            public unobserve: jest.Mock<any, any> = jest.fn();
            public disconnect: jest.Mock<any, any> = disconnect;
        }
        (window as WindowWithResizeObserver).ResizeObserver = MockObserver;

        const rendered: any = mount(<StackPanel>{sampleStackPanelItems}</StackPanel>);
        // Unmount the component to trigger lifecycle methods
        rendered.unmount();

        expect(disconnect).toBeCalledTimes(1);
        // Replace the window to it's original state
        (window as WindowWithResizeObserver).ResizeObserver = ActualObserver;
    });

    test("updateScrollAnimation marks scrollAnimating as complete when time reaches duration", (): void => {
        const rendered: any = mount(<StackPanel>{sampleStackPanelItems}</StackPanel>);

        let currentTime: number = new Date().getTime();
        rendered.instance().currentScrollAnimStartTime = currentTime;
        rendered.instance().isScrollAnimating = true;
        const targetDelayTime: number = currentTime + 500;
        while (currentTime < targetDelayTime) {
            currentTime = new Date().getTime();
        }
        rendered.instance()["updateScrollAnimation"]();
        expect(rendered.instance().isScrollAnimating).toEqual(false);
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
    test("should ease the animation correctly when moving the scroll position", () => {
        const rendered: any = mount(<StackPanel>{sampleStackPanelItems}</StackPanel>);

        expect(rendered.instance()["easeInOutQuad"](1, 0, 0.5, 50)).toBe(0.0004);
    });
    test("should ease the animation correctly when at animation start time", () => {
        const rendered: any = mount(<StackPanel>{sampleStackPanelItems}</StackPanel>);

        expect(rendered.instance()["easeInOutQuad"](0, 0, 0.5, 50)).toBe(0);
    });
    test("should ease the animation correctly when at animation end time", () => {
        const rendered: any = mount(<StackPanel>{sampleStackPanelItems}</StackPanel>);

        expect(rendered.instance()["easeInOutQuad"](50, 0, 0.5, 50)).toBe(0.5);
    });
    test("should ease the animation correctly when moving the scroll position", () => {
        const rendered: any = mount(<StackPanel>{sampleStackPanelItems}</StackPanel>);

        expect(rendered.instance()["easeInOutQuad"](1, 0, 0.5, 50)).toBe(0.0004);
    });
    test("getScrollAnimationPosition returns correct start and end values", () => {
        const rendered: any = mount(<StackPanel>{sampleStackPanelItems}</StackPanel>);

        rendered.instance().currentScrollAnimStartPosition = 0;
        rendered.instance().currentScrollAnimEndPosition = 100;

        expect(rendered.instance()["getScrollAnimationPosition"](0, 1000)).toBe(0);
        expect(rendered.instance()["getScrollAnimationPosition"](1000, 1000)).toBe(100);
    });
    test("settting and getting scroll position works correctly in ltr", (): void => {
        const rendered: any = mount(
            <StackPanel dir="ltr">{sampleStackPanelItems}</StackPanel>
        );
        expect(rendered.instance()["getScrollPosition"]()).toEqual(0);
        rendered.instance()["setScrollPosition"](100);
        expect(rendered.instance()["getScrollPosition"]()).toEqual(100);
    });
    test("settting and getting scroll position works correctly in rtl", (): void => {
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
    test("should ease the animation correctly when moving the scroll position", () => {
        const rendered: any = mount(<StackPanel>{sampleStackPanelItems}</StackPanel>);
        expect(rendered.instance()["easeInOutQuad"](1, 0, 0.5, 50)).toBe(0.0004);
    });
    test("scrollContent properly configures a smooth scrolling animation", () => {
        const rendered: any = mount(
            <StackPanel enableSmoothScrolling={true}>{sampleStackPanelItems}</StackPanel>
        );
        expect(rendered.instance().isScrollAnimating).toEqual(false);
        rendered.requestFrame = jest.fn();
        rendered.instance()["scrollContent"](0, 100);
        expect(rendered.instance().isScrollAnimating).toEqual(true);
        expect(rendered.instance().currentScrollAnimStartPosition).toEqual(0);
        expect(rendered.instance().currentScrollAnimEndPosition).toEqual(100);
    });
    test("scrollContent does not start smooth scrolling animation and sets scroll value when smooth scrolling disabled", () => {
        const rendered: any = mount(
            <StackPanel enableSmoothScrolling={false}>{sampleStackPanelItems}</StackPanel>
        );
        expect(rendered.instance().isScrollAnimating).toEqual(false);
        expect(rendered.instance()["getScrollPosition"]()).toEqual(0);
        rendered.instance()["scrollContent"](0, 100);
        expect(rendered.instance().isScrollAnimating).toEqual(false);
        expect(rendered.instance()["getScrollPosition"]()).toEqual(100);
    });
    test("on onItemFocus correctly scrolls content - vertical, element below viewport ", () => {
        const rendered: any = mount(
            <StackPanel orientation={Orientation.vertical} nextItemPeek={0}>
                {sampleStackPanelItems}
            </StackPanel>
        );

        const scrollContentFn: any = jest.fn();
        rendered.instance().scrollContent = scrollContentFn;
        rendered.instance().lastRecordedScroll = 0;
        rendered.instance().isScrollAnimating = false;
        rendered.instance().viewportSpan = 100;
        rendered.instance().isScrolling = true;
        rendered.instance()["onItemFocus"]({
            currentTarget: {
                clientHeight: 100,
                clientWidth: 0,
                offsetTop: 250,
                offsetLeft: 0,
            },
        });
        expect(scrollContentFn.mock.calls[0][0]).toBe(0);
        expect(scrollContentFn.mock.calls[0][1]).toBe(350);
    });

    test("on onItemFocus correctly scrolls content - vertical, element above viewport ", () => {
        const rendered: any = mount(
            <StackPanel orientation={Orientation.vertical} nextItemPeek={0}>
                {sampleStackPanelItems}
            </StackPanel>
        );

        const scrollContentFn: any = jest.fn();
        rendered.instance().scrollContent = scrollContentFn;
        rendered.instance().lastRecordedScroll = 300;
        rendered.instance().isScrollAnimating = false;
        rendered.instance().viewportSpan = 100;
        rendered.instance().isScrolling = true;
        rendered.instance()["onItemFocus"]({
            currentTarget: {
                clientHeight: 100,
                clientWidth: 0,
                offsetTop: 100,
                offsetLeft: 0,
            },
        });
        expect(scrollContentFn.mock.calls[0][0]).toBe(300);
        expect(scrollContentFn.mock.calls[0][1]).toBe(100);
    });

    test("on onItemFocus correctly scrolls content - horizontal, element right of viewport ", () => {
        const rendered: any = mount(
            <StackPanel orientation={Orientation.horizontal} nextItemPeek={0}>
                {sampleStackPanelItems}
            </StackPanel>
        );

        const scrollContentFn: any = jest.fn();
        rendered.instance().scrollContent = scrollContentFn;
        rendered.instance().lastRecordedScroll = 0;
        rendered.instance().isScrollAnimating = false;
        rendered.instance().viewportSpan = 100;
        rendered.instance().isScrolling = true;
        rendered.instance()["onItemFocus"]({
            currentTarget: {
                clientHeight: 0,
                clientWidth: 100,
                offsetTop: 0,
                offsetLeft: 250,
            },
        });
        expect(scrollContentFn.mock.calls[0][0]).toBe(0);
        expect(scrollContentFn.mock.calls[0][1]).toBe(350);
    });

    test("on onItemFocus correctly scrolls content - horizontal, element left of viewport", () => {
        const rendered: any = mount(
            <StackPanel orientation={Orientation.horizontal} nextItemPeek={0}>
                {sampleStackPanelItems}
            </StackPanel>
        );

        const scrollContentFn: any = jest.fn();
        rendered.instance().scrollContent = scrollContentFn;
        rendered.instance().lastRecordedScroll = 300;
        rendered.instance().isScrollAnimating = false;
        rendered.instance().viewportSpan = 100;
        rendered.instance().isScrolling = true;
        rendered.instance()["onItemFocus"]({
            currentTarget: {
                clientHeight: 0,
                clientWidth: 100,
                offsetTop: 0,
                offsetLeft: 100,
            },
        });
        expect(scrollContentFn.mock.calls[0][0]).toBe(300);
        expect(scrollContentFn.mock.calls[0][1]).toBe(100);
    });

    test("Root classnames are applied", () => {
        const rendered: any = mount(
            <StackPanel managedClasses={managedClasses}>
                {sampleStackPanelItems}
            </StackPanel>
        );
        expect(rendered.instance().rootElement.current.className).toContain(
            managedClasses.stackPanel
        );
        expect(rendered.instance().rootElement.current.className).toContain(
            managedClasses.stackPanel__scrolling
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

    test("isScrolling classname not applied when component does not need to scroll", () => {
        const rendered: any = mount(<StackPanel managedClasses={managedClasses} />);
        expect(rendered.instance().rootElement.current.className).not.toContain(
            managedClasses.stackPanel__scrolling
        );
    });
});

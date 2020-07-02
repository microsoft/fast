import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { ConstructibleResizeObserver, DisplayNamePrefix } from "../utilities";
import ViewportPositioner, {
    Dimension,
    ViewportPositionerClassNameContract,
    ViewportPositionerHorizontalPositionLabel,
    ViewportPositionerUnhandledProps,
    ViewportPositionerVerticalPositionLabel,
} from "./viewport-positioner";
import {
    AxisPositioningMode,
    ViewportPositionerHorizontalPosition,
    ViewportPositionerVerticalPosition,
} from "./viewport-positioner.props";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

// Mock observers
class DefaultResizeObserver {
    public observe: jest.Mock<any, any> = jest.fn();
    public unobserve: jest.Mock<any, any> = jest.fn();
    public disconnect: jest.Mock<any, any> = jest.fn();
}

class DefaultIntersectionObserver {
    public observe: jest.Mock<any, any> = jest.fn();
    public unobserve: jest.Mock<any, any> = jest.fn();
    public disconnect: jest.Mock<any, any> = jest.fn();
    public root: any = null;
    public rootMargin: any = null;
    public thresholds: any = null;
    public takeRecords: any = null;
}

((window as unknown) as WindowWithResizeObserver).ResizeObserver = DefaultResizeObserver;
((window as unknown) as WindowWithIntersectionObserver).IntersectionObserver = DefaultIntersectionObserver;

const anchorElement: HTMLDivElement = document.createElement("div");

const positionerRectX70Y70: ClientRect = {
    top: 70,
    right: 80,
    bottom: 80,
    left: 70,
    height: 10,
    width: 10,
};

// viewport rect is deliberately offset so we are testing that
// calculations are correct when the viewport is not positioned at origin (i.e. x and y = 0)
const viewportRect: ClientRect = {
    top: 100,
    right: 250,
    bottom: 200,
    left: 150,
    height: 100,
    width: 100,
};

const managedClasses: ViewportPositionerClassNameContract = {
    viewportPositioner: "viewportPositioner",
    viewportPositioner__left: "viewportPositioner__left",
    viewportPositioner__right: "viewportPositioner__right",
    viewportPositioner__top: "viewportPositioner__top",
    viewportPositioner__bottom: "viewportPositioner__bottom",
    viewportPositioner__horizontalInset: "viewportPositioner__horizontalInset",
    viewportPositioner__verticalInset: "viewportPositioner__verticalInset",
};

describe("viewport positioner", (): void => {
    test("should have a displayName that matches the component name", () => {
        expect(`${DisplayNamePrefix}${(ViewportPositioner as any).name}`).toBe(
            ViewportPositioner.displayName
        );
    });

    test("should not throw if managedClasses are not provided", () => {
        expect(() => {
            shallow(<ViewportPositioner />);
        }).not.toThrow();
    });

    test("should implement unhandledProps", (): void => {
        const unhandledProps: ViewportPositionerUnhandledProps = {
            "aria-label": "label",
        };

        const rendered: any = shallow(<ViewportPositioner {...unhandledProps} />);

        expect(rendered.first().prop("aria-label")).toEqual("label");
    });

    test("should merge unhandledProps style properties with existing styles from the component", (): void => {
        const unhandledProps: ViewportPositionerUnhandledProps = {
            style: {
                width: "100px",
                height: "200px",
            },
        };
        const expectedStyles: Partial<React.CSSProperties> = {
            position: "relative",
            transformOrigin: "left top",
            transform: `translate(
                0px, 
                0px
            )`,
            top: null,
            right: null,
            bottom: null,
            left: null,
            width: "100px",
            height: "200px",
        };
        const rendered: any = shallow(<ViewportPositioner {...unhandledProps} />);

        expect(rendered.first().prop("style")).toEqual(expectedStyles);
    });

    test("should be disabled without an anchor", (): void => {
        const rendered: any = mount(
            <ViewportPositioner
                viewport={document.firstElementChild as HTMLElement}
                defaultHorizontalPosition={ViewportPositionerHorizontalPosition.left}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.instance().state.disabled).toBe(true);
    });

    test("should be enabled with an anchor", (): void => {
        const rendered: any = mount(
            <ViewportPositioner
                viewport={document.firstElementChild as HTMLElement}
                anchor={anchorElement}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.instance().state.disabled).toBe(false);
    });

    test("should be disabled when disabled prop is set", (): void => {
        const rendered: any = mount(
            <ViewportPositioner
                viewport={document.firstElementChild as HTMLElement}
                disabled={true}
                anchor={anchorElement}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.instance().state.disabled).toBe(true);
    });

    test("initial state function returns correct initial state", (): void => {
        const rendered: any = mount(
            <ViewportPositioner
                viewport={document.firstElementChild as HTMLElement}
                anchor={anchorElement}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.instance()["generateInitialState"]()).toEqual({
            disabled: true,
            noObserverMode: false,
            xTransformOrigin: "left",
            yTransformOrigin: "top",
            xTranslate: 0,
            yTranslate: 0,
            top: null,
            right: null,
            bottom: null,
            left: null,
            currentHorizontalPosition: "undefined",
            currentVerticalPosition: "undefined",
            defaultHorizontalPosition: "undefined",
            defaultVerticalPosition: "bottom",
            horizontalSelectedPositionWidth: null,
            verticalSelectedPositionHeight: null,
            initialLayoutComplete: false,
            validRefChecksRemaining: 2,
        });
    });

    test("positioning values applied correctly for specified default position - adjacent + top + left", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);

        const rendered: any = mount(
            <ViewportPositioner
                viewport={container}
                horizontalPositioningMode={AxisPositioningMode.adjacent}
                defaultHorizontalPosition={ViewportPositionerHorizontalPosition.left}
                verticalPositioningMode={AxisPositioningMode.adjacent}
                defaultVerticalPosition={ViewportPositionerVerticalPosition.top}
                anchor={anchorElement}
                verticalLockToDefault={true}
                horizontalLockToDefault={true}
                managedClasses={managedClasses}
            />,
            { attachTo: container }
        );

        rendered.instance().viewportRect = viewportRect;
        rendered.instance().positionerDimension = { height: 70, width: 70 };
        rendered.instance().anchorTop = 180;
        rendered.instance().anchorRight = 240;
        rendered.instance().anchorBottom = 190;
        rendered.instance().anchorLeft = 230;
        rendered.instance().anchorWidth = 10;
        rendered.instance().anchorHeight = 10;
        rendered.instance().scrollTop = 0;
        rendered.instance().scrollLeft = 0;

        rendered.instance().updateLayout();
        expect(rendered.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPosition.left
        );
        expect(rendered.instance().state.right).not.toBe(null);
        expect(rendered.instance().state.left).toBe(null);
        expect(rendered.instance().state.xTransformOrigin).toBe("right");
        expect(rendered.instance().rootElement.current.className).toContain(
            managedClasses.viewportPositioner__left
        );
        expect(rendered.instance().rootElement.current.className).not.toContain(
            managedClasses.viewportPositioner__right
        );
        expect(rendered.instance().rootElement.current.className).not.toContain(
            managedClasses.viewportPositioner__horizontalInset
        );

        expect(rendered.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPosition.top
        );
        expect(rendered.instance().state.bottom).not.toBe(null);
        expect(rendered.instance().state.top).toBe(null);
        expect(rendered.instance().state.yTransformOrigin).toBe("bottom");
        expect(rendered.instance().rootElement.current.className).toContain(
            managedClasses.viewportPositioner__top
        );
        expect(rendered.instance().rootElement.current.className).not.toContain(
            managedClasses.viewportPositioner__bottom
        );
        expect(rendered.instance().rootElement.current.className).not.toContain(
            managedClasses.viewportPositioner__verticalInset
        );

        document.body.removeChild(container);
    });

    test("positioning values applied correctly for specified default position - adjacent + bottom + right", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);

        const rendered: any = mount(
            <ViewportPositioner
                viewport={document.firstElementChild as HTMLElement}
                horizontalPositioningMode={AxisPositioningMode.adjacent}
                defaultHorizontalPosition={ViewportPositionerHorizontalPosition.right}
                verticalPositioningMode={AxisPositioningMode.adjacent}
                defaultVerticalPosition={ViewportPositionerVerticalPosition.bottom}
                anchor={anchorElement}
                verticalLockToDefault={true}
                horizontalLockToDefault={true}
                managedClasses={managedClasses}
            />,
            { attachTo: container }
        );

        rendered.instance().viewportRect = viewportRect;
        rendered.instance().positionerDimension = { height: 70, width: 70 };
        rendered.instance().anchorTop = 180;
        rendered.instance().anchorRight = 240;
        rendered.instance().anchorBottom = 190;
        rendered.instance().anchorLeft = 230;
        rendered.instance().anchorWidth = 10;
        rendered.instance().anchorHeight = 10;
        rendered.instance().scrollTop = 0;
        rendered.instance().scrollLeft = 0;

        rendered.instance().updateLayout();
        expect(rendered.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPosition.right
        );
        expect(rendered.instance().state.right).toBe(null);
        expect(rendered.instance().state.left).not.toBe(null);
        expect(rendered.instance().state.xTransformOrigin).toBe("left");
        expect(rendered.instance().rootElement.current.className).toContain(
            managedClasses.viewportPositioner__right
        );
        expect(rendered.instance().rootElement.current.className).not.toContain(
            managedClasses.viewportPositioner__left
        );
        expect(rendered.instance().rootElement.current.className).not.toContain(
            managedClasses.viewportPositioner__horizontalInset
        );

        expect(rendered.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPosition.bottom
        );
        expect(rendered.instance().state.bottom).toBe(null);
        expect(rendered.instance().state.top).not.toBe(null);
        expect(rendered.instance().state.yTransformOrigin).toBe("top");
        expect(rendered.instance().rootElement.current.className).toContain(
            managedClasses.viewportPositioner__bottom
        );
        expect(rendered.instance().rootElement.current.className).not.toContain(
            managedClasses.viewportPositioner__top
        );
        expect(rendered.instance().rootElement.current.className).not.toContain(
            managedClasses.viewportPositioner__verticalInset
        );

        document.body.removeChild(container);
    });

    test("positioning values applied correctly for specified default position - inset + top + left", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);

        const rendered: any = mount(
            <ViewportPositioner
                viewport={document.firstElementChild as HTMLElement}
                horizontalPositioningMode={AxisPositioningMode.inset}
                defaultHorizontalPosition={ViewportPositionerHorizontalPosition.left}
                verticalPositioningMode={AxisPositioningMode.inset}
                defaultVerticalPosition={ViewportPositionerVerticalPosition.top}
                anchor={anchorElement}
                verticalLockToDefault={true}
                horizontalLockToDefault={true}
                managedClasses={managedClasses}
            />,
            { attachTo: container }
        );

        rendered.instance().viewportRect = viewportRect;
        rendered.instance().positionerDimension = { height: 70, width: 70 };
        rendered.instance().anchorTop = 180;
        rendered.instance().anchorRight = 240;
        rendered.instance().anchorBottom = 190;
        rendered.instance().anchorLeft = 230;
        rendered.instance().anchorWidth = 10;
        rendered.instance().anchorHeight = 10;
        rendered.instance().scrollTop = 0;
        rendered.instance().scrollLeft = 0;

        rendered.instance().updateLayout();
        expect(rendered.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPositionLabel.insetLeft
        );
        expect(rendered.instance().state.right).not.toBe(null);
        expect(rendered.instance().state.left).toBe(null);
        expect(rendered.instance().state.xTransformOrigin).toBe("right");
        expect(rendered.instance().rootElement.current.className).toContain(
            managedClasses.viewportPositioner__left
        );
        expect(rendered.instance().rootElement.current.className).not.toContain(
            managedClasses.viewportPositioner__right
        );
        expect(rendered.instance().rootElement.current.className).toContain(
            managedClasses.viewportPositioner__horizontalInset
        );

        expect(rendered.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPositionLabel.insetTop
        );
        expect(rendered.instance().state.bottom).not.toBe(null);
        expect(rendered.instance().state.top).toBe(null);
        expect(rendered.instance().state.yTransformOrigin).toBe("bottom");
        expect(rendered.instance().rootElement.current.className).toContain(
            managedClasses.viewportPositioner__top
        );
        expect(rendered.instance().rootElement.current.className).not.toContain(
            managedClasses.viewportPositioner__bottom
        );
        expect(rendered.instance().rootElement.current.className).toContain(
            managedClasses.viewportPositioner__verticalInset
        );

        document.body.removeChild(container);
    });

    test("positioning values applied correctly for specified default position - inset + bottom + right", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);

        const rendered: any = mount(
            <ViewportPositioner
                viewport={document.firstElementChild as HTMLElement}
                horizontalPositioningMode={AxisPositioningMode.inset}
                defaultHorizontalPosition={ViewportPositionerHorizontalPosition.right}
                verticalPositioningMode={AxisPositioningMode.inset}
                defaultVerticalPosition={ViewportPositionerVerticalPosition.bottom}
                anchor={anchorElement}
                verticalLockToDefault={true}
                horizontalLockToDefault={true}
                managedClasses={managedClasses}
            />,
            { attachTo: container }
        );

        rendered.instance().viewportRect = viewportRect;
        rendered.instance().positionerDimension = { height: 70, width: 70 };
        rendered.instance().anchorTop = 180;
        rendered.instance().anchorRight = 240;
        rendered.instance().anchorBottom = 190;
        rendered.instance().anchorLeft = 230;
        rendered.instance().anchorWidth = 10;
        rendered.instance().anchorHeight = 10;
        rendered.instance().scrollTop = 0;
        rendered.instance().scrollLeft = 0;

        rendered.instance().updateLayout();
        expect(rendered.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPositionLabel.insetRight
        );
        expect(rendered.instance().state.right).toBe(null);
        expect(rendered.instance().state.left).not.toBe(null);
        expect(rendered.instance().state.xTransformOrigin).toBe("left");
        expect(rendered.instance().rootElement.current.className).toContain(
            managedClasses.viewportPositioner__right
        );
        expect(rendered.instance().rootElement.current.className).not.toContain(
            managedClasses.viewportPositioner__left
        );
        expect(rendered.instance().rootElement.current.className).toContain(
            managedClasses.viewportPositioner__horizontalInset
        );

        expect(rendered.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPositionLabel.insetBottom
        );
        expect(rendered.instance().state.bottom).toBe(null);
        expect(rendered.instance().state.top).not.toBe(null);
        expect(rendered.instance().state.yTransformOrigin).toBe("top");
        expect(rendered.instance().rootElement.current.className).toContain(
            managedClasses.viewportPositioner__bottom
        );
        expect(rendered.instance().rootElement.current.className).not.toContain(
            managedClasses.viewportPositioner__top
        );
        expect(rendered.instance().rootElement.current.className).toContain(
            managedClasses.viewportPositioner__verticalInset
        );

        document.body.removeChild(container);
    });

    test("Option sizes calculated correctly - adjacent", (): void => {
        const rendered: any = mount(
            <ViewportPositioner
                horizontalPositioningMode={AxisPositioningMode.adjacent}
                verticalPositioningMode={AxisPositioningMode.adjacent}
                anchor={anchorElement}
                viewport={document.firstElementChild as HTMLElement}
                managedClasses={managedClasses}
            />
        );

        rendered.instance().viewportRect = viewportRect;
        rendered.instance().positionerDimension = { height: 70, width: 70 };
        rendered.instance().anchorTop = 180;
        rendered.instance().anchorRight = 240;
        rendered.instance().anchorBottom = 190;
        rendered.instance().anchorLeft = 230;
        rendered.instance().anchorWidth = 10;
        rendered.instance().anchorHeight = 10;
        rendered.instance().scrollTop = 0;
        rendered.instance().scrollLeft = 0;

        expect(
            rendered
                .instance()
                ["getAvailableWidth"](ViewportPositionerHorizontalPosition.left)
        ).toBe(80);
        expect(
            rendered
                .instance()
                ["getAvailableWidth"](ViewportPositionerHorizontalPosition.right)
        ).toBe(10);
        expect(
            rendered
                .instance()
                ["getAvailableHeight"](ViewportPositionerVerticalPosition.top)
        ).toBe(80);
        expect(
            rendered
                .instance()
                ["getAvailableHeight"](ViewportPositionerVerticalPosition.bottom)
        ).toBe(10);
    });

    test("Option sizes calculated correctly - inset", (): void => {
        const rendered: any = mount(
            <ViewportPositioner
                horizontalPositioningMode={AxisPositioningMode.inset}
                verticalPositioningMode={AxisPositioningMode.inset}
                anchor={anchorElement}
                viewport={document.firstElementChild as HTMLElement}
                managedClasses={managedClasses}
            />
        );

        rendered.instance().viewportRect = viewportRect;
        rendered.instance().positionerDimension = { height: 70, width: 70 };
        rendered.instance().anchorTop = 180;
        rendered.instance().anchorRight = 240;
        rendered.instance().anchorBottom = 190;
        rendered.instance().anchorLeft = 230;
        rendered.instance().anchorWidth = 10;
        rendered.instance().anchorHeight = 10;
        rendered.instance().scrollTop = 0;
        rendered.instance().scrollLeft = 0;

        expect(
            rendered
                .instance()
                ["getAvailableWidth"](ViewportPositionerHorizontalPositionLabel.insetLeft)
        ).toBe(90);
        expect(
            rendered
                .instance()
                ["getAvailableWidth"](
                    ViewportPositionerHorizontalPositionLabel.insetRight
                )
        ).toBe(20);
        expect(
            rendered
                .instance()
                ["getAvailableHeight"](ViewportPositionerVerticalPositionLabel.insetTop)
        ).toBe(90);
        expect(
            rendered
                .instance()
                ["getAvailableHeight"](
                    ViewportPositionerVerticalPositionLabel.insetBottom
                )
        ).toBe(20);
    });

    test("Correct options returned for a specified positioning mode - insets", (): void => {
        const rendered: any = mount(
            <ViewportPositioner
                horizontalPositioningMode={AxisPositioningMode.inset}
                verticalPositioningMode={AxisPositioningMode.inset}
            />
        );

        const horizontalPositions: ViewportPositionerHorizontalPositionLabel[] = rendered
            .instance()
            ["getHorizontalPositioningOptions"]();
        const verticalPositions: ViewportPositionerVerticalPositionLabel[] = rendered
            .instance()
            ["getVerticalPositioningOptions"]();

        expect(horizontalPositions.length).toBe(2);
        expect(
            horizontalPositions.indexOf(
                ViewportPositionerHorizontalPositionLabel.insetLeft
            )
        ).not.toBe(-1);
        expect(
            horizontalPositions.indexOf(
                ViewportPositionerHorizontalPositionLabel.insetRight
            )
        ).not.toBe(-1);
        expect(verticalPositions.length).toBe(2);
        expect(
            verticalPositions.indexOf(ViewportPositionerVerticalPositionLabel.insetTop)
        ).not.toBe(-1);
        expect(
            verticalPositions.indexOf(ViewportPositionerVerticalPositionLabel.insetBottom)
        ).not.toBe(-1);
    });

    test("Correct options returned for a specified positioning mode - adjacent", (): void => {
        const rendered: any = mount(
            <ViewportPositioner
                horizontalPositioningMode={AxisPositioningMode.adjacent}
                verticalPositioningMode={AxisPositioningMode.adjacent}
            />
        );

        const horizontalPositions: ViewportPositionerHorizontalPosition[] = rendered
            .instance()
            ["getHorizontalPositioningOptions"]();
        const verticalPositions: ViewportPositionerVerticalPosition[] = rendered
            .instance()
            ["getVerticalPositioningOptions"]();

        expect(horizontalPositions.length).toBe(2);
        expect(
            horizontalPositions.indexOf(ViewportPositionerHorizontalPosition.left)
        ).not.toBe(-1);
        expect(
            horizontalPositions.indexOf(ViewportPositionerHorizontalPosition.right)
        ).not.toBe(-1);
        expect(verticalPositions.length).toBe(2);
        expect(
            verticalPositions.indexOf(ViewportPositionerVerticalPosition.top)
        ).not.toBe(-1);
        expect(
            verticalPositions.indexOf(ViewportPositionerVerticalPosition.bottom)
        ).not.toBe(-1);
    });

    test("widest option chosen by default - pt1", (): void => {
        const rendered: any = mount(
            <ViewportPositioner
                horizontalPositioningMode={AxisPositioningMode.adjacent}
                defaultHorizontalPosition={
                    ViewportPositionerHorizontalPosition.uncontrolled
                }
                verticalPositioningMode={AxisPositioningMode.adjacent}
                defaultVerticalPosition={ViewportPositionerVerticalPosition.uncontrolled}
                anchor={anchorElement}
                viewport={document.firstElementChild as HTMLElement}
                managedClasses={managedClasses}
            />
        );

        rendered.instance().viewportRect = viewportRect;
        rendered.instance().positionerDimension = { height: 70, width: 70 };
        rendered.instance().anchorTop = 180;
        rendered.instance().anchorRight = 240;
        rendered.instance().anchorBottom = 190;
        rendered.instance().anchorLeft = 230;
        rendered.instance().anchorWidth = 10;
        rendered.instance().anchorHeight = 10;
        rendered.instance().scrollTop = 0;
        rendered.instance().scrollLeft = 0;

        rendered.instance()["updateLayout"]();

        expect(rendered.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPosition.left
        );
        expect(rendered.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPosition.top
        );
    });

    test("widest option chosen by default - pt2", (): void => {
        const rendered: any = mount(
            <ViewportPositioner
                horizontalPositioningMode={AxisPositioningMode.adjacent}
                verticalPositioningMode={AxisPositioningMode.adjacent}
                anchor={anchorElement}
                viewport={document.firstElementChild as HTMLElement}
                managedClasses={managedClasses}
            />
        );

        rendered.instance().viewportRect = viewportRect;
        rendered.instance().positionerDimension = { height: 20, width: 20 };
        rendered.instance().anchorTop = 110;
        rendered.instance().anchorRight = 170;
        rendered.instance().anchorBottom = 120;
        rendered.instance().anchorLeft = 160;
        rendered.instance().anchorWidth = 10;
        rendered.instance().anchorHeight = 10;
        rendered.instance().scrollTop = 0;
        rendered.instance().scrollLeft = 0;

        rendered.instance()["updateLayout"]();

        expect(rendered.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPosition.right
        );
        expect(rendered.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPosition.bottom
        );
    });

    test("Translate transforms calculated correctly - top/left", (): void => {
        const rendered: any = mount(
            <ViewportPositioner
                horizontalPositioningMode={AxisPositioningMode.inset}
                verticalPositioningMode={AxisPositioningMode.inset}
                anchor={anchorElement}
                viewport={document.firstElementChild as HTMLElement}
                managedClasses={managedClasses}
                horizontalAlwaysInView={true}
                verticalAlwaysInView={true}
            />
        );

        rendered.instance().viewportRect = viewportRect;
        rendered.instance().anchorTop = 210;
        rendered.instance().anchorRight = 270;
        rendered.instance().anchorBottom = 220;
        rendered.instance().anchorLeft = 260;
        rendered.instance().setState({ noObserverMode: false });
        expect(rendered.instance().state.noObserverMode).toBe(false);

        expect(
            rendered
                .instance()
                ["getHorizontalTranslate"](
                    ViewportPositionerHorizontalPositionLabel.insetLeft
                )
        ).toBe(-21);
        expect(
            rendered
                .instance()
                ["getHorizontalTranslate"](ViewportPositionerHorizontalPosition.left)
        ).toBe(-11);
        expect(
            rendered
                .instance()
                ["getVerticalTranslate"](ViewportPositionerVerticalPositionLabel.insetTop)
        ).toBe(-21);
        expect(
            rendered
                .instance()
                ["getVerticalTranslate"](ViewportPositionerVerticalPosition.top)
        ).toBe(-11);

        expect(
            rendered
                .instance()
                ["getHorizontalTranslate"](
                    ViewportPositionerHorizontalPositionLabel.insetRight
                )
        ).toBe(0);
        expect(
            rendered
                .instance()
                ["getHorizontalTranslate"](ViewportPositionerHorizontalPosition.right)
        ).toBe(0);
        expect(
            rendered
                .instance()
                ["getVerticalTranslate"](
                    ViewportPositionerVerticalPositionLabel.insetBottom
                )
        ).toBe(0);
        expect(
            rendered
                .instance()
                ["getVerticalTranslate"](ViewportPositionerVerticalPosition.bottom)
        ).toBe(0);
    });

    test("Translate transforms calculated correctly - bottom/right", (): void => {
        const rendered: any = mount(
            <ViewportPositioner
                horizontalPositioningMode={AxisPositioningMode.inset}
                verticalPositioningMode={AxisPositioningMode.inset}
                anchor={anchorElement}
                viewport={document.firstElementChild as HTMLElement}
                managedClasses={managedClasses}
                horizontalAlwaysInView={true}
                verticalAlwaysInView={true}
            />
        );

        rendered.instance().viewportRect = viewportRect;
        rendered.instance().positionerDimension = { height: 70, width: 70 };
        rendered.instance().anchorTop = 80;
        rendered.instance().anchorRight = 140;
        rendered.instance().anchorBottom = 90;
        rendered.instance().anchorLeft = 130;

        expect(
            rendered
                .instance()
                ["getHorizontalTranslate"](
                    ViewportPositionerHorizontalPositionLabel.insetRight
                )
        ).toBe(21);
        expect(
            rendered
                .instance()
                ["getHorizontalTranslate"](ViewportPositionerHorizontalPosition.right)
        ).toBe(11);
        expect(
            rendered
                .instance()
                ["getVerticalTranslate"](
                    ViewportPositionerVerticalPositionLabel.insetBottom
                )
        ).toBe(21);
        expect(
            rendered
                .instance()
                ["getVerticalTranslate"](ViewportPositionerVerticalPosition.bottom)
        ).toBe(11);

        expect(
            rendered
                .instance()
                ["getHorizontalTranslate"](
                    ViewportPositionerHorizontalPositionLabel.insetLeft
                )
        ).toBe(0);
        expect(
            rendered
                .instance()
                ["getHorizontalTranslate"](ViewportPositionerHorizontalPosition.left)
        ).toBe(0);
        expect(
            rendered
                .instance()
                ["getVerticalTranslate"](ViewportPositionerVerticalPositionLabel.insetTop)
        ).toBe(0);
        expect(
            rendered
                .instance()
                ["getVerticalTranslate"](ViewportPositionerVerticalPosition.top)
        ).toBe(0);
    });

    test("Positioner moves to biggest area on updateLayout() when spacing changes", (): void => {
        const rendered: any = mount(
            <ViewportPositioner
                horizontalPositioningMode={AxisPositioningMode.adjacent}
                defaultHorizontalPosition={
                    ViewportPositionerHorizontalPosition.uncontrolled
                }
                verticalPositioningMode={AxisPositioningMode.adjacent}
                defaultVerticalPosition={ViewportPositionerVerticalPosition.uncontrolled}
                anchor={anchorElement}
                viewport={document.firstElementChild as HTMLElement}
                managedClasses={managedClasses}
            />
        );

        rendered.instance().viewportRect = viewportRect;
        rendered.instance().positionerDimension = { height: 70, width: 70 };
        rendered.instance().anchorTop = 180;
        rendered.instance().anchorRight = 240;
        rendered.instance().anchorBottom = 190;
        rendered.instance().anchorLeft = 230;
        rendered.instance().anchorWidth = 10;
        rendered.instance().anchorHeight = 10;
        rendered.instance().scrollTop = 0;
        rendered.instance().scrollLeft = 0;
        rendered.instance().setState({ noObserverMode: false });

        rendered.instance()["updateLayout"]();

        expect(rendered.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPosition.left
        );
        expect(rendered.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPosition.top
        );

        rendered.instance().anchorTop = 110;
        rendered.instance().anchorRight = 170;
        rendered.instance().anchorBottom = 120;
        rendered.instance().anchorLeft = 160;

        rendered.instance()["updateLayout"]();

        expect(rendered.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPosition.right
        );
        expect(rendered.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPosition.bottom
        );
    });

    test("Positioner prefers default position until threshold is passed", (): void => {
        const rendered: any = mount(
            <ViewportPositioner
                horizontalPositioningMode={AxisPositioningMode.adjacent}
                defaultHorizontalPosition={ViewportPositionerHorizontalPosition.left}
                horizontalThreshold={20}
                verticalPositioningMode={AxisPositioningMode.adjacent}
                defaultVerticalPosition={ViewportPositionerVerticalPosition.top}
                verticalThreshold={20}
                anchor={anchorElement}
                viewport={document.firstElementChild as HTMLElement}
                managedClasses={managedClasses}
            />
        );

        rendered.instance().viewportRect = viewportRect;
        rendered.instance().positionerDimension = { height: 70, width: 70 };
        rendered.instance().anchorTop = 180;
        rendered.instance().anchorRight = 240;
        rendered.instance().anchorBottom = 190;
        rendered.instance().anchorLeft = 230;
        rendered.instance().anchorWidth = 10;
        rendered.instance().anchorHeight = 10;
        rendered.instance().scrollTop = 0;
        rendered.instance().scrollLeft = 0;
        rendered.instance().setState({ noObserverMode: false });

        rendered.instance()["updateLayout"]();

        expect(rendered.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPosition.left
        );
        expect(rendered.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPosition.top
        );

        rendered.instance().anchorTop = 120;
        rendered.instance().anchorRight = 180;
        rendered.instance().anchorBottom = 130;
        rendered.instance().anchorLeft = 170;

        rendered.instance()["updateLayout"]();

        expect(rendered.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPosition.left
        );
        expect(rendered.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPosition.top
        );

        rendered.instance().anchorTop = 110;
        rendered.instance().anchorRight = 170;
        rendered.instance().anchorBottom = 120;
        rendered.instance().anchorLeft = 160;

        rendered.instance()["updateLayout"]();

        expect(rendered.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPosition.right
        );
        expect(rendered.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPosition.bottom
        );
    });

    test("Positioner stays fixed on default position when LocktoDefault set in props", (): void => {
        const rendered: any = mount(
            <ViewportPositioner
                horizontalPositioningMode={AxisPositioningMode.adjacent}
                defaultHorizontalPosition={ViewportPositionerHorizontalPosition.left}
                horizontalLockToDefault={true}
                horizontalThreshold={20}
                verticalPositioningMode={AxisPositioningMode.adjacent}
                defaultVerticalPosition={ViewportPositionerVerticalPosition.top}
                verticalLockToDefault={true}
                verticalThreshold={20}
                anchor={anchorElement}
                viewport={document.firstElementChild as HTMLElement}
                managedClasses={managedClasses}
            />
        );

        rendered.instance().viewportRect = viewportRect;
        rendered.instance().positionerDimension = { height: 70, width: 70 };
        rendered.instance().anchorTop = 80;
        rendered.instance().anchorRight = 90;
        rendered.instance().anchorBottom = 90;
        rendered.instance().anchorLeft = 80;
        rendered.instance().anchorWidth = 10;
        rendered.instance().anchorHeight = 10;
        rendered.instance().scrollTop = 0;
        rendered.instance().scrollLeft = 0;

        rendered.instance()["updateLayout"]();

        expect(rendered.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPosition.left
        );
        expect(rendered.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPosition.top
        );

        rendered.instance().anchorTop = 20;
        rendered.instance().anchorRight = 30;
        rendered.instance().anchorBottom = 30;
        rendered.instance().anchorLeft = 20;

        rendered.instance()["updateLayout"]();

        expect(rendered.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPosition.left
        );
        expect(rendered.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPosition.top
        );

        rendered.instance().anchorTop = 10;
        rendered.instance().anchorRight = 20;
        rendered.instance().anchorBottom = 20;
        rendered.instance().anchorLeft = 10;

        rendered.instance()["updateLayout"]();

        expect(rendered.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPosition.left
        );
        expect(rendered.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPosition.top
        );
    });

    test("Positioner base position offset from anchor is accounted for", (): void => {
        const rendered: any = mount(
            <ViewportPositioner
                horizontalPositioningMode={AxisPositioningMode.adjacent}
                verticalPositioningMode={AxisPositioningMode.adjacent}
                anchor={anchorElement}
                viewport={document.firstElementChild as HTMLElement}
                managedClasses={managedClasses}
            />
        );

        rendered.instance().viewportRect = viewportRect;
        rendered.instance().positionerDimension = { height: 70, width: 70 };
        rendered.instance().anchorTop = 80;
        rendered.instance().anchorRight = 90;
        rendered.instance().anchorBottom = 90;
        rendered.instance().anchorLeft = 80;
        rendered.instance().anchorWidth = 10;
        rendered.instance().anchorHeight = 10;
        rendered.instance().scrollTop = 0;
        rendered.instance().scrollLeft = 0;
        rendered.instance().baseHorizontalOffset = 10;
        rendered.instance().baseVerticalOffset = 10;

        const positionerDimension: Dimension = {
            width: 10,
            height: 10,
        };

        expect(
            rendered
                .instance()
                ["getHorizontalPositioningState"](
                    ViewportPositionerHorizontalPositionLabel.right,
                    positionerDimension
                )["left"]
        ).toBe(20);

        expect(
            rendered
                .instance()
                ["getHorizontalPositioningState"](
                    ViewportPositionerHorizontalPositionLabel.left,
                    positionerDimension
                )["right"]
        ).toBe(0);

        expect(
            rendered
                .instance()
                ["getHorizontalPositioningState"](
                    ViewportPositionerHorizontalPositionLabel.insetRight,
                    positionerDimension
                )["left"]
        ).toBe(10);

        expect(
            rendered
                .instance()
                ["getHorizontalPositioningState"](
                    ViewportPositionerHorizontalPositionLabel.insetLeft,
                    positionerDimension
                )["right"]
        ).toBe(-10);

        expect(
            rendered
                .instance()
                ["getVerticalPositioningState"](
                    ViewportPositionerVerticalPositionLabel.top,
                    positionerDimension
                )["bottom"]
        ).toBe(10);

        expect(
            rendered
                .instance()
                ["getVerticalPositioningState"](
                    ViewportPositionerVerticalPositionLabel.bottom,
                    positionerDimension
                )["top"]
        ).toBe(10);

        expect(
            rendered
                .instance()
                ["getVerticalPositioningState"](
                    ViewportPositionerVerticalPositionLabel.insetTop,
                    positionerDimension
                )["bottom"]
        ).toBe(0);

        expect(
            rendered
                .instance()
                ["getVerticalPositioningState"](
                    ViewportPositionerVerticalPositionLabel.insetBottom,
                    positionerDimension
                )["top"]
        ).toBe(0);
    });

    test("Positioner base position offset correctly calculated", (): void => {
        const rendered: any = mount(
            <ViewportPositioner
                horizontalPositioningMode={AxisPositioningMode.adjacent}
                verticalPositioningMode={AxisPositioningMode.adjacent}
                viewport={document.firstElementChild as HTMLElement}
                managedClasses={managedClasses}
            />
        );

        rendered.instance().viewportRect = viewportRect;
        rendered.instance().positionerDimension = { height: 70, width: 70 };
        rendered.instance().anchorTop = 60;
        rendered.instance().anchorRight = 70;
        rendered.instance().anchorBottom = 70;
        rendered.instance().anchorLeft = 60;
        rendered.instance().anchorWidth = 10;
        rendered.instance().anchorHeight = 10;
        rendered.instance().scrollTop = 0;
        rendered.instance().scrollLeft = 0;

        // test bottom right
        rendered.instance().baseHorizontalOffset = 0;
        rendered.instance().baseVerticalOffset = 0;
        rendered.instance().setState({
            currentHorizontalPosition: ViewportPositionerHorizontalPositionLabel.right,
            currentVerticalPosition: ViewportPositionerVerticalPositionLabel.bottom,
        });
        expect(rendered.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPositionLabel.right
        );
        expect(rendered.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPositionLabel.bottom
        );
        rendered.instance()["updatePositionerOffset"](positionerRectX70Y70);
        expect(rendered.instance().baseHorizontalOffset).toBe(0);
        expect(rendered.instance().baseVerticalOffset).toBe(0);

        // test inset bottom right
        rendered.instance().baseHorizontalOffset = 0;
        rendered.instance().baseVerticalOffset = 0;
        rendered.instance().setState({
            currentHorizontalPosition:
                ViewportPositionerHorizontalPositionLabel.insetRight,
            currentVerticalPosition: ViewportPositionerVerticalPositionLabel.insetBottom,
        });
        expect(rendered.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPositionLabel.insetRight
        );
        expect(rendered.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPositionLabel.insetBottom
        );
        rendered.instance()["updatePositionerOffset"](positionerRectX70Y70);
        expect(rendered.instance().baseHorizontalOffset).toBe(-10);
        expect(rendered.instance().baseVerticalOffset).toBe(-10);

        // test top left
        rendered.instance().baseHorizontalOffset = 0;
        rendered.instance().baseVerticalOffset = 0;
        rendered.instance().setState({
            currentHorizontalPosition: ViewportPositionerHorizontalPositionLabel.left,
            currentVerticalPosition: ViewportPositionerVerticalPositionLabel.top,
        });
        expect(rendered.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPositionLabel.left
        );
        expect(rendered.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPositionLabel.top
        );
        rendered.instance()["updatePositionerOffset"](positionerRectX70Y70);
        expect(rendered.instance().baseHorizontalOffset).toBe(-20);
        expect(rendered.instance().baseVerticalOffset).toBe(-20);

        // test inset top left
        rendered.instance().baseHorizontalOffset = 0;
        rendered.instance().baseVerticalOffset = 0;
        rendered.instance().setState({
            currentHorizontalPosition:
                ViewportPositionerHorizontalPositionLabel.insetLeft,
            currentVerticalPosition: ViewportPositionerVerticalPositionLabel.insetTop,
        });
        expect(rendered.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPositionLabel.insetLeft
        );
        expect(rendered.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPositionLabel.insetTop
        );
        rendered.instance()["updatePositionerOffset"](positionerRectX70Y70);
        expect(rendered.instance().baseHorizontalOffset).toBe(-10);
        expect(rendered.instance().baseVerticalOffset).toBe(-10);
    });

    test("Should scale positioner dimensions to match the viewport's height when scaleTofit is set to true", (): void => {
        const rendered: any = mount(
            <ViewportPositioner
                horizontalPositioningMode={AxisPositioningMode.inset}
                verticalPositioningMode={AxisPositioningMode.inset}
                anchor={anchorElement}
                viewport={document.firstElementChild as HTMLElement}
                managedClasses={managedClasses}
                scaleToFit={true}
            />
        );

        rendered.instance().positionerDimension = { height: 70, width: 70 };
        rendered.instance().viewportRect = viewportRect;
        rendered.instance().anchorTop = 100;
        rendered.instance().anchorRight = 160;
        rendered.instance().anchorBottom = 110;
        rendered.instance().anchorLeft = 150;
        rendered.instance().anchorWidth = 10;
        rendered.instance().anchorHeight = 10;
        rendered.instance().updateLayout();

        let positionerDimension: Dimension;

        positionerDimension = rendered
            .instance()
            ["getNextPositionerDimension"](
                ViewportPositionerHorizontalPositionLabel.insetRight,
                ViewportPositionerVerticalPositionLabel.insetBottom
            );
        expect(positionerDimension.width).toBe(100);
        expect(positionerDimension.height).toBe(100);

        positionerDimension = rendered
            .instance()
            ["getNextPositionerDimension"](
                ViewportPositionerHorizontalPositionLabel.right,
                ViewportPositionerVerticalPositionLabel.bottom
            );
        expect(positionerDimension.width).toBe(90);
        expect(positionerDimension.height).toBe(90);

        positionerDimension = rendered
            .instance()
            ["getNextPositionerDimension"](
                ViewportPositionerHorizontalPositionLabel.insetLeft,
                ViewportPositionerVerticalPositionLabel.insetTop
            );
        expect(positionerDimension.width).toBe(10);
        expect(positionerDimension.height).toBe(10);

        positionerDimension = rendered
            .instance()
            ["getNextPositionerDimension"](
                ViewportPositionerHorizontalPositionLabel.left,
                ViewportPositionerVerticalPositionLabel.top
            );
        expect(positionerDimension.width).toBe(0);
        expect(positionerDimension.height).toBe(0);
    });

    test("Positioner scaled sizes limited to viewport width", (): void => {
        const rendered: any = mount(
            <ViewportPositioner
                horizontalPositioningMode={AxisPositioningMode.inset}
                verticalPositioningMode={AxisPositioningMode.inset}
                anchor={anchorElement}
                viewport={document.firstElementChild as HTMLElement}
                managedClasses={managedClasses}
                scaleToFit={true}
            />
        );

        let positionerDimension: Dimension;

        rendered.instance().positionerDimension = { height: 70, width: 70 };
        rendered.instance().viewportRect = viewportRect;
        rendered.instance().anchorTop = 0;
        rendered.instance().anchorRight = 60;
        rendered.instance().anchorBottom = 10;
        rendered.instance().anchorLeft = 50;
        rendered.instance().anchorWidth = 10;
        rendered.instance().anchorHeight = 10;

        positionerDimension = rendered
            .instance()
            ["getNextPositionerDimension"](
                ViewportPositionerHorizontalPositionLabel.insetRight,
                ViewportPositionerVerticalPositionLabel.insetBottom
            );
        expect(positionerDimension.width).toBe(100);
        expect(positionerDimension.height).toBe(100);

        positionerDimension = rendered
            .instance()
            ["getNextPositionerDimension"](
                ViewportPositionerHorizontalPositionLabel.right,
                ViewportPositionerVerticalPositionLabel.bottom
            );
        expect(positionerDimension.width).toBe(100);
        expect(positionerDimension.height).toBe(100);

        rendered.instance().anchorTop = 300;
        rendered.instance().anchorRight = 360;
        rendered.instance().anchorBottom = 310;
        rendered.instance().anchorLeft = 3350;

        positionerDimension = rendered
            .instance()
            ["getNextPositionerDimension"](
                ViewportPositionerHorizontalPositionLabel.insetLeft,
                ViewportPositionerVerticalPositionLabel.insetTop
            );
        expect(positionerDimension.width).toBe(100);
        expect(positionerDimension.height).toBe(100);

        positionerDimension = rendered
            .instance()
            ["getNextPositionerDimension"](
                ViewportPositionerHorizontalPositionLabel.left,
                ViewportPositionerVerticalPositionLabel.top
            );
        expect(positionerDimension.width).toBe(100);
        expect(positionerDimension.height).toBe(100);
    });

    test("Positioner scaled sizes can't be smaller than threshold values", (): void => {
        const rendered: any = mount(
            <ViewportPositioner
                horizontalPositioningMode={AxisPositioningMode.inset}
                verticalPositioningMode={AxisPositioningMode.inset}
                horizontalThreshold={110}
                verticalThreshold={110}
                anchor={anchorElement}
                viewport={document.firstElementChild as HTMLElement}
                managedClasses={managedClasses}
                scaleToFit={true}
            />
        );

        let positionerDimension: Dimension;

        rendered.instance().viewportRect = viewportRect;
        rendered.instance().positionerDimension = { height: 70, width: 70 };
        rendered.instance().anchorTop = 0;
        rendered.instance().anchorRight = 60;
        rendered.instance().anchorBottom = 10;
        rendered.instance().anchorLeft = 50;
        rendered.instance().anchorWidth = 10;
        rendered.instance().anchorHeight = 10;

        positionerDimension = rendered
            .instance()
            ["getNextPositionerDimension"](
                ViewportPositionerHorizontalPositionLabel.insetRight,
                ViewportPositionerVerticalPositionLabel.insetBottom
            );
        expect(positionerDimension.width).toBe(110);
        expect(positionerDimension.height).toBe(110);

        positionerDimension = rendered
            .instance()
            ["getNextPositionerDimension"](
                ViewportPositionerHorizontalPositionLabel.right,
                ViewportPositionerVerticalPositionLabel.bottom
            );
        expect(positionerDimension.width).toBe(110);
        expect(positionerDimension.height).toBe(110);

        rendered.instance().anchorTop = 300;
        rendered.instance().anchorRight = 360;
        rendered.instance().anchorBottom = 310;
        rendered.instance().anchorLeft = 3350;

        positionerDimension = rendered
            .instance()
            ["getNextPositionerDimension"](
                ViewportPositionerHorizontalPositionLabel.insetLeft,
                ViewportPositionerVerticalPositionLabel.insetTop
            );
        expect(positionerDimension.width).toBe(110);
        expect(positionerDimension.height).toBe(110);

        positionerDimension = rendered
            .instance()
            ["getNextPositionerDimension"](
                ViewportPositionerHorizontalPositionLabel.left,
                ViewportPositionerVerticalPositionLabel.top
            );
        expect(positionerDimension.width).toBe(110);
        expect(positionerDimension.height).toBe(110);
    });

    test("should create a resize observer if it is available", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);

        const ActualObserver: ConstructibleResizeObserver = ((window as unknown) as WindowWithResizeObserver)
            .ResizeObserver;
        const construct: jest.Mock<any, any> = jest.fn();
        // Mock the resize observer
        class MockResizeObserver {
            public observe: jest.Mock<any, any> = jest.fn();
            public unobserve: jest.Mock<any, any> = jest.fn();
            public disconnect: jest.Mock<any, any> = jest.fn();
            constructor() {
                construct();
            }
        }
        ((window as unknown) as WindowWithResizeObserver).ResizeObserver = MockResizeObserver;

        // Render the component
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        const rendered: any = mount(
            <ViewportPositioner
                viewport={container}
                anchor={anchorElement}
                managedClasses={managedClasses}
            />,
            { attachTo: container }
        );

        expect(construct).toBeCalledTimes(1);
        // Replace the window to it's original state
        ((window as unknown) as WindowWithResizeObserver).ResizeObserver = ActualObserver;

        document.body.removeChild(container);
    });

    test("should disconnect the resize observer when unmounted", (): void => {
        const container: HTMLDivElement = document.createElement("div");
        document.body.appendChild(container);

        const ActualObserver: ConstructibleResizeObserver = ((window as unknown) as WindowWithResizeObserver)
            .ResizeObserver;
        const disconnect: jest.Mock<any, any> = jest.fn();
        // Mock the resize observer
        class MockResizeObserver {
            public observe: jest.Mock<any, any> = jest.fn();
            public unobserve: jest.Mock<any, any> = jest.fn();
            public disconnect: jest.Mock<any, any> = disconnect;
        }
        ((window as unknown) as WindowWithResizeObserver).ResizeObserver = MockResizeObserver;

        // Render the component
        const rendered: any = mount(
            <ViewportPositioner
                viewport={container}
                anchor={anchorElement}
                managedClasses={managedClasses}
            />,
            { attachTo: container }
        );

        rendered.unmount();
        expect(disconnect).toBeCalledTimes(1);
        // Replace the window to it's original state
        ((window as unknown) as WindowWithResizeObserver).ResizeObserver = ActualObserver;

        document.body.removeChild(container);
    });
});

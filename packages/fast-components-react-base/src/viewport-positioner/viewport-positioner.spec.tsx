import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import ViewportPositioner, {
    ViewportPositionerClassNameContract,
    ViewportPositionerHandledProps,
    ViewportPositionerHorizontalPositionLabel,
    ViewportPositionerProps,
    ViewportPositionerUnhandledProps,
    ViewportPositionerVerticalPositionLabel,
} from "./viewport-positioner";
import { DisplayNamePrefix } from "../utilities";
import {
    AxisPositioningMode,
    ViewportPositionerHorizontalPosition,
    ViewportPositionerVerticalPosition,
} from "./viewport-positioner.props";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

const viewportRect: ClientRect = {
    top: 0,
    right: 100,
    bottom: 100,
    left: 0,
    height: 100,
    width: 100,
};

// positioner rects are described by -x-y coordinates
const positionerRectX20Y20: ClientRect = {
    top: 20,
    right: 30,
    bottom: 30,
    left: 20,
    height: 10,
    width: 10,
};

const positionerRectX70Y70: ClientRect = {
    top: 70,
    right: 80,
    bottom: 80,
    left: 70,
    height: 10,
    width: 10,
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

/* tslint:disable:no-string-literal */
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

    test("should be disabled without an anchor", (): void => {
        const rendered: any = mount(
            <div>
                <ViewportPositioner
                    defaultHorizontalPosition={ViewportPositionerHorizontalPosition.left}
                    managedClasses={managedClasses}
                />
            </div>
        );

        const positioner: any = rendered.find("BaseViewportPositioner");
        expect(positioner.instance().state.disabled).toBe(true);
    });

    test("should be enabled with an anchor", (): void => {
        const anchorElement: React.RefObject<HTMLDivElement> = React.createRef<
            HTMLDivElement
        >();

        const rendered: any = mount(
            <div>
                <div ref={anchorElement} />
                <ViewportPositioner
                    anchor={anchorElement}
                    managedClasses={managedClasses}
                />
            </div>
        );

        const positioner: any = rendered.find("BaseViewportPositioner");
        expect(positioner.instance().state.disabled).toBe(false);
    });

    test("should be disabled when disabled prop is set", (): void => {
        const anchorElement: React.RefObject<HTMLDivElement> = React.createRef<
            HTMLDivElement
        >();

        const rendered: any = mount(
            <div>
                <div ref={anchorElement} />
                <ViewportPositioner
                    disabled={true}
                    anchor={anchorElement}
                    managedClasses={managedClasses}
                />
            </div>
        );

        const positioner: any = rendered.find("BaseViewportPositioner");
        expect(positioner.instance().state.disabled).toBe(true);
    });

    test("positioning values applied correctly for specified default position - pt1", (): void => {
        const anchorElement: React.RefObject<HTMLDivElement> = React.createRef<
            HTMLDivElement
        >();

        const rendered: any = mount(
            <div>
                <div ref={anchorElement} />
                <ViewportPositioner
                    horizontalPositioningMode={AxisPositioningMode.adjacent}
                    defaultHorizontalPosition={ViewportPositionerHorizontalPosition.left}
                    verticalPositioningMode={AxisPositioningMode.adjacent}
                    defaultVerticalPosition={ViewportPositionerVerticalPosition.top}
                    anchor={anchorElement}
                    managedClasses={managedClasses}
                />
            </div>
        );

        const positioner: any = rendered.find("BaseViewportPositioner");
        expect(positioner.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPosition.left
        );
        expect(positioner.instance().state.right).not.toBe(null);
        expect(positioner.instance().state.left).toBe(null);
        expect(positioner.instance().state.xTransformOrigin).toBe("right");
        expect(positioner.instance().rootElement.current.className).toContain(
            managedClasses.viewportPositioner__left
        );

        expect(positioner.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPosition.top
        );
        expect(positioner.instance().state.bottom).not.toBe(null);
        expect(positioner.instance().state.top).toBe(null);
        expect(positioner.instance().state.yTransformOrigin).toBe("bottom");
        expect(positioner.instance().rootElement.current.className).toContain(
            managedClasses.viewportPositioner__top
        );
    });

    test("positioning values applied correctly for specified default position - pt2", (): void => {
        const anchorElement: React.RefObject<HTMLDivElement> = React.createRef<
            HTMLDivElement
        >();

        const rendered: any = mount(
            <div>
                <div ref={anchorElement} />
                <ViewportPositioner
                    horizontalPositioningMode={AxisPositioningMode.adjacent}
                    defaultHorizontalPosition={ViewportPositionerHorizontalPosition.right}
                    verticalPositioningMode={AxisPositioningMode.adjacent}
                    defaultVerticalPosition={ViewportPositionerVerticalPosition.bottom}
                    anchor={anchorElement}
                    managedClasses={managedClasses}
                />
            </div>
        );

        const positioner: any = rendered.find("BaseViewportPositioner");
        expect(positioner.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPosition.right
        );
        expect(positioner.instance().state.right).toBe(null);
        expect(positioner.instance().state.left).not.toBe(null);
        expect(positioner.instance().state.xTransformOrigin).toBe("left");
        expect(positioner.instance().rootElement.current.className).toContain(
            managedClasses.viewportPositioner__right
        );

        expect(positioner.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPosition.bottom
        );
        expect(positioner.instance().state.bottom).toBe(null);
        expect(positioner.instance().state.top).not.toBe(null);
        expect(positioner.instance().state.yTransformOrigin).toBe("top");
        expect(positioner.instance().rootElement.current.className).toContain(
            managedClasses.viewportPositioner__bottom
        );
    });

    test("positioning values applied correctly for specified default position - pt3", (): void => {
        const anchorElement: React.RefObject<HTMLDivElement> = React.createRef<
            HTMLDivElement
        >();

        const rendered: any = mount(
            <div>
                <div ref={anchorElement} />
                <ViewportPositioner
                    horizontalPositioningMode={AxisPositioningMode.inset}
                    defaultHorizontalPosition={ViewportPositionerHorizontalPosition.left}
                    verticalPositioningMode={AxisPositioningMode.inset}
                    defaultVerticalPosition={ViewportPositionerVerticalPosition.top}
                    anchor={anchorElement}
                    managedClasses={managedClasses}
                />
            </div>
        );

        const positioner: any = rendered.find("BaseViewportPositioner");
        expect(positioner.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPositionLabel.insetLeft
        );
        expect(positioner.instance().state.right).not.toBe(null);
        expect(positioner.instance().state.left).toBe(null);
        expect(positioner.instance().state.xTransformOrigin).toBe("right");
        expect(positioner.instance().rootElement.current.className).toContain(
            managedClasses.viewportPositioner__left
        );
        expect(positioner.instance().rootElement.current.className).toContain(
            managedClasses.viewportPositioner__horizontalInset
        );

        expect(positioner.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPositionLabel.insetTop
        );
        expect(positioner.instance().state.bottom).not.toBe(null);
        expect(positioner.instance().state.top).toBe(null);
        expect(positioner.instance().state.yTransformOrigin).toBe("bottom");
        expect(positioner.instance().rootElement.current.className).toContain(
            managedClasses.viewportPositioner__top
        );
        expect(positioner.instance().rootElement.current.className).toContain(
            managedClasses.viewportPositioner__verticalInset
        );
    });

    test("positioning values applied correctly for specified default position - pt4", (): void => {
        const anchorElement: React.RefObject<HTMLDivElement> = React.createRef<
            HTMLDivElement
        >();

        const rendered: any = mount(
            <div>
                <div ref={anchorElement} />
                <ViewportPositioner
                    horizontalPositioningMode={AxisPositioningMode.inset}
                    defaultHorizontalPosition={ViewportPositionerHorizontalPosition.right}
                    verticalPositioningMode={AxisPositioningMode.inset}
                    defaultVerticalPosition={ViewportPositionerVerticalPosition.bottom}
                    anchor={anchorElement}
                    managedClasses={managedClasses}
                />
            </div>
        );

        const positioner: any = rendered.find("BaseViewportPositioner");
        expect(positioner.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPositionLabel.insetRight
        );
        expect(positioner.instance().state.right).toBe(null);
        expect(positioner.instance().state.left).not.toBe(null);
        expect(positioner.instance().state.xTransformOrigin).toBe("left");
        expect(positioner.instance().rootElement.current.className).toContain(
            managedClasses.viewportPositioner__right
        );
        expect(positioner.instance().rootElement.current.className).toContain(
            managedClasses.viewportPositioner__horizontalInset
        );

        expect(positioner.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPositionLabel.insetBottom
        );
        expect(positioner.instance().state.bottom).toBe(null);
        expect(positioner.instance().state.top).not.toBe(null);
        expect(positioner.instance().state.yTransformOrigin).toBe("top");
        expect(positioner.instance().rootElement.current.className).toContain(
            managedClasses.viewportPositioner__bottom
        );
        expect(positioner.instance().rootElement.current.className).toContain(
            managedClasses.viewportPositioner__verticalInset
        );
    });

    test("Option sizes calculated correctly - adjacent", (): void => {
        const anchorElement: React.RefObject<HTMLDivElement> = React.createRef<
            HTMLDivElement
        >();
        const viewportElement: React.RefObject<HTMLDivElement> = React.createRef<
            HTMLDivElement
        >();

        const rendered: any = mount(
            <div
                style={{
                    height: "100px",
                    width: "100px",
                }}
                ref={viewportElement}
            >
                <div
                    style={{
                        height: "10px",
                        width: "10px",
                    }}
                    ref={anchorElement}
                />
                <ViewportPositioner
                    horizontalPositioningMode={AxisPositioningMode.adjacent}
                    verticalPositioningMode={AxisPositioningMode.adjacent}
                    anchor={anchorElement}
                    viewport={viewportElement}
                    managedClasses={managedClasses}
                />
            </div>
        );

        const positioner: any = rendered.find("BaseViewportPositioner");

        positioner.instance().viewportRect = viewportRect;
        positioner.instance().positionerRect = positionerRectX70Y70;
        positioner.instance().anchorTop = 80;
        positioner.instance().anchorRight = 90;
        positioner.instance().anchorBottom = 90;
        positioner.instance().anchorLeft = 80;
        positioner.instance().anchorWidth = 10;
        positioner.instance().anchorHeight = 10;
        positioner.instance().scrollTop = 0;
        positioner.instance().scrollLeft = 0;

        expect(
            positioner
                .instance()
                ["getHorizontalPositionAvailableWidth"](
                    ViewportPositionerHorizontalPosition.left
                )
        ).toBe(80);
        expect(
            positioner
                .instance()
                ["getHorizontalPositionAvailableWidth"](
                    ViewportPositionerHorizontalPosition.right
                )
        ).toBe(10);
        expect(
            positioner
                .instance()
                ["getVerticalPositionAvailableHeight"](
                    ViewportPositionerVerticalPosition.top
                )
        ).toBe(80);
        expect(
            positioner
                .instance()
                ["getVerticalPositionAvailableHeight"](
                    ViewportPositionerVerticalPosition.bottom
                )
        ).toBe(10);
    });

    test("Option sizes calculated correctly - inset", (): void => {
        const anchorElement: React.RefObject<HTMLDivElement> = React.createRef<
            HTMLDivElement
        >();
        const viewportElement: React.RefObject<HTMLDivElement> = React.createRef<
            HTMLDivElement
        >();

        const rendered: any = mount(
            <div
                style={{
                    height: "100px",
                    width: "100px",
                }}
                ref={viewportElement}
            >
                <div
                    style={{
                        height: "10px",
                        width: "10px",
                    }}
                    ref={anchorElement}
                />
                <ViewportPositioner
                    horizontalPositioningMode={AxisPositioningMode.inset}
                    verticalPositioningMode={AxisPositioningMode.inset}
                    anchor={anchorElement}
                    viewport={viewportElement}
                    managedClasses={managedClasses}
                />
            </div>
        );

        const positioner: any = rendered.find("BaseViewportPositioner");

        positioner.instance().viewportRect = viewportRect;
        positioner.instance().positionerRect = positionerRectX70Y70;
        positioner.instance().anchorTop = 80;
        positioner.instance().anchorRight = 90;
        positioner.instance().anchorBottom = 90;
        positioner.instance().anchorLeft = 80;
        positioner.instance().anchorWidth = 10;
        positioner.instance().anchorHeight = 10;
        positioner.instance().scrollTop = 0;
        positioner.instance().scrollLeft = 0;

        expect(
            positioner
                .instance()
                ["getHorizontalPositionAvailableWidth"](
                    ViewportPositionerHorizontalPositionLabel.insetLeft
                )
        ).toBe(90);
        expect(
            positioner
                .instance()
                ["getHorizontalPositionAvailableWidth"](
                    ViewportPositionerHorizontalPositionLabel.insetRight
                )
        ).toBe(20);
        expect(
            positioner
                .instance()
                ["getVerticalPositionAvailableHeight"](
                    ViewportPositionerVerticalPositionLabel.insetTop
                )
        ).toBe(90);
        expect(
            positioner
                .instance()
                ["getVerticalPositionAvailableHeight"](
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

        const positioner: any = rendered.find("BaseViewportPositioner");

        const horizontalPositions: ViewportPositionerHorizontalPositionLabel[] = positioner
            .instance()
            ["getHorizontalPositioningOptions"]();
        const verticalPositions: ViewportPositionerVerticalPositionLabel[] = positioner
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

        const positioner: any = rendered.find("BaseViewportPositioner");

        const horizontalPositions: ViewportPositionerHorizontalPosition[] = positioner
            .instance()
            ["getHorizontalPositioningOptions"]();
        const verticalPositions: ViewportPositionerVerticalPosition[] = positioner
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
        const anchorElement: React.RefObject<HTMLDivElement> = React.createRef<
            HTMLDivElement
        >();
        const viewportElement: React.RefObject<HTMLDivElement> = React.createRef<
            HTMLDivElement
        >();

        const rendered: any = mount(
            <div
                style={{
                    height: "100px",
                    width: "100px",
                }}
                ref={viewportElement}
            >
                <div
                    style={{
                        height: "10px",
                        width: "10px",
                    }}
                    ref={anchorElement}
                />
                <ViewportPositioner
                    horizontalPositioningMode={AxisPositioningMode.adjacent}
                    defaultHorizontalPosition={
                        ViewportPositionerHorizontalPosition.uncontrolled
                    }
                    verticalPositioningMode={AxisPositioningMode.adjacent}
                    defaultVerticalPosition={
                        ViewportPositionerVerticalPosition.uncontrolled
                    }
                    anchor={anchorElement}
                    viewport={viewportElement}
                    managedClasses={managedClasses}
                />
            </div>
        );

        const positioner: any = rendered.find("BaseViewportPositioner");

        positioner.instance().viewportRect = viewportRect;
        positioner.instance().positionerRect = positionerRectX70Y70;
        positioner.instance().anchorTop = 80;
        positioner.instance().anchorRight = 90;
        positioner.instance().anchorBottom = 90;
        positioner.instance().anchorLeft = 80;
        positioner.instance().anchorWidth = 10;
        positioner.instance().anchorHeight = 10;
        positioner.instance().scrollTop = 0;
        positioner.instance().scrollLeft = 0;

        positioner.instance()["updateLayout"]();

        expect(positioner.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPosition.left
        );
        expect(positioner.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPosition.top
        );
    });

    test("widest option chosen by default - pt2", (): void => {
        const anchorElement: React.RefObject<HTMLDivElement> = React.createRef<
            HTMLDivElement
        >();
        const viewportElement: React.RefObject<HTMLDivElement> = React.createRef<
            HTMLDivElement
        >();

        const rendered: any = mount(
            <div
                style={{
                    height: "100px",
                    width: "100px",
                }}
                ref={viewportElement}
            >
                <div
                    style={{
                        height: "10px",
                        width: "10px",
                    }}
                    ref={anchorElement}
                />
                <ViewportPositioner
                    horizontalPositioningMode={AxisPositioningMode.adjacent}
                    verticalPositioningMode={AxisPositioningMode.adjacent}
                    anchor={anchorElement}
                    viewport={viewportElement}
                    managedClasses={managedClasses}
                />
            </div>
        );

        const positioner: any = rendered.find("BaseViewportPositioner");

        positioner.instance().viewportRect = viewportRect;
        positioner.instance().positionerRect = positionerRectX20Y20;
        positioner.instance().anchorTop = 10;
        positioner.instance().anchorRight = 20;
        positioner.instance().anchorBottom = 20;
        positioner.instance().anchorLeft = 10;
        positioner.instance().anchorWidth = 10;
        positioner.instance().anchorHeight = 10;
        positioner.instance().scrollTop = 0;
        positioner.instance().scrollLeft = 0;

        positioner.instance()["updateLayout"]();

        expect(positioner.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPosition.right
        );
        expect(positioner.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPosition.bottom
        );
    });

    test("Translate transforms calculated correctly - top/left", (): void => {
        const anchorElement: React.RefObject<HTMLDivElement> = React.createRef<
            HTMLDivElement
        >();
        const viewportElement: React.RefObject<HTMLDivElement> = React.createRef<
            HTMLDivElement
        >();

        const rendered: any = mount(
            <div
                style={{
                    height: "100px",
                    width: "100px",
                }}
                ref={viewportElement}
            >
                <div
                    style={{
                        height: "10px",
                        width: "10px",
                    }}
                    ref={anchorElement}
                />
                <ViewportPositioner
                    horizontalPositioningMode={AxisPositioningMode.inset}
                    verticalPositioningMode={AxisPositioningMode.inset}
                    anchor={anchorElement}
                    viewport={viewportElement}
                    managedClasses={managedClasses}
                    horizontalAlwaysInView={true}
                    verticalAlwaysInView={true}
                />
            </div>
        );

        const positioner: any = rendered.find("BaseViewportPositioner");

        positioner.instance().viewportRect = viewportRect;
        positioner.instance().anchorTop = 200;
        positioner.instance().anchorRight = 210;
        positioner.instance().anchorBottom = 210;
        positioner.instance().anchorLeft = 200;

        expect(
            positioner
                .instance()
                ["getHorizontalTranslate"](
                    ViewportPositionerHorizontalPositionLabel.insetLeft
                )
        ).toBe(-111);
        expect(
            positioner
                .instance()
                ["getHorizontalTranslate"](ViewportPositionerHorizontalPosition.left)
        ).toBe(-101);
        expect(
            positioner
                .instance()
                ["getVerticalTranslate"](ViewportPositionerVerticalPositionLabel.insetTop)
        ).toBe(-111);
        expect(
            positioner
                .instance()
                ["getVerticalTranslate"](ViewportPositionerVerticalPosition.top)
        ).toBe(-101);
    });

    test("Translate transforms calculated correctly - bottom/right", (): void => {
        const anchorElement: React.RefObject<HTMLDivElement> = React.createRef<
            HTMLDivElement
        >();
        const viewportElement: React.RefObject<HTMLDivElement> = React.createRef<
            HTMLDivElement
        >();

        const rendered: any = mount(
            <div
                style={{
                    height: "100px",
                    width: "100px",
                }}
                ref={viewportElement}
            >
                <div
                    style={{
                        height: "10px",
                        width: "10px",
                    }}
                    ref={anchorElement}
                />
                <ViewportPositioner
                    horizontalPositioningMode={AxisPositioningMode.inset}
                    verticalPositioningMode={AxisPositioningMode.inset}
                    anchor={anchorElement}
                    viewport={viewportElement}
                    managedClasses={managedClasses}
                    horizontalAlwaysInView={true}
                    verticalAlwaysInView={true}
                />
            </div>
        );

        const positioner: any = rendered.find("BaseViewportPositioner");

        positioner.instance().viewportRect = viewportRect;
        positioner.instance().anchorTop = -210;
        positioner.instance().anchorRight = -200;
        positioner.instance().anchorBottom = -200;
        positioner.instance().anchorLeft = -210;

        expect(
            positioner
                .instance()
                ["getHorizontalTranslate"](
                    ViewportPositionerHorizontalPositionLabel.insetRight
                )
        ).toBe(211);
        expect(
            positioner
                .instance()
                ["getHorizontalTranslate"](ViewportPositionerHorizontalPosition.right)
        ).toBe(201);
        expect(
            positioner
                .instance()
                ["getVerticalTranslate"](
                    ViewportPositionerVerticalPositionLabel.insetBottom
                )
        ).toBe(211);
        expect(
            positioner
                .instance()
                ["getVerticalTranslate"](ViewportPositionerVerticalPosition.bottom)
        ).toBe(201);
    });

    test("Positioner moves to biggest area on updateLayout() when spacing changes", (): void => {
        const anchorElement: React.RefObject<HTMLDivElement> = React.createRef<
            HTMLDivElement
        >();
        const viewportElement: React.RefObject<HTMLDivElement> = React.createRef<
            HTMLDivElement
        >();

        const rendered: any = mount(
            <div
                style={{
                    height: "100px",
                    width: "100px",
                }}
                ref={viewportElement}
            >
                <div
                    style={{
                        height: "10px",
                        width: "10px",
                    }}
                    ref={anchorElement}
                />
                <ViewportPositioner
                    horizontalPositioningMode={AxisPositioningMode.adjacent}
                    defaultHorizontalPosition={
                        ViewportPositionerHorizontalPosition.uncontrolled
                    }
                    verticalPositioningMode={AxisPositioningMode.adjacent}
                    defaultVerticalPosition={
                        ViewportPositionerVerticalPosition.uncontrolled
                    }
                    anchor={anchorElement}
                    viewport={viewportElement}
                    managedClasses={managedClasses}
                />
            </div>
        );

        const positioner: any = rendered.find("BaseViewportPositioner");

        positioner.instance().viewportRect = viewportRect;
        positioner.instance().positionerRect = positionerRectX70Y70;
        positioner.instance().anchorTop = 80;
        positioner.instance().anchorRight = 90;
        positioner.instance().anchorBottom = 90;
        positioner.instance().anchorLeft = 80;
        positioner.instance().anchorWidth = 10;
        positioner.instance().anchorHeight = 10;
        positioner.instance().scrollTop = 0;
        positioner.instance().scrollLeft = 0;

        positioner.instance()["updateLayout"]();

        expect(positioner.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPosition.left
        );
        expect(positioner.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPosition.top
        );

        positioner.instance().anchorTop = 10;
        positioner.instance().anchorRight = 20;
        positioner.instance().anchorBottom = 20;
        positioner.instance().anchorLeft = 10;

        positioner.instance()["updateLayout"]();

        expect(positioner.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPosition.right
        );
        expect(positioner.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPosition.bottom
        );
    });

    test("Positioner prefers default position until threshold is passed", (): void => {
        const anchorElement: React.RefObject<HTMLDivElement> = React.createRef<
            HTMLDivElement
        >();
        const viewportElement: React.RefObject<HTMLDivElement> = React.createRef<
            HTMLDivElement
        >();

        const rendered: any = mount(
            <div
                style={{
                    height: "100px",
                    width: "100px",
                }}
                ref={viewportElement}
            >
                <div
                    style={{
                        height: "10px",
                        width: "10px",
                    }}
                    ref={anchorElement}
                />
                <ViewportPositioner
                    horizontalPositioningMode={AxisPositioningMode.adjacent}
                    defaultHorizontalPosition={ViewportPositionerHorizontalPosition.left}
                    horizontalThreshold={20}
                    verticalPositioningMode={AxisPositioningMode.adjacent}
                    defaultVerticalPosition={ViewportPositionerVerticalPosition.top}
                    verticalThreshold={20}
                    anchor={anchorElement}
                    viewport={viewportElement}
                    managedClasses={managedClasses}
                />
            </div>
        );

        const positioner: any = rendered.find("BaseViewportPositioner");

        positioner.instance().viewportRect = viewportRect;
        positioner.instance().positionerRect = positionerRectX70Y70;
        positioner.instance().anchorTop = 80;
        positioner.instance().anchorRight = 90;
        positioner.instance().anchorBottom = 90;
        positioner.instance().anchorLeft = 80;
        positioner.instance().anchorWidth = 10;
        positioner.instance().anchorHeight = 10;
        positioner.instance().scrollTop = 0;
        positioner.instance().scrollLeft = 0;

        positioner.instance()["updateLayout"]();

        expect(positioner.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPosition.left
        );
        expect(positioner.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPosition.top
        );

        positioner.instance().anchorTop = 20;
        positioner.instance().anchorRight = 30;
        positioner.instance().anchorBottom = 30;
        positioner.instance().anchorLeft = 20;

        positioner.instance()["updateLayout"]();

        expect(positioner.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPosition.left
        );
        expect(positioner.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPosition.top
        );

        positioner.instance().anchorTop = 10;
        positioner.instance().anchorRight = 20;
        positioner.instance().anchorBottom = 20;
        positioner.instance().anchorLeft = 10;

        positioner.instance()["updateLayout"]();

        expect(positioner.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPosition.right
        );
        expect(positioner.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPosition.bottom
        );
    });
});

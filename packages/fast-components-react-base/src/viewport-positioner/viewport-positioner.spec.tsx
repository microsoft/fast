import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import ViewportPositioner, {
    Dimension,
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
import Button from "../button";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

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
            <div>
                <ViewportPositioner
                    viewport={document.firstElementChild as HTMLElement}
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
                    viewport={document.firstElementChild as HTMLElement}
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
                    viewport={document.firstElementChild as HTMLElement}
                    disabled={true}
                    anchor={anchorElement}
                    managedClasses={managedClasses}
                />
            </div>
        );

        const positioner: any = rendered.find("BaseViewportPositioner");
        expect(positioner.instance().state.disabled).toBe(true);
    });

    test("positioning values applied correctly for specified default position - adjacent + top + left", (): void => {
        const anchorElement: React.RefObject<HTMLDivElement> = React.createRef<
            HTMLDivElement
        >();

        const rendered: any = mount(
            <div>
                <div ref={anchorElement} />
                <ViewportPositioner
                    viewport={document.firstElementChild as HTMLElement}
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
        positioner.instance().updateLayout();
        expect(positioner.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPosition.left
        );
        expect(positioner.instance().state.right).not.toBe(null);
        expect(positioner.instance().state.left).toBe(null);
        expect(positioner.instance().state.xTransformOrigin).toBe("right");
        expect(positioner.instance().rootElement.current.className).toContain(
            managedClasses.viewportPositioner__left
        );
        expect(positioner.instance().rootElement.current.className).not.toContain(
            managedClasses.viewportPositioner__right
        );
        expect(positioner.instance().rootElement.current.className).not.toContain(
            managedClasses.viewportPositioner__horizontalInset
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
        expect(positioner.instance().rootElement.current.className).not.toContain(
            managedClasses.viewportPositioner__bottom
        );
        expect(positioner.instance().rootElement.current.className).not.toContain(
            managedClasses.viewportPositioner__verticalInset
        );
    });

    test("positioning values applied correctly for specified default position - adjacent + bottom + right", (): void => {
        const anchorElement: React.RefObject<HTMLDivElement> = React.createRef<
            HTMLDivElement
        >();

        const rendered: any = mount(
            <div>
                <div ref={anchorElement} />
                <ViewportPositioner
                    viewport={document.firstElementChild as HTMLElement}
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
        positioner.instance().updateLayout();
        expect(positioner.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPosition.right
        );
        expect(positioner.instance().state.right).toBe(null);
        expect(positioner.instance().state.left).not.toBe(null);
        expect(positioner.instance().state.xTransformOrigin).toBe("left");
        expect(positioner.instance().rootElement.current.className).toContain(
            managedClasses.viewportPositioner__right
        );
        expect(positioner.instance().rootElement.current.className).not.toContain(
            managedClasses.viewportPositioner__left
        );
        expect(positioner.instance().rootElement.current.className).not.toContain(
            managedClasses.viewportPositioner__horizontalInset
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
        expect(positioner.instance().rootElement.current.className).not.toContain(
            managedClasses.viewportPositioner__top
        );
        expect(positioner.instance().rootElement.current.className).not.toContain(
            managedClasses.viewportPositioner__verticalInset
        );
    });

    test("positioning values applied correctly for specified default position - inset + top + left", (): void => {
        const anchorElement: React.RefObject<HTMLDivElement> = React.createRef<
            HTMLDivElement
        >();

        const rendered: any = mount(
            <div>
                <div ref={anchorElement} />
                <ViewportPositioner
                    viewport={document.firstElementChild as HTMLElement}
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
        positioner.instance().updateLayout();
        expect(positioner.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPositionLabel.insetLeft
        );
        expect(positioner.instance().state.right).not.toBe(null);
        expect(positioner.instance().state.left).toBe(null);
        expect(positioner.instance().state.xTransformOrigin).toBe("right");
        expect(positioner.instance().rootElement.current.className).toContain(
            managedClasses.viewportPositioner__left
        );
        expect(positioner.instance().rootElement.current.className).not.toContain(
            managedClasses.viewportPositioner__right
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
        expect(positioner.instance().rootElement.current.className).not.toContain(
            managedClasses.viewportPositioner__bottom
        );
        expect(positioner.instance().rootElement.current.className).toContain(
            managedClasses.viewportPositioner__verticalInset
        );
    });

    test("positioning values applied correctly for specified default position - inset + bottom + right", (): void => {
        const anchorElement: React.RefObject<HTMLDivElement> = React.createRef<
            HTMLDivElement
        >();

        const rendered: any = mount(
            <div>
                <div ref={anchorElement} />
                <ViewportPositioner
                    viewport={document.firstElementChild as HTMLElement}
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
        positioner.instance().updateLayout();
        expect(positioner.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPositionLabel.insetRight
        );
        expect(positioner.instance().state.right).toBe(null);
        expect(positioner.instance().state.left).not.toBe(null);
        expect(positioner.instance().state.xTransformOrigin).toBe("left");
        expect(positioner.instance().rootElement.current.className).toContain(
            managedClasses.viewportPositioner__right
        );
        expect(positioner.instance().rootElement.current.className).not.toContain(
            managedClasses.viewportPositioner__left
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
        expect(positioner.instance().rootElement.current.className).not.toContain(
            managedClasses.viewportPositioner__top
        );
        expect(positioner.instance().rootElement.current.className).toContain(
            managedClasses.viewportPositioner__verticalInset
        );
    });

    test("Option sizes calculated correctly - adjacent", (): void => {
        const anchorElement: React.RefObject<HTMLDivElement> = React.createRef<
            HTMLDivElement
        >();

        const rendered: any = mount(
            <div
                style={{
                    height: "100px",
                    width: "100px",
                }}
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
                    viewport={document.firstElementChild as HTMLElement}
                    managedClasses={managedClasses}
                />
            </div>
        );

        const positioner: any = rendered.find("BaseViewportPositioner");

        positioner.instance().viewportRect = viewportRect;
        positioner.instance().positionerRect = positionerRectX70Y70;
        positioner.instance().anchorTop = 180;
        positioner.instance().anchorRight = 240;
        positioner.instance().anchorBottom = 190;
        positioner.instance().anchorLeft = 230;
        positioner.instance().anchorWidth = 10;
        positioner.instance().anchorHeight = 10;
        positioner.instance().scrollTop = 0;
        positioner.instance().scrollLeft = 0;

        expect(
            positioner
                .instance()
                ["getAvailableWidth"](ViewportPositionerHorizontalPosition.left)
        ).toBe(80);
        expect(
            positioner
                .instance()
                ["getAvailableWidth"](ViewportPositionerHorizontalPosition.right)
        ).toBe(10);
        expect(
            positioner
                .instance()
                ["getAvailableHeight"](ViewportPositionerVerticalPosition.top)
        ).toBe(80);
        expect(
            positioner
                .instance()
                ["getAvailableHeight"](ViewportPositionerVerticalPosition.bottom)
        ).toBe(10);
    });

    test("Option sizes calculated correctly - inset", (): void => {
        const anchorElement: React.RefObject<HTMLDivElement> = React.createRef<
            HTMLDivElement
        >();

        const rendered: any = mount(
            <div
                style={{
                    height: "100px",
                    width: "100px",
                }}
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
                    viewport={document.firstElementChild as HTMLElement}
                    managedClasses={managedClasses}
                />
            </div>
        );

        const positioner: any = rendered.find("BaseViewportPositioner");

        positioner.instance().viewportRect = viewportRect;
        positioner.instance().positionerRect = positionerRectX70Y70;
        positioner.instance().anchorTop = 180;
        positioner.instance().anchorRight = 240;
        positioner.instance().anchorBottom = 190;
        positioner.instance().anchorLeft = 230;
        positioner.instance().anchorWidth = 10;
        positioner.instance().anchorHeight = 10;
        positioner.instance().scrollTop = 0;
        positioner.instance().scrollLeft = 0;

        expect(
            positioner
                .instance()
                ["getAvailableWidth"](ViewportPositionerHorizontalPositionLabel.insetLeft)
        ).toBe(90);
        expect(
            positioner
                .instance()
                ["getAvailableWidth"](
                    ViewportPositionerHorizontalPositionLabel.insetRight
                )
        ).toBe(20);
        expect(
            positioner
                .instance()
                ["getAvailableHeight"](ViewportPositionerVerticalPositionLabel.insetTop)
        ).toBe(90);
        expect(
            positioner
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

        const rendered: any = mount(
            <div
                style={{
                    height: "100px",
                    width: "100px",
                }}
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
                    viewport={document.firstElementChild as HTMLElement}
                    managedClasses={managedClasses}
                />
            </div>
        );

        const positioner: any = rendered.find("BaseViewportPositioner");

        positioner.instance().viewportRect = viewportRect;
        positioner.instance().positionerRect = positionerRectX70Y70;
        positioner.instance().anchorTop = 180;
        positioner.instance().anchorRight = 240;
        positioner.instance().anchorBottom = 190;
        positioner.instance().anchorLeft = 230;
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

        const rendered: any = mount(
            <div
                style={{
                    height: "100px",
                    width: "100px",
                }}
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
                    viewport={document.firstElementChild as HTMLElement}
                    managedClasses={managedClasses}
                />
            </div>
        );

        const positioner: any = rendered.find("BaseViewportPositioner");

        positioner.instance().viewportRect = viewportRect;
        positioner.instance().positionerRect = positionerRectX20Y20;
        positioner.instance().anchorTop = 110;
        positioner.instance().anchorRight = 170;
        positioner.instance().anchorBottom = 120;
        positioner.instance().anchorLeft = 160;
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

        const rendered: any = mount(
            <div
                style={{
                    height: "100px",
                    width: "100px",
                }}
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
                    viewport={document.firstElementChild as HTMLElement}
                    managedClasses={managedClasses}
                    horizontalAlwaysInView={true}
                    verticalAlwaysInView={true}
                />
            </div>
        );

        const positioner: any = rendered.find("BaseViewportPositioner");

        positioner.instance().viewportRect = viewportRect;
        positioner.instance().anchorTop = 210;
        positioner.instance().anchorRight = 270;
        positioner.instance().anchorBottom = 220;
        positioner.instance().anchorLeft = 260;
        positioner.instance().setState({ noObserverMode: false });
        expect(positioner.instance().state.noObserverMode).toBe(false);

        expect(
            positioner
                .instance()
                ["getHorizontalTranslate"](
                    ViewportPositionerHorizontalPositionLabel.insetLeft
                )
        ).toBe(-21);
        expect(
            positioner
                .instance()
                ["getHorizontalTranslate"](ViewportPositionerHorizontalPosition.left)
        ).toBe(-11);
        expect(
            positioner
                .instance()
                ["getVerticalTranslate"](ViewportPositionerVerticalPositionLabel.insetTop)
        ).toBe(-21);
        expect(
            positioner
                .instance()
                ["getVerticalTranslate"](ViewportPositionerVerticalPosition.top)
        ).toBe(-11);

        expect(
            positioner
                .instance()
                ["getHorizontalTranslate"](
                    ViewportPositionerHorizontalPositionLabel.insetRight
                )
        ).toBe(0);
        expect(
            positioner
                .instance()
                ["getHorizontalTranslate"](ViewportPositionerHorizontalPosition.right)
        ).toBe(0);
        expect(
            positioner
                .instance()
                ["getVerticalTranslate"](
                    ViewportPositionerVerticalPositionLabel.insetBottom
                )
        ).toBe(0);
        expect(
            positioner
                .instance()
                ["getVerticalTranslate"](ViewportPositionerVerticalPosition.bottom)
        ).toBe(0);
    });

    test("Translate transforms calculated correctly - bottom/right", (): void => {
        const anchorElement: React.RefObject<HTMLDivElement> = React.createRef<
            HTMLDivElement
        >();

        const rendered: any = mount(
            <div
                style={{
                    height: "100px",
                    width: "100px",
                }}
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
                    viewport={document.firstElementChild as HTMLElement}
                    managedClasses={managedClasses}
                    horizontalAlwaysInView={true}
                    verticalAlwaysInView={true}
                />
            </div>
        );

        const positioner: any = rendered.find("BaseViewportPositioner");

        positioner.instance().viewportRect = viewportRect;
        positioner.instance().anchorTop = 80;
        positioner.instance().anchorRight = 140;
        positioner.instance().anchorBottom = 90;
        positioner.instance().anchorLeft = 130;

        expect(
            positioner
                .instance()
                ["getHorizontalTranslate"](
                    ViewportPositionerHorizontalPositionLabel.insetRight
                )
        ).toBe(21);
        expect(
            positioner
                .instance()
                ["getHorizontalTranslate"](ViewportPositionerHorizontalPosition.right)
        ).toBe(11);
        expect(
            positioner
                .instance()
                ["getVerticalTranslate"](
                    ViewportPositionerVerticalPositionLabel.insetBottom
                )
        ).toBe(21);
        expect(
            positioner
                .instance()
                ["getVerticalTranslate"](ViewportPositionerVerticalPosition.bottom)
        ).toBe(11);

        expect(
            positioner
                .instance()
                ["getHorizontalTranslate"](
                    ViewportPositionerHorizontalPositionLabel.insetLeft
                )
        ).toBe(0);
        expect(
            positioner
                .instance()
                ["getHorizontalTranslate"](ViewportPositionerHorizontalPosition.left)
        ).toBe(0);
        expect(
            positioner
                .instance()
                ["getVerticalTranslate"](ViewportPositionerVerticalPositionLabel.insetTop)
        ).toBe(0);
        expect(
            positioner
                .instance()
                ["getVerticalTranslate"](ViewportPositionerVerticalPosition.top)
        ).toBe(0);
    });

    test("Positioner moves to biggest area on updateLayout() when spacing changes", (): void => {
        const anchorElement: React.RefObject<HTMLDivElement> = React.createRef<
            HTMLDivElement
        >();

        const rendered: any = mount(
            <div
                style={{
                    height: "100px",
                    width: "100px",
                }}
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
                    viewport={document.firstElementChild as HTMLElement}
                    managedClasses={managedClasses}
                />
            </div>
        );

        const positioner: any = rendered.find("BaseViewportPositioner");

        positioner.instance().viewportRect = viewportRect;
        positioner.instance().positionerRect = positionerRectX70Y70;
        positioner.instance().anchorTop = 180;
        positioner.instance().anchorRight = 240;
        positioner.instance().anchorBottom = 190;
        positioner.instance().anchorLeft = 230;
        positioner.instance().anchorWidth = 10;
        positioner.instance().anchorHeight = 10;
        positioner.instance().scrollTop = 0;
        positioner.instance().scrollLeft = 0;
        positioner.instance().setState({ noObserverMode: false });

        positioner.instance()["updateLayout"]();

        expect(positioner.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPosition.left
        );
        expect(positioner.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPosition.top
        );

        positioner.instance().anchorTop = 110;
        positioner.instance().anchorRight = 170;
        positioner.instance().anchorBottom = 120;
        positioner.instance().anchorLeft = 160;

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
        const rendered: any = mount(
            <div
                style={{
                    height: "100px",
                    width: "100px",
                }}
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
                    viewport={document.firstElementChild as HTMLElement}
                    managedClasses={managedClasses}
                />
            </div>
        );

        const positioner: any = rendered.find("BaseViewportPositioner");

        positioner.instance().viewportRect = viewportRect;
        positioner.instance().positionerRect = positionerRectX70Y70;
        positioner.instance().anchorTop = 180;
        positioner.instance().anchorRight = 240;
        positioner.instance().anchorBottom = 190;
        positioner.instance().anchorLeft = 230;
        positioner.instance().anchorWidth = 10;
        positioner.instance().anchorHeight = 10;
        positioner.instance().scrollTop = 0;
        positioner.instance().scrollLeft = 0;
        positioner.instance().setState({ noObserverMode: false });

        positioner.instance()["updateLayout"]();

        expect(positioner.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPosition.left
        );
        expect(positioner.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPosition.top
        );

        positioner.instance().anchorTop = 120;
        positioner.instance().anchorRight = 180;
        positioner.instance().anchorBottom = 130;
        positioner.instance().anchorLeft = 170;

        positioner.instance()["updateLayout"]();

        expect(positioner.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPosition.left
        );
        expect(positioner.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPosition.top
        );

        positioner.instance().anchorTop = 110;
        positioner.instance().anchorRight = 170;
        positioner.instance().anchorBottom = 120;
        positioner.instance().anchorLeft = 160;

        positioner.instance()["updateLayout"]();

        expect(positioner.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPosition.right
        );
        expect(positioner.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPosition.bottom
        );
    });

    test("Positioner stays fixed on default position when LocktoDefault set in props", (): void => {
        const anchorElement: React.RefObject<HTMLDivElement> = React.createRef<
            HTMLDivElement
        >();

        const rendered: any = mount(
            <div
                style={{
                    height: "100px",
                    width: "100px",
                }}
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
            ViewportPositionerHorizontalPosition.left
        );
        expect(positioner.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPosition.top
        );
    });

    test("Positioner base position offset from anchor is accounted for", (): void => {
        const anchorElement: React.RefObject<HTMLDivElement> = React.createRef<
            HTMLDivElement
        >();

        const rendered: any = mount(
            <div
                style={{
                    height: "100px",
                    width: "100px",
                }}
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
                    viewport={document.firstElementChild as HTMLElement}
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
        positioner.instance().baseHorizontalOffset = 10;
        positioner.instance().baseVerticalOffset = 10;

        const positionerDimension: Dimension = {
            width: 10,
            height: 10,
        };

        expect(
            positioner
                .instance()
                ["getHorizontalPositioningState"](
                    ViewportPositionerHorizontalPositionLabel.right,
                    positionerDimension
                )["left"]
        ).toBe(20);

        expect(
            positioner
                .instance()
                ["getHorizontalPositioningState"](
                    ViewportPositionerHorizontalPositionLabel.left,
                    positionerDimension
                )["right"]
        ).toBe(0);

        expect(
            positioner
                .instance()
                ["getHorizontalPositioningState"](
                    ViewportPositionerHorizontalPositionLabel.insetRight,
                    positionerDimension
                )["left"]
        ).toBe(10);

        expect(
            positioner
                .instance()
                ["getHorizontalPositioningState"](
                    ViewportPositionerHorizontalPositionLabel.insetLeft,
                    positionerDimension
                )["right"]
        ).toBe(-10);

        expect(
            positioner
                .instance()
                ["getVerticalPositioningState"](
                    ViewportPositionerVerticalPositionLabel.top,
                    positionerDimension
                )["bottom"]
        ).toBe(10);

        expect(
            positioner
                .instance()
                ["getVerticalPositioningState"](
                    ViewportPositionerVerticalPositionLabel.bottom,
                    positionerDimension
                )["top"]
        ).toBe(10);

        expect(
            positioner
                .instance()
                ["getVerticalPositioningState"](
                    ViewportPositionerVerticalPositionLabel.insetTop,
                    positionerDimension
                )["bottom"]
        ).toBe(0);

        expect(
            positioner
                .instance()
                ["getVerticalPositioningState"](
                    ViewportPositionerVerticalPositionLabel.insetBottom,
                    positionerDimension
                )["top"]
        ).toBe(0);
    });

    test("Positioner base position offset correctly calculated", (): void => {
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
                    viewport={document.firstElementChild as HTMLElement}
                    managedClasses={managedClasses}
                />
            </div>
        );

        const positioner: any = rendered.find("BaseViewportPositioner");

        positioner.instance().viewportRect = viewportRect;
        positioner.instance().positionerRect = positionerRectX70Y70;
        positioner.instance().anchorTop = 60;
        positioner.instance().anchorRight = 70;
        positioner.instance().anchorBottom = 70;
        positioner.instance().anchorLeft = 60;
        positioner.instance().anchorWidth = 10;
        positioner.instance().anchorHeight = 10;
        positioner.instance().scrollTop = 0;
        positioner.instance().scrollLeft = 0;

        // test bottom right
        positioner.instance().baseHorizontalOffset = 0;
        positioner.instance().baseVerticalOffset = 0;
        positioner.instance().setState({
            currentHorizontalPosition: ViewportPositionerHorizontalPositionLabel.right,
            currentVerticalPosition: ViewportPositionerVerticalPositionLabel.bottom,
        });
        expect(positioner.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPositionLabel.right
        );
        expect(positioner.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPositionLabel.bottom
        );
        positioner.instance()["updatePositionerOffset"]();
        expect(positioner.instance().baseHorizontalOffset).toBe(0);
        expect(positioner.instance().baseVerticalOffset).toBe(0);

        // test inset bottom right
        positioner.instance().baseHorizontalOffset = 0;
        positioner.instance().baseVerticalOffset = 0;
        positioner.instance().setState({
            currentHorizontalPosition:
                ViewportPositionerHorizontalPositionLabel.insetRight,
            currentVerticalPosition: ViewportPositionerVerticalPositionLabel.insetBottom,
        });
        expect(positioner.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPositionLabel.insetRight
        );
        expect(positioner.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPositionLabel.insetBottom
        );
        positioner.instance()["updatePositionerOffset"]();
        expect(positioner.instance().baseHorizontalOffset).toBe(-10);
        expect(positioner.instance().baseVerticalOffset).toBe(-10);

        // test top left
        positioner.instance().baseHorizontalOffset = 0;
        positioner.instance().baseVerticalOffset = 0;
        positioner.instance().setState({
            currentHorizontalPosition: ViewportPositionerHorizontalPositionLabel.left,
            currentVerticalPosition: ViewportPositionerVerticalPositionLabel.top,
        });
        expect(positioner.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPositionLabel.left
        );
        expect(positioner.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPositionLabel.top
        );
        positioner.instance()["updatePositionerOffset"]();
        expect(positioner.instance().baseHorizontalOffset).toBe(-20);
        expect(positioner.instance().baseVerticalOffset).toBe(-20);

        // test inset top left
        positioner.instance().baseHorizontalOffset = 0;
        positioner.instance().baseVerticalOffset = 0;
        positioner.instance().setState({
            currentHorizontalPosition:
                ViewportPositionerHorizontalPositionLabel.insetLeft,
            currentVerticalPosition: ViewportPositionerVerticalPositionLabel.insetTop,
        });
        expect(positioner.instance().state.currentHorizontalPosition).toBe(
            ViewportPositionerHorizontalPositionLabel.insetLeft
        );
        expect(positioner.instance().state.currentVerticalPosition).toBe(
            ViewportPositionerVerticalPositionLabel.insetTop
        );
        positioner.instance()["updatePositionerOffset"]();
        expect(positioner.instance().baseHorizontalOffset).toBe(-10);
        expect(positioner.instance().baseVerticalOffset).toBe(-10);
    });

    test("Should scale positioner dimenstions to match the viewports height when scaleTofit is set to true", (): void => {
        const anchorElement: React.RefObject<HTMLDivElement> = React.createRef<
            HTMLDivElement
        >();

        const rendered: any = mount(
            <div
                style={{
                    height: "100px",
                    width: "100px",
                }}
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
                    viewport={document.firstElementChild as HTMLElement}
                    managedClasses={managedClasses}
                    scaleToFit={true}
                />
            </div>
        );

        const positioner: any = rendered.find("BaseViewportPositioner");

        positioner.instance().viewportRect = viewportRect;
        positioner.instance().anchorTop = 100;
        positioner.instance().anchorRight = 160;
        positioner.instance().anchorBottom = 110;
        positioner.instance().anchorLeft = 150;
        positioner.instance().anchorWidth = 10;
        positioner.instance().anchorHeight = 10;

        let positionerDimension: Dimension;

        positionerDimension = positioner
            .instance()
            ["getNextPositionerDimension"](
                ViewportPositionerHorizontalPositionLabel.insetRight,
                ViewportPositionerVerticalPositionLabel.insetBottom
            );
        expect(positionerDimension.width).toBe(100);
        expect(positionerDimension.height).toBe(100);

        positionerDimension = positioner
            .instance()
            ["getNextPositionerDimension"](
                ViewportPositionerHorizontalPositionLabel.right,
                ViewportPositionerVerticalPositionLabel.bottom
            );
        expect(positionerDimension.width).toBe(90);
        expect(positionerDimension.height).toBe(90);

        positionerDimension = positioner
            .instance()
            ["getNextPositionerDimension"](
                ViewportPositionerHorizontalPositionLabel.insetLeft,
                ViewportPositionerVerticalPositionLabel.insetTop
            );
        expect(positionerDimension.width).toBe(10);
        expect(positionerDimension.height).toBe(10);

        positionerDimension = positioner
            .instance()
            ["getNextPositionerDimension"](
                ViewportPositionerHorizontalPositionLabel.left,
                ViewportPositionerVerticalPositionLabel.top
            );
        expect(positionerDimension.width).toBe(0);
        expect(positionerDimension.height).toBe(0);
    });

    test("Positioner scaled sizes limited to viewport width", (): void => {
        const anchorElement: React.RefObject<HTMLDivElement> = React.createRef<
            HTMLDivElement
        >();

        const rendered: any = mount(
            <div
                style={{
                    height: "100px",
                    width: "100px",
                }}
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
                    viewport={document.firstElementChild as HTMLElement}
                    managedClasses={managedClasses}
                    scaleToFit={true}
                />
            </div>
        );

        let positionerDimension: Dimension;
        const positioner: any = rendered.find("BaseViewportPositioner");

        positioner.instance().viewportRect = viewportRect;
        positioner.instance().anchorTop = 0;
        positioner.instance().anchorRight = 60;
        positioner.instance().anchorBottom = 10;
        positioner.instance().anchorLeft = 50;
        positioner.instance().anchorWidth = 10;
        positioner.instance().anchorHeight = 10;

        positionerDimension = positioner
            .instance()
            ["getNextPositionerDimension"](
                ViewportPositionerHorizontalPositionLabel.insetRight,
                ViewportPositionerVerticalPositionLabel.insetBottom
            );
        expect(positionerDimension.width).toBe(100);
        expect(positionerDimension.height).toBe(100);

        positionerDimension = positioner
            .instance()
            ["getNextPositionerDimension"](
                ViewportPositionerHorizontalPositionLabel.right,
                ViewportPositionerVerticalPositionLabel.bottom
            );
        expect(positionerDimension.width).toBe(100);
        expect(positionerDimension.height).toBe(100);

        positioner.instance().anchorTop = 300;
        positioner.instance().anchorRight = 360;
        positioner.instance().anchorBottom = 310;
        positioner.instance().anchorLeft = 3350;

        positionerDimension = positioner
            .instance()
            ["getNextPositionerDimension"](
                ViewportPositionerHorizontalPositionLabel.insetLeft,
                ViewportPositionerVerticalPositionLabel.insetTop
            );
        expect(positionerDimension.width).toBe(100);
        expect(positionerDimension.height).toBe(100);

        positionerDimension = positioner
            .instance()
            ["getNextPositionerDimension"](
                ViewportPositionerHorizontalPositionLabel.left,
                ViewportPositionerVerticalPositionLabel.top
            );
        expect(positionerDimension.width).toBe(100);
        expect(positionerDimension.height).toBe(100);
    });

    test("Positioner scaled sizes can't be smaller than threshold values", (): void => {
        const anchorElement: React.RefObject<HTMLDivElement> = React.createRef<
            HTMLDivElement
        >();

        const rendered: any = mount(
            <div
                style={{
                    height: "100px",
                    width: "100px",
                }}
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
                    horizontalThreshold={110}
                    verticalThreshold={110}
                    anchor={anchorElement}
                    viewport={document.firstElementChild as HTMLElement}
                    managedClasses={managedClasses}
                    scaleToFit={true}
                />
            </div>
        );

        let positionerDimension: Dimension;
        const positioner: any = rendered.find("BaseViewportPositioner");

        positioner.instance().viewportRect = viewportRect;
        positioner.instance().anchorTop = 0;
        positioner.instance().anchorRight = 60;
        positioner.instance().anchorBottom = 10;
        positioner.instance().anchorLeft = 50;
        positioner.instance().anchorWidth = 10;
        positioner.instance().anchorHeight = 10;

        positionerDimension = positioner
            .instance()
            ["getNextPositionerDimension"](
                ViewportPositionerHorizontalPositionLabel.insetRight,
                ViewportPositionerVerticalPositionLabel.insetBottom
            );
        expect(positionerDimension.width).toBe(110);
        expect(positionerDimension.height).toBe(110);

        positionerDimension = positioner
            .instance()
            ["getNextPositionerDimension"](
                ViewportPositionerHorizontalPositionLabel.right,
                ViewportPositionerVerticalPositionLabel.bottom
            );
        expect(positionerDimension.width).toBe(110);
        expect(positionerDimension.height).toBe(110);

        positioner.instance().anchorTop = 300;
        positioner.instance().anchorRight = 360;
        positioner.instance().anchorBottom = 310;
        positioner.instance().anchorLeft = 3350;

        positionerDimension = positioner
            .instance()
            ["getNextPositionerDimension"](
                ViewportPositionerHorizontalPositionLabel.insetLeft,
                ViewportPositionerVerticalPositionLabel.insetTop
            );
        expect(positionerDimension.width).toBe(110);
        expect(positionerDimension.height).toBe(110);

        positionerDimension = positioner
            .instance()
            ["getNextPositionerDimension"](
                ViewportPositionerHorizontalPositionLabel.left,
                ViewportPositionerVerticalPositionLabel.top
            );
        expect(positionerDimension.width).toBe(110);
        expect(positionerDimension.height).toBe(110);
    });
});

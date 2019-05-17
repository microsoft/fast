import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import ViewportPositioner, {
    ViewportPositionerClassNameContract,
    ViewportPositionerHandledProps,
    ViewportPositionerProps,
    ViewportPositionerUnhandledProps,
} from "./viewport-positioner";
import { DisplayNamePrefix } from "../utilities";
import {
    AxisPositioningMode,
    HorizontalPosition,
    VerticalPosition,
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
    viewportPositioner__centerLeft: "viewportPositioner__centerLeft",
    viewportPositioner__right: "viewportPositioner__right",
    viewportPositioner__centerRight: "viewportPositioner__centerRight",
    viewportPositioner__top: "viewportPositioner__top",
    viewportPositioner__middleTop: "viewportPositioner__middleTop",
    viewportPositioner__bottom: "viewportPositioner__bottom",
    viewportPositioner__middleBottom: "viewportPositioner__middleBottom",
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
                    defaultHorizontalPosition={HorizontalPosition.left}
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
                    horizontalPositioningMode={AxisPositioningMode.flipOutward}
                    defaultHorizontalPosition={HorizontalPosition.left}
                    verticalPositioningMode={AxisPositioningMode.flipOutward}
                    defaultVerticalPosition={VerticalPosition.top}
                    anchor={anchorElement}
                    managedClasses={managedClasses}
                />
            </div>
        );

        const positioner: any = rendered.find("BaseViewportPositioner");
        expect(positioner.instance().state.currentHorizontalPosition).toBe(
            HorizontalPosition.left
        );
        expect(positioner.instance().state.right).not.toBe(null);
        expect(positioner.instance().state.left).toBe(null);
        expect(positioner.instance().state.xTransformOrigin).toBe("right");
        expect(positioner.instance().rootElement.current.className).toContain(
            managedClasses.viewportPositioner__left
        );

        expect(positioner.instance().state.currentVerticalPosition).toBe(
            VerticalPosition.top
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
                    horizontalPositioningMode={AxisPositioningMode.flipOutward}
                    defaultHorizontalPosition={HorizontalPosition.right}
                    verticalPositioningMode={AxisPositioningMode.flipOutward}
                    defaultVerticalPosition={VerticalPosition.bottom}
                    anchor={anchorElement}
                    managedClasses={managedClasses}
                />
            </div>
        );

        const positioner: any = rendered.find("BaseViewportPositioner");
        expect(positioner.instance().state.currentHorizontalPosition).toBe(
            HorizontalPosition.right
        );
        expect(positioner.instance().state.right).toBe(null);
        expect(positioner.instance().state.left).not.toBe(null);
        expect(positioner.instance().state.xTransformOrigin).toBe("left");
        expect(positioner.instance().rootElement.current.className).toContain(
            managedClasses.viewportPositioner__right
        );

        expect(positioner.instance().state.currentVerticalPosition).toBe(
            VerticalPosition.bottom
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
                    horizontalPositioningMode={AxisPositioningMode.flipInward}
                    defaultHorizontalPosition={HorizontalPosition.centerLeft}
                    verticalPositioningMode={AxisPositioningMode.flipInward}
                    defaultVerticalPosition={VerticalPosition.middleTop}
                    anchor={anchorElement}
                    managedClasses={managedClasses}
                />
            </div>
        );

        const positioner: any = rendered.find("BaseViewportPositioner");
        expect(positioner.instance().state.currentHorizontalPosition).toBe(
            HorizontalPosition.centerLeft
        );
        expect(positioner.instance().state.right).not.toBe(null);
        expect(positioner.instance().state.left).toBe(null);
        expect(positioner.instance().state.xTransformOrigin).toBe("right");
        expect(positioner.instance().rootElement.current.className).toContain(
            managedClasses.viewportPositioner__centerLeft
        );

        expect(positioner.instance().state.currentVerticalPosition).toBe(
            VerticalPosition.middleTop
        );
        expect(positioner.instance().state.bottom).not.toBe(null);
        expect(positioner.instance().state.top).toBe(null);
        expect(positioner.instance().state.yTransformOrigin).toBe("bottom");
        expect(positioner.instance().rootElement.current.className).toContain(
            managedClasses.viewportPositioner__middleTop
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
                    horizontalPositioningMode={AxisPositioningMode.flipInward}
                    defaultHorizontalPosition={HorizontalPosition.centerRight}
                    verticalPositioningMode={AxisPositioningMode.flipInward}
                    defaultVerticalPosition={VerticalPosition.middleBottom}
                    anchor={anchorElement}
                    managedClasses={managedClasses}
                />
            </div>
        );

        const positioner: any = rendered.find("BaseViewportPositioner");
        expect(positioner.instance().state.currentHorizontalPosition).toBe(
            HorizontalPosition.centerRight
        );
        expect(positioner.instance().state.right).toBe(null);
        expect(positioner.instance().state.left).not.toBe(null);
        expect(positioner.instance().state.xTransformOrigin).toBe("left");
        expect(positioner.instance().rootElement.current.className).toContain(
            managedClasses.viewportPositioner__centerRight
        );

        expect(positioner.instance().state.currentVerticalPosition).toBe(
            VerticalPosition.middleBottom
        );
        expect(positioner.instance().state.bottom).toBe(null);
        expect(positioner.instance().state.top).not.toBe(null);
        expect(positioner.instance().state.yTransformOrigin).toBe("top");
        expect(positioner.instance().rootElement.current.className).toContain(
            managedClasses.viewportPositioner__middleBottom
        );
    });

    test("Option sizes calculated correctly - flipOutward", (): void => {
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
                    horizontalPositioningMode={AxisPositioningMode.flipOutward}
                    verticalPositioningMode={AxisPositioningMode.flipOutward}
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

        expect(positioner.instance()["getOptionWidth"](HorizontalPosition.left)).toBe(80);
        expect(positioner.instance()["getOptionWidth"](HorizontalPosition.right)).toBe(
            10
        );
        expect(positioner.instance()["getOptionHeight"](VerticalPosition.top)).toBe(80);
        expect(positioner.instance()["getOptionHeight"](VerticalPosition.bottom)).toBe(
            10
        );
    });

    test("Option sizes calculated correctly - flipInward", (): void => {
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
                    horizontalPositioningMode={AxisPositioningMode.flipInward}
                    verticalPositioningMode={AxisPositioningMode.flipInward}
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
            positioner.instance()["getOptionWidth"](HorizontalPosition.centerLeft)
        ).toBe(90);
        expect(
            positioner.instance()["getOptionWidth"](HorizontalPosition.centerRight)
        ).toBe(20);
        expect(positioner.instance()["getOptionHeight"](VerticalPosition.middleTop)).toBe(
            90
        );
        expect(
            positioner.instance()["getOptionHeight"](VerticalPosition.middleBottom)
        ).toBe(20);
    });

    test("Correct options returned for a specified positioning mode - flipInwards", (): void => {
        const rendered: any = mount(
            <ViewportPositioner
                horizontalPositioningMode={AxisPositioningMode.flipInward}
                verticalPositioningMode={AxisPositioningMode.flipInward}
            />
        );

        const positioner: any = rendered.find("BaseViewportPositioner");

        const horizontalPositions: HorizontalPosition[] = positioner
            .instance()
            ["getHorizontalPositioningOptions"]();
        const verticalPositions: VerticalPosition[] = positioner
            .instance()
            ["getVerticalPositioningOptions"]();

        expect(horizontalPositions.length).toBe(2);
        expect(horizontalPositions.indexOf(HorizontalPosition.centerLeft)).not.toBe(-1);
        expect(horizontalPositions.indexOf(HorizontalPosition.centerRight)).not.toBe(-1);
        expect(verticalPositions.length).toBe(2);
        expect(verticalPositions.indexOf(VerticalPosition.middleTop)).not.toBe(-1);
        expect(verticalPositions.indexOf(VerticalPosition.middleBottom)).not.toBe(-1);
    });

    test("Correct options returned for a specified positioning mode - flipOutwards", (): void => {
        const rendered: any = mount(
            <ViewportPositioner
                horizontalPositioningMode={AxisPositioningMode.flipOutward}
                verticalPositioningMode={AxisPositioningMode.flipOutward}
            />
        );

        const positioner: any = rendered.find("BaseViewportPositioner");

        const horizontalPositions: HorizontalPosition[] = positioner
            .instance()
            ["getHorizontalPositioningOptions"]();
        const verticalPositions: VerticalPosition[] = positioner
            .instance()
            ["getVerticalPositioningOptions"]();

        expect(horizontalPositions.length).toBe(2);
        expect(horizontalPositions.indexOf(HorizontalPosition.left)).not.toBe(-1);
        expect(horizontalPositions.indexOf(HorizontalPosition.right)).not.toBe(-1);
        expect(verticalPositions.length).toBe(2);
        expect(verticalPositions.indexOf(VerticalPosition.top)).not.toBe(-1);
        expect(verticalPositions.indexOf(VerticalPosition.bottom)).not.toBe(-1);
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
                    horizontalPositioningMode={AxisPositioningMode.flipOutward}
                    verticalPositioningMode={AxisPositioningMode.flipOutward}
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
            HorizontalPosition.left
        );
        expect(positioner.instance().state.currentVerticalPosition).toBe(
            VerticalPosition.top
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
                    horizontalPositioningMode={AxisPositioningMode.flipOutward}
                    verticalPositioningMode={AxisPositioningMode.flipOutward}
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
            HorizontalPosition.right
        );
        expect(positioner.instance().state.currentVerticalPosition).toBe(
            VerticalPosition.bottom
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
                    horizontalPositioningMode={AxisPositioningMode.flipInward}
                    verticalPositioningMode={AxisPositioningMode.flipInward}
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
                ["calculateHorizontalTranslate"](HorizontalPosition.centerLeft)
        ).toBe(-111);
        expect(
            positioner.instance()["calculateHorizontalTranslate"](HorizontalPosition.left)
        ).toBe(-101);
        expect(
            positioner
                .instance()
                ["calculateVerticalTranslate"](VerticalPosition.middleTop)
        ).toBe(-111);
        expect(
            positioner.instance()["calculateVerticalTranslate"](VerticalPosition.top)
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
                    horizontalPositioningMode={AxisPositioningMode.flipInward}
                    verticalPositioningMode={AxisPositioningMode.flipInward}
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
                ["calculateHorizontalTranslate"](HorizontalPosition.centerRight)
        ).toBe(211);
        expect(
            positioner
                .instance()
                ["calculateHorizontalTranslate"](HorizontalPosition.right)
        ).toBe(201);
        expect(
            positioner
                .instance()
                ["calculateVerticalTranslate"](VerticalPosition.middleBottom)
        ).toBe(211);
        expect(
            positioner.instance()["calculateVerticalTranslate"](VerticalPosition.bottom)
        ).toBe(201);
    });

    test("Positioner moves on updateLayout() when spacing changes", (): void => {
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
                    horizontalPositioningMode={AxisPositioningMode.flipOutward}
                    verticalPositioningMode={AxisPositioningMode.flipOutward}
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
            HorizontalPosition.left
        );
        expect(positioner.instance().state.currentVerticalPosition).toBe(
            VerticalPosition.top
        );

        positioner.instance().anchorTop = 10;
        positioner.instance().anchorRight = 20;
        positioner.instance().anchorBottom = 20;
        positioner.instance().anchorLeft = 10;

        positioner.instance()["updateLayout"]();

        expect(positioner.instance().state.currentHorizontalPosition).toBe(
            HorizontalPosition.right
        );
        expect(positioner.instance().state.currentVerticalPosition).toBe(
            VerticalPosition.bottom
        );
    });
});

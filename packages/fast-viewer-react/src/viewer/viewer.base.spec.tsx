import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import { ViewerHandledProps } from "./";
import ViewerBase from "./viewer.base";
import { ResizeHandleLocation } from "./viewer.props";
import { ViewerClassNameContract } from "./viewer.class-name-contract";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("Viewer", (): void => {
    const managedClasses: ViewerClassNameContract = {
        viewer: "viewer",
    };

    test("should create an iframe", () => {
        const props: ViewerHandledProps = {
            iframeSrc: "/test",
        };
        const rendered: any = mount(
            <ViewerBase managedClasses={managedClasses} {...props} />
        );

        expect(rendered.find("iframe").length).toBe(1);
    });
    test("should use the `iframeSrc` prop as the iframe src attribute", () => {
        const iframeSrc: string = "/test";
        const props: ViewerHandledProps = {
            iframeSrc,
        };
        const rendered: any = mount(
            <ViewerBase managedClasses={managedClasses} {...props} />
        );

        expect(rendered.find("iframe").prop("src")).toBe(iframeSrc);
    });
    test("should set the width if the `width` prop is set", () => {
        const props: ViewerHandledProps = {
            iframeSrc: "/test",
            width: 800,
        };
        const rendered: any = mount(
            <ViewerBase managedClasses={managedClasses} {...props} />
        );

        expect(
            rendered
                .find("div")
                .last()
                .prop("style")
        ).toEqual({ width: "800px" });
    });
    test("should set the height if the `height` prop is set", () => {
        const props: ViewerHandledProps = {
            iframeSrc: "/test",
            height: 600,
        };
        const rendered: any = mount(
            <ViewerBase managedClasses={managedClasses} {...props} />
        );

        expect(
            rendered
                .find("div")
                .last()
                .prop("style")
        ).toEqual({ height: "600px" });
    });
    test("should create a series of responsive buttons if the `responsive` prop is true", () => {
        const propsWithResponsive: ViewerHandledProps = {
            iframeSrc: "/test",
            responsive: true,
        };
        const renderedWithResponsive: any = mount(
            <ViewerBase managedClasses={managedClasses} {...propsWithResponsive} />
        );
        const propsWithoutResponsive: ViewerHandledProps = {
            iframeSrc: "/test",
        };
        const renderedWithoutResponsive: any = mount(
            <ViewerBase managedClasses={managedClasses} {...propsWithoutResponsive} />
        );

        expect(renderedWithResponsive.find("button").length).toBe(5);
        expect(renderedWithoutResponsive.find("button").length).toBe(0);
    });
    test("should fire the `onUpdateHeight` callback if the responsive buttons are dragged", () => {
        jest.spyOn(window, "requestAnimationFrame").mockImplementation(
            (callback: any): any => {
                callback();
            }
        );
        const updateHeightCallback: (height: number) => void = jest.fn(function(
            height: number
        ): void {
            expect(height).toEqual(400);
        });
        const props: ViewerHandledProps = {
            iframeSrc: "/test",
            height: 500,
            responsive: true,
            onUpdateHeight: updateHeightCallback,
        };
        const rendered: any = mount(
            <ViewerBase managedClasses={managedClasses} {...props} />
        );
        const mouseDownEvent: any = {
            button: 0,
            pageX: 300,
            pageY: 300,
        };
        const mouseMoveEvent: any = {
            button: 0,
            pageX: 200,
            pageY: 200,
        };
        rendered.instance().handleMouseDown(ResizeHandleLocation.bottom)(mouseDownEvent);
        rendered.instance().handleMouseMove(mouseMoveEvent);
        expect(updateHeightCallback).toHaveBeenCalled();
    });
    test("should fire the `onUpdateWidth` callback if the responsive buttons are dragged", () => {
        jest.spyOn(window, "requestAnimationFrame").mockImplementation(
            (callback: any): any => {
                callback();
            }
        );
        const updateWidthCallback: (width: number) => void = jest.fn(function(
            width: number
        ): void {
            expect(width).toEqual(700);
        });
        const props: ViewerHandledProps = {
            iframeSrc: "/test",
            width: 500,
            responsive: true,
            onUpdateWidth: updateWidthCallback,
        };
        const rendered: any = mount(
            <ViewerBase managedClasses={managedClasses} {...props} />
        );
        const mouseDownEvent: any = {
            button: 0,
            pageX: 300,
            pageY: 300,
        };
        const mouseMoveEvent: any = {
            button: 0,
            pageX: 200,
            pageY: 200,
        };
        rendered.instance().handleMouseDown(ResizeHandleLocation.left)(mouseDownEvent);
        rendered.instance().handleMouseMove(mouseMoveEvent);
        expect(updateWidthCallback).toHaveBeenCalled();
    });
});

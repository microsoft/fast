import * as React from "react";
import { DesignSystemProvider } from "./design-system-provider";
import * as ShallowRenderer from "react-test-renderer/shallow";
import * as Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow, ShallowWrapper } from "enzyme";
import { Consumer } from "./context";

configure({adapter: new Adapter()});

describe("DesignSystemProvider", (): void => {
    test("should render children", (): void => {
        const text: string = "aRrAyS sTaRt At OnE";
        const children: React.ReactNode = <p>{text}</p>;
        const provider: ShallowWrapper = mount(
            <DesignSystemProvider
                designSystem={{}}
            >
                <p>{text}</p>
            </DesignSystemProvider>
        );

        expect(provider.find("p").text()).toBe(text);
    });

    test("should not throw when not provided props", (): void => {
        expect(() => {
            return shallow(React.createElement(DesignSystemProvider));
        }).not.toThrow();
    });

    test("should provide the design system to a consumer", (): void => {
        function render(value: {success: boolean}): string {
            return value.success.toString();
        }

        const tree: ShallowWrapper = mount(
            <DesignSystemProvider designSystem={{success: true}}>
                <Consumer>
                    {render}
                </Consumer>
            </DesignSystemProvider>
        );

        expect(tree.text()).toBe(true.toString());
    });

    test("should override nested context values", (): void => {
        function render(value: {success: string}): string {
            return value.success;
        }

        const tree: ShallowWrapper = mount(
            <DesignSystemProvider designSystem={{success: "unsuccessfull"}}>
                <DesignSystemProvider designSystem={{success: "successful"}}>
                    <Consumer>
                        {render}
                    </Consumer>
                </DesignSystemProvider>
            </DesignSystemProvider>
        );

        expect(tree.text()).toBe("successful");
    });

    test("should allow partial updates to context values", (): void => {
        const renderOne: any = jest.fn();
        const renderTwo: any = jest.fn();

        function render(value: { a: string, b: string }): string {
            return `${value.a}, ${value.b}`;
        }

        const tree: ShallowWrapper = mount(
            <DesignSystemProvider designSystem={{a: "a", b: "b"}}>
                <Consumer>
                    {renderOne}
                </Consumer>
                <DesignSystemProvider designSystem={{a: "A"}}>
                    <Consumer>
                        {renderTwo}
                    </Consumer>
                </DesignSystemProvider>
            </DesignSystemProvider>
        );

        expect(renderOne.mock.calls).toHaveLength(1);
        expect(renderOne.mock.calls[0][0]).toEqual({a: "a", b: "b"});
        expect(renderTwo.mock.calls).toHaveLength(1);
        expect(renderTwo.mock.calls[0][0]).toEqual({a: "A", b: "b"});
    });
});

import React, { ReactElement, ReactNode } from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount } from "enzyme";
import { extractHtmlElement } from "./extract-element";

/*
 * Configure Enzyme
 */

configure({ adapter: new Adapter() });

class TextComponentClass extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);
    }

    public render(): JSX.Element {
        return <React.Fragment>"test"</React.Fragment>;
    }
}

class TestClass extends React.Component<{}, {}> {
    private testRef: React.RefObject<HTMLElement> = React.createRef<HTMLElement>();

    constructor(props: {}) {
        super(props);
    }

    public render(): JSX.Element {
        const children: ReactNode[] = React.Children.toArray(this.props.children);
        if (children.length === 0) {
            return null;
        }

        return React.cloneElement(children[0] as ReactElement, { ref: this.testRef });
    }
}

describe("extract-element", (): void => {
    test("extractHtmlElement function returns element passed in directly", (): void => {
        const testElement: HTMLDivElement = document.createElement("div");
        expect(extractHtmlElement(testElement)).toBe(testElement);
    });

    test("extractHtmlElement function returns div element passed in as a ref", (): void => {
        const rendered: any = mount(
            <TestClass>
                <div />
            </TestClass>
        );
        const extracted: any = extractHtmlElement(rendered.instance().testRef);
        expect(extracted).not.toBe(null);
        expect(extracted).toEqual(rendered.instance().testRef.current);
    });

    test("extractHtmlElement function returns text element passed in as a ref", (): void => {
        const rendered: any = mount(
            <TestClass>
                <TextComponentClass />
            </TestClass>
        );
        const extracted: any = extractHtmlElement(rendered.instance().testRef);
        expect(extracted).not.toBe(null);
        expect(extracted).toBeInstanceOf(Text);
    });

    test("extractHtmlElement function returns null from uninitialized ref object", (): void => {
        const testRef: React.RefObject<HTMLDivElement> = React.createRef<
            HTMLDivElement
        >();

        expect(extractHtmlElement(testRef)).toBe(null);
    });
});

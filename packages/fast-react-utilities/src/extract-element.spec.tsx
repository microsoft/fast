import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import { extractHtmlElement } from "./extract-element";

/*
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

class TestClass extends React.Component<{}, {}> {
    private testRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();

    constructor(props: {}) {
        super(props);
    }

    public render(): JSX.Element {
        return <div ref={this.testRef} />;
    }
}

describe("extract-element", (): void => {
    test("extractHtmlElement function returns element passed in directly", (): void => {
        const testElement: HTMLDivElement = document.createElement("div");
        expect(extractHtmlElement(testElement)).toBe(testElement);
    });

    test("extractHtmlElement function returns element passed in as a ref", (): void => {
        const rendered: any = shallow(<TestClass />);

        const extracted: HTMLElement = extractHtmlElement(rendered.instance().testRef);
        expect(extracted).toEqual(rendered.instance().testRef.current);
    });

    test("extractHtmlElement function returns null from uninitialized ref object", (): void => {
        const testRef: React.RefObject<HTMLDivElement> = React.createRef<
            HTMLDivElement
        >();

        expect(extractHtmlElement(testRef)).toBe(null);
    });
});

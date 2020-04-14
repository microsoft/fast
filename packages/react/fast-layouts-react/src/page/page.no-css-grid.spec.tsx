import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import { Page } from "./page";

/**
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });
describe("Page - without CSS grid support", (): void => {
    test("should set an inline style of `display: -ms-grid` when CSS grid is NOT supported", () => {
        const rendered: any = shallow(<Page />);

        expect(rendered.props().style.display).toEqual("-ms-grid");
    });

    test("should set an inline style of `display: -ms-grid` when -ms-grid is specified and CSS grid is NOT supported", () => {
        const rendered: any = shallow(<Page cssGridPropertyName="-ms-grid" />);

        expect(rendered.props().style.display).toEqual("-ms-grid");
    });

    test("should set an inline style of `display: grid` when grid is specified and CSS grid is NOT supported", () => {
        const rendered: any = shallow(<Page cssGridPropertyName="grid" />);

        expect(rendered.props().style.display).toEqual("grid");
    });

    test("should set an inline style of `msGridColumns` when CSS grid is supported", () => {
        const expectedMargin: string = "0";
        const expectedMaxWidth: string = "1200px";
        const rendered: any = shallow(
            <Page margin={expectedMargin} maxWidth={expectedMaxWidth} />
        );
        function msGridColumnsFormatter(margin: string, maxWidth: string): string {
            return `${margin} minmax(0, ${maxWidth}) ${margin}`;
        }

        expect(rendered.props().style.msGridColumns).toEqual(
            msGridColumnsFormatter(expectedMargin, expectedMaxWidth)
        );
    });
});

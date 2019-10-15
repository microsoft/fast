import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, mount, shallow } from "enzyme";
import {
    Grid,
    GridAlignment,
    GridClassNamesContract,
    GridHandledProps,
    GridUnhandledProps,
} from "./grid";
import { GridTag } from "./grid.props";
import { Column, ColumnClassNamesContract } from "../column";
import { GridGutter } from ".";
import { uniqueId } from "lodash-es";

/**
 * Configure Enzyme
 */
configure({ adapter: new Adapter() });

describe("Grid - without CSS grid support", (): void => {
    const managedClasses: GridClassNamesContract = {
        grid: "grid",
    };

    test("should set an inline style of `display: -ms-grid` when CSS grid is NOT supported", () => {
        const rendered: any = shallow(<Grid />);

        expect(rendered.props().style.display).toEqual("-ms-grid");
    });

    test("should pass `gutter` props to children of type `column` when CSS grid is not supported and `column` does not have `gutter` prop", () => {
        const columnId: string = "foo";
        const gridGutter: number = 4;

        const rendered: any = shallow(
            <Grid gutter={gridGutter} managedClasses={managedClasses}>
                <Column id={columnId} />
            </Grid>
        );

        expect(rendered.find(`#${columnId}`).props().gutter).toBe(gridGutter);
    });

    test("should NOT pass `gutter` props to children of type `column` when CSS grid is not supported and `column` has `gutter` prop", () => {
        const columnId: string = "bar";
        const gridGutter: number = 4;
        const columnGutter: GridGutter = 6;

        const rendered: any = shallow(
            <Grid gutter={gridGutter} managedClasses={managedClasses}>
                <Column id={columnId} gutter={columnGutter} />
            </Grid>
        );

        expect(rendered.find(`#${columnId}`).props().gutter).toBe(columnGutter);
    });

    test("should NOT pass `gutter` props to children which are not of type `column` when CSS grid is not supported", () => {
        const gridGutter: number = 4;

        const rendered: any = shallow(
            <Grid gutter={gridGutter} managedClasses={managedClasses}>
                <div className={"not-column "} />
            </Grid>
        );

        expect(rendered.find(".not-column").props().gutter).not.toBe(gridGutter);
        expect(rendered.find(".not-column").props().gutter).toBe(undefined);
    });

    test("should set an inline style for `msGridColumn` with a value equal to the `gridColumn` prop when CSS grid is not supported", () => {
        const rendered: any = shallow(
            <Grid gridColumn={2} managedClasses={managedClasses} />
        );

        expect(rendered.props().style.gridColumn).toBe(undefined);
        expect(rendered.props().style.msGridColumn).toBe(2);
    });
});

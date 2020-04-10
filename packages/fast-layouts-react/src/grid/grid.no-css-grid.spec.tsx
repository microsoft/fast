import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import { Column } from "../column";
import { Grid, GridAlignment, GridClassNamesContract } from "./grid";
import { GridGutter } from ".";

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

describe("Grid - without CSS grid support but `cssGridPropertyName` prop is `grid`", (): void => {
    const managedClasses: GridClassNamesContract = {
        grid: "grid",
    };

    test("should set an inline style of `display: grid` when CSS grid is NOT supported but the `cssGridPropertyName` prop passed is `grid`", () => {
        const rendered: any = shallow(<Grid cssGridPropertyName={"grid"} />);

        expect(rendered.props().style.display).toEqual("grid");
    });

    test("should set an inline style for `gridColumn` with a value equal to the `gridColumn` prop when  CSS grid is NOT supported but the `cssGridPropertyName` prop passed is equal to `grid`", () => {
        const rendered: any = shallow(
            <Grid
                cssGridPropertyName={"grid"}
                gridColumn={2}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.props().style.gridColumn).toBe(2);
        expect(rendered.props().style.msGridColumn).toBe(undefined);
    });

    test("should set an inline style for `gridRow` with a value equal to the `gridColumn` prop when CSS grid is NOT supported but the `cssGridPropertyName` prop passed is equal to `grid`", () => {
        const rendered: any = shallow(
            <Grid cssGridPropertyName={"grid"} row={2} managedClasses={managedClasses} />
        );

        expect(rendered.props().style.gridRow).toBe(2);
        expect(rendered.props().style.msGridRow).toBe(undefined);
    });

    test("should set an inline style for alignItems with a value equal to the `verticalAlign` prop when CSS grid is NOT supported but the `cssGridPropertyName` prop passed is equal to `grid`", () => {
        const rendered: any = shallow(
            <Grid
                cssGridPropertyName={"grid"}
                verticalAlign={GridAlignment.center}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.props().style.alignItems).toBe(GridAlignment.center);
    });

    test("should set an inline style for justifyItems with a value equal to the `horizontalAlign` prop when CSS grid is NOT supported but the `cssGridPropertyName` prop passed is equal to `grid`", () => {
        const rendered: any = shallow(
            <Grid
                cssGridPropertyName={"grid"}
                horizontalAlign={GridAlignment.center}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.props().style.justifyItems).toBe(GridAlignment.center);
    });

    test("should set an inline style for gridTemplateColumns with a repeating column count equal to the `columnCount` prop when CSS grid is NOT supported but the `cssGridPropertyName` prop passed is equal to `grid`", () => {
        const rendered: any = shallow(
            <Grid
                cssGridPropertyName={"grid"}
                columnCount={5}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.props().style.gridTemplateColumns).toBe(`repeat(5, 1fr)`);
    });

    test("should set an inline style for gridColumnGap in pixels equal to the `gutter` prop when passed", () => {
        const rendered: any = shallow(
            <Grid
                cssGridPropertyName={"grid"}
                gutter={1}
                managedClasses={managedClasses}
            />
        );

        expect(rendered.props().style.gridColumnGap).toBe("1px");
    });
});

import React from "react";
import { generateSnapshots, SnapshotTestSuite } from "./index";

interface TestComponentProps {
    name: string;
}

class TestComponent extends React.Component<TestComponentProps, {}> {
    public render(): React.ReactNode {
        return <div>{this.props.name}</div>;
    }
}

const testSuite: SnapshotTestSuite<TestComponentProps> = {
    name: "TestComponent",
    component: TestComponent,
    data: [
        { name: "hello world" },
        [
            "should render with a snapshot title",
            {
                name: "hello pluto",
            },
        ],
    ],
};

/*
 * Test snapshot generation
 */
generateSnapshots(testSuite);

test("should not throw if no data is provided", (): void => {
    const adjustedTestSuite: any = Object.assign({}, testSuite);
    delete adjustedTestSuite.data;

    expect(
        (): void => {
            generateSnapshots(adjustedTestSuite);
        }
    ).not.toThrow();
});

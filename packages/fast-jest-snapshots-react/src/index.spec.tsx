import * as React from "react";
import { generateSnapshots,  ISnapshotTestSuite } from "./index";

interface ITestComponentProps {
    name: string;
}

class TestComponent extends React.Component<ITestComponentProps, {}> {
    public render(): React.ReactNode {
        return (
            <div>{this.props.name}</div>
        );
    }
}

const testSuite: ISnapshotTestSuite<ITestComponentProps> = {
    name: "TestComponent",
    component: TestComponent,
    data: [
        { name: "hello world" },
        [
            "should render with a snapshot title",
            {
                name: "hello pluto"
            }
        ]
    ]
};

/*
 * Test snapshot generation
 */
generateSnapshots(testSuite);

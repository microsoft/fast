import * as React from "react";
import { generateSnapshots,  SnapshotTestSuite } from "./index";

interface TestComponentProps {
    name: string;
}

class TestComponent extends React.Component<TestComponentProps, {}> {
    public render(): React.ReactNode {
        return (
            <div>{this.props.name}</div>
        );
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
                name: "hello pluto"
            }
        ]
    ]
};

/*
 * Test snapshot generation
 */
generateSnapshots(testSuite);

# FAST Jest snapshots React
`@microsoft/fast-jest-snapshots-react` is a small utility library for creating snapshot Jest tests for React components.
Given a single component, the `generateSnapshots` function will iterate over a set of prop data and create a snapshot test for each `prop` instance.

## Usage
To use, import the `ISnapshotTestSuite` interface and the `generateSnapshots` function from `@microsoft/fast-jest-snapshots-react`:

```ts
import {generateSnapshots, ISnapshotTestSuite} from "@microsoft/fast-jest-snapshots-react";
```

Then, create you test data snapshot suite, where every index of `data` is a valid prop object for your `component`:
```ts
// in a Jest test file
import {MyReactComponent, IMyReactComponentProps} from "my-react-component.tsx";
import {ISnapshotTestSuite, generateSnapshots} from "@microsoft/fast-jest-snapshots-react";

const testSuite: ISnapshotTestSuite<IMyReactComponentProps> = {
    name: 'test component',
    component: MyCustomReactComponentConstructor,
    data: [
        {
            id: "test-id",
            text: "hello world",
            // other component props
        }
    ]
};

// Generate snapshots using the prop and component data you defined
generateSnapshots(testSuite);
```

### Snapshot descriptions
Descriptions can also optionally be applied to any snapshot. This is useful for providing context to the test and what expectation of the snapshot is.
To do this, simply put the `prop` object into an array where the first index is the snapshot description and the second index is the `prop` object:

```ts
// in a Jest test file
import {MyReactComponent, IMyReactComponentProps} from "my-react-component.tsx";
import {ISnapshotTestSuite, generateSnapshots} from "@microsoft/fast-jest-snapshots-react";

const testSuite: ISnapshotTestSuite<IMyReactComponentProps> = {
    // ...
    data: [
        [
            "should render with an id attribute",
            {
                id: "test-id",
                text: "hello world",
                // other component props
            }

        ]
    ]
};
```

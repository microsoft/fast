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
    props: [
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

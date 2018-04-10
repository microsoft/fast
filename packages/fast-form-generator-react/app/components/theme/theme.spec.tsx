import * as React from "react";
import { generateSnapshots } from "@microsoft/fast-jest-snapshots-react";
import { ISnapshotTestSuite } from "@microsoft/fast-jest-snapshots-react";
import { getExample } from "@microsoft/fast-permutator";
import Form, { IFormProps } from "../../../src/form";
import config from "./theme.config";
import * as themeSchema from "./theme.schema.json";

const name: string = "theme";

const exampleData: IFormProps = {
    schema: themeSchema,
    data: getExample(themeSchema),
    onChange: (data: any): void => {},
    componentMappingToPropertyNames: config
}

const examples = {
    name,
    component: Form,
    data: [
        exampleData
    ]
};

describe(name, () => {
    generateSnapshots(examples);
});

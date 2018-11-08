import { ChildOptionItem } from "@microsoft/fast-data-utilities-react";
import Example from "./components/example";
import exampleSchema from "./components/example.schema.json";

const componentOptions: ChildOptionItem[] = [
    {
        schema: exampleSchema,
        component: Example,
    },
];

export default componentOptions;

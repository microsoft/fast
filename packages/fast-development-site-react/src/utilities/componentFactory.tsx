import * as React from "react";
import componentExampleFactory from "./componentExampleFactory";
import { SiteCategory } from "../";

export default function componentFactory<T>(examples: any, designSystem?: T): JSX.Element[] {
    return Object.keys(examples).map((exampleKey: string, index: number) => {
        return (
            <SiteCategory
                key={index}
                slot={"category"}
                name={examples[exampleKey].name}
                schema={examples[exampleKey].schema}
                component={examples[exampleKey].component}
            >
                {componentExampleFactory<T>(examples, exampleKey, designSystem)}
            </SiteCategory>
        );
    });
}

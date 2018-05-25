import * as React from "react";
import componentDetailExampleFactory from "./component-detail-example-factory";
import componentExampleFactory from "./component-example-factory";
import componentDocumentationFactory from "./component-documentation-factory";
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
                {componentDetailExampleFactory<T>(examples[exampleKey].detailData, designSystem)}
                {componentExampleFactory<T>(examples, exampleKey, designSystem)}
                {componentDocumentationFactory(examples[exampleKey].documentation)}
            </SiteCategory>
        );
    });
}

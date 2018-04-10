import * as React from "react";
import { SiteCategoryItem } from "../";

export default function componentExampleFactory(examples: any, componentExample: string): JSX.Element[] {
    const Component: any = examples[componentExample].component;

    return examples[componentExample].data.map((componentExampleData: any, index: number) => {
        return (
            <SiteCategoryItem key={index} slot={"canvas"}>
                <Component {...componentExampleData} />
            </SiteCategoryItem>
        );
    });
}

import * as React from "react";
import { SiteCategoryItem } from "../";
import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";

export default function componentExampleFactory<T>(examples: any, componentExample: string, designSystem?: T): JSX.Element[] {
    const Component: any = examples[componentExample].component;

    return examples[componentExample].data.map((componentExampleData: any, index: number) => {
        return (
            <SiteCategoryItem key={index} slot={"canvas"}>
                <DesignSystemProvider designSystem={designSystem ? designSystem : void 0}>
                    <Component {...componentExampleData} />
                </DesignSystemProvider>
            </SiteCategoryItem>
        );
    });
}

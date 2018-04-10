import * as React from "react";
import componentExampleFactory from "./componentExampleFactory";
import { SiteCategory } from "../";

export default function componentFactory(examples: any): JSX.Element[] {
    return Object.keys(examples).map((exampleKey: string, index: number) => {
        return (
            <SiteCategory key={index} slot={"category"} name={examples[exampleKey].name}>
                {componentExampleFactory(examples, exampleKey)}
            </SiteCategory>
        );
    });
}

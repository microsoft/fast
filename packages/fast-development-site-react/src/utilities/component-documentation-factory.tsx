import React from "react";
import { SiteCategoryDocumentation } from "../";

export default function componentExampleFactory(
    documentation?: JSX.Element
): JSX.Element {
    return (
        <SiteCategoryDocumentation slot={"canvas-detail-view-documentation"}>
            {documentation}
        </SiteCategoryDocumentation>
    );
}

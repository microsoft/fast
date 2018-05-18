import * as React from "react";
import { SiteCategoryItem } from "../";
import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";

export default function componentDetailExampleFactory<T>(example?: any, designSystem?: T): JSX.Element {
    if (example) {
        return (
            <SiteCategoryItem
                slot={"canvas-detail-view-example"}
                data={example}
                designSystem={designSystem ? designSystem : void 0}
            />
        );
    }
}

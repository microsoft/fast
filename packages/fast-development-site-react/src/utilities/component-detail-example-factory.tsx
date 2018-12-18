import React from "react";
import { ComponentViewSlot, SiteCategoryItem } from "../";
import { DesignSystemProvider } from "@microsoft/fast-jss-manager-react";

export default function componentDetailExampleFactory<T>(
    example?: any,
    designSystem?: T
): JSX.Element {
    if (example) {
        return (
            <SiteCategoryItem
                slot={ComponentViewSlot.detailExample}
                data={example}
                designSystem={designSystem ? designSystem : void 0}
            />
        );
    }
}

import { Badge, badgeSchema2, BadgeSize } from "@microsoft/fast-components-react-msft";
import Guidance from "../../.tmp/badge/guidance";
import textSchema from "../../msft-component-helpers/text.schema";
import { ComponentViewConfig } from "./data.props";

const badgeConfig: ComponentViewConfig = {
    schema: badgeSchema2,
    component: Badge,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Small",
            dataDictionary: [
                {
                    root: {
                        schemaId: badgeSchema2.id,
                        data: {
                            size: BadgeSize.small,
                            children: [
                                {
                                    id: "children0",
                                },
                            ],
                        },
                    },
                    children0: {
                        parent: {
                            id: "root",
                            dataLocation: "children",
                        },
                        schemaId: textSchema.id,
                        data: "Badge",
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Large",
            dataDictionary: [
                {
                    root: {
                        schemaId: badgeSchema2.id,
                        data: {
                            size: BadgeSize.large,
                            children: [
                                {
                                    id: "children0",
                                },
                            ],
                        },
                    },
                    children0: {
                        parent: {
                            id: "root",
                            dataLocation: "children",
                        },
                        schemaId: textSchema.id,
                        data: "Badge",
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Unfilled",
            dataDictionary: [
                {
                    root: {
                        schemaId: badgeSchema2.id,
                        data: {
                            filled: false,
                            children: [
                                {
                                    id: "children0",
                                },
                            ],
                        },
                    },
                    children0: {
                        parent: {
                            id: "root",
                            dataLocation: "children",
                        },
                        schemaId: textSchema.id,
                        data: "Badge",
                    },
                },
                "root",
            ],
        },
    ],
};

export default badgeConfig;

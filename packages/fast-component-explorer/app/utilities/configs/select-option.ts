import React from "react";
import { ComponentViewConfig } from "./data.props";
import {
    SelectOption,
    SelectOptionProps,
    selectOptionSchema,
} from "@microsoft/fast-components-react-msft";
import { uniqueId } from "lodash-es";
import { glyphSchema, Icon } from "../../../app/components/glyph";
import Guidance from "../../.tmp/select-option/guidance";
import API from "../api";

const selectOptionConfig: ComponentViewConfig<SelectOptionProps> = {
    api: API(React.lazy(() => import("../../.tmp/select-option/api"))),
    schema: selectOptionSchema,
    component: SelectOption,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            data: {
                value: "Select Option",
                displayString: "Select Option",
                id: uniqueId(),
            },
        },
        {
            displayName: "With glyph",
            data: {
                value: "Select Option",
                displayString: "Select Option",
                glyph: {
                    id: glyphSchema.id,
                    props: {
                        path: Icon.download,
                    },
                } as any,
                id: uniqueId(),
            },
        },
        {
            displayName: "Disabled",
            data: {
                value: "Select Option",
                displayString: "Select Option",
                disabled: true,
                id: uniqueId(),
            },
        },
    ],
};

export default selectOptionConfig;

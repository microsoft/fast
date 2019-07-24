import { ComponentViewConfig } from "./data.props";
import {
    SelectOption,
    SelectOptionProps,
    selectOptionSchema,
} from "@microsoft/fast-components-react-msft";
import { uniqueId } from "lodash-es";
import { glyphSchema, Icon } from "../../../app/components/glyph";
import Guidance from "../../.tmp/select-option/guidance";

const selectOptionConfig: ComponentViewConfig<SelectOptionProps> = {
    schema: selectOptionSchema,
    component: SelectOption,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            data: {
                value: "Default",
                displayString: "Default",
                id: uniqueId(),
            },
        },
        {
            displayName: "Glyph",
            data: {
                value: "Default",
                displayString: "With glyph",
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
                value: "Default",
                displayString: "Disabled",
                disabled: true,
                id: uniqueId(),
            },
        },
    ],
};

export default selectOptionConfig;

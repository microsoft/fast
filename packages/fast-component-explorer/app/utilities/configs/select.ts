import { ComponentViewConfig } from "./data.props";
import {
    Select,
    SelectOptionProps,
    selectOptionSchema,
    SelectProps,
    selectSchema,
} from "@microsoft/fast-components-react-msft";
import { uniqueId } from "lodash-es";
import glyphSchema from "../components/glyph.schema";
import { Icon } from "../components/glyph";
import Guidance from "../../.tmp/select/guidance";

function selectOptionPropFactory(value: string): SelectOptionProps {
    return {
        id: uniqueId(),
        value: value,
        displayString: value,
    };
}

const selectConfig: ComponentViewConfig<SelectProps> = {
    schema: selectSchema,
    component: Select,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Default",
            data: {
                placeholder: "Select an option",
                children: [
                    {
                        id: selectOptionSchema.id,
                        props: {
                            ...selectOptionPropFactory("Select option 1"),
                        },
                    },
                    {
                        id: selectOptionSchema.id,
                        props: {
                            ...selectOptionPropFactory("Select option 2"),
                        },
                    },
                    {
                        id: selectOptionSchema.id,
                        props: {
                            ...selectOptionPropFactory("Select option 2"),
                        },
                    },
                ],
            },
        },
    ],
};

export default selectConfig;

import { SelectOption, selectOptionSchema2 } from "@microsoft/fast-components-react-msft";
import { uniqueId } from "lodash-es";
import { glyphSchema, Icon } from "../../components/glyph";
import Guidance from "../../.tmp/select-option/guidance";
import { ComponentViewConfig } from "./data.props";

const selectOptionConfig: ComponentViewConfig = {
    schema: selectOptionSchema2,
    component: SelectOption,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            dataDictionary: [
                {
                    root: {
                        schemaId: selectOptionSchema2.id,
                        data: {
                            value: "Select Option",
                            displayString: "Select Option",
                            id: uniqueId(),
                        },
                    },
                },
                "root",
            ],
        },
        {
            displayName: "With glyph",
            dataDictionary: [
                {
                    root: {
                        schemaId: selectOptionSchema2.id,
                        data: {
                            value: "Select Option",
                            displayString: "Select Option",
                            id: uniqueId(),
                            glyph: [
                                {
                                    id: "glyph",
                                },
                            ],
                        },
                    },
                    glyph: {
                        parent: {
                            id: "root",
                            dataLocation: "glyph",
                        },
                        schemaId: glyphSchema.id,
                        data: {
                            path: Icon.download,
                        },
                    },
                },
                "root",
            ],
        },
        {
            displayName: "Disabled",
            dataDictionary: [
                {
                    root: {
                        schemaId: selectOptionSchema2.id,
                        data: {
                            value: "Select Option",
                            displayString: "Select Option",
                            disabled: true,
                            id: uniqueId(),
                        },
                    },
                },
                "root",
            ],
        },
    ],
};

export default selectOptionConfig;

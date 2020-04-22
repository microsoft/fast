import {
    Select,
    SelectOptionProps,
    selectOptionSchema2,
    selectSchema2,
} from "@microsoft/fast-components-react-msft";
import { uniqueId } from "lodash-es";
import Guidance from "../../.tmp/select/guidance";
import { ComponentViewConfig } from "./data.props";

function selectOptionPropFactory(value: string): SelectOptionProps {
    return {
        id: uniqueId(),
        value,
        displayString: value,
    };
}

const selectConfig: ComponentViewConfig = {
    schema: selectSchema2,
    component: Select,
    guidance: Guidance,
    scenarios: [
        {
            displayName: "Basic",
            dataDictionary: [
                {
                    root: {
                        schemaId: selectSchema2.id,
                        data: {
                            placeholder: "Select an option",
                            children: [
                                {
                                    id: "children0",
                                },
                                {
                                    id: "children1",
                                },
                                {
                                    id: "children2",
                                },
                            ],
                        },
                    },
                    children0: {
                        parent: {
                            id: "root",
                            dataLocation: "children",
                        },
                        schemaId: selectOptionSchema2.id,
                        data: selectOptionPropFactory("Select option 1"),
                    },
                    children1: {
                        parent: {
                            id: "root",
                            dataLocation: "children",
                        },
                        schemaId: selectOptionSchema2.id,
                        data: selectOptionPropFactory("Select option 2"),
                    },
                    children2: {
                        parent: {
                            id: "root",
                            dataLocation: "children",
                        },
                        schemaId: selectOptionSchema2.id,
                        data: selectOptionPropFactory("Select option 3"),
                    },
                },
                "root",
            ],
        },
    ],
};

export default selectConfig;

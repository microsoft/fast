import { FormCategoryDictionary } from "@microsoft/fast-tooling-react/dist/form/form.props";
import { fastButtonDefinition } from "@microsoft/fast-components/dist/esm/button/button.definition.js";

export const componentCategories: FormCategoryDictionary = {
    [fastButtonDefinition.tags[0].name]: {
        "": [
            {
                title: "Appearance",
                dataLocations: ["appearance", "disabled", "Slot", "SlotStart", "SlotEnd"],
            },
            {
                title: "Advanced",
                dataLocations: [
                    "autofocus",
                    "name",
                    "type",
                    "value",
                    "form",
                    "formaction",
                    "formenctype",
                    "formmethod",
                    "formnovalidate",
                    "formtarget",
                ],
            },
        ],
    },
};

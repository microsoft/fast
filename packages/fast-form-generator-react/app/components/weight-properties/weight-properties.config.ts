import {
    FormComponentMappingToPropertyNamesProps,
    FormOrderByPropertyNamesProps,
} from "../../../src/form/form.props";

export const weightPropertiesWeight: FormOrderByPropertyNamesProps = {
    showCategoriesAtPropertyCount: 4,
    defaultCategoryWeight: 20,
    categories: [
        {
            title: "Content",
            expandable: true,
            weight: 50,
            properties: [
                { weight: 5, propertyName: ["title"] },
                { weight: 4, propertyName: ["text"] },
                { weight: 0, propertyName: "details" },
            ],
        },
        {
            title: "Formatting",
            expandable: true,
            weight: 40,
            properties: [
                {
                    weight: 9,
                    propertyName: ["alignHorizontal", "alignVertical"],
                },
                { weight: 7, propertyName: ["level"] },
            ],
        },
        {
            title: "Developer",
            weight: 0,
            properties: [{ weight: 9, propertyName: "tag" }],
        },
    ],
};

export const weightPropertiesConfig: FormComponentMappingToPropertyNamesProps = {
    alignHorizontal: ["alignHorizontal"],
};

export interface FrameworkContentPlacementData {
    actionLink?: string;
    actionText?: string;
    body?: string;
    compatibilityImageAlt?: string;
    compatibilityImageSrc?: string;
    compatibilityText?: string;
    divider?: boolean;
    header?: string;
}

const frameworkContentPlacementReusableData: FrameworkContentPlacementData = {
    actionLink: "#",
    actionText: "Learn More",
    compatibilityImageAlt: "Smiley face",
    compatibilityImageSrc: "https://via.placeholder.com/16",
    compatibilityText: "No issues!",
};

export const frameworkContentPlacementData: FrameworkContentPlacementData[] = [
    {
        body:
            "Angular's default binding syntax will always set properties on an element. This works well for rich data, like objects and arrays, and also works well for primitive values so long as the Custom Element author has mapped any exposed attributes to corresponding properties.",
        header: "Angular 8.2.14",
        ...frameworkContentPlacementReusableData,
    },
    {
        body:
            "DIO uses a runtime heuristic to determine if it should pass data to Custom Elements as either properties or attributes. If a property is already defined on the element instance, DIO will use properties, otherwise it will fallback to attributes.",
        header: "DIO",
        ...frameworkContentPlacementReusableData,
    },
    {
        body:
            "hyperHTML will pass data to an element as properties, as long as the property is defined on the element's prototype. Otherwise it will fallback to passing data as attributes.",
        header: "hyperHTML 2.32.2",
        ...frameworkContentPlacementReusableData,
    },
    {
        body:
            "Dojo will pass data as attributes only when the data is a type of string, otherwise it is set as a property.",
        header: "Dojo 6.0.4",
        ...frameworkContentPlacementReusableData,
    },
    {
        body:
            "Hybrids will pass data to an element as properties, as long as the property is defined on the element's prototype. Otherwise it will fallback to passing data as attributes.",
        header: "hybrids 4.1.7",
        ...frameworkContentPlacementReusableData,
    },
    {
        body:
            "AngularJS can declaratively pass data to attributes using ng-attr, or to properties using ng-prop.",
        header: "AngularJS (1.x) 1.7.9",
        ...frameworkContentPlacementReusableData,
    },
];

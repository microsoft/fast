export interface FrameworkContentPlacementData {
    body?: string;
    header?: string;
    headerSubscript?: string;
}

export const frameworkContentPlacementData: FrameworkContentPlacementData[] = [
    {
        body:
            "Angular's default binding syntax will always set properties on an element. This works well for rich data, like objects and arrays, and also works well for primitive values so long as the Custom Element author has mapped any exposed attributes to corresponding properties.",
        header: "Angular",
        headerSubscript: "8.2.14",
    },
    {
        body:
            "DIO uses a runtime heuristic to determine if it should pass data to Custom Elements as either properties or attributes. If a property is already defined on the element instance, DIO will use properties, otherwise it will fallback to attributes.",
        header: "DIO",
    },
    {
        body:
            "hyperHTML will pass data to an element as properties, as long as the property is defined on the element's prototype. Otherwise it will fallback to passing data as attributes.",
        header: "hyperHTML",
        headerSubscript: "2.32.2",
    },
    {
        body:
            "Dojo will pass data as attributes only when the data is a type of string, otherwise it is set as a property.",
        header: "Dojo",
        headerSubscript: "6.0.4",
    },
    {
        body:
            "Hybrids will pass data to an element as properties, as long as the property is defined on the element's prototype. Otherwise it will fallback to passing data as attributes.",
        header: "hybrids",
        headerSubscript: "4.1.7",
    },
    {
        body:
            "AngularJS can declaratively pass data to attributes using ng-attr, or to properties using ng-prop.",
        header: "AngularJS (1.x)",
        headerSubscript: "1.7.9",
    },
];

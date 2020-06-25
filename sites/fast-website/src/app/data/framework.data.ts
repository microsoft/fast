export interface FrameworkContentPlacementData {
    body?: string;
    header?: string;
    headerSubscript?: string;
}

export const frameworkContentPlacementData: FrameworkContentPlacementData[] = [
    {
        body:
            "FAST works flawlessly with both Aurelia 1 and Aurelia 2, with full integration into the binding engine and component model.",
        header: "Aurelia",
        headerSubscript: "1 & 2",
    },
    {
        body:
            "Angular supports binding syntax for setting both attributes and properties, though the default binding syntax will always set properties on an element.",
        header: "Angular",
        headerSubscript: "8.2.14",
    },
    {
        body:
            "FAST works naturally with ASP.NET server-side development. Start building immediately by adding a script tag and using the custom HTML elements.",
        header: "ASP.net",
    },
    {
        body:
            "Vue fully supports custom elements and by default passes all data to them as attributes. The framework also provides a special syntax to bind properties.",
        header: "Vue",
    },
    {
        body:
            "FAST integrates nicely with Blazor, a feature of ASP.NET which lets you build interactive web UIs using C# instead of JavaScript.",
        header: "Blazor",
    },
    {
        body:
            "While the React team works to fully support custom elements in v17, we're working hard to provide a wrapper to seamlessly support integration for v16.x.x.",
        header: "React",
        headerSubscript: "Coming Soon",
    },
];

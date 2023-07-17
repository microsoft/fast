import { FeatureLink } from "./feature.data";

export interface FrameworkContentPlacementData {
    body?: string;
    header?: string;
    headerSubscript?: string;
    links?: FeatureLink[];
}

export const frameworkContentPlacementData: FrameworkContentPlacementData[] = [
    {
        body: "Angular works great with FAST due to its binding system's support for setting both attributes and properties on custom elements.",
        header: "Angular",
        headerSubscript: "8.2.14",
        links: [
            {
                anchorText: "Read Angular docs",
                url: "/docs/integrations/angular",
            },
        ],
    },
    {
        body: "FAST works naturally with ASP.NET server-side development. Start building immediately by adding a script tag and using the custom HTML elements.",
        header: "ASP.NET",
        links: [
            {
                anchorText: "Read ASP.NET docs",
                url: "/docs/integrations/aspnet",
            },
        ],
    },
    {
        body: "FAST works flawlessly with both Aurelia 1 and Aurelia 2, with full integration into the binding engine and component model.",
        header: "Aurelia",
        headerSubscript: "1 & 2",
        links: [
            {
                anchorText: "Read Aurelia docs",
                url: "/docs/integrations/aurelia",
            },
        ],
    },
    {
        body: "FAST integrates nicely with Blazor, a feature of ASP.NET which lets you build interactive web UIs using C# instead of JavaScript.",
        header: "Blazor",
        links: [
            {
                anchorText: "Read Blazor docs",
                url: "/docs/integrations/blazor",
            },
        ],
    },
    {
        body: "While we are eagerly awaiting React to fully support custom elements, we provide improved integration support with our fast-react-wrapper.",
        header: "React",
        links: [
            {
                anchorText: "Read React docs",
                url: "/docs/integrations/react",
            },
        ],
    },
    {
        body: "Vue fully supports custom elements and by default passes all data to them as attributes. The framework also provides a special syntax to bind properties.",
        header: "Vue",
        links: [
            {
                anchorText: "Read Vue docs",
                url: "/docs/integrations/vue",
            },
        ],
    },
];

interface FeatureLink {
    anchorText: string;
    url: string;
}

export interface FeatureCardData {
    header: string;
    body: string;
    links?: FeatureLink[];
}

export const featureCardData: FeatureCardData[] = [
    {
        header: "Composition",
        body:
            "Create new component compositions by nesting, styling base components, and passing unhandled props. The combinations are endless.",
        links: [
            {
                anchorText: "View GitHub",
                url: "#",
            },
            {
                anchorText: "Read Documentation",
                url: "#",
            },
        ],
    },
    {
        header: "Design Systems",
        body:
            "Use Fluent by default or customize design system properties to make it your own. Or, create your own design system to use with FAST components.",
        links: [
            {
                anchorText: "View GitHub",
                url: "#",
            },
            {
                anchorText: "Read Documentation",
                url: "#",
            },
        ],
    },
    {
        header: "Technology",
        body:
            "Out of the box, FAST components are built on React, but you can build components on any modern framework using the FAST system.",
        links: [
            {
                anchorText: "View GitHub",
                url: "#",
            },
            {
                anchorText: "Read Documentation",
                url: "#",
            },
        ],
    },
    {
        header: "Web Standards",
        body:
            "All FAST components follow WCAG 2.1, are W3C spec-compliant and use the W3C interaction models when available.",
        links: [
            {
                anchorText: "WCAG",
                url: "https://www.w3.org/WAI/standards-guidelines/wcag/",
            },
            {
                anchorText: "Web Accessibility Initiative",
                url: "https://www.w3.org/WAI/",
            },
        ],
    },
    {
        header: "Animation",
        body:
            "Design sophisticated animation sequences with the animation library, an interface for the Web Animations API.",
        links: [
            {
                anchorText: "View GitHub",
                url: "#",
            },
            {
                anchorText: "Read Documentation",
                url: "#",
            },
        ],
    },
    {
        header: "Colors",
        body:
            "Create color palettes, extract colors from images, and handle other color operations using our color library.",
        links: [
            {
                anchorText: "View GitHub",
                url: "#",
            },
            {
                anchorText: "Read Documentation",
                url: "#",
            },
        ],
    },
    {
        header: "Layout / Grid",
        body:
            "Build layouts such as a 12 column grid for content or an application grid with resizable panels.",
        links: [
            {
                anchorText: "View GitHub",
                url: "#",
            },
            {
                anchorText: "Read Documentation",
                url: "#",
            },
        ],
    },
    {
        header: "Other",
        body:
            "Leverage a toolkit of general utilities such as keyboarding, Right-To-Left (RTL), number, and string manipulation.",
        links: [
            {
                anchorText: "View GitHub",
                url: "#",
            },
            {
                anchorText: "Read Documentation",
                url: "#",
            },
        ],
    },
];

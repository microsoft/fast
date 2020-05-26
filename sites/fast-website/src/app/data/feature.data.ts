export interface FeatureCardData {
    body: string;
    documentationLink: string;
    githubLink: string;
    header: string;
    item: string;
}

export const featureCardData: FeatureCardData[] = [
    {
        body:
            "Create new component compositions by nesting, styling base components, and passing unhandled props. The combinations are endless.",
        documentationLink: "#",
        githubLink: "#",
        header: "Composition",
        item: "01",
    },
    {
        body:
            "Use Fluent by default or customize design system properties to make it your own. Or, create your own design system to use with FAST components.",
        documentationLink: "#",
        githubLink: "#",
        header: "Design Systems",
        item: "02",
    },
    {
        body:
            "Out of the box, FAST components are built on React, but you can build components on any modern framework using the FAST system.",
        documentationLink: "#",
        githubLink: "#",
        header: "Technology",
        item: "03",
    },
    {
        body:
            "All FAST components follow WCAG 2.1, are W3C spec-compliant and use the W3C interaction models when available.",
        documentationLink: "#",
        githubLink: "#",
        header: "Web Standards",
        item: "04",
    },
    {
        body:
            "Design sophisticated animation sequences with the animation library, an interface for the Web Animations API.",
        documentationLink: "#",
        githubLink: "#",
        header: "Animation",
        item: "05",
    },
    {
        body:
            "Create color palettes, extract colors from images, and handle other color operations using our color library.",
        documentationLink: "#",
        githubLink: "#",
        header: "Colors",
        item: "06",
    },
    {
        body:
            "Build layouts such as a 12 column grid for content or an application grid with resizable panels.",
        documentationLink: "#",
        githubLink: "#",
        header: "Layout / Grid",
        item: "07",
    },
    {
        body:
            "Leverage a toolkit of general utilities such as keyboarding, Right-To-Left (RTL), number, and string manipulation.",
        documentationLink: "#",
        githubLink: "#",
        header: "Other",
        item: "08",
    },
];

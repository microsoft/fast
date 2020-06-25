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
            "Create new component compositions by nesting, styling foundation components, or extending existing components. The combinations are endless.",
        links: [
            {
                anchorText: "Get started",
                url: "/docs/components/getting-started",
            },
        ],
    },
    {
        header: "Design Systems",
        body:
            "Use FAST or Microsoft's Fluent by default or customize design system properties to make it your own. Or, create your own design system to use with FAST foundation components.",
        links: [
            {
                anchorText: "Learn more",
                url: "/docs/design/introduction",
            },
        ],
    },
    {
        header: "Technology",
        body:
            "FAST web components are built on the core technologies of the web to work in any scenario. Use them as is or with your favorite framework.",
        links: [
            {
                anchorText: "View example integrations",
                url: "/docs/integrations/introduction",
            },
        ],
    },
    {
        header: "Web Standards",
        body:
            "All FAST components follow WCAG 2.1, are W3C spec-compliant and use the W3C interaction models when available.",
        links: [
            {
                anchorText: "Visit WCAG",
                url: "https://www.w3.org/WAI/standards-guidelines/wcag/",
            },
        ],
    },
    {
        header: "Animation",
        body:
            "Design sophisticated animation sequences with the animation library, an interface for the Web Animations API.",
        links: [
            {
                anchorText: "View documentation",
                url: "/docs/api/fast-animation",
            },
        ],
    },
    {
        header: "Colors",
        body:
            "Create color palettes, extract colors from images, and handle other color operations using our color library.",
        links: [
            {
                anchorText: "View documentation",
                url: "/docs/api/fast-colors",
            },
        ],
    },
];

module.exports = {
    docs: [
        {
            type: "doc",
            id: "introduction",
        },
        {
            type: "category",
            label: "Building Components",
            link: {
                type: "generated-index",
            },
            items: [
                "fast-element/getting-started",
                "fast-element/defining-elements",
                "fast-element/declaring-templates",
                "fast-element/using-directives",
                "fast-element/observables-and-state",
                "fast-element/working-with-shadow-dom",
                "fast-element/leveraging-css",
                "fast-element/next-steps",
            ],
        },
        {
            type: "category",
            label: "Apps and Experiences",
            link: {
                type: "generated-index",
            },
            items: ["apps-and-experiences/dependency-injection"],
        },
        {
            type: "category",
            label: "API Reference",
            link: {
                type: "generated-index",
            },
            items: [
                {
                    type: "doc",
                    id: "api/fast-element",
                    customProps: {
                        description:
                            "Explore the classes, functions, interfaces, variables, and type aliases of fast-element.",
                        keywords: ["fast-element"],
                    },
                },
            ],
        },
        {
            type: "category",
            label: "Community Contribution",
            link: {
                type: "generated-index",
            },
            items: [
                "community/join",
                "community/code-of-conduct",
                "community/contributor-guide",
                "community/branch-guide",
                "community/writing-documentation",
                {
                    type: "category",
                    label: "Engineering Process",
                    customProps: {
                        description:
                            "Our issue management and release planning processes.",
                    },
                    link: {
                        type: "generated-index",
                    },
                    items: ["community/issue-management", "community/release-planning"],
                },
            ],
        },
        {
            type: "category",
            label: "Resources",
            link: {
                type: "generated-index",
            },
            items: [
                "resources/why-web-components",
                "resources/license",
                "resources/security",
                "resources/browser-support",
                "resources/acknowledgements",
                "resources/glossary",
                "resources/cheat-sheet",
                "resources/faq",
            ],
        },
    ],
};

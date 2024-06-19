module.exports = {
    docs: [
        {
            type: "doc",
            id: "introduction",
        },
        {
            type: "category",
            label: "Getting Started",
            link: {
                type: "generated-index",
            },
            items: [
                {
                    type: "doc",
                    id: "getting-started/quick-start",
                },
                {
                    type: "doc",
                    id: "getting-started/html-templates",
                },
                {
                    type: "doc",
                    id: "getting-started/html-directives",
                },
                {
                    type: "doc",
                    id: "getting-started/css-templates",
                },
                {
                    type: "doc",
                    id: "getting-started/fast-element",
                },
            ],
        },
        {
            type: "category",
            label: "Advanced Concepts",
            link: {
                type: "generated-index",
            },
            items: [
                "advanced/working-with-custom-elements",
                "advanced/component-libraries",
                "advanced/dependency-injection",
            ],
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
            type: "doc",
            id: "integrations",
        },
        {
            type: "doc",
            id: "migration-guide",
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
                "resources/faq",
            ],
        },
    ],
};

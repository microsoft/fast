module.exports = {
    docs: [
        {
            type: "doc",
            id: "introduction",
        },
        {
            type: "category",
            label: "Using the Components",
            link: {
                type: "generated-index",
            },
            items: [
                "components/getting-started",
                "design-systems/fast-frame",
                {
                    type: "category",
                    label: "Components",
                    customProps: {
                        description: "A comprehensive list of FAST elements.",
                    },
                    link: {
                        type: "generated-index",
                    },
                    items: [
                        "components/accordion",
                        "components/anchor",
                        "components/anchored-region",
                        "components/avatar",
                        "components/badge",
                        "components/breadcrumb",
                        "components/button",
                        "components/card",
                        "components/checkbox",
                        "components/combobox",
                        "components/data-grid",
                        "components/dialog",
                        "components/disclosure",
                        "components/divider",
                        "components/flipper",
                        "components/horizontal-scroll",
                        "components/listbox",
                        "components/listbox-option",
                        "components/menu",
                        "components/number-field",
                        "components/progress",
                        "components/radio",
                        "components/radio-group",
                        "components/select",
                        "components/skeleton",
                        "components/slider",
                        "components/switch",
                        "components/tabs",
                        "components/text-area",
                        "components/text-field",
                        "components/toolbar",
                        "components/tooltip",
                        "components/tree-view",
                    ],
                },
            ],
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
            label: "Creating Design Systems",
            link: {
                type: "generated-index",
            },
            items: [
                "design-systems/overview",
                "design-systems/creating-a-component-library",
                "design-systems/design-tokens",
                "design-systems/high-contrast",
                "design/match-media-stylesheets",
                "design/localization",
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
            label: "Integrations",
            link: {
                type: "generated-index",
            },
            items: [
                "integrations/introduction",
                "integrations/angular",
                "integrations/aspnet",
                "integrations/aurelia",
                "integrations/blazor",
                "integrations/ember",
                "integrations/react",
                "integrations/rollup",
                "integrations/svelte",
                "integrations/vite",
                "integrations/vue",
                "integrations/webpack",
            ],
        },
        {
            type: "category",
            label: "Tools",
            link: {
                type: "generated-index",
            },
            items: [
                "tools/component-explorer",
                "tools/vscode",
                "tools/hot-module-reload",
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
                    id: "api/fast-animation",
                    customProps: {
                        description:
                            "Exlore the classes and functions of fast-animation.",
                        keywords: ["fast-animation"],
                    },
                },
                {
                    type: "doc",
                    id: "api/fast-colors",
                    customProps: {
                        description:
                            "Explore the classes, enumerations, functions, interfaces, variables, and type aliases of fast-colors.",
                        keywords: ["fast-colors"],
                    },
                },
                {
                    type: "doc",
                    id: "api/fast-components",
                    customProps: {
                        description:
                            "Explore the classes, enumerations, functions, interfaces, variables, and type aliases of fast-components.",
                        keywords: ["fast-components"],
                    },
                },
                {
                    type: "doc",
                    id: "api/fast-element",
                    customProps: {
                        description:
                            "Explore the classes, functions, interfaces, variables, and type aliases of fast-element.",
                        keywords: ["fast-element"],
                    },
                },
                {
                    type: "doc",
                    id: "api/fast-foundation",
                    customProps: {
                        description:
                            "Explore the classes, enumerations, functions, interfaces, variables, and type aliases of fast-foundation.",
                        keywords: ["fast-foundation"],
                    },
                },
                {
                    type: "doc",
                    id: "api/fast-ssr",
                    customProps: {
                        description:
                            "Explore the classes, enumerations, functions, interfaces, variables, and type aliases of fast-ssr.",
                        keywords: ["fast-ssr"],
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

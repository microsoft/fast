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
                "building-components/defining-elements",
                "building-components/declaring-templates",
                "building-components/using-directives",
                "building-components/observables-and-state",
                "building-components/working-with-shadow-dom",
                "building-components/leveraging-css",
                "building-components/next-steps",
                {
                    type: "category",
                    label: "Advanced",
                    link: {
                        type: "generated-index",
                    },
                    items: [
                        "building-components/advanced/custom-security-policies",
                        "building-components/advanced/custom-bindings",
                        "building-components/advanced/custom-css-directives",
                        "building-components/advanced/custom-html-directives",
                        "building-components/advanced/dynamic-composition",
                        "building-components/advanced/debugging-fast-element",
                        "building-components/advanced/testing-components",
                        "building-components/advanced/kernal-sharing",
                        "building-components/advanced/performance-optimization",
                    ],
                },
            ],
        },
        {
            type: "category",
            label: "Creating Design Systems",
            link: {
                type: "generated-index",
            },
            items: [
                "creating-design-systems/getting-started",
                "creating-design-systems/customizing-foundation-components",
                "creating-design-systems/design-tokens",
            ],
        },
        {
            type: "category",
            label: "Scaling Apps and Experiences",
            link: {
                type: "generated-index",
            },
            items: [
                "scaling-apps-and-experiences/w3c-pending-task-protocol",
                "scaling-apps-and-experiences/w3c-context-protocol",
                "scaling-apps-and-experiences/dependency-injection",
                "scaling-apps-and-experiences/state-management",
                "scaling-apps-and-experiences/cross-component-communication",
                "scaling-apps-and-experiences/code-organization-and-conventions",
                {
                    type: "category",
                    label: "Routing",
                    link: {
                        type: "generated-index",
                    },
                    items: ["scaling-apps-and-experiences/routing/getting-started"],
                },
            ],
        },
        {
            type: "category",
            label: "Server-side Rendering",
            link: {
                type: "generated-index",
            },
            items: [
                "server-side-rendering/getting-started",
                "server-side-rendering/creating-universal-components",
                "server-side-rendering/customizing-your-server",
                "server-side-rendering/client-hydration-patterns",
            ],
        },
        {
            type: "category",
            label: "Code Examples",
            link: {
                type: "generated-index",
            },
            items: ["code-examples/introduction"],
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
            items: ["tools/visual-studio-code", "tools/hot-module-reload"],
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
                    id: "api-reference/fast-animation",
                    customProps: {
                        description:
                            "Exlore the classes and functions of fast-animation.",
                        keywords: ["fast-animation"],
                    },
                },
                {
                    type: "doc",
                    id: "api-reference/fast-colors",
                    customProps: {
                        description:
                            "Explore the classes, enumerations, functions, interfaces, variables, and type aliases of fast-colors.",
                        keywords: ["fast-colors"],
                    },
                },
                {
                    type: "doc",
                    id: "api-reference/fast-element",
                    customProps: {
                        description:
                            "Explore the classes, functions, interfaces, variables, and type aliases of fast-element.",
                        keywords: ["fast-element"],
                    },
                },
                {
                    type: "doc",
                    id: "api-reference/fast-foundation",
                    customProps: {
                        description:
                            "Explore the classes, enumerations, functions, interfaces, variables, and type aliases of fast-foundation.",
                        keywords: ["fast-foundation"],
                    },
                },
                {
                    type: "doc",
                    id: "api-reference/fast-router",
                    customProps: {
                        description:
                            "Explore the classes, enumerations, functions, interfaces, variables, and type aliases of fast-router.",
                        keywords: ["fast-router"],
                    },
                },
                {
                    type: "doc",
                    id: "api-reference/fast-ssr",
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
                "community-contribution/join",
                "community-contribution/code-of-conduct",
                "community-contribution/contributor-guide",
                "community-contribution/branch-guide",
                "community-contribution/writing-documentation",
                "community-contribution/steering-committee",
                {
                    type: "category",
                    label: "Engineering Process",
                    link: {
                        type: "generated-index",
                    },
                    items: [
                        "community-contribution/issue-management",
                        "community-contribution/release-planning",
                    ],
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
                "resources/error-codes",
                "resources/migration-guide",
                "resources/working-without-decorators",
            ],
        },
    ],
};

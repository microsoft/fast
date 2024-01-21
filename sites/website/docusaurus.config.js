module.exports = {
    title: "FAST",
    tagline: "The adaptive interface system for modern web experiences",
    url: "https://www.fast.design",
    baseUrl: "/",
    favicon: "/favicon.ico",
    organizationName: "microsoft",
    projectName: "fast",
    onBrokenLinks: "log",
    scripts: [
        {
            src: "/fast-components.iife.min.js",
            async: true,
        },
    ],
    themes: [require.resolve("@docusaurus/theme-live-codeblock")],
    staticDirectories: ["static"],
    themeConfig: {
        colorMode: {
            defaultMode: "dark",
        },
        prism: {
            theme: require("prism-react-renderer/themes/github"),
            darkTheme: require("prism-react-renderer/themes/palenight"),
        },
        docs: {
            sidebar: {
                hideable: true,
                autoCollapseCategories: true,
            },
        },
        navbar: {
            logo: {
                alt: `Line drawing of a small moon orbiting around a planet with the words FAST next to it`,
                srcDark: "/fast-inline-logo.svg",
                src: "/fast-inline-logo-light.svg",

                // FIXME: #3299 Docusaurus displays a blank page when clicking the logo link without workaround
                target: "_blank",
                ...(process.env.NODE_ENV === "production" && {
                    href: "https://www.fast.design",
                    target: "_self",
                }),
            },
            items: [
                {
                    type: "doc",
                    docId: "introduction",
                    label: "Docs",
                    position: "left",
                },
                // TODO: uncomment when ready to display dropdown for doc versions (lines 55-58)
                // {
                //     type: "docsVersionDropdown",
                //     position: "left",
                // },
                {
                    href: "https://www.fast.design",
                    label: "Home",
                    position: "right",
                },
                {
                    href: "https://explore.fast.design/",
                    label: "Components",
                    position: "right",
                },
                {
                    href: "https://discord.com/invite/FcSNfg4",
                    label: "Community",
                    position: "right",
                },
                {
                    href: "https://github.com/microsoft/fast",
                    label: "GitHub",
                    position: "right",
                },
            ],
        },
        footer: {
            style: "dark",
            links: [
                {
                    title: "Docs",
                    items: [
                        {
                            label: "FAST Element",
                            to: "docs/fast-element/getting-started",
                        },
                    ],
                },
                {
                    title: "Community",
                    items: [
                        {
                            label: "Discord",
                            href: "https://discord.gg/FcSNfg4",
                        },
                    ],
                },
                {
                    title: "Social",
                    items: [
                        {
                            label: "Blog",
                            href: "https://medium.com/fast-design",
                        },
                        {
                            label: "GitHub",
                            href: "https://github.com/microsoft/fast",
                        },
                        {
                            label: "Twitter",
                            href: "https://twitter.com/FAST_UI",
                        },
                    ],
                },
                {
                    title: "Legal",
                    items: [
                        {
                            label: "License",
                            href: "https://github.com/microsoft/fast/blob/master/LICENSE",
                        },
                        {
                            label: "Privacy & cookies",
                            href: "https://go.microsoft.com/fwlink/?LinkId=521839",
                        },
                        {
                            label: "Terms of use",
                            href: "https://go.microsoft.com/fwlink/?LinkID=206977",
                        },
                        {
                            label: "Trademarks",
                            href: "https://www.microsoft.com/trademarks",
                        },
                    ],
                },
            ],
            copyright: `© Microsoft ${new Date().getFullYear()}`,
        },
    },
    presets: [
        [
            "@docusaurus/preset-classic",
            {
                docs: {
                    sidebarPath: require.resolve("./sidebars.js"),
                    // Refer to https://github.com/microsoft/fast/issues/5865 effects of using true
                    showLastUpdateTime: false,
                    remarkPlugins: [require("mdx-mermaid")],
                    // The "includeCurrentVersion" plugin includes the ./docs folder of the docs - setting to false as current docs are in progress
                    // TODO: remove when ready to display both the current and legacy versions (line 155)
                    includeCurrentVersion: false,
                    // The "lastVersion" plugin sets which version the /docs route refers to
                    // TODO: update lastVersion to "current" when ready for /docs route to be set to the current version (line 158)
                    lastVersion: "legacy",
                    // TODO: Uncomment to begin displaying the doc versions labels (lines 160-167)
                    // versions: {
                    //     current: {
                    //         label: "current version",
                    //     },
                    //     legacy: {
                    //         label: "legacy version",
                    //     },
                    // },
                },
                theme: {
                    customCss: require.resolve("./src/css/custom.css"),
                },
            },
        ],
    ],
};

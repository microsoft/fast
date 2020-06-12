module.exports = {
    title: "FAST-DNA",
    tagline: "The tagline of my site",
    url: "https://www.fast.design",
    baseUrl: "/",
    favicon: "img/favicon/favicon.ico",
    organizationName: "microsoft",
    projectName: "fast-dna",
    scripts: [
        {
            src: "https://static.fast.design/assets/scripts/packages/fast-components.js",
            type: "module",
            async: true,
        },
    ],
    themes: ["@docusaurus/theme-live-codeblock"],
    themeConfig: {
        navbar: {
            logo: {
                alt: "FAST-DNA",
                src: "img/logo.svg",
            },
            links: [
                {
                    href: "https://github.com/microsoft/fast-dna",
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
                            label: "FAST Components",
                            to: "docs/fast-components/getting-started",
                        },
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
                            label: "Stack Overflow",
                            href: "http://stackoverflow.com/questions/tagged/fast-dna",
                        },
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
                            href: "https://medium.com/fast-dna",
                        },
                        {
                            label: "GitHub",
                            href: "https://github.com/microsoft/fast-dna",
                        },
                        {
                            label: "Twitter",
                            href: "https://twitter.com/FAST_DNA",
                        },
                    ],
                },
            ],
            copyright: `Copyright © Microsoft ${new Date().getFullYear()}`,
        },
    },
    presets: [
        [
            "@docusaurus/preset-classic",
            {
                docs: {
                    sidebarPath: require.resolve("./sidebars.js"),
                    editUrl: "https://github.com/microsoft/fast-dna",
                },
                theme: {
                    customCss: require.resolve("./src/css/custom.css"),
                },
            },
        ],
    ],
};

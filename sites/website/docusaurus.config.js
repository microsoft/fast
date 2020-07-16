module.exports = {
    title: "FAST",
    tagline: "The adaptive interface system for modern web experiences",
    url: "https://www.fast.design",
    baseUrl: "/",
    favicon: "/favicon.ico",
    organizationName: "microsoft",
    projectName: "fast",
    themeConfig: {
        defaultDarkMode: true,
        navbar: {
            logo: {
                alt:
                    "Line drawing of a small moon orbiting around a planet with the words FAST next to it",
                srcDark: "https://static.fast.design/assets/fast-inline-logo.png",
                src: "https://static.fast.design/assets/fast-inline-logo-light.png",

                // FIXME: #3299 Docusaurus displays a blank page when clicking the logo link without workaround
                target: "_blank",
                ...(process.env.NODE_ENV === "production" && {
                    href: "https://www.fast.design",
                    target: "_self",
                }),
            },
            links: [
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
                            label: "FAST Components",
                            to: "docs/components/getting-started",
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
                    editUrl: "https://github.com/microsoft/fast",
                },
                theme: {
                    customCss: require.resolve("./src/css/custom.css"),
                },
            },
        ],
    ],
};

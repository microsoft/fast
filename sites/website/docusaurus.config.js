import {themes as prismThemes} from 'prism-react-renderer';

module.exports = {
    title: "FAST",
    tagline: "The adaptive interface system for modern web experiences",
    url: "https://microsoft.github.io",
    baseUrl: "/fast/",
    deploymentBranch: "gh-pages",
    trailingSlash: false,
    favicon: "/favicon.ico",
    organizationName: "microsoft",
    projectName: "fast",
    onBrokenLinks: "log",
    markdown: {
        mermaid: true,
    },
    themes: [
        "@docusaurus/theme-live-codeblock",
        "@docusaurus/theme-mermaid",
    ],
    staticDirectories: ["static"],
    themeConfig: {
        prism: {
            theme: prismThemes.vsDark,
        },
        announcementBar: {
            id: 'version',
            content:
              '<code>@microsoft/fast-element</code> v2 is out! 🎉️',
            backgroundColor: 'var(--ifm-color-success-darkest)',
            textColor: 'var(--ifm-color-white)',
        },
        colorMode: {
            defaultMode: "dark",
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
                {
                    type: "docsVersionDropdown",
                    position: "left",
                    dropdownActiveClassDisabled: true,
                },
                {
                    href: "https://www.fast.design",
                    label: "Home",
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
                            to: "docs/getting-started/quick-start",
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
                    sidebarPath: "./sidebars.js",
                    // Refer to https://github.com/microsoft/fast/issues/5865 effects of using true
                    showLastUpdateTime: false,
                    lastVersion: "current",
                    versions: {
                        current: {
                            label: "2.x",
                        },
                        "1.x": {
                            label: "1.x",
                            path: "1.x",
                        },
                    },
                },
                theme: {
                    customCss: require.resolve("./src/css/custom.css"),
                },
            },
        ],
    ],
};

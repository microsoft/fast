export interface NavData {
    [componentName: string]: {
        external?: boolean;
        href: string;
        text: string;
        selected: boolean;
    };
}

export const NavData: NavData = {
    components: {
        external: true,
        href: "https://explore.fast.design",
        text: "COMPONENTS",
        selected: false
    },
    documentation: {
        external: true,
        href: "https://www.fast.design/docs/en/contributing/install",
        text: "DOCUMENTATION",
        selected: false
    }
};

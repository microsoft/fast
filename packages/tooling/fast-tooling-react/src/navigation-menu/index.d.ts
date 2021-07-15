/// <reference types="react" />
declare const NavigationMenu: import("react").ComponentClass<
    import("@microsoft/fast-jss-manager-react").ManagedJSSProps<
        unknown,
        import("./navigation-menu.style").NavigationMenuClassNameContract,
        {}
    >,
    any
>;
declare type NavigationMenu = InstanceType<typeof NavigationMenu>;
export { NavigationMenu };
export * from "./navigation-menu.props";
export * from "./navigation-menu-item.props";

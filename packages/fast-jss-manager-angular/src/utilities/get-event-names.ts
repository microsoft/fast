export interface IEventNames {
    getConfig: string;
    update: string;
    registerComponent: string;
    deregisterComponent: string;
}

export const eventNames: IEventNames = {
    getConfig: "design-system-get-config",
    update: "design-system-update",
    registerComponent: "design-system-register-component",
    deregisterComponent: "design-system-deregister-component"
};

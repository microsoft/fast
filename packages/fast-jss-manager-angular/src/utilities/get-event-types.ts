export interface IEvent {
    getConfig: string;
    update: string;
    registerComponent: string;
    deregisterComponent: string;
}

export const eventTypes: IEvent = {
    getConfig: "design-system-get-config",
    update: "design-system-update",
    registerComponent: "design-system-register-component",
    deregisterComponent: "design-system-deregister-component"
};

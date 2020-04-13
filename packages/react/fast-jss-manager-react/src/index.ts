import { manageJss } from "./manage-jss";

export default manageJss;
export {
    DesignSystemProvider,
    DesignSystemProviderProps,
} from "./design-system-provider";
export {
    stylesheetRegistry,
    /**
     * @deprecated
     * use JSSManager.jss to access the JSS instance
     */
    jss,
} from "./jss";
export { ManagedJSSProps } from "./jss-manager";
export { Consumer as DesignSystemConsumer } from "./context";
export {
    JSSManager,
    JSSStyleSheet,
    JSSManagerSubscriptionEventType,
    JSSManagerSubscriber,
} from "./jss-manager";
export * from "./design-system-provider";
export * from "@microsoft/fast-jss-manager";

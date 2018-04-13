import { IManagedClasses } from "@microsoft/fast-components-class-name-contracts-base";
/**
 * Class names under a given object keys
 */
 export type ClassNames<T> = {
    [className in keyof T]: string;
};

/**
 * The interface for class names passed as props
 */
export {IManagedClasses};

/**
 * Class names under a given object keys 
 */
 export type ClassNames<T> = {
    [className in keyof T]: string;
};

/**
 * The interface for class names passed as props
 */
 export interface IManagedClasses<T> {
    managedClasses: ClassNames<T>;
}

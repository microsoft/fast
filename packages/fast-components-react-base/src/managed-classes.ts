 export type ClassNames<T> = {
    /**
     * Class names under a given object key 
     */
    [className in keyof T]: string;
};

/**
 * The interface for class names passed as props
 */
 export interface IManagedClasses<T> {
    managedClasses: ClassNames<T>;
}

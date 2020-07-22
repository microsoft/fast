/**
 * Ensure the global Module variable is known
 * This is created in the permutator.js file
 */
declare var Module: any;

export interface PermutatorConfig {
    schema: object;
    /**
     * The number of data sets to provide
     */
    setSize: number;
}

export default Module.cwrap("permutate", "null", ["string"]);

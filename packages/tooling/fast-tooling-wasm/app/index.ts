import * as Number from "./number";

Number;

/**
 * Ensure the global Module variable is known
 * This is created in the permutator.js file
 */
declare var Module: any;

function receivePermutation(e) {
    console.log("permutation received", e);
}

Module["onPermutate"] = receivePermutation;

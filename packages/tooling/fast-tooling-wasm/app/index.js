import * as Number from "./number";
Number;
function receivePermutation(e) {
    console.log("permutation received", e);
}
Module["onPermutate"] = receivePermutation;

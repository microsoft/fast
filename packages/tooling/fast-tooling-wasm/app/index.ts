import NumberSchema from "./schemas/number.schema.json";

/**
 * Ensure the global Module variable is known
 * This is created in the permutator.js file
 */
declare var Module: any;

console.log("JSONSchema", NumberSchema);

var permutate = Module.cwrap("permutate", "number", ["number"]);

function getPemutation() {
    console.log("Expect 10: ", permutate(5));
}

const button = document.createElement("button");
button.innerText = "Get Permutation";
button.onclick = getPemutation;
document.body.appendChild(button);

import NumberSchema from "./schemas/number.schema.json";
import NumberDefaultSchema from "./schemas/number.default.schema.json";
import NumberExamplesSchema from "./schemas/number.examples.schema.json";
import NumberEnumSchema from "./schemas/number.enum.schema.json";
import NumberExclusiveMinimumSchema from "./schemas/number.exclusive-minimum.schema.json";
import NumberMinimumSchema from "./schemas/number.minimum.schema.json";
import NumberExclusiveMaximumSchema from "./schemas/number.exclusive-maximum.schema.json";
import NumberMaximumSchema from "./schemas/number.maximum.schema.json";
import NumberMultipleOfSchema from "./schemas/number.multiple-of.schema.json";
import permutate, { PermutatorConfig } from "../permutator";

const content = document.getElementById("number");

const configs: PermutatorConfig[] = [
    {
        schema: NumberSchema,
        setSize: 10,
    },
    {
        schema: NumberDefaultSchema,
        setSize: 10,
    },
    {
        schema: NumberExamplesSchema,
        setSize: 10,
    },
    {
        schema: NumberEnumSchema,
        setSize: 10,
    },
    {
        schema: NumberExclusiveMinimumSchema,
        setSize: 10,
    },
    {
        schema: NumberMinimumSchema,
        setSize: 10,
    },
    {
        schema: NumberExclusiveMaximumSchema,
        setSize: 10,
    },
    {
        schema: NumberMaximumSchema,
        setSize: 10,
    },
    {
        schema: NumberMultipleOfSchema,
        setSize: 10,
    },
];

function createNumberButton(config: PermutatorConfig) {
    const button = document.createElement("button");
    button.innerText = `Get Permutation: ${(config.schema as any).$id}`;
    button.onclick = callNumberPermutationFactory(config);
    content.appendChild(button);
}

function callNumberPermutationFactory(config: PermutatorConfig) {
    return () => {
        permutate(JSON.stringify(config));
    };
}

function createJSONSchemaPreview(config: PermutatorConfig) {
    const pre = document.createElement("pre");
    pre.innerText = JSON.stringify(config.schema, null, 2);
    content.appendChild(pre);
}

function createNumberButtonFactory() {
    configs.forEach(config => {
        createNumberButton(config);
        createJSONSchemaPreview(config);
    });
}

createNumberButtonFactory();

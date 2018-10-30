/**
 * Converts an array of references to just their schema IDs
 * @param {array} references - The references.
 * @return {array} - An array of schema IDs.
 */
module.exports = function(references) {
    let schemaIds = [];

    if (Array.isArray(references) && references.length > 0) {
        references.forEach(reference => {
            schemaIds.push(convertRefToId(reference));
        });
    }

    return schemaIds;
};

/**
 * Converts a reference to just the schema ID
 * @param {string} reference
 */
let convertRefToId = function(reference) {
    let definitionsRegex = /#\/definitions\/(.*)/g;

    if (typeof reference === "string") {
        if (reference.match(definitionsRegex)) {
            return reference.replace(definitionsRegex, "");
        } else {
            return reference;
        }
    }
};

const cache = {};

function importAll(r) {
    r.keys().forEach(key => (cache[key] = r(key)));
}

// Find and load all component registration modules
importAll(require.context("../src", true, /stories\/.*register\.ts$/));

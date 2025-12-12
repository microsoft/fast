function importAll(r) {
    r.keys().forEach(r);
}

// Explicitly add to browser test
importAll(require.context("../../dist/esm/", true, /\.spec\.js$/));

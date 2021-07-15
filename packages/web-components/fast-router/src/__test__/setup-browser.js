function importAll(r) {
    r.keys().forEach(r);
}
// Explicitly add to browser test
importAll(require.context("../", true, /\.spec\.js$/));

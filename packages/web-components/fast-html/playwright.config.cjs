module.exports = {
    testDir: "./dist/esm",
    retries: 3,
    webServer: {
        command: "npm run test-server",
        port: 8080,
        timeout: 120 * 1000,
        reuseExistingServer: false,
    },
};

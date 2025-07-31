module.exports = {
    testDir: "./dist/esm",
    retries: 0,
    webServer: {
        command: "npm run test-server",
        port: 8080,
        timeout: 120 * 10,
        reuseExistingServer: false,
    },
};

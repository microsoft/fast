const config = {
    projects: [
        {
            name: "Desktop Chromium",
            use: {
                browserName: "chromium",
            },
        },
    ],
    webServer: {
        command: "npm run serve",
        port: 3000,
        reuseExistingServer: !process.env.CI,
    },
};

module.exports = config;

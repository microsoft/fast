var favicons = require("favicons"),
    path = require("path"),
    fs = require("fs"),
    chalk = require("chalk"),
    source = "./statics/assets/fast-logo.png", // Source image(s). `string`, `buffer` or array of `string`
    configuration = {
        path: "https://static.fast.design/assets/manifest", // Path for overriding default icons path. `string`
        appName: null, // Your application's name. `string`
        appShortName: null, // Your application's short_name. `string`. Optional. If not set, appName will be used
        appDescription: null, // Your application's description. `string`
        developerName: null, // Your (or your developer's) name. `string`
        developerURL: null, // Your (or your developer's) URL. `string`
        dir: "auto", // Primary text direction for name, short_name, and description
        lang: "en-US", // Primary language for name and short_name
        background: "#fff", // Background colour for flattened icons. `string`
        theme_color: "#fff", // Theme color user for example in Android's task switcher. `string`
        appleStatusBarStyle: "black-translucent", // Style for Apple status bar: "black-translucent", "default", "black". `string`
        display: "standalone", // Preferred display mode: "fullscreen", "standalone", "minimal-ui" or "browser". `string`
        orientation: "any", // Default orientation: "any", "natural", "portrait" or "landscape". `string`
        scope: "/", // set of URLs that the browser considers within your app
        start_url: "/", // Start URL when launching the application from a device. `string`
        version: "1.0", // Your application's version string. `string`
        logging: false, // Print logs to console? `boolean`
        pixel_art: false, // Keeps pixels "sharp" when scaling up, for pixel art.  Only supported in offline mode.
        loadManifestWithCredentials: false, // Browsers don't send cookies when fetching a manifest, enable this to fix that. `boolean`
        icons: {
            // Platform Options:
            // - offset - offset in percentage
            // - background:
            //   * false - use default
            //   * true - force use default, e.g. set background for Android icons
            //   * color - set background for the specified icons
            //   * mask - apply mask in order to create circle icon (applied by default for firefox). `boolean`
            //   * overlayGlow - apply glow effect after mask has been applied (applied by default for firefox). `boolean`
            //   * overlayShadow - apply drop shadow after mask has been applied .`boolean`
            //
            android: true, // Create Android homescreen icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
            appleIcon: true, // Create Apple touch icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
            appleStartup: true, // Create Apple startup images. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
            coast: true, // Create Opera Coast icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
            favicons: true, // Create regular favicons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
            firefox: true, // Create Firefox OS icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
            windows: true, // Create Windows 8 tile icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
            yandex: true, // Create Yandex browser icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
        },
    },
    callback = function(error, response) {
        if (error) {
            console.log(error.message); // Error description e.g. "An unknown error has occurred"
            return;
        }
        response.images.forEach(image => {
            fs.writeFile(
                path.resolve(__dirname, `../statics/assets/manifest/${image.name}`),
                image.contents,
                err => {
                    if (err) {
                        console.log(chalk.red(err));
                        throw err;
                    } else {
                        console.log(
                            chalk.green(`\u2713 ${image.name} written successfully`)
                        );
                    }
                }
            );
        });
        response.files.forEach(file => {
            fs.writeFile(
                path.resolve(__dirname, `../src/manifest/${file.name}`),
                file.contents,
                err => {
                    if (err) {
                        console.log(chalk.red(err));
                        throw err;
                    } else {
                        console.log(
                            chalk.green(`\u2713 ${file.name} written successfully`)
                        );
                    }
                }
            );
        });
        fs.writeFile(
            path.resolve(__dirname, `../src/manifest/html.json`),
            JSON.stringify(response.html, null, 2),
            err => {
                if (err) {
                    console.log(chalk.red(err));
                    throw err;
                } else {
                    console.log(chalk.green(`\u2713 html.json written successfully`));
                }
            }
        );
    };

favicons(source, configuration, callback);

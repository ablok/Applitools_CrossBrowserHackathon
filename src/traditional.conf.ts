import * as chai from "chai";
import sanitize from "sanitize-filename";
import { join } from "path";
import { removeSync, mkdirpSync } from "fs-extra";
import { seleniumInstallArgs, seleniumStartArgs, Config } from "./helpers/wdio";
const logFolder = "logs/traditional";
const screenshotFolder = join(logFolder, "screenshots");

const config: Config = {
    //
    // ====================
    // Runner Configuration
    // ====================
    runner: "local",
    path: "/wd/hub",
    port: 4444,
    //
    // ==================
    // Specify Test Files
    // ==================
    // Define which test specs should run. The pattern is relative to the directory
    // from which `wdio` was called. Notice that, if you are calling `wdio` from an
    // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
    // directory is where your package.json resides, so `wdio` will be called from there.
    //
    suites: {
        traditionalV1: ["./src/tests/TraditionalTestsV1/*.test.ts"],
        traditionalV2: ["./src/tests/TraditionalTestsV2/*.test.ts"]
    },
    //
    // ============
    // Capabilities
    // ============
    // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
    // time. Depending on the number of capabilities, WebdriverIO launches several test
    // sessions. Within your capabilities you can overwrite the spec and exclude options in
    // order to group specific specs to a specific capability.
    maxInstances: 5,
    capabilities: [
        {
            browserName: "chrome",
            "goog:chromeOptions": {
                args: ["--headless", "--window-size=1200,700"]
            }
        },
        {
            browserName: "chrome",
            "goog:chromeOptions": {
                args: ["--headless", "--window-size=768,700"]
            }
        },
        {
            browserName: "chrome",
            "goog:chromeOptions": {
                args: ["--headless", "--window-size=500,700"]
            }
        },
        {
            browserName: "firefox",
            "moz:firefoxOptions": {
                args: ["--headless", "--width=1200", "--height=700"]
            }
        },
        {
            browserName: "firefox",
            "moz:firefoxOptions": {
                args: ["--headless", "--width=768", "--height=700"]
            }
        },
        {
            browserName: "MicrosoftEdge",
            "ms:edgeOptions": {
                args: ["--headless", "--window-size=1200,700"]
            }
        },
        {
            browserName: "MicrosoftEdge",
            "ms:edgeOptions": {
                args: ["--headless", "--window-size=768,700"]
            }
        }
    ],
    //
    // ===================
    // Test Configurations
    // ===================
    // Define all options that are relevant for the WebdriverIO instance here
    logLevel: "silent",
    // outputDir: logFolder,
    bail: 0,
    baseUrl: `https://demo.applitools.com`,
    waitforTimeout: 3000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    framework: "mocha",
    reporters: ["spec"],
    services: ["selenium-standalone"],
    seleniumInstallArgs: seleniumInstallArgs,
    seleniumArgs: seleniumStartArgs,
    mochaOpts: {
        ui: "bdd",
        timeout: 300000
    },
    //
    // =====
    // Hooks
    // =====
    // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
    // it and to build services around it. You can either apply a single function or an array of
    // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
    // resolved to continue.
    onPrepare: function() {
        removeSync(logFolder);
        removeSync(`Traditional-${process.env.APP_VERSION}-TestResults.txt`);
        removeSync("./elements/actual/");
        removeSync("./elements/diff/");
        mkdirpSync(screenshotFolder);
        mkdirpSync("./elements/expected/");
        mkdirpSync("./elements/actual/");
        mkdirpSync("./elements/diff/");
    },
    before: function() {
        const screenSize = browser.requestedCapabilities["custom:screenSize"];
        browser.setWindowSize(screenSize.width, screenSize.height);
        chai.config.truncateThreshold = 0;
        chai.config.showDiff = false;
    },
    afterTest: function(test) {
        if (!test.passed) {
            browser.saveScreenshot(join(screenshotFolder, sanitize(`${test.fullTitle}.png`)));
        }
    }
};

export { config };

import * as uuid from "uuid";
import sanitize from "sanitize-filename";
import { join } from "path";
import { Eyes, VisualGridRunner } from "@applitools/eyes-webdriverio";
import {
    Configuration,
    BrowserType,
    DeviceName,
    ScreenOrientation,
    RectangleSize,
    MatchLevel
} from "@applitools/eyes-selenium";
import { removeSync, mkdirpSync } from "fs-extra";
import { seleniumInstallArgs, seleniumStartArgs } from "./helpers/wdio";

const viewportSize = { width: 800, height: 600 };
const logFolder = "logs/modern";
const screenshotFolder = join(logFolder, "screenshots");

const config: WebdriverIO.Config = {
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
        modernV1: ["./src/tests/ModernTestsV1/*.test.ts"],
        modernV2: ["./src/tests/ModernTestsV2/*.test.ts"]
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
                args: ["--headless"]
            }
        }
    ],
    //
    // ===================
    // Test Configurations
    // ===================
    // Define all options that are relevant for the WebdriverIO instance here
    logLevel: "info",
    outputDir: logFolder,
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
    onPrepare: async function() {
        removeSync(logFolder);
        removeSync(`Modern-${process.env.APP_VERSION}-TestResults.txt`);
        mkdirpSync(screenshotFolder);

        process.env.RUN_ID = uuid.v4();
    },
    before: function() {
        globalThis.eyes = new Eyes(new VisualGridRunner(10));

        const configuration = new Configuration();
        configuration
            .addBrowsers(
                { width: 1200, height: 700, name: BrowserType.CHROME },
                { width: 1200, height: 700, name: BrowserType.FIREFOX },
                { width: 1200, height: 700, name: BrowserType.EDGE_CHROMIUM },
                { width: 768, height: 700, name: BrowserType.CHROME },
                { width: 768, height: 700, name: BrowserType.FIREFOX },
                { width: 768, height: 700, name: BrowserType.EDGE_CHROMIUM }
            )
            .addDeviceEmulation(DeviceName.iPhone_X, ScreenOrientation.PORTRAIT)
            .setBatch({ name: "UFG Hackathon", id: process.env.RUN_ID })
            .setViewportSize(new RectangleSize(viewportSize.width, viewportSize.height))
            .setMatchLevel(MatchLevel.Strict)
            .setHideScrollbars(true);

        globalThis.eyes.setConfiguration(configuration);

        browser.setWindowSize(viewportSize.width, viewportSize.height);
    },
    afterTest: function(test) {
        if (!test.passed) {
            browser.saveScreenshot(join(screenshotFolder, sanitize(`${test.fullTitle}.png`)));
        }
    },
    after: function() {
        globalThis.eyes.abortIfNotClosed();
    }
};

export { config, viewportSize };

import { InstallOpts, StartOpts } from "selenium-standalone";
import { binPath as edgeDriverPath } from "@sitespeed.io/edgedriver";

export const seleniumInstallArgs: InstallOpts = {
    version: "3.141.59",
    baseURL: "https://selenium-release.storage.googleapis.com",
    drivers: {
        chrome: {
            version: "83.0.4103.39",
            arch: process.arch,
            baseURL: "https://chromedriver.storage.googleapis.com"
        },
        firefox: {
            version: "0.26.0",
            arch: process.arch,
            baseURL: "https://github.com/mozilla/geckodriver/releases/download"
        }
    }
};

export const seleniumStartArgs: StartOpts = {
    javaArgs: [`-Dwebdriver.edge.driver=${edgeDriverPath()}`],
    ...seleniumInstallArgs
};

export interface Config extends WebdriverIO.Config {
    capabilities?: (WebDriver.DesiredCapabilities & {
        "ms:edgeOptions"?: { args?: string[] };
    })[];
}

import { appendFileSync } from "fs-extra";
import { getDeviceType } from "./devices";
import { join } from "path";
import { CheckLocatorResult } from "./check";

export function reportResults(
    taskNumber: number,
    testName: string,
    checkLocatorResults: CheckLocatorResult[]
): boolean {
    const outputFile = join(process.cwd(), `Traditional-${process.env.APP_VERSION}-TestResults.txt`);
    const resolution = browser.getWindowSize();

    return !checkLocatorResults
        .map(checkLocatorResult => {
            const status: boolean[] = [];
            for (const locator in checkLocatorResult.expectedResult) {
                const hasDiff = checkLocatorResult.diffResult[locator].length !== 0;
                status.push(!hasDiff);
                appendFileSync(
                    outputFile,
                    `Task: ${taskNumber}, Test Name: ${testName}, Locator: ${locator}, Browser: ${
                        browser.capabilities.browserName
                    }, Viewport: ${resolution.width} x ${resolution.height}, Device: ${getDeviceType()}, Status: ${
                        hasDiff ? "Fail" : "Pass"
                    }\n`
                );
            }
            return !status.includes(false);
        })
        .includes(false);
}

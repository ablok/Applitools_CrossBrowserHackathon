import { LocationReturn, SizeReturn } from "@wdio/sync";
import sanitize from "sanitize-filename";
import { existsSync, readJSONSync, writeJSONSync } from "fs-extra";
import { rdiffResult, getDiff } from "recursive-diff";

interface ElementDetail {
    visibility: boolean;
    location: LocationReturn;
    size: SizeReturn;
    css: { [key: string]: string };
    text?: string;
    value?: string;
    image?: string;
}

interface LocatorResult {
    [locator: string]: ElementDetail[];
}

interface CheckFilePaths {
    actual: string;
    expected: string;
    diff: string;
}

export interface CheckLocatorResult {
    expectedResult: LocatorResult;
    actualResult: LocatorResult;
    diffResult: { [locator: string]: rdiffResult[] };
}

function initCheck(tag: string): CheckFilePaths {
    const windowSize = browser.getWindowSize();
    const fileName = `${sanitize(tag)}_${browser.capabilities.browserName}_${windowSize.width}x${
        windowSize.height
    }.json`;
    const expectedFilePath = `./elements/expected/${fileName}`;
    const actualFilePath = `./elements/actual/${fileName}`;
    const diffFilePath = `./elements/diff/${fileName}`;

    return { actual: actualFilePath, expected: expectedFilePath, diff: diffFilePath };
}

function finishCheck(filePaths: CheckFilePaths, checkLocatorResults: CheckLocatorResult[]): void {
    writeJSONSync(
        filePaths.expected,
        checkLocatorResults.map(checkLocatorResult => checkLocatorResult.expectedResult),
        { spaces: 2 }
    );
    writeJSONSync(
        filePaths.actual,
        checkLocatorResults.map(checkLocatorResult => checkLocatorResult.actualResult),
        { spaces: 2 }
    );
    const diffResults = checkLocatorResults
        .map(checkLocatorResults => checkLocatorResults.diffResult)
        .filter(diffResult => Object.keys(diffResult).filter(key => diffResult[key].length).length);

    if (diffResults.length > 0) {
        writeJSONSync(filePaths.diff, diffResults, { spaces: 2 });
    }
}

export function getElementDetails(locator: string): ElementDetail[] {
    const details = $$(locator);
    if (details.length === 0) {
        throw new Error(`No results found for locator '${locator}', are you sure it's correct?`);
    }

    return details.map(element => {
        const css = {};

        // Currently checking the following CSS properties. Adding more is ofc always possible.
        ["display", "backgroundColor", "backgroundImage", "textDecoration", "color", "font"].forEach(key => {
            const value = browser.execute(
                (browserElement, browserKey) => window.getComputedStyle(browserElement)[browserKey],
                element,
                key
            );
            css[key] = value;
        });

        // Set of element details that are used for comparisons
        const details: ElementDetail = {
            visibility: element.isDisplayed(),
            location: element.getLocation(),
            size: element.getSize(),
            css,
            text:
                browser.execute(browserElement => {
                    if (browserElement.childNodes[0] && browserElement.childNodes[0].nodeValue) {
                        return browserElement.childNodes[0].nodeValue.trim();
                    }
                }, element) || undefined,
            value: browser.execute(browserElement => browserElement.value, element) || undefined,
            image: element.getAttribute("src") || undefined
        };
        return details;
    });
}

export function checkLocators(locators: string[], tag: string): CheckLocatorResult[] {
    const filePaths = initCheck(tag);

    let expectedResults: LocatorResult[] = [];
    if (existsSync(filePaths.expected)) {
        expectedResults = readJSONSync(filePaths.expected);
    }

    const checkLocatorResults = locators.map(locator => {
        const actualResult: LocatorResult = {};
        actualResult[locator] = getElementDetails(locator);

        let expectedResult = expectedResults.find(expectedResult => expectedResult[locator]);
        if (!expectedResult) {
            console.log(`No expected result found for ${locator}. Saving actual...`);
            expectedResult = actualResult;
        }

        // Transformation in expected results here since Y coordinate
        // in V2 was increased by 1 for all non 0,0 location values.
        const tranformedResult = JSON.parse(JSON.stringify(expectedResult));
        if (process.env.APP_VERSION === "V2") {
            tranformedResult[locator].forEach(element => {
                if (element.location.x > 0 || element.location.y) {
                    element.location.y = element.location.y + 1;
                }
            });
        }

        const diff = getDiff(tranformedResult[locator], actualResult[locator], true);

        return { expectedResult, actualResult, diffResult: { [locator]: diff } };
    });

    finishCheck(filePaths, checkLocatorResults);

    return checkLocatorResults;
}

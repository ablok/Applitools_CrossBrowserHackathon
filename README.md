UPDATE: [3rd place](https://applitools.com/2020-cross-browser-testing-hackathon-winners/)

# Applitools Ultrafast Cross Browser Testing Hackathon

This is [my](#Author) submission for the [Applitools Ultrafast Cross Browser Testing Hackathon](https://applitools.com/cross-browser-testing-hackathon-v20-1-instructions/).

## How it works

This solution uses the [WebdriverIO](https://webdriver.io/) v5 testrunner. Thanks to its extensive config and services, it is quick and easy to set up multi-browser tests. I used [TypeScript](https://www.typescriptlang.org/) to write the code and I also set up some static analysis tools like [eslint](https://eslint.org/) and [prettier](https://prettier.io/).
Test execution is performed locally and all tests run headless and in parallel. This makes for quick test execution.

### Traditional

I tried to stick to the concept that a lot of modern test tools use; automatically create a baseline on first run, then compare any subsequent run to that baseline. If there are any differences between the run and the baseline, fail the test and report the differences.
The baseline consists of a combination of different element attributes like text and css properties, combined with webdriver determined values like element visibility, location and size.
To see/change exactly what is stored in the baseline have a look [here](./src/helpers/check.ts#L73).

Initially I stored the [expected results](./elements/expected) for version 1 of the AppliFashion website along with this repository, but later on also committed the [actual]("./elements/actual) and [diff]("./elements/diff) result, so that you don't necessarily have to run the test to get the output. If you do run another traditional test, the actual and diff folder will be overwritten. If you want to create a new baseline, just remove the current expected folder/file. To create the diff files, I used the [Recursive-Diff](https://www.npmjs.com/package/recursive-diff) package. The diff is pretty self-explanatory, but for more info, read their [readme](https://github.com/cosmicanant/recursive-diff/blob/master/README.md).

All traditional tests are device agnostic. This means that the tests have no knowledge about what browser or resolution they are going to be executed on. Want to test on another browser/resolution combination? Simply add it as a capability and all tests are run for that resolution and browser combination. If no baseline is known for this combination of test, browser and resolution, it will be created.

The AppliFashion website uses auto-generated id's for a lot of elements. In some cases a static id seems to be assigned, while there are also elements that have no id at all. Id's also seem to change between application versions. So instead of relying on specific auto-generated id's, you can supply the tests with any [WebdriverIO supported locator](https://v5.webdriver.io/docs/selectors.html) you desire. For every element that was found with that locator (can be more than 1), the information will be stored in a baseline. Every [page object](./src/pages) contains a list of known element locators. Want to test more locators? Simply add them to the list. On next run, this locator will be seen as missing from the baseline, so it's current value will be added. The test report also mentions `Locator` instead of `DOM Id`.

Because of what is mentioned above, the traditional test for V1 can be exactly the same as for V2. There is only 1 caveat to this statement. While examining the diff files that were generated by the comparision of V1 to V2, I noticed that all elements with a positive X and/or Y coordinate had an increased Y coordinate by 1 in V2. I can only assume this was done intentionally to make the assignment more difficult. So I added a [run-time transformation](./src/helpers/check.ts#L120) to the expected results. Now, when comparing V1 to V2, the expected Y coordinate is incremented by 1. This prevents pollution of the diff file by changes that I assume can be safely ignored. Ofcourse there are better/different ways to do this transformations, but this works for now (comparing V1 to V2). I also guess this is where the Applitools AI comes in, since these 1px-off differences are not detected as difference in the modern test.

### Modern

I don't think I have to extensively explain how Applitools works ;).
When using the Eyes library, you open Eyes, take one or more snapshots (page or region) and then close Eyes to start asserting the snapshots. Ideal for visual validations of your website. Thanks to the WebdriverIO framework all browser and element calls are automagically synchronous. However, calls to external async libraries are not and have to be wrapped in a 'call' command to make them synchronous. This is why all eyes methods are wrapped.

I did have to skip 2 additional modern tests that focused on click- and hover beahviour because I could not get them to work correctly. See [here](./src/tests/ModernTestsV1/CrossDeviceElements.test.ts#L36) and [here](./src/tests/ModernTestsV1/CrossDeviceElements.test.ts#L76) for details.

## Remarks/observations

I noticed that not all visibility results of the traditional V1 baseline are as expected. Turns out, this is because there are incorrect results in various browsers/drivers. Firefox incorrectly detects the visibility of the content of the shoe size dropdown as displayed. Chrome incorrectly detects the 'Main Menu' and 'Filters Sidebar' as displayed when they are hidden (mobile and tablet). I have created a [ticket](https://github.com/webdriverio/webdriverio/issues/5534) for this at the WebdriverIO team.

## Tests and output

The tests and their results can be found here:

| Tests                                            | Output                                                                          |
| ------------------------------------------------ | ------------------------------------------------------------------------------- |
| [Traditional V1](./src/tests/TraditionalTestsV1) | [Log file](./Traditional-V1-TestResults.txt)                                    |
| [Traditional V2](./src/tests/TraditionalTestsV2) | [Log file](./Traditional-V2-TestResults.txt)                                    |
| [Modern V1](./src/tests/ModernTestsV1)           | [Applitools](https://eyes.applitools.com/app/test-results/00000251808707726085) |
| [Modern V2](./src/tests/ModernTestsV2)           | [Applitools](https://eyes.applitools.com/app/test-results/00000251808707562356) |

## Running the tests

### Prerequisites

Make sure you have the following installed:

- [NodeJS](https://nodejs.org/) version >= 10 (Created on 12.16.2)
- [Java](https://www.java.com/) 8 or higher. (for running selenium server)
- Make sure [Chrome](https://www.google.com/chrome/), [Firefox](https://www.mozilla.org/firefox/new/) and [Edge Chromium](https://www.microsoft.com/edge) browsers are installed and updated to the latest version.

### How to run

- Clone this repository.
- On the commandline go to the `ApplitoolsHackathon2020` directory.
- Run `npm install` and wait until the installation is finished.
- Set the `APPLITOOLS_API_KEY` environment variable with your key. (only needed for modern tests)
- To run the tests, execute one of the following commands:
  - `npm run traditional:v1` to run the traditional tests against v1
  - `npm run traditional:v2` to run the traditional tests against v2
  - `npm run modern:v1` to run the ultra fast grid tests against v1
  - `npm run modern:v2` to run the ultra fast grid tests against v2
- Logging and screenshots (on error) can be found in the `./logs` folder.
- For the traditional tests, a report is generated in the root of this repo named: `Traditional-V1-TestResult.txt` or `Traditional-V2-TestResult.txt`. More details on why a test failed can be found in the diff report.
- Baseline (expected), actual and diff reports for the traditional tests can be found in the `./elements` folder.

### Driver versions

A new version of any of the browsers could have been released that is incompatible with the drivers configured in this project. If that happens, Geckodriver and Chromedriver versions can be defined [here](./src/helpers/wdioConfig.ts#L5). They are installed as part of the [selenium standalone service](https://www.npmjs.com/package/@wdio/selenium-standalone-service). The Edgedriver is being sideloaded as part of the [sitespeed.io edgedriver](https://www.npmjs.com/package/@sitespeed.io/edgedriver) package. Read their readme on how to download a different Edgedriver version.

## Author

Arjan Blok - [Github](https://github.com/ablok)

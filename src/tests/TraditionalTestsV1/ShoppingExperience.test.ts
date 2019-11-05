import { assert } from "chai";
import { getDeviceType } from "../../helpers/devices";
import { reportResults } from "../../helpers/reporter";
import { checkLocators } from "../../helpers/check";
import { AppliFashion, AppliFashionLocators } from "../../pages/AppliFashion";

describe(`Task 2:`, () => {
    it(`Shopping Experience Test`, function() {
        const appliFashion = AppliFashion.open();

        if (getDeviceType() !== "Laptop") {
            appliFashion.clickFilterButton();
        }
        appliFashion.filterOn("colors", "Black");

        const checkLocatorResults = checkLocators([AppliFashionLocators.GRID_ITEMS], this.test!.fullTitle());
        assert.isTrue(
            reportResults(2, this.test!.title, checkLocatorResults),
            "Differences found, check diff report in ./elements/diff"
        );
    });
});

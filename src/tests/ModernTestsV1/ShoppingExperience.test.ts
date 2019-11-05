import { Target } from "@applitools/eyes-webdriverio";
import { AppliFashion, AppliFashionLocators } from "../../pages/AppliFashion";

describe("Task 2:", () => {
    it("Shopping Experience Test", function() {
        const appliFashion = AppliFashion.open();
        appliFashion.clickFilterButton();
        appliFashion.filterOn("colors", "Black");
        const gridElement = $(AppliFashionLocators.GRID);

        browser.call(() => globalThis.eyes.open(browser, "AppliFashion", this.test!.fullTitle()));
        browser.call(() => globalThis.eyes.check("Product Grid", Target.region(gridElement)));
        browser.call(() => globalThis.eyes.close());
    });
});

import { Target } from "@applitools/eyes-webdriverio";
import { ProductDetails, ProductDetailsLocators } from "../../pages/ProductDetails";

describe("Task 3:", function() {
    let productDetails: ProductDetails;

    beforeEach(() => {
        productDetails = ProductDetails.open(1);
    });

    it("Product Details Test", function() {
        browser.call(() => globalThis.eyes.open(browser, "AppliFashion", this.test!.fullTitle()));
        browser.call(() => globalThis.eyes.check(this.test!.title, Target.window().fully()));
        browser.call(() => globalThis.eyes.close());
    });

    it("Open Size Options", function() {
        productDetails.clickCurrentSize();
        const listElement = $(ProductDetailsLocators.SIZE_SELECT_CONTENT);

        browser.call(() => globalThis.eyes.open(browser, "AppliFashion", this.test!.fullTitle()));
        browser.call(() => globalThis.eyes.check(this.test!.title, Target.region(listElement)));
        browser.call(() => globalThis.eyes.close());
    });

    it("Change Quantity", function() {
        browser.call(() => globalThis.eyes.open(browser, "AppliFashion", this.test!.fullTitle()));

        productDetails.clickIncreaseQuantity();
        let quantityElement = $(ProductDetailsLocators.QUANTITY);
        browser.call(() => globalThis.eyes.check(`Clicking quantity +button`, Target.region(quantityElement)));

        productDetails.clickDecreaseQuantity();
        quantityElement = $(ProductDetailsLocators.QUANTITY);
        browser.call(() => globalThis.eyes.check(`Clicking quantity -button`, Target.region(quantityElement)));

        browser.call(() => globalThis.eyes.close());
    });
});

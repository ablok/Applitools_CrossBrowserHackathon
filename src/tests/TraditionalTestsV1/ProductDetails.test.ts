import { assert } from "chai";
import { reportResults } from "../../helpers/reporter";
import { checkLocators } from "../../helpers/check";
import { ProductDetails, ProductDetailsLocators } from "../../pages/ProductDetails";
import { HeaderLocators, FooterLocators } from "../../pages/BasePage";

describe(`Task 3:`, () => {
    let productDetails: ProductDetails;

    beforeEach(() => {
        productDetails = ProductDetails.open(1);
    });

    it(`Product Details Test`, function() {
        const locators: string[] = [];
        locators.push(...Object.keys(HeaderLocators).map(key => HeaderLocators[key]));
        locators.push(...Object.keys(ProductDetailsLocators).map(key => ProductDetailsLocators[key]));
        locators.push(...Object.keys(FooterLocators).map(key => FooterLocators[key]));

        const checkLocatorResults = checkLocators(locators, this.test!.fullTitle());
        assert.isTrue(
            reportResults(3, this.test!.title, checkLocatorResults),
            "Differences found, check diff report in ./elements/diff"
        );
    });

    it("Open Size Options", function() {
        productDetails.clickCurrentSize();

        const checkLocatorResults = checkLocators([ProductDetailsLocators.SIZE_SELECT_ITEMS], this.test!.fullTitle());
        assert.isTrue(
            reportResults(3, this.test!.title, checkLocatorResults),
            "Differences found, check diff report in ./elements/diff"
        );
    });

    it("Change Quantity", function() {
        const locators = ["#quantity_1"];

        productDetails.clickIncreaseQuantity();
        let checkLocatorResults = checkLocators(locators, `${this.test!.fullTitle()} +button`);
        assert.isTrue(
            reportResults(3, `${this.test!.title} +button`, checkLocatorResults),
            "Differences found, check diff report in ./elements/diff"
        );

        productDetails.clickDecreaseQuantity();
        checkLocatorResults = checkLocators(locators, `${this.test!.fullTitle()} -button`);
        assert.isTrue(
            reportResults(3, `${this.test!.title} -button`, checkLocatorResults),
            "Differences found, check diff report in ./elements/diff"
        );
    });
});

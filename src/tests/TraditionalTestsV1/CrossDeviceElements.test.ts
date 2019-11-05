import { assert } from "chai";
import { DeviceType, getDeviceType } from "../../helpers/devices";
import { reportResults } from "../../helpers/reporter";
import { checkLocators } from "../../helpers/check";
import { AppliFashion, AppliFashionLocators } from "../../pages/AppliFashion";
import { HeaderLocators, FooterLocators } from "../../pages/BasePage";

describe(`Task 1:`, () => {
    let appliFashion: AppliFashion;
    let deviceType: DeviceType;

    before(() => {
        deviceType = getDeviceType();
    });

    beforeEach(() => {
        appliFashion = AppliFashion.open();
    });

    it(`Cross-Device Elements Test`, function() {
        const locators: string[] = [];
        locators.push(...Object.keys(HeaderLocators).map(key => HeaderLocators[key]));
        locators.push(...Object.keys(AppliFashionLocators).map(key => AppliFashionLocators[key]));
        locators.push(...Object.keys(FooterLocators).map(key => FooterLocators[key]));

        const checkLocatorResults = checkLocators(locators, this.test!.fullTitle());
        assert.isTrue(
            reportResults(1, this.test!.title, checkLocatorResults),
            "Differences found, check diff report in ./elements/diff"
        );
    });

    it("Open Main Menu", function() {
        if (deviceType !== "Laptop") {
            appliFashion.clickMainMenuButton();
        }

        const checkLocatorResults = checkLocators([HeaderLocators.MAIN_MENU], this.test!.fullTitle());
        assert.isTrue(
            reportResults(1, this.test!.title, checkLocatorResults),
            "Differences found, check diff report in ./elements/diff"
        );
    });

    it("Open Filters Sidebar", function() {
        if (deviceType !== "Laptop") {
            appliFashion.clickFilterButton();
        }

        const checkLocatorResults = checkLocators([AppliFashionLocators.FILTERS_SIDEBAR], this.test!.fullTitle());
        assert.isTrue(
            reportResults(1, this.test!.title, checkLocatorResults),
            "Differences found, check diff report in ./elements/diff"
        );
    });

    it("Hover grid item", function() {
        appliFashion.hoverGridItem(0);

        const checkLocatorResults = checkLocators(
            [
                AppliFashionLocators.GRID_ITEMS,
                AppliFashionLocators.GRID_ITEMS_CART,
                AppliFashionLocators.GRID_ITEMS_COMPARE,
                AppliFashionLocators.GRID_ITEMS_WISH_LIST,
                AppliFashionLocators.GRID_ITEMS_IMAGE
            ],
            this.test!.fullTitle()
        );
        assert.isTrue(
            reportResults(1, this.test!.title, checkLocatorResults),
            "Differences found, check diff report in ./elements/diff"
        );
    });

    it("Open Footer Categories", function() {
        appliFashion.clickFooterCategory("Quick Links");
        appliFashion.clickFooterCategory("Contacts");
        appliFashion.clickFooterCategory("Keep in touch");

        const checkLocatorResults = checkLocators(
            [
                FooterLocators.CONTACTS_BUTTON,
                FooterLocators.CONTACTS_CONTENT,
                FooterLocators.KEEP_IN_TOUCH_BUTTON,
                FooterLocators.KEEP_IN_TOUCH_CONTENT,
                FooterLocators.QUICK_LINKS_BUTTON,
                FooterLocators.QUICK_LINKS_CONTENT
            ],
            this.test!.fullTitle()
        );
        assert.isTrue(
            reportResults(1, this.test!.title, checkLocatorResults),
            "Differences found, check diff report in ./elements/diff"
        );
    });
});

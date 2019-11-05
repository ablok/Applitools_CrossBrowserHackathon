import { Target, RectangleSize } from "@applitools/eyes-webdriverio";
import { AppliFashion, AppliFashionLocators } from "../../pages/AppliFashion";
import { HeaderLocators } from "../../pages/BasePage";

describe("Task 1:", function() {
    let appliFashion: AppliFashion;

    beforeEach(() => {
        appliFashion = AppliFashion.open();
    });

    it("Cross-Device Elements Test", function() {
        browser.call(() => globalThis.eyes.open(browser, "AppliFashion", this.test!.fullTitle()));
        browser.call(() => globalThis.eyes.check(this.test!.title, Target.window().fully()));
        browser.call(() => globalThis.eyes.close());
    });

    it("Open Main Menu", function() {
        appliFashion.clickMainMenuButton();
        const menuElement = $(HeaderLocators.MAIN_MENU);

        browser.call(() => globalThis.eyes.open(browser, "AppliFashion", this.test!.fullTitle()));
        browser.call(() => globalThis.eyes.check(this.test!.title, Target.region(menuElement)));
        browser.call(() => globalThis.eyes.close());
    });

    it("Open Filters Sidebar", function() {
        appliFashion.clickFilterButton();
        const filterElement = $(AppliFashionLocators.FILTERS_SIDEBAR);

        browser.call(() => globalThis.eyes.open(browser, "AppliFashion", this.test!.fullTitle()));
        browser.call(() => globalThis.eyes.check(this.test!.title, Target.region(filterElement)));
        browser.call(() => globalThis.eyes.close());
    });

    /**
     * Clicking on the H3 elements of the footer in the default (800x600) viewport does not
     * also change the visibility of its content. For example: If you click the 'Contacts' H3 element
     * after initial load on a desktop or laptop viewport and then change to a mobile viewport,
     * the '- button' will be shown for the 'Contacts' menu, but no contents will be displayed.
     * Open/close state became inverted.
     *
     * I tried to "record" this test in a mobile viewport. This shows the content correctly,
     * however in V2, (where the 'Quick Links' content is incorrectly displayed) the 'Quick Links' content
     * is now also hidden when rendered on tablet or laptop view. This is behaviour that I can not
     * reproduce manually. Conclusion: there is device specific behavior that does not transfer well to
     * other devices.
     *
     * Potential solutions to make this test work:
     * 1. Record and replay on the device specific resolutions only.
     *    See the 'The Viewport' section here: https://applitools.com/docs/topics/sdk/vg-configuration.html
     * 2. Change the application to have device-agnostic behaviour.
     *
     * For now, I decided to skip this test.
     */
    it.skip("Open Footer Categories", function() {
        browser.call(() =>
            globalThis.eyes.open(
                browser,
                "AppliFashion",
                this.test!.fullTitle(),
                new RectangleSize({ width: 500, height: 700 })
            )
        );

        appliFashion
            .clickFooterCategory("Quick Links")
            .clickFooterCategory("Contacts")
            .clickFooterCategory("Keep in touch");
        const footerElement = $("body footer");

        browser.call(() => globalThis.eyes.check("Opened Footers Categories", Target.region(footerElement)));
        browser.call(() => globalThis.eyes.close());
    });

    /**
     * Unfortunately, it looks like hover state is not transferred to the different renderings of the UFG.
     * I looked into using the Eyes SDK beforeRenderScreenshotHook method to trigger the hover state with JavaScript,
     * but the on-hover behaviour seems to be implemented with the help of css pseudo-classes.
     * AFAIK there is no decent way to trigger it via JavaScript.
     * This test is therefore skipped.
     */
    it.skip("Hover Grid Item", function() {
        const gridItemElement = appliFashion.hoverGridItem(0);
        browser.call(() => globalThis.eyes.open(browser, "AppliFashion", this.test!.fullTitle()));
        browser.call(() => globalThis.eyes.check(this.test!.title, Target.region(gridItemElement)));
        browser.call(() => globalThis.eyes.close());
    });
});

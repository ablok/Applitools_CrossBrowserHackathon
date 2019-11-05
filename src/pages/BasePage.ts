export enum HeaderLocators {
    LOGO = "#logo img",
    MAIN_MENU = ".main-menu",
    MAIN_MENU_BUTTON = "//div[@class='hamburger-box']/ancestor::a",
    SEARCH_BAR = ".custom-search-input",
    MOBILE_SEARCH = ".btn_search_mob",
    PROFILE = ".access_link",
    WISH_LIST = ".wishlist",
    SHOPPING_CART = ".cart_bt",
    SHOPPING_CART_COUNTER = ".cart_bt strong"
}

export enum FooterLocators {
    QUICK_LINKS_BUTTON = "//h3[text()='Quick Links']",
    QUICK_LINKS_CONTENT = "#collapse_1",
    CONTACTS_BUTTON = "//h3[text()='Contacts']",
    CONTACTS_CONTENT = "#collapse_3",
    KEEP_IN_TOUCH_BUTTON = "//h3[text()='Keep in touch']",
    KEEP_IN_TOUCH_CONTENT = "#collapse_4"
}

export abstract class BasePage {
    clickMainMenuButton(): this {
        $(HeaderLocators.MAIN_MENU_BUTTON).click();
        return this;
    }

    clickFooterCategory(name: "Quick Links" | "Contacts" | "Keep in touch"): this {
        switch (name) {
            case "Quick Links":
                $(FooterLocators.QUICK_LINKS_BUTTON).click();
            case "Contacts":
                $(FooterLocators.CONTACTS_BUTTON).click();
            case "Keep in touch":
                $(FooterLocators.KEEP_IN_TOUCH_BUTTON).click();
        }
        return this;
    }
}

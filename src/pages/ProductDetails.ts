import { removeAnimations } from "../helpers/devices";
import { BasePage } from "./BasePage";

export enum ProductDetailsLocators {
    SHOE_IMAGE = "#shoe_img",
    RATING_STARS = ".prod_info .icon-star",
    RATING_TEXT = ".prod_info em",
    SKU = ".prod_info p small",
    DESCRIPTION = ".prod_info p",
    QUANTITY = "#quantity_1",
    SIZE_SELECT_CONTENT = ".custom-select-form .list",
    SIZE_SELECT_ITEMS = ".custom-select-form li",
    ADD_TO_CART_BUTTON = ".btn_add_to_cart a",
    NEW_PRICE = "#new_price",
    OLD_PRICE = "#old_price",
    DISCOUNT = "#discount"
}

export class ProductDetails extends BasePage {
    static open(productId: number): ProductDetails {
        browser.url(`/gridHackathonProductDetails${process.env.APP_VERSION}.html?id=${productId}`);
        removeAnimations();
        return new ProductDetails();
    }

    clickCurrentSize(): ProductDetails {
        $("//div[@class='custom-select-form']/parent::div").click();
        return this;
    }

    clickIncreaseQuantity(): ProductDetails {
        $("//div[@class='inc button_inc' and not(@id)]").click();
        return this;
    }

    clickDecreaseQuantity(): ProductDetails {
        $("//div[@class='dec button_inc' and not(@id)]").click();
        return this;
    }
}

import { removeAnimations } from "../helpers/devices";
import { BasePage } from "./BasePage";

export enum AppliFashionLocators {
    TOP_BANNER = ".top_banner",
    FILTERS_SIDEBAR = "#filter_col",
    SORT_SELECT = ".sort_select",
    FILTERS_BUTTON_LABEL = ".open_filters span",
    FILTERS_BUTTON_ICON = "#ti-filter",
    VIEW_AS_GRID_BUTTON = ".ti-view-grid",
    VIEW_AS_LIST_BUTTON = ".ti-view-list",
    GRID = "#product_grid",
    GRID_ITEMS = ".grid_item",
    GRID_ITEMS_IMAGE = ".grid_item img",
    GRID_ITEMS_WISH_LIST = ".grid_item .ti-heart",
    GRID_ITEMS_COMPARE = ".grid_item .ti-control-shuffle",
    GRID_ITEMS_CART = ".grid_item .ti-shopping-cart"
}

export class AppliFashion extends BasePage {
    static open(): AppliFashion {
        browser.url(`/gridHackathon${process.env.APP_VERSION}.html`);
        removeAnimations();
        return new AppliFashion();
    }

    filterOn(category: "type", type: "Soccer" | "Basketball" | "Running" | "Training");
    filterOn(category: "colors", color: "Black" | "White" | "Blue" | "Green" | "Yellow");
    filterOn(category: "brands", color: "Adibas" | "Mykey" | "Bans" | "Over Armour" | "ImBalance");
    filterOn(category: "price", color: "$0 - $50" | "$50 - $100" | "$100 - $150" | "$150 - $200");
    filterOn(category: string, value: string): AppliFashion {
        const checkbox = $(`//input[@id='${category}__${value.replace(" ", "")}']/following-sibling::span`);
        checkbox.click();
        $("#filterBtn").click();
        return this;
    }

    clickFilterButton(): AppliFashion {
        $(AppliFashionLocators.FILTERS_BUTTON_ICON).click();
        return this;
    }

    hoverGridItem(index: number): WebdriverIO.Element {
        const elements = $$(AppliFashionLocators.GRID_ITEMS);
        if (index >= elements.length) {
            throw new Error("No matching grid item found for the index you supplied");
        }
        elements[index].scrollIntoView();
        elements[index].moveTo();
        return elements[index];
    }
}

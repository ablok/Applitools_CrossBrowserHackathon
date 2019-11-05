export type DeviceType = "Tablet" | "Laptop" | "Mobile";

export function getDeviceType(): DeviceType {
    const size = browser.getWindowSize();
    if (size) {
        if (size.height < 500) {
            throw new Error("Device does not match minimum required height of 500px.");
        }
        if (size.width < 375) {
            throw new Error("Device does not match minium required width of 375px.");
        }
        if (size.width < 768) {
            return "Mobile";
        }
        if (size.width < 992) {
            return "Tablet";
        }
        return "Laptop";
    } else {
        throw new Error("Could not determine window size. Was the decice already instantiated?");
    }
}

/**
 * Removes all CSS animations so that you do not
 * have to wait for animations after clicking an element.
 */
export function removeAnimations(): void {
    browser.execute(() => {
        const css = `* {
            -o-transition-property: none !important;
            -moz-transition-property: none !important;
            -ms-transition-property: none !important;
            -webkit-transition-property: none !important;
            transition-property: none !important;
            -webkit-animation: none !important;
            -moz-animation: none !important;
            -o-animation: none !important;
            -ms-animation: none !important;
            animation: none !important;
        }`;
        const style = document.createElement("style");
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    });
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const findCookieAcceptButton = async (page) => {
    const buttons = await page.$$("button");
    for (const button of buttons) {
        const buttonText = await (await button.getProperty("textContent")).jsonValue();
        if (buttonText && constants_1.cookiesButtonValue.includes(buttonText.trim())) {
            await button.evaluate((b) => b.scrollIntoView());
            await page.evaluate((b) => b.click(), button);
            break;
        }
    }
};
exports.default = findCookieAcceptButton;
//# sourceMappingURL=acceptAllCookies.js.map
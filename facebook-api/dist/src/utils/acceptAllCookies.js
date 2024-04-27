"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const findCookieAcceptButton = (page) => __awaiter(void 0, void 0, void 0, function* () {
    const buttons = yield page.$$('button');
    for (const button of buttons) {
        const buttonText = yield (yield button.getProperty('textContent')).jsonValue();
        if (buttonText && constants_1.cookiesButtonValue.includes(buttonText.trim())) {
            yield button.evaluate((b) => b.scrollIntoView());
            yield page.evaluate((b) => b.click(), button);
            break;
        }
    }
});
exports.default = findCookieAcceptButton;
//# sourceMappingURL=acceptAllCookies.js.map
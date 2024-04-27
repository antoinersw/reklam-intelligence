"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cleanJsonString = (jsonString) => {
    console.log('TEST => ', jsonString);
    const cleanedString = jsonString.replace(/`/g, '').replace(/json/g, '');
    return JSON.parse(cleanedString);
};
exports.default = cleanJsonString;
//# sourceMappingURL=cleanJson.js.map